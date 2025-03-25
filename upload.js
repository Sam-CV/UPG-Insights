// Upload page functionality
document.addEventListener('DOMContentLoaded', function () {
    // Initialize variables
    let selectedUPG = '';

    // Elements
    const upgSelect = document.getElementById('upg-select');
    const updateBtn = document.getElementById('update-btn');

    // Set up event listeners
    upgSelect.addEventListener('change', function () {
        selectedUPG = this.value;
        console.log('Selected UPG:', selectedUPG);
    });

    // Update button functionality
    updateBtn.addEventListener('click', async function () {
        if (selectedUPG) {
            // Simulate data update
            const res = await updateData(selectedUPG);

            if (res) {
                console.log('Data updated successfully.');
            
            // Indicate success
            this.classList.add('success');
            this.innerHTML = '<span class="material-symbols-outlined">check</span> Success';

            // Reset button after delay
            setTimeout(() => {
                this.classList.remove('success');
                this.innerHTML = '<span class="material-symbols-outlined">cloud_upload</span> Update';

                // Show success message
                showSuccessMessage();
            }, 2000);
        }else {
            console.error('Error updating data.');

            // Indicate error
            this.classList.add('error');
            this.innerHTML = '<span class="material-symbols-outlined">error</span> Error';

            // Reset button after delay
            setTimeout(() => {
                this.classList.remove('error');
                this.innerHTML = '<span class="material-symbols-outlined">cloud_upload</span> Update';
            }, 2000);

            // Show error message
            showErrorMessage();
        }
        } else {
            // Show error
            upgSelect.classList.add('error');
            setTimeout(() => {
                upgSelect.classList.remove('error');
            }, 1000);
        }
    });

    // Show error message
    function showErrorMessage() {
        // Create error message element
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <span class="material-symbols-outlined">error</span>
            <p>There was an error updating your data. Please try again.</p>
            <button class="close-btn">Close</button>
        `;

        // Add to page
        document.querySelector('.upload-container').appendChild(errorMessage);

        // Animate in
        setTimeout(() => {
            errorMessage.style.opacity = '1';
            errorMessage.style.transform = 'translateY(0)';
        }, 10);

        // Add close button functionality
        errorMessage.querySelector('.close-btn').addEventListener('click', function () {
            errorMessage.style.opacity = '0';
            errorMessage.style.transform = 'translateY(20px)';

            setTimeout(() => {
                errorMessage.remove();
            }, 300);
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(errorMessage)) {
                errorMessage.style.opacity = '0';
                errorMessage.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    if (document.body.contains(errorMessage)) {
                        errorMessage.remove();
                    }
                }, 300);
            }
        }, 5000);

    }

    // Simulate updating data
    async function updateData(upg) {
        console.log(`Updating data for ${upg}...`);
    
        const payload = { key: 'cvglobal' };
    
        try {
            const response = await fetch('https://abhhdadadlysf7bewlquozv3ay0nfrym.lambda-url.ap-southeast-2.on.aws/ ', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Added headers
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
    
            console.log('Request sent successfully.');
            console.log('Response:', response);
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }
    

    // Show success message
    function showSuccessMessage() {
        // Create success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <span class="material-symbols-outlined">check_circle</span>
            <p>Your data for <strong>${upgSelect.options[upgSelect.selectedIndex].text}</strong> has been successfully updated.</p>
            <button class="close-btn">Close</button>
        `;

        // Add to page
        document.querySelector('.upload-container').appendChild(successMessage);

        // Animate in
        setTimeout(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translateY(0)';
        }, 10);

        // Add close button functionality
        successMessage.querySelector('.close-btn').addEventListener('click', function () {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translateY(20px)';

            setTimeout(() => {
                successMessage.remove();
            }, 300);
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                successMessage.style.opacity = '0';
                successMessage.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    if (document.body.contains(successMessage)) {
                        successMessage.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Add these styles directly
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: #ff3b30 !important;
            animation: shake 0.5s ease-in-out;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-5px); }
            40%, 80% { transform: translateX(5px); }
        }
        
        .success {
            background-color: #34c759 !important;
        }
        
        .success-message {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: white;
            border-left: 4px solid #34c759;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 15px;
            max-width: 400px;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .success-message .material-symbols-outlined {
            color: #34c759;
            font-size: 24px;
        }
        
        .success-message p {
            margin: 0;
            flex: 1;
        }
        
        .close-btn {
            background-color: #f5f5f5;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s ease;
        }
        
        .close-btn:hover {
            background-color: #e0e0e0;
        }
    `;
    document.head.appendChild(style);
});