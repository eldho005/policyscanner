// Quote Flow - Enhanced Implementation with Bug Fixes
let currentStep = 1;
let currentQuestion = 1;
let quoteData = {};
let exitIntentShown = false;
let isInitialized = false; // Prevent double initialization
let isSkip = false;
let isSkipGoogle = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    if (!isInitialized) {
        initializeQuoteFlow();
        initializeExitIntent();
        initializeRestartFunctionality();
        initializeModalClickOutside();
        isInitialized = true;
        isSkip = stepSkip;
        isSkipGoogle = stepGoogleSkip;
    }
});

function initializeQuoteFlow() {
    // Step handlers
    initializeStep1();
    initializeStep2();
    initializeStep3();
    initializeStep4();
    initializeStep5();
    initializeStep6();
}

// Initialize modal click-outside-to-close functionality
function initializeModalClickOutside() {
    // Prevent duplicate initialization
    if (document.body.hasAttribute('data-modal-click-initialized')) {
        return;
    }
    document.body.setAttribute('data-modal-click-initialized', 'true');
    
    const modals = [
        'otherProvinceModal',
        'exitIntentModal',
        'finalQuestionsModal'
    ];
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    if (modalId === 'otherProvinceModal') closeModal();
                    else if (modalId === 'exitIntentModal') closeExitIntent();
                    else if (modalId === 'finalQuestionsModal') closeFinalQuestions();
                }
            });
        }
    });
}

// Initialize restart functionality
function initializeRestartFunctionality() {
    const insuranceTypeSelector = document.getElementById('insuranceTypeSelector');
    const restartIcon = document.getElementById('restartIcon');
    
    if (!insuranceTypeSelector || !restartIcon) {
        console.warn('Restart elements not found');
        return;
    }
    
    // Check if already initialized to prevent duplicate listeners
    if (insuranceTypeSelector.hasAttribute('data-restart-initialized')) {
        return;
    }
    insuranceTypeSelector.setAttribute('data-restart-initialized', 'true');
    
    // Handle clicks on the insurance type selector
    insuranceTypeSelector.addEventListener('click', function(e) {
        // If restart icon is visible and clicked, restart the flow
        if (restartIcon.style.display !== 'none' && e.target === restartIcon) {
            e.stopPropagation();
            restartQuoteFlow();
        }
        // If restart icon is visible but main button is clicked, also restart
        else if (restartIcon.style.display !== 'none') {
            restartQuoteFlow();
        }
        // If no insurance type selected yet, do nothing (handled by step 1)
    });
}

// Restart the quote flow
function restartQuoteFlow() {
    // Show confirmation dialog
    const confirmRestart = confirm('Are you sure you want to start over? All your progress will be lost.');
    
    if (confirmRestart) {
        try {
            // Reset all data
            quoteData = {};
            currentStep = 1;
            currentQuestion = 1;
            exitIntentShown = false;
            
            // Reset UI elements safely
            const currentTypeElement = document.getElementById('currentInsuranceType');
            const restartIconElement = document.getElementById('restartIcon');
            const typeSelectorElement = document.getElementById('insuranceTypeSelector');
            
            if (currentTypeElement) currentTypeElement.textContent = 'Select Type';
            if (restartIconElement) restartIconElement.style.display = 'none';
            if (typeSelectorElement) {
                typeSelectorElement.classList.remove('quote-header__insurance-type--active');
                typeSelectorElement.removeAttribute('title');
            }
            
            // Clear all selections
            document.querySelectorAll('.selection-card--selected').forEach(card => {
                card.classList.remove('selection-card--selected');
                card.setAttribute('aria-checked', 'false');
            });
            
            // Reset forms
            const forms = document.querySelectorAll('form');
            forms.forEach(form => form.reset());
            
            // Clear any error states
            document.querySelectorAll('.form__control--invalid').forEach(input => {
                input.classList.remove('form__control--invalid');
                input.setAttribute('aria-invalid', 'false');
            });
            document.querySelectorAll('.form__error').forEach(error => {
                error.textContent = '';
            });
            
            // Hide insurance age container
            const ageContainer = document.getElementById('insuranceAgeContainer');
            if (ageContainer) {
                ageContainer.style.display = 'none';
            }
            
            // Reset button states
            document.querySelectorAll('button[disabled]').forEach(button => {
                button.disabled = false;
            });
            
            // Go back to step 1
            goToStep(1);
            
            console.log('Quote flow restarted successfully');
        } catch (error) {
            console.error('Error restarting quote flow:', error);
        }
    }
}

