/**
 * PolicyScanner - Main JavaScript
 * Version: 2.3
 */

(function() {
  'use strict';

  // Cache commonly accessed DOM elements
  const DOM = {};
  
  // Configuration settings
  const CONFIG = {
    // Breakpoints matching CSS variables
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280
    },
    
    // Animation timing values
    timing: {
      fast: 150,
      normal: 300,
      slow: 500
    },
    
    // Scroll offset for anchor links
    scrollOffset: 80,
    
    // Debounce delay for window resize
    resizeDelay: 200
  };

  /**
   * Initialize everything when DOM is ready
   */
  function init() {
    console.log('Initializing PolicyScanner JS...');
    
    // Cache DOM elements only once
    cacheDOM();
    
    // Initialize scroll progress indicator
    initScrollProgress();
    
    // Initialize all components (order matters for some)
    initNavbar();
    
    // More robust checking for how-it-works section
    if (DOM.howItWorks || document.getElementById('how-it-works')) {
      initHowItWorks();
    } else {
      console.log('How It Works section not found, looking for alternative elements');
      // Look for alternative elements that might contain the comparison functionality
      const comparisonSection = document.querySelector('.comparison-section, .insurance-comparison, .steps-section');
      if (comparisonSection) {
        console.log('Found alternative comparison section');
        DOM.howItWorks = comparisonSection;
        initHowItWorks();
      }
    }
    
    initScrollAnimations();
    initFAQs();
    initCarousels();
    initForms();
    initSmoothScrolling();
    
    // Set up global event listeners
    addEventListeners();
    
    console.log('PolicyScanner JS initialized');
  }

  /**
   * Cache DOM elements for better performance
   */
  function cacheDOM() {
    console.log('Caching DOM elements...');
    
    // Global elements
    DOM.body = document.body;
    DOM.html = document.documentElement;
    DOM.navbar = document.querySelector('.navbar');
    DOM.scrollProgress = document.querySelector('.scroll-progress');
    
    // Navigation elements
    DOM.navbarToggler = document.querySelector('.navbar-toggler');
    DOM.navbarCollapse = document.querySelector('.navbar-collapse');
    DOM.dropdowns = document.querySelectorAll('.navbar .dropdown');
    
    // How It Works section - more flexible selectors
    DOM.howItWorks = document.getElementById('how-it-works');
    DOM.steps = document.querySelectorAll('.step-item, .process-step, .insurance-step');
    
    // Important: Fixed phone mockup selectors
    DOM.phoneFrame = document.querySelector('.phone-frame');
    DOM.phoneMockup = document.querySelector('.phone-mockup');
    
    // Process carousel with more robust selector
    DOM.processCarousel = document.getElementById('processCarousel') || 
                          document.querySelector('.process-carousel, .steps-carousel, .carousel');
    
    // Animation elements
    DOM.fadeElements = document.querySelectorAll('.fade-in-top, .fade-in, .animate-on-scroll');
    
    // FAQs section
    DOM.faqItems = document.querySelectorAll('.faq-item, .accordion-item');
    
    // Forms
    DOM.forms = document.querySelectorAll('form');
    
    // Smooth scroll links
    DOM.scrollLinks = document.querySelectorAll('a[href^="#"]:not([data-bs-toggle])');
    
    // CTA buttons for tracking
    DOM.ctaButtons = document.querySelectorAll('.btn-cta, .btn-quote, .btn-featured, .btn-orange');

    // Insurance comparison specific elements
    DOM.comparisonTable = document.querySelector('.comparison-table, .insurance-table');
    DOM.insuranceCards = document.querySelectorAll('.insurance-card, .provider-card, .plan-card');
    DOM.quoteForm = document.querySelector('.quote-form, #quoteForm');
    
    // Log important elements
    console.log('Phone frame element:', DOM.phoneFrame);
    console.log('Phone mockup element:', DOM.phoneMockup);
    console.log('Process carousel element:', DOM.processCarousel);
    console.log('Steps elements found:', DOM.steps ? DOM.steps.length : 0);
  }

  /**
   * Initialize scroll progress indicator at the top of the page
   */
  function initScrollProgress() {
    if (!DOM.scrollProgress) return;
    
    function updateScrollProgress() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / height) * 100;
      DOM.scrollProgress.style.width = progress + '%';
    }
    
    // Initial update and event listener
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
  }

  /**
   * Navbar & Mega Menu Functionality
   */
  function initNavbar() {
    if (!DOM.navbar) return;
    
    // Add scroll behavior to navbar
    handleNavbarScroll();
    
    // Enhanced mega menu interactions
    enhanceMegaMenus();
    
    // Mobile navigation handling
    handleMobileNavigation();
    
    // Improve dropdown accessibility
    initDropdownAccessibility();
    
    // Set active nav item based on current page
    setActiveNavItem();
  }

  /**
   * Handle navbar appearance on scroll
   */
  function handleNavbarScroll() {
    // Initial check in case page is refreshed while scrolled down
    if (window.scrollY > 10) {
      DOM.navbar.classList.add('navbar-scrolled');
    }
    
    // Use passive listener for better performance
    window.addEventListener('scroll', function() {
      if (window.scrollY > 10) {
        DOM.navbar.classList.add('navbar-scrolled');
      } else {
        DOM.navbar.classList.remove('navbar-scrolled');
      }
    }, { passive: true });
  }

  /**
   * Enhanced mega menu interactions on desktop and mobile
   */
  function enhanceMegaMenus() {
    if (!DOM.dropdowns || !DOM.dropdowns.length) return;
    
    // Store all event listeners for potential cleanup
    const megaMenuListeners = [];
    
    DOM.dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      // Skip if any element is missing
      if (!toggle || !menu) return;
      
      // Different behavior based on screen size
      if (window.innerWidth >= CONFIG.breakpoints.lg) {
        let hoverTimeout;
        let leaveTimeout;
        let isClickHandled = false;
        
        // Hover to open on desktop
        const enterListener = function() {
          // Don't use hover if the click was just handled
          if (isClickHandled) return;
          
          clearTimeout(leaveTimeout);
          
          // Small delay before opening to prevent accidental triggers
          hoverTimeout = setTimeout(() => {
            if (!menu.classList.contains('show')) {
              // Simulate click on toggle to use Bootstrap's built-in behavior
              toggle.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
              }));
              menu.classList.add('animated');
            }
          }, 100);
        };
        
        // Hover out to close
        const leaveListener = function() {
          // Don't use hover if the click was just handled
          if (isClickHandled) {
            isClickHandled = false;
            return;
          }
          
          clearTimeout(hoverTimeout);
          
          // Small delay before closing to prevent flickering
          leaveTimeout = setTimeout(() => {
            if (menu.classList.contains('show')) {
              toggle.dispatchEvent(new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
              }));
              menu.classList.remove('animated');
            }
          }, 200);
        };
        
        dropdown.addEventListener('mouseenter', enterListener);
        dropdown.addEventListener('mouseleave', leaveListener);
        
        // Store listeners for potential cleanup
        megaMenuListeners.push({
          element: dropdown,
          type: 'mouseenter',
          listener: enterListener
        });
        
        megaMenuListeners.push({
          element: dropdown,
          type: 'mouseleave',
          listener: leaveListener
        });
        
        // Direct click handler
        const clickListener = function(e) {
          // Clear any pending hover timeouts
          clearTimeout(hoverTimeout);
          clearTimeout(leaveTimeout);
          
          // Set flag to prevent hover from interfering with click
          isClickHandled = true;
          
          // Add a delay to prevent immediate closing on mouseleave
          setTimeout(() => {
            isClickHandled = false;
          }, 300);
        };
        
        toggle.addEventListener('click', clickListener);
        
        megaMenuListeners.push({
          element: toggle,
          type: 'click',
          listener: clickListener
        });
      }
      
      // Animation classes for smoother transitions
      toggle.addEventListener('show.bs.dropdown', function() {
        menu.classList.add('animating');
      });
      
      toggle.addEventListener('shown.bs.dropdown', function() {
        menu.classList.remove('animating');
        menu.classList.add('animated');
      });
      
      toggle.addEventListener('hide.bs.dropdown', function() {
        menu.classList.add('animating');
        menu.classList.remove('animated');
      });
      
      toggle.addEventListener('hidden.bs.dropdown', function() {
        menu.classList.remove('animating');
      });
    });
    
    // Cleanup function when screen size changes
    const cleanupMegaMenuListeners = function() {
      megaMenuListeners.forEach(item => {
        item.element.removeEventListener(item.type, item.listener);
      });
      megaMenuListeners.length = 0; // Clear the array
    };
    
    // Store cleanup function for window resize handler
    window.policyScanner = window.policyScanner || {};
    window.policyScanner.cleanupMegaMenu = cleanupMegaMenuListeners;
  }

  /**
   * Handle mobile navigation toggling and behavior
   */
  function handleMobileNavigation() {
    if (!DOM.navbarToggler || !DOM.navbarCollapse) return;
    
    // Toggle body class when mobile menu is open
    DOM.navbarToggler.addEventListener('click', function() {
      // Check after a small delay to account for Bootstrap's own toggle
      setTimeout(() => {
        if (DOM.navbarCollapse.classList.contains('show')) {
          DOM.body.classList.add('mobile-menu-open');
          DOM.navbarToggler.setAttribute('aria-expanded', 'true');
        } else {
          DOM.body.classList.remove('mobile-menu-open');
          DOM.navbarToggler.setAttribute('aria-expanded', 'false');
        }
      }, 10);
    });
    
    // Close mobile menu when clicking on internal links
    document.querySelectorAll('.navbar-nav a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        if (window.innerWidth < CONFIG.breakpoints.lg && DOM.navbarCollapse.classList.contains('show')) {
          DOM.navbarToggler.click(); // Close the menu
        }
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (
        window.innerWidth < CONFIG.breakpoints.lg &&
        DOM.navbarCollapse.classList.contains('show') &&
        !DOM.navbarCollapse.contains(e.target) &&
        e.target !== DOM.navbarToggler &&
        !DOM.navbarToggler.contains(e.target)
      ) {
        DOM.navbarToggler.click(); // Close the menu
      }
    });
  }

  /**
   * Improve keyboard navigation and accessibility for dropdown menus
   */
  function initDropdownAccessibility() {
    if (!DOM.dropdowns || !DOM.dropdowns.length) return;
    
    DOM.dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      const items = dropdown.querySelectorAll('.dropdown-menu a');
      
      if (!toggle || !menu || items.length === 0) return;
      
      // Keyboard navigation within dropdown
      toggle.addEventListener('keydown', function(e) {
        // Arrow down should open menu and focus first item
        if (e.key === 'ArrowDown' && !menu.classList.contains('show')) {
          e.preventDefault();
          toggle.click();
          items[0].focus();
        }
      });
      
      // Arrow navigation between menu items
      items.forEach((item, index) => {
        item.addEventListener('keydown', function(e) {
          switch(e.key) {
            case 'ArrowDown':
              e.preventDefault();
              if (index < items.length - 1) {
                items[index + 1].focus();
              }
              break;
              
            case 'ArrowUp':
              e.preventDefault();
              if (index > 0) {
                items[index - 1].focus();
              } else {
                toggle.focus();
              }
              break;
              
            case 'Escape':
              e.preventDefault();
              toggle.click(); // Close menu
              toggle.focus();
              break;
          }
        });
      });
    });
  }

  /**
   * Set active class on current navigation item based on URL
   */
  function setActiveNavItem() {
    const currentPath = window.location.pathname;
    
    // Remove trailing slash if present
    const normalizedPath = currentPath.endsWith('/') && currentPath !== '/' 
      ? currentPath.slice(0, -1) 
      : currentPath;
    
    // Find matching nav links and add active class
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
      const href = link.getAttribute('href');
      
      // Skip dropdown toggles
      if (link.classList.contains('dropdown-toggle')) return;
      
      // Skip hash links
      if (!href || href.startsWith('#')) return;
      
      // Clean up href for comparison
      const normalizedHref = href.endsWith('/') && href !== '/' 
        ? href.slice(0, -1) 
        : href;
      
      // Check if this link matches current path
      if (normalizedPath === normalizedHref || 
          (normalizedHref !== '/' && normalizedPath.startsWith(normalizedHref))) {
        link.classList.add('active');
        
        // If inside dropdown, also highlight parent
        const parentDropdown = link.closest('.dropdown');
        if (parentDropdown) {
          const parentLink = parentDropdown.querySelector('.dropdown-toggle');
          if (parentLink) {
            parentLink.classList.add('active');
          }
        }
      }
    });
  }

  /**
   * How It Works Section
   */
  function initHowItWorks() {
    console.log('Initializing How It Works section');
    if (!DOM.howItWorks) {
      console.warn('How It Works section element not found');
      return;
    }
    
    // Check if already initialized to prevent duplicate initialization
    if (DOM.howItWorks.hasAttribute('data-initialized')) {
      console.log('How It Works section already initialized');
      return;
    }
    
    initStepAnimations();
    
    // Initialize carousel sync only if both steps and carousel exist
    if (DOM.steps && DOM.steps.length && DOM.processCarousel) {
      console.log('Found steps and carousel - initializing sync');
      initCarouselSync();
    } else {
      console.warn('Steps or carousel elements not found for sync');
      
      // Try to find carousel with different selectors if not found earlier
      const alternativeCarousel = document.querySelector('.carousel, .bs-carousel, .steps-carousel');
      if (alternativeCarousel && DOM.steps && DOM.steps.length) {
        console.log('Found alternative carousel:', alternativeCarousel);
        DOM.processCarousel = alternativeCarousel;
        initCarouselSync();
      }
    }
    
    // Phone frame/mockup handling - more robust checking
    if (DOM.phoneFrame) {
      console.log('Phone frame found, initializing tilt effect');
      initPhoneTilt();
    } else if (DOM.phoneMockup) {
      console.log('Phone mockup found but no frame, looking for frame inside mockup');
      DOM.phoneFrame = DOM.phoneMockup.querySelector('.phone-frame');
      if (DOM.phoneFrame) {
        console.log('Found phone frame inside mockup');
        initPhoneTilt();
      } else {
        console.warn('No phone frame found inside mockup');
      }
    } else {
      console.warn('Neither phone frame nor mockup elements found');
      
      // Last resort - try to find any possible phone mockup elements
      const possiblePhoneElements = document.querySelectorAll('.phone-container, .device-mockup, .app-preview, .mobile-preview');
      if (possiblePhoneElements.length) {
        console.log('Found possible phone mockup alternative:', possiblePhoneElements[0]);
        DOM.phoneFrame = possiblePhoneElements[0];
        initPhoneTilt();
      }
    }
    
    // If we have a process carousel, make sure it's initialized
    if (DOM.processCarousel) {
      console.log('Found process carousel, ensuring it is initialized');
      // Explicitly initialize the carousel
      try {
        if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
          if (!bootstrap.Carousel.getInstance(DOM.processCarousel)) {
            const carousel = new bootstrap.Carousel(DOM.processCarousel, {
              interval: 4000,
              wrap: true,
              keyboard: true
            });
            console.log('Carousel initialized successfully');
          } else {
            console.log('Carousel already initialized');
          }
        } else {
          console.error('Bootstrap or Carousel not available');
        }
      } catch(e) {
        console.error('Failed to initialize carousel:', e);
      }
    }
    
    // Initialize insurance comparison if elements exist
    initInsuranceComparison();
    
    // Mark as initialized
    DOM.howItWorks.setAttribute('data-initialized', 'true');
    console.log('How It Works section initialization complete');
  }

  /**
   * Initialize step item animations and interactions
   */
  function initStepAnimations() {
    if (!DOM.steps || !DOM.steps.length) {
      console.warn('No step items found for animation');
      return;
    }
    
    console.log(`Found ${DOM.steps.length} step items`);
    
    // Add initial active state to first step
    if (DOM.steps.length > 0 && !document.querySelector('.step-active')) {
      DOM.steps[0].classList.add('step-active');
      console.log('Added active class to first step');
    }
    
    // Add click interaction to each step
    DOM.steps.forEach((step, index) => {
      step.addEventListener('click', function() {
        console.log(`Step ${index + 1} clicked`);
        // Remove active class from all steps
        DOM.steps.forEach(s => s.classList.remove('step-active'));
        
        // Add active class to clicked step
        step.classList.add('step-active');
        
        // Move carousel to corresponding slide
        if (DOM.processCarousel) {
          const carouselInstance = bootstrap.Carousel.getInstance(DOM.processCarousel);
          if (carouselInstance) {
            carouselInstance.to(index);
            console.log(`Moved carousel to slide ${index + 1}`);
          } else {
            console.warn('Bootstrap Carousel instance not found');
            
            // Try to initialize carousel manually if instance doesn't exist
            try {
              const newCarousel = new bootstrap.Carousel(DOM.processCarousel);
              newCarousel.to(index);
              console.log(`Initialized new carousel and moved to slide ${index + 1}`);
            } catch(e) {
              console.error('Failed to initialize carousel:', e);
            }
          }
        }
      });
      
      // Add hover effect
      step.addEventListener('mouseenter', function() {
        step.classList.add('step-hover');
      });
      
      step.addEventListener('mouseleave', function() {
        step.classList.remove('step-hover');
      });
    });
  }

  /**
   * Sync carousel with steps
   */
  function initCarouselSync() {
    if (!DOM.processCarousel || !DOM.steps || !DOM.steps.length) {
      console.warn('Carousel or steps not found for sync');
      return;
    }
    
    console.log('Initializing carousel sync');
    
    // Try to initialize carousel if not already
    if (!bootstrap.Carousel.getInstance(DOM.processCarousel)) {
      try {
        new bootstrap.Carousel(DOM.processCarousel);
        console.log('Carousel initialized');
      } catch(e) {
        console.error('Failed to initialize carousel:', e);
      }
    }
    
    // Listen for carousel slide events
    DOM.processCarousel.addEventListener('slide.bs.carousel', function(event) {
      const nextIndex = event.to !== undefined ? event.to : 0;
      console.log(`Carousel sliding to index ${nextIndex}`);
      
      // Update active step
      DOM.steps.forEach((step, index) => {
        if (index === nextIndex) {
          step.classList.add('step-active');
        } else {
          step.classList.remove('step-active');
        }
      });
    });
  }

  /**
   * Add subtle 3D tilt effect to phone mockup
   */
  function initPhoneTilt() {
    console.log('Phone frame element for tilt:', DOM.phoneFrame);
    
    if (!DOM.phoneFrame) {
      console.warn('Phone frame element not found for tilt effect');
      return;
    }
    
    console.log('Initializing phone tilt effect');
    
    // Only enable on desktop
    if (window.innerWidth < CONFIG.breakpoints.lg) {
      console.log('Screen width below threshold, skipping tilt effect');
      return;
    }
    
    let tiltTimeoutId;
    let phoneMockup;
    
    // Try different ways to get the actual mockup element
    if (DOM.phoneFrame.classList.contains('phone-mockup')) {
      phoneMockup = DOM.phoneFrame;
      console.log('Using phone frame directly as mockup');
    } else if (DOM.phoneFrame.closest('.phone-mockup')) {
      phoneMockup = DOM.phoneFrame.closest('.phone-mockup');
      console.log('Found mockup as parent of frame');
    } else if (DOM.phoneFrame.querySelector('.phone-mockup')) {
      phoneMockup = DOM.phoneFrame.querySelector('.phone-mockup');
      console.log('Found mockup as child of frame');
    } else {
      phoneMockup = DOM.phoneFrame;
      console.log('Using phone frame as fallback for mockup');
    }
    
    if (!phoneMockup) {
      console.warn('No suitable phone mockup element found');
      return;
    }
    
    // Ensure visibility
    phoneMockup.style.display = 'block';
    phoneMockup.style.visibility = 'visible';
    phoneMockup.style.opacity = '1';
    
    if (DOM.phoneFrame && DOM.phoneFrame !== phoneMockup) {
      DOM.phoneFrame.style.display = 'block';
      DOM.phoneFrame.style.visibility = 'visible';
      DOM.phoneFrame.style.opacity = '1';
    }
    
    // Ensure the carousel is visible if it exists
    const carousel = phoneMockup.querySelector('.carousel') || DOM.phoneFrame.querySelector('.carousel');
    if (carousel) {
      carousel.style.display = 'block';
      carousel.style.visibility = 'visible';
      carousel.style.opacity = '1';
    }
    
    console.log('Adding mousemove listener to:', phoneMockup);
    
    phoneMockup.addEventListener('mousemove', function(e) {
      // Cancel any pending timeout
      clearTimeout(tiltTimeoutId);
      
      // Use requestAnimationFrame for smoother animations
      requestAnimationFrame(() => {
        // Get position of mouse in relation to the element
        const rect = phoneMockup.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top; // y position within the element
        
        // Calculate tilt based on mouse position
        // Max tilt of 8 degrees
        const tiltX = ((y / rect.height) * 8 - 4).toFixed(2);
        const tiltY = (((x / rect.width) * 8 - 4) * -1).toFixed(2);
        
        // Apply the tilt effect with 3D transform for better performance
        phoneMockup.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
      });
    });
    
    // Reset position when mouse leaves
    phoneMockup.addEventListener('mouseleave', function() {
      // Use timeout to ensure smooth transition back
      tiltTimeoutId = setTimeout(() => {
        phoneMockup.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }, 100);
    });
    
    // Smooth transition when hovering
    phoneMockup.style.transition = 'transform 0.2s ease-out';
    
    console.log('Phone tilt effect initialized');
  }

  /**
   * Initialize insurance comparison functionality
   */
  function initInsuranceComparison() {
    console.log('Initializing insurance comparison');
    
    // Initialize comparison table if it exists
    if (DOM.comparisonTable) {
      console.log('Found comparison table');
      initComparisonTable();
    }
    
    // Initialize insurance provider cards if they exist
    if (DOM.insuranceCards && DOM.insuranceCards.length) {
      console.log(`Found ${DOM.insuranceCards.length} insurance cards`);
      initInsuranceCards();
    }
    
    // Initialize quote form if it exists
    if (DOM.quoteForm) {
      console.log('Found quote form');
      initQuoteForm();
    }
    
    // Look for plan selection elements
    const planSelectors = document.querySelectorAll('.plan-selector, .insurance-selector, .provider-selector');
    if (planSelectors.length) {
      console.log(`Found ${planSelectors.length} plan selectors`);
      initPlanSelectors(planSelectors);
    }
  }

  /**
   * Initialize the insurance comparison table functionality
   */
  function initComparisonTable() {
    if (!DOM.comparisonTable) return;
    
    // Add sorting functionality to sortable columns
    const sortableHeaders = DOM.comparisonTable.querySelectorAll('th[data-sortable="true"]');
    
    sortableHeaders.forEach(header => {
      header.addEventListener('click', function() {
        const columnIndex = Array.from(header.parentNode.children).indexOf(header);
        const isAscending = header.classList.contains('sort-asc');
        
        // Remove sort classes from all headers
        sortableHeaders.forEach(h => {
          h.classList.remove('sort-asc', 'sort-desc');
        });
        
        // Add appropriate sort class
        header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
        
        // Sort the table
        sortTable(DOM.comparisonTable, columnIndex, !isAscending);
      });
      
      // Add sort indicators and styling
      header.style.cursor = 'pointer';
      header.classList.add('sortable');
      
      // Add sort icon if not already present
      if (!header.querySelector('.sort-icon')) {
        const sortIcon = document.createElement('span');
        sortIcon.className = 'sort-icon ms-1';
        sortIcon.innerHTML = '⇅';
        header.appendChild(sortIcon);
      }
    });
    
    // Add highlight on hover for better row tracking
    const tableRows = DOM.comparisonTable.querySelectorAll('tbody tr');
    tableRows.forEach(row => {
      row.addEventListener('mouseenter', function() {
        this.classList.add('table-hover-highlight');
      });
      
      row.addEventListener('mouseleave', function() {
        this.classList.remove('table-hover-highlight');
      });
    });
    
    // Add feature comparison tooltips
    const featureIcons = DOM.comparisonTable.querySelectorAll('.feature-icon, [data-toggle="tooltip"]');
    featureIcons.forEach(icon => {
      // Check if Bootstrap tooltip is available
      if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        new bootstrap.Tooltip(icon);
      }
    });
  }

  /**
   * Sort table by column
   */
  function sortTable(table, columnIndex, ascending) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Sort the rows
    rows.sort((a, b) => {
      const cellA = a.cells[columnIndex].textContent.trim();
      const cellB = b.cells[columnIndex].textContent.trim();
      
      // Check if values are numbers
      const numA = parseFloat(cellA.replace(/[^0-9.-]+/g, ''));
      const numB = parseFloat(cellB.replace(/[^0-9.-]+/g, ''));
      
      if (!isNaN(numA) && !isNaN(numB)) {
        return ascending ? numA - numB : numB - numA;
      }
      
      // Otherwise sort as strings
      return ascending ? 
        cellA.localeCompare(cellB) : 
        cellB.localeCompare(cellA);
    });
    
    // Re-append rows in new order
    rows.forEach(row => tbody.appendChild(row));
  }

  /**
   * Initialize insurance provider cards
   */
  function initInsuranceCards() {
    if (!DOM.insuranceCards || !DOM.insuranceCards.length) return;
    
    DOM.insuranceCards.forEach(card => {
      // Add click handler for "Show Details" buttons
      const detailsBtn = card.querySelector('.details-btn, .show-details, .more-info');
      if (detailsBtn) {
        detailsBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Toggle details section visibility
          const detailsSection = card.querySelector('.card-details, .insurance-details, .plan-details');
          if (detailsSection) {
            const isExpanded = detailsSection.classList.contains('show');
            
            // Update button text
            this.textContent = isExpanded ? 'Show Details' : 'Hide Details';
            
            // Toggle details visibility
            if (isExpanded) {
              detailsSection.classList.remove('show');
              detailsSection.style.maxHeight = null;
            } else {
              detailsSection.classList.add('show');
              detailsSection.style.maxHeight = detailsSection.scrollHeight + 'px';
            }
          }
        });
      }
      
      // Add "Compare" checkbox functionality
      const compareCheck = card.querySelector('input[type="checkbox"].compare-check');
      if (compareCheck) {
        compareCheck.addEventListener('change', function() {
          if (this.checked) {
            card.classList.add('selected-for-comparison');
          } else {
            card.classList.remove('selected-for-comparison');
          }
          
          // Update comparison counter
          updateComparisonCounter();
        });
      }
    });
  }

  /**
   * Update comparison counter when selecting plans
   */
  function updateComparisonCounter() {
    const selectedItems = document.querySelectorAll('.selected-for-comparison, input[type="checkbox"].compare-check:checked');
    const counterEl = document.querySelector('.comparison-counter, .selected-counter');
    
    if (counterEl) {
      counterEl.textContent = selectedItems.length;
      
      if (selectedItems.length > 0) {
        counterEl.parentElement.classList.add('active');
      } else {
        counterEl.parentElement.classList.remove('active');
      }
    }
    
    // Update compare button state
    const compareBtn = document.querySelector('.compare-selected-btn, .compare-button');
    if (compareBtn) {
      if (selectedItems.length >= 2) {
        compareBtn.disabled = false;
      } else {
        compareBtn.disabled = true;
      }
    }
  }

  /**
   * Initialize the quote form functionality
   */
  function initQuoteForm() {
    if (!DOM.quoteForm) return;
    
    // Add form validation
    DOM.quoteForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (validateForm(this)) {
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Getting Quotes...';
        }
        
        // Simulate API call for quotes
        setTimeout(() => {
          // Redirect to results page or show results
          const resultsContainer = document.querySelector('.quote-results, #quoteResults');
          
          if (resultsContainer) {
            // Show results in-page
            resultsContainer.classList.remove('d-none');
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
            
            // Reset button
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = 'Get Quotes';
            }
          } else {
            // Redirect to results page
            window.location.href = 'quote-results.html';
          }
        }, 2000);
      }
    });
    
    // Initialize range sliders with dynamic value display
    const rangeInputs = DOM.quoteForm.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(range => {
      const valueDisplay = document.querySelector(`#${range.id}Value, .${range.id}-value`);
      
      if (valueDisplay) {
        // Initial value
        updateRangeValue(range, valueDisplay);
        
        // Update on change
        range.addEventListener('input', function() {
          updateRangeValue(this, valueDisplay);
        });
      }
    });
    
    // Add conditional field toggling
    const toggleInputs = DOM.quoteForm.querySelectorAll('[data-toggle-field]');
    toggleInputs.forEach(input => {
      const targetId = input.getAttribute('data-toggle-field');
      const targetField = document.getElementById(targetId);
      
      if (targetField) {
        // Initial state
        toggleFieldVisibility(input, targetField);
        
        // Listen for changes
        input.addEventListener('change', function() {
          toggleFieldVisibility(this, targetField);
        });
      }
    });
  }

  /**
   * Update range slider value display
   */
  function updateRangeValue(rangeInput, displayElement) {
    // Check if we need to format the value (currency, years, etc.)
    if (rangeInput.hasAttribute('data-format')) {
      const format = rangeInput.getAttribute('data-format');
      
      switch(format) {
        case 'currency':
          displayElement.textContent = '$' + parseInt(rangeInput.value).toLocaleString();
          break;
        case 'years':
          displayElement.textContent = rangeInput.value + ' years';
          break;
        case 'percentage':
          displayElement.textContent = rangeInput.value + '%';
          break;
        default:
          displayElement.textContent = rangeInput.value;
      }
    } else {
      // No formatting
      displayElement.textContent = rangeInput.value;
    }
  }

  /**
   * Toggle conditional field visibility
   */
  function toggleFieldVisibility(toggleInput, targetField) {
    const fieldContainer = targetField.closest('.form-group, .mb-3');
    
    if (!fieldContainer) return;
    
    if (toggleInput.checked) {
      fieldContainer.classList.remove('d-none');
      targetField.removeAttribute('disabled');
    } else {
      fieldContainer.classList.add('d-none');
      targetField.setAttribute('disabled', 'disabled');
    }
  }

  /**
   * Initialize plan selectors
   */
  function initPlanSelectors(selectors) {
    selectors.forEach(selector => {
      selector.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const planId = selectedOption.value;
        
        // Hide all plan details
        const allDetails = document.querySelectorAll('.plan-details');
        allDetails.forEach(detail => detail.classList.add('d-none'));
        
        // Show selected plan details
        if (planId) {
          const selectedDetails = document.getElementById(`details-${planId}`);
          if (selectedDetails) {
            selectedDetails.classList.remove('d-none');
          }
        }
      });
    });
  }

  /**
   * Scroll Animations
   */
  function initScrollAnimations() {
    if (!DOM.fadeElements || !DOM.fadeElements.length) return;
    
    // Check for IntersectionObserver support
    if ('IntersectionObserver' in window) {
      // Create intersection observer to detect elements entering viewport
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            animationObserver.unobserve(entry.target); // Stop observing once animated
          }
        });
      }, {
        root: null, // viewport
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
      });
      
      // Start observing all fade elements
      DOM.fadeElements.forEach(element => {
        animationObserver.observe(element);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      // Immediately activate all elements
      DOM.fadeElements.forEach(element => {
        element.classList.add('active');
      });
    }
    
    // Additional sequential animation for steps in how-it-works section
    if (DOM.steps && DOM.steps.length && 'IntersectionObserver' in window) {
      const stepObserver = new IntersectionObserver((entries) => {
        let delay = 0;
        
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Stagger the animation of each step
            setTimeout(() => {
              entry.target.classList.add('active');
            }, delay);
            
            delay += 200; // 200ms stagger between each step
            stepObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.2
      });
      
      // Observe each step for scroll reveal
      DOM.steps.forEach(step => {
        stepObserver.observe(step);
      });
      
      // Animate the phone mockup when it comes into view
      if (DOM.phoneFrame || DOM.phoneMockup) {
        const phoneElement = DOM.phoneFrame || DOM.phoneMockup;
        const phoneObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              phoneElement.classList.add('phone-reveal');
              console.log('Added phone-reveal class to phone element');
              phoneObserver.unobserve(entry.target);
            }
          });
        }, {
          threshold: 0.3
        });
        
        phoneObserver.observe(phoneElement);
      }
    }
  }

  /**
   * FAQ Section
   */
  function initFAQs() {
    if (!DOM.faqItems || !DOM.faqItems.length) return;
    
    DOM.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question, .accordion-button');
      const answer = item.querySelector('.faq-answer, .accordion-collapse');
      
      if (!question || !answer) return;
      
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
   * Carousel Initialization
   */
  function initCarousels() {
    // Get all carousels
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
      // Skip if already initialized
      if (carousel.hasAttribute('data-initialized')) return;
      
      // Mark as initialized
      carousel.setAttribute('data-initialized', 'true');
      
      // Initialize with Bootstrap if not already
      if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
        if (!bootstrap.Carousel.getInstance(carousel)) {
          try {
            new bootstrap.Carousel(carousel);
            console.log('Initialized carousel:', carousel.id || 'unnamed carousel');
          } catch(e) {
            console.error('Failed to initialize carousel:', e);
          }
        }
      }
      
      // Add hover pause functionality
      carousel.addEventListener('mouseenter', function() {
        const carouselInstance = bootstrap.Carousel.getInstance(carousel);
        if (carouselInstance) {
          carouselInstance.pause();
        }
      });
      
      carousel.addEventListener('mouseleave', function() {
        const carouselInstance = bootstrap.Carousel.getInstance(carousel);
        if (carouselInstance) {
          carouselInstance.cycle();
        }
      });
      
      // Add swipe support for touch devices
      let touchStartX = 0;
      let touchEndX = 0;
      
      carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });
      
      carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(carousel, touchStartX, touchEndX);
      }, { passive: true });
    });
  }

  /**
   * Handle swipe gesture for carousels
   */
  function handleSwipe(carousel, startX, endX) {
    const carouselInstance = bootstrap.Carousel.getInstance(carousel);
    if (!carouselInstance) return;
    
    const swipeThreshold = 100; // Minimum pixel distance for swipe
    
    if (endX < startX - swipeThreshold) {
      // Swipe left - next slide
      carouselInstance.next();
    } else if (endX > startX + swipeThreshold) {
      // Swipe right - previous slide
      carouselInstance.prev();
    }
  }

  /**
   * Form Handling
   */
  function initForms() {
    if (!DOM.forms || !DOM.forms.length) return;
    
    DOM.forms.forEach(form => {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(form)) return;
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        
        if (submitButton) {
          const originalText = submitButton.innerHTML;
          
          // Add loading class and update text
          submitButton.classList.add('loading');
          submitButton.disabled = true;
          
          // Simulate form submission (replace with actual submission logic)
          setTimeout(() => {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            
            // Show success state
            handleFormSuccess(form);
            
            // Clear inputs
            form.reset();
          }, 1500);
        }
      });
      
      // Add live validation on input blur
      const inputs = form.querySelectorAll('input, select, textarea');
      
      inputs.forEach(input => {
        input.addEventListener('blur', function() {
          validateInput(input);
        });
      });
    });
  }

  /**
   * Validate entire form before submission
   */
  function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  /**
   * Validate individual form input
   */
  function validateInput(input) {
    // Skip elements without name attribute
    if (!input.getAttribute('name')) return true;
    
    // Skip disabled elements
    if (input.disabled) return true;
    
    // Clear previous validation state
    input.classList.remove('is-valid', 'is-invalid');
    
    // Get parent form group if exists
    const formGroup = input.closest('.form-group, .mb-3');
    
    // Remove previous feedback
    if (formGroup) {
      const feedback = formGroup.querySelector('.invalid-feedback');
      if (feedback) feedback.remove();
    }
    
    // Required field validation
    if (input.hasAttribute('required') && !input.value.trim()) {
      input.classList.add('is-invalid');
      
      if (formGroup) {
        const feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        feedback.textContent = 'This field is required';
        formGroup.appendChild(feedback);
      }
      
      return false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim()) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailPattern.test(input.value.trim())) {
        input.classList.add('is-invalid');
        
        if (formGroup) {
          const feedback = document.createElement('div');
          feedback.className = 'invalid-feedback';
          feedback.textContent = 'Please enter a valid email address';
          formGroup.appendChild(feedback);
        }
        
        return false;
      }
    }
    
    // Mark as valid if passes all checks
    input.classList.add('is-valid');
    return true;
  }

  /**
   * Handle successful form submission
   */
  function handleFormSuccess(form) {
    // Get parent container for appending success message
    const formParent = form.parentElement;
    
    // Check if success message already exists and remove it
    const existingMessage = formParent.querySelector('.form-success-message');
    if (existingMessage) existingMessage.remove();
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success mt-3 form-success-message';
    successMessage.innerHTML = '<i class="fas fa-check-circle me-2"></i> Thanks for submitting! We\'ll be in touch soon.';
    
    // Add animation class
    successMessage.style.opacity = '0';
    successMessage.style.transform = 'translateY(10px)';
    successMessage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Append to form parent
    formParent.appendChild(successMessage);
    
    // Trigger animation
    setTimeout(() => {
      successMessage.style.opacity = '1';
      successMessage.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove success message after delay
    setTimeout(() => {
      successMessage.style.opacity = '0';
      successMessage.style.transform = 'translateY(-10px)';
      
      setTimeout(() => {
        successMessage.remove();
      }, 300);
    }, 5000);
  }

  /**
   * Smooth Scroll Functionality
   */
  function initSmoothScrolling() {
    if (!DOM.scrollLinks || !DOM.scrollLinks.length) return;
    
    DOM.scrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Skip if no target or external link
        if (!targetId || targetId === '#' || !targetId.startsWith('#')) return;
        
        e.preventDefault();
        
        // Make sure the target exists
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const navbarHeight = DOM.navbar ? DOM.navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        
        // Smooth scroll to target with offset for navbar
        window.scrollTo({
          top: targetPosition - navbarHeight - CONFIG.scrollOffset,
          behavior: 'smooth'
        });
        
        // Update URL hash without scrolling
        history.pushState(null, null, targetId);
      });
    });
  }

  /**
   * Global Event Listeners and Handlers
   */
  function addEventListeners() {
    // Debounced resize handler
    const debouncedResizeHandler = debounce(handleWindowResize, CONFIG.resizeDelay);
    window.addEventListener('resize', debouncedResizeHandler);
    
    // Handle initial page load animations
    window.addEventListener('load', handlePageLoad);
    
    // Add click interactions to buttons
    addButtonInteractions();
    
    // Initialize lazy loading
    initLazyLoading();
  }

  /**
   * Handle window resize events
   */
  function handleWindowResize() {
    // Reinitialize components that need adjustment on resize
    const oldWidth = window.policyScanner.windowWidth || window.innerWidth;
    const newWidth = window.innerWidth;
    
    // Store current window width
    window.policyScanner.windowWidth = newWidth;
    
    // Check if breakpoint has changed
    const oldBreakpoint = getBreakpoint(oldWidth);
    const newBreakpoint = getBreakpoint(newWidth);
    
    if (oldBreakpoint !== newBreakpoint) {
      console.log(`Breakpoint changed from ${oldBreakpoint} to ${newBreakpoint}`);
      
      // Clean up mega menu listeners if they exist
      if (typeof window.policyScanner.cleanupMegaMenu === 'function') {
        window.policyScanner.cleanupMegaMenu();
      }
      
      // Reinitialize navbar components
      enhanceMegaMenus();
      
      // Update phone tilt effect
      if (DOM.phoneFrame || DOM.phoneMockup) {
        const phoneElement = DOM.phoneFrame || DOM.phoneMockup;
        if (newWidth >= CONFIG.breakpoints.lg) {
          console.log('Screen width above threshold, initializing phone tilt');
          initPhoneTilt();
        } else {
          console.log('Screen width below threshold, removing phone tilt');
          phoneElement.style.transform = '';
          phoneElement.style.transition = '';
        }
      }
    }
  }

  /**
   * Get the current breakpoint based on window width
   */
  function getBreakpoint(width) {
    if (width < CONFIG.breakpoints.sm) return 'xs';
    if (width < CONFIG.breakpoints.md) return 'sm';
    if (width < CONFIG.breakpoints.lg) return 'md';
    if (width < CONFIG.breakpoints.xl) return 'lg';
    return 'xl';
  }

  /**
   * Handle initial page load animations
   */
  function handlePageLoad() {
    console.log('Page loaded, initializing animations');
    
    // Trigger animation for elements already in viewport on page load
    if (DOM.fadeElements && DOM.fadeElements.length) {
      const isInViewport = el => {
        const rect = el.getBoundingClientRect();
        return (
          rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
          rect.bottom >= 0
        );
      };
      
      DOM.fadeElements.forEach(element => {
        if (isInViewport(element)) {
          element.classList.add('active');
        }
      });
    }
    
    // Check for phone mockup and make sure it's visible
    if (DOM.phoneFrame || DOM.phoneMockup) {
      const phoneElement = DOM.phoneFrame || DOM.phoneMockup;
      phoneElement.style.display = 'block';
      phoneElement.style.visibility = 'visible';
      phoneElement.style.opacity = '1';
      
      // Find carousel inside phone
      const carousel = phoneElement.querySelector('.carousel');
      if (carousel) {
        carousel.style.display = 'block';
        carousel.style.visibility = 'visible';
        carousel.style.opacity = '1';
        
        // Try to initialize carousel if not already
        if (typeof bootstrap !== 'undefined' && bootstrap.Carousel && !bootstrap.Carousel.getInstance(carousel)) {
          try {
            new bootstrap.Carousel(carousel);
            console.log('Initialized carousel on page load');
          } catch(e) {
            console.error('Failed to initialize carousel on page load:', e);
          }
        }
      }
    }
    
    // Initialize lazy loading for images
    initLazyLoading();
  }

  /**
   * Add micro-interactions to buttons
   */
  function addButtonInteractions() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Skip buttons that already have click handlers
      if (button.hasAttribute('data-has-ripple')) return;
      
      button.setAttribute('data-has-ripple', 'true');
      
      // Add ripple effect on click
      button.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        this.appendChild(ripple);
        
        // Position the ripple
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
        
        // Add active class
        ripple.classList.add('active');
        
        // Remove after animation completes
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
      
      // Add CSS for ripple effect if not already added
      if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
          .btn { position: relative; overflow: hidden; }
          .btn-ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
          }
          @keyframes ripple {
            to { transform: scale(2); opacity: 0; }
          }
        `;
        document.head.appendChild(style);
      }
    });
  }

  /**
   * Initialize lazy loading for images
   */
  function initLazyLoading() {
    // Check if native lazy loading is supported
    if ('loading' in HTMLImageElement.prototype) {
      // Get all images that don't have loading attribute
      const images = document.querySelectorAll('img:not([loading])');
      
      images.forEach(img => {
        // Skip images that are likely to be above the fold
        if (isAboveTheFold(img)) return;
        
        // Add loading="lazy" attribute
        img.setAttribute('loading', 'lazy');
      });
    } else if ('IntersectionObserver' in window) {
      // Fallback to Intersection Observer for browsers without native lazy loading
      const lazyImages = document.querySelectorAll('img[loading="lazy"]');
      
      const lazyImageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src') || img.getAttribute('src');
            const srcset = img.getAttribute('data-srcset');
            
            if (src) img.src = src;
            if (srcset) img.srcset = srcset;
            
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
            
            lazyImageObserver.unobserve(img);
          }
        });
      });
      
      lazyImages.forEach(img => {
        lazyImageObserver.observe(img);
      });
    }
  }

  /**
   * Check if element is likely to be above the fold
   */
  function isAboveTheFold(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight;
  }

  /**
   * Utility Functions
   */

  /**
   * Debounce function to limit how often a function can be called
   */
  function debounce(func, wait) {
    let timeout;
    
    return function() {
      const context = this;
      const args = arguments;
      
      const later = function() {
        timeout = null;
        func.apply(context, args);
      };
      
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Add a utility function to forcefully reinitialize all components
  window.reinitPolicyScanner = function() {
    console.log('Manually reinitializing PolicyScanner JS');
    cacheDOM();
    initHowItWorks();
    initCarousels();
    if (DOM.phoneFrame || DOM.phoneMockup) {
      initPhoneTilt();
    }
  };

  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();