// API Configuration
const API_CONFIG = {
    imageGeneration: 'https://52bpezwsc72hdf3d3el6rmhuxi0sexru.lambda-url.ap-southeast-2.on.aws/'
};

// UPG Data - embedded for immediate access
const UPG_DATA = {
  "upgData": [
    {
      "language": "Japanese",
      "country": "Japan",
      "upg": "Japanese",
      "religion": "Buddhist"
    },
    {
      "language": "Burmese",
      "country": "Myanmar",
      "upg": "Burmese",
      "religion": "Buddhist"
    },
    {
      "language": "Thai",
      "country": "Thailand",
      "upg": "Thai",
      "religion": "Buddhist"
    },
    {
      "language": "Khmer",
      "country": "Cambodia",
      "upg": "Khmer",
      "religion": "Buddhist"
    },
    {
      "language": "Shan",
      "country": "Myanmar",
      "upg": "Shan",
      "religion": "Buddhist"
    },
    {
      "language": "Lao",
      "country": "Laos",
      "upg": "Lao",
      "religion": "Buddhist"
    },
    {
      "language": "Vietnamese",
      "country": "Vietnam",
      "upg": "Vietnamese",
      "religion": "Buddhist"
    },
    {
      "language": null,
      "country": "Mongolia",
      "upg": null,
      "religion": "Buddhist"
    },
    {
      "language": "Rakhine",
      "country": "Myanmar",
      "upg": "Rakhine",
      "religion": "Buddhist"
    },
    {
      "language": "Sinhalese",
      "country": "Sri Lanka",
      "upg": "Sinhalese",
      "religion": "Buddhist"
    },
    {
      "language": null,
      "country": "India",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": null,
      "country": "Indonesia",
      "upg": null,
      "religion": null
    },
    {
      "language": "Bengali",
      "country": "Bangladesh",
      "upg": "Bengali",
      "religion": "Hinduism"
    },
    {
      "language": "Bangla",
      "country": "Bangladesh",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": null,
      "country": "India",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": null,
      "country": "Nepal",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": "Gujarati",
      "country": "India",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": null,
      "country": "Nepal",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": "Hindi",
      "country": "India",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": null,
      "country": "Nepal",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": "Marathi",
      "country": "India",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": "Nepali",
      "country": "Nepal",
      "upg": "Nepali",
      "religion": "Hinduism"
    },
    {
      "language": "Oriya (Macrolanguage)",
      "country": "India",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": null,
      "country": "Pakistan",
      "upg": null,
      "religion": "Hinduism"
    },
    {
      "language": null,
      "country": "Indonesia",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Afghanistan",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Algeria",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Chad",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Yemen",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Saudi Arabia",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Syria",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Iraq",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Morocco",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Oman",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Khaliji (Gulf) Arabic",
      "country": "Saudi Arabia",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Tunisia",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Sudan",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Azerbaijan",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Iran",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Bambara",
      "country": "Mali",
      "upg": "Bambara",
      "religion": "Islam"
    },
    {
      "language": "Banjar",
      "country": "Indonesia",
      "upg": "Banjar",
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Bangladesh",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Pakistan",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Dari",
      "country": "Afghanistan",
      "upg": "Dari",
      "religion": "Islam"
    },
    {
      "language": "Algerian Darija/Amazigh",
      "country": "Morocco",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Nigeria",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Hausa",
      "country": "Nigeria",
      "upg": "Hausa",
      "religion": "Islam"
    },
    {
      "language": "Indonesian",
      "country": "Indonesia",
      "upg": "Indonesian",
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Kazakhstan",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Turkey",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Malaysia",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Musi",
      "country": "Indonesia",
      "upg": "Musi",
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Ethiopia",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Pashto AF",
      "country": "Afghanistan",
      "upg": "Pashtun",
      "religion": "Islam"
    },
    {
      "language": "Pashto Pak",
      "country": "Pakistan",
      "upg": "Pashtun",
      "religion": null
    },
    {
      "language": null,
      "country": "Guinea",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Saraiki",
      "country": "Pakistan",
      "upg": "Saraiki",
      "religion": "Islam"
    },
    {
      "language": "Sindhi",
      "country": "Pakistan",
      "upg": "Sindhi",
      "religion": "Islam"
    },
    {
      "language": "Somali",
      "country": "Somalia",
      "upg": "Somali",
      "religion": "Islam"
    },
    {
      "language": "Sundanese",
      "country": "Indonesia",
      "upg": "Sundanese",
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Tajikistan",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Turkish",
      "country": "Turkey",
      "upg": "Turkish",
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Turkmenistan",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Urdu",
      "country": "Pakistan",
      "upg": "Urdu",
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Uzbekistan",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "Uzbek",
      "country": "Uzbekistan",
      "upg": "Uzbek",
      "religion": "Islam"
    },
    {
      "language": "Kazakh",
      "country": null,
      "upg": "Kazakh",
      "religion": null
    },
    {
      "language": "Wolof",
      "country": "Senegal",
      "upg": "Wolof",
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Malawi",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": null,
      "country": "Niger",
      "upg": null,
      "religion": "Islam"
    },
    {
      "language": "French",
      "country": "West Africa",
      "upg": null,
      "religion": null
    },
    {
      "language": "Russian",
      "country": "Central Asia",
      "upg": null,
      "religion": null
    }
  ]
};

