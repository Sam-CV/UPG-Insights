/**
 * Shared Utilities for UPG Insights
 * Consolidates common functions used across multiple files
 */

// ==================== LANGUAGE MAPPING ====================
// Language name to ISO 639-3 code mapping
// Used across: details.js (5 locations), api.js
const LANGUAGE_NAME_TO_CODE = {
    // Buddhist languages
    'Japanese': 'jpn', 'Burmese': 'mya', 'Thai': 'tha', 'Khmer': 'khm',
    'Shan': 'shn', 'Lao': 'lao', 'Vietnamese': 'vie', 'Rakhine': 'rki',
    'Sinhalese': 'sin',
    // Hinduism languages
    'Bengali': 'ben', 'Bangla': 'ben', 'Gujarati': 'guj', 'Hindi': 'hin',
    'Marathi': 'mar', 'Nepali': 'nep', 'Oriya (Macrolanguage)': 'ori', 'Oriya': 'ori',
    'Punjabi': 'pan', 'Panjabi': 'pan', 'Maithili': 'mai', 'Bhojpuri': 'bho',
    'Assamese': 'asm', 'Odia (Macrolanguage)': 'ori', 'Kannada': 'kan', 'Malayalam': 'mal',
    'Tamil': 'tam', 'Telugu': 'tel', 'Chhattisgarhi': 'hne', 'Magahi': 'mag',
    'Haryanvi': 'bgc', 'Rajasthani': 'raj', 'Urdu': 'urd',
    // Islam languages
    'Indonesian': 'ind', 'Javanese': 'jav', 'Sundanese': 'sun', 'Madurese': 'mad',
    'Minangkabau': 'min', 'Banjar': 'bjn', 'Buginese': 'bug', 'Acehnese': 'ace',
    'Balinese': 'ban', 'Betawi': 'bew', 'Turkish': 'tur', 'Azerbaijani, North': 'azj',
    'Azerbaijani': 'azj', 'Uzbek, Northern': 'uzn', 'Uzbek': 'uzn', 'Kazakh': 'kaz',
    'Uyghur': 'uig', 'Turkmen': 'tuk', 'Tatar': 'tat', 'Kyrgyz': 'kir',
    'Bashkort': 'bak', 'Bashkir': 'bak', 'Karakalpak': 'kaa', 'Crimean Tatar': 'crh',
    'Kumyk': 'kum', 'Nogai': 'nog', 'Balkar': 'krc', 'Karachay-Balkar': 'krc',
    'Pashto, Northern': 'pbu', 'Pashto': 'pbu', 'Kurdish, Northern': 'kmr',
    'Kurdish': 'kmr', 'Sindhi': 'snd', 'Malay': 'msa', 'Minang': 'min'
};

// ==================== SESSION STORAGE ====================
/**
 * Get selected UPG data from sessionStorage
 * Replaces 8+ duplicate implementations
 * @returns {Object|null} Parsed UPG data or null if not found/invalid
 */
function getSelectedUpgData() {
    try {
        const selectedUpgJson = sessionStorage.getItem('selectedUpg');
        return selectedUpgJson ? JSON.parse(selectedUpgJson) : null;
    } catch (e) {
        console.error('Error parsing selectedUpg:', e);
        return null;
    }
}

// ==================== IMAGE LOADING ====================
/**
 * Load image with fallback to placeholder
 * Replaces 4+ duplicate implementations
 * @param {HTMLImageElement} imgElement - Image element to load
 * @param {string} imageUrl - URL of image to load
 * @param {string} placeholderImage - Fallback placeholder image
 */
function loadImageWithFallback(imgElement, imageUrl, placeholderImage) {
    if (!imgElement) return;

    imgElement.classList.add('loading');
    imgElement.src = '';
    imgElement.style.display = 'block';

    const testImg = new Image();
    testImg.onload = () => {
        imgElement.src = imageUrl;
        imgElement.classList.remove('loading');
    };
    testImg.onerror = () => {
        console.log('Image not found:', imageUrl);
        imgElement.src = placeholderImage;
        imgElement.classList.remove('loading');
    };
    testImg.src = imageUrl;
}

// ==================== NAVBAR LOADING ====================
/**
 * Load and inject navbar HTML
 * Replaces duplicate code in details.js and landingpage.js
 */
function loadNavbar() {
    return fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            const navbarContainer = document.getElementById('navbar-container');
            if (!navbarContainer) {
                console.error('Navbar container not found');
                return;
            }

            navbarContainer.innerHTML = data;

            // Execute scripts inside the loaded navbar
            const scripts = navbarContainer.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                if (script.src) {
                    newScript.src = script.src;
                } else {
                    newScript.textContent = script.textContent;
                }
                document.body.appendChild(newScript);
            });
        })
        .catch(error => {
            console.error('Error loading navbar:', error);
        });
}

// ==================== API RESPONSE HANDLING ====================
/**
 * Extract data array from various API response formats
 * Replaces 10+ duplicate implementations
 * @param {*} result - API response
 * @returns {Array} Extracted data array
 */
function extractDataFromResponse(result) {
    if (Array.isArray(result)) return result;
    if (result?.rows && Array.isArray(result.rows)) return result.rows;
    if (result?.data && Array.isArray(result.data)) return result.data;
    return [];
}

// ==================== NOTIFICATIONS ====================
/**
 * Show notification toast
 * Consolidates showErrorMessage, showSuccessMessage, showNotification
 * @param {string} message - Message to display
 * @param {string} type - Notification type: 'success', 'error', 'info'
 * @param {number} duration - Duration in ms (default: 4000)
 */
function showNotification(message, type = 'success', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        font-family: 'Lexend', sans-serif;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;

    // Type-specific colors
    const colors = {
        success: { bg: '#10b981', color: '#fff' },
        error: { bg: '#ef4444', color: '#fff' },
        info: { bg: '#3b82f6', color: '#fff' },
        warning: { bg: '#f59e0b', color: '#fff' }
    };

    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.color;

    document.body.appendChild(notification);

    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Auto remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ==================== LANGUAGE CODE MAPPING ====================
/**
 * Get language code from language name
 * @param {string} languageName - Full language name
 * @returns {string|null} ISO 639-3 code or null if not found
 */
function getLanguageCode(languageName) {
    return LANGUAGE_NAME_TO_CODE[languageName] || null;
}

/**
 * Map language name to code, with fallback to uppercase 3-letter code
 * @param {string} languageName - Full language name
 * @returns {string} Language code (ISO 639-3 or uppercase 3-letter)
 */
function mapLanguageNameToCode(languageName) {
    if (!languageName) return '';

    // Check mapping first
    const code = LANGUAGE_NAME_TO_CODE[languageName];
    if (code) return code.toUpperCase();

    // Fallback: take first 3 letters and uppercase
    return languageName.substring(0, 3).toUpperCase();
}

// ==================== DEBOUNCE UTILITY ====================
/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== EXPORTS ====================
// For ES6 modules (if needed later)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LANGUAGE_NAME_TO_CODE,
        getSelectedUpgData,
        loadImageWithFallback,
        loadNavbar,
        extractDataFromResponse,
        showNotification,
        getLanguageCode,
        mapLanguageNameToCode,
        debounce
    };
}
