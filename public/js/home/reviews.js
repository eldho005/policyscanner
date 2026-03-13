/**
 * Simple Insurance Reviews Component
 * Just auto-scroll + hover pause - Nothing more
 */

(function() {
  'use strict';

  function initReviewsCarousel() {
    const carousel = document.querySelector('.insurance-reviews-component');
    if (!carousel) return;

    const wrapper = carousel.querySelector('.insurance-reviews-component__wrapper');
    const track = carousel.querySelector('.insurance-reviews-component__track');
    
    if (!wrapper || !track) return;

    // Only enable on desktop (992px+)
    function isDesktop() {
      return window.innerWidth >= 992;
    }

    function enableAutoScroll() {
      if (!isDesktop()) return;

      // Clone cards for infinite scroll
      const cards = track.querySelectorAll('.insurance-reviews-component__card:not([data-clone])');
      
      // Remove existing clones
      track.querySelectorAll('[data-clone]').forEach(clone => clone.remove());
      
      // Add clones for seamless loop
      cards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('data-clone', 'true');
        track.appendChild(clone);
      });

      // Add CSS classes for auto-scroll
      wrapper.classList.add('insurance-reviews-component__wrapper--desktop-mode');
      track.classList.add('insurance-reviews-component__track--desktop-mode');

      // Hover pause/resume
      wrapper.addEventListener('mouseenter', () => {
        track.style.animationPlayState = 'paused';
      });

      wrapper.addEventListener('mouseleave', () => {
        track.style.animationPlayState = 'running';
      });
    }

    function disableAutoScroll() {
      // Remove clones
      track.querySelectorAll('[data-clone]').forEach(clone => clone.remove());
      
      // Remove CSS classes
      wrapper.classList.remove('insurance-reviews-component__wrapper--desktop-mode');
      track.classList.remove('insurance-reviews-component__track--desktop-mode');
      
      // Reset animation
      track.style.animationPlayState = '';
    }

    function handleResize() {
      if (isDesktop()) {
        enableAutoScroll();
      } else {
        disableAutoScroll();
      }
    }

    // Initialize
    handleResize();
    
    // Handle window resize
    window.addEventListener('resize', handleResize);
  }

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReviewsCarousel);
  } else {
    initReviewsCarousel();
  }

})();