// Application State
const state = {
    uniqueCombinations: [],
    completedItems: [],
    imageGenerationTasks: {}, // Now maps slotIndex to task info
    isGenerating: false,
    isPaused: false
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await initializeApp();
});

async function initializeApp() {
    logActivity('info', 'Initializing UPG Profile Image Generator...');
    
    // Process UPG data into unique combinations
    processUPGData();
    
    // Load completed items
    await loadCompletedItems();
    
    // Update UI
    updateStats();
    updateCompletedList();
    
    // Setup event listeners
    setupEventListeners();
    
    logActivity('success', `Initialized with ${state.uniqueCombinations.length} unique combinations`);
}

function processUPGData() {
    const seen = new Set();
    const combinations = [];
    
    UPG_DATA.upgData.forEach(item => {
        // Handle null values by substituting available data
        let country = item.country;
        let religion = item.religion;
        let groupName = item.upg || item.language;
        
        // Skip if both country and religion are null
        if (!country && !religion) {
            if (groupName) {
                // Use groupName as both country and religion
                country = groupName;
                religion = groupName;
            } else {
                return; // Skip this entry
            }
        }
        
        // If one is null, use the other
        if (!country && religion) {
            country = religion;
        }
        if (!religion && country) {
            religion = country;
        }
        
        if (!groupName) {
            groupName = country || religion;
        }
        
        // Create unique key
        const key = `${country}-${religion}`;
        
        if (!seen.has(key)) {
            seen.add(key);
            
            // Add both male and female versions
            combinations.push({
                country: country,
                religion: religion,
                groupName: groupName,
                gender: 'male',
                key: `${key}-male`,
                originalData: item
            });
            
            combinations.push({
                country: country,
                religion: religion,
                groupName: groupName,
                gender: 'female',
                key: `${key}-female`,
                originalData: item
            });
        }
    });
    
    state.uniqueCombinations = combinations;
    logActivity('info', `Processed ${combinations.length} unique combinations (${combinations.length/2} groups × 2 genders)`);
}

async function loadCompletedItems() {
    try {
        const response = await fetch('/api/completed-items');
        if (response.ok) {
            const data = await response.json();
            state.completedItems = data.completed || [];
            logActivity('info', `Loaded ${state.completedItems.length} completed items`);
        }
    } catch (error) {
        logActivity('warning', 'Could not load completed items file, starting fresh');
        state.completedItems = [];
    }
}

function setupEventListeners() {
    document.getElementById('start-generation').addEventListener('click', startGeneration);
    document.getElementById('pause-generation').addEventListener('click', pauseGeneration);
    document.getElementById('reset-completed').addEventListener('click', resetCompleted);
    document.getElementById('toggle-completed').addEventListener('click', toggleCompleted);
}

