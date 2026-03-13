// ==========================================================================
// MULTI-STEP MODAL COMPONENT JAVASCRIPT - UPDATED WITH PROVINCE SELECTION
// PolicyScanner Life Insurance Comparison Modal
// ==========================================================================

// ==========================================================================
// STATE MANAGEMENT
// ==========================================================================

let currentStep = 1;
const totalSteps = 5; // Updated to 5 steps
const formData = {};

const stepTitles = {
    1: { title: "Let's get you the most accurate results", subtitle: "Let me reconfirm your coverage amount and DOB" },
    2: { title: "Where are you located?", subtitle: "We need to know your province to find the right coverage" },
    3: { title: "Quick health question", subtitle: "This helps us find the most accurate rates for you" },
    4: { title: "Just one more question", subtitle: "We're almost done personalizing your quotes" },
    5: { title: "Your life insurance options are ready", subtitle: "We'll show you the best plans and help you choose" }
};

// ==========================================================================
// MODAL CONTROLS
// ==========================================================================

function openModal() {
    document.getElementById('comparisonModal').classList.add('modal--active');
    currentStep = 1;
    updateStepDisplay();
    updateProgressIndicator();
    validateCurrentStep();
}

function closeModal() {
    document.getElementById('comparisonModal').classList.remove('modal--active');
    resetForm();
}

function closeProvinceModal() {
    document.getElementById('provinceNotAvailableModal').classList.remove('modal--active');
    // Reset province selection
    document.querySelectorAll('input[name="province"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('.radio-option').forEach(option => {
        if (option.querySelector('input[name="province"]')) {
            option.classList.remove('radio-option--selected');
        }
    });
    validateCurrentStep();
}

function scheduleCall() {
    // In a real implementation, this would open a calendar booking widget
    // For now, we'll show an alert and provide contact information
    // alert('Thank you for your interest! Please call us at 1-800-POLICY or email info@policyscanner.ca to schedule your consultation with a licensed agent.');
    closeProvinceModal();
    closeModal();
}

function resetForm() {
    currentStep = 1;
    
    // Clear all form fields
    document.getElementById('coverage').value = '';
    document.getElementById('dobMonth').value = '';
    document.getElementById('dobDay').value = '';
    document.getElementById('dobYear').value = '';
    document.getElementById('fullName').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phoneCountry').value = '+1';
    document.getElementById('phone').value = '';
    
    // Clear radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    document.querySelectorAll('.radio-option').forEach(option => {
        option.classList.remove('radio-option--selected');
    });
    
    // Clear all errors and touched states
    clearDateErrors();
    document.querySelectorAll('.form__control').forEach(input => {
        input.classList.remove('form__control--error');
        delete input.dataset.touched; // Clear touched state
    });
    document.querySelectorAll('.form__error').forEach(error => {
        error.style.display = 'none';
    });
    document.getElementById('insuranceAgeInfo').style.display = 'none';
    
    updateStepDisplay();
    updateProgressIndicator();
}

// ==========================================================================
// STEP NAVIGATION
// ==========================================================================

function nextStep() {
    if (!validateCurrentStep()) return;
    
    saveCurrentStepData();
    
    if (currentStep < totalSteps) {
        currentStep++;
        updateStepDisplay();
        updateProgressIndicator();
        validateCurrentStep();
    } else {
        submitForm();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        updateProgressIndicator();
        validateCurrentStep();
    }
}

function updateStepDisplay() {
    // Hide all steps
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('step--active');
    });
    
    // Show current step
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('step--active');
    
    // Show/hide modal header based on step
    const modalHeader = document.querySelector('.modal__header');
    const agentGreeting = document.getElementById('agentGreeting');
    
    if (currentStep === 5) { // Updated to step 5
        // Step 5 has its own custom header
        modalHeader.style.display = 'none';
    } else {
        modalHeader.style.display = 'block';
        
        // Show Teena's avatar on ALL steps for consistency
        agentGreeting.style.display = 'block';
        
        // Update titles for other steps
        const titleData = stepTitles[currentStep];
        document.getElementById('modalTitle').textContent = titleData.title;
        document.getElementById('modalSubtitle').textContent = titleData.subtitle;
    }
    
    // Update back button
    const backBtn = document.getElementById('backBtn');
    backBtn.style.display = currentStep > 1 ? 'inline-flex' : 'none';
    
    // Update continue button
    const continueBtn = document.getElementById('continueBtn');
    if (currentStep === 2 || currentStep === 3 || currentStep === 4) { // Updated step numbers
        continueBtn.style.display = 'none';
    } else {
        continueBtn.style.display = 'flex';
        continueBtn.textContent = currentStep === totalSteps ? 'Get My Quotes' : 'Continue';
    }
}

