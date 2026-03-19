let am5Root; // store globally so we can dispose it

// Load navbar using shared utility
loadNavbar();

// Function to load UPG data from database with fallback to sessionStorage
async function loadUpgDataWithFallback(sessionUpgData) {
    // Get language code mapping
    const languageNameToCode = {
        'japanese': 'jpn',
        'burmese': 'mya',
        'thai': 'tha',
        'khmer': 'khm',
        'shan': 'shn',
        'lao': 'lao',
        'vietnamese': 'vie',
        'rakhine': 'rki',
        'sinhalese': 'sin',
        'bengali': 'ben',
        'bangla': 'ben',
        'gujarati': 'guj',
        'hindi': 'hin',
        'marathi': 'mar',
        'nepali': 'nep',
        'oriya (macrolanguage)': 'ori',
        'khaliji (gulf) arabic': 'afb',
        'bambara': 'bam',
        'banjar': 'bjn',
        'dari': 'prs',
        'algerian darija/amazigh': 'arq',
        'hausa': 'hau',
        'indonesian': 'ind',
        'musi': 'mui',
        'pashto af': 'pus',
        'pashto pak': 'pbt',
        'saraiki': 'skr',
        'sindhi': 'snd',
        'somali': 'som',
        'sundanese': 'sun',
        'turkish': 'tur',
        'urdu': 'urd',
        'uzbek': 'uzb',
        'kazakh': 'kaz',
        'wolof': 'wol',
        'french': 'fra',
        'russian': 'rus'
    };

    // Default to sessionStorage values
    let finalData = {
        country: sessionUpgData.country,
        religion: sessionUpgData.religion,
        lat: sessionUpgData.lat,
        lon: sessionUpgData.lon,
        name: sessionUpgData.name
    };

    // Try to get language code
    const upgName = sessionUpgData.name ? sessionUpgData.name.toLowerCase() : '';
    let languageCode = languageNameToCode[upgName];

    // Fetch from database first
    if (languageCode) {
        languageCode = languageCode.toUpperCase();
        try {
            const demographicsData = await getUpgDemographics({ languageCode });
            console.log('Database response for', languageCode, ':', demographicsData);
            if (demographicsData) {
                // Use database values if available, otherwise keep sessionStorage values
                finalData.country = demographicsData.country || finalData.country;
                finalData.religion = demographicsData.religion || finalData.religion;

                console.log('Loaded from database:', {
                    country: demographicsData.country,
                    religion: demographicsData.religion
                });
                console.log('Final data being used:', finalData);
            } else {
                console.log('No database data found, using sessionStorage:', finalData);
            }
        } catch (error) {
            console.error('Error fetching demographics data:', error);
        }
    } else {
        console.log('No language code found for:', upgName, '- using sessionStorage:', finalData);
    }

    // Load images and map with the final values
    loadUpgImages(finalData.name, finalData.country);
    initializeMap(finalData.lat, finalData.lon);
    initializeCountryOutline(finalData.country);
    loadSectionImages('demographic', finalData.name, finalData.country);
    loadSectionImages('testimonies', finalData.name, finalData.country);
}

// Tab switching functionality
document.addEventListener('DOMContentLoaded', async () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const tabContainer = document.querySelector('.tabs-container');
    const highlight = document.querySelector('.tab-highlight');


    const setHighlightPosition = (button) => {
        if (!tabContainer || !highlight || !button) return; // prevents crash

        const containerRect = tabContainer.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        highlight.style.width = `${buttonRect.width}px`;
        highlight.style.left = `${buttonRect.left - containerRect.left}px`;
    };

    // Initialize highlight safely
    const activeButton = document.querySelector('.tab-button.active');
    if (activeButton) setHighlightPosition(activeButton);


    tabButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Set active states
            button.classList.add('active');
            const activeContent = document.getElementById(`${targetTab}-content`);
            if (activeContent) activeContent.classList.add('active');

            // Smooth highlight
            setHighlightPosition(button);

            // Update title
            const sectionTitle = document.getElementById('section-title');
            if (sectionTitle) sectionTitle.textContent = button.textContent;

            // --- Tab-specific actions (unified) ---
            switch (targetTab) {
                case 'overview':
                    // Refresh overview visuals
                    const selectedUpg = JSON.parse(sessionStorage.getItem('selectedUpg') || '{}');
                    if (selectedUpg.name) {
                        await loadUpgDataWithFallback(selectedUpg);
                        updateQuickNumbers();
                        focusMapOnLocation(true);
                        loadTopPerformingMetrics();
                    }
                    break;

                case 'demographic':
                    renderDemographicSampleData();
                    focusMapOnLocation(false); // zoom out to show whole world
                    break;

                case 'digital':
                    focusMapOnLocation(false);

                    break;

                case 'testimonies':
                    focusMapOnLocation(false);
                    await loadTestimoniesData();
                    break;

                default:
                    console.log(`No special action for tab: ${targetTab}`);
                    break;
            }
        });
    });

    // Load UPG details from sessionStorage
    const selectedUpgJson = sessionStorage.getItem('selectedUpg');
    if (selectedUpgJson) {
        const upgData = JSON.parse(selectedUpgJson);
        const mainTitle = document.getElementById('upg-main-title');
        const typeTag = document.getElementById('upg-type-tag');
        if (mainTitle) mainTitle.textContent = upgData.name || 'Tharu';
        if (typeTag) typeTag.textContent = upgData.type === 'language' ? 'Language' : 'Unreached People Group';

        // Try to fetch data from database first, then fall back to sessionStorage
        await loadUpgDataWithFallback(upgData);

        updateQuickNumbers();

        renderDemographicSampleData();
        loadTopPerformingMetrics();
    }
});

// Update Quick Numbers section with current UPG data
async function updateQuickNumbers() {
    const selectedUpgJson = sessionStorage.getItem('selectedUpg');
    if (selectedUpgJson) {
        const upgData = JSON.parse(selectedUpgJson);

        // Update header Quick Numbers
        const headerLanguageEl = document.getElementById('language');
        const headerReligionEl = document.getElementById('religion');
        const headerCountryEl = document.getElementById('country');
        const headerPopulationEl = document.getElementById('population');

        if (headerLanguageEl) headerLanguageEl.textContent = upgData.name || 'N/A';
        if (headerReligionEl) headerReligionEl.textContent = upgData.religion || 'N/A';
        if (headerCountryEl) headerCountryEl.textContent = upgData.country || 'N/A';
        if (headerPopulationEl) headerPopulationEl.textContent = 'Loading...';

        // Update Overview tab Quick Numbers
        const overviewLanguageEl = document.getElementById('overview-language');
        const overviewReligionEl = document.getElementById('overview-religion');
        const overviewCountryEl = document.getElementById('overview-country');
        const overviewPopulationEl = document.getElementById('overview-population');

        if (overviewLanguageEl) overviewLanguageEl.textContent = upgData.name || 'N/A';
        if (overviewReligionEl) overviewReligionEl.textContent = upgData.religion || 'N/A';
        if (overviewCountryEl) overviewCountryEl.textContent = upgData.country || 'N/A';

        // Fetch population from upg_demographics table
        if (overviewPopulationEl) {
            overviewPopulationEl.textContent = 'Loading...';

            // Get language code
            const languageName = upgData.name || upgData.language;
            const languageNameToCode = {
                // Buddhist languages
                'Japanese': 'jpn', 'Burmese': 'mya', 'Thai': 'tha', 'Khmer': 'khm',
                'Shan': 'shn', 'Lao': 'lao', 'Vietnamese': 'vie', 'Rakhine': 'rki',
                'Sinhalese': 'sin',
                // Hinduism languages
                'Bengali': 'ben', 'Bangla': 'ben', 'Gujarati': 'guj', 'Hindi': 'hin',
                'Marathi': 'mar', 'Nepali': 'nep', 'Oriya (Macrolanguage)': 'ori', 'Oriya': 'ori',
                // Islam languages
                'Khaliji (Gulf) Arabic': 'afb', 'Bambara': 'bam', 'Banjar': 'bjn',
                'Dari': 'prs', 'Algerian Darija/Amazigh': 'arq', 'Hausa': 'hau',
                'Indonesian': 'ind', 'Musi': 'mui', 'Pashto AF': 'pbt', 'Pashto Pak': 'pbt',
                'Saraiki': 'skr', 'Sindhi': 'snd', 'Somali': 'som', 'Sundanese': 'sun',
                'Turkish': 'tur', 'Urdu': 'urd', 'Uzbek': 'uzb', 'Kazakh': 'kaz',
                'Wolof': 'wol',
                // Other languages
                'French': 'fra', 'Russian': 'rus'
            };

            let languageCode = languageNameToCode[languageName] || null;
            if (!languageCode && languageName) {
                const lowerName = languageName.toLowerCase();
                const matchedKey = Object.keys(languageNameToCode).find(
                    key => key.toLowerCase() === lowerName
                );
                if (matchedKey) {
                    languageCode = languageNameToCode[matchedKey];
                }
            }

            if (languageCode) {
                languageCode = languageCode.toUpperCase();
                try {
                    const demographicsData = await getUpgDemographics({ languageCode });
                    if (demographicsData) {
                        // Update religion and country from database
                        if (demographicsData.religion) {
                            if (headerReligionEl) headerReligionEl.textContent = demographicsData.religion;
                            if (overviewReligionEl) overviewReligionEl.textContent = demographicsData.religion;
                        }
                        if (demographicsData.country) {
                            if (headerCountryEl) headerCountryEl.textContent = demographicsData.country;
                            if (overviewCountryEl) overviewCountryEl.textContent = demographicsData.country;
                        }

                        // Update population
                        if (demographicsData.population_size) {
                            // Format population with commas
                            const formattedPopulation = Number(demographicsData.population_size).toLocaleString();
                            overviewPopulationEl.textContent = formattedPopulation;

                            // Also update header population with same value
                            if (headerPopulationEl) {
                                headerPopulationEl.textContent = formattedPopulation;
                            }
                        } else {
                            overviewPopulationEl.textContent = 'N/A';
                            if (headerPopulationEl) headerPopulationEl.textContent = 'N/A';
                        }
                    } else {
                        overviewPopulationEl.textContent = 'N/A';
                        if (headerPopulationEl) headerPopulationEl.textContent = 'N/A';
                    }
                } catch (error) {
                    console.error('Error fetching population:', error);
                    overviewPopulationEl.textContent = 'N/A';
                    if (headerPopulationEl) headerPopulationEl.textContent = 'N/A';
                }
            } else {
                overviewPopulationEl.textContent = 'N/A';
                if (headerPopulationEl) headerPopulationEl.textContent = 'N/A';
            }
        }
    }
}

function focusMapOnLocation(zoomOut = false) {
    if (!am5Root) return;
    const chart = am5Root.container.children.getIndex(0); // your MapChart
    if (!chart) return;

    const selectedUpg = JSON.parse(sessionStorage.getItem('selectedUpg') || '{}');
    const lat = selectedUpg.lat || 0;
    const lon = selectedUpg.lon || 0;

    if (zoomOut) {
        console.log('Zooming out to show whole world');
        chart.animate({
            key: "rotationX",
            to: -lon,
            duration: 1000,
            easing: am5.ease.inOut(am5.ease.cubic)
        });

        chart.animate({
            key: "rotationY",
            to: -lat,
            duration: 1000,
            easing: am5.ease.inOut(am5.ease.cubic)
        });
        chart.animate({
            key: "zoomLevel",
            to: 1,
            duration: 1000,
            easing: am5.ease.inOut(am5.ease.cubic)
        });
    } else {
        // Zoom in to the selected location
        chart.animate({
            key: "zoomLevel",
            to: 5, // adjust zoom in level as needed
            duration: 1000,
            easing: am5.ease.inOut(am5.ease.cubic)
        });
        chart.animate({
            key: "rotationX",
            to: -lon,
            duration: 1000,
            easing: am5.ease.inOut(am5.ease.cubic)
        });
        chart.animate({
            key: "rotationY",
            to: -lat,
            duration: 1000,
            easing: am5.ease.inOut(am5.ease.cubic)
        });
    }
}


