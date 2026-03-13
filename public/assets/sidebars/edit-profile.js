document.addEventListener('DOMContentLoaded', function() {
  // Sidebar elements
  const openSidebarBtn = document.getElementById('open-profile-sidebar');
  const closeSidebarBtn = document.getElementById('close-profile-sidebar');
  const sidebar = document.getElementById('profile-sidebar');
  const overlay = document.getElementById('profile-sidebar-overlay');
  
  // Form elements
  const form = document.getElementById('profile-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const mobileInput = document.getElementById('mobile');
  const dobDay = document.getElementById('dob-day');
  const dobMonth = document.getElementById('dob-month');
  const dobYear = document.getElementById('dob-year');
  const saveButton = document.getElementById('save-profile');
  
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
  
  // Sidebar open/close functions
  function openSidebar() {
    sidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('sidebar-open');
  }
  
  function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('sidebar-open');
  }
  
  // Event listeners for sidebar
  if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', openSidebar);
  }
  
  if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeSidebar);
  }
  
  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }
  
  // Close sidebar on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) {
      closeSidebar();
    }
  });
  
  // Add event listeners for form validation
  form.addEventListener('input', validateForm);
  form.addEventListener('change', validateForm);
  form.addEventListener('submit', handleSubmit);
  
  // Mobile number formatting and validation
  mobileInput.addEventListener('input', function(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, ''); // Remove non-digits
    
    // Handle North American format (optional +1 or 1 prefix)
    if (value.startsWith('1') && value.length > 1) {
      value = value.substring(1);
    }
    
    // Limit to 10 digits
    if (value.length > 10) {
      value = value.substring(0, 10);
    }
    
    // Format with spaces for readability
    if (value.length > 6) {
      input.value = value.substring(0, 3) + ' ' + value.substring(3, 6) + ' ' + value.substring(6);
    } else if (value.length > 3) {
      input.value = value.substring(0, 3) + ' ' + value.substring(3);
    } else {
      input.value = value;
    }
    
    validateField(input);
  });
  
  // Date of birth field handlers
  dobDay.addEventListener('input', handleDobInput);
  dobMonth.addEventListener('input', handleDobInput);
  dobYear.addEventListener('input', handleDobInput);
  
  // Handle DOB input field, auto-advance and validate
  function handleDobInput(e) {
    const input = e.target;
    const value = input.value;
    
    // Ensure only numbers are entered
    if (/[^0-9]/.test(value)) {
      input.value = value.replace(/[^0-9]/g, '');
      return;
    }
    
    // Auto-advance to next field
    if (input.id === 'dob-day' && value.length === 2) {
      if (parseInt(value) > 0 && parseInt(value) <= 31) {
        dobMonth.focus();
      }
    } else if (input.id === 'dob-month' && value.length === 2) {
      if (parseInt(value) > 0 && parseInt(value) <= 12) {
        dobYear.focus();
      }
    }
    
    // Update insurance age on any change
    if (dobDay.value && dobMonth.value && dobYear.value.length === 4) {
      updateInsuranceAge();
    }
    
    validateField(input);
  }
  
  // Calculate insurance age (nearest age method)
  function updateInsuranceAge() {
    const day = parseInt(dobDay.value);
    const month = parseInt(dobMonth.value);
    const year = parseInt(dobYear.value);
    
    // Check if date is valid
    if (isNaN(day) || isNaN(month) || isNaN(year) || 
        day < 1 || day > 31 || month < 1 || month > 12 || 
        year < 1900 || year > new Date().getFullYear()) {
      document.getElementById('insurance-age').textContent = '--';
      markDobInvalid("Please enter a valid date of birth");
      return;
    }
    
    // Check if date is a valid calendar date (e.g., no February 31)
    const dob = new Date(year, month - 1, day);
    if (dob.getDate() !== day) {
      document.getElementById('insurance-age').textContent = '--';
      markDobInvalid("Invalid day for the selected month");
      return;
    }
    
    // Calculate age
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    
    // Get the birth date for this year (for comparison)
    const birthDateThisYear = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    
    // If the birth date this year is more than 6 months away, subtract 1 from age
    const sixMonthsInMs = 1000 * 60 * 60 * 24 * 182.5;
    if (birthDateThisYear > today && 
        birthDateThisYear - today > sixMonthsInMs) {
      age--;
    } 
    // If the birth date this year has passed, and more than 6 months have passed, add 1 to age
    else if (birthDateThisYear <= today && 
             today - birthDateThisYear > sixMonthsInMs) {
      age++;
    }
    
    document.getElementById('insurance-age').textContent = age;
    
    // Validate age (must be <= 85)
    if (age > 85) {
      markDobInvalid("Age must be 85 or younger for insurance eligibility");
      
      // Add shake animation
      const dobContainer = document.querySelector('.dob-container');
      dobContainer.classList.add('shake');
      setTimeout(() => {
        dobContainer.classList.remove('shake');
      }, 600);
    } else {
      markDobValid();
    }
    
    validateForm();
  }
  
  // Mark DOB fields as invalid
  function markDobInvalid(message) {
    dobDay.classList.add('is-invalid');
    dobMonth.classList.add('is-invalid');
    dobYear.classList.add('is-invalid');
    
    const feedback = document.querySelector('.dob-feedback');
    feedback.textContent = message;
    feedback.style.display = 'block';
  }
  
  // Mark DOB fields as valid
  function markDobValid() {
    dobDay.classList.remove('is-invalid');
    dobMonth.classList.remove('is-invalid');
    dobYear.classList.remove('is-invalid');
    
    dobDay.classList.add('is-valid');
    dobMonth.classList.add('is-valid');
    dobYear.classList.add('is-valid');
    
    document.querySelector('.dob-feedback').style.display = 'none';
  }
  
  // Validate individual field
  function validateField(field) {
    let isValid = true;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
      isValid = false;
    }
    
    // Name validation
    if (field.id === 'name' && field.value.trim().length < 2) {
      isValid = false;
    }
    
    // Email validation
    if (field.id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(field.value);
    }
    
    // Mobile validation
    if (field.id === 'mobile') {
      const cleanNumber = field.value.replace(/\D/g, '');
      // Must be 10 digits (North American format)
      isValid = cleanNumber.length === 10;
    }
    
    // DOB validation - handled separately in updateInsuranceAge()
    if (field.id.startsWith('dob-')) {
      return field.value !== '';
    }
    
    // Toggle validation UI
    if (!isValid && field.value !== '') {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      field.nextElementSibling?.classList?.contains('invalid-feedback') && 
        (field.nextElementSibling.style.display = 'block');
    } else if (field.value !== '') {
      field.classList.add('is-valid');
      field.classList.remove('is-invalid');
      field.nextElementSibling?.classList?.contains('invalid-feedback') && 
        (field.nextElementSibling.style.display = 'none');
    } else {
      field.classList.remove('is-valid');
      field.classList.remove('is-invalid');
      field.nextElementSibling?.classList?.contains('invalid-feedback') && 
        (field.nextElementSibling.style.display = 'none');
    }
    
    return isValid;
  }
  
  // Validate the entire form
  function validateForm() {
    const fields = form.querySelectorAll('input, select');
    let formIsValid = true;
    
    fields.forEach(field => {
      if (field.type === 'radio') {
        // For radio buttons, check if any in the group is checked
        const name = field.name;
        const group = form.querySelectorAll(`input[name="${name}"]`);
        let groupValid = false;
        
        group.forEach(radio => {
          if (radio.checked) {
            groupValid = true;
          }
        });
        
        if (!groupValid) {
          formIsValid = false;
          // Show invalid feedback for the group
          const container = field.closest('.btn-group');
          container.nextElementSibling.style.display = 'block';
        } else {
          const container = field.closest('.btn-group');
          container.nextElementSibling.style.display = 'none';
        }
      } else if (!field.id.startsWith('dob-')) {
        // For non-DOB fields
        const fieldValid = validateField(field);
        if (!fieldValid) {
          formIsValid = false;
        }
      }
    });
    
    // Special handling for DOB fields
    if (dobDay.value && dobMonth.value && dobYear.value.length === 4) {
      // DOB validation happens in updateInsuranceAge
      const dobInvalid = dobDay.classList.contains('is-invalid');
      if (dobInvalid) {
        formIsValid = false;
      }
    } else if (dobDay.value || dobMonth.value || dobYear.value) {
      // Partial DOB entered
      formIsValid = false;
      if (!dobDay.classList.contains('is-invalid')) {
        markDobInvalid("Please complete the date of birth");
      }
    } else {
      // No DOB entered
      formIsValid = false;
      markDobInvalid("Date of birth is required");
    }
    
    // Enable/disable save button
    saveButton.disabled = !formIsValid;
    
    return formIsValid;
  }
  
  // Handle form submission with loading spinner
