// Load navbar using shared utility
loadNavbar();

// Data from the provided tables
const upgData = [
    { name: "Japanese", religion: "Buddhist", type: "language", country: "Japan", lat: 36.2048, lon: 138.2529 },
    { name: "Burmese", religion: "Buddhist", type: "language", country: "Myanmar", lat: 21.9140, lon: 95.9562 },
    { name: "Thai", religion: "Buddhist", type: "language", country: "Thailand", lat: 13.7563, lon: 100.5018 },
    { name: "Khmer", religion: "Buddhist", type: "language", country: "Cambodia", lat: 11.5564, lon: 104.9282 },
    { name: "Shan", religion: "Buddhist", type: "language", country: "Myanmar", lat: 22.0951, lon: 97.7453 },
    { name: "Lao", religion: "Buddhist", type: "language", country: "Laos", lat: 17.9757, lon: 102.6331 },
    { name: "Vietnamese", religion: "Buddhist", type: "language", country: "Vietnam", lat: 14.0583, lon: 108.2772 },
    { name: "Rakhine", religion: "Buddhist", type: "language", country: "Myanmar", lat: 20.1374, lon: 92.8732 },
    { name: "Sinhalese", religion: "Buddhist", type: "language", country: "Sri Lanka", lat: 7.2906, lon: 80.6337 },
    { name: "Bengali", religion: "Hinduism", type: "language", country: "Bangladesh", lat: 23.6850, lon: 90.3563 },
    { name: "Bangla", religion: "Hinduism", type: "language", country: "Bangladesh", lat: 23.6850, lon: 90.3563 },
    { name: "Gujarati", religion: "Hinduism", type: "language", country: "India", lat: 22.2587, lon: 71.1924 },
    { name: "Hindi", religion: "Hinduism", type: "language", country: "India", lat: 28.7041, lon: 77.1025 },
    { name: "Marathi", religion: "Hinduism", type: "language", country: "India", lat: 19.7515, lon: 75.7139 },
    { name: "Nepali", religion: "Hinduism", type: "UPG", country: "Nepal", lat: 27.7172, lon: 85.3240 },
    { name: "Oriya (Macrolanguage)", religion: "Hinduism", type: "language", country: "India", lat: 20.9517, lon: 85.0985 },
    { name: "Khaliji (Gulf) Arabic", religion: "Islam", type: "language", country: "Saudi Arabia", lat: 26.0667, lon: 50.5577 },
    { name: "Bambara", religion: "Islam", type: "UPG", country: "Mali", lat: 17.5707, lon: -3.9962 },
    { name: "Banjar", religion: "Islam", type: "UPG", country: "Indonesia", lat: -3.3194, lon: 114.5906 },
    { name: "Dari", religion: "Islam", type: "UPG", country: "Afghanistan", lat: 34.5553, lon: 69.2075 },
    { name: "Algerian Darija/Amazigh", religion: "Islam", type: "language", country: "Morocco", lat: 31.7917, lon: -7.0926 },
    { name: "Hausa", religion: "Islam", type: "UPG", country: "Nigeria", lat: 11.8461, lon: 8.8933 },
    { name: "Indonesian", religion: "Islam", type: "UPG", country: "Indonesia", lat: -6.2088, lon: 106.8456 },
    { name: "Musi", religion: "Islam", type: "UPG", country: "Indonesia", lat: -2.9911, lon: 104.7565 },
    { name: "Pashto AF", religion: "Islam", type: "UPG", country: "Afghanistan", lat: 31.5204, lon: 65.1736 },
    { name: "Pashto Pak", religion: null, type: "language", country: "Pakistan", lat: 32.5430, lon: 70.5765 },
    { name: "Saraiki", religion: "Islam", type: "UPG", country: "Pakistan", lat: 29.6857, lon: 71.1924 },
    { name: "Sindhi", religion: "Islam", type: "UPG", country: "Pakistan", lat: 26.8467, lon: 68.2975 },
    { name: "Somali", religion: "Islam", type: "UPG", country: "Somalia", lat: 5.1521, lon: 46.1996 },
    { name: "Sundanese", religion: "Islam", type: "UPG", country: "Indonesia", lat: -6.9175, lon: 107.6191 },
    { name: "Turkish", religion: "Islam", type: "UPG", country: "Turkey", lat: 39.9334, lon: 32.8597 },
    { name: "Urdu", religion: "Islam", type: "UPG", country: "Pakistan", lat: 33.7294, lon: 73.0931 },
    { name: "Uzbek", religion: "Islam", type: "UPG", country: "Uzbekistan", lat: 41.2995, lon: 69.2401 },
    { name: "Kazakh", religion: null, type: "UPG", country: null, lat: 48.0196, lon: 66.9237 },
    { name: "Wolof", religion: "Islam", type: "UPG", country: "Senegal", lat: 14.4974, lon: -14.4524 },
    { name: "French", religion: null, type: "language", country: "West Africa", lat: 7.9465, lon: -1.0232 },
    { name: "Russian", religion: null, type: "language", country: "Central Asia", lat: 41.3775, lon: 64.5853 }
];