async function populateCountryFilterOptions() {
    const countriesMenu = document.getElementById('countries-menu');
    if (!countriesMenu) return;

    try {
        // Prefer provided upgData list if available, else fall back to DB
        let countries = [];
        if (Array.isArray(window.upgData)) {
            countries = Array.from(new Set(window.upgData.map(d => d.country).filter(Boolean))).sort();
        } else if (typeof getDistinctCountries === 'function') {
            countries = await getDistinctCountries();
        }
        // Keep the first "All Countries" option; clear others
        const baseOption = countriesMenu.querySelector('.dropdown-option[data-value="all"]');
        countriesMenu.innerHTML = '';
        if (baseOption) countriesMenu.appendChild(baseOption);

        countries.forEach(country => {
            const option = document.createElement('div');
            option.className = 'dropdown-option';
            option.setAttribute('data-value', country);
            option.innerHTML = `<span class="option-text">${country}</span>`;
            countriesMenu.appendChild(option);
        });

        // Click handling to set input value
        countriesMenu.addEventListener('click', (e) => {
            const option = e.target.closest('.dropdown-option');
            if (!option) return;
            const input = document.getElementById('countries-input');
            if (!input) return;
            const value = option.getAttribute('data-value');
            const text = option.querySelector('.option-text')?.textContent || value;
            input.value = value === 'all' ? 'All Countries' : text;
        });
    } catch (e) {
        console.error('Failed to populate country filter', e);
    }
}

// Define all available demographic sections
const DEMOGRAPHIC_SECTIONS = [
    { id: 'introduction', title: 'Introduction/History', field: 'introduction' },
    { id: 'everyday_lives', title: 'Everyday Lives', field: 'everyday_lives' },
    { id: 'demographics', title: 'Demographics', field: 'demographics' },
    { id: 'environment', title: 'Environment', field: 'environment' },
    { id: 'stories_music', title: 'Stories and Music', field: 'stories_music' },
    { id: 'linguistics', title: 'Linguistics', field: 'linguistics' },
    { id: 'appearance', title: 'Appearance', field: 'appearance' },
    { id: 'cultural_nuances', title: 'Cultural Nuances', field: 'cultural_nuances' },
    { id: 'beliefs', title: 'Beliefs', field: 'beliefs' },
    { id: 'worldviews', title: 'Worldviews', field: 'worldviews' },
    { id: 'blockers_to_christianity', title: 'Blockers to Christianity', field: 'blockers_to_christianity' },
    { id: 'felt_specific_needs', title: 'Felt Specific Needs', field: 'felt_specific_needs' },
    { id: 'technology_adaptation', title: 'Technology Adaptation', field: 'technology_adaptation' },
    { id: 'literacy', title: 'Literacy', field: 'literacy' },
    { id: 'security_country_profile', title: 'Security Country Profile', field: 'security_country_profile' },
    { id: 'security_conversion_risk', title: 'Security Conversion Risk', field: 'security_conversion_risk' }
];

// Track if collapse has been initialized
let demographicCollapseInitialized = false;

// Initialize collapse/expand functionality for demographic controls
function initDemographicCollapse() {
    // Only initialize once
    if (demographicCollapseInitialized) {
        return;
    }

    const header = document.getElementById('demographic-controls-header');
    const container = document.getElementById('demographic-toggles-container');
    const scrollContainer = document.getElementById('demographic-toggles-scroll');
    const collapseIcon = document.getElementById('collapse-icon');

    if (!header || !container || !collapseIcon) {
        return;
    }

    demographicCollapseInitialized = true;

    // Force collapsed state by replacing all inline styles
    const baseStyles = 'overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease, padding 0.4s ease; background: rgba(255, 255, 255, 0.3);';

    container.style.cssText = baseStyles + ' max-height: 0px; opacity: 0; padding: 0;';
    collapseIcon.style.transform = 'rotate(-90deg)';
    container.setAttribute('data-collapsed', 'true');

    // Add hover effect to header
    header.addEventListener('mouseenter', () => {
        header.style.background = 'rgba(255, 255, 255, 0.6)';
    });
    header.addEventListener('mouseleave', () => {
        header.style.background = 'rgba(255, 255, 255, 0.4)';
    });

    // Toggle collapse on header click
    header.addEventListener('click', (e) => {
        // Prevent event bubbling
        e.stopPropagation();

        const isCurrentlyCollapsed = container.getAttribute('data-collapsed') === 'true';

        if (isCurrentlyCollapsed) {
            // Expand
            container.style.cssText = baseStyles + ' max-height: 300px; opacity: 1; padding: 24px;';
            collapseIcon.style.transform = 'rotate(0deg)';
            container.setAttribute('data-collapsed', 'false');
        } else {
            // Collapse
            container.style.cssText = baseStyles + ' max-height: 0px; opacity: 0; padding: 0;';
            collapseIcon.style.transform = 'rotate(-90deg)';
            container.setAttribute('data-collapsed', 'true');
        }
    });
}

