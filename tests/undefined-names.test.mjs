// Fails when a page's scripts reference a name nothing on that page defines:
// the bug that once took down the market specialist screens. ESLint's no-undef
// is run per page, with every name the page's script chain declares treated as
// defined, so it covers error handlers and rarely used branches no runtime test
// reaches. Needs ESLint in .tools/ (see TOOLS_INSTALL).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const TOOLS_INSTALL = 'npm install --prefix .tools --no-audit --no-fund eslint@9.39.5 globals@17.13.0 linkedom@0.18.13';

// ── per-repo config ─────────────────────────────────────────────────────────
// Globals that libraries loaded from a CDN put on window.
const CDN_GLOBALS = ["am5", "am5map", "am5themes_Animated", "am5geodata_worldLow"];
// Existing findings, "<name>@<file>", each with the reason it is tolerated.
// A new undefined name fails; so does an entry here that no longer occurs.
const KNOWN = {
  "populateDigitalLearningsSection@templates/static/js/scripts.js": "LIVE BUG: never written; the Digital Learning tab throws. Needs an owner decision on what it should render",
  "populateAllSection@templates/static/js/scripts.js": "LIVE BUG: never written; the All tab throws. Needs an owner decision on what it should render",
};
// ────────────────────────────────────────────────────────────────────────────

const SKIP_DIR = /(^|[\\/])(node_modules|\.git|\.tools|backups|old|reference|tests|vendor)([\\/]|$)/;
const LIBRARY = /(\.min\.js|supabase-js[^/\\]*\.js)$/;

function loadEslint() {
  const req = createRequire(join(REPO, '.tools', 'resolve.js'));
  try { return { ESLint: req('eslint').ESLint, globals: req('globals'), espree: req('espree') }; }
  catch { return null; }
}

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (SKIP_DIR.test(relative(REPO, p))) continue;
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}

function declaredNames(src, espree) {
  const names = new Set();
  const add = (p) => {
    if (!p) return;
    if (p.type === 'Identifier') names.add(p.name);
    else if (p.type === 'ObjectPattern') p.properties.forEach(q => add(q.value || q.argument));
    else if (p.type === 'ArrayPattern') p.elements.forEach(add);
    else if (p.type === 'AssignmentPattern') add(p.left);
    else if (p.type === 'RestElement') add(p.argument);
  };
  try {
    for (const n of espree.parse(src, { ecmaVersion: 'latest', sourceType: 'script' }).body) {
      if ((n.type === 'FunctionDeclaration' || n.type === 'ClassDeclaration') && n.id) names.add(n.id.name);
      if (n.type === 'VariableDeclaration') n.declarations.forEach(d => add(d.id));
    }
  } catch { /* the lint pass reports parse errors */ }
  // window.X = …, including through an IIFE parameter such as global.X = …
  for (const m of src.matchAll(/\b(?:window|globalThis|self|global|root)\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)) names.add(m[1]);
  // Names the code itself checks for are optional by design (feature scripts loaded later).
  for (const m of src.matchAll(/typeof\s+([A-Za-z_$][\w$]*)\s*[!=]==?\s*['"](?:function|undefined|object)['"]/g)) names.add(m[1]);
  return names;
}

function pagesAndChains() {
  const pages = [];
  for (const page of walk(REPO).filter(f => f.endsWith('.html'))) {
    const html = readFileSync(page, 'utf8');
    const srcs = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)].map(m => m[1].split(/[?#]/)[0]).filter(s => !/^(https?:)?\/\//i.test(s));
    const inline = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
    const files = srcs.map(s => ({ src: s, file: resolve(dirname(page), s.replace(/^\//, '')) }));
    pages.push({ page, files, inline });
  }
  return pages;
}

async function scan(tools) {
  const { ESLint, globals, espree } = tools;
  const findings = new Map();
  const add = (name, file, line, page) => {
    const key = `${name}@${relative(REPO, file).split(sep).join('/')}`;
    if (!findings.has(key)) findings.set(key, { key, lines: new Set(), pages: new Set() });
    findings.get(key).lines.add(line);
    findings.get(key).pages.add(relative(REPO, page).split(sep).join('/'));
  };
  let linted = 0;

  for (const { page, files, inline } of pagesAndChains()) {
    for (const f of files) if (!existsSync(f.file)) add(`<missing script ${f.src}>`, page, 0, page);
    const chain = files.map(f => f.file).filter(f => existsSync(f) && /\.m?js$/.test(f));
    if (!chain.length) continue;

    const known = new Set(CDN_GLOBALS);
    for (const f of chain) declaredNames(readFileSync(f, 'utf8'), espree).forEach(n => known.add(n));
    for (const s of inline) declaredNames(s, espree).forEach(n => known.add(n));
    const pageGlobals = Object.fromEntries([...known].map(n => [n, 'writable']));

    for (const f of chain.filter(f => !LIBRARY.test(f))) {
      const eslint = new ESLint({ cwd: REPO, overrideConfigFile: true, overrideConfig: [{
        languageOptions: { ecmaVersion: 'latest', sourceType: f.endsWith('.mjs') ? 'module' : 'script',
          globals: { ...globals.browser, ...globals.es2021, ...pageGlobals } },
        rules: { 'no-undef': 'error' },
      }] });
      const [res] = await eslint.lintText(readFileSync(f, 'utf8'), { filePath: f, warnIgnored: true });
      for (const m of res.messages) {
        if (/ignored/i.test(m.message || '')) throw new Error(`ESLint ignored ${f}; the scan would pass without checking anything`);
        if (m.fatal) add(`<parse error: ${m.message}>`, f, m.line, page);
        else if (m.ruleId === 'no-undef') add((m.message.match(/'(.+?)'/) || [])[1], f, m.line, page);
      }
      linted++;
    }
  }
  return { findings, linted };
}

const tools = loadEslint();

test('ESLint is installed for this check', () => {
  assert.ok(tools, `ESLint not found in .tools/. Run:\n  ${TOOLS_INSTALL}`);
});

test('the scanner flags a planted undefined name (guards against a check that silently passes)', { skip: !tools }, async () => {
  const eslint = new tools.ESLint({ cwd: REPO, overrideConfigFile: true, overrideConfig: [{
    languageOptions: { sourceType: 'script', globals: tools.globals.browser }, rules: { 'no-undef': 'error' } }] });
  const [res] = await eslint.lintText('function onClick() { return plantedUndefinedName + 1; }', { filePath: join(REPO, 'planted.js') });
  assert.deepEqual(res.messages.map(m => m.ruleId), ['no-undef']);
});

test('no page references a name that nothing on the page defines', { skip: !tools }, async () => {
  const { findings, linted } = await scan(tools);
  assert.ok(linted > 0, 'no scripts were linted; the page scan found nothing to check');
  const fresh = [...findings.values()].filter(f => !(f.key in KNOWN));
  const fixed = Object.keys(KNOWN).filter(k => !findings.has(k));
  const describe = (f) => `  ${f.key}  line ${[...f.lines].sort((a, b) => a - b).slice(0, 5).join(', ')}  (on ${[...f.pages].slice(0, 2).join(', ')})`;
  assert.equal(fresh.length, 0, `undefined name(s) — a ReferenceError the moment that line runs:\n${fresh.map(describe).join('\n')}`);
  assert.equal(fixed.length, 0, `fixed — remove from KNOWN:\n  ${fixed.join('\n  ')}`);
});
