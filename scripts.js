// Main initialization function
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the site
    initializeSite();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if we're on the historical data page
    if (window.location.pathname.includes('historical-data.html')) {
        // Historical data page specific initialization
        initializeHistoricalDataPage();
    } else {
        // Show search results by default for the main page
        loadAllPeopleGroups();
    }
});

// Initialize the site
function initializeSite() {
    // Set site name
    if (document.getElementById('site-name')) {
        document.getElementById('site-name').textContent = 'UPG Insights';
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Load website data from data.js (we still need this for non-demographics sections)
    if (typeof websiteData === 'undefined') {
        // Create a default websiteData object if it doesn't exist
        window.websiteData = {
            siteName: 'UPG Insights',
            navigation: [
                { name: 'Home', url: 'index.html', active: true }
            ],
            searchFilters: {
                regions: [],
                countries: [],
                languages: [],
                ethnicities: [],
                religions: []
            },
            peopleGroups: [],
            tharu: {
                name: 'Tharu',
                sections: [
                    { id: 'demographics', name: 'Demographics', content: {} },
                    { id: 'digital-learnings', name: 'Digital Learnings', content: {
                        campaignData: { title: 'Campaign Data', metrics: [] },
                        quizzes: { title: 'Quizzes', charts: [] },
                        hypothesisTests: { title: 'Hypothesis Tests', tests: [] }
                    }},
                    { id: 'testimonies', name: 'Testimonies', content: {
                        filters: { genders: ['All', 'Male', 'Female'] },
                        stories: []
                    }},
                    { id: 'all', name: 'All', content: {
                        overview: { title: 'Overview', text: '' },
                        combinedHighlights: {
                            demographics: { title: 'Demographics Highlights', stats: [] },
                            digitalLearnings: { title: 'Digital Learnings Highlights', stats: [] },
                            testimonies: { title: 'Featured Testimony', featured: {} },
                            quickNumbers: { title: 'Quick Numbers', stats: [] }
                        }
                    }}
                ]
            }
        };
        
        // Load data.js script dynamically
        const script = document.createElement('script');
        script.src = 'data.js';
        document.head.appendChild(script);
    }
}

// Initialize navigation
function initializeNavigation() {
    const navElement = document.getElementById('main-nav');
    if (!navElement) return;
    
    // Determine current page
    const isHistoricalPage = window.location.pathname.includes('historical-data.html');
    
    // Add navigation items
    let navHTML = '';
    navHTML += `<a href="index.html" class="nav-item ${!isHistoricalPage ? 'active' : ''}">Home</a>`;
    navHTML += `<a href="historical-data.html" class="nav-item ${isHistoricalPage ? 'active' : ''}">Historical Data</a>`;
    
    // Add buttons
    navHTML += `
        <a href="upload.html" class="upload-btn">
            <span class="material-symbols-outlined">cloud_upload</span>
            Upload Research
        </a>
        <button class="settings-btn">
            <span class="material-symbols-outlined">settings</span>
        </button>
    `;
    
    navElement.innerHTML = navHTML;
}

// Initialize dropdown filters for search
async function initializeSearchDropdowns() {
    try {
        // Get all unique values from the database for each filter
        const regions = await getUniqueValues('upg_groups', 'main_country');
        const countries = await getUniqueValues('upg_groups', 'country');
        const languages = await getUniqueValues('upg_groups', 'main_language');
        const religions = await getUniqueValues('upg_groups', 'main_religion');
        
        // Populate dropdowns
        populateDropdown('region-menu', regions);
        populateDropdown('country-menu', countries);
        populateDropdown('language-menu', languages);
        populateDropdown('religion-menu', religions);
        
        // For ethnicity, we'll use the group names
        const ethnicities = await getUniqueValues('upg_groups', 'name');
        populateDropdown('ethnicity-menu', ethnicities);
    } catch (error) {
        console.error('Error initializing search dropdowns:', error);
    }
}

// Get unique values from a database column
async function getUniqueValues(table, column) {
    const sql = `SELECT DISTINCT ${column} FROM ${table} ORDER BY ${column}`;
    const data = await getData(sql);
    
    // Extract unique values from the results
    const uniqueValues = data.rows.map(row => row[column]).filter(value => value);
    return uniqueValues;
}

// Helper function to populate a dropdown
function populateDropdown(dropdownId, items) {
    const dropdownElement = document.getElementById(dropdownId);
    if (!dropdownElement) return;
    
    let dropdownHTML = '';
    items.forEach(item => {
        dropdownHTML += `<div class="dropdown-item">${item}</div>`;
    });
    
    dropdownElement.innerHTML = dropdownHTML;
}

// Load all people groups from database
async function loadAllPeopleGroups() {
    try {
        // Show search results container
        const searchResultsContainer = document.getElementById('search-results');
        if (searchResultsContainer) {
            searchResultsContainer.style.display = 'block';
        }
        
        // Hide main content container
        const mainContentContainer = document.getElementById('main-content');
        if (mainContentContainer) {
            mainContentContainer.style.display = 'none';
        }
        
        // Fetch all people groups from the database
        const sql = "SELECT * FROM upg_groups ORDER BY name";
        const data = await getData(sql);
        
        // Initialize search dropdowns
        await initializeSearchDropdowns();
        
        // Populate search results grid
        populateSearchResults(data.rows);
    } catch (error) {
        console.error('Error loading people groups:', error);
    }
}

// Populate search results grid with people groups
function populateSearchResults(peopleGroups) {
    const searchResultsGrid = document.getElementById('search-results-grid');
    if (!searchResultsGrid) return;
    
    let resultsHTML = '';
    peopleGroups.forEach(group => {
        resultsHTML += `
            <div class="people-group-card" data-group-id="${group.id}">
                <div class="people-images">
                    <div class="people-image-male card-people">
                        <img src="${group.male_profile_photo_url || 'placeholder.jpg'}" alt="${group.name} man">
                    </div>
                    <div class="people-image-female card-people">
                        <img src="${group.female_profile_photo_url || 'placeholder.jpg'}" alt="${group.name} woman">
                    </div>
                </div>
                <div class="people-group-info">
                    <h3>${group.name}</h3>
                    <div class="people-group-tags">
                        <span class="info-tag"><span class="material-symbols-outlined">person</span> ${group.population || 'Unknown'}</span>
                        <span class="info-tag"><span class="material-symbols-outlined">public</span> ${group.country || 'Unknown'}</span>
                        <span class="info-tag"><span class="material-symbols-outlined">language</span> ${group.main_language || 'Unknown'}</span>
                        <span class="info-tag"><span class="material-symbols-outlined">church</span> ${group.main_religion || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    searchResultsGrid.innerHTML = resultsHTML;
    
    // Add click event listeners to the cards
    const cards = searchResultsGrid.querySelectorAll('.people-group-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const groupId = this.getAttribute('data-group-id');
            loadPeopleGroupDetails(groupId);
        });
    });
}

// Load detailed information for a specific people group
async function loadPeopleGroupDetails(groupId) {
    try {
        // Hide search results
        document.getElementById('search-results').style.display = 'none';
        
        // Show main content
        document.getElementById('main-content').style.display = 'block';
        
        // Fetch basic group info
        const groupSql = `SELECT * FROM upg_groups WHERE id = ${groupId}`;
        const groupData = await getData(groupSql);
        
        if (groupData.rows.length === 0) {
            console.error('Group not found');
            return;
        }
        
        const group = groupData.rows[0];
        
        // Fetch research content for this group
        const contentSql = `SELECT * FROM upg_research_content WHERE group_id = ${groupId}`;
        const contentData = await getData(contentSql);
        
        // Organize content by section type
        const organizedContent = organizeContentBySectionType(contentData.rows);
        
        // Initialize the group details display
        initializeGroupDetails(group, organizedContent);
    } catch (error) {
        console.error('Error loading people group details:', error);
    }
}

// Organize research content by section type
function organizeContentBySectionType(contentRows) {
    const organizedContent = {};
    
    // Define the section types we want to display
    const sectionTypes = [
        'introduction',
        'demographics',
        'environment',
        'everyday_lives',
        'stories_music',
        'appearance',
        'cultural_nuances',
        'linguistics',
        'beliefs',
        'world_views',
        'blockers_to_christianity',
        'technology_adaption',
        'literacy',
        'felt_specific_needs'
    ];
    
    // Initialize each section type with an empty array
    sectionTypes.forEach(type => {
        organizedContent[type] = [];
    });
    
    // Add content to appropriate section
    contentRows.forEach(row => {
        if (organizedContent[row.section_type]) {
            organizedContent[row.section_type].push(row);
        }
    });
    
    return organizedContent;
}

// Initialize the group details display
function initializeGroupDetails(group, organizedContent) {
    // Set the group name
    const groupNameElement = document.getElementById('group-name');
    if (groupNameElement) {
        groupNameElement.textContent = group.name;
    }
    
    // Define sections for display (keeping original sections)
    const sections = [
        { id: 'demographics', name: 'Demographics' },
        { id: 'digital-learnings', name: 'Digital Learnings' },
        { id: 'testimonies', name: 'Testimonies' },
        { id: 'all', name: 'All' }
    ];
    
    // Initialize section filters
    initializeSectionFilters(sections);
    
    // Load the demographics section by default
    loadSection(group, organizedContent, sections[0]);
}

// Initialize section filters
function initializeSectionFilters(sections) {
    const filtersElement = document.getElementById('section-filters');
    if (!filtersElement) return;
    
    let filtersHTML = '';
    sections.forEach((section, index) => {
        filtersHTML += `<button class="filter-btn ${index === 0 ? 'active' : ''}" data-section="${section.id}">${section.name}</button>`;
    });
    
    filtersElement.innerHTML = filtersHTML;
    
    // Update current section text
    if (document.getElementById('current-section')) {
        document.getElementById('current-section').textContent = sections[0].name;
    }
    
    // Add event listeners to section filters
    const filterButtons = filtersElement.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the selected section ID
            const sectionId = this.getAttribute('data-section');
            
            // Find the section in the array
            const selectedSection = sections.find(s => s.id === sectionId);
            
            if (selectedSection) {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to the clicked button
                this.classList.add('active');
                
                // Update the current section text
                if (document.getElementById('current-section')) {
                    document.getElementById('current-section').textContent = selectedSection.name;
                }
                
                // Reload the content for the new section
                loadSection(group, organizedContent, selectedSection);
            }
        });
    });
}

// Load a specific section
function loadSection(group, organizedContent, section) {
    const contentSectionsElement = document.getElementById('content-sections');
    if (!contentSectionsElement) return;
    
    // Clear existing content
    contentSectionsElement.innerHTML = '';
    
    // Create section element
    const sectionElement = document.createElement('div');
    sectionElement.className = `content-section ${section.id}-section active`;
    
    // Add people images and map with group info cards
    sectionElement.innerHTML = `
        <div class="content-grid">
            <div class="people-section">
                <div class="people-image-male">
                    <img src="${group.male_profile_photo_url || 'placeholder.jpg'}" alt="${group.name} man">
                    <div class="people-image-label">Male</div>
                </div>
                <div class="people-image-female">
                    <img src="${group.female_profile_photo_url || 'placeholder.jpg'}" alt="${group.name} woman">
                    <div class="people-image-label">Female</div>
                </div>
            </div>

            <div class="map-container">
                <img src="${group.map_image_url || 'placeholder-map.jpg'}" alt="Map">
            </div>
        </div>

        <!-- Group info cards -->
        <div class="group-info-cards">
            <div class="info-card">
                <div class="info-card-title">
                    <span class="material-symbols-outlined">groups</span>
                    Population
                </div>
                <div class="info-card-value">${group.population || 'Unknown'}</div>
            </div>
            <div class="info-card">
                <div class="info-card-title">
                    <span class="material-symbols-outlined">language</span>
                    Main Language
                </div>
                <div class="info-card-value">${group.main_language || 'Unknown'}</div>
            </div>
            <div class="info-card">
                <div class="info-card-title">
                    <span class="material-symbols-outlined">church</span>
                    Main Religion
                </div>
                <div class="info-card-value">${group.main_religion || 'Unknown'}</div>
            </div>
            <div class="info-card">
                <div class="info-card-title">
                    <span class="material-symbols-outlined">public</span>
                    Main Region
                </div>
                <div class="info-card-value">${group.main_country || 'Unknown'}</div>
            </div>
        </div>
    `;
    
    // Add section-specific content based on the selected section
    switch(section.id) {
        case 'demographics':
            populateDemographicsSection(sectionElement, organizedContent);
            break;
        case 'digital-learnings':
            populateDigitalLearningsSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'digital-learnings').content);
            break;
        case 'testimonies':
            populateTestimoniesSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'testimonies').content);
            break;
        case 'all':
            populateAllSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'all').content);
            break;
    }
    
    // Add section to the content sections container
    contentSectionsElement.appendChild(sectionElement);
}

// Populate Overview Section
function populateOverviewSection(sectionElement, organizedContent) {
    // Introduction section
    if (organizedContent.introduction.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Introduction</h2>
            <p>${organizedContent.introduction[0].content_text}</p>
        `;
    }
    
    // Demographics overview
    if (organizedContent.demographics.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Demographics Overview</h2>
            <p>${organizedContent.demographics[0].content_text}</p>
        `;
    }
    
    // Environment overview
    if (organizedContent.environment.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Environment</h2>
            <p>${organizedContent.environment[0].content_text}</p>
        `;
    }
    
    // Everyday lives
    if (organizedContent.everyday_lives.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Everyday Lives</h2>
            <p>${organizedContent.everyday_lives[0].content_text}</p>
        `;
    }
}

// Populate Demographics Section
function populateDemographicsSection(sectionElement, organizedContent) {
    // Introduction section
    if (organizedContent.introduction.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Introduction</h2>
            <p>${organizedContent.introduction[0].content_text}</p>
        `;
    }
    
    // Demographics details
    if (organizedContent.demographics.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Demographics</h2>
            <p>${organizedContent.demographics[0].content_text}</p>
        `;
    }
    
    // Everyday lives
    if (organizedContent.everyday_lives.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Everyday Lives</h2>
            <p>${organizedContent.everyday_lives[0].content_text}</p>
        `;
    }
    
    // Environment
    if (organizedContent.environment.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Environment</h2>
            <p>${organizedContent.environment[0].content_text}</p>
        `;
    }
    
    // Linguistics information
    if (organizedContent.linguistics.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Language</h2>
            <p>${organizedContent.linguistics[0].content_text}</p>
        `;
    }
    
    // Literacy information
    if (organizedContent.literacy.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Literacy</h2>
            <p>${organizedContent.literacy[0].content_text}</p>
        `;
    }
    
    // Appearance
    if (organizedContent.appearance.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Appearance</h2>
            <p>${organizedContent.appearance[0].content_text}</p>
        `;
    }
    
    // Stories & music
    if (organizedContent.stories_music.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Stories & Music</h2>
            <p>${organizedContent.stories_music[0].content_text}</p>
        `;
    }
}

// Populate Cultural Section
function populateCulturalSection(sectionElement, organizedContent) {
    // Appearance
    if (organizedContent.appearance.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Appearance</h2>
            <p>${organizedContent.appearance[0].content_text}</p>
        `;
    }
    
    // Cultural nuances
    if (organizedContent.cultural_nuances.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Cultural Nuances</h2>
            <p>${organizedContent.cultural_nuances[0].content_text}</p>
        `;
    }
    
    // Stories & music
    if (organizedContent.stories_music.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Stories & Music</h2>
            <p>${organizedContent.stories_music[0].content_text}</p>
        `;
    }
    
    // Technology adoption
    if (organizedContent.technology_adaption.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Technology Adoption</h2>
            <p>${organizedContent.technology_adaption[0].content_text}</p>
        `;
    }
}

// Populate Beliefs Section
function populateBeliefsSection(sectionElement, organizedContent) {
    // Beliefs information
    if (organizedContent.beliefs.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Beliefs</h2>
            <p>${organizedContent.beliefs[0].content_text}</p>
        `;
    }
    
    // Worldviews
    if (organizedContent.world_views.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Worldviews</h2>
            <p>${organizedContent.world_views[0].content_text}</p>
        `;
    }
    
    // Blockers to Christianity
    if (organizedContent.blockers_to_christianity.length > 0) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Blockers to Christianity</h2>
            <p>${organizedContent.blockers_to_christianity[0].content_text}</p>
        `;
    }
    
    // Felt specific needs
    if (organizedContent.felt_specific_needs.length > 0 && organizedContent.felt_specific_needs[0].content_text) {
        sectionElement.innerHTML += `
            <h2 class="section-title">Felt Specific Needs</h2>
            <p>${organizedContent.felt_specific_needs[0].content_text}</p>
        `;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Search button click
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Dropdown functionality
    setupDropdowns();
    
    // Add visual feedback when clicking buttons
    setupButtonRippleEffects();
    
    // Initialize tooltips for stat cards
    setupTooltips();
}

// Handle search button click
async function handleSearch() {
    // Get search values
    const region = document.getElementById('region-search')?.value.toLowerCase() || '';
    const country = document.getElementById('country-search')?.value.toLowerCase() || '';
    const language = document.getElementById('language-search')?.value.toLowerCase() || '';
    const ethnicity = document.getElementById('ethnicity-search')?.value.toLowerCase() || '';
    const religion = document.getElementById('religion-search')?.value.toLowerCase() || '';
    
    console.log('Search filters:', { region, country, language, ethnicity, religion });
    
    // Build SQL query with filters
    let sql = "SELECT * FROM upg_groups WHERE 1=1";
    
    if (region) {
        sql += ` AND LOWER(main_country) LIKE '%${region}%'`;
    }
    
    if (country) {
        sql += ` AND LOWER(country) LIKE '%${country}%'`;
    }
    
    if (language) {
        sql += ` AND LOWER(main_language) LIKE '%${language}%'`;
    }
    
    if (ethnicity) {
        sql += ` AND LOWER(name) LIKE '%${ethnicity}%'`;
    }
    
    if (religion) {
        sql += ` AND LOWER(main_religion) LIKE '%${religion}%'`;
    }
    
    sql += " ORDER BY name";
    
    try {
        const data = await getData(sql);
        
        // Show search results container
        const searchResultsContainer = document.getElementById('search-results');
        if (searchResultsContainer) {
            searchResultsContainer.style.display = 'block';
        }
        
        // Hide main content container
        const mainContentContainer = document.getElementById('main-content');
        if (mainContentContainer) {
            mainContentContainer.style.display = 'none';
        }
        
        // Populate search results
        populateSearchResults(data.rows);
    } catch (error) {
        console.error('Error searching people groups:', error);
    }
}

// Set up dropdowns with animations
function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.search-dropdown');
    
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            
            // Close all other dropdowns with animation
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });
            
            // Toggle current dropdown with animation
            this.classList.toggle('active');
        });
        
        // Dropdown item selection
        const dropdownItems = dropdown.querySelectorAll('.dropdown-item');
        const searchInput = dropdown.previousElementSibling;
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                // Smoothly update the input value
                searchInput.value = this.textContent;
                
                // Add a small delay before closing to make it feel smoother
                setTimeout(() => {
                    dropdown.classList.remove('active');
                }, 150);
            });
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function () {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });
    
    // Add hover effect for dropdown items for better user experience
    const allDropdownItems = document.querySelectorAll('.dropdown-item');
    allDropdownItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f0f7ff';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