// Initialize demographic section toggles
function initDemographicToggles() {
    const togglesContainer = document.getElementById('demographic-toggles');
    if (!togglesContainer) return;

    // Load saved preferences or default to all visible
    const savedPrefs = localStorage.getItem('demographicSectionPrefs');
    const visibleSections = savedPrefs ? JSON.parse(savedPrefs) : DEMOGRAPHIC_SECTIONS.map(s => s.id);

    togglesContainer.innerHTML = '';
    DEMOGRAPHIC_SECTIONS.forEach(section => {
        const isChecked = visibleSections.includes(section.id);
        const toggle = document.createElement('label');
        toggle.className = 'demographic-toggle-item';
        toggle.style.cssText = 'display: flex; align-items: center; gap: 12px; cursor: pointer; user-select: none; padding: 14px 16px; background: white; border-radius: 10px; border: 2px solid #e2e8f0; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); position: relative;';

        // Create custom toggle switch
        const switchHTML = `
            <div class="custom-switch" style="position: relative; width: 44px; height: 24px; background: ${isChecked ? '#3b82f6' : '#cbd5e1'}; border-radius: 12px; transition: all 0.25s; flex-shrink: 0;">
                <div style="position: absolute; top: 2px; left: ${isChecked ? '22px' : '2px'}; width: 20px; height: 20px; background: white; border-radius: 50%; transition: all 0.25s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>
            </div>
        `;

        toggle.innerHTML = `
            <input type="checkbox" class="section-toggle" name="section-${section.id}" id="toggle-${section.id}" data-section-id="${section.id}" ${isChecked ? 'checked' : ''} style="position: absolute; opacity: 0; pointer-events: none;">
            ${switchHTML}
            <span style="font-size: 14px; color: #1e293b; font-weight: 600; flex: 1;">${section.title}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${isChecked ? '#3b82f6' : '#cbd5e1'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transition: all 0.25s;">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        // Add hover and active effects
        toggle.addEventListener('mouseenter', () => {
            toggle.style.borderColor = '#3b82f6';
            toggle.style.transform = 'translateY(-2px)';
            toggle.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
        });
        toggle.addEventListener('mouseleave', () => {
            toggle.style.borderColor = '#e2e8f0';
            toggle.style.transform = 'translateY(0)';
            toggle.style.boxShadow = 'none';
        });

        // Toggle functionality
        toggle.addEventListener('click', () => {
            const checkbox = toggle.querySelector('.section-toggle');
            checkbox.checked = !checkbox.checked;
            updateToggleAppearance(toggle, checkbox.checked);
            saveDemographicPreferences();
            updateVisibleSections();
        });

        togglesContainer.appendChild(toggle);
    });

    // Add event listeners for toggles
    document.querySelectorAll('.section-toggle').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            saveDemographicPreferences();
            updateVisibleSections();
        });
    });

    // Select/Deselect All buttons
    const selectAllBtn = document.getElementById('select-all-sections');
    const deselectAllBtn = document.getElementById('deselect-all-sections');

    if (selectAllBtn) {
        // Add hover effect
        selectAllBtn.addEventListener('mouseenter', () => {
            selectAllBtn.style.background = 'rgba(59, 130, 246, 0.2)';
            selectAllBtn.style.transform = 'scale(1.05)';
            selectAllBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
        });
        selectAllBtn.addEventListener('mouseleave', () => {
            selectAllBtn.style.background = 'rgba(59, 130, 246, 0.1)';
            selectAllBtn.style.transform = 'scale(1)';
            selectAllBtn.style.boxShadow = 'none';
        });

        selectAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.section-toggle').forEach(cb => cb.checked = true);
            // Update all toggle appearances
            document.querySelectorAll('.demographic-toggle-item').forEach(item => {
                updateToggleAppearance(item, true);
            });
            saveDemographicPreferences();
            updateVisibleSections();
        });
    }

    if (deselectAllBtn) {
        // Add hover effect
        deselectAllBtn.addEventListener('mouseenter', () => {
            deselectAllBtn.style.background = 'rgba(100, 116, 139, 0.2)';
            deselectAllBtn.style.transform = 'scale(1.05)';
            deselectAllBtn.style.boxShadow = '0 4px 12px rgba(100, 116, 139, 0.2)';
        });
        deselectAllBtn.addEventListener('mouseleave', () => {
            deselectAllBtn.style.background = 'rgba(100, 116, 139, 0.1)';
            deselectAllBtn.style.transform = 'scale(1)';
            deselectAllBtn.style.boxShadow = 'none';
        });

        deselectAllBtn.addEventListener('click', () => {
            document.querySelectorAll('.section-toggle').forEach(cb => cb.checked = false);
            // Update all toggle appearances
            document.querySelectorAll('.demographic-toggle-item').forEach(item => {
                updateToggleAppearance(item, false);
            });
            saveDemographicPreferences();
            updateVisibleSections();
        });
    }

    // Helper function to update toggle appearance
    function updateToggleAppearance(toggleElement, isChecked) {
        const switchDiv = toggleElement.querySelector('.custom-switch');
        const switchCircle = switchDiv.querySelector('div');
        const checkIcon = toggleElement.querySelector('svg');

        if (switchDiv && switchCircle && checkIcon) {
            switchDiv.style.background = isChecked ? '#3b82f6' : '#cbd5e1';
            switchCircle.style.left = isChecked ? '22px' : '2px';
            checkIcon.setAttribute('stroke', isChecked ? '#3b82f6' : '#cbd5e1');
        }
    }
}

// Save demographic section preferences to localStorage
function saveDemographicPreferences() {
    const visibleSections = Array.from(document.querySelectorAll('.section-toggle:checked'))
        .map(cb => cb.getAttribute('data-section-id'));
    localStorage.setItem('demographicSectionPrefs', JSON.stringify(visibleSections));
}

// Update visibility of demographic sections based on toggles
function updateVisibleSections() {
    const visibleSections = Array.from(document.querySelectorAll('.section-toggle:checked'))
        .map(cb => cb.getAttribute('data-section-id'));

    DEMOGRAPHIC_SECTIONS.forEach(section => {
        const sectionElement = document.getElementById(`demographic-section-${section.id}`);
        if (sectionElement) {
            sectionElement.style.display = visibleSections.includes(section.id) ? 'block' : 'none';
        }
    });
}

// Render demographic data into #demographic-sections from upg_demographics table
async function renderDemographicSampleData() {
    const container = document.getElementById('demographic-sections');
    if (!container) return;

    // Initialize toggles if not already done
    initDemographicToggles();

    // Show loading state
    container.innerHTML = '<div class="loading-message">Loading demographics data...</div>';

    // Get language code from selectedUpg
    const selectedUpgJson = sessionStorage.getItem('selectedUpg');
    let languageCode = null;
    let languageName = 'Example Group';

    if (selectedUpgJson) {
        try {
            const upgData = JSON.parse(selectedUpgJson);
            languageName = upgData.name || upgData.language || languageName;

            // Map language names to 3-letter ISO 639-3 codes (uppercase to match database)
            const languageNameToCode = {
                // Buddhist languages
                'Japanese': 'jpn', 'Burmese': 'mya', 'Thai': 'tha', 'Khmer': 'khm',
                'Shan': 'shn', 'Lao': 'lao', 'Vietnamese': 'vie', 'Rakhine': 'rki',
                'Sinhalese': 'sin',
                // Hinduism languages
                'Bengali': 'ben', 'Bangla': 'ben', 'Gujarati': 'guj', 'Hindi': 'hin',
                'Marathi': 'mar', 'Nepali': 'nep', 'Oriya (Macrolanguage)': 'ori', 'Oriya': 'ori',
                // Islam languages
                'Khaliji (Gulf) Arabic': 'afb', 'Bambara': 'bam', 'Banjar': 'bjn',
                'Dari': 'prs', 'Algerian Darija/Amazigh': 'arq', 'Hausa': 'hau',
                'Indonesian': 'ind', 'Musi': 'mui', 'Pashto AF': 'pbt', 'Pashto Pak': 'pbt',
                'Saraiki': 'skr', 'Sindhi': 'snd', 'Somali': 'som', 'Sundanese': 'sun',
                'Turkish': 'tur', 'Urdu': 'urd', 'Uzbek': 'uzb', 'Kazakh': 'kaz',
                'Wolof': 'wol',
                // Other languages
                'French': 'fra', 'Russian': 'rus'
            };

            if (languageName) {
                languageCode = languageNameToCode[languageName] || null;

                // Try case-insensitive match if no exact match
                if (!languageCode) {
                    const lowerName = languageName.toLowerCase();
                    const matchedKey = Object.keys(languageNameToCode).find(
                        key => key.toLowerCase() === lowerName
                    );
                    if (matchedKey) {
                        languageCode = languageNameToCode[matchedKey];
                    }
                }

                // Convert to uppercase to match database format (NEP, VIE, etc.)
                if (languageCode) {
                    languageCode = languageCode.toUpperCase();
                }
            }

            console.log('Language name:', languageName, '-> Language code:', languageCode);
        } catch (e) {
            console.error('Error parsing selectedUpg:', e);
        }
    }

    // Combined card configurations - each card can hold multiple sections via tags
    const cardDefinitions = [
        {
            id: 'origins',
            size: 'hero',
            theme: 'dark',
            eyebrow: 'Foundation',
            title: 'Origins & Identity',
            description: 'Discover the historical journey, cultural development, and unique identity markers that define this people group.',
            icon: '',
            tags: ['Introduction', 'History', 'Appearance'],
            sections: ['introduction', 'appearance']
        },
        {
            id: 'daily_life',
            size: 'standard',
            theme: 'light',
            eyebrow: 'Lifestyle',
            title: 'Daily Life',
            description: 'Rhythms, routines, and everyday patterns.',
            icon: '☀️',
            tags: ['Everyday Lives'],
            sections: ['everyday_lives', 'appearance', 'demographics']
        },
        {
            id: 'environment',
            size: 'standard',
            theme: 'light',
            eyebrow: 'Geography',
            title: 'Environment',
            description: 'Land, climate, and natural context.',
            icon: '🌍',
            tags: ['Environment'],
            sections: ['environment', 'demographics']
        },
        {
            id: 'demographics',
            size: 'standard',
            theme: 'light',
            eyebrow: 'Population',
            title: 'Demographics',
            description: 'Population data and community structure.',
            icon: '👥',
            tags: ['Demographics'],
            sections: ['demographics', 'introduction']
        },
        {
            id: 'culture',
            size: 'tall',
            theme: 'blue',
            eyebrow: 'Expression',
            title: 'Culture & Arts',
            description: 'The stories, music, traditions, and cultural nuances that express the heart and soul of this community.',
            icon: '',
            tags: ['Stories & Music', 'Cultural Nuances'],
            sections: ['stories_music', 'cultural_nuances']
        },
        {
            id: 'security',
            size: 'standard',
            theme: 'navy',
            eyebrow: 'Risk Assessment',
            title: 'Security & Safety',
            description: 'Regional stability, religious freedom, and safety considerations.',
            icon: '',
            tags: ['Country Profile', 'Conversion Risk'],
            sections: ['security_country_profile', 'security_conversion_risk'],
            hasWarning: true
        },
        {
            id: 'worldview',
            size: 'wide',
            theme: 'light',
            eyebrow: 'Spiritual Landscape',
            title: 'Worldview & Beliefs',
            description: 'Understanding the spiritual frameworks, religious practices, and core beliefs that shape decisions, values, and community life.',
            icon: '',
            tags: ['Beliefs', 'Worldviews'],
            sections: ['beliefs', 'worldviews']
        },
        {
            id: 'language',
            size: 'standard',
            theme: 'light',
            eyebrow: 'Communication',
            title: 'Language',
            description: 'Linguistic patterns and literacy levels.',
            icon: '📖',
            tags: ['Linguistics', 'Literacy'],
            sections: ['linguistics', 'literacy']
        },
        {
            id: 'barriers',
            size: 'standard',
            theme: 'light',
            eyebrow: 'Obstacles',
            title: 'Gospel Barriers',
            description: 'Historical and cultural factors that create resistance.',
            icon: '',
            tags: ['Blockers to Christianity'],
            sections: ['blockers_to_christianity', 'beliefs', 'worldviews']
        },
        {
            id: 'needs',
            size: 'standard',
            theme: 'light',
            eyebrow: 'Engagement',
            title: 'Needs',
            description: 'Felt needs and ministry opportunities.',
            icon: '',
            tags: ['Felt', 'Specific'],
            sections: ['felt_specific_needs', 'everyday_lives']
        },
        {
            id: 'technology',
            size: 'standard',
            theme: 'light',
            eyebrow: 'Access',
            title: 'Technology',
            description: 'Digital adoption and infrastructure.',
            icon: '📱',
            tags: [],
            sections: ['technology_adaptation', 'literacy']
        }
    ];

    // Helper to create a bento-style card with tags
    const createCard = (cardDef, demographicsData) => {
        const block = document.createElement('div');
        block.id = `demographic-card-${cardDef.id}`;
        block.className = `bento-card card-${cardDef.size} card-${cardDef.theme}`;

        // Generate tags HTML
        const tagsHTML = cardDef.tags.length > 0
            ? `<div class="card-meta">${cardDef.tags.map(tag => `<span class="meta-tag">${tag}</span>`).join('')}</div>`
            : '';

        // Warning dot for security card
        const warningDot = cardDef.hasWarning ? '<span class="status-dot warning"></span>' : '';

        // Collect content from all sections for this card
        const sectionsContent = cardDef.sections.map(sectionId => {
            const section = DEMOGRAPHIC_SECTIONS.find(s => s.id === sectionId);
            const content = demographicsData ? demographicsData[section?.field] : null;
            return {
                title: section?.title || sectionId,
                content: content || 'Coming soon...'
            };
        });

        // Get preview text by combining all sections with paragraph breaks
        // Database text contains single \n where paragraphs end - replace with \n\n for visual spacing
        let previewText = sectionsContent
            .map(section => {
                let content = section.content;
                if (content && content !== 'Coming soon...') {
                    // Replace single newlines with double newlines for paragraph spacing
                    content = content.replace(/\n/g, '\n\n');
                }
                return content;
            })
            .filter(content => content && content !== 'Coming soon...')
            .join('\n\n') || 'Coming soon...';

        block.innerHTML = `
            ${cardDef.icon ? `<div class="card-icon">${cardDef.icon}</div>` : ''}
            <div class="card-eyebrow">
                ${cardDef.eyebrow}
                <span class="eyebrow-line"></span>
                ${warningDot}
            </div>
            <div class="card-title">${cardDef.title}</div>
            <div class="card-preview">
                <div class="card-preview-text">${previewText}</div>
                <div class="card-preview-fade"></div>
            </div>
            ${tagsHTML}
            <div class="card-expand">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
                </svg>
            </div>
        `;

        // Store sections data on the element for modal
        block.setAttribute('data-card-title', cardDef.title);
        block.setAttribute('data-sections', JSON.stringify(sectionsContent));

        // Add click handler to open modal
        block.addEventListener('click', () => {
            openDemographicModal(cardDef.title, sectionsContent);
        });

        return block;
    };

    // Modal function for demographic cards
    function openDemographicModal(title, sections) {
        // Create or get modal
        let modal = document.getElementById('demographic-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'demographic-modal';
            modal.className = 'demographic-modal';
            modal.innerHTML = `
                <div class="demographic-modal-overlay"></div>
                <div class="demographic-modal-content">
                    <div class="demographic-modal-header">
                        <h2 class="demographic-modal-title"></h2>
                        <button class="demographic-modal-close">
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="demographic-modal-body"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close handlers
            modal.querySelector('.demographic-modal-overlay').addEventListener('click', closeDemographicModal);
            modal.querySelector('.demographic-modal-close').addEventListener('click', closeDemographicModal);
        }

        // Populate modal
        modal.querySelector('.demographic-modal-title').textContent = title;
        const body = modal.querySelector('.demographic-modal-body');
        body.innerHTML = sections.map(section => {
            // Split content into paragraphs and wrap each in <p> tags
            const paragraphs = section.content
                .split('\n')
                .filter(p => p.trim())
                .map(p => `<p>${p.trim()}</p>`)
                .join('');

            return `
                <div class="demographic-modal-section">
                    <h3 class="demographic-modal-section-title">${section.title}</h3>
                    <div class="demographic-modal-section-content">${paragraphs}</div>
                </div>
            `;
        }).join('');

        // Show modal
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDemographicModal() {
        const modal = document.getElementById('demographic-modal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDemographicModal();
    });

    // Try to fetch data from database if we have a language code
    let demographicsData = null;
    if (languageCode && typeof getUpgDemographics === 'function') {
        try {
            demographicsData = await getUpgDemographics({ languageCode });
        } catch (error) {
            console.error('Error fetching demographics:', error);
        }
    }

    // Clear container and set up bento grid
    container.innerHTML = '';
    container.className = 'bento-grid';

    // If we have database data, use it; otherwise fall back to sample data
    if (demographicsData) {
        console.log('Using demographics data from database:', demographicsData);
        // Render all combined cards
        cardDefinitions.forEach(cardDef => {
            container.appendChild(createCard(cardDef, demographicsData));
        });
    } else {
        console.log('No database data found, using sample data for:', languageName);
        // Fallback to sample data if available
        if (typeof getSampleDemographicData === 'function') {
            const sample = getSampleDemographicData(languageName);
            // Map sample data to match expected field names
            const sampleFieldMap = {
                'introduction': 'introduction_history',
                'everyday_lives': 'everyday_lives',
                'demographics': 'demographics',
                'environment': 'environment',
                'stories_music': 'stories_music',
                'linguistics': 'linguistics'
            };
            // Create a mapped demographics object
            const mappedData = {};
            Object.keys(sampleFieldMap).forEach(key => {
                mappedData[key] = sample[sampleFieldMap[key]] || sample[key];
            });
            // Render cards with sample data
            cardDefinitions.forEach(cardDef => {
                container.appendChild(createCard(cardDef, mappedData));
            });
        } else {
            // No sample data function available
            container.innerHTML = '<div class="loading-message">No demographics data available for this selection.</div>';
            container.className = '';
        }
    }

    // Update visibility based on saved preferences
    updateVisibleSections();

    // Initialize collapse functionality (only runs once)
    initDemographicCollapse();
}

// Expand/collapse long testimonies on click
// OLD testimony click handler removed - now using Read More button only

// Load and render Testimonies for the selected country
async function loadTestimoniesData() {
    const container = document.getElementById('testimonies-content');
    if (!container) return;

    // Use the dedicated cards container so we don't wipe out the images/globe layout
    const cardsContainerInit = document.getElementById('testimonies-cards-container');
    if (cardsContainerInit) {
        cardsContainerInit.innerHTML = '<div class="loading-message">Loading testimonies...</div>';
    } else {
        container.innerHTML = '<div class="loading-message">Loading testimonies...</div>';
    }

    try {
        // Get language code from selectedUpg
        let languageCode = null;
        const selectedUpgJson = sessionStorage.getItem('selectedUpg');
        if (selectedUpgJson) {
            const upgData = JSON.parse(selectedUpgJson);
            const languageNameToCode = {
                // Buddhist languages
                'Japanese': 'jpn', 'Burmese': 'mya', 'Thai': 'tha', 'Khmer': 'khm',
                'Shan': 'shn', 'Lao': 'lao', 'Vietnamese': 'vie', 'Rakhine': 'rki',
                'Sinhalese': 'sin',
                // Hinduism languages
                'Bengali': 'ben', 'Bangla': 'ben', 'Gujarati': 'guj', 'Hindi': 'hin',
                'Marathi': 'mar', 'Nepali': 'nep', 'Oriya (Macrolanguage)': 'ori', 'Oriya': 'ori',
                // Islam languages
                'Khaliji (Gulf) Arabic': 'afb', 'Bambara': 'bam', 'Banjar': 'bjn',
                'Dari': 'prs', 'Algerian Darija/Amazigh': 'arq', 'Hausa': 'hau',
                'Indonesian': 'ind', 'Musi': 'mui', 'Pashto AF': 'pbt', 'Pashto Pak': 'pbt',
                'Saraiki': 'skr', 'Sindhi': 'snd', 'Somali': 'som', 'Sundanese': 'sun',
                'Turkish': 'tur', 'Urdu': 'urd', 'Uzbek': 'uzb', 'Kazakh': 'kaz',
                'Wolof': 'wol',
                // Other languages
                'French': 'fra', 'Russian': 'rus'
            };

            const languageName = upgData.name || upgData.language;
            if (languageName) {
                languageCode = languageNameToCode[languageName] || null;
                if (!languageCode) {
                    const lowerName = languageName.toLowerCase();
                    const matchedKey = Object.keys(languageNameToCode).find(
                        key => key.toLowerCase() === lowerName
                    );
                    if (matchedKey) {
                        languageCode = languageNameToCode[matchedKey];
                    }
                }
                // Convert to uppercase to match database format (VIE, SIN, etc.)
                if (languageCode) {
                    languageCode = languageCode.toUpperCase();
                }
            }
        }

        // Only fetch testimonies if we have a valid language code
        if (!languageCode) {
            const target = document.getElementById('testimonies-cards-container') || container;
            target.innerHTML = '<div class="loading-message">No testimonies available for this selection.</div>';
            return;
        }

        const testimonies = await getTestimonies({ languageCode: languageCode, limit: 30 });

        if (!Array.isArray(testimonies) || testimonies.length === 0) {
            const message = languageCode ? `No testimonies found for this language.` : 'No testimonies found.';
            const target = document.getElementById('testimonies-cards-container') || container;
            target.innerHTML = `<div class="loading-message">${message}</div>`;
            return;
        }

        // Render testimonies in a responsive 2-column layout (no title)
        const cardsContainer = document.getElementById('testimonies-cards-container') || container;
        cardsContainer.innerHTML = '';
        const grid = document.createElement('div');
        grid.style.display = 'flex';
        grid.style.flexDirection = 'column';
        grid.style.gap = '16px';
        // grid.style.alignItems = 'stretch';

        testimonies.forEach((t, index) => {
            grid.appendChild(createTestimonyCardElement(t, index));
        });

        cardsContainer.innerHTML = '';
        cardsContainer.appendChild(grid);

        function applyResponsiveGrid() {
            if (window.innerWidth < 800) {
                grid.style.gridTemplateColumns = '1fr';
            } else {
                grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            }
        }
        applyResponsiveGrid();
        window.addEventListener('resize', applyResponsiveGrid);
    } catch (error) {
        console.error('Error loading testimonies:', error);
        const target = document.getElementById('testimonies-cards-container') || container;
        target.innerHTML = '<div class="loading-message">Error loading testimonies. Please try again.</div>';
    }
}

function createTestimonyCardElement(testimony, index) {
    console.log(`Creating testimony card ${index}:`, {
        country: testimony.country,
        testimonyPreview: testimony.testimony ? testimony.testimony.substring(0, 50) : 'N/A'
    });

    const country = (testimony.country || 'Unknown country').replace(/_/g, ' ');
    const initials = country.split(' ').map(part => part && part[0] ? part[0] : '').join('').substring(0, 2).toUpperCase();
    const postedDate = testimony.date_posted ? new Date(testimony.date_posted).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recently posted';
    const testimonyText = testimony.testimony || 'Story coming soon...';
    const longThreshold = 600;
    const isLong = testimonyText.length > longThreshold;
    const collapsed = isLong ? (testimonyText.substring(0, longThreshold) + '...') : testimonyText;
    const outcome = testimony.outcome ? String(testimony.outcome).replace(/_/g, ' ') : '';
    const impacting = testimony.impacting ? String(testimony.impacting).replace(/_/g, ' ') : '';

    const card = document.createElement('div');
    card.className = 'testimony-card';
    card.style.border = '1px solid #e5e7eb';
    card.style.borderRadius = '14px';
    card.style.padding = '18px 18px 14px 18px';
    card.style.background = '#fff';
    card.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';

    card.innerHTML = `
        <div class="testimony-header" style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <div class="avatar" style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#eff6ff,#dbeafe);display:flex;align-items:center;justify-content:center;font-weight:700;color:#1e40af;">${initials}</div>
            <div class="person-details" style="flex:1;">
                <div class="person-name" style="font-weight:700;color:#0f172a;">${country}</div>
                <div class="location-info" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px;">
                    <span class="location-badge" style="display:inline-flex;align-items:center;gap:4px;font-size:12px;color:#475569;background:#f1f5f9;padding:3px 8px;border-radius:9999px;">
                        <svg style="width:12px;height:12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a 2 2 0 00-2 2z"></path></svg>
                        ${country}
                    </span>
                </div>
            </div>
        </div>
        <div class="testimony-content" style="margin-bottom:10px;position:relative;overflow:hidden;transition:max-height 0.3s ease;">
            <div class="testimony-text" id="details-testimony-text-${index}" style="color:#334155;line-height:1.7;">${isLong ? collapsed.replace(/</g, '&lt;') : testimonyText.replace(/</g, '&lt;')}</div>
            ${isLong ? `
                <button class="read-more-btn" id="read-more-btn-${index}" style="margin-top:8px;background:none;border:none;color:#3b82f6;font-size:13px;font-weight:600;cursor:pointer;padding:4px 0;display:flex;align-items:center;gap:4px;transition:color 0.2s;">
                    <span>Read More</span>
                    <svg style="width:14px;height:14px;transition:transform 0.2s;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </button>
            ` : ''}
            ${(outcome || impacting) ? `
                <div class="testimony-highlight" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
                    ${outcome ? `<span class=\"highlight-bubble\" style=\"background:#3b82f6;color:#fff;padding:6px 12px;border-radius:9999px;font-size:12px;font-weight:700;\">Outcome: ${outcome}</span>` : ''}
                    ${impacting ? `<span class=\"highlight-bubble\" style=\"background:#10b981;color:#fff;padding:6px 12px;border-radius:9999px;font-size:12px;font-weight:700;\">Impacting: ${impacting}</span>` : ''}
                </div>
            ` : ''}
        </div>
        <div class="testimony-footer" style="display:flex;justify-content:space-between;align-items:center;border-top:1px solid #f1f5f9;padding-top:8px;">
            <span class="date-stamp" style="font-size:12px;color:#94a3b8;display:flex;align-items:center;gap:4px;">
                <svg style="width:12px;height:12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a 2 2 0 00-2-2H5a2 2 0 00-2 2z"></path></svg>
                ${postedDate}
            </span>
        </div>
    `;

    // Store the full text as a data attribute on the card
    if (isLong) {
        card.setAttribute('data-full-text', testimonyText);
        card.setAttribute('data-collapsed-text', collapsed);
    }

    // Add click handler only to the Read More button
    if (isLong) {
        const btn = card.querySelector(`#read-more-btn-${index}`);
        if (btn) {
            btn.addEventListener('click', () => {
                console.log(`Read More clicked for card ${index}`);

                const textEl = card.querySelector(`#details-testimony-text-${index}`);
                const btnText = btn.querySelector('span');
                const btnIcon = btn.querySelector('svg');

                // Get the stored text from data attributes
                const fullText = card.getAttribute('data-full-text');
                const collapsedText = card.getAttribute('data-collapsed-text');

                console.log(`Full text preview for card ${index}:`, fullText ? fullText.substring(0, 50) : 'N/A');

                // Toggle expanded class on card
                card.classList.toggle('expanded');

                if (card.classList.contains('expanded')) {
                    // Expand
                    textEl.textContent = fullText;
                    btnText.textContent = 'Read Less';
                    btnIcon.style.transform = 'rotate(180deg)';
                } else {
                    // Collapse
                    textEl.textContent = collapsedText;
                    btnText.textContent = 'Read More';
                    btnIcon.style.transform = 'rotate(0deg)';
                }
            });
        }
    }

    return card;
}



// Load UPG images (male and female)
function loadUpgImages(upgName, country) {
    if (!country) {
        console.log('Missing country');
        return;
    }

    // Get religion from session storage
    const selectedUpgJson = sessionStorage.getItem('selectedUpg');
    let religion = null;
    if (selectedUpgJson) {
        try {
            const upgData = JSON.parse(selectedUpgJson);
            religion = upgData.religion;
        } catch (e) {
            console.error('Failed to parse selectedUpg:', e);
        }
    }

    const baseUrl = 'https://upg-resources.s3.ap-southeast-2.amazonaws.com/images/upg-profiles';

    // Build URLs: {country}/{religion}/{gender}.jpg
    // If no religion, just use {country}/{gender}.jpg
    let femaleImageUrl, maleImageUrl;
    if (religion) {
        femaleImageUrl = `${baseUrl}/${country}/${religion}/female.jpg`;
        maleImageUrl = `${baseUrl}/${country}/${religion}/male.jpg`;
    } else {
        femaleImageUrl = `${baseUrl}/${country}/female.jpg`;
        maleImageUrl = `${baseUrl}/${country}/male.jpg`;
    }

    console.log('Loading images:', { femaleImageUrl, maleImageUrl });

    // Update Overview tab images
    const femaleImg = document.getElementById('upg-image-female');
    const maleImg = document.getElementById('upg-image-male');

    // Create a simple placeholder as a data URL
    const placeholderImage = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
            <rect width="200" height="300" fill="#f0f0f0"/>
            <text x="50%" y="50%" text-anchor="middle" fill="#999" font-family="Arial" font-size="14">
                No image here yet!
            </text>
        </svg>
    `);

    if (femaleImg) {
        // Show skeleton loading animation
        femaleImg.classList.add('loading');
        femaleImg.src = '';
        femaleImg.style.display = 'block';

        // Create a new image to test if it loads
        const testImg = new Image();
        testImg.onload = function() {
            femaleImg.src = femaleImageUrl;
            femaleImg.classList.remove('loading');
        };
        testImg.onerror = function() {
            console.log('Female image not found:', femaleImageUrl);
            femaleImg.src = placeholderImage;
            femaleImg.classList.remove('loading');
        };
        testImg.src = femaleImageUrl;
    }

    if (maleImg) {
        // Show skeleton loading animation
        maleImg.classList.add('loading');
        maleImg.src = '';
        maleImg.style.display = 'block';

        // Create a new image to test if it loads
        const testImg = new Image();
        testImg.onload = function() {
            maleImg.src = maleImageUrl;
            maleImg.classList.remove('loading');
        };
        testImg.onerror = function() {
            console.log('Male image not found:', maleImageUrl);
            maleImg.src = placeholderImage;
            maleImg.classList.remove('loading');
        };
        testImg.src = maleImageUrl;
    }
}

// Load images for a given section prefix ('demographic' or 'testimonies')
function loadSectionImages(sectionPrefix, upgName, country) {
    if (!sectionPrefix || !country) return;

    // Get religion from session storage
    const selectedUpgJson = sessionStorage.getItem('selectedUpg');
    let religion = null;
    if (selectedUpgJson) {
        try {
            const upgData = JSON.parse(selectedUpgJson);
            religion = upgData.religion;
        } catch (e) {
            console.error('Failed to parse selectedUpg:', e);
        }
    }

    const baseUrl = 'https://upg-resources.s3.ap-southeast-2.amazonaws.com/images/upg-profiles';

    // Build URLs: {country}/{religion}/{gender}.jpg
    // If no religion, just use {country}/{gender}.jpg
    let femaleImageUrl, maleImageUrl;
    if (religion) {
        femaleImageUrl = `${baseUrl}/${country}/${religion}/female.jpg`;
        maleImageUrl = `${baseUrl}/${country}/${religion}/male.jpg`;
    } else {
        femaleImageUrl = `${baseUrl}/${country}/female.jpg`;
        maleImageUrl = `${baseUrl}/${country}/male.jpg`;
    }

    const femaleImg = document.getElementById(`${sectionPrefix}-image-female`);
    const maleImg = document.getElementById(`${sectionPrefix}-image-male`);

    const placeholderImage = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
            <rect width="200" height="300" fill="#f0f0f0"/>
            <text x="50%" y="50%" text-anchor="middle" fill="#999" font-family="Arial" font-size="14">No image here yet!</text>
        </svg>
    `);

    if (femaleImg) {
        // Show skeleton loading animation
        femaleImg.classList.add('loading');
        femaleImg.src = '';
        femaleImg.style.display = 'block';

        // Create a new image to test if it loads
        const testImg = new Image();
        testImg.onload = function() {
            femaleImg.src = femaleImageUrl;
            femaleImg.classList.remove('loading');
        };
        testImg.onerror = function() {
            femaleImg.src = placeholderImage;
            femaleImg.classList.remove('loading');
        };
        testImg.src = femaleImageUrl;
    }
    if (maleImg) {
        // Show skeleton loading animation
        maleImg.classList.add('loading');
        maleImg.src = '';
        maleImg.style.display = 'block';

        // Create a new image to test if it loads
        const testImg = new Image();
        testImg.onload = function() {
            maleImg.src = maleImageUrl;
            maleImg.classList.remove('loading');
        };
        testImg.onerror = function() {
            maleImg.src = placeholderImage;
            maleImg.classList.remove('loading');
        };
        testImg.src = maleImageUrl;
    }
}