function updateProgressIndicator() {
    document.querySelectorAll('.modal__progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('modal__progress-step--active', 'modal__progress-step--completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('modal__progress-step--completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('modal__progress-step--active');
        }
    });
}

// ==========================================================================
// VALIDATION SYSTEM - Enhanced but Simple
// ==========================================================================

function validateCurrentStep() {
    let isValid = false;
    
    switch (currentStep) {
        case 1:
            isValid = validateStep1();
            break;
        case 2:
            isValid = validateStep2(); // New province validation
            break;
        case 3:
            isValid = validateStep3(); // Was validateStep2
            break;
        case 4:
            isValid = validateStep4(); // Was validateStep3
            break;
        case 5:
            isValid = validateStep5(); // Was validateStep4
            break;
    }
    
    document.getElementById('continueBtn').disabled = !isValid;
    return isValid;
}

function validateStep1() {
    const coverage = document.getElementById('coverage').value;
    const month = document.getElementById('dobMonth').value;
    const day = document.getElementById('dobDay').value;
    const year = document.getElementById('dobYear').value;
    
    const hasErrors = document.querySelector('.form__control--error') !== null || 
                    document.getElementById('dateError').style.display === 'block';
    
    return coverage !== '' && month !== '' && day !== '' && year !== '' && 
           !hasErrors && isValidDate(month, day, year);
}

function validateStep2() {
    return document.querySelector('input[name="province"]:checked') !== null;
}

function validateStep3() {
    return document.querySelector('input[name="medication"]:checked') !== null;
}

function validateStep4() {
    return document.querySelector('input[name="dui"]:checked') !== null;
}

function validateStep5() {
    // Just check if fields are valid without showing errors
    // Errors will be shown only when user interacts with fields
    const nameValid = isNameValid();
    const emailValid = isEmailValid();
    const phoneValid = isPhoneValid();
    
    return nameValid && emailValid && phoneValid;
}

// ==========================================================================
// FIELD VALIDATION FUNCTIONS - Only Show Errors When User Makes Mistakes
// ==========================================================================

// Silent validation functions (no error display)
function isNameValid() {
    const name = document.getElementById('fullName').value.trim();
    
    if (!name || name.length < 2 || name.length > 100) return false;
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(name)) return false;
    if (!/[a-zA-ZÀ-ÿ]/.test(name)) return false;
    if (!name.includes(' ')) return false;
    if (/\s{2,}/.test(name)) return false;
    
    return true;
}

function isEmailValid() {
    const email = document.getElementById('email').value.trim().toLowerCase();
    
    if (!email || email.length > 254) return false;
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

function isPhoneValid() {
    const phone = document.getElementById('phone').value;
    const cleaned = cleanPhone(phone);
    
    if (!cleaned) return false;
    
    let phoneToValidate = cleaned;
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        phoneToValidate = cleaned.substring(1);
    }
    
    if (phoneToValidate.length !== 10) return false;
    if (phoneToValidate[0] < '2') return false;
    if (phoneToValidate[3] < '2') return false;
    if (phoneToValidate === '5555555555' || phoneToValidate === '1234567890') return false;
    if (/^(\d)\1{9}$/.test(phoneToValidate)) return false;
    
    return true;
}

// Validation functions that show errors (only called on blur or when needed)
function validateName() {
    const nameInput = document.getElementById('fullName');
    const nameError = document.getElementById('nameError');
    const name = nameInput.value.trim();
    
    // Clear previous error
    nameInput.classList.remove('form__control--error');
    nameError.style.display = 'none';
    
    // Only validate if user has started typing
    if (!name && !nameInput.dataset.touched) {
        return true; // Don't show error for empty untouched field
    }
    
    if (!name) {
        showFieldError(nameInput, nameError, 'Please enter your full name');
        return false;
    }
    
    if (name.length < 2) {
        showFieldError(nameInput, nameError, 'Name must be at least 2 characters');
        return false;
    }
    
    if (name.length > 100) {
        showFieldError(nameInput, nameError, 'Name must be less than 100 characters');
        return false;
    }
    
    // Only letters, spaces, hyphens, apostrophes
    if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(name)) {
        showFieldError(nameInput, nameError, 'Name can only contain letters, spaces, hyphens, and apostrophes');
        return false;
    }
    
    // Must contain at least one letter
    if (!/[a-zA-ZÀ-ÿ]/.test(name)) {
        showFieldError(nameInput, nameError, 'Name must contain at least one letter');
        return false;
    }
    
    // Should have first and last name
    if (!name.includes(' ')) {
        showFieldError(nameInput, nameError, 'Please enter your first and last name');
        return false;
    }
    
    // No consecutive spaces
    if (/\s{2,}/.test(name)) {
        showFieldError(nameInput, nameError, 'Please remove extra spaces');
        return false;
    }
    
    return true;
}