// Step 1: Insurance Type Selection
function initializeStep1() {
    const step1Cards = document.querySelectorAll('#step1 .selection-card');
    
    step1Cards.forEach(card => {
        // Check if already initialized to prevent duplicate listeners
        if (!card.hasAttribute('data-initialized')) {
            card.setAttribute('data-initialized', 'true');
            card.addEventListener('click', selectInsuranceTypeHandler);
        }
    });
}

function selectInsuranceTypeHandler(event) {
    selectInsuranceType(event.currentTarget);
}

// Enhanced selectInsuranceType function
function selectInsuranceType(card) {
    if (!card.dataset.type || !card.dataset.name) {
        console.error('Invalid insurance type selection');
        return;
    }
    
    quoteData.insuranceType = card.dataset.type;
    quoteData.insuranceName = card.dataset.name;
    
    // Update the header display
    const currentTypeSpan = document.getElementById('currentInsuranceType');
    const restartIcon = document.getElementById('restartIcon');
    const typeSelector = document.getElementById('insuranceTypeSelector');
    
    if (currentTypeSpan) currentTypeSpan.textContent = quoteData.insuranceName;
    if (restartIcon) restartIcon.style.display = 'inline';
    if (typeSelector) {
        typeSelector.classList.add('quote-header__insurance-type--active');
        typeSelector.title = 'Click to restart quote';
    }
    
    updateSelection('#step1', card);

    if(isSkipGoogle){
        skipGoogleSteps();
        isSkipGoogle = false;
    }
    else {
        setTimeout(() => goToStep(2), 300);
    }
    
    // setTimeout(() => goToStep(2), 300);
}

// Step 2: Province Selection
function initializeStep2() {
    const step2Cards = document.querySelectorAll('#step2 .selection-card');
    
    step2Cards.forEach(card => {
        if (!card.hasAttribute('data-initialized')) {
            card.setAttribute('data-initialized', 'true');
            card.addEventListener('click', selectProvinceHandler);
        }
    });
}

function selectProvinceHandler(event) {
    selectProvince(event.currentTarget);
}

function selectProvince(card) {
    const province = card.dataset.province;
    
    if (province === 'ontario') {
        quoteData.province = 'ontario';
        quoteData.provinceName = 'Ontario';
        updateSelection('#step2', card);
        // setTimeout(() => goToStep(3), 300);

        //...
        if(isSkip){
            skipFewSteps();
            isSkip = false;
        }
        else {
            setTimeout(() => goToStep(3), 300);
        }

    } else if (province === 'other') {
        showModal();
    } else {
        console.error('Invalid province selection');
    }
}

// Step 3: Gender Selection
function initializeStep3() {
    const step3Cards = document.querySelectorAll('#step3 .selection-card');
    
    step3Cards.forEach(card => {
        if (!card.hasAttribute('data-initialized')) {
            card.setAttribute('data-initialized', 'true');
            card.addEventListener('click', selectGenderHandler);
        }
    });
}

function selectGenderHandler(event) {
    selectGender(event.currentTarget);
}

function selectGender(card) {
    const genderValue = card.dataset.gender;
    const titleElement = card.querySelector('.selection-card__title');
    
    if (!genderValue || !titleElement) {
        console.error('Invalid gender selection');
        return;
    }
    
    quoteData.gender = genderValue;
    quoteData.genderName = titleElement.textContent;
    
    updateSelection('#step3', card);
    setTimeout(() => goToStep(4), 300);
}

// Step 4: Tobacco Use
function initializeStep4() {
    const step4Cards = document.querySelectorAll('#step4 .selection-card');
    
    step4Cards.forEach(card => {
        if (!card.hasAttribute('data-initialized')) {
            card.setAttribute('data-initialized', 'true');
            card.addEventListener('click', selectTobaccoHandler);
        }
    });
}

function selectTobaccoHandler(event) {
    selectTobacco(event.currentTarget);
}

function selectTobacco(card) {
    const tobaccoValue = card.dataset.tobacco;
    const titleElement = card.querySelector('.selection-card__title');
    
    if (!tobaccoValue || !titleElement) {
        console.error('Invalid tobacco selection');
        return;
    }
    
    quoteData.tobacco = tobaccoValue;
    quoteData.tobaccoName = titleElement.textContent;
    
    updateSelection('#step4', card);
    setTimeout(() => goToStep(5), 300);
}