// Set up button ripple effects
function setupButtonRippleEffects() {
    const allButtons = document.querySelectorAll('button');
    
    allButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            // Add a ripple effect
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            // Set position
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
            
            // Add to button
            this.appendChild(ripple);
            
            // Remove after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Set up tooltips
function setupTooltips() {
    // Initialize tooltips for stat cards after they're loaded
    setInterval(() => {
        const tooltipCards = document.querySelectorAll('.stat-card:not(.tooltip-initialized)');
        
        tooltipCards.forEach(card => {
            card.classList.add('tooltip-initialized');
            
            const tooltip = document.createElement('div');
            tooltip.classList.add('tooltip');
            tooltip.textContent = 'Click for detailed information';
            
            card.appendChild(tooltip);
            
            card.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            });
            
            card.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(10px)';
            });
        });
    }, 1000);
}

// Data fetching function
const cache = new Map();

async function getData(sql) {
    // Check if the data is already in the cache
    if (cache.has(sql)) {
        console.log('Fetching data from cache');
        return cache.get(sql);
    }

    // Fetch data from the API
    const response = await fetch('https://khnl5wvfdtpayvznnbh2r7kiqi0nshuu.lambda-url.ap-southeast-2.on.aws/', {
        method: 'POST',
        body: JSON.stringify({ sql })
    });

    const data = await response.json();
    console.log('Fetching data from API:', data);

    // Store the data in the cache
    cache.set(sql, data);

    return data;
}