function generatePrompt(combination) {
    const { country, religion, groupName, gender } = combination;
    
    // Adapt clothing description based on religion and country
    let clothingDescription = `traditional ${country}`;
    
    if (religion && religion !== country) {
        clothingDescription = `traditional ${country} ${religion}`;
    }
    
    const genderTerm = gender === 'male' ? 'man' : 'woman';
    const possessive = gender === 'male' ? 'his' : 'her';
    
    return `A young ${genderTerm} from the ${groupName} people group of ${country}. A portrait looking straight into the camera with ${possessive} eyes open, studio lighting, black background. The ${genderTerm} is isolated with a black background and nothing in the background. Low lighting. They are seated on a stool and their body is straight onto the camera. mild happy expression. Their eyes are at a third of the image from the top and the image is including down to ${possessive} waist. They are sitting up straight. The ${genderTerm} is wearing ${clothingDescription} traditional clothes. Hyperrealistic, photorealism, show intricate details, Canon EOS r3, 50mm, cinematic, megapixel cinematic lighting, anti-aliasing, SFX, VFX, CGI, RTX, SSAO, FKAA, TXAA, HDR, 8k`;
}

async function startGeneration() {
    if (state.isGenerating) return;
    
    state.isGenerating = true;
    state.isPaused = false;
    
    document.getElementById('start-generation').disabled = true;
    document.getElementById('pause-generation').disabled = false;
    
    logActivity('info', 'Starting continuous image generation...');
    
    // Show the selection interface immediately
    document.getElementById('current-batch').style.display = 'none';
    document.getElementById('selection-phase').style.display = 'block';
    
    // Initialize 5 slots for continuous generation
    initializeGenerationSlots();
    
    // Start generating in all 5 slots
    for (let slotIndex = 0; slotIndex < 5; slotIndex++) {
        startSlotGeneration(slotIndex);
    }
}