// Enhanced Step 5: Coverage & DOB with Simple Validation
function initializeStep5() {
    const coverageSelect = document.getElementById('coverageAmount');
    const dobInputs = [
        document.getElementById('dobDay'),
        document.getElementById('dobMonth'),
        document.getElementById('dobYear')
    ];
    const continueBtn = document.getElementById('step5Continue');
    const errorDiv = document.getElementById('dobError');
    
    if (!coverageSelect || !continueBtn || !errorDiv || dobInputs.some(input => !input)) {
        console.error('Step 5 elements not found');
        return;
    }
    
    // Check if already initialized to prevent duplicate listeners
    if (continueBtn.hasAttribute('data-initialized')) {
        return;
    }
    continueBtn.setAttribute('data-initialized', 'true');
    
    // Validation constants
    const CURRENT_YEAR = new Date().getFullYear();
    const MAX_AGE = 100;
    const MIN_AGE = 1;
    
    // Simple validation functions
    function validateDay(value) {
        if (!value) return { valid: false, error: 'Please enter day' };
        if (value.length !== 2) return { valid: false, error: 'Day must be 2 digits' };
        const day = parseInt(value, 10);
        if (isNaN(day) || day < 1 || day > 31) return { valid: false, error: 'Day must be between 01 and 31' };
        return { valid: true, error: '' };
    }
    
    function validateMonth(value) {
        if (!value) return { valid: false, error: 'Please enter month' };
        if (value.length !== 2) return { valid: false, error: 'Month must be 2 digits' };
        const month = parseInt(value, 10);
        if (isNaN(month) || month < 1 || month > 12) return { valid: false, error: 'Month must be between 01 and 12' };
        return { valid: true, error: '' };
    }
    
    function validateYear(value) {
        if (!value) return { valid: false, error: 'Please enter year' };
        if (value.length !== 4) return { valid: false, error: 'Year must be 4 digits' };
        const year = parseInt(value, 10);
        const age = CURRENT_YEAR - year;
        
        if (isNaN(year)) return { valid: false, error: 'Please enter a valid year' };
        if (year > CURRENT_YEAR) return { valid: false, error: 'Birth year cannot be in the future' };
        if (age > MAX_AGE) return { valid: false, error: `Age cannot be more than ${MAX_AGE} years` };
        if (age < MIN_AGE) return { valid: false, error: `Age must be at least ${MIN_AGE} year` };
        
        return { valid: true, error: '' };
    }
    
    function showError(input, message) {
        input.classList.add('form__control--invalid');
        input.setAttribute('aria-invalid', 'true');
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
    
    function clearError(input) {
        input.classList.remove('form__control--invalid');
        input.setAttribute('aria-invalid', 'false');
        errorDiv.textContent = '';
    }
    
    function clearAllErrors() {
        dobInputs.forEach(input => {
            input.classList.remove('form__control--invalid');
            input.setAttribute('aria-invalid', 'false');
        });
        errorDiv.textContent = '';
    }
    
    function calculateInsuranceAge(day, month, year) {
        try {
            const today = new Date();
            const birthDate = new Date(year, month - 1, day);
            let age = today.getFullYear() - year;
           

            const monthDifference = today.getMonth() - month;

            // Adjust age if the birthday hasn't occurred yet this year
            if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < day)) {
                age--;
            }

            const monthsToNextBirthday = (month - 1 - today.getMonth() + 12) % 12;
           

            if (monthsToNextBirthday > 6) {
                return age;
            } else {
                return age + 1;
            }
        } catch (error) {
            console.error('Error calculating insurance age:', error);
            return null;
        }
    }
    
    function updateValidation() {
        const day = dobInputs[0].value;
        const month = dobInputs[1].value;
        const year = dobInputs[2].value;
        const coverage = coverageSelect.value;
        
        clearAllErrors();
        
        let isValid = true;
        
        // Validate day
        if (day) {
            const dayResult = validateDay(day);
            if (!dayResult.valid) {
                showError(dobInputs[0], dayResult.error);
                isValid = false;
            }
        }
        
        // Validate month
        if (month) {
            const monthResult = validateMonth(month);
            if (!monthResult.valid) {
                showError(dobInputs[1], monthResult.error);
                isValid = false;
            }
        }
        
        // Validate year
        if (year) {
            const yearResult = validateYear(year);
            if (!yearResult.valid) {
                showError(dobInputs[2], yearResult.error);
                isValid = false;
            }
        }
        
        // Show insurance age if all fields are valid and filled
        const ageContainer = document.getElementById('insuranceAgeContainer');
        const ageDisplay = document.getElementById('insuranceAge');
        
        if (day && month && year && day.length === 2 && month.length === 2 && year.length === 4 && isValid) {
            const insuranceAge = calculateInsuranceAge(parseInt(day, 10), parseInt(month, 10), parseInt(year, 10));
            if (insuranceAge !== null && ageDisplay && ageContainer) {
                ageDisplay.textContent = insuranceAge;
                ageContainer.style.display = 'block';
            }
        } else if (ageContainer) {
            ageContainer.style.display = 'none';
        }
        
        // Enable/disable continue button
        const allFilled = coverage && day && month && year && day.length === 2 && month.length === 2 && year.length === 4;
        continueBtn.disabled = !(allFilled && isValid);
    }
    
    // Event listeners - using simple approach to avoid duplication
    coverageSelect.addEventListener('change', updateValidation);
    
    dobInputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Auto-advance to next field
            if (this.value.length === parseInt(this.maxLength) && index < 2) {
                dobInputs[index + 1].focus();
            }
            
            updateValidation();
        });
        
        input.addEventListener('blur', updateValidation);
        
        // Handle backspace navigation
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                dobInputs[index - 1].focus();
            }
        });
    });
    
    // Continue button
    continueBtn.addEventListener('click', () => {
        if (!coverageSelect.value) {
            coverageSelect.focus();
            return;
        }
        
        updateValidation();
        if (!continueBtn.disabled) {
            quoteData.coverage = coverageSelect.value;
            quoteData.dob = {
                day: dobInputs[0].value,
                month: dobInputs[1].value,
                year: dobInputs[2].value
            };
            goToStep(6);
        }
    });
    
    // Initial validation
    updateValidation();
}

