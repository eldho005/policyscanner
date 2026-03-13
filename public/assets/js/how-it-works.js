/**
 * PolicyScanner - How It Works Section
 * Manages animations and interactions for the How It Works section
 */

document.addEventListener('DOMContentLoaded', function() {
  initHowItWorks();
});

/**
 * Initialize How It Works Section
 */
function initHowItWorks() {
  const section = document.getElementById('how-it-works');
  
  if (!section) return;
  
  initStepAnimations();
  initCarouselSync();
  initPhoneTilt();
}

/**
 * Step Animation Functionality
 * Handles animation of steps and syncing with carousel
 */
function initStepAnimations() {
  const steps = document.querySelectorAll('.step-item');
  
  // Add initial active state to first step
  if (steps.length > 0) {
    steps[0].classList.add('step-active');
  }
  
  // Add click interaction to each step
  steps.forEach((step, index) => {
    step.addEventListener('click', function() {
      // Remove active class from all steps
      steps.forEach(s => s.classList.remove('step-active'));
      
      // Add active class to clicked step
      step.classList.add('step-active');
      
      // Move carousel to corresponding slide
      const carousel = document.getElementById('processCarousel');
      if (carousel) {
        const carouselInstance = bootstrap.Carousel.getInstance(carousel);
        if (carouselInstance) {
          carouselInstance.to(index);
        }
      }
    });
  });
  
  // Add hover effect
  steps.forEach(step => {
    step.addEventListener('mouseenter', function() {
      step.classList.add('step-hover');
    });
    
    step.addEventListener('mouseleave', function() {
      step.classList.remove('step-hover');
    });
  });
}

/**
 * Sync Carousel with Steps
 * Makes sure the active step matches the current carousel slide
 */
function initCarouselSync() {
  const carousel = document.getElementById('processCarousel');
  const steps = document.querySelectorAll('.step-item');
  
  if (!carousel || steps.length === 0) return;
  
  // Listen for carousel slide events
  carousel.addEventListener('slide.bs.carousel', function(event) {
    const nextIndex = event.to;
    
    // Update active step
    steps.forEach((step, index) => {
      if (index === nextIndex) {
        step.classList.add('step-active');
      } else {
        step.classList.remove('step-active');
      }
    });
  });
}

/**
 * Phone Tilt Effect
 * Adds subtle 3D tilt effect to phone mockup
 */
function initPhoneTilt() {
  const phoneMockup = document.querySelector('.phone-mockup');
  
  if (!phoneMockup) return;
  
  // Only enable on desktop
  if (window.innerWidth < 992) return;
  
  phoneMockup.addEventListener('mousemove', function(e) {
    // Get position of mouse in relation to the element
    const rect = phoneMockup.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element
    
    // Calculate tilt based on mouse position
    // Max tilt of 8 degrees
    const tiltX = ((y / rect.height) * 8 - 4).toFixed(2);
    const tiltY = (((x / rect.width) * 8 - 4) * -1).toFixed(2);
    
    // Apply the tilt effect
    phoneMockup.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
  });
  
  // Reset position when mouse leaves
  phoneMockup.addEventListener('mouseleave', function() {
    phoneMockup.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
  
  // Smooth transition when hovering
  phoneMockup.style.transition = 'transform 0.2s ease-out';
}

/**
 * Scroll Reveal Animation
 * Reveals steps sequentially as user scrolls
 */
document.addEventListener('DOMContentLoaded', function() {
  const processSection = document.getElementById('how-it-works');
  
  if (!processSection) return;
  
  const steps = processSection.querySelectorAll('.step-item');
  const phoneFrame = processSection.querySelector('.phone-frame');
  
  // Create intersection observer for sequential animations
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
  steps.forEach(step => {
    stepObserver.observe(step);
  });
  
  // Animate the phone mockup when it comes into view
  if (phoneFrame) {
    const phoneObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          phoneFrame.classList.add('phone-reveal');
          phoneObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });
    
    phoneObserver.observe(phoneFrame);
  }
});

/**
 * Add CSS classes needed for animations 
 * These would normally be in the CSS file, but adding
 * them here for demonstration purposes
 */
(function addAnimationStyles() {
  // Create style element
  const style = document.createElement('style');
  
  // Add animation styles
  style.textContent = `
    /* Step animations */
    .step-item {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .step-item.active {
      opacity: 1;
      transform: translateY(0);
    }
    
    .step-active {
      transform: translateX(5px);
    }
    
    .step-active .icon-circle {
      background-color: rgba(42, 180, 168, 0.15);
      box-shadow: 0 0 15px rgba(42, 180, 168, 0.2);
    }
    
    .step-hover {
      transform: translateX(3px);
    }
    
    /* Phone mockup animation */
    .phone-frame {
      opacity: 0;
      transform: translateY(30px) rotate(3deg);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .phone-reveal {
      opacity: 1;
      transform: translateY(0) rotate(0);
    }
  `;
  
  // Append to head
  document.head.appendChild(style);
})();