function initializeGenerationSlots() {
    const container = document.getElementById('selection-container');
    container.innerHTML = '';
    
    // Create 5 slots for continuous generation
    for (let i = 0; i < 5; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'generation-slot';
        slotDiv.id = `slot-${i}`;
        slotDiv.innerHTML = `
            <div class="slot-header">
                <h4 id="slot-title-${i}">Initializing...</h4>
            </div>
            <div class="slot-content" id="slot-content-${i}">
                <div class="slot-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="slot-progress-fill-${i}"></div>
                        <div class="progress-text" id="slot-progress-text-${i}">Starting generation...</div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(slotDiv);
    }
}

async function startSlotGeneration(slotIndex) {
    if (state.isPaused) return;
    
    // Clear any existing task for this slot
    if (state.imageGenerationTasks[slotIndex]) {
        logActivity('info', `Slot ${slotIndex}: Clearing previous task`);
    }
    
    // Get next combination to process
    const nextCombination = getNextCombination();
    
    if (!nextCombination) {
        logActivity('success', `Slot ${slotIndex}: All combinations completed!`);
        updateSlotStatus(slotIndex, 'All Done!', 'completed');
        checkAllSlotsCompleted();
        return;
    }
    
    // Update slot UI
    updateSlotTitle(slotIndex, `${nextCombination.country} - ${nextCombination.religion} - ${nextCombination.gender}`);
    updateSlotStatus(slotIndex, 'Starting generation...', 'generating');
    
    // Store slot information BEFORE making API call to reserve this combination
    state.imageGenerationTasks[slotIndex] = {
        combination: nextCombination,
        status: 'pending',
        slotIndex: slotIndex
    };
    
    logActivity('info', `Slot ${slotIndex}: Reserved ${nextCombination.key}`);
    
    try {
        const prompt = generatePrompt(nextCombination);
        
        logActivity('info', `Slot ${slotIndex}: Generating ${nextCombination.key}`);
        
        const response = await fetch(API_CONFIG.imageGeneration, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: prompt,
                model: 'midjourney'
            })
        });
        
        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Extract job ID
        let jobId = result.id || result.data?.id || result.body?.id;
        
        if (!jobId) {
            throw new Error(`No job ID found in response: ${JSON.stringify(result)}`);
        }
        
        // Update task with job ID
        state.imageGenerationTasks[slotIndex].jobId = jobId;
        state.imageGenerationTasks[slotIndex].result = result;
        state.imageGenerationTasks[slotIndex].status = 'generating';
        
        updateSlotStatus(slotIndex, 'Queued...', 'generating');
        
        logActivity('success', `Slot ${slotIndex}: Started ${nextCombination.key} (Job ID: ${jobId})`);
        
        // Start checking status for this specific slot
        checkSlotStatus(slotIndex);
        
    } catch (error) {
        logActivity('error', `Slot ${slotIndex}: Failed to start generation: ${error.message}`);
        updateSlotStatus(slotIndex, `Error: ${error.message}`, 'error');
        
        // Clear the failed task so the combination can be tried again
        delete state.imageGenerationTasks[slotIndex];
        
        // Retry after delay
        setTimeout(() => startSlotGeneration(slotIndex), 5000);
    }
}

async function checkSlotStatus(slotIndex) {
    const task = state.imageGenerationTasks[slotIndex];
    
    if (!task || !task.jobId || task.status === 'completed' || task.status === 'uploaded') {
        return;
    }
    
    try {
        const response = await fetch(`${API_CONFIG.imageGeneration}?id=${task.jobId}`);
        
        if (!response.ok) {
            throw new Error(`Status check failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        let data = null;
        if (result.body) {
            const bodyData = JSON.parse(result.body);
            data = bodyData.data || bodyData;
        } else {
            data = result.data || result;
        }
        
        if (data.status === 'pending') {
            updateSlotStatus(slotIndex, 'Queued...', 'generating');
            setTimeout(() => checkSlotStatus(slotIndex), 2000);
        } else if (data.status === 'in-progress' && data.progress) {
            updateSlotStatus(slotIndex, `${data.progress}%`, 'generating');
            updateSlotProgress(slotIndex, data.progress);
            setTimeout(() => checkSlotStatus(slotIndex), 2000);
        } else if (data.status === 'completed' && data.upscaled_urls && data.upscaled_urls.length > 0) {
            task.status = 'completed';
            task.upscaledUrls = data.upscaled_urls;
            
            // Show the completed images for selection
            showSlotResults(slotIndex, data.upscaled_urls);
            
            logActivity('success', `Slot ${slotIndex}: Generated images for ${task.combination.key}`);
        } else if (data.status === 'failed' || data.error) {
            updateSlotStatus(slotIndex, 'Generation failed', 'error');
            logActivity('error', `Slot ${slotIndex}: Generation failed for ${task.combination.key}`);
            
            // Retry after delay
            setTimeout(() => startSlotGeneration(slotIndex), 5000);
        } else {
            setTimeout(() => checkSlotStatus(slotIndex), 2000);
        }
        
    } catch (error) {
        logActivity('error', `Slot ${slotIndex}: Error checking status: ${error.message}`);
        setTimeout(() => checkSlotStatus(slotIndex), 2000);
    }
}

function showSlotResults(slotIndex, upscaledUrls) {
    const slotContent = document.getElementById(`slot-content-${slotIndex}`);
    
    slotContent.innerHTML = `
        <div class="image-selection" data-slot-index="${slotIndex}">
            ${upscaledUrls.map((url, imgIndex) => `
                <div class="image-option" data-url="${url}" data-img-index="${imgIndex}">
                    <img src="${url}" alt="Option ${imgIndex + 1}" loading="lazy">
                    <div class="selection-indicator">✓</div>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add click handler for this slot
    slotContent.addEventListener('click', handleSlotImageSelection);
    
    updateSlotStatus(slotIndex, 'Ready - Click to save!', 'ready');
}