// Initialize the historical data page
async function initializeHistoricalDataPage() {
    console.log('Initializing Historical Data page');

    const sql = "SELECT * FROM upg_historical_hypothesis_tests";
    const data = await getData(sql);
    console.log('Historical data:', data.rows);
    
    // Initialize the filters
    initializeHistoricalFilters(data.rows);
    
    // Initialize the historical data cards
    initializeHistoricalCards(data.rows);
    
    // Set up reset filters button
    setupResetFiltersButton(data.rows);
}

// Initialize filters for historical data
function initializeHistoricalFilters(data) {
    // Initialize year filter
    initializeYearFilter(data);
    
    // Initialize country filter
    initializeCountryFilter(data);
    
    // Set up dropdown functionality
    setupHistoricalDropdowns();
}

// Setup dropdown functionality for historical filters
function setupHistoricalDropdowns() {
    const yearDropdown = document.getElementById('year-dropdown');
    const countryDropdown = document.getElementById('country-dropdown');
    
    if (!yearDropdown || !countryDropdown) return;
    
    // Year dropdown click handler
    yearDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Close country dropdown
        countryDropdown.classList.remove('active');
        
        // Toggle year dropdown
        this.classList.toggle('active');
    });
    
    // Country dropdown click handler
    countryDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Close year dropdown
        yearDropdown.classList.remove('active');
        
        // Toggle country dropdown
        this.classList.toggle('active');
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        yearDropdown.classList.remove('active');
        countryDropdown.classList.remove('active');
    });
}

