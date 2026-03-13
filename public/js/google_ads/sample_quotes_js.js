// ==========================================================================
// Sample Quotes Component JavaScript - Mobile Single Card Carousel
// Simple mobile carousel functionality - Single card centered view
// ==========================================================================

(function() {
    'use strict';
    
    const track = document.getElementById('track');
    const leftArrow = document.getElementById('nav-left');
    const rightArrow = document.getElementById('nav-right');
    const indicators = document.querySelectorAll('.sample-quotes__dot');
    
    if (track && leftArrow && rightArrow) {
        let currentCard = 0;
        const totalCards = 3;
        
        function getScrollDistance() {
            // For mobile single card layout
            if (window.innerWidth < 768) {
                const card = track.querySelector('.sample-quotes__card');
                if (!card) return 0;
                const cardWidth = card.offsetWidth;
                const cardGap = 20; /* Match CSS gap */
                return cardWidth + cardGap;
            }
            return 0; // Not used on tablet+
        }
        
        function updateNavigation() {
            leftArrow.classList.toggle('sample-quotes__nav--visible', currentCard > 0);
            leftArrow.classList.toggle('sample-quotes__nav--hidden', currentCard === 0);
            
            rightArrow.classList.toggle('sample-quotes__nav--visible', currentCard < totalCards - 1);
            rightArrow.classList.toggle('sample-quotes__nav--hidden', currentCard === totalCards - 1);
            
            indicators.forEach((dot, index) => {
                dot.classList.toggle('sample-quotes__dot--active', index === currentCard);
            });
        }
        
        function scrollToCard(cardIndex) {
            if (cardIndex < 0 || cardIndex >= totalCards) return;
            if (window.innerWidth >= 768) return; // Only for mobile
            
            currentCard = cardIndex;
            const scrollDistance = getScrollDistance();
            const scrollLeft = scrollDistance * cardIndex;
            
            track.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
            
            updateNavigation();
        }
        
        // Event handlers
        leftArrow.addEventListener('click', function() {
            if (currentCard > 0 && window.innerWidth < 768) {
                scrollToCard(currentCard - 1);
            }
        });
        
        rightArrow.addEventListener('click', function() {
            if (currentCard < totalCards - 1 && window.innerWidth < 768) {
                scrollToCard(currentCard + 1);
            }
        });
        
        // Dot indicators
        indicators.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                if (window.innerWidth < 768) {
                    scrollToCard(index);
                }
            });
        });
        
        // Handle resize - reset to first card when switching to mobile
        window.addEventListener('resize', function() {
            if (window.innerWidth < 768) {
                currentCard = 0;
                track.scrollTo({ left: 0, behavior: 'auto' });
                updateNavigation();
            }
        });
        
        // Initialize
        updateNavigation();
    }
})();