// Country code mapping
const countryCodeMap = {
    'afghanistan': 'af',
    'azerbaijan': 'az',
    'bangladesh': 'bd',
    'cambodia': 'kh',
    'china': 'cn',
    'ethiopia': 'et',
    'guinea': 'gn',
    'india': 'in',
    'indonesia': 'id',
    'iran': 'ir',
    'iraq': 'iq',
    'japan': 'jp',
    'kazakhstan': 'kz',
    'laos': 'la',
    'malaysia': 'my',
    'mali': 'ml',
    'mongolia': 'mn',
    'morocco': 'ma',
    'myanmar': 'mm',
    'nepal': 'np',
    'niger': 'ne',
    'nigeria': 'ng',
    'pakistan': 'pk',
    'saudi arabia': 'sa',
    'senegal': 'sn',
    'somalia': 'so',
    'sri lanka': 'lk',
    'tajikistan': 'tj',
    'thailand': 'th',
    'turkey': 'tr',
    'uzbekistan': 'uz',
    'vietnam': 'vn'
};

// Country outline initialization function using SVG
function initializeCountryOutline(countryName) {
    const container = document.getElementById('country-outline');
    if (!container) return;

    // Check if countryName is null or undefined
    if (!countryName) {
        console.warn('Country name is null or undefined');
        container.innerHTML = '<div style="color: #999; font-size: 0.8rem; text-align: center;">Country map not available</div>';
        return;
    }

    // Get country code
    const countryCode = countryCodeMap[countryName.toLowerCase()];

    if (!countryCode) {
        console.warn(`Country code not found for: ${countryName}`);
        container.innerHTML = '<div style="color: #999; font-size: 0.8rem; text-align: center;">Country map not available</div>';
        return;
    }

    // Build SVG path - relative to details.html location
    const svgPath = `../mapsicon/all/${countryCode}/vector.svg`;

    // Create img element for SVG
    const img = document.createElement('img');
    img.src = svgPath;
    img.alt = `${countryName} outline`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.filter = 'brightness(0)'; // Make it black

    img.onerror = function () {
        console.warn(`SVG not found at: ${svgPath}`);
        container.innerHTML = '<div style="color: #999; font-size: 0.8rem; text-align: center;">Country map not available</div>';
    };

    // Clear and add to container
    container.innerHTML = '';
    container.appendChild(img);
}