async function handleSlotImageSelection(event) {
    const imageOption = event.target.closest('.image-option');
    if (!imageOption) return;
    
    const imageSelection = imageOption.closest('.image-selection');
    const slotIndex = parseInt(imageSelection.dataset.slotIndex);
    const imageUrl = imageOption.dataset.url;
    const task = state.imageGenerationTasks[slotIndex];
    
    if (!task || task.status === 'uploading') return;
    
    logActivity('info', `Slot ${slotIndex}: Selected image for ${task.combination.key}`);
    logActivity('info', `Image URL: ${imageUrl.substring(0, 100)}...`);
    
    // Mark as uploading
    task.status = 'uploading';
    
    // Disable other images in this slot
    imageSelection.querySelectorAll('.image-option').forEach(option => {
        option.style.opacity = '0.5';
        option.style.pointerEvents = 'none';
    });
    
    imageOption.style.opacity = '1';
    imageOption.classList.add('selected');
    
    updateSlotStatus(slotIndex, 'Saving...', 'uploading');

    try {
        await saveSlotImageLocally(slotIndex, imageUrl, task.combination);

        // Mark as saved and add to completed
        state.completedItems.push(task.combination.key);

        // IMPORTANT: Clear the task from this slot so it doesn't block future generations
        delete state.imageGenerationTasks[slotIndex];

        // Save progress
        await saveCompletedItems();
        updateStats();
        updateCompletedList();

        logActivity('success', `✅ Slot ${slotIndex}: Saved ${task.combination.key}, starting next...`);

        // Start next generation in this slot
        setTimeout(() => startSlotGeneration(slotIndex), 1000);

    } catch (error) {
        logActivity('error', `❌ Slot ${slotIndex}: Save failed for ${task.combination.key}`);
        logActivity('error', `Error details: ${error.message}`);

        updateSlotStatus(slotIndex, `Save failed: ${error.message}`, 'error');

        // Re-enable selection for retry
        imageSelection.querySelectorAll('.image-option').forEach(option => {
            option.style.opacity = '1';
            option.style.pointerEvents = 'auto';
        });

        task.status = 'completed'; // Allow retry
    }
}

async function saveSlotImageLocally(slotIndex, imageUrl, combination) {
    updateSlotProgress(slotIndex, 30, 'Saving to local folder...');

    // Send to Python backend to save locally
    const response = await fetch('/api/save-image', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            imageUrl: imageUrl,
            country: combination.country,
            religion: combination.religion,
            gender: combination.gender
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Save failed: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.error || 'Save failed');
    }

    updateSlotProgress(slotIndex, 100, 'Saved!');

    logActivity('success', `Slot ${slotIndex}: Saved to ${result.path} (${Math.round(result.size / 1024)}KB)`);
}

function getNextCombination() {
    // Get combinations that are not completed AND not currently being processed
    const inProgress = Object.values(state.imageGenerationTasks)
        .filter(task => task && task.combination)
        .map(task => task.combination.key);
    
    const remaining = state.uniqueCombinations.filter(combo => 
        !state.completedItems.includes(combo.key) && 
        !inProgress.includes(combo.key)
    );
    
    // Debug logging
    logActivity('info', `Available combinations: ${remaining.length}, In progress: ${inProgress.length}, Completed: ${state.completedItems.length}`);
    
    if (remaining.length > 0) {
        logActivity('info', `Next combination: ${remaining[0].key}`);
    }
    
    return remaining.length > 0 ? remaining[0] : null;
}

function updateSlotTitle(slotIndex, title) {
    const titleElement = document.getElementById(`slot-title-${slotIndex}`);
    if (titleElement) {
        titleElement.textContent = title;
    }
}

function updateSlotStatus(slotIndex, status, statusClass) {
    const slot = document.getElementById(`slot-${slotIndex}`);
    const progressText = document.getElementById(`slot-progress-text-${slotIndex}`);
    
    if (slot) {
        slot.className = `generation-slot ${statusClass}`;
    }
    
    if (progressText) {
        progressText.textContent = status;
    }
}