// Initialize year filter dropdown
function initializeYearFilter(data) {
    const yearMenu = document.getElementById('year-menu');
    if (!yearMenu) return;
    
    // Get unique years
    const years = ['All Years'];
    data.forEach(item => {
        // Skip null or undefined years
        if (!item.year) return;
        
        // Convert year to string to ensure consistency
        const yearStr = String(item.year);
        if (!years.includes(yearStr)) {
            years.push(yearStr);
        }
    });
    
    // Add "Unknown" option if needed
    if (data.some(item => !item.year)) {
        years.push('Unknown');
    }
    
    // Sort years in descending order (newest first)
    years.sort((a, b) => {
        if (a === 'All Years') return -1;
        if (b === 'All Years') return 1;
        if (a === 'Unknown') return 1;
        if (b === 'Unknown') return -1;
        return parseInt(b) - parseInt(a);
    });
    
    // Create year dropdown items
    let yearOptionsHTML = '';
    years.forEach(year => {
        yearOptionsHTML += `<div class="dropdown-item" data-value="${year === 'All Years' ? 'all' : year}">${year}</div>`;
    });
    
    yearMenu.innerHTML = yearOptionsHTML;
    
    // Add event listeners to year dropdown items
    const yearItems = yearMenu.querySelectorAll('.dropdown-item');
    yearItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update selected state
            yearItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update dropdown text
            const yearDropdown = document.getElementById('year-dropdown');
            const filterText = yearDropdown.querySelector('.filter-text');
            filterText.textContent = this.textContent;
            
            // Add data attribute to the dropdown with the selected value
            yearDropdown.setAttribute('data-selected', this.getAttribute('data-value'));
            
            // Add has-value class to the dropdown
            yearDropdown.classList.add('has-value');
            
            // Close dropdown
            yearDropdown.classList.remove('active');
            
            // Filter the cards
            applyHistoricalFilters();
        });
    });
}

