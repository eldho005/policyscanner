/**
 * Reviews Carousel - SIMPLE WORKING AUTO-SCROLL
 * Based on proven CSS-only infinite scroll patterns
 * This version focuses on getting the auto-scroll working first
 */

document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.reviews__wrapper');
    const track = document.querySelector('.reviews__track');
    const dots = document.querySelectorAll('.reviews__dot');
    
    if (!wrapper || !track) {
        console.warn('Reviews carousel: Required elements not found');
        return;
    }
    
    let isDesktop = window.innerWidth >= 992;
    let autoScrollActive = false;
    
    // Simple utility functions
    function updateBreakpoint() {
        const wasDesktop = isDesktop;
        isDesktop = window.innerWidth >= 992;
        
        if (wasDesktop !== isDesktop) {
            if (isDesktop) {
                enableAutoScroll();
            } else {
                disableAutoScroll();
            }
        }
    }
    
    function enableAutoScroll() {
        if (autoScrollActive) return;
        
        console.log('Enabling auto-scroll for desktop...');
        
        // Get the original cards
        const originalCards = track.querySelectorAll('.reviews__card:not([data-cloned])');
        
        if (originalCards.length === 0) {
            console.error('No original cards found');
            return;
        }
        
        // Clone all cards and append them
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('data-cloned', 'true');
            track.appendChild(clone);
        });
        
        // Calculate the animation distance
        const cardWidth = originalCards[0].offsetWidth;
        const gap = 32; // Desktop gap from CSS
        const singleSetWidth = (cardWidth + gap) * originalCards.length;
        
        console.log(`Card width: ${cardWidth}px, Gap: ${gap}px, Set width: ${singleSetWidth}px`);
        
        // Apply desktop styles
        wrapper.classList.add('desktop-mode');
        track.classList.add('desktop-mode');
        
        // Create and inject the keyframe animation
        const animationCSS = `
            @keyframes smoothScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${singleSetWidth}px); }
            }
        `;
        
        // Remove existing animation style if present
        const existingStyle = document.getElementById('carousel-animation');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Inject the animation
        const style = document.createElement('style');
        style.id = 'carousel-animation';
        style.textContent = animationCSS;
        document.head.appendChild(style);
        
        // Apply the animation to the track
        track.style.animation = 'smoothScroll 30s linear infinite';
        
        // Add hover controls
        wrapper.addEventListener('mouseenter', pauseAnimation);
        wrapper.addEventListener('mouseleave', resumeAnimation);
        
        autoScrollActive = true;
        console.log('Auto-scroll enabled successfully');
    }
    
    function disableAutoScroll() {
        if (!autoScrollActive) return;
        
        console.log('Disabling auto-scroll...');
        
        // Remove animation
        track.style.animation = 'none';
        
        // Remove cloned cards
        track.querySelectorAll('[data-cloned]').forEach(clone => {
            clone.remove();
        });
        
        // Remove desktop classes
        wrapper.classList.remove('desktop-mode');
        track.classList.remove('desktop-mode');
        
        // Remove event listeners
        wrapper.removeEventListener('mouseenter', pauseAnimation);
        wrapper.removeEventListener('mouseleave', resumeAnimation);
        
        // Remove animation styles
        const animationStyle = document.getElementById('carousel-animation');
        if (animationStyle) {
            animationStyle.remove();
        }
        
        autoScrollActive = false;
        console.log('Auto-scroll disabled');
    }
    
    function pauseAnimation() {
        if (autoScrollActive) {
            track.style.animationPlayState = 'paused';
        }
    }
    
    function resumeAnimation() {
        if (autoScrollActive) {
            track.style.animationPlayState = 'running';
        }
    }
    
    // Mobile/tablet dot navigation
    function initMobileNavigation() {
        if (isDesktop || !dots.length) return;
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                scrollToCard(index);
            });
        });
        
        // Listen for manual scroll to update dots
        wrapper.addEventListener('scroll', updateActiveDot);
    }
    
    function scrollToCard(index) {
        const cards = track.querySelectorAll('.reviews__card:not([data-cloned])');
        if (index >= cards.length) return;
        
        const cardWidth = cards[0].offsetWidth;
        const gap = window.innerWidth >= 768 ? 32 : 24;
        const scrollPosition = (cardWidth + gap) * index;
        
        wrapper.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
        
        updateActiveDot();
    }
    
    function updateActiveDot() {
        if (isDesktop || !dots.length) return;
        
        const scrollLeft = wrapper.scrollLeft;
        const cardWidth = track.querySelector('.reviews__card').offsetWidth;
        const gap = window.innerWidth >= 768 ? 32 : 24;
        const currentIndex = Math.round(scrollLeft / (cardWidth + gap));
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('reviews__dot--active', index === currentIndex);
        });
    }
    
    // Initialize based on current screen size
    function init() {
        console.log('Initializing reviews carousel...');
        console.log('Screen width:', window.innerWidth);
        console.log('Is desktop:', isDesktop);
        
        if (isDesktop) {
            enableAutoScroll();
        } else {
            initMobileNavigation();
        }
        
        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateBreakpoint, 250);
        });
        
        console.log('Reviews carousel initialized');
    }
    
    // Expose simple controls for testing
    window.reviewsCarousel = {
        enableAutoScroll: enableAutoScroll,
        disableAutoScroll: disableAutoScroll,
        forceDesktop: () => {
            isDesktop = true;
            enableAutoScroll();
        },
        forceMobile: () => {
            isDesktop = false;
            disableAutoScroll();
            initMobileNavigation();
        },
        getState: () => ({
            isDesktop,
            autoScrollActive,
            windowWidth: window.innerWidth
        })
    };
    
    // Start the carousel
    init();
});

/**
 * DEBUGGING STEPS:
 * 
 * 1. Open browser console
 * 2. Check for any error messages
 * 3. Test with these commands:
 *    - window.reviewsCarousel.getState()
 *    - window.reviewsCarousel.forceDesktop()
 *    - window.reviewsCarousel.forceMobile()
 * 
 * 4. Verify the CSS classes are being applied:
 *    - Check if wrapper has 'desktop-mode' class
 *    - Check if track has 'desktop-mode' class
 *    - Check if animation style is injected in document head
 * 
 * 5. If still not working, the issue might be in the CSS file
 *    where the desktop-mode styles aren't properly defined
 */