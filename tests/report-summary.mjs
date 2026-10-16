// Turns the test run's JUnit file into the results table on the GitHub run
// page, and hands the counts to later jobs. Never fails the build itself: the
// test step already decided that.
//
//   node tests/report-summary.mjs test-results.xml
import { readFileSync, existsSync, appendFileSync } from 'node:fs';

const file = process.argv[2] || 'test-results.xml';
const decode = (s) => {
  let out = String(s || ''), prev;
  do {
    prev = out;
    out = out.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  } while (out !== prev);
  return out;
};
const attr = (s, name) => decode((s.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1]);
const oneLine = (s) => s.replace(/\s+/g, ' ').trim();

function parse(xml) {
  const tests = [];
  for (const m of xml.matchAll(/<testcase\b([^>]*?)(?:\/>|>([\s\S]*?)<\/testcase>)/g)) {
    const head = m[1], body = m[2] || '';
    const name = attr(head, 'name');
    // A known gap carries both <skipped type="todo"> and a <failure>; it is a gap, not a failure.
    const skipped = body.match(/<skipped\b([^>]*)\/?>/);
    if (skipped && /type="todo"/.test(skipped[1])) tests.push({ name, status: 'todo', note: attr(skipped[1], 'message') });
    else if (skipped) tests.push({ name, status: 'skipped', note: attr(skipped[1], 'message') });
    else if (/<failure\b/.test(body)) tests.push({ name, status: 'failed', note: attr((body.match(/<failure\b([^>]*)/) || [])[1] || '', 'message') });
    else tests.push({ name, status: 'passed' });
  }
  return tests;
}

const summary = [];
let counts = { passed: 0, failed: 0, todo: 0, skipped: 0 };
let failing = [];

if (!existsSync(file)) {
  summary.push('## Tests', '', '⚠️ **No results.** The test run stopped before it could report. Open the test step for the error.');
  counts.failed = 'unknown';
} else {
  const tests = parse(readFileSync(file, 'utf8'));
  for (const t of tests) counts[t.status]++;
  failing = tests.filter(t => t.status === 'failed');
  const gaps = tests.filter(t => t.status === 'todo');
  const skips = tests.filter(t => t.status === 'skipped');

  summary.push('## Tests', '',
    `${failing.length ? '❌' : '✅'} **${counts.passed} passed** · ${failing.length ? `**${counts.failed} failed**` : '0 failed'} · ${counts.todo} known gaps · ${counts.skipped} skipped`, '');
  if (failing.length) {
    summary.push('### Failed', '');
    for (const t of failing) summary.push(`- **${oneLine(t.name)}**${t.note ? `<br><sub>${oneLine(t.note).slice(0, 300)}</sub>` : ''}`);
    summary.push('');
  }
  if (gaps.length) {
    summary.push(`<details><summary>Known gaps (${gaps.length}): tracked, not blocking</summary>`, '');
    for (const t of gaps) summary.push(`- ${oneLine(t.name)}${t.note ? ` — *${oneLine(t.note)}*` : ''}`);
    summary.push('', '</details>', '');
  }
  if (skips.length) {
    summary.push(`<details><summary>Skipped (${skips.length})</summary>`, '');
    for (const t of skips) summary.push(`- ${oneLine(t.name)}${t.note ? ` — *${oneLine(t.note)}*` : ''}`);
    summary.push('', '</details>', '');
  }
}

const text = summary.join('\n') + '\n';
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text);
else process.stdout.write(text);

if (process.env.GITHUB_OUTPUT) {
  const names = failing.slice(0, 10).map(t => oneLine(t.name)).join('; ') + (failing.length > 10 ? `; and ${failing.length - 10} more` : '');
  appendFileSync(process.env.GITHUB_OUTPUT, [
    `passed=${counts.passed}`, `failed=${counts.failed}`, `todo=${counts.todo}`, `skipped=${counts.skipped}`, `failing=${names}`,
  ].join('\n') + '\n');
}
