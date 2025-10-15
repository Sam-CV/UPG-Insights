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

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(`${targetTab}-content`).classList.add('active');

            // Update section title
            const tabName = button.textContent;
            const sectionTitle = document.getElementById('section-title');
            if (sectionTitle) {
                sectionTitle.textContent = tabName;
            }
        });
    });

    // Load UPG details from sessionStorage
    const selectedUpgJson = sessionStorage.getItem('selectedUpg');

    if (selectedUpgJson) {
        const upgData = JSON.parse(selectedUpgJson);

        // Update header title and tag
        const mainTitle = document.getElementById('upg-main-title');
        const typeTag = document.getElementById('upg-type-tag');
        if (mainTitle) {
            mainTitle.textContent = upgData.name || 'Tharu';
        }
        if (typeTag) {
            typeTag.textContent = upgData.language ? 'Language' : 'Country';
        }

        document.getElementById('population').textContent = upgData.population || '1.96 M';
        document.getElementById('language').textContent = upgData.name || 'Dangaura';
        document.getElementById('religion').textContent = upgData.religion || 'Hindu';
        document.getElementById('country').textContent = upgData.country || 'Nepal';

        loadUpgImages(upgData.name, upgData.country);

        initializeMap(upgData.lat, upgData.lon);

        // Initialize header map
        initializeHeaderMap(upgData.lat, upgData.lon);
    }
});

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
        femaleImg.onerror = function() {
            console.log('Female image not found:', femaleImageUrl);
            this.src = placeholderImage;
        };
        femaleImg.style.display = 'block';
    }

    if (maleImg) {
        maleImg.src = maleImageUrl;
        maleImg.onerror = function() {
            console.log('Male image not found:', maleImageUrl);
            this.src = placeholderImage;
        };
        maleImg.style.display = 'block';
    }

    // Update header images
    const headerFemaleImg = document.getElementById('header-image-female');
    const headerMaleImg = document.getElementById('header-image-male');

    if (headerFemaleImg) {
        headerFemaleImg.src = femaleImageUrl;
        headerFemaleImg.onerror = function() {
            this.src = placeholderImage;
        };
    }

    if (headerMaleImg) {
        headerMaleImg.src = maleImageUrl;
        headerMaleImg.onerror = function() {
            this.src = placeholderImage;
        };
    }

    // Update Digital Learning tab images
    const digitalFemaleImg = document.getElementById('digital-image-female');
    const digitalMaleImg = document.getElementById('digital-image-male');

    if (digitalFemaleImg) {
        digitalFemaleImg.src = femaleImageUrl;
        digitalFemaleImg.onerror = function() {
            this.src = placeholderImage;
        };
        digitalFemaleImg.style.display = 'block';
    }

    if (digitalMaleImg) {
        digitalMaleImg.src = maleImageUrl;
        digitalMaleImg.onerror = function() {
            this.src = placeholderImage;
        };
        digitalMaleImg.style.display = 'block';
    }
}

// Header map initialization function
function initializeHeaderMap(lat, lon) {
    const latitude = lat || 27.7172;
    const longitude = lon || 85.3240;

    createGlobeMap('header-map', latitude, longitude);
}

// Map initialization function with amCharts 5 globe
function initializeMap(lat, lon) {
    // Use default coordinates if not provided
    const latitude = lat || 27.7172;
    const longitude = lon || 85.3240;

    // Initialize overview map
    createGlobeMap('map', latitude, longitude);

    // Initialize digital map
    createGlobeMap('digital-map', latitude, longitude);
}

function createGlobeMap(containerId, lat, lon) {
    const mapContainer = document.getElementById(containerId);
    if (!mapContainer) return;

    // Clear any existing content
    mapContainer.innerHTML = '';

    // Detect screen size - use globe for screens wider than 1024px
    const isLargeScreen = window.innerWidth > 1024;
    const useGlobe = isLargeScreen;

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

    // Create root element
    const root = am5.Root.new(containerId);

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the map chart with appropriate projection
    const chart = root.container.children.push(
        am5map.MapChart.new(root, {
            projection: useGlobe ? am5map.geoOrthographic() : am5map.geoMercator(),
            panX: useGlobe ? "rotateX" : "none",
            panY: useGlobe ? "rotateY" : "none",
            wheelY: useGlobe ? "zoom" : "none",
            maxPanOut: 0
        })
    );

    // Disable interaction for flat map
    if (!useGlobe) {
        chart.set("zoomControl", null);
        chart.chartContainer.set("interactive", false);
    }

    // Create background series (ocean)
    const backgroundSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {})
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
        am5map.MapPolygonSeries.new(root, {
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
        am5map.MapPointSeries.new(root, {})
    );

    pointSeries.bullets.push(function() {
        const circle = am5.Circle.new(root, {
            radius: 8,
            fill: am5.color("#2196f3"),
            stroke: am5.color("#ffffff"),
            strokeWidth: 2,
            tooltipText: "Location: {title}"
        });

        return am5.Bullet.new(root, {
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
                root.dispose();
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
            }
        });
    });

    // Load sample metrics data for Digital Learning
    loadDigitalMetrics();

    // Load hypothesis data
    loadHypothesisData();

    // Add event listener to filter button to reload hypothesis data when country changes
    const filterButton = document.querySelector('.filter-button');
    if (filterButton) {
        filterButton.addEventListener('click', () => {
            // Reload hypothesis data when filter is applied
            loadHypothesisData();
        });
    }

    // Also reload when dropdown selection changes
    const countriesMenu = document.getElementById('countries-menu');
    if (countriesMenu) {
        countriesMenu.addEventListener('click', (e) => {
            const option = e.target.closest('.dropdown-option');
            if (option) {
                // Give the dropdown time to update the input value
                setTimeout(() => {
                    loadHypothesisData();
                }, 100);
            }
        });
    }
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
async function loadHypothesisData() {
    const container = document.getElementById('hypothesis-cards-container');
    container.innerHTML = '<div class="loading-message">Loading hypothesis data...</div>';

    try {
        // Get the selected country from the filter dropdown
        const countriesInput = document.getElementById('countries-input');
        const selectedCountry = countriesInput ? countriesInput.value : null;

        console.log('Selected country from filter:', selectedCountry);

        // Fetch hypothesis data based on selected country
        let hypotheses;
        if (!selectedCountry || selectedCountry === 'All Countries') {
            // If no country selected or "All Countries" selected, get all data
            hypotheses = await getAllHypothesisData();
        } else {
            // Fetch data for specific country
            hypotheses = await getHypothesisData(selectedCountry);
        }

        console.log('Loaded hypotheses:', hypotheses);

        if (!hypotheses || hypotheses.length === 0) {
            const message = selectedCountry && selectedCountry !== 'All Countries'
                ? `No hypothesis data found for ${selectedCountry}.`
                : 'No hypothesis data found.';
            container.innerHTML = `<div class="loading-message">${message}</div>`;
            return;
        }

        // Clear container and render cards
        container.innerHTML = '';
        hypotheses.forEach(hypothesis => {
            const card = createHypothesisCard(hypothesis);
            container.appendChild(card);
        });

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
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeImageModal();
        }
    };
}

function closeImageModal() {
    const modal = document.getElementById('image-modal');
    modal.style.display = 'none';
}
