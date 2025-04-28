// Main initialization function
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the site
    initializeSite();

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

    // // Load website data from data.js (we still need this for non-demographics sections)
    // if (typeof websiteData === 'undefined') {
    //     // Create a default websiteData object if it doesn't exist
    //     window.websiteData = {
    //         siteName: 'UPG Insights',
    //         navigation: [
    //             { name: 'Home', url: 'index.html', active: true }
    //         ],
    //         searchFilters: {
    //             regions: [],
    //             countries: [],
    //             languages: [],
    //             ethnicities: [],
    //             religions: []
    //         },
    //         peopleGroups: [],
    //         tharu: {
    //             name: 'Tharu',
    //             sections: [
    //                 { id: 'demographics', name: 'Demographics', content: {} },
    //                 {
    //                     id: 'digital-learnings', name: 'Digital Learnings', content: {
    //                         campaignData: { title: 'Campaign Data', metrics: [] },
    //                         quizzes: { title: 'Quizzes', charts: [] },
    //                         hypothesisTests: { title: 'Hypothesis Tests', tests: [] }
    //                     }
    //                 },
    //                 {
    //                     id: 'testimonies', name: 'Testimonies', content: {
    //                         filters: { genders: ['All', 'Male', 'Female'] },
    //                         stories: []
    //                     }
    //                 },
    //                 {
    //                     id: 'all', name: 'All', content: {
    //                         overview: { title: 'Overview', text: '' },
    //                         combinedHighlights: {
    //                             demographics: { title: 'Demographics Highlights', stats: [] },
    //                             digitalLearnings: { title: 'Digital Learnings Highlights', stats: [] },
    //                             testimonies: { title: 'Featured Testimony', featured: {} },
    //                             quickNumbers: { title: 'Quick Numbers', stats: [] }
    //                         }
    //                     }
    //                 }
    //             ]
    //         }
    //     };

    //     // Load data.js script dynamically
    //     const script = document.createElement('script');
    //     script.src = 'data.js';
    //     document.head.appendChild(script);
    // }
}

// Initialize navigation
function initializeNavigation() {
    const navElement = document.getElementById('main-nav');
    if (!navElement) return;

    // Determine current page
    const isHomePage = window.location.pathname.includes('index.html');
    const isHistoricalPage = window.location.pathname.includes('historical-data.html');

    // Add navigation items
    let navHTML = '';
    navHTML += `<a href="index.html" class="nav-item ${isHomePage ? 'active' : ''}">Home</a>`;
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

    // Add event listeners to settings-btn
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function () {
            // Open settings modal
            // settings-dialog
            document.getElementById('settings-dialog').showModal();

        });
    }
}

// lsten to #dark-mode
document.addEventListener('DOMContentLoaded', function () {
    // Check if dark mode is enabled in local storage
    const darkModeEnabled = localStorage.getItem('dark-mode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        document.getElementById('dark-mode').checked = true;
    }
    document.getElementById('dark-mode').addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
            localStorage.setItem('dark-mode', 'true');
        } else {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('dark-mode', 'false');
        }
    });
});



// Initialize dropdown filters for search
async function initializeSearchDropdowns() {
    try {
        // Get all unique values from the database for each filter
        const regions = getUniqueValues('upg_groups', 'main_country');
        const countries = getUniqueValues('upg_groups', 'country');
        const languages = getUniqueValues('upg_groups', 'main_language');
        const religions = getUniqueValues('upg_groups', 'main_religion');
        const ethnicities = getUniqueValues('upg_groups', 'name');

        // Populate dropdowns
        populateDropdown('region-menu', regions);
        populateDropdown('country-menu', countries);
        populateDropdown('language-menu', languages);
        populateDropdown('religion-menu', religions);
        populateDropdown('ethnicity-menu', ethnicities);

        // Setup enhanced dropdowns after population
        setupDropdowns();

        // Add CSS class for styling feedback
        document.querySelectorAll('.search-dropdown').forEach(dropdown => {
            dropdown.classList.add('dropdown-ready');
        });
    } catch (error) {
        console.error('Error initializing search dropdowns:', error);
    }
}

// Get unique values from a database column
function getUniqueValues(table, column) {
    // Extract unique values from the loadedUPGs array
    const uniqueValues = [...new Set(loadedUPGs.map(row => row[column]).filter(value => value))].sort();
    return uniqueValues;
}

// Helper function to populate a dropdown
function populateDropdown(dropdownId, items) {
    const dropdownElement = document.getElementById(dropdownId);
    if (!dropdownElement) return;

    let dropdownHTML = '';
    items.forEach(item => {
        dropdownHTML += `<div class="dropdown-item" data-value="${item}">${item}</div>`;
    });

    // add All that just has ""
    dropdownHTML = `<div class="dropdown-item" data-value="">All</div>` + dropdownHTML;

    dropdownElement.innerHTML = dropdownHTML;

    // After populating, ensure the associated input can find matches
    const dropdown = dropdownElement.closest('.search-dropdown');
    if (dropdown) {
        const input = dropdown.previousElementSibling;
        if (input && input.classList.contains('search-input')) {
            // Setup autocomplete functionality
            setupInputAutocomplete(input, items);
        }
    }
}

// Setup autocomplete for input fields
function setupInputAutocomplete(inputElement, suggestionItems) {
    // Create a datalist for autocomplete suggestions
    const datalistId = `${inputElement.id}-suggestions`;
    let datalist = document.getElementById(datalistId);

    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = datalistId;
        document.body.appendChild(datalist);

        // Connect the datalist to the input
        inputElement.setAttribute('list', datalistId);
    }

    // Clear existing options
    datalist.innerHTML = '';

    // Add options to datalist
    suggestionItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item;
        datalist.appendChild(option);
    });
}


let loadedUPGs = [];

// Load all people groups from database
async function loadAllPeopleGroups() {
    try {
        // Show search results container
        const searchResultsContainer = document.getElementById('search-results');
        if (searchResultsContainer) {
            searchResultsContainer.style.display = 'block';
        }

        // // Hide main content container
        // const mainContentContainer = document.getElementById('main-content');
        // if (mainContentContainer) {
        //     mainContentContainer.style.display = 'none';
        // }

        loading(true);

        const short = await getData("SELECT * FROM upg_groups ORDER BY name LIMIT 12");
        populateSearchResults(short.rows);
        loading(false);


        // Fetch all people groups from the database
        const sql = "SELECT * FROM upg_groups ORDER BY name";
        const data = await getData(sql);
        loadedUPGs = data.rows; // Store loaded UPGs for later use


        // Populate search results grid
        populateSearchResults(data.rows);

        // Initialize search dropdowns
        await initializeSearchDropdowns();

    } catch (error) {
        console.error('Error loading people groups:', error);
    }
}

async function loading(isLoading) {
    const loadingOverlay = document.getElementById('loading-fill');

    if (loadingOverlay) {
        loadingOverlay.style.transition = 'opacity 0.3s';
        if (isLoading) {
            loadingOverlay.style.display = 'flex';
            setTimeout(() => {
                loadingOverlay.style.opacity = '1';
            }, 10); // Small delay to ensure transition applies
        } else {
            // await delay(500);
            loadingOverlay.style.opacity = '0';
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
            }, 300); // Wait for the opacity transition to complete
        }
    }
}

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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
                        <span class="info-tag"><span class="material-symbols-outlined">person</span> ${formatNumber(group.population) || 'Unknown'}</span>
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
        card.addEventListener('click', function () {
            const groupId = this.getAttribute('data-group-id');
            // Navigate to the details page with group ID as URL parameter
            window.location.href = `upg-details.html?groupId=${groupId}`;
        });
    });
}