// Map initialization function with amCharts 5 globe
function initializeMap(lat, lon) {
    // If the map already exists, dispose of it first
    if (am5Root) {
        return; // already initialized
    }

    // Use default coordinates if not provided
    const latitude = lat || 27.7172;
    const longitude = lon || 85.3240;

    // Initialize overview map
    createGlobeMap('map', latitude, longitude);
}

function createGlobeMap(containerId, lat, lon) {
    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) return;

    // Clear any existing content
    mapContainer.innerHTML = '';

    // Detect screen size - use globe for screens wider than 1024px
    const isLargeScreen = window.innerWidth > 1024;
    const useGlobe = containerId !== 'digital-map' ? isLargeScreen : true; // force globe for primary map

    // Update container styling based on map type
    if (useGlobe) {
        mapContainer.style.background = 'transparent';
        mapContainer.style.backdropFilter = 'none';
        mapContainer.style.border = 'none';
        mapContainer.style.boxShadow = 'none';
    } else {
        mapContainer.style.background = 'rgba(255, 255, 255, 0.5)';
        mapContainer.style.backdropFilter = 'blur(10px)';
        mapContainer.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        mapContainer.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
    }

    // clear any existing root
    if (am5Root) {
        am5Root.dispose();
    }

    // Create root element
    am5Root = am5.Root.new(containerId);

    // Set themes
    am5Root.setThemes([am5themes_Animated.new(am5Root)]);

    // Create the map chart with appropriate projection
    const chart = am5Root.container.children.push(
        am5map.MapChart.new(am5Root, {
            projection: useGlobe ? am5map.geoOrthographic() : am5map.geoMercator(),
            panX: useGlobe ? "rotateX" : "none",
            panY: useGlobe ? "rotateY" : "none",
            wheelY: useGlobe ? "none" : "none",
            maxPanOut: 0
        })
    );

    // Disable interaction for flat map
    // if (!useGlobe) {
    chart.set("zoomControl", null);
    chart.chartContainer.set("interactive", false);
    // }

    // Create background series (ocean)
    const backgroundSeries = chart.series.push(
        am5map.MapPolygonSeries.new(am5Root, {})
    );

    // Use more saturated blue ocean color
    backgroundSeries.mapPolygons.template.setAll({
        fill: am5.color("#bbdefb"),
        fillOpacity: 1,
        strokeOpacity: 0
    });

    backgroundSeries.data.push({
        geometry: am5map.getGeoRectangle(90, 180, -90, -180)
    });

    // Create main polygon series for countries
    const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(am5Root, {
            geoJSON: am5geodata_worldLow
        })
    );

    // Style the countries with white/grey/blue theme
    polygonSeries.mapPolygons.template.setAll({
        fill: am5.color("#f5f5f5"),
        fillOpacity: 0.9,
        strokeWidth: 0.8,
        stroke: am5.color("#9e9e9e"),
        tooltipText: "{name}"
    });

    // Add hover effects
    polygonSeries.mapPolygons.template.states.create("hover", {
        fill: am5.color("#222"),
        fillOpacity: 0.8
    });

    // Create point series for the location marker
    const pointSeries = chart.series.push(
        am5map.MapPointSeries.new(am5Root, {})
    );

    pointSeries.bullets.push(function () {
        const circle = am5.Circle.new(am5Root, {
            radius: 8,
            fill: am5.color("#2196f3"),
            stroke: am5.color("#ffffff"),
            strokeWidth: 2,
            tooltipText: "{title}"
        });

        return am5.Bullet.new(am5Root, {
            sprite: circle
        });
    });

    // Add the point
    pointSeries.data.setAll([{
        geometry: { type: "Point", coordinates: [lon, lat] },
        title: "UPG Location"
    }]);

    if (useGlobe) {
        // Rotate globe to center on the location
        chart.animate({
            key: "rotationX",
            to: -lon,
            duration: 1500,
            easing: am5.ease.inOut(am5.ease.cubic)
        });

        chart.animate({
            key: "rotationY",
            to: -lat,
            duration: 1500,
            easing: am5.ease.inOut(am5.ease.cubic)
        });
    } else {
        // For flat map, zoom to show classic horizontal world view
        chart.set("zoomLevel", 2.6);
        chart.set("centerMapOnZoomIn", false);
        chart.set("centerMapOnZoomOut", false);
        // Move map up by translating vertically
        chart.chartContainer.set("dy", 80);
    }

    // Make stuff animate on load
    chart.appear(1000, 100);

    // Re-initialize on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newIsLargeScreen = window.innerWidth > 1024;
            if (newIsLargeScreen !== isLargeScreen) {
                // Screen size category changed, recreate the map
                am5Root.dispose();
                createGlobeMap(containerId, lat, lon);
            }
        }, 250);
    });
}

