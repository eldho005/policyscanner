/**
 * No Medical Insurance Sidebar
 * Using BEM methodology to avoid clashes with other scripts
 */

// Immediately Invoked Function Expression (IIFE) to avoid polluting global namespace
(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize the No Medical Insurance sidebar component
    nmiInitSidebar();
  });

  /**
   * Initialize the No Medical Insurance sidebar component
   */
  function nmiInitSidebar() {
    // Sidebar Elements
    const nmiSidebar = document.getElementById('nmiSidebar');
    const nmiBackdrop = document.getElementById('nmiBackdrop');
    //const nmiOpenBtn = document.getElementById('nmiOpenBtn');
    const nmiCloseBtn = document.getElementById('nmiCloseBtn');
    const nmiCtaBtn = document.getElementById('nmiCtaBtn');
    
    // Early exit if required elements aren't found
    if (!nmiSidebar || !nmiBackdrop) {
      console.warn('No Medical Insurance: Required elements not found');
      return;
    }
    
    // Accordion Elements
    const nmiAccordionHeaders = document.querySelectorAll('.nmi-accordion__header');
    
    // Attach event listeners
    nmiAttachEventListeners();
    nmiInitAccordion();
    
    /**
     * Attach event listeners to sidebar controls
     */
    function nmiAttachEventListeners() {
      // Open sidebar when button is clicked
      //nmiOpenBtn.addEventListener('click', nmiOpenSidebar);
      $(document).on('click', '.openNoMedicalSidebarBtn', function(){
		  nmiOpenSidebar();
	  });
	  
      // Close sidebar with X button
      if (nmiCloseBtn) {
        nmiCloseBtn.addEventListener('click', nmiCloseSidebar);
      }
      
      // Close sidebar with "Back to Comparison" button
      if (nmiCtaBtn) {
        nmiCtaBtn.addEventListener('click', nmiCloseSidebar);
      }
      
      // Close on backdrop click
      nmiBackdrop.addEventListener('click', nmiCloseSidebar);
      
      // Close sidebar with Escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nmiSidebar.classList.contains('nmi-sidebar--visible')) {
          nmiCloseSidebar();
        }
      });
    }
    
    /**
     * Open the sidebar
     */
    function nmiOpenSidebar() {
      nmiSidebar.classList.add('nmi-sidebar--visible');
      nmiBackdrop.classList.add('nmi-backdrop--visible');
      document.body.style.overflow = 'hidden'; // Prevent scrolling of background
    }
    
    /**
     * Close the sidebar
     */
    function nmiCloseSidebar() {
      nmiSidebar.classList.remove('nmi-sidebar--visible');
      nmiBackdrop.classList.remove('nmi-backdrop--visible');
      // Add a small delay before enabling scroll to ensure smooth transition
      setTimeout(() => {
        document.body.style.overflow = ''; // Restore scrolling
      }, 300);
    }
    
    /**
     * Initialize accordion functionality
     */
    function nmiInitAccordion() {
      if (!nmiAccordionHeaders || !nmiAccordionHeaders.length) return;
      
      nmiAccordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
          // Toggle active class on the clicked header
          this.classList.toggle('nmi-accordion__header--active');
          
          // Find the content element that follows this header
          const content = this.nextElementSibling;
          if (content && content.classList.contains('nmi-accordion__content')) {
            content.classList.toggle('nmi-accordion__content--visible');
          }
          
          // If we want only one accordion open at a time, close others
          if (this.classList.contains('nmi-accordion__header--active')) {
            nmiAccordionHeaders.forEach(otherHeader => {
              if (otherHeader !== this) {
                otherHeader.classList.remove('nmi-accordion__header--active');
                const otherContent = otherHeader.nextElementSibling;
                if (otherContent && otherContent.classList.contains('nmi-accordion__content')) {
                  otherContent.classList.remove('nmi-accordion__content--visible');
                }
              }
            });
          }
        });
      });
      
      // Open the first accordion by default
      if (nmiAccordionHeaders.length > 0) {
        nmiAccordionHeaders[0].classList.add('nmi-accordion__header--active');
        const firstContent = nmiAccordionHeaders[0].nextElementSibling;
        if (firstContent && firstContent.classList.contains('nmi-accordion__content')) {
          firstContent.classList.add('nmi-accordion__content--visible');
        }
      }
    }
  }
})();