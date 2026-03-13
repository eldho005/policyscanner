/**
 * PolicyScanner - Main JavaScript
 * Handles all interactive functionality for the homepage
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavbar();
  initAnimations();
  initCarousel();
  initFAQs();

  // Additional initializations can be added here as needed
});

/**
 * Navbar & Mega Menu Functionality
 * Enhances Bootstrap's default dropdown behavior
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const dropdowns = document.querySelectorAll('.navbar .dropdown');
  
  // Add scroll behavior to navbar
  window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });

  // Enhanced mega menu interactions
  dropdowns.forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    
    // Hover behavior on larger screens
    if (window.innerWidth >= 992) {
      dropdown.addEventListener('mouseenter', function() {
        if (!menu.classList.contains('show')) {
          toggle.click(); // Trigger Bootstrap's dropdown
        }
      });
      
      dropdown.addEventListener('mouseleave', function() {
        if (menu.classList.contains('show')) {
          toggle.click(); // Close dropdown
        }
      });
    }
    
    // Add transition class after menu is fully shown for animations
    toggle.addEventListener('shown.bs.dropdown', function() {
      menu.classList.add('show-complete');
    });
    
    toggle.addEventListener('hidden.bs.dropdown', function() {
      menu.classList.remove('show-complete');
    });
  });
  
  // Handle mobile menu interactions
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  if (navbarToggler) {
    navbarToggler.addEventListener('click', function() {
      // Add body class when mobile menu is open
      if (navbarCollapse.classList.contains('show')) {
        document.body.classList.remove('mobile-menu-open');
      } else {
        document.body.classList.add('mobile-menu-open');
      }
    });
  }
  
  // Close mobile menu when clicking on a link that goes to an anchor on the same page
  document.querySelectorAll('.navbar-nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      // Only on mobile
      if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
        navbarToggler.click(); // Close the menu
      }
    });
  });
}

/**
 * Scroll Animations for elements with fade-in-top class
 * Adds animation when elements come into viewport
 */
function initAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in-top');
  
  // Intersection Observer to detect when elements enter viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    root: null, // viewport
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
  });
  
  // Start observing all fade elements
  fadeElements.forEach(element => {
    observer.observe(element);
  });
  
  // Trigger animation for elements already in viewport on page load
  setTimeout(() => {
    fadeElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        element.classList.add('active');
        observer.unobserve(element);
      }
    });
  }, 100);
}

/**
 * Carousel for the "How It Works" section
 * Enhances Bootstrap carousel with additional interactions
 */
function initCarousel() {
  const carousel = document.getElementById('processCarousel');
  
  if (!carousel) return;
  
  // Bootstrap Carousel is initialized via data attributes
  // Adding additional functionality here
  
  // Update the step highlights based on the active carousel slide
  carousel.addEventListener('slide.bs.carousel', function(event) {
    const nextIndex = event.to;
    const steps = document.querySelectorAll('.step-item');
    
    // Highlight the current step
    steps.forEach((step, index) => {
      if (index === nextIndex) {
        step.classList.add('step-active');
      } else {
        step.classList.remove('step-active');
      }
    });
  });
  
  // Sync step clicks with carousel
  document.querySelectorAll('.step-item').forEach((step, index) => {
    step.addEventListener('click', function() {
      // Using Bootstrap's JavaScript API to move to specific slide
      bootstrap.Carousel.getInstance(carousel).to(index);
    });
  });
  
  // Add hover pause functionality
  carousel.addEventListener('mouseenter', function() {
    bootstrap.Carousel.getInstance(carousel).pause();
  });
  
  carousel.addEventListener('mouseleave', function() {
    bootstrap.Carousel.getInstance(carousel).cycle();
  });
}

/**
 * FAQ Section Functionality
 * Enhances accordion behavior
 */
function initFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    // Add click effect
    question.addEventListener('click', function() {
      // Toggle active state for styling
      setTimeout(() => {
        if (!question.classList.contains('collapsed')) {
          item.classList.add('faq-active');
        } else {
          item.classList.remove('faq-active');
        }
      }, 200);
    });
    
    // Accessibility enhancement - keyboard support
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });
}

/**
 * Utility Functions
 */

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    
    // Make sure the target exists
    if (targetId === '#' || !document.querySelector(targetId)) return;
    
    const targetElement = document.querySelector(targetId);
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
    
    window.scrollTo({
      top: targetPosition - navbarHeight - 20, // Offset for navbar and some padding
      behavior: 'smooth'
    });
  });
});

// Handle form submissions
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    
    if (submitButton) {
      const originalText = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...';
      
      // Simulate form submission (replace with actual submission logic)
      setTimeout(() => {
        // Reset button and show success message
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Display success message
        const formParent = form.parentElement;
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success mt-3';
        successMessage.textContent = 'Thanks for subscribing!';
        formParent.appendChild(successMessage);
        
        // Clear inputs
        form.reset();
        
        // Remove success message after delay
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }, 1000);
    }
  });
});

// Track conversions on CTA buttons (example - would be replaced with actual tracking code)
document.querySelectorAll('.btn-cta, .btn-quote, .btn-featured, .btn-orange').forEach(button => {
  button.addEventListener('click', function() {
    // Example tracking function (replace with actual implementation)
    trackConversion(this.textContent.trim());
  });
});

// Placeholder tracking function
function trackConversion(label) {
  console.log(`Conversion tracked: ${label}`);
  // This would be replaced with actual analytics code
  // Example: gtag('event', 'conversion', {'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'});
}

// Lazy load script
window.addEventListener('load', function() {
  // Lazy load remaining images that don't have 'loading="lazy"' explicitly set
  document.querySelectorAll('img:not([loading])').forEach(img => {
    if (img.src && !img.complete && img.getBoundingClientRect().top > window.innerHeight) {
      img.setAttribute('loading', 'lazy');
    }
  });
});