function formatNumber(num) {
    // Format number with commas for thousands
    if (num === null || num === undefined) return 'Unknown';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Load detailed information for a specific people group
async function loadPeopleGroupDetails(groupId) {
    try {
        // Hide search results
        document.getElementById('search-results').style.display = 'none';

        // Show main content
        document.getElementById('main-content').style.display = 'block';

        // Fetch basic group info from loadedUPGs
        const group = loadedUPGs.find(g => g.id === parseInt(groupId));
        if (!group) {
            console.error('Group not found in loaded UPGs');
            return;
        }

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
            { id: 'external-resources', name: 'External Resources' },
            { id: 'all', name: 'All' }
        ];

        // Initialize section filters
        initializeSectionFilters(sections);

        // Immediately render the basic structure with profiles, map and info cards
        // and add loading skeletons for the content that will load later
        renderBasicStructureWithLoadingSkeletons(group);

        // Fetch research content for this group (in background)
        const contentSql = `SELECT * FROM upg_research_content WHERE group_id = ${groupId}`;
        const contentData = await getData(contentSql);

        // Organize content by section type
        const organizedContent = organizeContentBySectionType(contentData.rows);

        // Now replace loading skeletons with actual content
        replaceLoadingSkeletonsWithContent(organizedContent, sections[0]);
    } catch (error) {
        console.error('Error loading people group details:', error);
    }
}

// Render the basic structure with profiles, map, info cards and loading skeletons
function renderBasicStructureWithLoadingSkeletons(group) {
    const contentSectionsElement = document.getElementById('content-sections');
    if (!contentSectionsElement) return;

    // Clear existing content
    contentSectionsElement.innerHTML = '';

    // Create section element
    const sectionElement = document.createElement('div');
    sectionElement.className = 'content-section demographics-section active';
    sectionElement.id = 'current-active-section';

    // Add people images and map with group info cards
    sectionElement.innerHTML = `
        <div class="content-grid">
            <div class="people-section">
                <div class="people-image-male clickable-media" data-type="image" data-index="0">
                    <img src="${group.male_profile_photo_url || 'placeholder.jpg'}" alt="${group.name} man">
                    <div class="people-image-label">Male</div>
                </div>
                <div class="people-image-female clickable-media" data-type="image" data-index="1">
                    <img src="${group.female_profile_photo_url || 'placeholder.jpg'}" alt="${group.name} woman">
                    <div class="people-image-label">Female</div>
                </div>
            </div>

            <div class="map-container clickable-media" data-type="map" data-index="2">
                <img src="${group.map_image_url || 'placeholder-map.jpg'}" alt="Map">
            </div>
        </div>

        <!-- Group info strip (horizontal layout) -->
        <div class="group-info-strip">
            <div class="info-strip-card" data-info-title="Population" data-info-value="${formatNumber(group.population) || 'Unknown'}" data-info-icon="groups">
                <div class="info-strip-icon">
                    <span class="material-symbols-outlined">groups</span>
                </div>
                <div class="info-strip-content">
                    <div class="info-strip-title">Population</div>
                    <div class="info-strip-value" title="${formatNumber(group.population) || 'Unknown'}">${formatNumber(group.population) || 'Unknown'}</div>
                </div>
            </div>
            <div class="info-strip-card" data-info-title="Main Language" data-info-value="${group.main_language || 'Unknown'}" data-info-icon="language">
                <div class="info-strip-icon">
                    <span class="material-symbols-outlined">language</span>
                </div>
                <div class="info-strip-content">
                    <div class="info-strip-title">Main Language</div>
                    <div class="info-strip-value" title="${group.main_language || 'Unknown'}">${group.main_language || 'Unknown'}</div>
                </div>
            </div>
            <div class="info-strip-card" data-info-title="Main Religion" data-info-value="${group.main_religion || 'Unknown'}" data-info-icon="church">
                <div class="info-strip-icon">
                    <span class="material-symbols-outlined">church</span>
                </div>
                <div class="info-strip-content">
                    <div class="info-strip-title">Main Religion</div>
                    <div class="info-strip-value" title="${group.main_religion || 'Unknown'}">${group.main_religion || 'Unknown'}</div>
                </div>
            </div>
            <div class="info-strip-card" data-info-title="Main Region" data-info-value="${group.main_country || 'Unknown'}" data-info-icon="public">
                <div class="info-strip-icon">
                    <span class="material-symbols-outlined">public</span>
                </div>
                <div class="info-strip-content">
                    <div class="info-strip-title">Main Region</div>
                    <div class="info-strip-value" title="${group.main_country || 'Unknown'}">${group.main_country || 'Unknown'}</div>
                </div>
            </div>
        </div>
        
        <!-- Loading skeletons for content sections -->
        <div class="loading-skeletons">
            <!-- Introduction skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            
            <!-- Demographics skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            
            <!-- Everyday lives skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            
            <!-- Environment skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
        </div>
    `;

    // Add section to the content sections container
    contentSectionsElement.appendChild(sectionElement);

    // Now apply event listeners AFTER the DOM has been updated
    // Give it a small timeout to ensure DOM is fully updated
    setTimeout(() => {
        // Initialize click listeners for clickable media
        initializeClickableMedia(group);

        // Initialize info strip card click listeners
        initializeInfoStripCards();
    }, 0);
}

// Initialize clickable media (images and map)
function initializeClickableMedia(group) {
    // console.log('Initializing clickable media');
    const clickableMedia = document.querySelectorAll('.clickable-media');

    // Prepare media data for carousel
    const mediaData = [
        {
            type: 'image',
            src: group.male_profile_photo_url || 'placeholder.jpg',
            alt: `${group.name} man`,
            title: `${group.name} Male`
        },
        {
            type: 'image',
            src: group.female_profile_photo_url || 'placeholder.jpg',
            alt: `${group.name} woman`,
            title: `${group.name} Female`
        },
        {
            type: 'map',
            src: group.map_image_url || 'placeholder-map.jpg',
            alt: 'Geographic distribution map',
            title: `${group.name} Geographic Distribution`
        }
    ];

    clickableMedia.forEach(media => {
        // Remove any existing click listeners to prevent duplicates
        media.removeEventListener('click', clickMediaHandler);

        // Add click listener with named function for easier debugging
        media.addEventListener('click', clickMediaHandler);

        // Store the media data as a property on the element for easier access
        media.mediaData = mediaData;
    });

    // console.log(`Attached listeners to ${clickableMedia.length} media elements`);
}

// Click handler function for media elements
function clickMediaHandler(event) {
    console.log('Media clicked');
    const index = parseInt(this.getAttribute('data-index'));
    const mediaData = this.mediaData || window.currentMediaData;

    if (!mediaData) {
        console.error('Media data not available');
        return;
    }

    openMediaCarousel(mediaData, index);
}

