/**
 * Edit Profile Sidebar - Clean Implementation
 * Simple, bug-free code with basic validations
 */

// DOM Elements
const sidebar = document.getElementById('editProfileSidebar');
const overlay = document.getElementById('editProfileOverlay');
const closeBtn = document.getElementById('editProfileClose');
const form = document.getElementById('editProfileForm');
const submitBtn = document.getElementById('submitProfile');
const submitText = document.getElementById('submitText');
const submitSpinner = document.getElementById('submitSpinner');
const unsavedWarning = document.getElementById('unsavedWarning');
const successToast = document.getElementById('successToast');

// Form inputs
const nameInput = document.getElementById('profileName');
const emailInput = document.getElementById('profileEmail');
const phoneInput = document.getElementById('profilePhone');
const dobDay = document.getElementById('dobDay');
const dobMonth = document.getElementById('dobMonth');
const dobYear = document.getElementById('dobYear');
const insuranceAge = document.getElementById('insuranceAge');

// Form state
let formData = {
    name: '',
    email: '',
    phone: '',
    gender: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    smoking: '',
    dui: '',
    bpMeds: ''
};

let originalData = { ...formData };
let isSubmitting = false;

/**
 * Initialize the sidebar
 */
function init() {
    bindEvents();
    updateSubmitButton();
}

/**
 * Bind all event listeners
 */
function bindEvents() {
    // Close events
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('edit-profile-sidebar--active')) {
            closeSidebar();
        }
    });
    
    // Form events
    form.addEventListener('submit', handleSubmit);
    
    // Input events
    nameInput.addEventListener('input', handleInputChange);
    emailInput.addEventListener('input', handleInputChange);
    phoneInput.addEventListener('input', handleInputChange);
    dobDay.addEventListener('input', handleDOBChange);
    dobMonth.addEventListener('input', handleDOBChange);
    dobYear.addEventListener('input', handleDOBChange);
    
    // Toggle button events
    const toggleButtons = document.querySelectorAll('.edit-profile-sidebar__toggle');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', handleToggleClick);
    });
    
    // Validation on blur
    nameInput.addEventListener('blur', () => validateField('name'));
    emailInput.addEventListener('blur', () => validateField('email'));
    phoneInput.addEventListener('blur', () => validateField('phone'));
    dobYear.addEventListener('blur', validateDOB);
}

/**
 * Open sidebar
 */
function openEditProfile() {
    sidebar.classList.add('edit-profile-sidebar--active');
    document.body.classList.add('edit-profile-open');
    
    // Focus first input
    setTimeout(() => nameInput.focus(), 300);
}

/**
 * Close sidebar
 */
function closeSidebar() {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    
    if (hasChanges && !isSubmitting) {
        if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
            return;
        }
    }
    
    sidebar.classList.remove('edit-profile-sidebar--active');
    document.body.classList.remove('edit-profile-open');
    hideUnsavedWarning();
}

/**
 * Handle input changes
 */
function handleInputChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    
    formData[field] = value;
    clearError(field);
    checkForChanges();
    updateSubmitButton();
}

/**
 * Handle DOB input changes
 */
function handleDOBChange(e) {
    // Only allow numbers
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    
    const field = e.target.name;
    formData[field] = e.target.value;
    
    calculateInsuranceAge();
    clearError('dob');
    checkForChanges();
    updateSubmitButton();
}

/**
 * Handle toggle button clicks
 */
function handleToggleClick(e) {
    const field = e.target.dataset.field;
    const value = e.target.dataset.value;
    
    // Remove active state from siblings
    const siblings = document.querySelectorAll(`[data-field="${field}"]`);
    siblings.forEach(btn => {
        btn.classList.remove('edit-profile-sidebar__toggle--active', 'edit-profile-sidebar__toggle--error');
    });
    
    // Add active state to clicked button
    e.target.classList.add('edit-profile-sidebar__toggle--active');
    
    // Update form data
    formData[field] = value;
    clearError(field);
    checkForChanges();
    updateSubmitButton();
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = formData[field];
    let isValid = true;
    let errorMsg = '';
    
    switch (field) {
        case 'name':
            if (!value || value.trim().length < 2) {
                errorMsg = 'Name must be at least 2 characters';
                isValid = false;
            } else if (!/^[a-zA-Z\s\-\.\']+$/.test(value)) {
                errorMsg = 'Name contains invalid characters';
                isValid = false;
            }
            break;
            
        case 'email':
            if (!value) {
                errorMsg = 'Email is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMsg = 'Please enter a valid email address';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (!value) {
                errorMsg = 'Phone number is required';
                isValid = false;
            }
			// else if (!/^[\d\s\-\(\)\+\.]{10,15}$/.test(value)) {
                // errorMsg = 'Please enter a valid phone number';
                // isValid = false;
            // }
            break;
    }
    
    if (isValid) {
        clearError(field);
    } else {
        showError(field, errorMsg);
    }
    
    return isValid;
}

/**
 * Validate date of birth
 */
function validateDOB() {
    const day = parseInt(formData.dobDay);
    const month = parseInt(formData.dobMonth);
    const year = parseInt(formData.dobYear);
    
    if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) {
        showError('dob', 'Please enter your complete date of birth');
        return false;
    }
    
    if (day < 1 || day > 31 || month < 1 || month > 12) {
        showError('dob', 'Please enter a valid date');
        return false;
    }
    
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
        showError('dob', `Year must be between 1900 and ${currentYear}`);
        return false;
    }
    
    // Check if date is valid
    const date = new Date(year, month - 1, day);
    if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
        showError('dob', 'Please enter a valid date');
        return false;
    }
    
    // Check age limits
    const age = calculateAge(date);
    if (age < 18) {
        showError('dob', 'You must be at least 18 years old');
        return false;
    }
    
    if (age > 85) {
        showError('dob', 'Maximum age for coverage is 85 years');
        return false;
    }
    
    clearError('dob');
    return true;
}

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Calculate and display insurance age
 */