function validateEmail() {
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const email = emailInput.value.trim().toLowerCase();
    
    // Clear previous error
    emailInput.classList.remove('form__control--error');
    emailError.style.display = 'none';
    
    // Only validate if user has started typing
    if (!email && !emailInput.dataset.touched) {
        return true; // Don't show error for empty untouched field
    }
    
    if (!email) {
        showFieldError(emailInput, emailError, 'Please enter your email address');
        return false;
    }
    
    // Basic format validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
        if (!email.includes('@')) {
            showFieldError(emailInput, emailError, 'Email address is missing @');
        } else if (!email.includes('.')) {
            showFieldError(emailInput, emailError, 'Please include a domain (like @gmail.com)');
        } else {
            showFieldError(emailInput, emailError, 'Please enter a valid email address');
        }
        return false;
    }
    
    if (email.length > 254) {
        showFieldError(emailInput, emailError, 'Email address is too long');
        return false;
    }
    
    return true;
}

function validatePhone() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    const phone = phoneInput.value;
    
    // Clear previous error
    phoneInput.classList.remove('form__control--error');
    phoneError.style.display = 'none';
    
    const cleaned = cleanPhone(phone);
    
    // Only validate if user has started typing
    if (!cleaned && !phoneInput.dataset.touched) {
        return true; // Don't show error for empty untouched field
    }
    
    if (!cleaned) {
        showFieldError(phoneInput, phoneError, 'Please enter your phone number');
        return false;
    }
    
    // Handle country code
    let phoneToValidate = cleaned;
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
        phoneToValidate = cleaned.substring(1);
    }
    
    if (phoneToValidate.length !== 10) {
        showFieldError(phoneInput, phoneError, 'Phone number must be 10 digits');
        return false;
    }
    
    // Area code validation (first digit 2-9)
    if (phoneToValidate[0] < '2') {
        showFieldError(phoneInput, phoneError, 'Area code cannot start with 0 or 1');
        return false;
    }
    
    // Exchange code validation (4th digit 2-9)
    if (phoneToValidate[3] < '2') {
        showFieldError(phoneInput, phoneError, 'Invalid phone number format');
        return false;
    }
    
    // Check for obvious fake numbers
    if (phoneToValidate === '5555555555' || phoneToValidate === '1234567890') {
        showFieldError(phoneInput, phoneError, 'Please enter a real phone number');
        return false;
    }
    
    // Check for all same digits
    if (/^(\d)\1{9}$/.test(phoneToValidate)) {
        showFieldError(phoneInput, phoneError, 'Please enter a real phone number');
        return false;
    }
    
    return true;
}

// ==========================================================================
// HELPER FUNCTIONS
// ==========================================================================

function cleanPhone(phone) {
    return phone.replace(/\D/g, '');
}

function formatPhone(phone) {
    const cleaned = cleanPhone(phone);
    
    if (cleaned.length >= 10) {
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
    }
    
    return phone;
}

