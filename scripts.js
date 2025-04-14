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
        showSearchResults();
    }
});

// Initialize the site with data
function initializeSite() {
    // Set site name
    if (document.getElementById('site-name')) {
        document.getElementById('site-name').textContent = websiteData.siteName;
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize search dropdowns if on the main page
    if (!window.location.pathname.includes('historical-data.html')) {
        initializeSearchDropdowns();
        
        // Initialize search results
        initializeSearchResults();
        
        // Initialize the content sections with default people group (Tharu)
        initializeContentSections(websiteData.tharu);
    }
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
        if (!years.includes(item.year)) {
            years.push(item.year);
        }
    });
    
    // Sort years in descending order (newest first)
    years.sort((a, b) => {
        if (a === 'All Years') return -1;
        if (b === 'All Years') return 1;
        return b - a;
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
            
            // Add has-value class to the dropdown
            yearDropdown.classList.add('has-value');
            
            // Close dropdown
            yearDropdown.classList.remove('active');
            
            // Filter the cards
            applyHistoricalFilters();
        });
    });
}

// Apply filters to historical cards
function applyHistoricalFilters() {
    const yearDropdown = document.getElementById('year-dropdown');
    const countryDropdown = document.getElementById('country-dropdown');
    
    // Get selected values, either from data-selected attribute or default to filter text
    const yearFilter = yearDropdown.getAttribute('data-selected') || 'all';
    const countryFilter = countryDropdown.getAttribute('data-selected') || 'all';
    
    console.log('Applying filters - Year:', yearFilter, 'Country:', countryFilter);
    
    const cards = document.querySelectorAll('.historical-card');
    const noResultsElement = document.getElementById('no-results');
    let visibleCards = 0;
    
    cards.forEach(card => {
        const cardYear = card.getAttribute('data-year');
        const cardCountry = card.getAttribute('data-country');
        
        // Debug output
        // console.log(`Card - Year: ${cardYear} (${typeof cardYear}), Country: ${cardCountry}`);
        
        // Now compare using proper conditions
        const yearMatch = yearFilter === 'all' || (cardYear && cardYear === yearFilter);
        const countryMatch = countryFilter === 'all' || (cardCountry && cardCountry === countryFilter);
        
        // console.log(`Year match: ${yearMatch}, Country match: ${countryMatch}`);
        
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
function setupResetFiltersButton(data) {
    const resetButton = document.getElementById('reset-filters');
    if (!resetButton) return;
    
    resetButton.addEventListener('click', function() {
        // Reset year filter
        const yearDropdown = document.getElementById('year-dropdown');
        yearDropdown.querySelector('.filter-text').textContent = 'Filter Year';
        yearDropdown.classList.remove('has-value');
        yearDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Reset country filter
        const countryDropdown = document.getElementById('country-dropdown');
        countryDropdown.querySelector('.filter-text').textContent = 'Filter Country';
        countryDropdown.classList.remove('has-value');
        countryDropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Show all cards
        document.querySelectorAll('.historical-card').forEach(card => {
            card.style.display = 'block';
        });
        
        // Hide no results message
        document.getElementById('no-results').style.display = 'none';
    });
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
    
    console.log('Year options:', years);
    
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
    
    console.log('Country options:', countries);
    
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
    const sortedItems = [...data].sort((a, b) => b.year - a.year);
    
    // Generate HTML for cards
    let cardsHTML = '';
    sortedItems.forEach(item => {
        cardsHTML += generateHistoricalCardHTML(item);
    });
    
    cardsContainer.innerHTML = cardsHTML;
}

// Generate HTML for a historical data card
function generateHistoricalCardHTML(item) {
    // Check if year exists and provide a fallback if it doesn't
    const yearValue = item.year || 'Unknown';
    // Ensure year is stored as a string for consistent comparison
    const yearStr = String(yearValue);
    
    console.log(`Creating card for: ${yearStr} - ${item.country}`);
    
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

// Filter historical cards based on country
function filterHistoricalCards(country) {
    const cards = document.querySelectorAll('.historical-card');
    const noResultsElement = document.getElementById('no-results');
    let visibleCards = 0;
    
    cards.forEach(card => {
        if (country === 'all' || card.getAttribute('data-country') === country) {
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

// Initialize country filters for historical data
function initializeCountryFilters(data) {
    const filtersElement = document.getElementById('country-filters');
    if (!filtersElement) return;
    
    // Get unique countries
    const countries = ['All Countries'];
    data.forEach(item => {
        if (!countries.includes(item.country)) {
            countries.push(item.country);
        }
    });
    
    // Create filter buttons
    let filtersHTML = '';
    countries.forEach((country, index) => {
        filtersHTML += `<button class="filter-btn ${index === 0 ? 'active' : ''}" data-country="${country === 'All Countries' ? 'all' : country}">${country}</button>`;
    });
    
    filtersElement.innerHTML = filtersHTML;
    
    // Add event listeners to filter buttons
    const filterButtons = filtersElement.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter the cards
            filterHistoricalCards(this.getAttribute('data-country'));
        });
    });
}

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

function getImageURL(peopleGroup) {
    return `https://upg-resources.s3.ap-southeast-2.amazonaws.com/${peopleGroup}.jpg`;
}

async function testApi() {
    const response = await fetch('https://khnl5wvfdtpayvznnbh2r7kiqi0nshuu.lambda-url.ap-southeast-2.on.aws/', {
        method: 'POST',
        body: JSON.stringify({
            sql: "SELECT * FROM chatfuel_quizbot_data"
        })
    });

    const data = await response.json();
    console.log(data);

    return data;
}

// Initialize navigation
function initializeNavigation() {
    const navElement = document.getElementById('main-nav');
    if (!navElement) return;
    
    // Determine current page
    const isHistoricalPage = window.location.pathname.includes('historical-data.html');
    
    // Add navigation items
    let navHTML = '';
    websiteData.navigation.forEach(item => {
        const isActive = !isHistoricalPage && item.active;
        navHTML += `<a href="${item.url}" class="nav-item ${isActive ? 'active' : ''}">${item.name}</a>`;
    });
    
    // Add Historical Data tab
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

// Initialize search dropdowns
function initializeSearchDropdowns() {
    // Populate region dropdown
    populateDropdown('region-menu', websiteData.searchFilters.regions);
    
    // Populate country dropdown
    populateDropdown('country-menu', websiteData.searchFilters.countries);
    
    // Populate language dropdown
    populateDropdown('language-menu', websiteData.searchFilters.languages);
    
    // Populate ethnicity dropdown
    populateDropdown('ethnicity-menu', websiteData.searchFilters.ethnicities);
    
    // Populate religion dropdown
    populateDropdown('religion-menu', websiteData.searchFilters.religions);
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

// Initialize search results
function initializeSearchResults() {
    const searchResultsGrid = document.getElementById('search-results-grid');
    if (!searchResultsGrid) return;
    
    // Sort people groups alphabetically
    const sortedGroups = [...websiteData.peopleGroups].sort((a, b) => 
        a.name.localeCompare(b.name)
    );
    
    let resultsHTML = '';
    sortedGroups.forEach(group => {
        resultsHTML += `
            <div class="people-group-card" data-group="${group.id}">
                <div class="people-images">
                    <div class="people-image-male card-people">
                        <img src="${group.maleImage}" alt="${group.name} man">
                    </div>
                    <div class="people-image-female card-people">
                        <img src="${group.femaleImage}" alt="${group.name} woman">
                    </div>
                </div>
                <div class="people-group-info">
                    <h3>${group.name}</h3>
                    <div class="people-group-tags">
                        <span class="info-tag"><span class="material-symbols-outlined">person</span> ${group.population}</span>
                        <span class="info-tag"><span class="material-symbols-outlined">public</span> ${group.country}</span>
                        <span class="info-tag"><span class="material-symbols-outlined">language</span> ${group.language}</span>
                        <span class="info-tag"><span class="material-symbols-outlined">church</span> ${group.religion}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    searchResultsGrid.innerHTML = resultsHTML;
}

// Initialize content sections for a specific people group
function initializeContentSections(peopleGroup) {
    // Set the group name
    if (!document.getElementById('group-name')) return;
    document.getElementById('group-name').textContent = peopleGroup.name;
    
    // Initialize section filters
    initializeSectionFilters(peopleGroup.sections);
    
    // Load the first section by default (demographics)
    loadSection(peopleGroup.sections[0]);
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
}

// Load a specific section
function loadSection(section) {
    const contentSectionsElement = document.getElementById('content-sections');
    if (!contentSectionsElement) return;
    
    // Clear existing content
    contentSectionsElement.innerHTML = '';
    
    // Create section element
    const sectionElement = document.createElement('div');
    sectionElement.className = `content-section ${section.id}-section active`;
    
    // Add people images and map
    sectionElement.innerHTML = `
        <div class="content-grid">
            <div class="people-section">
                <div class="people-image-male">
                    <img src="${websiteData.tharu.peopleGroups?.find(g => g.id === 'tharu')?.maleImage || websiteData.peopleGroups[0].maleImage}" alt="Tharu man">
                    <div class="people-image-label">Male</div>
                </div>
                <div class="people-image-female">
                    <img src="${websiteData.tharu.peopleGroups?.find(g => g.id === 'tharu')?.femaleImage || websiteData.peopleGroups[0].femaleImage}" alt="Tharu woman">
                    <div class="people-image-label">Female</div>
                </div>
            </div>

            <div class="map-container">
                <img src="${websiteData.tharu.mapImage}" alt="World map">
            </div>
        </div>
    `;
    
    // Add section-specific content
    switch(section.id) {
        case 'demographics':
            populateDemographicsSection(sectionElement, section.content);
            break;
        case 'digital-learnings':
            populateDigitalLearningsSection(sectionElement, section.content);
            break;
        case 'testimonies':
            populateTestimoniesSection(sectionElement, section.content);
            break;
        case 'all':
            populateAllSection(sectionElement, section.content);
            break;
    }
    
    // Add section to the content sections container
    contentSectionsElement.appendChild(sectionElement);
}

// Populate Demographics Section
function populateDemographicsSection(sectionElement, content) {
    // Introduction
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.introduction.title}</h2>
        <p>${content.introduction.text}</p>
    `;
    
    // Everyday Lives
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.everydayLives.title}</h2>
        <ul>
            ${content.everydayLives.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
    `;
    
    // Demographic Highlights
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.highlights.title}</h2>
        <div class="stats-grid">
            ${content.highlights.stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                </div>
            `).join('')}
        </div>
        <ul class="demographics-list">
            ${content.highlights.points.map(point => `<li>${point}</li>`).join('')}
        </ul>
    `;
    
    // Quick Numbers
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.quickNumbers.title}</h2>
        <div class="stats-grid">
            ${content.quickNumbers.stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Top Performing
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.topPerforming.title}</h2>
        <div class="video-stats-grid">
            ${content.topPerforming.stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Populate Digital Learnings Section
function populateDigitalLearningsSection(sectionElement, content) {
    // Add toggle buttons at the top
    sectionElement.innerHTML += `
        <div class="digital-learning-toggles">
            <button class="toggle-btn active" data-content="campaign-data">Campaign Data</button>
            <button class="toggle-btn" data-content="quizzes">Quizzes</button>
            <button class="toggle-btn" data-content="hypothesis-tests">Hypothesis Tests</button>
        </div>
    `;
    
    // Create content containers
    sectionElement.innerHTML += `
        <div class="digital-learning-content">
            <!-- Campaign Data -->
            <div class="content-block campaign-data-block active">
                <h2 class="section-title">${content.campaignData.title}</h2>
                <div class="campaign-metrics-grid">
                    ${content.campaignData.metrics.map(metric => `
                        <div class="metric-card">
                            <div class="metric-label">${metric.label}</div>
                            <div class="metric-value">${metric.value}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Quizzes -->
            <div class="content-block quizzes-block">
                <h2 class="section-title">${content.quizzes.title}</h2>
                <div class="quizzes-container">
                    ${generatePieCharts(content.quizzes.charts)}
                </div>
            </div>
            
            <!-- Hypothesis Tests -->
            <div class="content-block hypothesis-tests-block">
                <h2 class="section-title">${content.hypothesisTests.title}</h2>
                <div class="hypothesis-tests-grid">
                    ${content.hypothesisTests.tests.map(test => `
                        <div class="hypothesis-card">
                            <h3 class="hypothesis-title">Hypothesis</h3>
                            <p class="hypothesis-text">${test.hypothesis}</p>
                            
                            <h3 class="result-title">Result</h3>
                            <p class="result-text">${test.result}</p>
                            
                            <div class="tags">
                                Tags: ${test.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners for toggle buttons
    const toggleButtons = sectionElement.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Hide all content blocks
            const contentBlocks = sectionElement.querySelectorAll('.content-block');
            contentBlocks.forEach(block => block.classList.remove('active'));
            
            // Show selected content block
            const contentToShow = this.getAttribute('data-content');
            sectionElement.querySelector(`.${contentToShow}-block`).classList.add('active');
        });
    });
}

// Helper function to generate pie charts
function generatePieCharts(charts) {
    // Group charts into rows of 5
    let chartRows = [];
    for (let i = 0; i < charts.length; i += 5) {
        chartRows.push(charts.slice(i, i + 5));
    }
    
    // Generate HTML for each row
    return chartRows.map(row => `
        <div class="pie-charts-row">
            ${row.map(chart => `
                <div class="pie-chart-container">
                    <h4 class="chart-title">${chart.title}</h4>
                    <div class="pie-chart" data-chart='${JSON.stringify(chart.data)}'>
                        <svg viewBox="0 0 100 100">
                            ${generatePieSlices(chart.data)}
                        </svg>
                        <div class="pie-legend">
                            ${chart.data.map(item => `
                                <div class="legend-item">
                                    <span class="color-dot" style="background-color: ${item.color}"></span>
                                    <span class="legend-label">${item.label}: ${item.value}%</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

// Helper function to generate SVG pie slices
function generatePieSlices(data) {
    // Calculate total value
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Generate pie slices
    let slices = '';
    let startAngle = 0;
    
    data.forEach(item => {
        // Calculate angles
        const percentage = (item.value / total) * 100;
        const angle = (percentage / 100) * 360;
        const endAngle = startAngle + angle;
        
        // Calculate SVG path
        const x1 = 50 + 40 * Math.cos(Math.PI * startAngle / 180);
        const y1 = 50 + 40 * Math.sin(Math.PI * startAngle / 180);
        const x2 = 50 + 40 * Math.cos(Math.PI * endAngle / 180);
        const y2 = 50 + 40 * Math.sin(Math.PI * endAngle / 180);
        
        // Determine if the arc should be drawn as a large arc
        const largeArcFlag = angle > 180 ? 1 : 0;
        
        // Create SVG path
        const path = `
            <path 
                d="M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z" 
                fill="${item.color}" 
                stroke="white" 
                stroke-width="1"
                data-value="${item.value}"
                data-label="${item.label}"
            ></path>
        `;
        
        slices += path;
        startAngle = endAngle;
    });
    
    return slices;
}

// Populate Testimonies Section
function populateTestimoniesSection(sectionElement, content) {
    // Add search and filter row
    sectionElement.innerHTML += `
        <div class="search-filter-row">
            <div class="search-box testimonies-search">
                <span class="material-symbols-outlined" style="padding-left: 10px;">
                    search
                </span>
                <input type="text" class="search-input" placeholder="Search testimonies">
            </div>

            <div class="gender-filter">
                ${content.filters.genders.map((gender, index) => `
                    <button class="filter-btn gender-btn ${index === 0 ? 'active' : ''}">${gender}</button>
                `).join('')}
            </div>
        </div>
    `;
    
    // Add testimonies
    content.stories.forEach(story => {
        sectionElement.innerHTML += `
            <div class="testimony">
                <div class="testimony-header">
                    <h2 class="testimony-title">${story.title}</h2>
                    <div class="testimony-date">${story.date}</div>
                </div>

                <div class="testimony-content">
                    <p>${story.content}</p>
                </div>

                <div class="video-container">
                    <h3>Video / Photo</h3>
                    <div class="video-placeholder">
                        <img src="${story.image}" alt="Video thumbnail">
                    </div>
                </div>

                <div class="testimony-tags">
                    ${story.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
    });
}

// Populate All Section
function populateAllSection(sectionElement, content) {
    // Overview
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.overview.title}</h2>
        <p>${content.overview.text}</p>
    `;
    
    // Demographics Highlights
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.combinedHighlights.demographics.title}</h2>
        <div class="stats-grid">
            ${content.combinedHighlights.demographics.stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Digital Learnings Highlights
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.combinedHighlights.digitalLearnings.title}</h2>
        <div class="stats-grid">
            ${content.combinedHighlights.digitalLearnings.stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Testimonies Highlight
    const featuredStory = content.combinedHighlights.testimonies.featured;
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.combinedHighlights.testimonies.title}</h2>
        <div class="testimony">
            <div class="testimony-header">
                <h2 class="testimony-title">${featuredStory.title}</h2>
                <div class="testimony-date">${featuredStory.date}</div>
            </div>

            <div class="testimony-content">
                <p>${featuredStory.excerpt}</p>
            </div>

            <div class="video-container">
                <h3>Video / Photo</h3>
                <div class="video-placeholder">
                    <img src="${featuredStory.image}" alt="Video thumbnail">
                </div>
            </div>
        </div>
    `;
    
    // Quick Numbers
    sectionElement.innerHTML += `
        <h2 class="section-title">${content.combinedHighlights.quickNumbers.title}</h2>
        <div class="stats-grid">
            ${content.combinedHighlights.quickNumbers.stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// Set up event listeners
function setupEventListeners() {
    // Search button click
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // People group card clicks
    const peopleGroupCards = document.querySelectorAll('.people-group-card');
    peopleGroupCards.forEach(card => {
        card.addEventListener('click', handlePeopleGroupSelection);
    });
    
    // Section filter clicks
    const sectionFilters = document.getElementById('section-filters');
    if (sectionFilters) {
        sectionFilters.addEventListener('click', handleSectionFilter);
    }
    
    // Dropdown functionality
    setupDropdowns();
    
    // Add visual feedback when clicking buttons
    setupButtonRippleEffects();
    
    // Initialize tooltips for stat cards
    setupTooltips();
}

// Handle search button click and show search results by default
function handleSearch() {
    showSearchResults();
    
    // Get search values
    const region = document.getElementById('region-search')?.value.toLowerCase() || '';
    const country = document.getElementById('country-search')?.value.toLowerCase() || '';
    const language = document.getElementById('language-search')?.value.toLowerCase() || '';
    const ethnicity = document.getElementById('ethnicity-search')?.value.toLowerCase() || '';
    const religion = document.getElementById('religion-search')?.value.toLowerCase() || '';
    
    console.log('Search filters:', { region, country, language, ethnicity, religion });
}

// Function to show search results
function showSearchResults() {
    const searchResultsContainer = document.getElementById('search-results');
    const mainContentContainer = document.getElementById('main-content');
    
    // Show search results container
    if (searchResultsContainer) {
        searchResultsContainer.style.display = 'block';
    }
    
    // Hide main content container
    if (mainContentContainer) {
        mainContentContainer.style.display = 'none';
    }
}

// Handle people group card selection
function handlePeopleGroupSelection(event) {
    const card = event.currentTarget;
    const groupId = card.getAttribute('data-group');
    console.log('Selected group:', groupId);
    
    // Hide search results
    document.getElementById('search-results').style.display = 'none';
    
    // Show main content
    document.getElementById('main-content').style.display = 'block';
    
    // For Tharu, show demographics section, for others we could load different data
    if (groupId === 'tharu') {
        // Click the demographics button
        const demographicsBtn = document.querySelector('.filter-btn[data-section="demographics"]');
        if (demographicsBtn) {
            demographicsBtn.click();
        }
    }
}

// Handle section filter clicks
function handleSectionFilter(event) {
    if (event.target.classList.contains('filter-btn')) {
        const sectionId = event.target.getAttribute('data-section');
        
        // Remove active class from all buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.parentElement === event.target.parentElement) {
                btn.classList.remove('active');
            }
        });
        
        // Add active class to clicked button
        event.target.classList.add('active');
        
        // Update the current section text
        document.getElementById('current-section').textContent = event.target.textContent;
        
        // Find the section in the data
        const section = websiteData.tharu.sections.find(s => s.id === sectionId);
        if (section) {
            loadSection(section);
        }
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