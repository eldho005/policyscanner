/**
 * Mortgage Insurance Sidebar Functionality
 * Handles sidebar opening/closing, tabs, and accordion interactions
 */

document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements for performance
  const sidebarEl = document.getElementById('insuranceSidebar');
  const backdropEl = document.getElementById('sidebarBackdrop');
  //const openBtn = document.getElementById('openSidebarBtn');
  const closeBtn = document.getElementById('closeSidebar');
  const compareBtn = document.getElementById('compareOptionsBtn');
  const planTabs = document.querySelectorAll('.insurance-tab');
  const planContents = document.querySelectorAll('.insurance-content');
  
  // Handle sidebar opening and closing
  function openSidebar() {
      sidebarEl.classList.add('active');
      backdropEl.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling of background
      
      // Set focus on close button for accessibility
      setTimeout(() => closeBtn.focus(), 100);
      
      // Add ARIA attributes
      sidebarEl.setAttribute('aria-hidden', 'false');
      backdropEl.setAttribute('aria-hidden', 'false');
  }
  
  function closeSidebar() {
      sidebarEl.classList.remove('active');
      backdropEl.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
      
      // Return focus to the open button
      //openBtn.focus();
      
      // Update ARIA attributes
      sidebarEl.setAttribute('aria-hidden', 'true');
      backdropEl.setAttribute('aria-hidden', 'true');
  }
  
  // Event listeners using proper event delegation where possible
  // if (openBtn) {
      // openBtn.addEventListener('click', openSidebar);
  // }
  $(document).on('click', '.openSidebarBtn', function(){
	  openSidebar();
  });
  
  if (closeBtn) {
      closeBtn.addEventListener('click', closeSidebar);
  }
  
  if (backdropEl) {
      backdropEl.addEventListener('click', closeSidebar);
  }
  
  // Handle tabs with event delegation
  if (planTabs.length > 0) {
      const tabContainer = planTabs[0].parentElement;
      tabContainer.addEventListener('click', function(e) {
          const tab = e.target.closest('.insurance-tab');
          if (!tab) return;
          
          // Get the plan ID
          const planId = tab.getAttribute('data-plan');
          if (!planId) return;
          
          // Update tab states
          planTabs.forEach(t => {
              t.classList.remove('active');
              t.setAttribute('aria-selected', 'false');
              t.setAttribute('tabindex', '-1');
          });
          
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          tab.setAttribute('tabindex', '0');
          
          // Update content visibility
          planContents.forEach(content => {
              content.classList.remove('active');
              if (content.id === planId + '-plan') {
                  content.classList.add('active');
              }
          });
      });
      
      // Keyboard navigation for tabs
      tabContainer.addEventListener('keydown', function(e) {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
              e.preventDefault();
              
              const currentTab = document.querySelector('.insurance-tab[aria-selected="true"]');
              let nextTab;
              
              if (e.key === 'ArrowRight') {
                  nextTab = currentTab.nextElementSibling || planTabs[0];
              } else {
                  nextTab = currentTab.previousElementSibling || planTabs[planTabs.length - 1];
              }
              
              if (nextTab) {
                  nextTab.click();
                  nextTab.focus();
              }
          }
      });
  }
  
  // Compare options button
  if (compareBtn) {
      compareBtn.addEventListener('click', function() {
          alert('This would open a detailed comparison tool in the live version.');
      });
  }
  
  // Close with ESC key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebarEl && sidebarEl.classList.contains('active')) {
          closeSidebar();
      }
  });
  
  // Initialize ARIA attributes
  if (sidebarEl) {
      sidebarEl.setAttribute('aria-hidden', 'true');
  }
  
  if (backdropEl) {
      backdropEl.setAttribute('aria-hidden', 'true');
  }
  
  planTabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
  });
  
  planContents.forEach((content, index) => {
      content.setAttribute('role', 'tabpanel');
      content.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
  });
});