// Open media carousel modal
// Open media carousel modal
function openMediaCarousel(mediaData, startIndex) {
    console.log('Opening media carousel', startIndex);
    // Store media data globally for easier access if needed later
    window.currentMediaData = mediaData;

    // Create modal element if it doesn't exist
    let mediaModal = document.getElementById('media-carousel-modal');
    if (!mediaModal) {
        mediaModal = document.createElement('dialog');
        mediaModal.id = 'media-carousel-modal';
        mediaModal.className = 'media-carousel-modal';
        document.body.appendChild(mediaModal);
    }

    // Build carousel HTML
    let carouselHTML = `
        <div class="carousel-close">
            <span class="material-symbols-outlined">close</span>
        </div>
        <div class="carousel-container">
            <div class="carousel-navigation carousel-prev">
                <span class="material-symbols-outlined">arrow_back_ios</span>
            </div>
            <div class="carousel-content">
                <div class="carousel-title">${mediaData[startIndex].title}</div>
                <div class="carousel-image-container">
                    <img src="${mediaData[startIndex].src}" alt="${mediaData[startIndex].alt}">
                </div>
            </div>
            <div class="carousel-navigation carousel-next">
                <span class="material-symbols-outlined">arrow_forward_ios</span>
            </div>
        </div>
        <div class="carousel-thumbnails">
            ${mediaData.map((item, index) => `
                <div class="carousel-thumbnail ${index === startIndex ? 'active' : ''}" data-index="${index}">
                    <img src="${item.src}" alt="Thumbnail">
                </div>
            `).join('')}
        </div>
    `;

    mediaModal.innerHTML = carouselHTML;

    // Show the modal
    mediaModal.showModal();

    // Set up tracking for current index
    mediaModal.currentIndex = startIndex;

    // Add event listeners AFTER the DOM elements are created
    const prevButton = mediaModal.querySelector('.carousel-prev');
    const nextButton = mediaModal.querySelector('.carousel-next');
    const closeButton = mediaModal.querySelector('.carousel-close');
    const thumbnails = mediaModal.querySelectorAll('.carousel-thumbnail');

    // Close button
    closeButton.addEventListener('click', function () {
        mediaModal.close();
    });

    // Previous button click
    prevButton.addEventListener('click', function () {
        navigateCarousel('prev', mediaModal, mediaData);
    });

    // Next button click
    nextButton.addEventListener('click', function () {
        navigateCarousel('next', mediaModal, mediaData);
    });

    // Thumbnail clicks
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            const index = parseInt(this.getAttribute('data-index'));
            updateCarouselContent(mediaModal, mediaData, index);
        });
    });

    // Add keyboard navigation
    mediaModal.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            navigateCarousel('prev', mediaModal, mediaData);
        } else if (e.key === 'ArrowRight') {
            navigateCarousel('next', mediaModal, mediaData);
        } else if (e.key === 'Escape') {
            mediaModal.close();
        }
    });
}

// Navigate carousel (prev/next)
function navigateCarousel(direction, modal, mediaData) {
    const current = modal.currentIndex;
    let newIndex;

    if (direction === 'prev') {
        newIndex = (current - 1 + mediaData.length) % mediaData.length;
    } else {
        newIndex = (current + 1) % mediaData.length;
    }

    updateCarouselContent(modal, mediaData, newIndex);
}

// Update carousel content
function updateCarouselContent(modal, mediaData, newIndex) {
    // Update current index
    modal.currentIndex = newIndex;

    // Update main image and title
    modal.querySelector('.carousel-image-container img').src = mediaData[newIndex].src;
    modal.querySelector('.carousel-image-container img').alt = mediaData[newIndex].alt;
    modal.querySelector('.carousel-title').textContent = mediaData[newIndex].title;

    // Update active thumbnail
    const thumbnails = modal.querySelectorAll('.carousel-thumbnail');
    thumbnails.forEach((thumbnail, index) => {
        if (index === newIndex) {
            thumbnail.classList.add('active');
        } else {
            thumbnail.classList.remove('active');
        }
    });
}


// Initialize info strip cards click listeners
function initializeInfoStripCards() {
    // console.log('Initializing info strip cards');
    const infoStripCards = document.querySelectorAll('.info-strip-card');

    infoStripCards.forEach(card => {
        // Remove any existing click listeners to prevent duplicates
        card.removeEventListener('click', clickCardHandler);

        // Add click listener with named function for easier debugging
        card.addEventListener('click', clickCardHandler);
    });

    // console.log(`Attached listeners to ${infoStripCards.length} info cards`);
}

// Click handler function for info cards
function clickCardHandler(event) {
    console.log('Info card clicked');
    // Get card data
    const title = this.getAttribute('data-info-title');
    const value = this.getAttribute('data-info-value');
    const icon = this.getAttribute('data-info-icon');

    openInfoCardModal(title, value, icon);
}


// Open info card modal
function openInfoCardModal(title, value, icon) {
    console.log('Opening info card modal', title);

    // Create modal element if it doesn't exist
    let infoModal = document.getElementById('info-card-modal');
    if (!infoModal) {
        infoModal = document.createElement('dialog');
        infoModal.id = 'info-card-modal';
        infoModal.className = 'info-card-modal';
        document.body.appendChild(infoModal);
    }

    // Build modal HTML
    infoModal.innerHTML = `
        <div class="info-modal-close">
            <span class="material-symbols-outlined">close</span>
        </div>
        <div class="info-modal-content">
            <div class="info-modal-icon">
                <span class="material-symbols-outlined">${icon}</span>
            </div>
            <div class="info-modal-title">${title}</div>
            <div class="info-modal-value">${value}</div>
        </div>
    `;

    // Show the modal
    infoModal.showModal();

    // Add close event listener
    const closeButton = infoModal.querySelector('.info-modal-close');
    closeButton.addEventListener('click', function () {
        infoModal.close();
    });

    // Close on Escape key
    infoModal.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            infoModal.close();
        }
    });
}

// Replace loading skeletons with actual content
function replaceLoadingSkeletonsWithContent(organizedContent, selectedSection) {
    const sectionElement = document.getElementById('current-active-section');
    if (!sectionElement) return;

    // Remove loading skeletons
    const loadingSkeletons = sectionElement.querySelector('.loading-skeletons');
    if (loadingSkeletons) {
        loadingSkeletons.remove();
    }

    // Populate with appropriate content based on selected section
    switch (selectedSection.id) {
        case 'demographics':
            populateDemographicsSection(sectionElement, organizedContent);
            break;
        case 'digital-learnings':
            populateDigitalLearningsSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'digital-learnings').content);
            break;
        case 'testimonies':
            // Updated to call without content parameter
            populateTestimoniesSection(sectionElement);
            break;
        case 'external-resources':
            // Call the function to populate external resources
            const groupName = document.getElementById('group-name').textContent;
            populateExternalResourcesSection(sectionElement, groupName);
            break;
        case 'all':
            populateAllSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'all').content);
            break;
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
        { id: 'external-resources', name: 'External Resources' },
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
        button.addEventListener('click', async function () {
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

                // Get the current section element
                const sectionElement = document.getElementById('current-active-section');

                // Clear existing content but keep profiles, map and info cards
                clearContentKeepingProfilesAndMap(sectionElement);

                // Add loading skeletons
                addLoadingSkeletons(sectionElement);

                // Small timeout to ensure UI updates before potentially heavy operations
                setTimeout(async () => {
                    // Get the current group's content (this is already cached)
                    const groupId = loadedUPGs.find(g => g.name === document.getElementById('group-name').textContent).id;
                    const contentSql = `SELECT * FROM upg_research_content WHERE group_id = ${groupId}`;
                    const contentData = await getData(contentSql);
                    const organizedContent = organizeContentBySectionType(contentData.rows);

                    // Remove loading skeletons
                    removeLoadingSkeletons(sectionElement);

                    // Load content for the new section
                    switch (selectedSection.id) {
                        case 'demographics':
                            populateDemographicsSection(sectionElement, organizedContent);
                            break;
                        case 'digital-learnings':
                            populateDigitalLearningsSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'digital-learnings').content);
                            break;
                        case 'testimonies':
                            populateTestimoniesSection(sectionElement);
                            break;
                        case 'external-resources':
                            // Call the function to populate external resources
                            const groupName = document.getElementById('group-name').textContent;
                            populateExternalResourcesSection(sectionElement, groupName);
                            break;
                        case 'all':
                            populateAllSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'all').content);
                            break;
                    }
                }, 200);
            }
        });
    });
}

