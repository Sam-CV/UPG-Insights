// Main initialization function
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the site
    initializeSite();
    
    // Set up event listeners
    setupEventListeners();
    
    // Show search results by default
    showSearchResults();
});

// Initialize the site with data
function initializeSite() {
    // Set site name
    document.getElementById('site-name').textContent = websiteData.siteName;
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize search dropdowns
    initializeSearchDropdowns();
    
    // Initialize search results
    initializeSearchResults();
    
    // Initialize the content sections with default people group (Tharu)
    initializeContentSections(websiteData.tharu);
}

// Initialize navigation
function initializeNavigation() {
    const navElement = document.getElementById('main-nav');
    
    // Add navigation items
    let navHTML = '';
    websiteData.navigation.forEach(item => {
        navHTML += `<a href="${item.url}" class="nav-item ${item.active ? 'active' : ''}">${item.name}</a>`;
    });
    
    // Add buttons
    navHTML += `
        <button class="upload-btn" onclick="window.location= 'upload.html'">
            <span class="material-symbols-outlined">cloud_upload</span>
            Upload Research
        </button>
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
    
    let filtersHTML = '';
    sections.forEach((section, index) => {
        filtersHTML += `<button class="filter-btn ${index === 0 ? 'active' : ''}" data-section="${section.id}">${section.name}</button>`;
    });
    
    filtersElement.innerHTML = filtersHTML;
    
    // Update current section text
    document.getElementById('current-section').textContent = sections[0].name;
}

// Load a specific section
function loadSection(section) {
    const contentSectionsElement = document.getElementById('content-sections');
    
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
    searchBtn.addEventListener('click', handleSearch);
    
    // People group card clicks
    const peopleGroupCards = document.querySelectorAll('.people-group-card');
    peopleGroupCards.forEach(card => {
        card.addEventListener('click', handlePeopleGroupSelection);
    });
    
    // Section filter clicks
    document.getElementById('section-filters').addEventListener('click', handleSectionFilter);
    
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