function calculateInsuranceAge() {
    const day = formData.dobDay;
    const month = formData.dobMonth;
    const year = formData.dobYear;
    
    if (day && month && year && year.length === 4) {
        const birthDate = new Date(year, month - 1, day);
        
        if (!isNaN(birthDate.getTime()) && birthDate <= new Date()) {
            const age = calculateAge(birthDate);
            
            // Insurance age calculation (age nearest birthday)
            const today = new Date();
            const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            if (nextBirthday < today) {
                nextBirthday.setFullYear(today.getFullYear() + 1);
            }
            
            const daysToBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
            const insAge = daysToBirthday <= 183 ? age + 1 : age;
            
            insuranceAge.textContent = insAge;
            insuranceAge.classList.toggle('error', insAge > 85);
        } else {
            insuranceAge.textContent = '--';
            insuranceAge.classList.remove('error');
        }
    } else {
        insuranceAge.textContent = '--';
        insuranceAge.classList.remove('error');
    }
}

/**
 * Show error message
 */
function showError(field, message) {
    const errorElement = document.getElementById(field + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('edit-profile-sidebar__error--show');
    }
    
    // Add error class to input
    const input = document.querySelector(`[name="${field}"], #${field}Day, #${field}Month, #${field}Year`);
    if (input) {
        input.classList.add('error');
    }
    
    // Add error class to toggle buttons
    const toggles = document.querySelectorAll(`[data-field="${field}"]`);
    toggles.forEach(toggle => toggle.classList.add('edit-profile-sidebar__toggle--error'));
}

/**
 * Clear error message
 */
function clearError(field) {
    const errorElement = document.getElementById(field + 'Error');
    if (errorElement) {
        errorElement.classList.remove('edit-profile-sidebar__error--show');
    }
    
    // Remove error class from input
    const input = document.querySelector(`[name="${field}"], #${field}Day, #${field}Month, #${field}Year`);
    if (input) {
        input.classList.remove('error');
    }
    
    // Remove error class from toggle buttons
    const toggles = document.querySelectorAll(`[data-field="${field}"]`);
    toggles.forEach(toggle => toggle.classList.remove('edit-profile-sidebar__toggle--error'));
}

/**
 * Check if form is valid
 */
function isFormValid() {
    // Check all required fields are filled
    const requiredFields = ['name', 'email', 'phone', 'gender', 'dobDay', 'dobMonth', 'dobYear', 'smoking', 'dui', 'bpMeds'];
    const allFilled = requiredFields.every(field => formData[field] && formData[field].toString().trim() !== '');
    
    // Check no visible errors
    const hasErrors = document.querySelectorAll('.edit-profile-sidebar__error--show').length > 0;
    
    return allFilled && !hasErrors;
}

/**
 * Update submit button state
 */
function updateSubmitButton() {
    const isValid = isFormValid();
    submitBtn.disabled = !isValid || isSubmitting;
}

/**
 * Check for unsaved changes
 */
function checkForChanges() {
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);
    
    if (hasChanges) {
        showUnsavedWarning();
    } else {
        hideUnsavedWarning();
    }
}

/**
 * Show unsaved warning
 */
function showUnsavedWarning() {
    unsavedWarning.style.display = 'flex';
}

/**
 * Hide unsaved warning
 */
function hideUnsavedWarning() {
    unsavedWarning.style.display = 'none';
}

/**
 * Handle form submission
 */
function handleSubmit(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Final validation
    let isValid = true;
    
    // Validate text fields
    ['name', 'email', 'phone'].forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Validate DOB
    if (!validateDOB()) {
        isValid = false;
    }
    
    // Check required toggles
    ['gender', 'smoking', 'dui', 'bpMeds'].forEach(field => {
        if (!formData[field]) {
            showError(field, 'Please select an option');
            isValid = false;
        }
    });
    
    if (!isValid) {
        return;
    }
    
    // Start submission
    isSubmitting = true;
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitSpinner.style.display = 'block';
    
    // Simulate API call
    setTimeout(() => {
        // Success
        isSubmitting = false;
        submitText.style.display = 'inline';
        submitSpinner.style.display = 'none';
        
        // Update original data
        originalData = { ...formData };
        hideUnsavedWarning();
        
        // Show success toast
        //showSuccessToast();
        sendProfileUpdateRequest(originalData);
        
        // Close sidebar after delay
        setTimeout(() => {
            closeSidebar();
        }, 1500);
        
    }, 1000);
}

/**
 * Show success toast
 */
function showSuccessToast() {
    successToast.style.display = 'flex';
    successToast.classList.add('edit-profile-sidebar__toast--show');
    
    setTimeout(() => {
        successToast.classList.remove('edit-profile-sidebar__toast--show');
        setTimeout(() => {
            successToast.style.display = 'none';
        }, 300);
    }, 3000);
}


// Pre-fill form if editing existing profile
  function prefillForm(userData) {
    // This function would be called with user data from your database
    if (!userData) return;
    
    formData = { ...profileData };
    originalData = { ...profileData };

  }
