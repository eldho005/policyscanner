/**
 * PolicyScanner - Paid Riders Sidebar JavaScript
 * Using BEM methodology to avoid clashes with other scripts
 */

// Immediately Invoked Function Expression (IIFE) to avoid polluting global namespace
(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Paid Riders component
    prInitSidebar();
  });

  /**
   * Initialize the Paid Riders sidebar component
   */
  function prInitSidebar() {
    // Sidebar elements
    const prSidebar = document.getElementById('prSidebar');
    const prBackdrop = document.getElementById('prBackdrop');
    //const prOpenBtn = document.getElementById('prOpenBtn');
    const prCloseBtn = document.getElementById('prCloseBtn');
    const prCancelBtn = document.querySelector('.pr-actions__cancel');
    const prUpdateBtn = document.querySelector('.pr-actions__update');
    
    // Early exit if required elements aren't found
    if (!prSidebar || !prBackdrop) {
      console.warn('Policy Riders: Required elements not found');
      return;
    }
    
    // Filter tabs
    const prFilterTabs = document.querySelectorAll('.pr-filter__tab');
    const prRiderCards = document.querySelectorAll('.pr-card');
    
    // Section headers
    const prSectionHeaders = document.querySelectorAll('.pr-card__header');
    
    // Attach event listeners
    prAttachEventListeners();
    prInitFilterTabs();
    prInitCollapseSections();
    prInitToggleSwitches();
    
    /**
     * Attach event listeners to sidebar controls
     */
    function prAttachEventListeners() {
      // Open sidebar when button is clicked
      //prOpenBtn.addEventListener('click', prOpenSidebar);
      $(document).on('click', '.openPaidRiders', function(){
		  prOpenSidebar();
	  });
	  
      // Close sidebar when close button is clicked
      if (prCloseBtn) {
        prCloseBtn.addEventListener('click', prCloseSidebar);
      }
      
      // Close sidebar when backdrop is clicked
      prBackdrop.addEventListener('click', prCloseSidebar);
      
      // Close sidebar with Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && prSidebar.classList.contains('pr-sidebar--visible')) {
          prCloseSidebar();
        }
      });
      
      // Action buttons
      if (prCancelBtn) {
        prCancelBtn.addEventListener('click', prCloseSidebar);
      }
      
      if (prUpdateBtn) {
        prUpdateBtn.addEventListener('click', prUpdatePolicy);
      }
    }
    
    /**
     * Open the sidebar
     */
    function prOpenSidebar() {
      prSidebar.classList.add('pr-sidebar--visible');
      prBackdrop.classList.add('pr-backdrop--visible');
      document.body.style.overflow = 'hidden'; // Prevent scrolling of background
    }
    
    /**
     * Close the sidebar
     */
    function prCloseSidebar() {
      prSidebar.classList.remove('pr-sidebar--visible');
      prBackdrop.classList.remove('pr-backdrop--visible');
      // Add a small delay before enabling scroll to ensure smooth transition
      setTimeout(() => {
        document.body.style.overflow = ''; // Restore scrolling
      }, 400);
    }
    
    /**
     * Initialize filter tabs functionality
     */
    function prInitFilterTabs() {
      // Set initial styles for smooth transitions
      prRiderCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease';
        card.style.opacity = '1';
      });
      
      prFilterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
          // Remove active class from all tabs
          prFilterTabs.forEach(t => t.classList.remove('pr-filter__tab--active'));
          // Add active class to clicked tab
          this.classList.add('pr-filter__tab--active');
          
          // Get filter category
          const filter = this.getAttribute('data-filter');
          
          // Filter rider cards with fade effect
          prRiderCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
              // First set opacity to 0
              card.style.opacity = '0';
              // Then after a short delay, make it visible and fade in
              setTimeout(() => {
                card.style.display = 'block';
                card.style.opacity = '1';
              }, 50);
            } else {
              // Fade out then hide
              card.style.opacity = '0';
              setTimeout(() => {
                card.style.display = 'none';
              }, 300);
            }
          });
        });
      });
    }
    
    /**
     * Initialize collapse functionality for sections
     */
    function prInitCollapseSections() {
      prSectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const targetId = this.getAttribute('data-bs-target');
          const target = document.querySelector(targetId);
          const chevron = this.querySelector('.pr-card__chevron');
          
          // Toggle the chevron icon
          if (target.classList.contains('show')) {
            chevron.classList.remove('pr-card__chevron--active');
          } else {
            chevron.classList.add('pr-card__chevron--active');
          }
          
          // Bootstrap's collapse will handle the actual toggling
          // This is just for the icon animation
        });
      });
      
      // Initialize Bootstrap collapse for all sections
      const prCollapseElements = document.querySelectorAll('.pr-card__collapse');
      prCollapseElements.forEach(collapse => {
        new bootstrap.Collapse(collapse, {
          toggle: collapse.classList.contains('show')
        });
      });
    }
    
    /**
     * Initialize toggle switches
     */
    function prInitToggleSwitches() {
      document.querySelectorAll('.pr-toggle__input').forEach(input => {
        input.addEventListener('change', function() {
          const riderName = this.closest('.pr-card__collapse')
                              .previousElementSibling
                              .querySelector('.pr-card__title')
                              .textContent;
          if(this.checked) {
            console.log(`Added rider: ${riderName}`);
          } else {
            console.log(`Removed rider: ${riderName}`);
          }
        });
      });
    }
    
    /**
     * Handle policy update
     */
    function prUpdatePolicy() {
      // Get all checked riders
      const prSelectedRiders = [];
      document.querySelectorAll('.pr-toggle__input:checked').forEach(checkbox => {
        const riderName = checkbox.closest('.pr-card__collapse')
                            .previousElementSibling
                            .querySelector('.pr-card__title')
                            .textContent;
        prSelectedRiders.push(riderName);
      });
      
      // Show success message with selected riders
      let message = 'Your policy has been updated with:';
      if (prSelectedRiders.length > 0) {
        prSelectedRiders.forEach(rider => {
          message += `\n- ${rider}`;
        });
      } else {
        message = 'Your policy has been updated with no additional riders.';
      }
      
      alert(message);
      prCloseSidebar();
    }
  }
})();