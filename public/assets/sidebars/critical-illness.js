document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const sidebarEl = document.getElementById('ciSidebar');
  const backdropEl = document.getElementById('sidebarBackdrop');
  //const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebar');
  const scheduleBtn = document.getElementById('scheduleCallBtn');
  const planTabs = document.querySelectorAll('.plan-tab');
  const planContents = document.querySelectorAll('.plan-content');
  const termOptions = document.querySelectorAll('.term-option');
  
  // Open sidebar
  //openBtn.addEventListener('click', function() {
  $(document).on('click', '.openSidebarBtn', function() {
      sidebarEl.classList.add('active');
      backdropEl.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent body scrolling
      
      // Focus the first focusable element for accessibility
      setTimeout(() => {
          const firstFocusable = sidebarEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (firstFocusable) {
              firstFocusable.focus();
          }
      }, 100);
  });
  
  // Close sidebar
  function closeSidebar() {
      sidebarEl.classList.remove('active');
      backdropEl.classList.remove('active');
      document.body.style.overflow = ''; // Restore body scrolling
      
      // Return focus to the open button
      //openBtn.focus();
  }
  
  // Close button click
  closeBtn.addEventListener('click', closeSidebar);
  
  // Backdrop click
  backdropEl.addEventListener('click', closeSidebar);
  
  // Plan tabs
  planTabs.forEach(tab => {
      tab.addEventListener('click', function() {
          // Remove active class from all tabs
          planTabs.forEach(t => t.classList.remove('active'));
          
          // Add active class to clicked tab
          this.classList.add('active');
          
          // Show corresponding content
          const planId = this.getAttribute('data-plan');
          planContents.forEach(content => {
              content.classList.remove('active');
              if (content.id === planId + '-plan') {
                  content.classList.add('active');
              }
          });
      });
  });
  
  // Term length options
  termOptions.forEach(option => {
      option.addEventListener('click', function() {
          // Remove selected class from all options in the same group
          const optionsContainer = this.closest('.term-options');
          optionsContainer.querySelectorAll('.term-option').forEach(opt => {
              opt.classList.remove('selected');
          });
          
          // Add selected class to clicked option
          this.classList.add('selected');
          
          // Update price display - This would be replaced with actual functionality in production
          const termLength = this.querySelector('.term-length').textContent;
          const termPrice = this.querySelector('.term-price').textContent;
          console.log(`Selected term: ${termLength} at ${termPrice}`);
          
          // Here you would typically update the displayed monthly cost
      });
  });
  
  // Schedule call button
  scheduleBtn.addEventListener('click', function() {
      // In a real implementation, this would open a scheduling modal or redirect
      console.log('Schedule call clicked');
      alert('This would open a scheduling interface in the live version.');
  });
  
  // Close sidebar with Escape key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebarEl.classList.contains('active')) {
          closeSidebar();
      }
  });
  
  // Accessibility enhancements
  sidebarEl.setAttribute('role', 'dialog');
  sidebarEl.setAttribute('aria-modal', 'true');
  sidebarEl.setAttribute('aria-labelledby', 'sidebar-title');
  
  // Focus trap for better accessibility
  sidebarEl.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
          const focusableElements = sidebarEl.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          // If shift+tab and focus is on first element, move to last element
          if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
          }
          // If tab and focus is on last element, move to first element
          else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
          }
      }
  });
  
  // Initialize first item if none are selected
  const initializeSelections = () => {
      document.querySelectorAll('.term-options').forEach(container => {
          const hasSelected = container.querySelector('.term-option.selected');
          if (!hasSelected && container.querySelector('.term-option')) {
              container.querySelector('.term-option').classList.add('selected');
          }
      });
  };
  
  // Call initialization
  initializeSelections();
});