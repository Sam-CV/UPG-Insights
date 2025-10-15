let am5Root; // store globally so we can dispose it

// Load navbar
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
    });

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
                        loadUpgImages(selectedUpg.name, selectedUpg.country);
                        initializeCountryOutline(selectedUpg.country);
                        initializeMap(selectedUpg.lat, selectedUpg.lon);
                        focusMapOnLocation(true);
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

        document.getElementById('population').textContent = upgData.population || '1.96 M';
        document.getElementById('language').textContent = upgData.name || 'Dangaura';
        document.getElementById('religion').textContent = upgData.religion || 'Hindu';
        document.getElementById('country').textContent = upgData.country || 'Nepal';

        loadUpgImages(upgData.name, upgData.country);
        initializeMap(upgData.lat, upgData.lon);
        initializeCountryOutline(upgData.country);

        loadSectionImages('demographic', upgData.name, upgData.country);
        loadSectionImages('testimonies', upgData.name, upgData.country);

        renderDemographicSampleData();
    }
});

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

// Render demographic sample data into #demographic-sections using LANGUAGE_GROUP_SAMPLE_DATA
function renderDemographicSampleData() {
    const container = document.getElementById('demographic-sections');
    if (!container || typeof getSampleDemographicData !== 'function') return;

    // Derive the language group name from selectedUpg (prefer name field)
    const selectedUpgJson = sessionStorage.getItem('selectedUpg');
    let languageGroupName = 'Example Group';
    if (selectedUpgJson) {
        try {
            const data = JSON.parse(selectedUpgJson);
            languageGroupName = data.name || languageGroupName;
        } catch { }
    }

    const sample = getSampleDemographicData(languageGroupName);

    // Helper to create a section block
    const createSection = (title, content) => {
        const block = document.createElement('div');
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

    container.innerHTML = '';
    container.appendChild(createSection('Introduction/History', sample.introduction_history));
    container.appendChild(createSection('Everyday Lives', sample.everyday_lives));
    container.appendChild(createSection('Demographics', sample.demographics));
    container.appendChild(createSection('Enviroment', sample.environment));
    container.appendChild(createSection('Stories and Music', sample.stories_music));
    container.appendChild(createSection('Linguistics', sample.linguistics));
}

// Expand/collapse long testimonies on click
document.addEventListener('click', (e) => {
    const textEl = e.target.closest('.testimony-text');
    if (!textEl) return;
    const id = textEl.id || '';
    if (!id.startsWith('details-testimony-text-')) return;

    const isExpanded = textEl.getAttribute('data-expanded') === 'true';
    const indexStr = id.replace('details-testimony-text-', '');
    const index = parseInt(indexStr, 10);
    if (Number.isNaN(index)) return;

    // Retrieve selected country context
    const countriesInput = document.getElementById('countries-input');
    const selectedCountry = countriesInput && countriesInput.value && countriesInput.value !== 'All Countries' ? countriesInput.value : null;
    const selectedUpgJson = sessionStorage.getItem('selectedUpg');
    const fallbackCountry = selectedUpgJson ? (function () { try { return JSON.parse(selectedUpgJson).country || null; } catch { return null; } })() : null;

    getTestimonies({ country: selectedCountry || fallbackCountry || undefined, limit: 30 })
        .then(list => {
            if (!Array.isArray(list) || !list[index]) return;
            const full = String(list[index].testimony || '');
            const longThreshold = 600;
            const collapsed = full.length > longThreshold ? (full.substring(0, longThreshold) + '...') : full;
            if (isExpanded) {
                textEl.innerHTML = collapsed.replace(/</g, '&lt;');
                textEl.setAttribute('data-expanded', 'false');
                textEl.style.cursor = full.length > longThreshold ? 'pointer' : '';
            } else {
                textEl.innerHTML = full.replace(/</g, '&lt;');
                textEl.setAttribute('data-expanded', 'true');
                textEl.style.cursor = 'pointer';
            }
        })
        .catch(() => { });
});

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
        // Determine selected country; prefer filter input, fallback to selectedUpg
        const countriesInput = document.getElementById('countries-input');
        const selectedCountry = countriesInput && countriesInput.value && countriesInput.value !== 'All Countries'
            ? countriesInput.value
            : (function () {
                const selectedUpgJson = sessionStorage.getItem('selectedUpg');
                if (!selectedUpgJson) return null;
                try { return JSON.parse(selectedUpgJson).country || null; } catch { return null; }
            })();

        const testimonies = await getTestimonies({ country: selectedCountry || undefined, limit: 30 });

        if (!Array.isArray(testimonies) || testimonies.length === 0) {
            const message = selectedCountry ? `No testimonies found for ${selectedCountry}.` : 'No testimonies found.';
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
        <div class="testimony-content" style="margin-bottom:10px;">
            <div class="testimony-text" id="details-testimony-text-${index}" style="color:#334155;line-height:1.7;${isLong ? 'cursor:pointer;' : ''}">${collapsed.replace(/</g, '&lt;')}</div>
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

    return card;
}



// Load UPG images (male and female)
function loadUpgImages(upgName, country) {
    if (!upgName || !country) {
        console.log('Missing UPG name or country');
        return;
    }

    // Format the image filename: Name_Country.jpg
    // Replace spaces and special characters
    const formattedName = upgName.replace(/\s+/g, '_').replace(/[()]/g, '');
    const imageFilename = `${formattedName}_${country}.jpg`;

    const baseUrl = 'https://upg-resources.s3.ap-southeast-2.amazonaws.com/images/upg-profiles';
    let femaleImageUrl = `${baseUrl}/${country}/female/${imageFilename}`;
    let maleImageUrl = `${baseUrl}/${country}/male/${imageFilename}`;

    // PLACEHOLDERS FOR NOW
    femaleImageUrl = 'https://upg-resources.s3.ap-southeast-2.amazonaws.com/images/upg-profiles/Nepal/female/Bhramins_Nepal.jpg';
    maleImageUrl = 'https://upg-resources.s3.ap-southeast-2.amazonaws.com/images/upg-profiles/Nepal/male/Bantawa_Nepal.jpg';

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
        femaleImg.src = femaleImageUrl;
        femaleImg.onerror = function () {
            console.log('Female image not found:', femaleImageUrl);
            this.src = placeholderImage;
        };
        femaleImg.style.display = 'block';
    }

    if (maleImg) {
        maleImg.src = maleImageUrl;
        maleImg.onerror = function () {
            console.log('Male image not found:', maleImageUrl);
            this.src = placeholderImage;
        };
        maleImg.style.display = 'block';
    }
}