// Helper function to add loading skeletons
function addLoadingSkeletons(sectionElement) {
    const loadingSkeletonsDiv = document.createElement('div');
    loadingSkeletonsDiv.className = 'loading-skeletons';

    // Add different skeletons based on section type
    const currentSectionText = document.getElementById('current-section').textContent;

    if (currentSectionText === 'Demographics') {
        // Demographics skeletons
        loadingSkeletonsDiv.innerHTML = `
            <!-- Introduction skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            
            <!-- Demographics skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            
            <!-- Everyday lives skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            
            <!-- Environment skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
            </div>
        `;
    } else if (currentSectionText === 'Digital Learnings') {
        // Digital Learnings skeletons
        loadingSkeletonsDiv.innerHTML = `
            <!-- Campaign Data skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-chart"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            
            <!-- Quizzes skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-chart"></div>
                <div class="skeleton-paragraph"></div>
            </div>
        `;
    } else if (currentSectionText === 'Testimonies') {
        // Testimonies skeletons
        loadingSkeletonsDiv.innerHTML = `
            <!-- Testimony filter skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-buttons"></div>
            </div>
            
            <!-- Testimony cards skeletons -->
            <div class="skeleton-flex">
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
                <div class="skeleton-card"></div>
            </div>
        `;

    }
    else {
        // All section skeletons
        loadingSkeletonsDiv.innerHTML = `
            <!-- Overview skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            
            <!-- Highlights skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-stats"></div>
            </div>
            
            <!-- Featured testimony skeleton -->
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-card-large"></div>
            </div>
        `;
    }

    sectionElement.appendChild(loadingSkeletonsDiv);
}

// Helper function to remove loading skeletons
function removeLoadingSkeletons(sectionElement) {
    const loadingSkeletons = sectionElement.querySelector('.loading-skeletons');
    if (loadingSkeletons) {
        loadingSkeletons.remove();
    }
}

