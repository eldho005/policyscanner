/**
 * PolicyScanner Hero Component JavaScript
 * Handles form interactions and validation
 * Mobile-first design for Google Ads landing pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero form functionality
    initializeHeroForm();
});

/**
 * Initialize the hero form with validation and submission handling
 */
function initializeHeroForm() {
    const form = document.querySelector('.hero__form');
    const submitButton = document.querySelector('.hero__form-submit');
    
    if (!form || !submitButton) {
        console.warn('Hero form elements not found');
        return;
    }

    // Add form submission handler
    form.addEventListener('submit', handleFormSubmission);
    
    // Add real-time validation feedback
    addFormValidation(form);
    
    // Add accessibility enhancements
    enhanceFormAccessibility(form);
}

/**
 * Handle form submission with validation and processing
 * @param {Event} event - Form submission event
 */
function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('.hero__form-submit');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form data
    const validation = validateFormData(data);
    
    if (!validation.isValid) {
        showValidationError(validation.message);
        return;
    }
    
    // Show loading state
    setSubmissionState(submitButton, 'loading');
    
    // Simulate form submission (replace with actual API call)
    simulateFormSubmission(data)
        .then(response => {
            setSubmissionState(submitButton, 'success');
            handleSuccessfulSubmission(response);
        })
        .catch(error => {
            setSubmissionState(submitButton, 'error');
            handleSubmissionError(error);
        });
}

/**
 * Validate form data before submission
 * @param {Object} data - Form data object
 * @returns {Object} Validation result
 */
function validateFormData(data) {
    // Check required fields
    if (!data.gender) {
        return {
            isValid: false,
            message: 'Please select your gender.'
        };
    }
    
    if (!data.smoke) {
        return {
            isValid: false,
            message: 'Please indicate your smoking status.'
        };
    }
    
    if (!data.province) {
        return {
            isValid: false,
            message: 'Province information is required.'
        };
    }
    
    // Validate gender value
    if (!['male', 'female'].includes(data.gender)) {
        return {
            isValid: false,
            message: 'Please select a valid gender option.'
        };
    }
    
    // Validate smoking status
    if (!['yes', 'no'].includes(data.smoke)) {
        return {
            isValid: false,
            message: 'Please select a valid smoking status.'
        };
    }
    
    return {
        isValid: true,
        message: 'Form data is valid.'
    };
}

/**
 * Add real-time form validation feedback
 * @param {HTMLElement} form - Form element
 */
function addFormValidation(form) {
    const radioGroups = form.querySelectorAll('[role="radiogroup"]');
    
    radioGroups.forEach(group => {
        const inputs = group.querySelectorAll('input[type="radio"]');
        
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                // Remove any previous error styling
                group.classList.remove('validation-error');
                
                // Add visual feedback for selection
                updateRadioGroupState(group);
            });
        });
    });
}

/**
 * Update visual state of radio button group
 * @param {HTMLElement} group - Radio group element
 */
function updateRadioGroupState(group) {
    const inputs = group.querySelectorAll('input[type="radio"]');
    const hasSelection = Array.from(inputs).some(input => input.checked);
    
    if (hasSelection) {
        group.classList.add('has-selection');
    } else {
        group.classList.remove('has-selection');
    }
}

/**
 * Enhance form accessibility
 * @param {HTMLElement} form - Form element
 */
function enhanceFormAccessibility(form) {
    // Add ARIA live region for announcements
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'form-announcements';
    form.appendChild(liveRegion);
    
    // Improve radio button keyboard navigation
    const radioGroups = form.querySelectorAll('[role="radiogroup"]');
    
    radioGroups.forEach(group => {
        const inputs = group.querySelectorAll('input[type="radio"]');
        
        inputs.forEach((input, index) => {
            input.addEventListener('keydown', function(event) {
                handleRadioKeyNavigation(event, inputs, index);
            });
        });
    });
}

/**
 * Handle keyboard navigation for radio buttons
 * @param {KeyboardEvent} event - Keyboard event
 * @param {NodeList} inputs - Radio input elements
 * @param {number} currentIndex - Current input index
 */