function showFieldError(input, errorElement, message) {
    input.classList.add('form__control--error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function saveCurrentStepData() {
    switch (currentStep) {
        case 1:
            formData.coverage = document.getElementById('coverage').value;
            formData.dobMonth = document.getElementById('dobMonth').value;
            formData.dobDay = document.getElementById('dobDay').value;
            formData.dobYear = document.getElementById('dobYear').value;
            break;
        case 2:
            const province = document.querySelector('input[name="province"]:checked');
            formData.province = province ? province.value : null;
            break;
        case 3:
            const medication = document.querySelector('input[name="medication"]:checked');
            formData.medication = medication ? medication.value : null;
            break;
        case 4:
            const dui = document.querySelector('input[name="dui"]:checked');
            formData.dui = dui ? dui.value : null;
            break;
        case 5:
            formData.fullName = document.getElementById('fullName').value.trim();
            formData.email = document.getElementById('email').value.trim().toLowerCase();
            formData.phoneCountry = document.getElementById('phoneCountry').value;
            // Save clean phone number (digits only)
            formData.phone = cleanPhone(document.getElementById('phone').value);
            break;
    }
}

// ==========================================================================
// DATE VALIDATION SYSTEM
// ==========================================================================

function validateDateInput(input, type) {
    let value = input.value.replace(/\D/g, '');
    
    if (type === 'month') {
        if (value.length > 0) {
            let month = parseInt(value);
            if (month > 12 || (month === 0 && value.length > 1)) {
                showDateError('Month must be between 01 and 12', input);
                return;
            }
            input.classList.remove('form__control--error');
        }
        if (value.length === 2) {
            document.getElementById('dobDay').focus();
        }
    } else if (type === 'day') {
        if (value.length > 0) {
            let day = parseInt(value);
            if (day > 31 || (day === 0 && value.length > 1)) {
                showDateError('Day must be between 01 and 31', input);
                return;
            }
            input.classList.remove('form__control--error');
        }
        if (value.length === 2) {
            document.getElementById('dobYear').focus();
        }
    } else if (type === 'year') {
        if (value.length === 4) {
            const currentYear = new Date().getFullYear();
            const minYear = currentYear - 90;
            let year = parseInt(value);
            
            if (year < minYear || year > currentYear) {
                showDateError(`Year must be between ${minYear} and ${currentYear}`, input);
                return;
            }
            input.classList.remove('form__control--error');
        }
    }
    
    input.value = value;
    
    // Check if all date fields are now valid
    setTimeout(() => {
        const month = document.getElementById('dobMonth').value;
        const day = document.getElementById('dobDay').value;
        const year = document.getElementById('dobYear').value;
        
        const hasErrors = document.querySelector('.form__control--error') !== null;
        const allFilled = month && day && year;
        const dateValid = allFilled && isValidDate(month, day, year);
        
        if (!hasErrors && dateValid) {
            clearDateErrors();
            calculateInsuranceAge();
        }
        
        validateCurrentStep();
    }, 10);
}

function showDateError(message, input) {
    const errorElement = document.getElementById('dateError');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    input.classList.add('form__control--error');
}

function clearDateErrors() {
    document.getElementById('dateError').style.display = 'none';
    document.querySelectorAll('.date-input').forEach(input => {
        input.classList.remove('form__control--error');
    });
}

function isValidDate(month, day, year) {
    if (!month || !day || !year) return false;
    
    const m = parseInt(month);
    const d = parseInt(day);
    const y = parseInt(year);
    
    if (m < 1 || m > 12 || d < 1 || d > 31) return false;
    
    const currentYear = new Date().getFullYear();
    if (y < currentYear - 90 || y > currentYear) return false;
    
    const date = new Date(y, m - 1, d);
    return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
}

function calculateInsuranceAge() {
    const month = document.getElementById('dobMonth').value;
    const day = document.getElementById('dobDay').value;
    const year = document.getElementById('dobYear').value;
    
    if (isValidDate(month, day, year)) {
        const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const today = new Date();
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        
        const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
        if (nextBirthday < today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
        
        const daysToBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
        const daysSinceBirthday = 365 - daysToBirthday;
        const insuranceAge = daysToBirthday <= daysSinceBirthday ? age + 1 : age;
        
        document.getElementById('insuranceAgeValue').textContent = insuranceAge;
        document.getElementById('insuranceAgeInfo').style.display = 'block';
    } else {
        document.getElementById('insuranceAgeInfo').style.display = 'none';
    }
}

// ==========================================================================
// EVENT HANDLERS
// ==========================================================================

function setupEventHandlers() {
    // Coverage dropdown
    document.getElementById('coverage').addEventListener('change', validateCurrentStep);
    
    // Date inputs
    document.getElementById('dobMonth').addEventListener('input', function() {
        validateDateInput(this, 'month');
    });
    
    document.getElementById('dobDay').addEventListener('input', function() {
        validateDateInput(this, 'day');
    });
    
    document.getElementById('dobYear').addEventListener('input', function() {
        validateDateInput(this, 'year');
    });
    
    // Contact form inputs with enhanced validation (Step 5)
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    // Name validation
    nameInput.addEventListener('input', function() {
        // Mark as touched when user starts typing
        this.dataset.touched = 'true';
        
        // Clear error while typing (don't validate until blur)
        const nameError = document.getElementById('nameError');
        if (this.classList.contains('form__control--error')) {
            this.classList.remove('form__control--error');
            nameError.style.display = 'none';
        }
        validateCurrentStep();
    });
    
    nameInput.addEventListener('blur', function() {
        // Only validate and show errors on blur (when user leaves field)
        this.dataset.touched = 'true';
        validateName();
        validateCurrentStep();
    });
    
    // Email validation  
    emailInput.addEventListener('input', function() {
        // Mark as touched when user starts typing
        this.dataset.touched = 'true';
        
        // Clear error while typing (don't validate until blur)
        const emailError = document.getElementById('emailError');
        if (this.classList.contains('form__control--error')) {
            this.classList.remove('form__control--error');
            emailError.style.display = 'none';
        }
        validateCurrentStep();
    });
    
    emailInput.addEventListener('blur', function() {
        // Only validate and show errors on blur (when user leaves field)
        this.dataset.touched = 'true';
        validateEmail();
        validateCurrentStep();
    });
    
    // Phone validation and auto-formatting
    phoneInput.addEventListener('input', function() {
        // Mark as touched when user starts typing
        this.dataset.touched = 'true';
        
        // Auto-format as user types
        const cursorPos = this.selectionStart;
        const oldLength = this.value.length;
        this.value = formatPhone(this.value);
        const newLength = this.value.length;
        
        // Adjust cursor position after formatting
        if (newLength > oldLength) {
            this.setSelectionRange(cursorPos + 1, cursorPos + 1);
        } else {
            this.setSelectionRange(cursorPos, cursorPos);
        }
        
        // Clear error while typing (don't validate until blur)
        const phoneError = document.getElementById('phoneError');
        if (this.classList.contains('form__control--error')) {
            this.classList.remove('form__control--error');
            phoneError.style.display = 'none';
        }
        validateCurrentStep();
    });
    
    phoneInput.addEventListener('blur', function() {
        // Only validate and show errors on blur (when user leaves field)
        this.dataset.touched = 'true';
        validatePhone();
        validateCurrentStep();
    });
    
    // Radio button handling - Updated for province selection
    document.addEventListener('click', function(e) {
        const radioOption = e.target.closest('.radio-option');
        if (!radioOption) return;
        
        const input = radioOption.querySelector('input[type="radio"]');
        const name = input.name;
        
        // Clear all selections for this group
        document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
            radio.closest('.radio-option').classList.remove('radio-option--selected');
        });
        
        // Select clicked option
        radioOption.classList.add('radio-option--selected');
        input.checked = true;
        
        // Handle province selection differently
        if (name === 'province') {
            if (input.value === 'other') {
                // Show province not available modal
                document.getElementById('provinceNotAvailableModal').classList.add('modal--active');
                return; // Don't auto-advance
            } else {
                // Auto-advance for Ontario
                setTimeout(() => {
                    nextStep();
                }, 300);
            }
        } else if (currentStep === 3 || currentStep === 4) {
            // Auto-advance for health and driving questions (steps 3 & 4)
            setTimeout(() => {
                nextStep();
            }, 300);
        } else {
            validateCurrentStep();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('comparisonModal');
        const provinceModal = document.getElementById('provinceNotAvailableModal');
        
        if (modal.classList.contains('modal--active')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'Enter' && !document.getElementById('continueBtn').disabled) {
                e.preventDefault();
                nextStep();
            }
        }
        
        if (provinceModal.classList.contains('modal--active')) {
            if (e.key === 'Escape') {
                closeProvinceModal();
            }
        }
    });
}

// ==========================================================================
// FORM SUBMISSION
// ==========================================================================

function submitForm() {
    // Force validation of all step 5 fields on submit (mark as touched and validate)
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    nameInput.dataset.touched = 'true';
    emailInput.dataset.touched = 'true'; 
    phoneInput.dataset.touched = 'true';
    
    const nameValid = validateName();
    const emailValid = validateEmail();
    const phoneValid = validatePhone();
    
    // Don't submit if any validation fails
    if (!nameValid || !emailValid || !phoneValid) {
        return;
    }
    
    saveCurrentStepData();
    
    const submitBtn = document.getElementById('continueBtn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    // console.log('Form Data:', formData);
    submitQuote(formData)
    
    // Replace this with your actual form submission logic
    setTimeout(() => {
        closeModal();

        // alert('Thank you! Your personalized comparison report will be sent to your email within 5 minutes.');
        
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
    
    // For real implementation, you would send formData to your backend:
    // fetch('/api/submit-comparison', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // });
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', function() {
    setupEventHandlers();
    updateProgressIndicator();
    updateStepDisplay();
});