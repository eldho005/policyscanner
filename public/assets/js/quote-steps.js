// Variables for final questions functionality
let medicationStatus = null;
let duiStatus = null;
let hasDismissedModal = false;
let modalWasShown = false;
let avatarMessageTimeout;
let finalQuestionsModal = null;

$(document).ready(function() {
  // Initialize variables to track state
  let currentStep = 1;
  let totalSteps = 6;
  
  let selectedProvince = '';
  let selectedGender = '';
  let selectedTobacco = '';
  let selectedCoverage = '';
  let dobValid = false;
  let newInsuranceTypeSelected = '';
  
  // Get references to DOM elements
  const $sidebar = $('#sidebar');
  const $overlay = $('.overlay');
  const $sidebarCollapse = $('#sidebarCollapse');
  const $dismiss = $('#dismiss');
  const $progressBar = $('#progressBar');
  const $stepInfo = $('#stepInfo');
  const $currentStepDisplay = $('#currentStep');
  const $selectedInsuranceText = $('#selectedInsuranceText');
  const $insuranceTypeIndicator = $('#insuranceTypeIndicator');
  const $stickyCTA = $('#stickyCTA');
  const $stickyNext = $('#stickyNext');
  
  // Initialize Bootstrap modals
  const $otherProvinceModal = $('#otherProvinceModal');
  const $switchInsuranceModal = $('#switchInsuranceModal');
  const $finalQuestionsModalEl = $('#finalQuestionsModal');
  
  let otherProvinceModalInstance, switchInsuranceModalInstance;
  
  if ($otherProvinceModal.length) {
    otherProvinceModalInstance = new bootstrap.Modal($otherProvinceModal[0]);
  }
  
  if ($switchInsuranceModal.length) {
    switchInsuranceModalInstance = new bootstrap.Modal($switchInsuranceModal[0]);
  }
  
  // Initialize the final questions modal
  if ($finalQuestionsModalEl.length) {
    finalQuestionsModal = new bootstrap.Modal($finalQuestionsModalEl[0], {
      backdrop: 'static',
      keyboard: false
    });
    
    // Add modal event listeners
    $finalQuestionsModalEl.on('shown.bs.modal', function() {
      //("Final questions modal shown");
      showAvatarMessage();
      modalWasShown = true;
    });
    
    $finalQuestionsModalEl.on('hidden.bs.modal', function() {
      //console.log("Final questions modal hidden");
      if (!duiStatus && !hasDismissedModal) {
        hasDismissedModal = true;
        setTimeout(showFloatingBanner, 1000);
      } else {
        hideQuoteLoader();
        redirectToQuotesPage();
      }
    });
  }
  
  // Connect the final questions buttons
  const $showQuotesBtn = $('#showQuotesBtn');
  const $mobileShowQuotesBtn = $('#mobileShowQuotesBtn');
  
  if ($showQuotesBtn.length) {
    $showQuotesBtn.on('click', function() {
      if (finalQuestionsModal) finalQuestionsModal.hide();
      hideQuoteLoader();
      redirectToQuotesPage();
    });
  }
  
  if ($mobileShowQuotesBtn.length) {
    $mobileShowQuotesBtn.on('click', function() {
      if (finalQuestionsModal) finalQuestionsModal.hide();
      hideQuoteLoader();
      redirectToQuotesPage();
    });
  }
  
  // Initialize tooltips
  $('[data-bs-toggle="tooltip"]').each(function() {
    new bootstrap.Tooltip(this);
  });
  
  // Make sure overlay is hidden initially
  if ($overlay.length) {
    $overlay.css({
      'visibility': 'hidden',
      'opacity': '0',
      'pointer-events': 'none'
    });
  }
  
  // Sidebar toggle functionality
  if ($sidebarCollapse.length && $sidebar.length && $overlay.length) {
    $sidebarCollapse.on('click', function() {
      $sidebar.toggleClass('active');
      $overlay.toggleClass('active');
      
      if ($overlay.hasClass('active')) {
        $overlay.css({
          'visibility': 'visible',
          'opacity': '1',
          'pointer-events': 'auto'
        });
      } else {
        $overlay.css({
          'visibility': 'hidden',
          'opacity': '0',
          'pointer-events': 'none'
        });
      }
    });
    
    if ($dismiss.length) {
      $dismiss.on('click', function() {
        $sidebar.removeClass('active');
        $overlay.removeClass('active');
        $overlay.css({
          'visibility': 'hidden',
          'opacity': '0',
          'pointer-events': 'none'
        });
      });
    }
    
    $overlay.on('click', function() {
      $sidebar.removeClass('active');
      $overlay.removeClass('active');
      $overlay.css({
        'visibility': 'hidden',
        'opacity': '0',
        'pointer-events': 'none'
      });
    });
  }
  
  // Insurance type indicator click handler (shows sidebar)
  if ($insuranceTypeIndicator.length && $sidebar.length && $overlay.length) {
    $insuranceTypeIndicator.on('click', function() {
      $sidebar.addClass('active');
      $overlay.addClass('active');
      $overlay.css({
        'visibility': 'visible',
        'opacity': '1',
        'pointer-events': 'auto'
      });
    });
  }
  
  // Step 1: Insurance Type Selection
  const $insuranceCards = $('.insurance-card');
  const $step1Next = $('#step1Next');
  
  if ($insuranceCards.length > 0) {
    $insuranceCards.on('click', function() {
      // Remove selected class from all cards
      $insuranceCards.removeClass('selected').attr('aria-pressed', 'false');
      
      // Add selected class to clicked card
      $(this).addClass('selected').attr('aria-pressed', 'true');
      
      // Store selected insurance type
      selectedInsuranceType = $(this).attr('data-insurance-type');
      if ($selectedInsuranceText.length) {
        $selectedInsuranceText.text($(this).attr('data-insurance-name'));
      }
      
      // Update sidebar
      updateSidebarInsuranceType(selectedInsuranceType);
      
      // Enable next button
      if ($step1Next.length) $step1Next.prop('disabled', false);
      if ($stickyNext.length) $stickyNext.prop('disabled', false);
    });
    
    // Keyboard handling for accessibility
    $insuranceCards.on('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
      }
    });
    
    // Add click handlers to card contents as well (for better UX)
    const $cardContents = $('.insurance-card-content');
    $cardContents.on('click', function(e) {
      // Prevent default to avoid any conflicts
      e.preventDefault();
      e.stopPropagation();
      
      // Find the parent card and simulate a click
      const $parentCard = $(this).closest('.insurance-card');
      if ($parentCard.length) {
        $parentCard.trigger('click');
      }
    });
  }
  
  // Step 2: Province Selection
	const provinceButtons = document.querySelectorAll('.btn-province');
	const step2Next = document.getElementById('step2Next');
	const step2Back = document.getElementById('step2Back');

	if (provinceButtons.length > 0) {
	  provinceButtons.forEach(btn => {
		btn.addEventListener('click', function() {
		  const province = this.getAttribute('data-province');
		  
		  // Remove selected class from all buttons
		  provinceButtons.forEach(b => {
			b.classList.remove('selected');
			b.setAttribute('aria-pressed', 'false');
		  });
		  
		  // Add selected class to clicked button
		  this.classList.add('selected');
		  this.setAttribute('aria-pressed', 'true');
		  
		  // If "Other Province" is selected, show modal
		  if (province === 'other' && otherProvinceModalInstance) {
			otherProvinceModalInstance.show();
			if (step2Next) step2Next.disabled = true;
			if (stickyNext) stickyNext.disabled = true;
			return;
		  }
		  
		  // Store selected province
		  selectedProvince = province;

		  // Enable next button (in case needed for sticky logic)
		  if (step2Next) step2Next.disabled = false;
		  if (stickyNext) stickyNext.disabled = false;
		  
		  // ⭐⭐⭐ New: If Ontario is selected, immediately go to Step 3
		  if (province === 'ontario') {
			setTimeout(() => {
			  goToStep(3);
			}, 300); // optional 300ms slight delay for smoothness
		  }
		});
		
		// Keyboard handling for accessibility
		btn.addEventListener('keydown', function(e) {
		  if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			this.click();
		  }
		});
	  });
	}
  
  // Step 3: Gender Selection
  const $genderButtons = $('.btn-gender');
  const $step3Back = $('#step3Back');
  
  if ($genderButtons.length > 0) {
    $genderButtons.on('click', function() {
      const gender = $(this).attr('data-gender');
      
      // Remove selected class from all buttons
      $genderButtons.removeClass('selected').attr('aria-pressed', 'false');
      
      // Add selected class to clicked button
      $(this).addClass('selected').attr('aria-pressed', 'true');
      
      // Store selected gender
      selectedGender = gender;
      
      // Wait briefly for user to see selection, then auto-advance
      setTimeout(function() {
        goToStep(4);
      }, 500);
    });
    
    // Keyboard handling for accessibility
    $genderButtons.on('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
      }
    });
  }
  
  // Step 4: Tobacco/Nicotine Use
  const $tobaccoButtons = $('.btn-tobacco');
  const $step4Back = $('#step4Back');
  
  if ($tobaccoButtons.length > 0) {
    $tobaccoButtons.on('click', function() {
      const tobacco = $(this).attr('data-tobacco');
      
      // Remove selected class from all buttons
      $tobaccoButtons.removeClass('selected').attr('aria-pressed', 'false');
      
      // Add selected class to clicked button
      $(this).addClass('selected').attr('aria-pressed', 'true');
      
      // Store selected tobacco status
      selectedTobacco = tobacco;
      
      // Wait briefly for user to see selection, then auto-advance
      setTimeout(function() {
        goToStep(5);
      }, 500);
    });
    
    // Keyboard handling for accessibility
    $tobaccoButtons.on('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
      }
    });
  }
  
  // Step 5: Coverage & DOB
  const $coverageDropdown = $('#coverageAmount');
  const $dobDayInput = $('#dobDay');
  const $dobMonthInput = $('#dobMonth');
  const $dobYearInput = $('#dobYear');
  const $dobError = $('#dobError');
  const $insuranceAgeContainer = $('#insuranceAgeContainer');
  const $insuranceAge = $('#insuranceAge');
  const $step5Next = $('#step5Next');
  const $step5Back = $('#step5Back');
  
  // Coverage dropdown change event
  if ($coverageDropdown.length) {
    $coverageDropdown.on('change', function() {
      selectedCoverage = $(this).val();
      validateStep5();
    });
  }
  
  // DOB input events
  if ($dobDayInput.length && $dobMonthInput.length && $dobYearInput.length) {
    // Auto-advance between DOB fields
    $dobDayInput.on('input', function(e) {
      let value = $(this).val();
      
      // Auto-format: If user types 1-9, add leading zero
      if (value.length === 1 && parseInt(value) >= 1 && parseInt(value) <= 9) {
        // Keep cursor at end after modification
        const pos = e.target.selectionStart;
        //$(this).val("0" + value);
        e.target.setSelectionRange(pos+1, pos+1);
        value = $(this).val();
      }
      
      // Auto-advance to month field
      if (value.length === 2 && parseInt(value) >= 1 && parseInt(value) <= 31) {
        //$dobMonthInput.focus();
      }
      
      validateDOB();
    });
    
    $dobMonthInput.on('input', function(e) {
      let value = $(this).val();
      
      // Auto-format: If user types 1-9, add leading zero
      if (value.length === 1 && parseInt(value) >= 1 && parseInt(value) <= 9) {
        // Keep cursor at end after modification
        const pos = e.target.selectionStart;
        //$(this).val("0" + value);
        e.target.setSelectionRange(pos+1, pos+1);
        value = $(this).val();
      }
      
      // Auto-advance to year field
      if (value.length === 2 && parseInt(value) >= 1 && parseInt(value) <= 12) {
        //$dobYearInput.focus();
      }
      
      validateDOB();
    });
    
    $dobYearInput.on('input', function() {
      validateDOB();
    });
    
    // Backspace functionality for DOB fields
    $dobMonthInput.on('keydown', function(e) {
      // If backspace pressed when field is empty, focus previous field
      if (e.key === 'Backspace' && $(this).val() === '') {
        $dobDayInput.focus();
      }
    });
    
    $dobYearInput.on('keydown', function(e) {
      // If backspace pressed when field is empty, focus previous field
      if (e.key === 'Backspace' && $(this).val() === '') {
        $dobMonthInput.focus();
      }
    });
  }
  
  // Validate DOB and calculate insurance age
  function validateDOB() {
    if (!$dobDayInput.length || !$dobMonthInput.length || !$dobYearInput.length || 
        !$dobError.length || !$insuranceAgeContainer.length || !$insuranceAge.length) {
      return false;
    }
    
    const day = parseInt($dobDayInput.val());
    const month = parseInt($dobMonthInput.val());
    const year = parseInt($dobYearInput.val());
    let isValid = false;
    
    // Reset validation states
    $dobDayInput.removeClass('is-invalid');
    $dobMonthInput.removeClass('is-invalid');
    $dobYearInput.removeClass('is-invalid');
    $dobError.removeClass('show');
    
    // Basic validation
    if ($dobDayInput.val() && $dobMonthInput.val() && $dobYearInput.val() && 
        day >= 1 && day <= 31 && 
        month >= 1 && month <= 12 && 
        year >= 1900 && year <= new Date().getFullYear() - 18) {
      
      // Advanced date validation (e.g., Feb 30 is invalid)
      const date = new Date(year, month - 1, day);
      
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        isValid = true;
        
        // Calculate insurance age (nearest birthday)
        const now = new Date();
        let age = now.getFullYear() - year;
        
        // Adjust age if birthday hasn't occurred yet this year
        if (now.getMonth() < month - 1 || (now.getMonth() === month - 1 && now.getDate() < day)) {
          age--;
        }
        
        // Nearest birthday adjustment (if within 6 months of next birthday)
        const nextBirthdayThisYear = new Date(now.getFullYear(), month - 1, day);
        if (nextBirthdayThisYear < now) {
          nextBirthdayThisYear.setFullYear(now.getFullYear() + 1);
        }
        
        const sixMonthsInMs = 182.5 * 24 * 60 * 60 * 1000;
        if (nextBirthdayThisYear - now < sixMonthsInMs) {
          age++;
        }
        
        // Display the insurance age
        $insuranceAge.text(age);
        $insuranceAgeContainer.removeClass('d-none');
      } else {
        // Invalid date (e.g., Feb 30)
        isValid = false;
        showDOBError();
      }
    } else if ($dobDayInput.val() || $dobMonthInput.val() || $dobYearInput.val()) {
      // Partial DOB entered - show error
      showDOBError();
    }
    
    dobValid = isValid;
    validateStep5();
    return isValid;
  }
  
  function showDOBError() {
    if (!$dobDayInput.length || !$dobMonthInput.length || !$dobYearInput.length || !$dobError.length) {
      return;
    }
    
    // Mark invalid fields
    if ($dobDayInput.val() && (parseInt($dobDayInput.val()) < 1 || parseInt($dobDayInput.val()) > 31)) {
      $dobDayInput.addClass('is-invalid');
    }
    
    if ($dobMonthInput.val() && (parseInt($dobMonthInput.val()) < 1 || parseInt($dobMonthInput.val()) > 12)) {
      $dobMonthInput.addClass('is-invalid');
    }
    
    if ($dobYearInput.val() && (parseInt($dobYearInput.val()) < 1900 || 
                                parseInt($dobYearInput.val()) > new Date().getFullYear() - 18)) {
      $dobYearInput.addClass('is-invalid');
    }
    
    $dobError.addClass('show');
  }
  
  function validateStep5() {
    // Enable next button only if both coverage and DOB are valid
    if ($step5Next.length) {
      $step5Next.prop('disabled', !(selectedCoverage && dobValid));
    }
    
    // Update sticky button if present
    if ($stickyNext.length) {
      $stickyNext.prop('disabled', !(selectedCoverage && dobValid));
    }
  }
  
  // Step 6: Contact Info Fields
  const $firstName = $('#firstName');
  const $email = $('#email');
  const $phoneNumber = $('#phoneNumber');
  const $whatsappConsent = $('#whatsappConsent');
  const $step6Submit = $('#step6Submit');
  const $step6Back = $('#step6Back');
  const $submitSpinner = $('#submitSpinner');
  const $submitText = $('#submitText');
  
  // Form validation flags
  let firstNameValid = false;
  let emailValid = false;
  let phoneValid = false;
  
  // Email validation regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  // First name validation
  if ($firstName.length) {
    $firstName.on('input', function() {
      validateFirstName();
      
      // Auto-advance to email if name is valid and has enough characters
      if (firstNameValid && $firstName.val().trim().length > 2 && document.activeElement === $firstName[0]) {
        setTimeout(function() {
          //if ($email.length) $email.focus();
        }, 500);
      }
    });
    
    $firstName.on('blur', validateFirstName);
  }
  
  // Email validation
  if ($email.length) {
    $email.on('input', validateEmail);
    $email.on('blur', function() {
      validateEmail();
      
      // Auto-advance to phone if email is valid and user is done typing
      if (emailValid && document.activeElement === $email[0]) {
        const emailValue = $email.val().trim();
        if (emailValue.includes('@') && emailValue.includes('.')) {
          setTimeout(function() {
            if ($phoneNumber.length) $phoneNumber.focus();
          }, 500);
        }
      }
    });
  }
  
  // Phone number formatting and validation
  if ($phoneNumber.length) {
    $phoneNumber.on('input', function(e) {
      // Store cursor position
      const start = this.selectionStart;
      const end = this.selectionEnd;
      const previousLength = $(this).val().length;
      
      // Remove non-digits
      let value = $(this).val().replace(/\D/g, '');
      
      // Format phone number
      if (value.length > 0) {
        if (value.length <= 3) {
          value = `(${value}`;
        } else if (value.length <= 6) {
          value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
        } else {
          value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6, 10)}`;
        }
      }
      
      // Update value
      $(this).val(value);
      
      // Adjust cursor position after formatting
      const newLength = $(this).val().length;
      
      // Only adjust if user is typing, not deleting
      if (newLength > previousLength) {
        // Move cursor after added characters
        if (value.length === 4 && previousLength === 3) { // After "(" and before ")"
          this.setSelectionRange(4, 4);
        } else if (value.length === 9 && previousLength === 8) { // After ")" + space
          this.setSelectionRange(9, 9);
        } else if (value.length === 14 && previousLength === 13) { // After "-"
          this.setSelectionRange(14, 14);
        } else {
          this.setSelectionRange(start + (newLength - previousLength), end + (newLength - previousLength));
        }
      } else {
        // Keep cursor in the same position for deletion
        this.setSelectionRange(start, start);
      }
      
      validatePhone();
    });
    
    $phoneNumber.on('blur', validatePhone);
  }
  
  // Back button for step 6
  if ($step6Back.length) {
    $step6Back.on('click', function() {
      goToStep(5);
    });
  }
  
  // Submit button for step 6
  if ($step6Submit.length) {
    $step6Submit.on('click', submitForm);
  }
  
  // Validation functions for Step 6
  function validateFirstName() {
    if (!$firstName.length) return;
    
    const value = $firstName.val().trim();
    
    if (value === '') {
      $firstName.addClass('is-invalid').removeClass('is-valid');
      firstNameValid = false;
    } else {
      $firstName.removeClass('is-invalid').addClass('is-valid');
      firstNameValid = true;
    }
    
    validateContactForm();
  }
  
  function validateEmail() {
    if (!$email.length) return;
    
    const value = $email.val().trim();
    
    if (!emailPattern.test(value)) {
      $email.addClass('is-invalid').removeClass('is-valid');
      emailValid = false;
    } else {
      $email.removeClass('is-invalid').addClass('is-valid');
      emailValid = true;
    }
    
    validateContactForm();
  }
  
  function validatePhone() {
    if (!$phoneNumber.length) return;
    
    // Extract digits only
    const digits = $phoneNumber.val().replace(/\D/g, '');
    
    if (digits.length !== 10) {
      $phoneNumber.addClass('is-invalid').removeClass('is-valid');
      phoneValid = false;
    } else {
      $phoneNumber.removeClass('is-invalid').addClass('is-valid');
      phoneValid = true;
    }
    
    validateContactForm();
  }
  
  function validateContactForm() {
    // Enable submit button only if all required fields are valid
    if ($step6Submit.length) {
      $step6Submit.prop('disabled', !(firstNameValid && emailValid && phoneValid));
    }
    
    // Update sticky button if present
    if ($stickyNext.length) {
      $stickyNext.prop('disabled', !(firstNameValid && emailValid && phoneValid));
    }
  }
  
  function submitForm() {
    if (!firstNameValid || !emailValid || !phoneValid) {
      return;
    }
    
    // Show loading state
    $step6Submit.addClass('submitting');
    if ($submitSpinner.length) $submitSpinner.removeClass('d-none');
    if ($submitText.length) $submitText.text('Saving...');
    $step6Submit.prop('disabled', true);
    
    // Also update sticky button if it exists
    if ($stickyNext.length) {
      $stickyNext.prop('disabled', true);
      $stickyNext.addClass('submitting');
      const $stickySpinner = $stickyNext.find('.spinner-border');
      const $stickyText = $stickyNext.find('span:not(.spinner-border)');
      if ($stickySpinner.length) $stickySpinner.removeClass('d-none');
      if ($stickyText.length) $stickyText.text('Saving...');
    }
    

    let fieldsData = {
      insuranceType: selectedInsuranceType,
      province: selectedProvince,
      gender: selectedGender,
      tobacco: selectedTobacco,
      coverage: selectedCoverage,
      dobDay: $dobDayInput.length ? $dobDayInput.val() : '',
      dobMonth: $dobMonthInput.length ? $dobMonthInput.val() : '',
      dobYear: $dobYearInput.length ? $dobYearInput.val() : '',
      insuranceAge: $insuranceAge.text() ? $insuranceAge.text() : '',
      name: $firstName.length ? $firstName.val() : '',
      email: $email.length ? $email.val() : '',
      phoneNumber: $phoneNumber.length ? $phoneNumber.val() : '',
      whatsappConsent: $whatsappConsent.length ? $whatsappConsent.prop('checked') : false
    }

    

    //send data to db
    // processing ajax request    
    sendRequest(fieldsData);


    
    // Simulate form submission with timeout, then show final questions
    setTimeout(function() {
      // Show loader first
      showQuoteLoader();
      
      // Wait a moment to show the final questions modal
      setTimeout(function() {
        try {
          if (finalQuestionsModal) {
            // Make sure first question is visible
            showQuestion(1);
            // Reset answers if reopening
            resetSelectedOptions();
            // Show the modal
            finalQuestionsModal.show();
            //console.log("Final questions modal opened");
          } else {
            console.error("Final questions modal instance not found");
            redirectToQuotesPage();
          }
        } catch (error) {
          console.error("Error showing final questions modal:", error);
          redirectToQuotesPage();
        }
      }, 1000);
    }, 2000);
  }
  
  // Insurance type switching in sidebar
  const $insuranceTypeLinks = $('.insurance-type-link');
  
  if ($insuranceTypeLinks.length > 0) {
    $insuranceTypeLinks.on('click', function(e) {
      e.preventDefault();
      
      const insuranceType = $(this).attr('data-insurance');
      
      // If it's the same as current, do nothing
      if (insuranceType === selectedInsuranceType) {
        if ($sidebar.length) $sidebar.removeClass('active');
        if ($overlay.length) {
          $overlay.removeClass('active');
          $overlay.css({
            'visibility': 'hidden',
            'opacity': '0',
            'pointer-events': 'none'
          });
        }
        return;
      }
      
      // Store new selection temporarily
      newInsuranceTypeSelected = insuranceType;
      
      // Show confirmation modal
      if (switchInsuranceModalInstance) {
        switchInsuranceModalInstance.show();
      }
    });
  }
  
  // Confirm insurance type switch
  const $confirmSwitchButton = $('#confirmSwitchInsurance');
  
  if ($confirmSwitchButton.length) {
    $confirmSwitchButton.on('click', function() {
      // Close modal
      if (switchInsuranceModalInstance) {
        switchInsuranceModalInstance.hide();
      }
      
      // Update selected insurance type
      selectedInsuranceType = newInsuranceTypeSelected;
      if ($selectedInsuranceText.length) {
        $selectedInsuranceText.text($(this).attr('data-insurance-name'));
      }
      
      // Update sidebar
      updateSidebarInsuranceType(selectedInsuranceType);
      
      // Reset to step 1
      goToStep(1);
      
      // Close sidebar
      if ($sidebar.length) $sidebar.removeClass('active');
      if ($overlay.length) {
        $overlay.removeClass('active');
        $overlay.css({
          'visibility': 'hidden',
          'opacity': '0',
          'pointer-events': 'none'
        });
      }
    });
  }
  
  // Navigation between steps
  if ($('#step1Next').length) {
    $('#step1Next').on('click', function() {
      goToStep(2);
    });
  }
  
  if ($('#step2Back').length) {
    $('#step2Back').on('click', function() {
      goToStep(1);
    });
  }
  
  if ($('#step2Next').length) {
    $('#step2Next').on('click', function() {
      goToStep(3);
    });
  }
  
  if ($('#step3Back').length) {
    $('#step3Back').on('click', function() {
      goToStep(2);
    });
  }
  
  if ($('#step4Back').length) {
    $('#step4Back').on('click', function() {
      goToStep(3);
    });
  }
  
  if ($('#step5Back').length) {
    $('#step5Back').on('click', function() {
      goToStep(4);
    });
  }
  
  if ($('#step5Next').length) {
    $('#step5Next').on('click', function() {
      goToStep(6);
    });
  }
  
  // Sticky CTA functionality for mobile
  if ($stickyNext.length) {
    // Initially sync sticky button state with the current step's button
    updateStickyButtonState();
    
    $stickyNext.on('click', function() {
      // Get current step's next button and click it
      const $currentStepElement = $(`.form-step[data-step="${currentStep}"]`);
      if (!$currentStepElement.length) return;
      
      if (currentStep === 6) {
        // For step 6, trigger the submit form function
        if ($step6Submit.length) $step6Submit.trigger('click');
        return;
      }
      
      const $nextButton = $currentStepElement.find('.btn-primary');
      if ($nextButton.length) {
        $nextButton.trigger('click');
      } else {
        // Auto-advance for steps with auto-advance
        const nextStep = currentStep + 1;
        if (nextStep <= totalSteps) {
          goToStep(nextStep);
        }
      }
    });
  }
  
  // Update sticky button state based on current step
  function updateStickyButtonState() {
    if (!$stickyNext.length || !$stickyCTA.length) return;
    
    // Get current step's next button
    const $currentStepElement = $(`.form-step[data-step="${currentStep}"]`);
    if (!$currentStepElement.length) return;
    
    // Special case for Step 6
    if (currentStep === 6) {
      const $submitButton = $('#step6Submit');
      
      if ($submitButton.length) {
        // Sync button state
        $stickyNext.prop('disabled', $submitButton.prop('disabled'));
        $stickyCTA.removeClass('hidden');
        
        // Update button text and handler for submit
        $stickyNext.html('<span class="spinner-border spinner-border-sm me-2 d-none"></span><span>Submit</span>');
        return;
      }
    }
    
    const $nextButton = $currentStepElement.find('.btn-primary');
    
    if ($nextButton.length) {
      // Sync disabled state
      $stickyNext.prop('disabled', $nextButton.prop('disabled'));
      
      // Show sticky button
      $stickyCTA.removeClass('hidden');
      
      // Reset button text for non-submit steps
      if (currentStep !== 6) {
        $stickyNext.html('Continue <i class="fas fa-arrow-right ms-2"></i>');
      }
    } else {
      // No next button on this step (auto-advance steps)
      switch (currentStep) {
        case 3: // Gender selection
        case 4: // Tobacco selection
          $stickyNext.prop('disabled', true); // Initially disabled until selection
          $stickyCTA.removeClass('hidden');
          break;
        default:
          $stickyCTA.addClass('hidden');
          break;
      }
    }
  }
  

  
  function updateSidebarInsuranceType(type) {
    // Remove active class from all links
    if ($insuranceTypeLinks.length === 0) return;
    
    $insuranceTypeLinks.removeClass('active');
    
    // Add active class to selected type
    const $activeLink = $(`.insurance-type-link[data-insurance="${type}"]`);
    if ($activeLink.length) {
      $activeLink.addClass('active');
    }
  }
  
  function updateProgressBar(step) {
    if (!$progressBar.length) return;
    
    const progress = (step - 1) / (totalSteps - 1) * 100;
    $progressBar.css('width', `${progress}%`);
    $progressBar.attr('aria-valuenow', progress);
  }
  
  function goToStep(step) {
    // Hide all steps
    const $formSteps = $('.form-step');
    if ($formSteps.length === 0) return;
    
    $formSteps.hide();
    
    // Show target step
    const $targetStep = $(`.form-step[data-step="${step}"]`);
    if ($targetStep.length) {
      $targetStep.show();
      
      // Add animation class and remove it after animation completes
      $targetStep.addClass('animate-fadeIn');
      setTimeout(function() {
        $targetStep.removeClass('animate-fadeIn');
      }, 500);
    }
    
    // Update progress bar
    updateProgressBar(step);
    
    // Update current step
    currentStep = step;
    
    // Update sticky button state
    updateStickyButtonState();
    
    // Update step info display
    if ($currentStepDisplay.length) {
      $currentStepDisplay.text(step);
    }
    
    // Show/hide step info in header (hidden on step 1)
    if ($stepInfo.length) {
      if (step === 1) {
        $stepInfo.addClass('d-none').removeClass('d-md-flex');
      } else {
        $stepInfo.removeClass('d-none').addClass('d-md-flex');
      }
    }
  }
  
  // Help button functionality
  const $helpButton = $('.help-button');
  if ($helpButton.length) {
    $helpButton.on('click', function() {
      // You would normally implement a help modal here
      alert('Need help? Our support team is available 9am-5pm EST at support@policyscanner.ca');
    });
  }
  
  // For privacy details toggle animation
  const $privacyCollapse = $('#privacyDetails');
  if ($privacyCollapse.length) {
    $privacyCollapse.on('show.bs.collapse', function () {
      const $chevron = $('.privacy-toggle .fa-chevron-down');
      if ($chevron.length) $chevron.css('transform', 'rotate(-180deg)');
    });

    $privacyCollapse.on('hide.bs.collapse', function () {
      const $chevron = $('.privacy-toggle .fa-chevron-down');
      if ($chevron.length) $chevron.css('transform', 'rotate(0)');
    });
  }
  
  // Initialize page
  updateProgressBar(currentStep);
});

// ==============================
// Final Questions Functions
// ==============================

// Show avatar message with auto-hide after 3 seconds
function showAvatarMessage() {
  const $avatarMessage = $('#avatarMessage');
  if ($avatarMessage.length) {
    $avatarMessage.addClass('show');
    
    // Auto-hide after 3 seconds
    clearTimeout(avatarMessageTimeout);
    avatarMessageTimeout = setTimeout(function() {
      $avatarMessage.removeClass('show');
    }, 3000);
  }
}

// Show the final questions modal
function showFinalQuestionsModal() {
  const $modalElement = $('#finalQuestionsModal');
  if ($modalElement.length) {
    try {
      if (!finalQuestionsModal) {
        finalQuestionsModal = new bootstrap.Modal($modalElement[0], {
          backdrop: 'static',
          keyboard: false
        });
      }
      
      // Reset questions to first one
      showQuestion(1);
      
      // Reset answers if reopening
      if (hasDismissedModal) {
        resetSelectedOptions();
      }
      
      // Show the modal
      finalQuestionsModal.show();
      //("Final questions modal shown from showFinalQuestionsModal");
      
      // Hide the banner if it was showing
      hideFloatingBanner();
    } catch (error) {
      console.error("Error showing final questions modal:", error);
      // If modal fails, redirect to quotes page
      redirectToQuotesPage();
    }
  } else {
    console.error("Final questions modal element not found");
    redirectToQuotesPage();
  }
}

// Show the floating banner as a fallback
function showFloatingBanner() {
  const $banner = $('#floatingBanner');
  if ($banner.length) {
    $banner.show();
  }
}

// Hide the floating banner
function hideFloatingBanner() {
  const $banner = $('#floatingBanner');
  if ($banner.length) {
    $banner.hide();
  }
}

// Show the quote loader background
function showQuoteLoader() {
  const $loaderBg = $('#quoteLoaderBg');
  if ($loaderBg.length) {
    $loaderBg.show();
    setTimeout(function() {
      $loaderBg.addClass('active');
    }, 100);
  }
}

// Hide the quote loader background
function hideQuoteLoader() {
  const $loaderBg = $('#quoteLoaderBg');
  if ($loaderBg.length) {
    $loaderBg.removeClass('active');
    setTimeout(function() {
      $loaderBg.hide();
    }, 300);
  }
}

// Switch between questions
function showQuestion(questionNumber) {
  const $question1 = $('#question1Container');
  const $question2 = $('#question2Container');
  const $currentQuestion = $('#currentQuestion');
  const $modalFooter = $('#modalFooter');
  const $mobileFooter = $('#mobileModalFooter');
  
  if (!$question1.length || !$question2.length) {
    console.error("Question containers not found");
    return;
  }
  
  if (questionNumber === 1) {
    // Hide Q2, show Q1
    if ($question2.hasClass('active')) {
      $question2.removeClass('active').addClass('exit');
      
      setTimeout(function() {
        $question2.removeClass('exit').hide();
        $question1.show();
        
        setTimeout(function() {
          $question1.addClass('active');
        }, 50);
      }, 300);
    } else {
      $question1.show().addClass('active');
    }
    
    if ($currentQuestion.length) $currentQuestion.text('1');
    
    // Hide footers on Q1
    if ($modalFooter.length) $modalFooter.hide();
    if ($mobileFooter.length) $mobileFooter.hide();
  } else if (questionNumber === 2) {
    // Hide Q1, show Q2
    $question1.removeClass('active').addClass('exit');
    
    setTimeout(function() {
      $question1.removeClass('exit').hide();
      $question2.show();
      
      setTimeout(function() {
        $question2.addClass('active');
      }, 50);
    }, 300);
    
    if ($currentQuestion.length) $currentQuestion.text('2');
    
    // Show footers on Q2
    if ($modalFooter.length) $modalFooter.show();
    if ($mobileFooter.length) $mobileFooter.show();
    
    // Enable/disable Show Quotes button based on whether an option is selected
    updateShowQuotesButton();
  }
}

// Go back to question 1
function goBackToQuestion1() {
  showQuestion(1);
}

// Handle medication option selection
function selectMedicationOption(value) {
  const $options = $('#question1Container .option-btn');
  if ($options.length === 0) {
    console.error("Medication option buttons not found");
    return;
  }
  
  $options.each(function() {
    if ($(this).attr('data-value') === value) {
      $(this).addClass('selected');
    } else {
      $(this).removeClass('selected');
    }
  });
  
  // Store the answer
  medicationStatus = value;
  //("Medication status set to:", value);
  
  // Auto-advance to next question
  setTimeout(function() {
    showQuestion(2);
  }, 500);
}

// Handle DUI option selection
function selectDUIOption(value) {
  const $options = $('#question2Container .option-btn');
  if ($options.length === 0) {
    console.error("DUI option buttons not found");
    return;
  }
  
  $options.each(function() {
    if ($(this).attr('data-value') === value) {
      $(this).addClass('selected');
    } else {
      $(this).removeClass('selected');
    }
  });
  
  // Store the answer
  duiStatus = value;
  //console.log("DUI status set to:", value);
  //redirectToQuotesPage();
  // Enable Show Quotes button
  //updateShowQuotesButton();
  
	hideQuoteLoader();
    redirectToQuotesPage();
}

// Update the Show Quotes button state
function updateShowQuotesButton() {
  const $showQuotesBtn = $('#showQuotesBtn');
  const $mobileShowQuotesBtn = $('#mobileShowQuotesBtn');
  
  if ($showQuotesBtn.length) {
    $showQuotesBtn.prop('disabled', !duiStatus);
  }
  
  if ($mobileShowQuotesBtn.length) {
    $mobileShowQuotesBtn.prop('disabled', !duiStatus);
  }
}

// Reset all selected options
function resetSelectedOptions() {
  $('.option-btn').removeClass('selected');
  
  medicationStatus = null;
  duiStatus = null;
  
  // Disable Show Quotes button
  updateShowQuotesButton();
}

// Redirect to the quotes page
function redirectToQuotesPage() {
  var medication = medicationStatus || 'not_answered';
  var dui = duiStatus || 'not_answered';
  
  redirectTo(medication, dui);

}