function handleRadioKeyNavigation(event, inputs, currentIndex) {
    let targetIndex;
    
    switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
            event.preventDefault();
            targetIndex = (currentIndex + 1) % inputs.length;
            break;
            
        case 'ArrowUp':
        case 'ArrowLeft':
            event.preventDefault();
            targetIndex = (currentIndex - 1 + inputs.length) % inputs.length;
            break;
            
        default:
            return;
    }
    
    if (targetIndex !== undefined) {
        inputs[targetIndex].checked = true;
        inputs[targetIndex].focus();
        
        // Trigger change event for validation
        inputs[targetIndex].dispatchEvent(new Event('change', { bubbles: true }));
    }
}

/**
 * Set submission state with visual feedback
 * @param {HTMLElement} button - Submit button element
 * @param {string} state - State: 'loading', 'success', 'error', 'default'
 */
function setSubmissionState(button, state) {
    const originalText = button.dataset.originalText || button.textContent;
    
    // Store original text if not already stored
    if (!button.dataset.originalText) {
        button.dataset.originalText = originalText;
    }
    
    // Remove previous state classes
    button.classList.remove('btn-loading', 'btn-success', 'btn-error');
    button.disabled = false;
    
    switch (state) {
        case 'loading':
            button.textContent = 'Getting Quotes...';
            button.disabled = true;
            button.classList.add('btn-loading');
            break;
            
        case 'success':
            button.textContent = 'Success!';
            button.classList.add('btn-success');
            
            // Reset after 3 seconds
            setTimeout(() => {
                setSubmissionState(button, 'default');
            }, 3000);
            break;
            
        case 'error':
            button.textContent = 'Try Again';
            button.classList.add('btn-error');
            
            // Reset after 5 seconds
            setTimeout(() => {
                setSubmissionState(button, 'default');
            }, 5000);
            break;
            
        case 'default':
        default:
            button.textContent = originalText;
            break;
    }
}

/**
 * Show validation error message
 * @param {string} message - Error message
 */
function showValidationError(message) {
    // Create or update error message element
    let errorElement = document.querySelector('.form-error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'form-error-message';
        errorElement.setAttribute('role', 'alert');
        
        const form = document.querySelector('.hero__form');
        const submitButton = form.querySelector('.hero__form-submit');
        form.insertBefore(errorElement, submitButton);
    }
    
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Announce to screen readers
    const liveRegion = document.querySelector('#form-announcements');
    if (liveRegion) {
        liveRegion.textContent = `Error: ${message}`;
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

/**
 * Simulate form submission (replace with actual API call)
 * @param {Object} data - Form data
 * @returns {Promise} Submission promise
 */
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate success (90% success rate for demo)
            if (Math.random() > 0.1) {
                resolve({
                    success: true,
                    message: 'Quote request submitted successfully',
                    leadId: 'LEAD_' + Date.now(),
                    data: data
                });
            } else {
                reject(new Error('Submission failed. Please try again.'));
            }
        }, 1500);
    });
}

/**
 * Handle successful form submission
 * @param {Object} response - Success response
 */
function handleSuccessfulSubmission(response) {
    console.log('Form submitted successfully:', response);
    
    // Track conversion for Google Ads
    if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
            send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
            value: 1.0,
            currency: 'CAD'
        });
    }
    
    // Track with Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'generate_lead', {
            event_category: 'form',
            event_label: 'hero_quote_form',
            value: 1
        });
    }
    
    // Show success message
    const liveRegion = document.querySelector('#form-announcements');
    if (liveRegion) {
        liveRegion.textContent = 'Success! Your quote request has been submitted.';
    }
    
    // Optional: Redirect to thank you page or show additional content
    // window.location.href = '/thank-you';
}

/**
 * Handle form submission error
 * @param {Error} error - Error object
 */
function handleSubmissionError(error) {
    console.error('Form submission error:', error);
    
    // Show user-friendly error message
    showValidationError('Something went wrong. Please try again or call us at 343-337-POLICY(6542).');
    
    // Track error for analytics
    if (typeof gtag === 'function') {
        gtag('event', 'exception', {
            description: 'form_submission_error',
            fatal: false
        });
    }
}

/**
 * Utility function to debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
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

// Export functions for testing (if module system is available)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeHeroForm,
        validateFormData,
        handleFormSubmission,
        setSubmissionState
    };
}