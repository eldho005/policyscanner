/**
 * Free Riders Sidebar - PolicyScanner
 * Using BEM methodology to avoid clashes with other scripts
 */

// Immediately Invoked Function Expression (IIFE) to avoid polluting global namespace
(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the Free Riders component
    frInitSidebar();
	
	 
  });
  
  
  document.addEventListener('click', function(event) {
  if (event.target.matches('.openRiders')) {
    // Code to execute when the new element is clicked
    //console.log('New element clicked!');
	setTimeout(() => {
	frInitSidebar();
	}, 1000);
  }
});

  /**
   * Initialize the Free Riders sidebar component
   */
  function frInitSidebar() {
    // Sidebar elements
    const frSidebar = document.getElementById('frSidebar');
    const frBackdrop = document.getElementById('frBackdrop');
    //const frOpenBtn = document.getElementById('openFreeRiders');
    const frCloseBtn = document.getElementById('frCloseBtn');
    const frActionBtn = document.getElementById('frActionBtn');
    
    // Early exit if required elements aren't found
    if (!frSidebar || !frBackdrop) {
      console.warn('Free Riders: Required elements not found');
      return;
    }
	
	$(document).on('click', '.openRiders', function(){
		
		//console.log('clicked: openFreeRiders');
		frOpenSidebar();
	
	});
    
    // Filter tabs
    const frFilterTabs = document.querySelectorAll('.fr-filter__tab');
    const frRiderCards = document.querySelectorAll('.fr-card');
    
    // Section headers
    const frSectionHeaders = document.querySelectorAll('.fr-card__header');
    
    // Attach event listeners
    frAttachEventListeners();
    frInitFilterTabs();
    frInitCollapseSections();
    
    /**
     * Attach event listeners to sidebar controls
     */
    function frAttachEventListeners() {
      // Open sidebar when button is clicked
      //frOpenBtn.addEventListener('click', frOpenSidebar);
      
      // Close sidebar when close button is clicked
      if (frCloseBtn) {
        frCloseBtn.addEventListener('click', frCloseSidebar);
      }
	  
	  

      
      // Close sidebar when backdrop is clicked
      frBackdrop.addEventListener('click', frCloseSidebar);
      
      // Close sidebar when "Got It" button is clicked
      if (frActionBtn) {
        frActionBtn.addEventListener('click', frCloseSidebar);
      }
      
      // Close sidebar with Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && frSidebar.classList.contains('fr-sidebar--visible')) {
          frCloseSidebar();
        }
      });
    }
    
    /**
     * Open the sidebar
     */
    function frOpenSidebar() {
      frSidebar.classList.add('fr-sidebar--visible');
      frBackdrop.classList.add('fr-backdrop--visible');
      document.body.style.overflow = 'hidden'; // Prevent scrolling of background
    }
    
    /**
     * Close the sidebar
     */
    function frCloseSidebar() {
      frSidebar.classList.remove('fr-sidebar--visible');
      frBackdrop.classList.remove('fr-backdrop--visible');
      // Add a small delay before enabling scroll to ensure smooth transition
      setTimeout(() => {
        document.body.style.overflow = ''; // Restore scrolling
      }, 300);
    }
    
    /**
     * Initialize filter tabs functionality
     */
    function frInitFilterTabs() {
      frFilterTabs.forEach(tab => {

        tab.addEventListener('click', function() {
          // Remove active class from all tabs
          frFilterTabs.forEach(t => t.classList.remove('fr-filter__tab--active'));
          // Add active class to clicked tab
          this.classList.add('fr-filter__tab--active');
          
          // Get filter category
          const filter = this.getAttribute('data-filter');
          console.log('ddddddddd', filter)
          // Filter rider cards with fade effect
          frRiderCards.forEach(card => {
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

      // Set initial styles for smooth transitions
      frRiderCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease';
        card.style.opacity = '1';
      });
    }
    
    /**
     * Initialize collapse functionality for sections
     */
    function frInitCollapseSections() {
      frSectionHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const targetId = this.getAttribute('data-toggle-id');
          const target = document.getElementById(targetId);
          const chevron = this.querySelector('.fr-card__chevron');
          
          if (target.classList.contains('fr-card__content--visible')) {
            target.classList.remove('fr-card__content--visible');
            chevron.classList.remove('fr-card__chevron--active');
          } else {
            target.classList.add('fr-card__content--visible');
            chevron.classList.add('fr-card__chevron--active');
          }
        });
      });
    }
  }
})();