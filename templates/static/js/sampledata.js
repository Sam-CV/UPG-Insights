// Sample demographic content for language groups (not countries)
// Structure: languageGroupKey -> sections
const LANGUAGE_GROUP_SAMPLE_DATA = {
    // Example key: use a normalized version of language group name (lowercase, underscores)
    example_group: {
        introduction_history: `The Example people group trace their origins to a network of riverine settlements, gradually consolidating into distinct clans over several centuries. Oral histories describe a founding migration prompted by seasonal flooding and trade opportunities, which connected them to neighboring highland markets. Over time, they developed a unique identity shaped by caravan trading routes, artisanal guilds, and stewardship of fertile floodplains.

Key historical moments include:
- Establishment of clan alliances and shared harvest festivals (c. 14th–16th centuries)
- Transition from barter to coin-based trade along regional corridors (c. 17th century)
- Local educational initiatives and literacy movements (late 19th–20th centuries)
- Modern vocational shifts toward services and small enterprises (21st century)`,
        everyday_lives: `Daily life centers on extended family networks, cooperative farming, and seasonal rhythms. Mornings begin with communal chores and shared meals; afternoons often include market visits or fieldwork, while evenings are devoted to storytelling, music, and learning.

Values and practices:
- Hospitality is a social cornerstone, with guests served first at meals
- Craftsmanship (weaving, woodwork, metalwork) remains a respected livelihood
- Education is increasingly prioritized, with growing participation of girls and women
- Community decisions are guided by elders, but youth councils are emerging`,
        demographics: `Estimated population: ~250,000 (core language group)
Primary settlements: river valleys and foothill terraces; growing urban clusters near trade hubs
Household structure: multigenerational units averaging 5–7 members
Age distribution: predominantly young; median age ~24; rising school completion rates`,
        environment: `Setting: semi-tropical plains with distinct wet and dry seasons; foothills offer cooler microclimates
Livelihoods: rainfed agriculture (rice, millet, pulses), small livestock, horticulture
Housing: bamboo frames, packed earth walls, clay tiles or thatch roofing; recent adoption of reinforced foundations
Resilience: community water-harvesting, grain storage collectives, and seasonal migration strategies`,
        stories_music: `Storytelling blends moral parables with humor and local heroism. Wedding songs celebrate fidelity and reciprocity; harvest songs follow a call-and-response style that sets the pace for collective work.

Musical features:
- Melodies often use pentatonic or hemitonic scales
- Instruments include a two-headed drum, plucked lute, and reed flute
- Lullabies and laments carry microtonal inflections unique to the group
- Dance cycles emphasize circular movement and synchronized clapping`,
        linguistics: `Language family: Indo-Aryan (illustrative)
Script: Devanagari (illustrative); oral tradition remains strong where literacy access is limited
Phonology: 5-vowel system (length contrasts in some dialects); retroflex series common (/ʈ ɖ ɳ/)
Morphosyntax: postpositional phrases; SOV default word order; honorific pronouns in formal registers
Sociolinguistics: bilingualism common in market towns; code-switching in youth media`
    }
};

// Utility to normalize a key from a language group name
function normalizeLanguageGroupKey(name) {
    return String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || 'example_group';
}

// Get sample data by language group name; falls back to example data
function getSampleDemographicData(languageGroupName) {
    const key = normalizeLanguageGroupKey(languageGroupName);
    return LANGUAGE_GROUP_SAMPLE_DATA[key] || LANGUAGE_GROUP_SAMPLE_DATA.example_group;
}