function updateSlotProgress(slotIndex, progress, text = null) {
    const progressFill = document.getElementById(`slot-progress-fill-${slotIndex}`);
    const progressText = document.getElementById(`slot-progress-text-${slotIndex}`);
    
    if (progressFill) {
        progressFill.style.width = `${progress}%`;
    }
    
    if (text && progressText) {
        progressText.textContent = text;
    }
}

function checkAllSlotsCompleted() {
    const allCompleted = Object.values(state.imageGenerationTasks).every(task => 
        !task || task.status === 'completed' || task.status === 'uploaded'
    );
    
    if (allCompleted) {
        const remaining = state.uniqueCombinations.filter(combo => 
            !state.completedItems.includes(combo.key)
        );
        
        if (remaining.length === 0) {
            finishGeneration();
        }
    }
}







async function saveCompletedItems() {
    const data = {
        completed: state.completedItems,
        version: "1.0",
        lastUpdated: new Date().toISOString()
    };

    try {
        await fetch('/api/completed-items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        logActivity('info', `Saved ${state.completedItems.length} completed items`);
    } catch (error) {
        logActivity('warning', 'Could not save completed items to file');
    }
}



function pauseGeneration() {
    state.isPaused = true;
    document.getElementById('start-generation').disabled = false;
    document.getElementById('pause-generation').disabled = true;
    
    // Update all active slots to show paused status
    for (let i = 0; i < 5; i++) {
        const task = state.imageGenerationTasks[i];
        if (task && (task.status === 'pending' || task.status === 'generating')) {
            updateSlotStatus(i, 'Paused', 'error');
        }
    }
    
    logActivity('warning', 'Generation paused - click Start to resume');
}

function finishGeneration() {
    state.isGenerating = false;
    document.getElementById('start-generation').disabled = false;
    document.getElementById('pause-generation').disabled = true;
    
    // Update all slots to show completion
    for (let i = 0; i < 5; i++) {
        updateSlotTitle(i, 'All Completed!');
        updateSlotStatus(i, 'Generation finished - all UPG profiles created!', 'completed');
    }
    
    logActivity('success', '🎉 All UPG profile generations completed!');
}

async function resetCompleted() {
    if (confirm('Are you sure you want to reset the completed items list? This cannot be undone.')) {
        state.completedItems = [];
        localStorage.removeItem('upg-completed-items');
        
        // Clear any ongoing generations
        state.imageGenerationTasks = {};
        
        updateStats();
        updateCompletedList();
        logActivity('warning', 'Completed items list reset - ready to start fresh');
    }
}

function toggleCompleted() {
    const list = document.getElementById('completed-list');
    list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

function updateStats() {
    document.getElementById('completed-count').textContent = state.completedItems.length;
    document.getElementById('remaining-count').textContent = state.uniqueCombinations.length - state.completedItems.length;
    document.getElementById('total-count').textContent = state.uniqueCombinations.length;
}

function updateCompletedList() {
    const container = document.getElementById('completed-list');
    container.innerHTML = '';
    
    if (state.completedItems.length === 0) {
        container.innerHTML = '<div class="completed-item">No completed items yet</div>';
        return;
    }
    
    state.completedItems.forEach(key => {
        const div = document.createElement('div');
        div.className = 'completed-item';
        div.textContent = key;
        container.appendChild(div);
    });
}

function logActivity(type, message) {
    const logContent = document.getElementById('log-content');
    const timestamp = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `<span class="timestamp">[${timestamp}]</span>${message}`;
    
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
    
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Load completed items from localStorage on startup
document.addEventListener('DOMContentLoaded', function() {
    const stored = localStorage.getItem('upg-completed-items');
    if (stored) {
        try {
            const data = JSON.parse(stored);
            state.completedItems = data.completed || [];
        } catch (error) {
            console.warn('Could not parse stored completed items');
        }
    }
});