// Step 6: Contact Details with Country Code
function initializeStep6() {
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const countryCodeSelect = document.getElementById('countryCode');
    const submitBtn = document.getElementById('step6Submit');
    const privacyToggle = document.getElementById('privacyToggle');
    const privacyDetails = document.getElementById('privacyDetails');
    const whatsappToggle = document.getElementById('whatsappToggle');
    
    if (!nameInput || !emailInput || !phoneInput || !submitBtn) {
        console.error('Step 6 elements not found');
        return;
    }
    
    // Check if already initialized to prevent duplicate listeners
    if (submitBtn.hasAttribute('data-initialized')) {
        return;
    }
    submitBtn.setAttribute('data-initialized', 'true');
    
    let isSubmitting = false;
    let whatsappEnabled = false;
    
    // Track if fields have been touched
    let fieldsTouched = {
        name: false,
        email: false,
        phone: false
    };
    
    // Phone formatting patterns
    const phonePatterns = {
        '+1': { pattern: [3, 3, 4], format: '($1) $2-$3', placeholder: '(123) 456-7890' },
        '+44': { pattern: [2, 4, 4], format: '$1 $2 $3', placeholder: '20 1234 5678' },
        '+61': { pattern: [1, 4, 4], format: '$1 $2 $3', placeholder: '2 1234 5678' },
        '+91': { pattern: [5, 5], format: '$1 $2', placeholder: '98765 43210' },
        '+86': { pattern: [3, 4, 4], format: '$1 $2 $3', placeholder: '138 1234 5678' },
        '+81': { pattern: [2, 4, 4], format: '$1 $2 $3', placeholder: '90 1234 5678' },
        '+49': { pattern: [3, 4, 4], format: '$1 $2 $3', placeholder: '151 1234 5678' },
        '+33': { pattern: [1, 2, 2, 2, 2], format: '$1 $2 $3 $4 $5', placeholder: '6 12 34 56 78' },
        '+39': { pattern: [3, 7], format: '$1 $2', placeholder: '333 1234567' },
        '+34': { pattern: [3, 3, 3], format: '$1 $2 $3', placeholder: '612 345 678' },
        '+55': { pattern: [2, 5, 4], format: '$1 $2 $3', placeholder: '11 12345 6789' },
        '+52': { pattern: [3, 3, 4], format: '$1 $2 $3', placeholder: '555 123 4567' },
        '+82': { pattern: [2, 4, 4], format: '$1 $2 $3', placeholder: '10 1234 5678' },
        '+31': { pattern: [2, 4, 3], format: '$1 $2 $3', placeholder: '61 2345 678' },
        '+46': { pattern: [2, 3, 4], format: '$1 $2 $3', placeholder: '70 123 45 67' },
        '+47': { pattern: [2, 2, 2, 2], format: '$1 $2 $3 $4', placeholder: '12 34 56 78' },
        '+48': { pattern: [3, 3, 3], format: '$1 $2 $3', placeholder: '501 234 567' },
        '+65': { pattern: [4, 4], format: '$1 $2', placeholder: '1234 5678' },
        '+971': { pattern: [2, 7], format: '$1 $2', placeholder: '50 1234567' }
    };
    
    // Privacy accordion
    if (privacyToggle && privacyDetails) {
        privacyToggle.addEventListener('click', function() {
            const isOpen = privacyDetails.classList.contains('privacy-details--open');
            if (isOpen) {
                privacyDetails.classList.remove('privacy-details--open');
                privacyToggle.setAttribute('aria-expanded', 'false');
                privacyDetails.setAttribute('aria-hidden', 'true');
            } else {
                privacyDetails.classList.add('privacy-details--open');
                privacyToggle.setAttribute('aria-expanded', 'true');
                privacyDetails.setAttribute('aria-hidden', 'false');
            }
        });
    }
    
    // WhatsApp toggle
    if (whatsappToggle) {
        whatsappToggle.addEventListener('click', function() {
            whatsappEnabled = !whatsappEnabled;
            whatsappToggle.classList.toggle('toggle-switch--active', whatsappEnabled);
            whatsappToggle.setAttribute('aria-checked', whatsappEnabled.toString());
        });
    }
    
    // Validation functions
    function validateName(showError = true) {
        const name = nameInput.value.trim();
        const nameError = document.getElementById('nameError');
        
        if (!name) {
            if (showError && fieldsTouched.name && nameError) {
                nameError.textContent = 'Please enter your full name';
                nameInput.classList.add('form__control--invalid');
                nameInput.setAttribute('aria-invalid', 'true');
            }
            return false;
        }
        
        if (name.length < 2) {
            if (showError && fieldsTouched.name && nameError) {
                nameError.textContent = 'Name must be at least 2 characters';
                nameInput.classList.add('form__control--invalid');
                nameInput.setAttribute('aria-invalid', 'true');
            }
            return false;
        }
        
        const namePattern = /^[a-zA-Z\s\-']+$/;
        if (!namePattern.test(name)) {
            if (showError && fieldsTouched.name && nameError) {
                nameError.textContent = 'Please enter a valid name (letters only)';
                nameInput.classList.add('form__control--invalid');
                nameInput.setAttribute('aria-invalid', 'true');
            }
            return false;
        }
        
        if (nameError) nameError.textContent = '';
        nameInput.classList.remove('form__control--invalid');
        nameInput.setAttribute('aria-invalid', 'false');
        return true;
    }
    
    function validateEmail(showError = true) {
        const email = emailInput.value.trim();
        const emailError = document.getElementById('emailError');
        
        if (!email) {
            if (showError && fieldsTouched.email && emailError) {
                emailError.textContent = 'Please enter your email address';
                emailInput.classList.add('form__control--invalid');
                emailInput.setAttribute('aria-invalid', 'true');
            }
            return false;
        }
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            if (showError && fieldsTouched.email && emailError) {
                emailError.textContent = 'Please enter a valid email address';
                emailInput.classList.add('form__control--invalid');
                emailInput.setAttribute('aria-invalid', 'true');
            }
            return false;
        }
        
        if (emailError) emailError.textContent = '';
        emailInput.classList.remove('form__control--invalid');
        emailInput.setAttribute('aria-invalid', 'false');
        return true;
    }
    
    function validatePhone(showError = true) {
        const phoneRaw = phoneInput.value.trim();
        const phone = phoneRaw.replace(/\D/g, '');
        const countryCode = countryCodeSelect ? countryCodeSelect.value : '+1';
        const phoneError = document.getElementById('phoneError');
        
        if (!phoneRaw) {
            if (showError && fieldsTouched.phone && phoneError) {
                phoneError.textContent = 'Please enter your phone number';
                phoneInput.classList.add('form__control--invalid');
                phoneInput.setAttribute('aria-invalid', 'true');
            }
            return false;
        }
        
        let isValid = false;
        let minLength, maxLength;
        
        if (countryCode === '+1') {
            minLength = maxLength = 10;
            if (phone.length === 10) {
                const areaCode = phone.substring(0, 3);
                const invalidAreaCodes = ['000', '111', '555', '911'];
                
                if (invalidAreaCodes.includes(areaCode) || areaCode[0] === '0' || areaCode[0] === '1') {
                    if (showError && fieldsTouched.phone && phoneError) {
                        phoneError.textContent = 'Please enter a valid area code';
                        phoneInput.classList.add('form__control--invalid');
                        phoneInput.setAttribute('aria-invalid', 'true');
                    }
                    return false;
                }
                isValid = true;
            }
        } else {
            minLength = 7;
            maxLength = 15;
            isValid = phone.length >= minLength && phone.length <= maxLength;
        }
        
        if (!isValid) {
            if (showError && fieldsTouched.phone && phoneError) {
                if (phone.length < minLength) {
                    phoneError.textContent = `Phone number is too short (${minLength - phone.length} more digits needed)`;
                } else {
                    phoneError.textContent = 'Phone number is too long';
                }
                phoneInput.classList.add('form__control--invalid');
                phoneInput.setAttribute('aria-invalid', 'true');
            }
            return false;
        }
        
        if (phoneError) phoneError.textContent = '';
        phoneInput.classList.remove('form__control--invalid');
        phoneInput.setAttribute('aria-invalid', 'false');
        return true;
    }
    
    function validateStep6() {
        const isValid = validateName(false) && validateEmail(false) && validatePhone(false);
        submitBtn.disabled = !isValid || isSubmitting;
        return isValid;
    }
    
    // Format phone number based on country
    function formatPhoneNumber(digits, countryCode) {
        if (countryCode === '+1') {
            if (digits.length <= 3) {
                return `(${digits}`;
            } else if (digits.length <= 6) {
                return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
            } else {
                return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6,10)}`;
            }
        } else {
            const pattern = phonePatterns[countryCode] || phonePatterns['+1'];
            let result = '';
            let position = 0;
            
            for (let i = 0; i < pattern.pattern.length && position < digits.length; i++) {
                const groupSize = pattern.pattern[i];
                const group = digits.slice(position, position + groupSize);
                if (group) {
                    if (result) result += ' ';
                    result += group;
                }
                position += groupSize;
            }
            
            return result;
        }
    }
    
    // Event listeners
    nameInput.addEventListener('blur', function() {
        fieldsTouched.name = true;
        validateName();
    });
    
    emailInput.addEventListener('blur', function() {
        fieldsTouched.email = true;
        validateEmail();
    });
    
    phoneInput.addEventListener('blur', function() {
        fieldsTouched.phone = true;
        validatePhone();
    });
    
    nameInput.addEventListener('input', function() {
        if (fieldsTouched.name) validateName();
        validateStep6();
    });
    
    emailInput.addEventListener('input', function() {
        if (fieldsTouched.email) validateEmail();
        validateStep6();
    });
    
    phoneInput.addEventListener('input', function() {
        const digits = this.value.replace(/\D/g, '');
        const formatted = formatPhoneNumber(digits, countryCodeSelect ? countryCodeSelect.value : '+1');
        
        this.value = formatted;
        
        if (fieldsTouched.phone) validatePhone();
        validateStep6();
    });
    
    if (countryCodeSelect) {
        countryCodeSelect.addEventListener('change', function() {
            const pattern = phonePatterns[this.value] || phonePatterns['+1'];
            phoneInput.placeholder = pattern.placeholder;
            
            const digits = phoneInput.value.replace(/\D/g, '');
            phoneInput.value = formatPhoneNumber(digits, this.value);
            
            if (fieldsTouched.phone) validatePhone();
            validateStep6();
        });
    }
    
    submitBtn.addEventListener('click', function() {
        fieldsTouched.name = fieldsTouched.email = fieldsTouched.phone = true;
        
        if (!validateName() || !validateEmail() || !validatePhone()) {
            if (!validateName(false)) nameInput.focus();
            else if (!validateEmail(false)) emailInput.focus();
            else if (!validatePhone(false)) phoneInput.focus();
            return;
        }
        
        if (isSubmitting) return;
        isSubmitting = true;
        
        quoteData.name = nameInput.value.trim();
        quoteData.email = emailInput.value.trim();
        quoteData.phone = (countryCodeSelect ? countryCodeSelect.value : '+1') + ' ' + phoneInput.value.trim();
        quoteData.whatsappEnabled = whatsappEnabled;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showFinalQuestions();
            isSubmitting = false;
            submitBtn.innerHTML = 'Get My Quotes';

            sendRequest(quoteData);
        }, 1500);
    });
    
    // Initial validation
    validateStep6();
}

// Final Questions System
function showFinalQuestions() {
    currentQuestion = 1;
    updateFinalQuestionsModal();
    
    const modal = document.getElementById('finalQuestionsModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Clear any existing initialization flags for final questions modal content
        const modalCards = document.querySelectorAll('#finalQuestionsModal .selection-card');
        const continueBtn = document.getElementById('finalQuestionsContinue');
        
        modalCards.forEach(card => {
            card.removeAttribute('data-initialized');
        });
        
        if (continueBtn) {
            continueBtn.removeAttribute('data-initialized');
        }
        
        initializeFinalQuestions();
    }
}

function initializeFinalQuestions() {
    const modalCards = document.querySelectorAll('#finalQuestionsModal .selection-card');
    const continueBtn = document.getElementById('finalQuestionsContinue');
    
    modalCards.forEach(card => {
        if (!card.hasAttribute('data-initialized')) {
            card.setAttribute('data-initialized', 'true');
            card.addEventListener('click', selectFinalAnswerHandler);
        }
    });
    
    if (continueBtn && !continueBtn.hasAttribute('data-initialized')) {
        continueBtn.setAttribute('data-initialized', 'true');
        continueBtn.addEventListener('click', finalContinueHandler);
    }
}

function selectFinalAnswerHandler(event) {
    selectFinalAnswer(event.currentTarget);
}

function finalContinueHandler() {
    if (currentQuestion === 1) {
        goToNextQuestion();
    } else {
        showFinalSuccess();
    }
}

function selectFinalAnswer(card) {
    const answer = card.dataset.answer;
    
    if (currentQuestion === 1) {
        quoteData.medicationAnswer = answer;
    } else {
        quoteData.impairedAnswer = answer;
    }
    
    document.querySelectorAll('#finalQuestionsModal .selection-card').forEach(c => {
        c.classList.remove('selection-card--selected');
        c.setAttribute('aria-checked', 'false');
    });
    card.classList.add('selection-card--selected');
    card.setAttribute('aria-checked', 'true');
    
    const continueBtn = document.getElementById('finalQuestionsContinue');
    if (continueBtn) continueBtn.disabled = false;
    
    // Auto-advance to next question for question 1
    if (currentQuestion === 1) {
        setTimeout(() => {
            goToNextQuestion();
        }, 500);
    }
}

function goToNextQuestion() {
    currentQuestion = 2;
    updateFinalQuestionsModal();
    
    // Clear previous selections for question 2
    document.querySelectorAll('#finalQuestionsModal .selection-card').forEach(card => {
        card.classList.remove('selection-card--selected');
        card.setAttribute('aria-checked', 'false');
    });
}

function goToPreviousQuestion() {
    currentQuestion = 1;
    updateFinalQuestionsModal();
    
    // Clear second question selection and restore first question selection
    document.querySelectorAll('#finalQuestionsModal .selection-card').forEach(card => {
        card.classList.remove('selection-card--selected');
        card.setAttribute('aria-checked', 'false');
    });
    
    if (quoteData.medicationAnswer) {
        const firstQuestionCard = document.querySelector(`#finalQuestionsModal .selection-card[data-answer="${quoteData.medicationAnswer}"]`);
        if (firstQuestionCard) {
            firstQuestionCard.classList.add('selection-card--selected');
            firstQuestionCard.setAttribute('aria-checked', 'true');
        }
    }
}