// Load images for a given section prefix ('demographic' or 'testimonies')
function loadSectionImages(sectionPrefix, upgName, country) {
    if (!sectionPrefix || !upgName || !country) return;

    const formattedName = upgName.replace(/\s+/g, '_').replace(/[()]/g, '');
    const imageFilename = `${formattedName}_${country}.jpg`;
    const baseUrl = 'https://upg-resources.s3.ap-southeast-2.amazonaws.com/images/upg-profiles';
    let femaleImageUrl = `${baseUrl}/${country}/female/${imageFilename}`;
    let maleImageUrl = `${baseUrl}/${country}/male/${imageFilename}`;

    // Placeholder fallbacks
    femaleImageUrl = 'https://upg-resources.s3.ap-southeast-2.amazonaws.com/images/upg-profiles/Nepal/female/Bhramins_Nepal.jpg';
    maleImageUrl = 'https://upg-resources.s3.ap-southeast-2.amazonaws.com/images/upg-profiles/Nepal/male/Bantawa_Nepal.jpg';

    const femaleImg = document.getElementById(`${sectionPrefix}-image-female`);
    const maleImg = document.getElementById(`${sectionPrefix}-image-male`);

    const placeholderImage = 'data:image/svg+xml,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
            <rect width="200" height="300" fill="#f0f0f0"/>
            <text x="50%" y="50%" text-anchor="middle" fill="#999" font-family="Arial" font-size="14">No image here yet!</text>
        </svg>
    `);

    if (femaleImg) {
        femaleImg.src = femaleImageUrl;
        femaleImg.onerror = function () { this.src = placeholderImage; };
        femaleImg.style.display = 'block';
    }
    if (maleImg) {
        maleImg.src = maleImageUrl;
        maleImg.onerror = function () { this.src = placeholderImage; };
        maleImg.style.display = 'block';
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

// Load Digital Learning Metrics
function loadDigitalMetrics() {
    const metricsTable = document.getElementById('digital-metrics-table');

    // Sample metrics data (matching upg-details.html style)
    const metricsHTML = `
        <div class="metrics-grid-table">
            <div class="metric-card">
                <div class="metric-card-label">CPA per ITI (USD)</div>
                <div class="metric-card-value">0.002</div>
            </div>
            <div class="metric-card">
                <div class="metric-card-label">Total Reach</div>
                <div class="metric-card-value small">0.05</div>
            </div>
            <div class="metric-card">
                <div class="metric-card-label">Avg CPA</div>
                <div class="metric-card-value">0.002</div>
            </div>
            <div class="metric-card">
                <div class="metric-card-label">Engagement Rate</div>
                <div class="metric-card-value small">0.05</div>
            </div>
            <div class="metric-card">
                <div class="metric-card-label">Impressions</div>
                <div class="metric-card-value small">0.05</div>
            </div>
        </div>
        <div class="metrics-grid-table">
            <div class="metric-card">
                <div class="metric-card-label">Click Rate</div>
                <div class="metric-card-value">0.002</div>
            </div>
            <div class="metric-card">
                <div class="metric-card-label">Conversions</div>
                <div class="metric-card-value small">0.05</div>
            </div>
            <div class="metric-card">
                <div class="metric-card-label">Cost per Click</div>
                <div class="metric-card-value">0.002</div>
            </div>
            <div class="metric-card">
                <div class="metric-card-label">ROI</div>
                <div class="metric-card-value small">0.05</div>
            </div>
            <div class="metric-card">
                <div class="metric-card-label">Budget Spent</div>
                <div class="metric-card-value small">0.05</div>
            </div>
        </div>
    `;

    metricsTable.innerHTML = metricsHTML;
}

// Load Hypothesis Data
async function loadHypothesisData(page = 1) {
    const container = document.getElementById('hypothesis-cards-container');
    container.innerHTML = '<div class="loading-message">Loading hypothesis data...</div>';

    try {
        const countriesInput = document.getElementById('countries-input');
        const selectedCountry = countriesInput ? countriesInput.value : null;

        let hypotheses;
        if (!selectedCountry || selectedCountry === 'All Countries') {
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
