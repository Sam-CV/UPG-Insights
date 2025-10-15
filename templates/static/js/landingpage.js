// Load navbar
fetch('navbar.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navbar-container').innerHTML = data;
    });

// Data from the provided tables
const upgData = [
    { name: "Japanese", religion: "Buddhist", type: "language", country: "Japan", lat: 35.6762, lon: 139.6503 },
    { name: "Japanese", religion: "Buddhist", type: "UPG", country: "Japan", lat: 35.6762, lon: 139.6503 },
    { name: "Burmese", religion: "Buddhist", type: "language", country: "Myanmar", lat: 16.8661, lon: 96.1951 },
    { name: "Burmese", religion: "Buddhist", type: "UPG", country: "Myanmar", lat: 16.8661, lon: 96.1951 },
    { name: "Thai", religion: "Buddhist", type: "language", country: "Thailand", lat: 13.7563, lon: 100.5018 },
    { name: "Thai", religion: "Buddhist", type: "UPG", country: "Thailand", lat: 13.7563, lon: 100.5018 },
    { name: "Khmer", religion: "Buddhist", type: "language", country: "Cambodia", lat: 11.5564, lon: 104.9282 },
    { name: "Khmer", religion: "Buddhist", type: "UPG", country: "Cambodia", lat: 11.5564, lon: 104.9282 },
    { name: "Shan", religion: "Buddhist", type: "language", country: "Myanmar", lat: 21.1699, lon: 95.9777 },
    { name: "Shan", religion: "Buddhist", type: "UPG", country: "Myanmar", lat: 21.1699, lon: 95.9777 },
    { name: "Lao", religion: "Buddhist", type: "language", country: "Laos", lat: 17.9757, lon: 102.6331 },
    { name: "Lao", religion: "Buddhist", type: "UPG", country: "Laos", lat: 17.9757, lon: 102.6331 },
    { name: "Vietnamese", religion: "Buddhist", type: "language", country: "Vietnam", lat: 16.0544, lon: 108.2022 },
    { name: "Vietnamese", religion: "Buddhist", type: "UPG", country: "Vietnam", lat: 16.0544, lon: 108.2022 },
    { name: "Mongolian", religion: "Buddhist", type: "language", country: "Mongolia", lat: 47.8864, lon: 106.9057 },
    { name: "Mongolian", religion: "Buddhist", type: "UPG", country: "Mongolia", lat: 47.8864, lon: 106.9057 },
    { name: "Rakhine", religion: "Buddhist", type: "language", country: "Myanmar", lat: 20.1484, lon: 92.8726 },
    { name: "Rakhine", religion: "Buddhist", type: "UPG", country: "Myanmar", lat: 20.1484, lon: 92.8726 },
    { name: "Sinhalese", religion: "Buddhist", type: "language", country: "Sri Lanka", lat: 6.9271, lon: 79.8612 },
    { name: "Sinhalese", religion: "Buddhist", type: "UPG", country: "Sri Lanka", lat: 6.9271, lon: 79.8612 },
    { name: "Aawadhi", religion: "Hinduism", type: "language", country: "India", lat: 26.8467, lon: 80.9462 },
    { name: "Aawadhi", religion: "Hinduism", type: "UPG", country: "India", lat: 26.8467, lon: 80.9462 },
    { name: "Bengali", religion: "Hinduism", type: "language", country: "India", lat: 22.5726, lon: 88.3639 },
    { name: "Bengali", religion: "Hinduism", type: "UPG", country: "India", lat: 22.5726, lon: 88.3639 },
    { name: "Bhojpuri", religion: "Hinduism", type: "language", country: "India", lat: 25.5941, lon: 85.1376 },
    { name: "Bhojpuri", religion: "Hinduism", type: "UPG", country: "India", lat: 25.5941, lon: 85.1376 },
    { name: "Dhimal", religion: "Hinduism", type: "language", country: "Nepal", lat: 26.6006, lon: 87.2661 },
    { name: "Dhimal", religion: "Hinduism", type: "UPG", country: "Nepal", lat: 26.6006, lon: 87.2661 },
    { name: "Javanese", religion: "Hinduism", type: "language", country: "Indonesia", lat: -7.2575, lon: 112.7521 },
    { name: "Javanese", religion: "Hinduism", type: "UPG", country: "Indonesia", lat: -7.2575, lon: 112.7521 },
    { name: "Gujarati", religion: "Hinduism", type: "language", country: "India", lat: 23.0225, lon: 72.5714 },
    { name: "Gujarati", religion: "Hinduism", type: "UPG", country: "India", lat: 23.0225, lon: 72.5714 },
    { name: "Hindi", religion: "Hinduism", type: "language", country: "India", lat: 28.7041, lon: 77.1025 },
    { name: "Magar", religion: "Hinduism", type: "language", country: "Nepal", lat: 28.3949, lon: 84.1240 },
    { name: "Magar", religion: "Hinduism", type: "UPG", country: "Nepal", lat: 28.3949, lon: 84.1240 },
    { name: "Maithili", religion: "Hinduism", type: "language", country: "Nepal", lat: 26.1197, lon: 85.9073 },
    { name: "Maithili", religion: "Hinduism", type: "UPG", country: "Nepal", lat: 26.1197, lon: 85.9073 },
    { name: "Marathi", religion: "Hinduism", type: "language", country: "India", lat: 19.0760, lon: 72.8777 },
    { name: "Marathi", religion: "Hinduism", type: "UPG", country: "India", lat: 19.0760, lon: 72.8777 },
    { name: "Nepali", religion: "Hinduism", type: "language", country: "Nepal", lat: 27.7172, lon: 85.3240 },
    { name: "Nepali", religion: "Hinduism", type: "UPG", country: "Nepal", lat: 27.7172, lon: 85.3240 },
    { name: "Newar", religion: "Hinduism", type: "language", country: "Nepal", lat: 27.7172, lon: 85.3240 },
    { name: "Newar", religion: "Hinduism", type: "UPG", country: "Nepal", lat: 27.7172, lon: 85.3240 },
    { name: "Oriya (Odia)", religion: "Hinduism", type: "language", country: "India", lat: 20.2961, lon: 85.8245 },
    { name: "Oriya (Odia)", religion: "Hinduism", type: "UPG", country: "India", lat: 20.2961, lon: 85.8245 },
    { name: "Punjabi", religion: "Hinduism", type: "language", country: "India", lat: 30.7333, lon: 76.7794 },
    { name: "Punjabi", religion: "Hinduism", type: "UPG", country: "India", lat: 30.7333, lon: 76.7794 },
    { name: "Santhali", religion: "Hinduism", type: "language", country: "India", lat: 23.6102, lon: 85.2799 },
    { name: "Santhali", religion: "Hinduism", type: "UPG", country: "India", lat: 23.6102, lon: 85.2799 },
    { name: "Tamang E", religion: "Hinduism", type: "language", country: "Nepal", lat: 27.7172, lon: 85.3240 },
    { name: "Tamang E", religion: "Hinduism", type: "UPG", country: "Nepal", lat: 27.7172, lon: 85.3240 },
    { name: "Telugu", religion: "Hinduism", type: "language", country: "India", lat: 17.3850, lon: 78.4867 },
    { name: "Telugu", religion: "Hinduism", type: "UPG", country: "India", lat: 17.3850, lon: 78.4867 },
    { name: "Tharu", religion: "Hinduism", type: "language", country: "Nepal", lat: 27.5069, lon: 83.4194 },
    { name: "Tharu", religion: "Hinduism", type: "UPG", country: "Nepal", lat: 27.5069, lon: 83.4194 },
    { name: "Thulung", religion: "Hinduism", type: "language", country: "Nepal", lat: 27.0238, lon: 86.8209 },
    { name: "Thulung", religion: "Hinduism", type: "UPG", country: "Nepal", lat: 27.0238, lon: 86.8209 },
    { name: "Arabic (Standard)", religion: "Islam", type: "language", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },
    { name: "Arabic (Standard)", religion: "Islam", type: "UPG", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },
    { name: "Arabic, Gulf (Najdi)", religion: "Islam", type: "language", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },
    { name: "Arabic, Gulf (Najdi)", religion: "Islam", type: "UPG", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },
    { name: "Arabic, Moroccan", religion: "Islam", type: "language", country: "Morocco", lat: 33.9716, lon: -6.8498 },
    { name: "Arabic, Moroccan", religion: "Islam", type: "UPG", country: "Morocco", lat: 33.9716, lon: -6.8498 },
    { name: "Arabic, Najdi", religion: "Islam", type: "language", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },
    { name: "Arabic, Najdi", religion: "Islam", type: "UPG", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753 },
    { name: "Azerbaijani", religion: "Islam", type: "language", country: "Azerbaijan", lat: 40.4093, lon: 49.8671 },
    { name: "Azerbaijani", religion: "Islam", type: "UPG", country: "Azerbaijan", lat: 40.4093, lon: 49.8671 },
    { name: "Bambara", religion: "Islam", type: "language", country: "Mali", lat: 12.6392, lon: -8.0029 },
    { name: "Bambara", religion: "Islam", type: "UPG", country: "Mali", lat: 12.6392, lon: -8.0029 },
    { name: "Banjar", religion: "Islam", type: "language", country: "Indonesia", lat: -3.3194, lon: 114.5906 },
    { name: "Banjar", religion: "Islam", type: "UPG", country: "Indonesia", lat: -3.3194, lon: 114.5906 },
    { name: "Bengali/Bangla", religion: "Islam", type: "language", country: "Bangladesh", lat: 23.8103, lon: 90.4125 },
    { name: "Bengali/Bangla", religion: "Islam", type: "UPG", country: "Bangladesh", lat: 23.8103, lon: 90.4125 },
    { name: "Brahui", religion: "Islam", type: "language", country: "Pakistan", lat: 29.0361, lon: 66.9478 },
    { name: "Brahui", religion: "Islam", type: "UPG", country: "Pakistan", lat: 29.0361, lon: 66.9478 },
    { name: "Dari", religion: "Islam", type: "language", country: "Afghanistan", lat: 34.5553, lon: 69.2075 },
    { name: "Dari", religion: "Islam", type: "UPG", country: "Afghanistan", lat: 34.5553, lon: 69.2075 },
    { name: "Fulfulde", religion: "Islam", type: "language", country: "Niger", lat: 13.0827, lon: 2.1111 },
    { name: "Fulfulde", religion: "Islam", type: "UPG", country: "Niger", lat: 13.0827, lon: 2.1111 },
    { name: "Hausa", religion: "Islam", type: "language", country: "Nigeria", lat: 11.9804, lon: 8.5214 },
    { name: "Hausa", religion: "Islam", type: "UPG", country: "Nigeria", lat: 11.9804, lon: 8.5214 },
    { name: "Hindko", religion: "Islam", type: "language", country: "Pakistan", lat: 34.0151, lon: 71.5249 },
    { name: "Hindko", religion: "Islam", type: "UPG", country: "Pakistan", lat: 34.0151, lon: 71.5249 },
    { name: "Indonesian", religion: "Islam", type: "language", country: "Indonesia", lat: -6.2088, lon: 106.8456 },
    { name: "Indonesian", religion: "Islam", type: "UPG", country: "Indonesia", lat: -6.2088, lon: 106.8456 },
    { name: "Kazakh", religion: "Islam", type: "language", country: "Kazakhstan", lat: 51.1694, lon: 71.4491 },
    { name: "Kazakh", religion: "Islam", type: "UPG", country: "Kazakhstan", lat: 51.1694, lon: 71.4491 },
    { name: "Kurdish", religion: "Islam", type: "language", country: "Iraq", lat: 36.1900, lon: 44.0092 },
    { name: "Kurdish", religion: "Islam", type: "UPG", country: "Iraq", lat: 36.1900, lon: 44.0092 },
    { name: "Malayu (Malay)", religion: "Islam", type: "language", country: "Malaysia", lat: 3.1390, lon: 101.6869 },
    { name: "Malayu (Malay)", religion: "Islam", type: "UPG", country: "Malaysia", lat: 3.1390, lon: 101.6869 },
    { name: "Maninkakan", religion: "Islam", type: "language", country: "Guinea", lat: 9.6412, lon: -13.5784 },
    { name: "Maninkakan", religion: "Islam", type: "UPG", country: "Guinea", lat: 9.6412, lon: -13.5784 },
    { name: "Mazandarani", religion: "Islam", type: "language", country: "Iran", lat: 36.5659, lon: 53.0586 },
    { name: "Mazandarani", religion: "Islam", type: "UPG", country: "Iran", lat: 36.5659, lon: 53.0586 },
    { name: "Oromo", religion: "Islam", type: "language", country: "Ethiopia", lat: 9.1450, lon: 40.4897 },
    { name: "Oromo", religion: "Islam", type: "UPG", country: "Ethiopia", lat: 9.1450, lon: 40.4897 },
    { name: "Pashto", religion: "Islam", type: "language", country: "Pakistan", lat: 34.0151, lon: 71.5249 },
    { name: "Pashto", religion: "Islam", type: "UPG", country: "Pakistan", lat: 34.0151, lon: 71.5249 },
    { name: "Persian", religion: "Islam", type: "language", country: "Iran", lat: 35.6892, lon: 51.3890 },
    { name: "Persian", religion: "Islam", type: "UPG", country: "Iran", lat: 35.6892, lon: 51.3890 },
    { name: "Punjabi", religion: "Islam", type: "language", country: "Pakistan", lat: 31.5204, lon: 74.3587 },
    { name: "Punjabi", religion: "Islam", type: "UPG", country: "Pakistan", lat: 31.5204, lon: 74.3587 },
    { name: "Rohingya", religion: "Islam", type: "language", country: "Myanmar", lat: 21.1699, lon: 92.8749 },
    { name: "Rohingya", religion: "Islam", type: "UPG", country: "Myanmar", lat: 21.1699, lon: 92.8749 },
    { name: "Saraiki", religion: "Islam", type: "language", country: "Pakistan", lat: 30.1575, lon: 71.5249 },
    { name: "Saraiki", religion: "Islam", type: "UPG", country: "Pakistan", lat: 30.1575, lon: 71.5249 },
    { name: "Shina", religion: "Islam", type: "language", country: "Pakistan", lat: 35.9216, lon: 74.3080 },
    { name: "Shina", religion: "Islam", type: "UPG", country: "Pakistan", lat: 35.9216, lon: 74.3080 },
    { name: "Sindhi", religion: "Islam", type: "language", country: "Pakistan", lat: 24.8607, lon: 67.0011 },
    { name: "Sindhi", religion: "Islam", type: "UPG", country: "Pakistan", lat: 24.8607, lon: 67.0011 },
    { name: "Somali", religion: "Islam", type: "language", country: "Somalia", lat: 2.0469, lon: 45.3182 },
    { name: "Somali", religion: "Islam", type: "UPG", country: "Somalia", lat: 2.0469, lon: 45.3182 },
    { name: "Sunda", religion: "Islam", type: "language", country: "Indonesia", lat: -6.9175, lon: 107.6191 },
    { name: "Sunda", religion: "Islam", type: "UPG", country: "Indonesia", lat: -6.9175, lon: 107.6191 },
    { name: "Sylheti", religion: "Islam", type: "language", country: "Bangladesh", lat: 24.8949, lon: 91.8687 },
    { name: "Sylheti", religion: "Islam", type: "UPG", country: "Bangladesh", lat: 24.8949, lon: 91.8687 },
    { name: "Tajik", religion: "Islam", type: "language", country: "Tajikistan", lat: 38.5598, lon: 68.7870 },
    { name: "Tajik", religion: "Islam", type: "UPG", country: "Tajikistan", lat: 38.5598, lon: 68.7870 },
    { name: "Tamazight/Amazigh", religion: "Islam", type: "language", country: "Morocco", lat: 31.2001, lon: -7.0920 },
    { name: "Tamazight/Amazigh", religion: "Islam", type: "UPG", country: "Morocco", lat: 31.2001, lon: -7.0920 },
    { name: "Tamil", religion: "Islam", type: "language", country: "India", lat: 13.0827, lon: 80.2707 },
    { name: "Tamil", religion: "Islam", type: "UPG", country: "India", lat: 13.0827, lon: 80.2707 },
    { name: "Turkish", religion: "Islam", type: "language", country: "Turkey", lat: 39.9334, lon: 32.8597 },
    { name: "Turkish", religion: "Islam", type: "UPG", country: "Turkey", lat: 39.9334, lon: 32.8597 },
    { name: "Urdu", religion: "Islam", type: "language", country: "Pakistan", lat: 33.6844, lon: 73.0479 },
    { name: "Urdu", religion: "Islam", type: "UPG", country: "Pakistan", lat: 33.6844, lon: 73.0479 },
    { name: "Uzbek", religion: "Islam", type: "language", country: "Uzbekistan", lat: 41.2995, lon: 69.2401 },
    { name: "Uzbek", religion: "Islam", type: "UPG", country: "Uzbekistan", lat: 41.2995, lon: 69.2401 },
    { name: "Wolof", religion: "Islam", type: "language", country: "Senegal", lat: 14.7167, lon: -17.4677 },
    { name: "Wolof", religion: "Islam", type: "UPG", country: "Senegal", lat: 14.7167, lon: -17.4677 }
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
            : uniqueUpgData.filter(item => item.religion.toLowerCase() === selectedFilter);

        // Group by religion
        const groupedData = filteredData.reduce((acc, item) => {
            if (!acc[item.religion]) acc[item.religion] = [];
            acc[item.religion].push(item);
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