function handleSubmit(e) {
  e.preventDefault();
  
  if (validateForm()) {
    // Show loading spinner
    saveButton.disabled = true;
    saveButton.classList.add('loading');
    
    // Simulate a 3-second loading time
    setTimeout(() => {
      // Collect form data
      const formData = {
        name: nameInput.value,
        email: emailInput.value,
        mobile: mobileInput.value.replace(/\D/g, ''),
        gender: form.querySelector('input[name="gender"]:checked')?.value,
        dob: {
          day: dobDay.value,
          month: dobMonth.value,
          year: dobYear.value
        },
        smoking: form.querySelector('input[name="smoking"]:checked')?.value,
        dui: form.querySelector('input[name="dui"]:checked')?.value,
        bp_meds: form.querySelector('input[name="bp_meds"]:checked')?.value,
        insurance_age: document.getElementById('insurance-age').textContent
      };
      
      // Here you would normally send the data to your server
      sendProfileUpdateRequest(formData);

      // Hide loading spinner
      saveButton.classList.remove('loading');
      
      // Show success state
      saveButton.querySelector('.btn-text').textContent = 'Saved Successfully!';
      saveButton.classList.remove('btn-primary');
      saveButton.classList.add('btn-success');
      
      // Close sidebar after successful save (after 1 second)
      setTimeout(() => {
        closeSidebar();
        
        // Reset button after closing
        setTimeout(() => {
          saveButton.disabled = false;
          saveButton.querySelector('.btn-text').textContent = 'Save Changes';
          saveButton.classList.remove('btn-success');
          saveButton.classList.add('btn-primary');
        }, 500);
      }, 1000);
    }, 3000); // 3 second loading time
  }
}
  
  // Pre-fill form if editing existing profile
  function prefillForm(userData) {
    // This function would be called with user data from your database
    if (!userData) return;
    
    nameInput.value = userData.name || '';
    emailInput.value = userData.email || '';
    mobileInput.value = userData.mobile || '';
    
    if (userData.gender) {
      const genderInput = document.getElementById(`gender-${userData.gender}`);
      if (genderInput) genderInput.checked = true;
    }
    
    if (userData.dob) {
      dobDay.value = userData.dob.day || '';
      dobMonth.value = userData.dob.month || '';
      dobYear.value = userData.dob.year || '';
      if (dobDay.value && dobMonth.value && dobYear.value) {
        updateInsuranceAge();
      }
    }
    
    if (userData.smoking) {
      const smokingInput = document.getElementById(`smoking-${userData.smoking}`);
      if (smokingInput) smokingInput.checked = true;
    }
    
    if (userData.dui) {
      const duiInput = document.getElementById(`dui-${userData.dui}`);
      if (duiInput) duiInput.checked = true;
    }
    
    if (userData.bp_meds) {
      const bpInput = document.getElementById(`bp-${userData.bp_meds}`);
      if (bpInput) bpInput.checked = true;
    }
    
    validateForm();
  }
  
  // Example usage of prefillForm:
  // Uncomment this to test with sample data
  
  prefillForm({
    name: profileData.name,
    email: profileData.email,
    mobile: profileData.phoneNumber,
    gender: profileData.gender,
    dob: {
      day: profileData.dobDay,
      month: profileData.dobMonth,
      year: profileData.dobYear,
    },
    smoking: profileData.tobacco,
    dui: profileData.dui,
    bp_meds: profileData.medication
  });

});