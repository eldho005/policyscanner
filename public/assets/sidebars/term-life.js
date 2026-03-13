/**
 * PolicyScanner - Term Insurance Sidebar JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Sidebar elements
  const sidebar = document.getElementById('termInsuranceSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  //const openSidebarBtn = document.querySelectorAll('.openSidebarBtn');
  const closeSidebarBtn = document.getElementById('closeSidebarBtn');
  const scheduleBtn = document.getElementById('scheduleCallBtn');
  
  // Coverage calculator elements
  const incomeSlider = document.getElementById('income-slider');
  const multiplierSlider = document.getElementById('multiplier-slider');
  const incomeValue = document.getElementById('income-value');
  const multiplierValue = document.getElementById('multiplier-value');
  const coverageResult = document.getElementById('coverage-result');
  
  // Term selection
  const termOptions = document.querySelectorAll('.term-option');
  
  // Open sidebar when button is clicked
  //openSidebarBtn.addEventListener('click', function() {
$(document).on('click', '.openSidebarBtn', function(){
      sidebar.classList.add('show');
      backdrop.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent scrolling of background
  });
  
  // Close sidebar function
  function closeSidebar() {
      sidebar.classList.remove('show');
      backdrop.classList.remove('show');
      // Add a small delay before enabling scroll to ensure smooth transition
      setTimeout(() => {
          document.body.style.overflow = ''; // Restore scrolling
      }, 400);
  }
  
  // Close sidebar when close button is clicked
  closeSidebarBtn.addEventListener('click', closeSidebar);
  
  // Close sidebar when backdrop is clicked
  backdrop.addEventListener('click', closeSidebar);
  
  // Close sidebar with Escape key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && sidebar.classList.contains('show')) {
          closeSidebar();
      }
  });
  
  // Schedule call button
  if (scheduleBtn) {
      scheduleBtn.addEventListener('click', function() {
          alert('Thank you for your interest! A representative will contact you shortly to schedule a call.');
      });
  }
  
  // Coverage calculator function
  function updateCoverageCalculation() {
      if (!incomeSlider || !multiplierSlider) return;
      
      const income = parseInt(incomeSlider.value);
      const multiplier = parseInt(multiplierSlider.value);
      const coverage = income * multiplier;
      
      incomeValue.textContent = formatCurrency(income);
      multiplierValue.textContent = multiplier;
      coverageResult.textContent = formatCurrency(coverage);
  }
  
  // Format currency function
  function formatCurrency(value) {
      return new Intl.NumberFormat('en-US', { 
          maximumFractionDigits: 0 
      }).format(value);
  }
  
  // Add event listeners for sliders
  if (incomeSlider && multiplierSlider) {
      incomeSlider.addEventListener('input', updateCoverageCalculation);
      multiplierSlider.addEventListener('input', updateCoverageCalculation);
      
      // Initialize values
      updateCoverageCalculation();
  }
  
  // Term selection
  if (termOptions) {
      termOptions.forEach(option => {
          option.addEventListener('click', function() {
              termOptions.forEach(opt => opt.classList.remove('selected'));
              this.classList.add('selected');
              
              // Get the term value for future use
              const termValue = this.getAttribute('data-term');
              console.log(`Selected term: ${termValue} years`);
              
              // Here you could update the price/coverage display or other elements
              // based on the selected term
          });
      });
  }
  
  // Initialize Bootstrap collapse for all accordion sections
  const accordionButtons = document.querySelectorAll('.accordion-button');
  
  accordionButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Toggle expanded/collapsed state is handled by Bootstrap
          // This is just for any additional custom behavior
      });
  });
  
  // Add smooth animations to accordion
  const collapseElements = document.querySelectorAll('.accordion-collapse');
  collapseElements.forEach(collapse => {
      collapse.addEventListener('show.bs.collapse', function() {
          const button = document.querySelector(`[data-bs-target="#${this.id}"]`);
          button.classList.remove('collapsed');
      });
      
      collapse.addEventListener('hide.bs.collapse', function() {
          const button = document.querySelector(`[data-bs-target="#${this.id}"]`);
          button.classList.add('collapsed');
      });
  });
});