// Initialize country filter dropdown
function initializeCountryFilter(data) {
    const countryMenu = document.getElementById('country-menu');
    if (!countryMenu) return;
    
    // Get unique countries
    const countries = ['All Countries'];
    data.forEach(item => {
        // Skip null or undefined countries
        if (!item.country) return;
        
        if (!countries.includes(item.country)) {
            countries.push(item.country);
        }
    });
    
    // Add "Unknown" option if needed
    if (data.some(item => !item.country)) {
        countries.push('Unknown');
    }
    
    // Sort countries alphabetically
    countries.sort((a, b) => {
        if (a === 'All Countries') return -1;
        if (b === 'All Countries') return 1;
        if (a === 'Unknown') return 1;
        if (b === 'Unknown') return -1;
        return a.localeCompare(b);
    });
    
    // Create country dropdown items
    let countryOptionsHTML = '';
    countries.forEach(country => {
        countryOptionsHTML += `<div class="dropdown-item" data-value="${country === 'All Countries' ? 'all' : country}">${country}</div>`;
    });
    
    countryMenu.innerHTML = countryOptionsHTML;
    
    // Add event listeners to country dropdown items
    const countryItems = countryMenu.querySelectorAll('.dropdown-item');
    countryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Update selected state
            countryItems.forEach(i => i.classList.remove('selected'));
            this.classList.add('selected');
            
            // Update dropdown text
            const countryDropdown = document.getElementById('country-dropdown');
            const filterText = countryDropdown.querySelector('.filter-text');
            filterText.textContent = this.textContent;
            
            // Add data attribute to the dropdown with the selected value
            countryDropdown.setAttribute('data-selected', this.getAttribute('data-value'));
            
            // Add has-value class to the dropdown
            countryDropdown.classList.add('has-value');
            
            // Close dropdown
            countryDropdown.classList.remove('active');
            
            // Filter the cards
            applyHistoricalFilters();
        });
    });
}

