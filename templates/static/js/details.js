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

            const tabName = button.textContent;
            const upgTitle = document.getElementById('upg-title');
            const baseName = upgTitle.textContent.split(' - ')[0];
            upgTitle.textContent = `${baseName} - ${tabName}`;
        });
    });

    // Load UPG details from sessionStorage
    const selectedUpgJson = sessionStorage.getItem('selectedUpg');

    if (selectedUpgJson) {
        const upgData = JSON.parse(selectedUpgJson);

        document.getElementById('upg-title').textContent = `${upgData.name} - Overview`;

        document.getElementById('population').textContent = upgData.population || '1.96 M';
        document.getElementById('language').textContent = upgData.name || 'Dangaura';
        document.getElementById('religion').textContent = upgData.religion || 'Hindu';
        document.getElementById('country').textContent = upgData.country || 'Nepal';

        const countriesInput = document.getElementById('countries-input');
        if (countriesInput && upgData.country) {
            countriesInput.value = upgData.country;
        }

        loadUpgImages(upgData.name, upgData.country);

        initializeMap(upgData.lat, upgData.lon);
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
    const femaleImageUrl = `${baseUrl}/${country}/female/${imageFilename}`;
    const maleImageUrl = `${baseUrl}/${country}/male/${imageFilename}`;

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

// Map initialization function (placeholder)
function initializeMap(lat, lon) {
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = `
        <img src="static/images/placeholder-map.jpg" alt="Map Location" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
    `;

    // Initialize digital map as well
    const digitalMapContainer = document.getElementById('digital-map');
    if (digitalMapContainer) {
        digitalMapContainer.innerHTML = mapContainer.innerHTML;
    }
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