// Remove duplicates and sort
const uniqueUpgData = upgData.filter((item, index, self) =>
    index === self.findIndex(t => t.name === item.name && t.religion === item.religion && t.type === item.type)
).sort((a, b) => a.name.localeCompare(b.name));

// Tooltip functionality
function showTooltip(element, text) {
    const tooltip = document.getElementById('tooltip');
    const rect = element.getBoundingClientRect();

    tooltip.textContent = text;
    tooltip.style.left = rect.left + rect.width / 2 + 'px';
    tooltip.style.top = rect.top + 'px';
    tooltip.style.transform = 'translateX(-50%) translateY(-120%)';
    tooltip.classList.add('visible');
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    tooltip.classList.remove('visible');
}

// Custom dropdown functionality
function initializeDropdown() {
    const dropdownInput = document.getElementById('dropdown-input');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownArrow = document.querySelector('.custom-dropdown:not(.filter-dropdown) .dropdown-arrow');
    const filterInput = document.getElementById('filter-input');
    const filterMenu = document.getElementById('filter-menu');
    const filterArrow = document.querySelector('.filter-dropdown .dropdown-arrow');

    let selectedValue = 'world';
    let selectedUpgData = null;
    let selectedFilter = 'all';
    let isOpen = false;
    let isFilterOpen = false;

    // Populate dropdown with data
    function populateDropdown() {
        const filteredData = selectedFilter === 'all'
            ? uniqueUpgData
            : uniqueUpgData.filter(item => item.religion && item.religion.toLowerCase() === selectedFilter);

        // Group by religion
        const groupedData = filteredData.reduce((acc, item) => {
            const religionKey = item.religion || 'Other';
            if (!acc[religionKey]) acc[religionKey] = [];
            acc[religionKey].push(item);
            return acc;
        }, {});

        dropdownMenu.innerHTML = '';

        Object.keys(groupedData).sort().forEach(religion => {
            // Add group header
            const header = document.createElement('div');
            header.className = 'dropdown-group-header';
            header.textContent = religion;
            dropdownMenu.appendChild(header);

            // Add options
            groupedData[religion].forEach(item => {
                const option = document.createElement('div');
                option.className = 'dropdown-option';
                option.setAttribute('data-value', item.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                option.setAttribute('data-upg', JSON.stringify(item));

                const optionText = document.createElement('span');
                optionText.className = 'option-text';
                optionText.textContent = item.name;

                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'option-tags';

                // Language tag
                const typeTag = document.createElement('div');
                typeTag.className = `option-tag tag-${item.type} material-symbols-outlined`;
                typeTag.textContent = item.type === 'language' ? 'language' : 'group';
                typeTag.addEventListener('mouseenter', (e) => {
                    showTooltip(e.target, item.type === 'language' ? 'Language' : 'UPG');
                });
                typeTag.addEventListener('mouseleave', hideTooltip);

                // Religion tag
                const religionTag = document.createElement('div');
                religionTag.className = `option-tag tag-${religion.toLowerCase()} material-symbols-outlined`;
                religionTag.textContent = religion === 'Buddhist' ? 'self_improvement' :
                    religion === 'Hinduism' ? 'temple_hindu' : 'mosque';
                religionTag.addEventListener('mouseenter', (e) => {
                    showTooltip(e.target, religion);
                });
                religionTag.addEventListener('mouseleave', hideTooltip);

                tagsContainer.appendChild(typeTag);
                tagsContainer.appendChild(religionTag);

                option.appendChild(optionText);
                option.appendChild(tagsContainer);

                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectOption(option, item.name, item);
                });

                dropdownMenu.appendChild(option);
            });
        });
    }

    // Filter options based on input
    function filterOptions(searchTerm) {
        const term = searchTerm.toLowerCase();
        const options = dropdownMenu.querySelectorAll('.dropdown-option');
        const headers = dropdownMenu.querySelectorAll('.dropdown-group-header');

        options.forEach(option => {
            const text = option.querySelector('.option-text')?.textContent.toLowerCase() || '';
            if (text.includes(term)) {
                option.style.display = 'flex';
            } else {
                option.style.display = 'none';
            }
        });

        // Show/hide headers based on visible options
        headers.forEach(header => {
            const nextSibling = header.nextElementSibling;
            let hasVisibleOptions = false;
            let current = nextSibling;

            while (current && !current.classList.contains('dropdown-group-header')) {
                if (current.style.display !== 'none') {
                    hasVisibleOptions = true;
                    break;
                }
                current = current.nextElementSibling;
            }

            header.style.display = hasVisibleOptions ? 'block' : 'none';
        });
    }

    // Handle option selection
    function selectOption(option, text, upgItem = null) {
        dropdownInput.value = text;
        selectedValue = option.dataset.value;
        selectedUpgData = upgItem;

        // Update selected state
        dropdownMenu.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        isOpen = false;
        dropdownMenu.classList.remove('open');
        dropdownArrow.classList.remove('open');
        dropdownInput.setAttribute('readonly', true);
    }

    
    // Handle filter selection
    function selectFilter(option, value, text) {
        filterInput.value = text;
        selectedFilter = value;

        // Update selected state
        filterMenu.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        isFilterOpen = false;
        filterMenu.classList.remove('open');
        filterArrow.classList.remove('open');

        // Repopulate main dropdown
        populateDropdown();

        // Reset search
        dropdownInput.value = '';
        dropdownInput.placeholder = 'Type to get started';
        selectedUpgData = null;
    }

    // Toggle main dropdown
    function toggleDropdown(e) {
        e.stopPropagation();
        isOpen = !isOpen;
        dropdownMenu.classList.toggle('open', isOpen);
        dropdownArrow.classList.toggle('open', isOpen);

        if (isOpen) {
            dropdownInput.removeAttribute('readonly');
            dropdownInput.focus();
            filterOptions('');
        } else {
            dropdownInput.setAttribute('readonly', true);
            const selectedOption = document.querySelector('.dropdown-option.selected');
            if (selectedOption) {
                dropdownInput.value = selectedOption.querySelector('.option-text').textContent;
            }
        }
    }

    // Toggle filter dropdown
    function toggleFilterDropdown(e) {
        e.stopPropagation();
        isFilterOpen = !isFilterOpen;
        filterMenu.classList.toggle('open', isFilterOpen);
        filterArrow.classList.toggle('open', isFilterOpen);
    }

    // Event listeners
    dropdownInput.addEventListener('click', toggleDropdown);
    dropdownArrow.addEventListener('click', toggleDropdown);
    filterInput.addEventListener('click', toggleFilterDropdown);
    filterArrow.addEventListener('click', toggleFilterDropdown);

    dropdownInput.addEventListener('input', (e) => {
        if (isOpen) {
            filterOptions(e.target.value);
        }
    });

    dropdownInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            isOpen = false;
            dropdownMenu.classList.remove('open');
            dropdownArrow.classList.remove('open');
            dropdownInput.setAttribute('readonly', true);
        }
    });

    // Filter dropdown options
    filterMenu.querySelectorAll('.dropdown-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = option.dataset.value;
            const text = option.querySelector('.option-text').textContent;
            selectFilter(option, value, text);
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown') && (isOpen || isFilterOpen)) {
            if (isOpen) {
                isOpen = false;
                dropdownMenu.classList.remove('open');
                dropdownArrow.classList.remove('open');
                dropdownInput.setAttribute('readonly', true);
                const selectedOption = document.querySelector('.dropdown-option.selected');
                if (selectedOption) {
                    dropdownInput.value = selectedOption.querySelector('.option-text').textContent;
                }
            }
            if (isFilterOpen) {
                isFilterOpen = false;
                filterMenu.classList.remove('open');
                filterArrow.classList.remove('open');
            }
        }
    });

    // Initialize dropdown
    populateDropdown();
    selectFilter(filterMenu.querySelector('.dropdown-option[data-value="all"]'), 'all', 'All');

    return {
        getSelectedValue: () => selectedValue,
        getSelectedUpgData: () => selectedUpgData
    };
}

// Initialize dropdown and get selection getters
const dropdownControls = initializeDropdown();

// Go button functionality - redirect to details page
const goButton = document.getElementById('go-button');
goButton.addEventListener('click', function () {
    const selectedUpgData = dropdownControls.getSelectedUpgData();

    if (selectedUpgData) {
        // Store the selected UPG data in sessionStorage for details page to use
        sessionStorage.setItem('selectedUpg', JSON.stringify(selectedUpgData));
        // Redirect to details page
        window.location.href = 'details.html';
    } else {
        alert('Please select a UPG or language to explore');
    }
});