function loadSection(group, organizedContent, section) {
    const contentSectionsElement = document.getElementById('content-sections');
    if (!contentSectionsElement) return;

    // Clear existing content
    contentSectionsElement.innerHTML = '';

    // Create section element
    const sectionElement = document.createElement('div');
    sectionElement.className = `content-section ${section.id}-section active`;
    sectionElement.id = 'current-active-section';

    // Add people images and map with group info cards (immediately)
    sectionElement.innerHTML = `
        <div class="content-grid">
            <div class="people-section">
                <div class="people-image-male clickable-media" data-type="image" data-index="0">
                    <img src="${group.male_profile_photo_url || 'placeholder.jpg'}" alt="${group.name} man">
                    <div class="people-image-label">Male</div>
                </div>
                <div class="people-image-female clickable-media" data-type="image" data-index="1">
                    <img src="${group.female_profile_photo_url || 'placeholder.jpg'}" alt="${group.name} woman">
                    <div class="people-image-label">Female</div>
                </div>
            </div>

            <div class="map-container clickable-media" data-type="map" data-index="2">
                <img src="${group.map_image_url || 'placeholder-map.jpg'}" alt="Map">
            </div>
        </div>

        <!-- Group info strip -->
        <div class="group-info-strip">
            <div class="info-strip-card" data-info-title="Population" data-info-value="${formatNumber(group.population) || 'Unknown'}" data-info-icon="groups">
                <div class="info-strip-icon">
                    <span class="material-symbols-outlined">groups</span>
                </div>
                <div class="info-strip-content">
                    <div class="info-strip-title">Population</div>
                    <div class="info-strip-value" title="${formatNumber(group.population) || 'Unknown'}">${formatNumber(group.population) || 'Unknown'}</div>
                </div>
            </div>
            <div class="info-strip-card" data-info-title="Main Language" data-info-value="${group.main_language || 'Unknown'}" data-info-icon="language">
                <div class="info-strip-icon">
                    <span class="material-symbols-outlined">language</span>
                </div>
                <div class="info-strip-content">
                    <div class="info-strip-title">Main Language</div>
                    <div class="info-strip-value" title="${group.main_language || 'Unknown'}">${group.main_language || 'Unknown'}</div>
                </div>
            </div>
            <div class="info-strip-card" data-info-title="Main Religion" data-info-value="${group.main_religion || 'Unknown'}" data-info-icon="church">
                <div class="info-strip-icon">
                    <span class="material-symbols-outlined">church</span>
                </div>
                <div class="info-strip-content">
                    <div class="info-strip-title">Main Religion</div>
                    <div class="info-strip-value" title="${group.main_religion || 'Unknown'}">${group.main_religion || 'Unknown'}</div>
                </div>
            </div>
            <div class="info-strip-card" data-info-title="Main Region" data-info-value="${group.main_country || 'Unknown'}" data-info-icon="public">
                <div class="info-strip-icon">
                    <span class="material-symbols-outlined">public</span>
                </div>
                <div class="info-strip-content">
                    <div class="info-strip-title">Main Region</div>
                    <div class="info-strip-value" title="${group.main_country || 'Unknown'}">${group.main_country || 'Unknown'}</div>
                </div>
            </div>
        </div>
        
        <!-- Loading skeletons for section-specific content -->
        <div class="loading-skeletons">
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
            </div>
        </div>
    `;

    // Add section to the content sections container
    contentSectionsElement.appendChild(sectionElement);

    // Store media data globally for easier access
    window.currentMediaData = [
        {
            type: 'image',
            src: group.male_profile_photo_url || 'placeholder.jpg',
            alt: `${group.name} man`,
            title: `${group.name} Male`
        },
        {
            type: 'image',
            src: group.female_profile_photo_url || 'placeholder.jpg',
            alt: `${group.name} woman`,
            title: `${group.name} Female`
        },
        {
            type: 'map',
            src: group.map_image_url || 'placeholder-map.jpg',
            alt: 'Geographic distribution map',
            title: `${group.name} Geographic Distribution`
        }
    ];

    // Add event listeners AFTER the DOM has been updated
    setTimeout(() => {
        // Initialize click listeners for clickable media
        initializeClickableMedia(group);

        // Initialize info strip card click listeners
        initializeInfoStripCards();

        // Add section-specific content
        // Remove loading skeletons
        const loadingSkeletons = sectionElement.querySelector('.loading-skeletons');
        if (loadingSkeletons) {
            loadingSkeletons.remove();
        }

        // Add the actual content
        switch (section.id) {
            case 'demographics':
                populateDemographicsSection(sectionElement, organizedContent);
                break;
            case 'digital-learnings':
                populateDigitalLearningsSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'digital-learnings').content);
                break;
            case 'testimonies':
                populateTestimoniesSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'testimonies').content);
                break;
            case 'external-resources':
                // Call the function to populate external resources
                const groupName = document.getElementById('group-name').textContent;
                populateExternalResourcesSection(sectionElement, groupName);
                break;
            case 'all':
                populateAllSection(sectionElement, websiteData.tharu.sections.find(s => s.id === 'all').content);
                break;
        }
    }, 0);
}
// Also update the clearContentKeepingProfilesAndMap function to handle the new layout
function clearContentKeepingProfilesAndMap(sectionElement) {
    // Keep only the content grid and info strip, remove all else
    const contentToKeep = [
        sectionElement.querySelector('.content-grid'),
        sectionElement.querySelector('.group-info-strip')
    ];

    // Create a temporary element to hold what we're keeping
    const tempHolder = document.createElement('div');
    contentToKeep.forEach(item => {
        if (item) tempHolder.appendChild(item.cloneNode(true));
    });

    // Clear the section and add back what we're keeping
    sectionElement.innerHTML = '';
    while (tempHolder.firstChild) {
        sectionElement.appendChild(tempHolder.firstChild);
    }

    // Re-initialize the event listeners after DOM update
    setTimeout(() => {
        // Re-initialize clickable media and info cards
        const groupName = document.getElementById('group-name').textContent;
        const group = loadedUPGs.find(g => g.name === groupName);
        if (group) {
            initializeClickableMedia(group);
            initializeInfoStripCards();
        }
    }, 0);
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
    // Loop through all sections in organizedContent
    for (const [sectionKey, sectionContent] of Object.entries(organizedContent)) {
        if (sectionContent.length > 0) {
            // Format the section title by converting the key to a readable format
            const sectionTitle = sectionKey.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            sectionElement.innerHTML += `
                <h2 class="section-title">${sectionTitle}</h2>
                <p>${sectionContent[0].content_text}</p>
            `;
        }
    }

    // fix event listeners for the new profiles and map
    const groupName = document.getElementById('group-name').textContent;
    const group = loadedUPGs.find(g => g.name === groupName);
    if (group) {
        initializeClickableMedia(group);
        initializeInfoStripCards();
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

document.addEventListener('DOMContentLoaded', function () {

    // Overriding the existing setup event listeners function
    // to include our enhanced dropdown functionality
    window.setupEventListeners = function () {

        // Enhanced dropdown functionality
        setupDropdowns();

        // Add visual feedback when clicking buttons
        setupButtonRippleEffects();

        // Initialize tooltips for stat cards
        setupTooltips();

        // Add keyboard support for search
        const searchInputs = document.querySelectorAll('.search-input');
        searchInputs.forEach(input => {
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        });
    };

    // Make sure our functions are available globally
    window.setupDropdowns = setupDropdowns;
    window.populateDropdown = populateDropdown;
});





// Handle search button click
async function handleSearch() {
    // Get search values
    const region = document.getElementById('region-search')?.value.toLowerCase() || '';
    const country = document.getElementById('country-search')?.value.toLowerCase() || '';
    const language = document.getElementById('language-search')?.value.toLowerCase() || '';
    const ethnicity = document.getElementById('ethnicity-search')?.value.toLowerCase() || '';
    const religion = document.getElementById('religion-search')?.value.toLowerCase() || '';

    console.log('Search filters:', { region, country, language, ethnicity, religion });

    // Filter loadedUPGs instead of querying the database
    const filteredUPGs = loadedUPGs.filter(group => {
        return ((!region || region === 'all' || group.main_country?.toLowerCase().includes(region)) &&
            (!country || country === 'all' || group.country?.toLowerCase().includes(country)) &&
            (!language || language === 'all' || group.main_language?.toLowerCase().includes(language)) &&
            (!ethnicity || ethnicity === 'all' || group.name?.toLowerCase().includes(ethnicity)) &&
            (!religion || religion === 'all' || group.main_religion?.toLowerCase().includes(religion)));
    });

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

        // Populate search results
        populateSearchResults(filteredUPGs);
    } catch (error) {
        console.error('Error searching people groups:', error);
    }
}

// Set up dropdowns with animations
function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.search-dropdown');
    const searchInputs = document.querySelectorAll('.search-input');

    // Setup each dropdown
    dropdowns.forEach(dropdown => {
        // Find the associated input element
        const searchInput = dropdown.previousElementSibling;

        // Dropdown toggle on click
        dropdown.addEventListener('click', function (e) {
            e.stopPropagation();

            // Close all other dropdowns
            dropdowns.forEach(d => {
                if (d !== dropdown) {
                    d.classList.remove('active');
                }
            });

            // Toggle current dropdown
            this.classList.toggle('active');
        });

        // When dropdown menu is available, setup item selection
        const setupDropdownItems = () => {
            const dropdownMenu = dropdown.querySelector('.dropdown-menu');
            if (!dropdownMenu) return;

            const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');

            dropdownItems.forEach(item => {
                item.addEventListener('click', function (e) {
                    e.stopPropagation();

                    // Update input value with selected item text
                    searchInput.value = this.textContent.trim();

                    // Add selected class for visual feedback
                    dropdownItems.forEach(di => di.classList.remove('selected'));
                    this.classList.add('selected');

                    // Close dropdown with a small delay for smooth UX
                    setTimeout(() => {
                        dropdown.classList.remove('active');
                    }, 150);
                });
            });
        };

        // Initial setup of dropdown items
        setupDropdownItems();

        // Re-setup dropdown items when they might have been changed
        // This ensures dynamically added items also get event listeners
        const observer = new MutationObserver(setupDropdownItems);
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        if (dropdownMenu) {
            observer.observe(dropdownMenu, { childList: true });
        }
    });

    // Setup input-based filtering
    searchInputs.forEach(input => {
        const dropdown = input.nextElementSibling;
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        input.addEventListener('focus', function () {
            // Open dropdown when input is focused
            dropdown.classList.add('active');
        });

        input.addEventListener('input', function () {
            // Show dropdown when typing
            dropdown.classList.add('active');

            const filterValue = this.value.toLowerCase().trim();

            // Filter dropdown items based on input
            if (dropdownMenu) {
                const items = dropdownMenu.querySelectorAll('.dropdown-item');
                let hasVisibleItems = false;

                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    const shouldShow = text.includes(filterValue);

                    item.style.display = shouldShow ? 'block' : 'none';
                    if (shouldShow) hasVisibleItems = true;
                });

                // If input is empty, show all items
                if (filterValue === '') {
                    items.forEach(item => {
                        item.style.display = 'block';
                    });
                    hasVisibleItems = items.length > 0;
                }

                // Show "No results" if no matching items
                let noResultsElement = dropdownMenu.querySelector('.no-results');

                if (!hasVisibleItems) {
                    if (!noResultsElement) {
                        noResultsElement = document.createElement('div');
                        noResultsElement.className = 'no-results';
                        noResultsElement.textContent = 'No matching options';
                        dropdownMenu.appendChild(noResultsElement);
                    }
                    noResultsElement.style.display = 'block';
                } else if (noResultsElement) {
                    noResultsElement.style.display = 'none';
                }
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function () {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
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

// Data fetching function with local storage caching
async function getData(sql, cacheBust = false) {
    const cacheKey = `cache_${btoa(sql)}`; // Use base64 encoding for unique keys
    const cacheTimestampKey = `${cacheKey}_timestamp`;

    // Check if cache busting is requested
    if (cacheBust) {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(cacheTimestampKey);
    }

    // Check if the data is already in local storage and not outdated
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
    const now = Date.now();

    if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp, 10) < 3600000) {
        console.log('Fetching from cache: ', cacheKey);
        return JSON.parse(cachedData);
    }

    // Fetch data from the API
    const response = await fetch('https://khnl5wvfdtpayvznnbh2r7kiqi0nshuu.lambda-url.ap-southeast-2.on.aws/', {
        method: 'POST',
        body: JSON.stringify({ sql })
    });

    const data = await response.json();
    console.log('Fetching data from API:', data);

    // Store the data and timestamp in local storage
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(cacheTimestampKey, now.toString());

    return data;
}


async function clearCache() {
    // Clear all cached data in local storage
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (key.startsWith('cache_')) {
            localStorage.removeItem(key);
        }
    });

    console.log('Cache cleared');

    // close settings-dialog
    document.getElementById('settings-dialog').close();
    window.location.reload();
}

// Initialize the historical data page
async function initializeHistoricalDataPage() {
    console.log('Initializing Historical Data page');

    loading(true);
    const quick = 'SELECT * FROM upg_historical_hypothesis_tests LIMIT 6';
    const quickData = await getData(quick);
    initializeHistoricalCards(quickData.rows);
    loading(false);


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
    yearDropdown.addEventListener('click', function (e) {
        e.stopPropagation();

        // Close country dropdown
        countryDropdown.classList.remove('active');

        // Toggle year dropdown
        this.classList.toggle('active');
    });

    // Country dropdown click handler
    countryDropdown.addEventListener('click', function (e) {
        e.stopPropagation();

        // Close year dropdown
        yearDropdown.classList.remove('active');

        // Toggle country dropdown
        this.classList.toggle('active');
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function () {
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
        item.addEventListener('click', function () {
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
    console.log('Initializing country filter with data:', data);
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

    console.log('Sorted countries:', countries);


    // Create country dropdown items
    let countryOptionsHTML = '';
    countries.forEach(country => {
        countryOptionsHTML += `<div class="dropdown-item" data-value="${country === 'All Countries' ? 'all' : country}">${country}</div>`;
    });

    countryMenu.innerHTML = countryOptionsHTML;

    // Add event listeners to country dropdown items
    const countryItems = countryMenu.querySelectorAll('.dropdown-item');
    countryItems.forEach(item => {
        item.addEventListener('click', function () {
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

    resetButton.addEventListener('click', function () {
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


// Function to clean UPG name for API call
function cleanUPGName(name) {
    // Remove country information in parentheses if present
    const cleanedName = name.replace(/\s*\([^)]*\)\s*/g, '');
    return cleanedName.trim();
}

// Function to fetch data from Joshua Project API
async function fetchJoshuaProjectData(upgName) {
    try {
        const cleanedName = cleanUPGName(upgName);
        console.log(`Fetching Joshua Project data for: ${cleanedName}`);

        // Construct the API URL
        const apiKey = '1a1d6edcba8b';
        const apiUrl = `https://joshuaproject.net/api/v2/people_groups?api_key=${apiKey}&PeopNameInCountry=${encodeURIComponent(cleanedName)}`;

        // Create a loading indicator
        const externalSection = document.getElementById('current-active-section');
        if (externalSection) {
            externalSection.innerHTML += `
                <div id="jp-loading" class="loading">
                    <div class="loading-spinner"></div>
                    <div style="margin-left: 15px;">Loading Joshua Project data...</div>
                </div>
            `;
        }

        // Fetch data
        const response = await fetch(apiUrl);
        console.log('Joshua Project API response status:', response.status);

        const data = await response.json();

        // Remove loading indicator
        const loadingElement = document.getElementById('jp-loading');
        if (loadingElement) {
            loadingElement.remove();
        }

        console.log('Joshua Project API response:', data);

        // Check if data was found
        if (data.meta.pagination.total_count === 0) {
            // No data found
            return { success: false, message: 'No data found for this people group in Joshua Project database.' };
        }

        // Return successful response
        return { success: true, data: data.data[0] };

    } catch (error) {
        console.error('Error fetching Joshua Project data:', error);
        // Remove loading indicator
        const loadingElement = document.getElementById('jp-loading');
        if (loadingElement) {
            loadingElement.remove();
        }
        return { success: false, message: 'Data not found in the Joshua Project API.' };
    }
}

// Function to populate the External Resources section
function populateExternalResourcesSection(sectionElement, groupName) {
    // Clear existing content within the section (except for profiles and info strip)
    console.log(`Populating External Resources section for: ${groupName}`);
    clearContentKeepingProfilesAndMap(sectionElement);



    // Add container for Joshua Project data
    sectionElement.innerHTML += `
        <div class="external-resources-container">
            <h2 class="section-title">Joshua Project Data</h2>
            <div id="jp-data-container">
                <p>Loading data from Joshua Project...</p>
            </div>
        </div>
    `;

    // Fetch and display Joshua Project data
    fetchJoshuaProjectData(groupName)
        .then(result => {
            const dataContainer = document.getElementById('jp-data-container');
            if (!dataContainer) return;

            if (!result.success) {
                // Display error message
                dataContainer.innerHTML = `
                    <div class="jp-error">
                        <span class="material-symbols-outlined">error</span>
                        <p>${result.message}</p>
                    </div>
                `;
                return;
            }

            // Get the data
            const jpData = result.data;

            // Format and display data
            dataContainer.innerHTML = generateJoshuaProjectHTML(jpData);

            // Initialize any charts or interactive elements
            if (typeof initializeJoshuaProjectCharts === 'function') {
                initializeJoshuaProjectCharts(jpData);
            }
        });
}

// Function to generate HTML for Joshua Project data
function generateJoshuaProjectHTML(data) {
    // Create photo URL with fallback
    const photoUrl = data.PhotoAddress || 'placeholder.jpg';

    // Format population with commas
    const formattedPopulation = data.Population ? data.Population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 'Unknown';

    // Calculate progress for progress bars
    const evangelicalPercentage = data.PercentEvangelical * 100;
    const adherentsPercentage = data.PercentAdherents * 100;

    // Create HTML for religion distribution
    let religionHTML = '';
    const religionData = [
        { name: 'Buddhism', value: data.PCBuddhism },
        { name: 'Hinduism', value: data.PCHinduism },
        { name: 'Islam', value: data.PCIslam },
        { name: 'Ethnic Religions', value: data.PCEthnicReligions },
        { name: 'Non-Religious', value: data.PCNonReligious },
        { name: 'Christianity', value: (data.PCDblyProfessing || 0) },
        { name: 'Other', value: data.PCOtherSmall }
    ].filter(item => item.value > 0);

    religionHTML = religionData.map(item => `
        <div class="religion-item">
            <div class="religion-label">${item.name}</div>
            <div class="religion-bar-container">
                <div class="religion-bar" style="width: ${item.value}%"></div>
                <div class="religion-percentage">${item.value.toFixed(1)}%</div>
            </div>
        </div>
    `).join('');

    // Generate the main HTML content
    return `
        <div class="jp-content-grid">
            <div class="jp-profile-section">
                <div class="jp-photo">
                    <img src="${photoUrl}" alt="${data.PeopNameInCountry} people" onerror="this.src='placeholder.jpg';">
                    <div class="jp-photo-credit">Photo: ${data.PhotoCredits || 'Joshua Project'}</div>
                </div>
                
                <div class="jp-key-info">
                    <h3>${data.PeopNameInCountry}</h3>
                    <div class="jp-info-item">
                        <span class="jp-info-label">Country:</span>
                        <span class="jp-info-value">${data.Ctry}</span>
                    </div>
                    <div class="jp-info-item">
                        <span class="jp-info-label">Population:</span>
                        <span class="jp-info-value">${formattedPopulation}</span>
                    </div>
                    <div class="jp-info-item">
                        <span class="jp-info-label">Primary Language:</span>
                        <span class="jp-info-value">${data.PrimaryLanguageName}</span>
                    </div>
                    <div class="jp-info-item">
                        <span class="jp-info-label">Primary Religion:</span>
                        <span class="jp-info-value">${data.PrimaryReligion}</span>
                    </div>
                    <div class="jp-info-item">
                        <span class="jp-info-label">Joshua Project Scale:</span>
                        <span class="jp-info-value">
                            <div class="jp-scale-value">${data.JPScale}</div>
                            <div class="jp-scale-description">(${data.JPScale === 1 ? 'Least Reached' : data.JPScale === 2 ? 'Minimally Reached' : 'Significantly Reached'})</div>
                        </span>
                    </div>
                    <div class="jp-source-link">
                        <a href="https://joshuaproject.net/people_groups/${data.PeopleID3}/${data.ROG3}" target="_blank">
                            View on Joshua Project
                            <span class="material-symbols-outlined" style="font-size: 16px; vertical-align: middle;">open_in_new</span>
                        </a>
                    </div>
                </div>
            </div>
            
            <div class="jp-religion-section">
                <h3>Religion Composition</h3>
                <div class="jp-religion-distribution">
                    ${religionHTML}
                </div>
                
                <div class="jp-christian-stats">
                    <h4>Christian Presence</h4>
                    <div class="jp-stat-item">
                        <div class="jp-stat-label">Evangelical Christians</div>
                        <div class="jp-progress-container">
                            <div class="jp-progress-bar jp-evangelical-bar" style="width: ${evangelicalPercentage}%"></div>
                            <div class="jp-progress-label">${evangelicalPercentage.toFixed(2)}%</div>
                        </div>
                        <div class="jp-stat-count">(approx. ${data.CountEvangelical} people)</div>
                    </div>
                    <div class="jp-stat-item">
                        <div class="jp-stat-label">Christian Adherents</div>
                        <div class="jp-progress-container">
                            <div class="jp-progress-bar jp-adherent-bar" style="width: ${adherentsPercentage}%"></div>
                            <div class="jp-progress-label">${adherentsPercentage.toFixed(2)}%</div>
                        </div>
                        <div class="jp-stat-count">(approx. ${data.CountAdherents} people)</div>
                    </div>
                </div>
            </div>
            
            <div class="jp-map-section">
                <h3>Geographic Location</h3>
                ${data.MapAddress ?
            `<div class="jp-map-container">
                        <img src="${data.MapAddress}" alt="Map of ${data.PeopNameInCountry} location" onerror="this.src='placeholder-map.jpg';">
                        <div class="jp-map-caption">Map: ${data.MapCredits || 'Joshua Project'}</div>
                    </div>` :
            `<div class="jp-no-map">
                        <span class="material-symbols-outlined">map_off</span>
                        <p>Map not available</p>
                    </div>`
        }
                
                ${(data.Latitude && data.Longitude) ?
            `<div class="jp-coordinates">
                        <div class="jp-coord-item">
                            <span class="jp-coord-label">Latitude:</span>
                            <span class="jp-coord-value">${data.Latitude}</span>
                        </div>
                        <div class="jp-coord-item">
                            <span class="jp-coord-label">Longitude:</span>
                            <span class="jp-coord-value">${data.Longitude}</span>
                        </div>
                    </div>` : ''
        }
            </div>
            
            <div class="jp-resources-section">
                <h3>Ministry Resources</h3>
                <div class="jp-resource-grid">
                    <div class="jp-resource-item ${data.BibleStatus > 0 ? 'jp-resource-available' : 'jp-resource-unavailable'}">
                        <span class="material-symbols-outlined">menu_book</span>
                        <div class="jp-resource-label">Bible Translation</div>
                        <div class="jp-resource-status">${getBibleStatusText(data.BibleStatus)}</div>
                    </div>
                    <div class="jp-resource-item ${data.AudioRecordings === 'Y' ? 'jp-resource-available' : 'jp-resource-unavailable'}">
                        <span class="material-symbols-outlined">hearing</span>
                        <div class="jp-resource-label">Audio Recordings</div>
                        <div class="jp-resource-status">${data.AudioRecordings === 'Y' ? 'Available' : 'Not Available'}</div>
                    </div>
                    <div class="jp-resource-item ${data.GospelRadio === 'Y' ? 'jp-resource-available' : 'jp-resource-unavailable'}">
                        <span class="material-symbols-outlined">radio</span>
                        <div class="jp-resource-label">Gospel Radio</div>
                        <div class="jp-resource-status">${data.GospelRadio === 'Y' ? 'Available' : 'Not Available'}</div>
                    </div>
                    <div class="jp-resource-item ${data.NTOnline === 'Y' ? 'jp-resource-available' : 'jp-resource-unavailable'}">
                        <span class="material-symbols-outlined">public</span>
                        <div class="jp-resource-label">Online Scripture</div>
                        <div class="jp-resource-status">${data.NTOnline === 'Y' ? 'Available' : 'Not Available'}</div>
                    </div>
                </div>
                
                <div class="jp-ministry-notes">
                    <div class="jp-ministry-item">
                        <span class="jp-ministry-label">Workers Needed:</span>
                        <span class="jp-ministry-value">${data.WorkersNeeded || 'Unknown'}</span>
                    </div>
                    <div class="jp-ministry-item">
                        <span class="jp-ministry-label">Frontier Status:</span>
                        <span class="jp-ministry-value">${data.Frontier === 'Y' ? 'Frontier People Group' : 'Not a Frontier People Group'}</span>
                    </div>
                    <div class="jp-ministry-item">
                        <span class="jp-ministry-label">Engagement Status:</span>
                        <span class="jp-ministry-value">${getEngagementStatus(data.GSEC)}</span>
                    </div>
                </div>
            </div>
            
            <div class="jp-attribution">
                <div class="jp-jp-logo">
                    <span class="material-symbols-outlined">public</span>
                    Joshua Project
                </div>
                <div class="jp-jp-disclaimer">
                    Data sourced from <a href="https://joshuaproject.net" target="_blank">Joshua Project</a>, 
                    a research initiative seeking to highlight the ethnic people groups with the fewest followers of Christ.
                </div>
            </div>
        </div>
    `;
}

// Helper function to get Bible translation status text
function getBibleStatusText(bibleStatus) {
    switch (bibleStatus) {
        case 0: return 'None Available';
        case 1: return 'Portions Available';
        case 2: return 'New Testament Available';
        case 3: return 'Complete Bible Available';
        default: return 'Unknown Status';
    }
}

// Helper function to get engagement status description
function getEngagementStatus(gsecCode) {
    switch (gsecCode) {
        case 0: return 'Unknown Status';
        case 1: return 'No Engagement';
        case 2: return 'Minimal Engagement';
        case 3: return 'Limited Engagement';
        case 4: return 'Established Engagement';
        case 5: return 'Widespread Engagement';
        default: return 'Unknown Status';
    }
}

// Populate Testimonies Section
async function populateTestimoniesSection(sectionElement, content) {
    // Clear existing content while keeping profiles and map
    clearContentKeepingProfilesAndMap(sectionElement);

    // Add loading skeletons for testimonies
    sectionElement.innerHTML += `
        <div class="loading-skeletons">
            <div class="loading-skeleton">
                <div class="skeleton-title"></div>
                <div class="skeleton-paragraph"></div>
                <div class="skeleton-paragraph"></div>
            </div>
            <div class="skeleton-flex">
                <div class="skeleton-testimony-card">
                    <div class="skeleton-testimony-header">
                        <div class="skeleton-title-small"></div>
                        <div class="skeleton-date"></div>
                    </div>
                    <div class="skeleton-testimony-content">
                        <div class="skeleton-paragraph"></div>
                        <div class="skeleton-paragraph"></div>
                    </div>
                    <div class="skeleton-button"></div>
                </div>
                <div class="skeleton-testimony-card">
                    <div class="skeleton-testimony-header">
                        <div class="skeleton-title-small"></div>
                        <div class="skeleton-date"></div>
                    </div>
                    <div class="skeleton-testimony-content">
                        <div class="skeleton-paragraph"></div>
                        <div class="skeleton-paragraph"></div>
                    </div>
                    <div class="skeleton-button"></div>
                </div>
                <div class="skeleton-testimony-card">
                    <div class="skeleton-testimony-header">
                        <div class="skeleton-title-small"></div>
                        <div class="skeleton-date"></div>
                    </div>
                    <div class="skeleton-testimony-content">
                        <div class="skeleton-paragraph"></div>
                        <div class="skeleton-paragraph"></div>
                    </div>
                    <div class="skeleton-button"></div>
                </div>
            </div>
        </div>
    `;

    try {
        // Fetch testimonies from the story_collection table
        // For now, fetching all testimonies but with a limit
        const sql = "SELECT created_at, generated_story FROM story_collection ORDER BY created_at DESC LIMIT 20";
        const data = await getData(sql);

        // Remove loading skeletons
        const loadingSkeletons = sectionElement.querySelector('.loading-skeletons');
        if (loadingSkeletons) {
            loadingSkeletons.remove();
        }

        // Create the testimonies container
        let testimoniesHTML = `
            <div class="testimonies-container">
                <h2 class="section-title">Personal Testimonies</h2>
                <div class="testimonies-grid">
        `;

        // Check if we have testimonies
        if (data.rows && data.rows.length > 0) {
            // Add each testimony as a card
            data.rows.forEach((testimony, index) => {
                const date = new Date(testimony.created_at);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                testimoniesHTML += `
                    <div class="testimony-card">
                        <div class="testimony-header">
                            <div class="testimony-number">Testimony #${index + 1}</div>
                            <div class="testimony-date">
                                <span class="material-symbols-outlined">calendar_today</span>
                                ${formattedDate}
                            </div>
                        </div>
                        <div class="testimony-content">
                            <p>${testimony.generated_story}</p>
                        </div>
                        <div class="testimony-footer">
                            <button class="read-more-btn" onclick="expandTestimony(this)">
                                <span class="material-symbols-outlined">expand_more</span>
                                Read More
                            </button>
                        </div>
                    </div>
                `;
            });
        } else {
            // No testimonies found
            testimoniesHTML += `
                <div class="no-testimonies">
                    <span class="material-symbols-outlined">report</span>
                    <p>No testimonies available at this time.</p>
                </div>
            `;
        }

        testimoniesHTML += `
                </div>
            </div>
        `;

        // Add the HTML to the section
        sectionElement.innerHTML += testimoniesHTML;

        // Re-initialize clickable media and info strip
        const groupName = document.getElementById('group-name').textContent;
        const group = loadedUPGs.find(g => g.name === groupName);
        if (group) {
            initializeClickableMedia(group);
            initializeInfoStripCards();
        }

    } catch (error) {
        console.error('Error loading testimonies:', error);

        // Remove loading skeletons
        const loadingSkeletons = sectionElement.querySelector('.loading-skeletons');
        if (loadingSkeletons) {
            loadingSkeletons.remove();
        }

        // Show error message
        sectionElement.innerHTML += `
            <div class="testimonies-error">
                <span class="material-symbols-outlined">error</span>
                <p>Failed to load testimonies. Please try again later.</p>
            </div>
        `;
    }
}

// Function to expand/collapse testimony content
function expandTestimony(button) {
    const testimonyCard = button.closest('.testimony-card');
    const testimonyContent = testimonyCard.querySelector('.testimony-content');
    const icon = button.querySelector('.material-symbols-outlined');

    if (testimonyCard.classList.contains('expanded')) {
        // Collapse
        testimonyCard.classList.remove('expanded');
        icon.textContent = 'expand_more';
        button.innerHTML = '<span class="material-symbols-outlined">expand_more</span> Read More';
    } else {
        // Expand
        testimonyCard.classList.add('expanded');
        icon.textContent = 'expand_less';
        button.innerHTML = '<span class="material-symbols-outlined">expand_less</span> Read Less';
    }
}

// Optional: Function to create a modal for full testimony view
function viewFullTestimony(index) {
    const testimony = document.querySelectorAll('.testimony-card')[index];
    const content = testimony.querySelector('.testimony-content p').textContent;
    const date = testimony.querySelector('.testimony-date').textContent.trim();

    // Create modal if it doesn't exist
    let modal = document.getElementById('testimony-modal');
    if (!modal) {
        modal = document.createElement('dialog');
        modal.id = 'testimony-modal';
        modal.className = 'testimony-modal';
        document.body.appendChild(modal);
    }

    // Build modal HTML
    modal.innerHTML = `
        <div class="modal-close">
            <span class="material-symbols-outlined">close</span>
        </div>
        <div class="modal-content">
            <div class="modal-header">
                <h2>Testimony #${index + 1}</h2>
                <div class="modal-date">
                    <span class="material-symbols-outlined">calendar_today</span>
                    ${date}
                </div>
            </div>
            <div class="modal-body">
                <p>${content}</p>
            </div>
        </div>
    `;

    // Show the modal
    modal.showModal();

    // Add close event listener
    const closeButton = modal.querySelector('.modal-close');
    closeButton.addEventListener('click', function () {
        modal.close();
    });

    // Close on Escape key
    modal.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            modal.close();
        }
    });
}