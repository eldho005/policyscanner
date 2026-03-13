/**
* PolicyScanner - Sidebar Script
* Version: 1.1
* Last updated: April 24, 2025
*/

document.addEventListener('DOMContentLoaded', function() {
   // Sidebar elements
   const sidebar = document.getElementById('wholeLifeSidebar');
   const backdrop = document.getElementById('sidebarBackdrop');
   //const openSidebarBtn = document.getElementById('openSidebarBtn');
   const closeSidebarBtn = document.getElementById('closeSidebarBtn');
   
   // Insurance type tabs
   const insuranceTabs = document.querySelectorAll('.insurance-tab');
   const tabContents = document.querySelectorAll('.tab-content');
   
   // Open sidebar when button is clicked
  // openSidebarBtn.addEventListener('click', function() {
   $(document).on('click', '.openSidebarBtn', function() {
       sidebar.classList.add('show');
       backdrop.classList.add('show');
       document.body.style.overflow = 'hidden'; // Prevent scrolling of background
       
       // Announce to screen readers
       document.getElementById('sidebarTitle').setAttribute('aria-live', 'polite');
       
       // Focus on the sidebar for accessibility
       sidebar.focus();
   });
   
   // Close sidebar when close button is clicked
   closeSidebarBtn.addEventListener('click', function() {
       closeSidebar();
   });
   
   // Close sidebar when backdrop is clicked
   backdrop.addEventListener('click', function() {
       closeSidebar();
   });
   
   // Function to close sidebar
   function closeSidebar() {
       sidebar.classList.remove('show');
       backdrop.classList.remove('show');
       document.body.style.overflow = ''; // Restore scrolling
       
       // Return focus to the opener button
       //openSidebarBtn.focus();
   }
   
   // Tab switching
   insuranceTabs.forEach(tab => {
       tab.addEventListener('click', function() {
           // Remove active class from all tabs
           insuranceTabs.forEach(t => {
               t.classList.remove('active');
               t.setAttribute('aria-selected', 'false');
           });
           
           // Add active class to clicked tab
           this.classList.add('active');
           this.setAttribute('aria-selected', 'true');
           
           // Hide all tab contents
           tabContents.forEach(content => {
               content.classList.remove('active');
               content.setAttribute('aria-hidden', 'true');
           });
           
           // Show content for active tab
           const tabId = this.getAttribute('data-tab');
           const activeContent = document.getElementById(tabId);
           activeContent.classList.add('active');
           activeContent.setAttribute('aria-hidden', 'false');
       });
       
       // Keyboard accessibility for tabs
       tab.addEventListener('keydown', function(e) {
           if (e.key === 'Enter' || e.key === ' ') {
               e.preventDefault();
               this.click();
           }
       });
   });
   
   // Close sidebar with Escape key
   document.addEventListener('keydown', function(e) {
       if (e.key === 'Escape' && sidebar.classList.contains('show')) {
           closeSidebar();
       }
   });
   
   // Add smooth scrolling when opening sections
   document.querySelectorAll('.collapse').forEach(collapse => {
       collapse.addEventListener('shown.bs.collapse', function() {
           const header = document.querySelector(`[data-bs-target="#${this.id}"]`);
           if (header) {
               setTimeout(() => {
                   header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
               }, 100);
           }
       });
   });
   
   // Keyboard event handler for the entire sidebar to improve focus trap
   sidebar.addEventListener('keydown', function(e) {
       if (e.key === 'Tab') {
           const focusableElements = sidebar.querySelectorAll(
               'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
           );
           const firstElement = focusableElements[0];
           const lastElement = focusableElements[focusableElements.length - 1];
           
           // If pressing Tab and focus is on the last element, loop to the first
           if (!e.shiftKey && document.activeElement === lastElement) {
               e.preventDefault();
               firstElement.focus();
           }
           
           // If pressing Shift+Tab and focus is on the first element, loop to the last
           if (e.shiftKey && document.activeElement === firstElement) {
               e.preventDefault();
               lastElement.focus();
           }
       }
   });
   
   // Force browser focus to the close button when the sidebar is fully open
   sidebar.addEventListener('transitionend', function(e) {
       if (e.propertyName === 'right' && sidebar.classList.contains('show')) {
           closeSidebarBtn.focus();
       }
   });
});