// Initialize historical data cards
function initializeHistoricalCards(data) {
    const cardsContainer = document.getElementById('historical-cards-grid');
    if (!cardsContainer) return;
    
    // Sort items by year (newest first)
    const sortedItems = [...data].sort((a, b) => (b.year || 0) - (a.year || 0));
    
    // Generate HTML for cards
    let cardsHTML = '';
    sortedItems.forEach(item => {
        cardsHTML += generateHistoricalCardHTML(item);
    });
    
    // Add a "no results" message that's initially hidden
    cardsHTML += `
        <div id="no-results" class="no-results" style="display: none;">
            <span class="material-symbols-outlined">search_off</span>
            <p>No results found for the selected filters.</p>
        </div>
    `;
    
    cardsContainer.innerHTML = cardsHTML;
}

// Generate HTML for a historical data card
function generateHistoricalCardHTML(item) {
    // Check if year exists and provide a fallback if it doesn't
    const yearValue = item.year || 'Unknown';
    // Ensure year is stored as a string for consistent comparison
    const yearStr = String(yearValue);
    
    return `
        <div class="historical-card" data-year="${yearStr}" data-country="${item.country || ''}">
            <div class="historical-card-header">
                <div class="year-tag">${yearStr}</div>
                <div class="country-tag">
                    <span class="material-symbols-outlined">public</span>
                    ${item.country || 'Unknown'}
                </div>
            </div>
            
            <div class="historical-card-content">
                <div class="historical-section">
                    <h3>What we tested</h3>
                    <p>${item.trying_to_test || 'Not specified'}</p>
                </div>
                
                <div class="historical-section">
                    <h3>What we hoped to learn</h3>
                    <p>${item.hope_to_learn || 'Not specified'}</p>
                </div>
                
                <div class="historical-section">
                    <h3>What we learnt</h3>
                    <p>${item.learnt || 'Not specified'}</p>
                </div>
            </div>
        </div>
    `;
}