function updateFinalQuestionsModal() {
    const progressText = document.getElementById('finalQuestionsProgress');
    const questionText = document.getElementById('questionText');
    const backBtn = document.getElementById('finalQuestionsBack');
    const continueBtn = document.getElementById('finalQuestionsContinue');
    
    if (!progressText || !questionText) return;
    
    if (currentQuestion === 1) {
        progressText.textContent = 'Question 1 of 2';
        questionText.textContent = 'Do you take medication for high blood pressure or cholesterol?';
        if (backBtn) backBtn.style.display = 'none';
        if (continueBtn) continueBtn.style.display = 'none';
    } else {
        progressText.textContent = 'Question 2 of 2';
        questionText.textContent = 'In the past 5 years, have you been charged with driving under the influence of alcohol or drugs?';
        if (backBtn) backBtn.style.display = 'inline-flex';
        if (continueBtn) {
            continueBtn.style.display = 'inline-flex';
            continueBtn.innerHTML = 'Show My Quotes';
            continueBtn.disabled = true;
        }
    }
}

function showFinalSuccess() {

    //...
    redirectTo(quoteData.medicationAnswer, quoteData.impairedAnswer);

    // const modal = document.getElementById('finalQuestionsModal');
    // const modalCard = modal ? modal.querySelector('.final-questions-card') : null;
    
    // if (modalCard) {
    //     modalCard.innerHTML = `
    //         <div class="success-content">
    //             <div class="success-icon">
    //                 <i class="fas fa-check"></i>
    //             </div>
    //             <h3 class="success-title">Your Quotes Are Ready!</h3>
    //             <p class="success-subtitle">We'll email your personalized quotes within the next few minutes.</p>
    //             <button type="button" class="button button--primary" onclick="closeFinalQuestions()">
    //                 Close
    //             </button>
    //         </div>
    //     `;
    // }
}

