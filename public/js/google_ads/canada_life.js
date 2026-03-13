// Canada Life Landing Page JavaScript
// Simple form data storage
let formData = { insuranceType: 'term-life', smokerStatus: 'no', gender: 'male' };
let currentStep = 1;

// Step navigation
function goToStep(stepNumber) {
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const targetStep = document.getElementById(`step${stepNumber}`);
    const targetStepDesktop = document.getElementById(`step${stepNumber}Desktop`);
    
    if (targetStep) targetStep.classList.add('active');
    if (targetStepDesktop) targetStepDesktop.classList.add('active');
    
    currentStep = stepNumber;
}

function goToStepDesktop(stepNumber) {
    goToStep(stepNumber);
}

// Button group selection
function setupButtonGroups() {
    document.querySelectorAll('.button-group-compact').forEach(group => {
        const hiddenInput = group.parentNode.querySelector('input[type="hidden"]');
        const buttons = group.querySelectorAll('.option-button-compact');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                buttons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                
                if (hiddenInput) {
                    hiddenInput.value = this.dataset.value;
                }
            });
        });
    });
}

// Date input handling
function setupDateInputs() {
    document.querySelectorAll('.date-input').forEach(input => {
        input.addEventListener('input', function() {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Auto-advance to next field
            if (this.name === 'birthDay' && this.value.length === 2) {
                const monthInput = this.closest('.date-input-group').querySelector('input[name="birthMonth"]');
                if (monthInput) monthInput.focus();
            } else if (this.name === 'birthMonth' && this.value.length === 2) {
                const yearInput = this.closest('.date-input-group').querySelector('input[name="birthYear"]');
                if (yearInput) yearInput.focus();
            }
        });
    });
}

// Form submission handlers
function setupFormHandlers() {
    // Step 1 forms
    ['step1Form', 'step1FormDesktop'].forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formDataStep1 = new FormData(e.target);
                Object.assign(formData, Object.fromEntries(formDataStep1));
                
                goToStep(2);
            });
        }
    });

    // Step 2 forms
    ['step2Form', 'step2FormDesktop'].forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Basic validation
                const coverageAmount = this.querySelector('select[name="coverageAmount"]').value;
                const dayInput = this.querySelector('input[name="birthDay"]');
                const monthInput = this.querySelector('input[name="birthMonth"]');
                const yearInput = this.querySelector('input[name="birthYear"]');
                
                if (!coverageAmount) {
                    alert('Please select a coverage amount');
                    return;
                }
                
                if (!dayInput.value || !monthInput.value || !yearInput.value) {
                    alert('Please complete your date of birth');
                    return;
                }
                
                const formDataStep2 = new FormData(e.target);
                const dateOfBirth = `${yearInput.value}-${monthInput.value.padStart(2, '0')}-${dayInput.value.padStart(2, '0')}`;
                formDataStep2.set('dateOfBirth', dateOfBirth);
                Object.assign(formData, Object.fromEntries(formDataStep2));
                
                goToStep(3);
            });
        }
    });

    // Step 3 forms
    ['step3Form', 'step3FormDesktop'].forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formDataStep3 = new FormData(e.target);
                Object.assign(formData, Object.fromEntries(formDataStep3));
                
                submitForm();
            });
        }
    });
}

// Final form submission
function submitForm() {

    ajaxFormSubmit(formData);
    // alert('Thank you! We\'ve received your information and will contact you with personalized quotes within 24 hours.');
    
    // console.log('Form submitted:', formData);
    
    // // Reset form after 2 seconds
    // setTimeout(() => {
    //     resetForm();
    //     goToStep(1);
    // }, 2000);
}

// Reset form to defaults
function resetForm() {
    document.querySelectorAll('.option-button-compact').forEach(btn => btn.classList.remove('selected'));
    
    // Set defaults
    document.querySelectorAll('.option-button-compact[data-value="male"]').forEach(btn => btn.classList.add('selected'));
    document.querySelectorAll('.option-button-compact[data-value="no"]').forEach(btn => btn.classList.add('selected'));
    document.querySelectorAll('input[name="gender"]').forEach(input => input.value = 'male');
    document.querySelectorAll('input[name="smokerStatus"]').forEach(input => input.value = 'no');
    
    // Reset other form fields
    document.querySelectorAll('select[name="insuranceType"]').forEach(select => select.value = 'term-life');
    document.querySelectorAll('select[name="coverageAmount"]').forEach(select => select.selectedIndex = 0);
    document.querySelectorAll('.date-input').forEach(input => input.value = '');
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach(input => {
        if (!input.readOnly) input.value = '';
    });
    
    formData = { insuranceType: 'term-life', smokerStatus: 'no', gender: 'male' };
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupButtonGroups();
    setupFormHandlers();
    setupDateInputs();
});