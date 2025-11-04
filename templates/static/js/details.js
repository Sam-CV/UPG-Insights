let am5Root; // store globally so we can dispose it

// Load navbar using shared utility
loadNavbar();

// Tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
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
                    if (selectedUpg.name && selectedUpg.country) {
                        updateQuickNumbers();
                        loadUpgImages(selectedUpg.name, selectedUpg.country);
                        initializeCountryOutline(selectedUpg.country);
                        initializeMap(selectedUpg.lat, selectedUpg.lon);
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

        updateQuickNumbers();

        loadUpgImages(upgData.name, upgData.country);
        initializeMap(upgData.lat, upgData.lon);
        initializeCountryOutline(upgData.country);

        loadSectionImages('demographic', upgData.name, upgData.country);
        loadSectionImages('testimonies', upgData.name, upgData.country);

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
                    if (demographicsData && demographicsData.population_size) {
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

    // Helper to create a section block
    const createSection = (sectionId, title, content) => {
        const block = document.createElement('div');
        block.id = `demographic-section-${sectionId}`;
        block.style.border = '1px solid #e5e7eb';
        block.style.borderRadius = '12px';
        block.style.padding = '16px';
        block.style.background = '#fff';
        block.style.marginBottom = '12px';

        block.innerHTML = `
            <div style="font-weight:700;color:#0f172a;margin-bottom:8px;">${title}</div>
            <div style="white-space:pre-line;color:#334155;line-height:1.7;">${(content || 'Coming soon...')}</div>
        `;
        return block;
    };

    // Try to fetch data from database if we have a language code
    let demographicsData = null;
    if (languageCode && typeof getUpgDemographics === 'function') {
        try {
            demographicsData = await getUpgDemographics({ languageCode });
        } catch (error) {
            console.error('Error fetching demographics:', error);
        }
    }

    // Clear container
    container.innerHTML = '';

    // If we have database data, use it; otherwise fall back to sample data
    if (demographicsData) {
        console.log('Using demographics data from database:', demographicsData);
        // Render all sections from DEMOGRAPHIC_SECTIONS array
        DEMOGRAPHIC_SECTIONS.forEach(section => {
            const content = demographicsData[section.field];
            container.appendChild(createSection(section.id, section.title, content));
        });
    } else {
        console.log('No database data found, using sample data for:', languageName);
        // Fallback to sample data if available
        if (typeof getSampleDemographicData === 'function') {
            const sample = getSampleDemographicData(languageName);
            // Only render the first 6 sections for sample data
            const sampleSections = DEMOGRAPHIC_SECTIONS.slice(0, 6);
            sampleSections.forEach(section => {
                // Map to sample data field names
                const sampleFieldMap = {
                    'introduction': 'introduction_history',
                    'everyday_lives': 'everyday_lives',
                    'demographics': 'demographics',
                    'environment': 'environment',
                    'stories_music': 'stories_music',
                    'linguistics': 'linguistics'
                };
                const content = sample[sampleFieldMap[section.field]] || sample[section.field];
                container.appendChild(createSection(section.id, section.title, content));
            });
        } else {
            // No sample data function available
            container.innerHTML = '<div class="loading-message">No demographics data available for this selection.</div>';
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

    // Get country code
    const countryCode = countryCodeMap[countryName.toLowerCase()];

    if (!countryCode) {
        console.warn(`Country code not found for: ${countryName}`);
        container.innerHTML = '<div style="color: #999; font-size: 0.8rem; text-align: center;">Country map not available</div>';
        return;
    }

    // Build SVG path
    const svgPath = `/mapsicon/all/${countryCode}/vector.svg`;

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
    const engagementRateEl = document.getElementById('top-engagement-rate');
    const ageGroupEl = document.getElementById('top-age-group');
    const topThemeEl = document.getElementById('top-theme');
    const itjCountEl = document.getElementById('itj-count-95');

    // Set loading state
    if (engagementRateEl) engagementRateEl.textContent = 'Loading...';
    if (ageGroupEl) ageGroupEl.textContent = 'Loading...';
    if (topThemeEl) topThemeEl.textContent = 'Loading...';
    if (itjCountEl) itjCountEl.textContent = 'Loading...';

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
            if (engagementRateEl) engagementRateEl.textContent = 'N/A';
            if (ageGroupEl) ageGroupEl.textContent = 'N/A';
            if (topThemeEl) topThemeEl.textContent = 'N/A';
            if (itjCountEl) itjCountEl.textContent = 'N/A';
            return;
        }

        // Fetch metrics data
        const metricsData = await getDigitalLearningMetrics({ languageCode: languageCode });

        if (!metricsData || metricsData.length === 0) {
            if (engagementRateEl) engagementRateEl.textContent = 'N/A';
            if (ageGroupEl) ageGroupEl.textContent = 'N/A';
            if (topThemeEl) topThemeEl.textContent = 'N/A';
            if (itjCountEl) itjCountEl.textContent = 'N/A';
            return;
        }

        // Calculate metrics
        const calculated = calculateMetrics(metricsData);

        // Calculate ITJ Count (sum of all 95% watch completions)
        const itjCount = metricsData.reduce((sum, row) => {
            const p95Views = row.video_p95_watched_actions;
            return sum + (p95Views ? Number(p95Views) : 0);
        }, 0);

        // Update UI
        if (engagementRateEl) engagementRateEl.textContent = `${calculated.engagementRate}%`;
        if (ageGroupEl) ageGroupEl.textContent = calculated.ageGroup || 'N/A';
        if (topThemeEl) topThemeEl.textContent = calculated.topTheme || 'N/A';
        if (itjCountEl) itjCountEl.textContent = itjCount.toLocaleString();

    } catch (error) {
        console.error('Error loading top performing metrics:', error);
        if (engagementRateEl) engagementRateEl.textContent = 'Error';
        if (ageGroupEl) ageGroupEl.textContent = 'Error';
        if (topThemeEl) topThemeEl.textContent = 'Error';
        if (itjCountEl) itjCountEl.textContent = 'Error';
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
                        <h3 style="margin-bottom: 16px; color: #666;">Database View Not Available</h3>
                        <p style="color: #888; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                            The view <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">vw_upg_digital_learning_ad_metrics4</code>
                            does not exist in the PostgreSQL database that the Lambda connects to.
                            <br><br>
                            Please create this view in PostgreSQL or update the query to use an existing table/view.
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

        // Calculate aggregated metrics
        const calculated = calculateMetrics(metricsData);

        // Generate HTML for the metrics display
        const metricsHTML = `
            <div class="metrics-grid-table">
                <div class="metric-card">
                    <div class="metric-card-label">Engagement Rate per People Group</div>
                    <div class="metric-card-value">${calculated.engagementRate}%</div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-label">CTR per People Group</div>
                    <div class="metric-card-value">${calculated.ctr}%</div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-label">Conversion Rate (Messages)</div>
                    <div class="metric-card-value">${calculated.conversionRate}%</div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-label">Cost Per Acquisition (CPA)</div>
                    <div class="metric-card-value">$${calculated.cpa}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-label">ITJ Count (95% Views)</div>
                    <div class="metric-card-value">${calculated.itjCount}</div>
                </div>
            </div>
            <div class="metrics-grid-table">
                <div class="metric-card">
                    <div class="metric-card-label">Language</div>
                    <div class="metric-card-value small">${calculated.language}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-label">Gender Breakdown</div>
                    <div class="metric-card-value small">${calculated.genderBreakdown}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-label">Age Group</div>
                    <div class="metric-card-value small">${calculated.ageGroup}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-label">Top Performing Theme</div>
                    <div class="metric-card-value small">${calculated.topTheme}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-card-label">Top Performing Ad</div>
                    <div class="metric-card-value small">
                        ${calculated.topAd ? `<a href="${calculated.topAd}" target="_blank" style="color: #2196f3; text-decoration: none;">View Ad</a>` : 'N/A'}
                    </div>
                </div>
            </div>
        `;

        metricsTable.innerHTML = metricsHTML;

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