function closeFinalQuestions() {
    const modal = document.getElementById('finalQuestionsModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

// Exit Intent System
function initializeExitIntent() {
    // Prevent duplicate initialization
    if (document.body.hasAttribute('data-exit-intent-initialized')) {
        return;
    }
    document.body.setAttribute('data-exit-intent-initialized', 'true');
    
    let exitIntentHandler = function(e) {
        if (e.clientY <= 0 && !exitIntentShown && currentStep < 6) {
            showExitIntent();
        }
    };
    
    document.addEventListener('mouseleave', exitIntentHandler);
}

function showExitIntent() {
    exitIntentShown = true;
    
    const stepsRemaining = 6 - currentStep;
    const stepText = stepsRemaining === 1 ? '1 step remaining' : `${stepsRemaining} steps remaining`;
    
    // Update the meta text with current progress
    const subtitleElement = document.getElementById('exitIntentSubtitle');
    if (subtitleElement) {
        subtitleElement.textContent = stepText;
    }
    
    const modal = document.getElementById('exitIntentModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function continueQuote() {
    closeExitIntent();
}

function closeExitIntent() {
    const modal = document.getElementById('exitIntentModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

// Helper Functions
function updateSelection(stepSelector, selectedCard) {
    try {
        document.querySelectorAll(`${stepSelector} .selection-card`).forEach(card => {
            card.classList.remove('selection-card--selected');
            card.setAttribute('aria-checked', 'false');
        });
        selectedCard.classList.add('selection-card--selected');
        selectedCard.setAttribute('aria-checked', 'true');
    } catch (error) {
        console.error('Error updating selection:', error);
    }
}

// Enhanced goToStep function with restart icon management
function goToStep(stepNumber) {
    try {
        // Validate step number
        if (stepNumber < 1 || stepNumber > 6) {
            console.error('Invalid step number:', stepNumber);
            return;
        }
        
        document.querySelectorAll('.quote-step').forEach(step => {
            step.classList.remove('quote-step--active');
        });
        
        const targetStep = document.getElementById(`step${stepNumber}`);
        if (targetStep) {
            targetStep.classList.add('quote-step--active');
            currentStep = stepNumber;
            updateProgress();
            
            // Manage restart icon visibility
            const restartIcon = document.getElementById('restartIcon');
            const typeSelector = document.getElementById('insuranceTypeSelector');
            
            if (stepNumber === 1) {
                // On step 1, hide restart icon if no insurance type is selected
                if (!quoteData.insuranceType) {
                    if (restartIcon) restartIcon.style.display = 'none';
                    if (typeSelector) {
                        typeSelector.classList.remove('quote-header__insurance-type--active');
                        typeSelector.removeAttribute('title');
                    }
                }
            } else {
                // On other steps, ensure restart icon is visible if insurance type is selected
                if (quoteData.insuranceType) {
                    if (restartIcon) restartIcon.style.display = 'inline';
                    if (typeSelector) {
                        typeSelector.classList.add('quote-header__insurance-type--active');
                        typeSelector.title = 'Click to restart quote';
                    }
                }
            }
        } else {
            console.error('Step element not found:', `step${stepNumber}`);
        }
    } catch (error) {
        console.error('Error navigating to step:', error);
    }
}

// Enhanced updateProgress function
function updateProgress() {
    try {
        const progressText = document.getElementById('progressText');
        const progressBar = document.getElementById('progressBar');
        
        if (progressText) {
            progressText.textContent = `Step ${currentStep} of 6`;
        }
        
        if (progressBar) {
            const percentage = (currentStep / 6) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// Modal Functions
function showModal() {
    const modal = document.getElementById('otherProvinceModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('show'), 10);
    }
}

function closeModal() {
    const modal = document.getElementById('otherProvinceModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = 'none', 300);
    }
}

function scheduleCall() {
    alert('Schedule Call - would integrate with booking system');
    closeModal();
}

function getNotified() {
    alert('Get Notified - would show email capture form');
    closeModal();
}






function skipFewSteps(){
    
    //...
    quoteData.gender = i_gender;
    quoteData.genderName = i_gender=='M'?'Male':'Female';

    //...
    quoteData.tobacco = i_smoking;
    quoteData.tobaccoName = i_smoking=='Y'?'Yes':'No';

    //...
    quoteData.coverage = i_coverage;

    quoteData.dob = {
        day: i_dobDay,
        month: i_dobMonth,
        year: i_dobYear
    };

    //console.log('6', quoteData) 
    setTimeout(() => goToStep(6), 300);
}


function skipGoogleSteps(){
    
    //...
    quoteData.province = 'ontario';
    quoteData.provinceName = 'Ontario';

    //...
    quoteData.gender = i_gender;
    quoteData.genderName = i_gender=='M'?'Male':'Female';

    //...
    quoteData.tobacco = i_smoking;
    quoteData.tobaccoName = i_smoking=='Y'?'Yes':'No';

    //console.log('6', quoteData) 
    setTimeout(() => goToStep(5), 300);
}