// Data type filter functionality for Digital Learning tab
document.addEventListener('DOMContentLoaded', () => {
    const dataTypeButtons = document.querySelectorAll('.data-type-button');
    const insightSection = document.getElementById('insight-data-section');
    const quizSection = document.getElementById('quiz-data-section');
    const hypothesisSection = document.getElementById('hypothesis-data-section');

    dataTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            dataTypeButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            const dataType = button.getAttribute('data-type');

            // Show/hide sections based on selection
            if (dataType === 'all') {
                insightSection.style.display = 'block';
                quizSection.style.display = 'block';
                hypothesisSection.style.display = 'block';
            } else if (dataType === 'insight') {
                insightSection.style.display = 'block';
                quizSection.style.display = 'none';
                hypothesisSection.style.display = 'none';
            } else if (dataType === 'quizzes') {
                insightSection.style.display = 'none';
                quizSection.style.display = 'block';
                hypothesisSection.style.display = 'none';
            } else if (dataType === 'hypothesis') {
                insightSection.style.display = 'none';
                quizSection.style.display = 'none';
                hypothesisSection.style.display = 'block';
                loadHypothesisData();
            }
        });
    });

    insightSection.style.display = 'block';
    quizSection.style.display = 'none';
    hypothesisSection.style.display = 'none';

    // Load data in the background
    loadDigitalMetrics();
    loadHypothesisData();

    // Load sample metrics data for Digital Learning

    // Load hypothesis data

    // Add event listener to filter button to reload hypothesis data when country changes
    // const filterButton = document.querySelector('.filter-button');
    // if (filterButton) {
    //     filterButton.addEventListener('click', () => {
    //         // Reload hypothesis data when filter is applied
    //         loadHypothesisData();
    //     });
    // }

    // // Also reload when dropdown selection changes (country only affects data, not map)
    // const countriesMenu = document.getElementById('countries-menu');
    // if (countriesMenu) {
    //     countriesMenu.addEventListener('click', (e) => {
    //         const option = e.target.closest('.dropdown-option');
    //         if (option) {
    //             setTimeout(() => {
    //                 loadHypothesisData();
    //                 const testimoniesContent = document.getElementById('testimonies-content');
    //                 if (testimoniesContent && testimoniesContent.classList.contains('active')) {
    //                     loadTestimoniesData();
    //                 }
    //             }, 100);
    //         }
    //     });
    // }
});

// Load Top Performing Metrics for Overview tab
async function loadTopPerformingMetrics() {
    const retentionRateEl = document.getElementById('top-retention-rate');
    const itjCountEl = document.getElementById('itj-count-95');
    const ctrEl = document.getElementById('top-ctr');
    const goalCompletionEl = document.getElementById('top-goal-completion');

    // Set loading state
    if (retentionRateEl) retentionRateEl.textContent = 'Loading...';
    if (itjCountEl) itjCountEl.textContent = 'Loading...';
    if (ctrEl) ctrEl.textContent = 'Loading...';
    if (goalCompletionEl) goalCompletionEl.textContent = 'Loading...';

    try {
        // Get the language from the selected UPG
        const selectedUpgJson = sessionStorage.getItem('selectedUpg');
        let languageCode = null;

        if (selectedUpgJson) {
            const upgData = JSON.parse(selectedUpgJson);
            const languageNameToCode = {
                // Buddhist languages
                'Japanese': 'jpn', 'Burmese': 'mya', 'Thai': 'tha', 'Khmer': 'khm',
                'Shan': 'shn', 'Lao': 'lao', 'Vietnamese': 'vie', 'Rakhine': 'rki',
                'Sinhalese': 'sin',
                // Hinduism languages
                'Bengali': 'ben', 'Bangla': 'ben', 'Gujarati': 'guj', 'Hindi': 'hin',
                'Marathi': 'mar', 'Nepali': 'nep', 'Oriya (Macrolanguage)': 'ori', 'Oriya': 'ori',
                // Islam languages
                'Khaliji (Gulf) Arabic': 'afb', 'Bambara': 'bam', 'Banjar': 'bjn',
                'Dari': 'prs', 'Algerian Darija/Amazigh': 'arq', 'Hausa': 'hau',
                'Indonesian': 'ind', 'Musi': 'mui', 'Pashto AF': 'pbt', 'Pashto Pak': 'pbt',
                'Saraiki': 'skr', 'Sindhi': 'snd', 'Somali': 'som', 'Sundanese': 'sun',
                'Turkish': 'tur', 'Urdu': 'urd', 'Uzbek': 'uzb', 'Kazakh': 'kaz',
                'Wolof': 'wol',
                // Other languages
                'French': 'fra', 'Russian': 'rus'
            };

            const languageName = upgData.name || upgData.language;
            if (languageName) {
                languageCode = languageNameToCode[languageName] || null;
                if (!languageCode) {
                    const lowerName = languageName.toLowerCase();
                    const matchedKey = Object.keys(languageNameToCode).find(
                        key => key.toLowerCase() === lowerName
                    );
                    if (matchedKey) languageCode = languageNameToCode[matchedKey];
                }
            }
        }

        // Only fetch metrics if we have a valid language code
        if (!languageCode) {
            if (retentionRateEl) retentionRateEl.textContent = 'N/A';
            if (itjCountEl) itjCountEl.textContent = 'N/A';
            if (ctrEl) ctrEl.textContent = 'N/A';
            if (goalCompletionEl) goalCompletionEl.textContent = 'N/A';
            return;
        }

        // Fetch metrics data from upg_digital_learning table
        const metricsData = await getDigitalLearningMetrics({ languageCode: languageCode });

        if (!metricsData || metricsData.length === 0) {
            if (retentionRateEl) retentionRateEl.textContent = 'N/A';
            if (itjCountEl) itjCountEl.textContent = 'N/A';
            if (ctrEl) ctrEl.textContent = 'N/A';
            if (goalCompletionEl) goalCompletionEl.textContent = 'N/A';
            return;
        }

        // Convert array to object keyed by metric_title for easy lookup
        // Sum up all numeric values for each metric_title across all country codes
        const metricsMap = {};
        metricsData.forEach(row => {
            if (row.metric_title && row.metric_value !== null && row.metric_value !== undefined) {
                const currentValue = row.metric_value;

                if (!metricsMap[row.metric_title]) {
                    // First occurrence - initialize with this value
                    metricsMap[row.metric_title] = currentValue;
                } else {
                    // Subsequent occurrence - try to sum if both are numeric
                    const currentNum = parseFloat(String(currentValue).replace(/,/g, ''));
                    const existingValue = metricsMap[row.metric_title];
                    const existingNum = parseFloat(String(existingValue).replace(/,/g, ''));

                    if (!isNaN(currentNum) && !isNaN(existingNum)) {
                        // Both are numbers - sum them
                        metricsMap[row.metric_title] = (existingNum + currentNum).toString();
                    }
                    // If either is not a number, keep the existing value (first occurrence)
                }
            }
        });

        // Debug: log available metric titles
        console.log('Available metric titles:', Object.keys(metricsMap));

        // Helper function to find metric by partial case-insensitive match
        function findMetric(searchTerms) {
            for (const term of searchTerms) {
                // Try exact match first
                if (metricsMap[term] !== undefined) {
                    return metricsMap[term];
                }
            }
            // Try case-insensitive partial match
            for (const term of searchTerms) {
                const lowerTerm = term.toLowerCase();
                for (const [key, value] of Object.entries(metricsMap)) {
                    if (key.toLowerCase().includes(lowerTerm) || lowerTerm.includes(key.toLowerCase())) {
                        return value;
                    }
                }
            }
            return undefined;
        }

        // Update UI with values from the database
        if (retentionRateEl) {
            const retentionRate = findMetric(['Avg. Retention Rate', 'AVG. RETENTION RATE', 'retention rate', 'avg retention']);
            if (retentionRate !== undefined) {
                const numValue = parseFloat(retentionRate);
                retentionRateEl.textContent = !isNaN(numValue) ? `${numValue.toFixed(2)}%` : retentionRate;
            } else {
                retentionRateEl.textContent = 'N/A';
            }
        }

        if (itjCountEl) {
            const itjCount = findMetric([
                'Video Completion (95%) Count',
                'VIDEO COMPLETION (95%) COUNT',
                'video completion',
                '95%',
                'completion count'
            ]);
            if (itjCount !== undefined) {
                const numValue = parseFloat(itjCount);
                itjCountEl.textContent = !isNaN(numValue) ? `${numValue.toLocaleString()} views` : itjCount;
            } else {
                console.log('ITJ Count not found in:', Object.keys(metricsMap));
                itjCountEl.textContent = 'N/A';
            }
        }

        if (ctrEl) {
            const ctr = findMetric(['Message Impact (CTR)', 'MESSAGE IMPACT (CTR)', 'message impact ctr', 'ctr']);
            if (ctr !== undefined) {
                const numValue = parseFloat(ctr);
                ctrEl.textContent = !isNaN(numValue) ? `${numValue.toFixed(2)}%` : ctr;
            } else {
                ctrEl.textContent = 'N/A';
            }
        }

        if (goalCompletionEl) {
            const goalCompletion = findMetric(['Goal Completion %', 'GOAL COMPLETION %', 'goal completion']);
            if (goalCompletion !== undefined) {
                const numValue = parseFloat(goalCompletion);
                goalCompletionEl.textContent = !isNaN(numValue) ? `${numValue.toFixed(1)}%` : goalCompletion;
            } else {
                goalCompletionEl.textContent = 'N/A';
            }
        }

    } catch (error) {
        console.error('Error loading top performing metrics:', error);
        if (retentionRateEl) retentionRateEl.textContent = 'Error';
        if (itjCountEl) itjCountEl.textContent = 'Error';
        if (ctrEl) ctrEl.textContent = 'Error';
        if (goalCompletionEl) goalCompletionEl.textContent = 'Error';
    }
}