// Apply filters to historical cards
function applyHistoricalFilters() {
    const yearDropdown = document.getElementById('year-dropdown');
    const countryDropdown = document.getElementById('country-dropdown');
    
    // Get selected values
    const yearFilter = yearDropdown.getAttribute('data-selected') || 'all';
    const countryFilter = countryDropdown.getAttribute('data-selected') || 'all';
    
    console.log('Applying filters - Year:', yearFilter, 'Country:', countryFilter);
    
    const cards = document.querySelectorAll('.historical-card');
    const noResultsElement = document.getElementById('no-results');
    let visibleCards = 0;
    
    cards.forEach(card => {
        const cardYear = card.getAttribute('data-year');
        const cardCountry = card.getAttribute('data-country');
        
        // Year matching
        const yearMatch = yearFilter === 'all' || 
                         (yearFilter === 'Unknown' && (!cardYear || cardYear === 'Unknown')) || 
                         cardYear === yearFilter;
        
        // Country matching
        const countryMatch = countryFilter === 'all' || 
                             (countryFilter === 'Unknown' && (!cardCountry || cardCountry === '')) || 
                             cardCountry === countryFilter;
        
        if (yearMatch && countryMatch) {
            card.style.display = 'block';
            visibleCards++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show or hide "no results" message
    if (noResultsElement) {
        noResultsElement.style.display = visibleCards === 0 ? 'block' : 'none';
    }
}

// Setup reset filters button
function setupResetFiltersButton() {
    const resetButton = document.getElementById('reset-filters');
    if (!resetButton) return;
    
    resetButton.addEventListener('click', function() {
        // Reset year filter
        const yearDropdown = document.getElementById('year-dropdown');
        if (yearDropdown) {
            yearDropdown.querySelector('.filter-text').textContent = 'Filter Year';
            yearDropdown.classList.remove('has-value');
            yearDropdown.removeAttribute('data-selected');
            yearDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.remove('selected');
            });
        }
        
        // Reset country filter
        const countryDropdown = document.getElementById('country-dropdown');
        if (countryDropdown) {
            countryDropdown.querySelector('.filter-text').textContent = 'Filter Country';
            countryDropdown.classList.remove('has-value');
            countryDropdown.removeAttribute('data-selected');
            countryDropdown.querySelectorAll('.dropdown-item').forEach(item => {
                item.classList.remove('selected');
            });
        }
        
        // Show all cards
        document.querySelectorAll('.historical-card').forEach(card => {
            card.style.display = 'block';
        });
        
        // Hide no results message
        const noResultsElement = document.getElementById('no-results');
        if (noResultsElement) {
            noResultsElement.style.display = 'none';
        }
    });
}