// Load Digital Learning Metrics
async function loadDigitalMetrics() {
    const metricsTable = document.getElementById('digital-metrics-table');

    // Show loading state
    metricsTable.innerHTML = '<div class="loading-message">Loading metrics data...</div>';

    try {
        // Get the language from the selected UPG in sessionStorage
        const selectedUpgJson = sessionStorage.getItem('selectedUpg');
        let languageCode = null;

        if (selectedUpgJson) {
            try {
                const upgData = JSON.parse(selectedUpgJson);

                // Map language names to 3-letter ISO 639-3 codes
                const languageNameToCode = {
                    // Buddhist languages
                    'Japanese': 'jpn', 'Burmese': 'mya', 'Thai': 'tha', 'Khmer': 'khm',
                    'Shan': 'shn', 'Lao': 'lao', 'Vietnamese': 'vie', 'Rakhine': 'rki',
                    'Sinhalese': 'sin',
                    // Hinduism languages
                    'Bengali': 'ben', 'Bangla': 'ben', 'Gujarati': 'guj', 'Hindi': 'hin',
                    'Marathi': 'mar', 'Nepali': 'nep', 'Oriya (Macrolanguage)': 'ori', 'Oriya': 'ori',
                    // Islam languages
                    'Khaliji (Gulf) Arabic': 'afb', 'Bambara': 'bam', 'Banjar': 'bjn',
                    'Dari': 'prs', 'Algerian Darija/Amazigh': 'arq', 'Hausa': 'hau',
                    'Indonesian': 'ind', 'Musi': 'mui', 'Pashto AF': 'pbt', 'Pashto Pak': 'pbt',
                    'Saraiki': 'skr', 'Sindhi': 'snd', 'Somali': 'som', 'Sundanese': 'sun',
                    'Turkish': 'tur', 'Urdu': 'urd', 'Uzbek': 'uzb', 'Kazakh': 'kaz',
                    'Wolof': 'wol',
                    // Other languages
                    'French': 'fra', 'Russian': 'rus'
                };

                // Get the language name from UPG data
                const languageName = upgData.name || upgData.language;

                // Try to map it to a code
                if (languageName) {
                    languageCode = languageNameToCode[languageName] || null;

                    // If no exact match, try case-insensitive
                    if (!languageCode) {
                        const lowerName = languageName.toLowerCase();
                        const matchedKey = Object.keys(languageNameToCode).find(
                            key => key.toLowerCase() === lowerName
                        );
                        if (matchedKey) {
                            languageCode = languageNameToCode[matchedKey];
                        }
                    }
                }

                console.log('Language from UPG:', languageName, '-> Code:', languageCode, upgData);
            } catch (e) {
                console.error('Error parsing selectedUpg:', e);
            }
        }

        // Only fetch metrics if we have a valid language code
        if (!languageCode) {
            metricsTable.innerHTML = '<div class="loading-message">No digital learning metrics available for this selection.</div>';
            return;
        }

        // Fetch the digital learning metrics data
        let metricsData;
        try {
            metricsData = await getDigitalLearningMetrics({ languageCode: languageCode });
        } catch (error) {
            console.warn('Error loading metrics:', error);

            // Check if it's a "table not found" error
            if (error.message && error.message.includes('does not exist')) {
                metricsTable.innerHTML = `
                    <div class="loading-message" style="padding: 40px; text-align: center;">
                        <h3 style="margin-bottom: 16px; color: #666;">Database Table Not Available</h3>
                        <p style="color: #888; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                            The table <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">upg_digital_learnings</code>
                            does not exist in the PostgreSQL database that the Lambda connects to.
                            <br><br>
                            Please create this table in PostgreSQL or update the query to use an existing table.
                        </p>
                    </div>
                `;
            } else {
                metricsTable.innerHTML = '<div class="loading-message">Error loading metrics data. Please try again.</div>';
            }
            return;
        }

        if (!metricsData || metricsData.length === 0) {
            metricsTable.innerHTML = '<div class="loading-message">No metrics data available for this language.</div>';
            return;
        }

        // Sum up duplicates and handle special cases like gender separation
        const processedMetrics = [];
        const metricsSumMap = {}; // Map to track summed values by metric_title

        metricsData.forEach(row => {
            if (!row.metric_title) {
                return; // Skip empty titles
            }

            // Check if this is a gender-combined metric that should be split
            // Pattern: "female: value1, male: value2" or similar
            const valueStr = String(row.metric_value || '');
            const genderPattern = /(female|male|unknown):\s*([^,]+)/gi;
            const genderMatches = [...valueStr.matchAll(genderPattern)];

            if (genderMatches.length > 1 && row.metric_title.toLowerCase().includes('gender')) {
                // Split into separate metrics with clearer labels
                genderMatches.forEach(match => {
                    const gender = match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
                    const value = match[2].trim();

                    // Create a clearer title by replacing "Gender" with the actual gender
                    let newTitle = row.metric_title.replace(/\(gender\)/gi, `- ${gender}`);
                    if (!newTitle.includes(gender)) {
                        // If the replacement didn't work, append it
                        newTitle = `${row.metric_title} - ${gender}`;
                    }

                    // Sum up if we've seen this title before
                    if (!metricsSumMap[newTitle]) {
                        metricsSumMap[newTitle] = {
                            ...row,
                            metric_title: newTitle,
                            metric_value: value
                        };
                    } else {
                        // Try to sum numeric values
                        const currentNum = parseFloat(String(value).replace(/,/g, ''));
                        const existingNum = parseFloat(String(metricsSumMap[newTitle].metric_value).replace(/,/g, ''));

                        if (!isNaN(currentNum) && !isNaN(existingNum)) {
                            metricsSumMap[newTitle].metric_value = (existingNum + currentNum).toString();
                        }
                    }
                });
            } else {
                // Sum up if we've seen this title before
                if (!metricsSumMap[row.metric_title]) {
                    metricsSumMap[row.metric_title] = { ...row };
                } else {
                    // Try to sum numeric values
                    const currentNum = parseFloat(String(row.metric_value).replace(/,/g, ''));
                    const existingNum = parseFloat(String(metricsSumMap[row.metric_title].metric_value).replace(/,/g, ''));

                    if (!isNaN(currentNum) && !isNaN(existingNum)) {
                        metricsSumMap[row.metric_title].metric_value = (existingNum + currentNum).toString();
                    }
                }
            }
        });

        // Recalculate gender percentages excluding Unknown from total
        const femaleKey = Object.keys(metricsSumMap).find(k => k.includes('Gender') && k.includes('Female'));
        const maleKey = Object.keys(metricsSumMap).find(k => k.includes('Gender') && k.includes('Male'));

        if (femaleKey && maleKey && metricsSumMap[femaleKey] && metricsSumMap[maleKey]) {
            const femaleVal = parseFloat(String(metricsSumMap[femaleKey].metric_value).replace(/[,%]/g, ''));
            const maleVal = parseFloat(String(metricsSumMap[maleKey].metric_value).replace(/[,%]/g, ''));

            if (!isNaN(femaleVal) && !isNaN(maleVal)) {
                const totalExclUnknown = femaleVal + maleVal;
                if (totalExclUnknown > 0) {
                    metricsSumMap[femaleKey].metric_value = ((femaleVal / totalExclUnknown) * 100).toFixed(1);
                    metricsSumMap[maleKey].metric_value = ((maleVal / totalExclUnknown) * 100).toFixed(1);
                }
            }
        }

        // Metrics to exclude from the table
        const excludedMetrics = [
            'Peak Engagement Theme',
            'UPG Interest',
            'Theme Engagement - Unknown',
            'Performance: Gender - Unknown'
        ];

        // Rename map: database metric title -> new display title
        const metricRenames = {
            'Video Completion (95%) count': 'Video Completion (95%) Count',
            'UPG Efficiency (CPA)': 'CPA for paid advertising',
            'Age Segments (Top by messages)': 'Most Engaged Age Group (by FJ)',
            'Message Impact (CTR)': 'Message Click Rate (CTR)',
            'Avg. Retention Rate': 'Video View Retention Rate',
            'Theme Engagement - Female': 'Most Engaging Theme for Female Users',
            'Theme Engagement - Male': 'Most Engaging Theme for Male Users',
            'Message Cost (Theme)': 'Most Impactful Theme',
            'Performance: Gender - Female': 'Share of Female audience in total Reach',
            'Performance: Gender - Male': 'Share of Male audience in total Reach',
            'Goal Completion %': '% of clicks became FJs'
        };

        // Convert map back to array, filtering out excluded metrics and applying renames
        Object.values(metricsSumMap).forEach(metric => {
            const title = metric.metric_title || '';
            if (!excludedMetrics.includes(title)) {
                // Apply rename if one exists
                if (metricRenames[title]) {
                    metric.metric_title = metricRenames[title];
                }
                processedMetrics.push(metric);
            }
        });

        console.log('Original metrics count:', metricsData.length);
        console.log('Processed metrics count:', processedMetrics.length);

        // Tooltip descriptions for each metric (using new display names)
        const metricDescriptions = {
            'Message Impact': 'Effectiveness of messaging and creatives',
            'Message Click Rate (CTR)': '% of people who clicked to learn more out of those who saw the message',
            '% of clicks became FJs': '% of engaged audience that started their Faith Journey',
            'UPG Efficiency': 'Campaign efficiency in acquiring leads from a People Group',
            'CPA for paid advertising': 'Cost per started conversation',
            'Sentiment Tone (Paid)': 'Qualitative tone of feedback (positive/negative/neutral)',
            'Sentiment Tone (Organic)': 'Qualitative tone of feedback (positive/negative/neutral)',
            'Language': '3-letter language code according to ISO 639-2',
            'Performance: Gender': 'Split performance by gender',
            'Share of Female audience in total Reach': '% of female users in total number of those who was reached by the message',
            'Share of Male audience in total Reach': '% of male users in total number of those who was reached by the message',
            'Age Segments': 'Performance by age segments',
            'Most Engaged Age Group (by FJ)': 'Age range most often engaged on the Faith Journey',
            'Most Impactful Theme': 'Theme with the lowest cost per Faith Journey',
            'Theme Engagement (Gender)': 'Engagement rate per theme by gender',
            'Most Engaging Theme for Female Users': 'Theme with the highest Engagement Rate among female audience',
            'Most Engaging Theme for Male Users': 'Theme with the highest Engagement Rate among male audience',
            'Video Completion (95%)': 'Number of viewers who watched 95% or more',
            'Video Completion (95%) Count': 'Number of viewers who watched 95% or more',
            'Top Performing Ad': 'Ads (by ad_id/creative_id) with best CTR or lowest cost per result',
            'Top Performing Ad URL': 'The most clickable (highest CTR) and/or most impactful (lowest CPA) ad content',
            'Video View Retention Rate': 'Average % of video duration watched by viewers'
        };

        // Sort metrics to ensure Language always comes first
        processedMetrics.sort((a, b) => {
            const aIsLanguage = a.metric_title && a.metric_title.toLowerCase().includes('language');
            const bIsLanguage = b.metric_title && b.metric_title.toLowerCase().includes('language');

            if (aIsLanguage && !bIsLanguage) return -1;
            if (!aIsLanguage && bIsLanguage) return 1;
            return 0; // Keep original order for other items
        });

        // Generate metric cards dynamically from the database
        // Each row has: metric_title, metric_value, language_code, country_code
        const cardsHTML = processedMetrics.map(row => {
            let displayValue = row.metric_value;

            // Remove (CPA: ...) pattern from display values
            if (typeof displayValue === 'string') {
                displayValue = displayValue.replace(/\s*\(CPA:\s*[\d.]+\)\s*/gi, '').trim();
            }

            // Truncate very long text values
            if (typeof displayValue === 'string' && displayValue.length > 100) {
                displayValue = displayValue.substring(0, 97) + '...';
            }

            // Special formatting for Video Completion (95%) Count - append "views"
            if (row.metric_title === 'Video Completion (95%) Count') {
                const numVal = parseFloat(row.metric_value);
                if (!isNaN(numVal)) {
                    displayValue = `${numVal.toLocaleString()} views`;
                }
            }
            // Special formatting for "% of clicks became FJs" - 1 decimal, percentage
            else if (row.metric_title === '% of clicks became FJs') {
                const numVal = parseFloat(row.metric_value);
                if (!isNaN(numVal)) {
                    displayValue = `${numVal.toFixed(1)}%`;
                }
            }
            // Special formatting for "Most Engaged Age Group (by FJ)" - age range with y.o.
            else if (row.metric_title === 'Most Engaged Age Group (by FJ)') {
                // If value is a single number, convert to a range
                const numVal = parseFloat(row.metric_value);
                if (!isNaN(numVal) && !String(row.metric_value).includes('–') && !String(row.metric_value).includes('-')) {
                    if (numVal < 18) displayValue = 'under 18 y.o.';
                    else if (numVal <= 24) displayValue = '18 – 24 y.o.';
                    else if (numVal <= 35) displayValue = '25 – 35 y.o.';
                    else if (numVal <= 49) displayValue = '36 – 49 y.o.';
                    else if (numVal <= 65) displayValue = '50 – 65 y.o.';
                    else displayValue = '65+ y.o.';
                } else {
                    // Already a range or text, just append y.o. if not present
                    displayValue = String(row.metric_value);
                    if (!displayValue.toLowerCase().includes('y.o.')) {
                        displayValue = displayValue + ' y.o.';
                    }
                }
            }
            // Special formatting for Share of audience in total Reach - percentage
            else if (row.metric_title && row.metric_title.startsWith('Share of') && row.metric_title.includes('audience in total Reach')) {
                const numVal = parseFloat(row.metric_value);
                if (!isNaN(numVal)) {
                    displayValue = `${numVal.toFixed(1)}%`;
                }
            }
            // Apply formatting formulas for numeric values
            else {
            const numValue = parseFloat(row.metric_value);
            if (!isNaN(numValue)) {
                // Check if the metric title suggests a percentage
                if (row.metric_title && (
                    row.metric_title.toLowerCase().includes('rate') ||
                    row.metric_title.toLowerCase().includes('percentage') ||
                    row.metric_title.toLowerCase().includes('ctr')
                )) {
                    displayValue = `${numValue.toFixed(2)}%`;
                }
                // Check if the metric title suggests currency
                else if (row.metric_title && (
                    row.metric_title.toLowerCase().includes('cost') ||
                    row.metric_title.toLowerCase().includes('cpa') ||
                    row.metric_title.toLowerCase().includes('price') ||
                    row.metric_title.toLowerCase().includes('spend')
                )) {
                    displayValue = `$${numValue.toFixed(2)} AUD`;
                }
                // For counts and other numbers, use locale formatting
                else if (row.metric_title && (
                    row.metric_title.toLowerCase().includes('count') ||
                    row.metric_title.toLowerCase().includes('views') ||
                    row.metric_title.toLowerCase().includes('itj')
                )) {
                    displayValue = numValue.toLocaleString();
                }
                // Default numeric formatting
                else {
                    displayValue = numValue.toLocaleString();
                }
            }
            } // end else (general formatting)

            // Use smaller text for all metric cards, extra small for Top Performing Ad
            let valueClass = 'metric-card-value small';
            const isTopPerformingAd = row.metric_title && row.metric_title.toLowerCase().includes('top performing ad');

            if (isTopPerformingAd) {
                valueClass = 'metric-card-value extra-small';
            }

            // Get tooltip description for this metric
            const tooltipText = metricDescriptions[row.metric_title] || '';
            const tooltipHTML = tooltipText ? `
                <span class="metric-tooltip-icon" data-tooltip="${tooltipText}">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7" cy="7" r="6.5" stroke="currentColor" stroke-width="1"/>
                        <text x="7" y="10.5" text-anchor="middle" font-size="10" font-weight="600" fill="currentColor">?</text>
                    </svg>
                </span>
            ` : '';

            // Check if this is a URL field and make it clickable
            const isUrlField = row.metric_title && row.metric_title.toLowerCase().includes('url');
            let valueHTML = displayValue;

            if (isUrlField && typeof row.metric_value === 'string' && (row.metric_value.startsWith('http://') || row.metric_value.startsWith('https://'))) {
                valueHTML = `<a href="${row.metric_value}" target="_blank" class="metric-url-link">View Ad</a>`;
            }

            return `
                <div class="metric-card">
                    <div class="metric-card-label" title="${row.metric_title || 'Unknown Metric'}">
                        ${row.metric_title || 'Unknown Metric'}${tooltipHTML}
                    </div>
                    <div class="${valueClass}" title="${displayValue}">${valueHTML}</div>
                </div>
            `;
        }).join('');

        // Generate HTML with a wrapper that handles centering the last row
        const metricsHTML = `
            <div class="metrics-grid-wrapper">
                ${cardsHTML}
            </div>
        `;

        metricsTable.innerHTML = metricsHTML;

        // Create tooltip element
        let tooltip = document.querySelector('.metric-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'metric-tooltip';
            document.body.appendChild(tooltip);
        }

        // Setup tooltip functionality
        const tooltipIcons = metricsTable.querySelectorAll('.metric-tooltip-icon');
        tooltipIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                if (!tooltipText) return;

                tooltip.textContent = tooltipText;
                tooltip.style.display = 'block';

                const rect = this.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();

                // Calculate position
                let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                let top = rect.top - tooltipRect.height - 10;

                // Adjust if tooltip would go off-screen
                if (left < 10) {
                    left = 10;
                } else if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }

                if (top < 10) {
                    top = rect.bottom + 10;
                }

                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.opacity = '1';
            });

            icon.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    if (tooltip.style.opacity === '0') {
                        tooltip.style.display = 'none';
                    }
                }, 200);
            });
        });

    } catch (error) {
        console.error('Error loading digital metrics:', error);
        metricsTable.innerHTML = '<div class="loading-message">Error loading metrics data. Please try again.</div>';
    }
}

// Helper function to calculate metrics from raw data
function calculateMetrics(data) {
    // Aggregate totals
    let totalEngagements = 0;
    let totalReach = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalSpend = 0;
    let totalMessages = 0;
    let totalUniqueClicks = 0;
    let totalVideo95Views = 0;

    // For categorization
    const languages = {};
    const genders = {};
    const ages = {};
    const themes = {};

    data.forEach(row => {
        // Parse numeric values safely
        const engagement = parseFloat(row.post_engagement) || 0;
        const reach = parseFloat(row.reach) || 0;
        const imps = parseFloat(row.imps) || 0;
        const clicks = parseFloat(row.clicks) || 0;
        const spend = parseFloat(row.spend) || 0;
        const messages = parseFloat(row.messaging_conversation_started_7d) || 0;
        const uniqueClicks = parseFloat(row.unique_link_click) || 0;
        const video95 = parseFloat(row.video_p95_watched_actions) || 0;

        totalEngagements += engagement;
        totalReach += reach;
        totalImpressions += imps;
        totalClicks += clicks;
        totalSpend += spend;
        totalMessages += messages;
        totalUniqueClicks += uniqueClicks;
        totalVideo95Views += video95;

        // Track language
        if (row.extracted_language_code) {
            languages[row.extracted_language_code] = (languages[row.extracted_language_code] || 0) + 1;
        }

        // Track gender
        if (row.gender) {
            genders[row.gender] = (genders[row.gender] || 0) + engagement;
        }

        // Track age
        if (row.age) {
            ages[row.age] = (ages[row.age] || 0) + engagement;
        }

        // Track themes (use the theme column from the view)
        if (row.theme) {
            if (!themes[row.theme]) {
                themes[row.theme] = { engagement: 0, clicks: 0, imps: 0 };
            }
            themes[row.theme].engagement += engagement;
            themes[row.theme].clicks += clicks;
            themes[row.theme].imps += imps;
        }
    });

    // Calculate derived metrics
    const engagementRate = totalImpressions > 0 ? ((totalEngagements / totalImpressions) * 100).toFixed(2) : '0.00';
    const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';
    const conversionRate = totalUniqueClicks > 0 ? ((totalMessages / totalUniqueClicks) * 100).toFixed(2) : '0.00';
    const cpa = totalMessages > 0 ? (totalSpend / totalMessages).toFixed(2) : '0.00';

    // Find top language
    const topLanguage = Object.keys(languages).length > 0
        ? Object.keys(languages).reduce((a, b) => languages[a] > languages[b] ? a : b)
        : 'N/A';

    // Find top gender
    const topGender = Object.keys(genders).length > 0
        ? Object.keys(genders).reduce((a, b) => genders[a] > genders[b] ? a : b)
        : 'N/A';

    // Find top age group
    const topAge = Object.keys(ages).length > 0
        ? Object.keys(ages).reduce((a, b) => ages[a] > ages[b] ? a : b)
        : 'N/A';

    // Find top theme by CTR
    let topTheme = 'N/A';
    let maxThemeCTR = 0;
    Object.keys(themes).forEach(themeName => {
        const theme = themes[themeName];
        const themeCTR = theme.imps > 0 ? (theme.clicks / theme.imps) : 0;
        if (themeCTR > maxThemeCTR) {
            maxThemeCTR = themeCTR;
            topTheme = themeName;
        }
    });

    return {
        engagementRate,
        ctr,
        conversionRate,
        cpa,
        itjCount: totalVideo95Views.toLocaleString(),
        language: topLanguage,
        genderBreakdown: topGender,
        ageGroup: topAge,
        topTheme: topTheme,
        topAd: null // Not available in aggregated data
    };
}

// Load Hypothesis Data
async function loadHypothesisData(page = 1) {
    const container = document.getElementById('hypothesis-cards-container');
    container.innerHTML = '<div class="loading-message">Loading hypothesis data...</div>';

    try {
        // Get the country from the selected UPG in sessionStorage
        const selectedUpgJson = sessionStorage.getItem('selectedUpg');
        let selectedCountry = null;

        if (selectedUpgJson) {
            try {
                const upgData = JSON.parse(selectedUpgJson);
                selectedCountry = upgData.country || null;
            } catch (e) {
                console.error('Error parsing selectedUpg:', e);
            }
        }

        let hypotheses;
        if (!selectedCountry) {
            hypotheses = await getAllHypothesisData();
        } else {
            hypotheses = await getHypothesisData(selectedCountry);
        }

        if (!hypotheses || hypotheses.length === 0) {
            const message = selectedCountry && selectedCountry !== 'All Countries'
                ? `No hypothesis data found for ${selectedCountry}.`
                : 'No hypothesis data found.';
            container.innerHTML = `<div class="loading-message">${message}</div>`;
            return;
        }

        // Pagination logic
        const pageSize = 10;
        const totalPages = Math.ceil(hypotheses.length / pageSize);
        const currentPage = Math.max(1, Math.min(page, totalPages));
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const pageHypotheses = hypotheses.slice(startIdx, endIdx);

        container.innerHTML = '';
        pageHypotheses.forEach(hypothesis => {
            const card = createHypothesisCard(hypothesis);
            container.appendChild(card);
        });

        // Pagination controls
        if (totalPages > 1) {
            const pagination = document.createElement('div');
            pagination.className = 'pagination-controls';

            const prevBtn = document.createElement('button');
            prevBtn.textContent = 'Previous';
            prevBtn.disabled = currentPage === 1;
            prevBtn.onclick = () => loadHypothesisData(currentPage - 1);

            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Next';
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.onclick = () => loadHypothesisData(currentPage + 1);

            const pageInfo = document.createElement('span');
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
            pageInfo.style.alignSelf = 'center';

            pagination.appendChild(prevBtn);
            pagination.appendChild(pageInfo);
            pagination.appendChild(nextBtn);

            container.appendChild(pagination);
        }

    } catch (error) {
        console.error('Error loading hypothesis data:', error);
        container.innerHTML = '<div class="loading-message">Error loading hypothesis data. Please try again.</div>';
    }
}

// Create a hypothesis card element
function createHypothesisCard(hypothesis) {
    const card = document.createElement('div');
    card.className = 'hypothesis-card';

    card.innerHTML = `
        <div class="hypothesis-card-header">
            <div class="hypothesis-card-country">${hypothesis.country || 'Unknown'}</div>
            <div class="hypothesis-card-year">${hypothesis.year || 'N/A'}</div>
        </div>

        <div class="hypothesis-card-section">
            <div class="hypothesis-card-label">What We're Testing</div>
            <div class="hypothesis-card-content">${hypothesis.trying_to_test || 'No data'}</div>
        </div>

        <div class="hypothesis-card-section">
            <div class="hypothesis-card-label">What We Hope to Learn</div>
            <div class="hypothesis-card-content">${hypothesis.hope_to_learn || 'No data'}</div>
        </div>

        <div class="hypothesis-card-section">
            <div class="hypothesis-card-label">What We Learned</div>
            <div class="hypothesis-card-content highlight">${hypothesis.learnt || 'No data yet'}</div>
        </div>
    `;

    return card;
}

// Image modal functions
function openImageModal(imageSrc) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');

    modalImage.src = imageSrc;
    modal.style.display = 'flex';

    // Close modal when clicking outside the image
    modal.onclick = function (event) {
        if (event.target === modal) {
            closeImageModal();
        }
    };
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}
