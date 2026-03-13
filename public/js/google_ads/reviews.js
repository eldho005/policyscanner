// Reviews Component JavaScript
// Simple review cycling functionality for PolicyScanner testimonials

(function() {
    'use strict';
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Reviews data - Ontario customers only
    const reviews = [
        {
            text: "PolicyScanner helped me compare life insurance quotes from multiple insurers in minutes. I found a policy with better coverage and saved $400 per year compared to what I was paying before.",
            name: "Sarah M.",
            location: "Toronto, Ontario"
        },
        {
            text: "Finally, a service that actually compares real quotes instead of just collecting my information. Got my term life policy approved in just two weeks with the best rate.",
            name: "Michael K.",
            location: "Ottawa, Ontario"
        },
        {
            text: "The comparison tool showed me options I never knew existed. PolicyScanner saved me time and money while helping me understand my choices.",
            name: "Lisa T.",
            location: "Hamilton, Ontario"
        },
        {
            text: "Excellent service! They found me a no-medical exam policy when I thought it wasn't possible. The quote comparison was eye-opening.",
            name: "David R.",
            location: "London, Ontario"
        },
        {
            text: "Professional, fast, and transparent. PolicyScanner compared multiple insurers for me and I got the perfect policy for my family's needs.",
            name: "Jennifer L.",
            location: "Mississauga, Ontario"
        }
    ];

    let currentReviewIndex = 0;
    let rotationInterval;
    
    const reviewText = document.getElementById('review-text');
    const reviewerName = document.getElementById('reviewer-name');
    const reviewerLocation = document.getElementById('reviewer-location');
    const reviewContainer = document.getElementById('current-review');
    
    // Touch gesture variables
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;
    
    function updateReview(index) {
        const review = reviews[index];
        if (review && reviewText && reviewerName && reviewerLocation) {
            if (!prefersReducedMotion && reviewContainer) {
                reviewContainer.style.opacity = '0.7';
                setTimeout(() => {
                    reviewText.textContent = review.text;
                    reviewerName.textContent = review.name;
                    reviewerLocation.textContent = review.location;
                    reviewContainer.style.opacity = '1';
                }, 150);
            } else {
                reviewText.textContent = review.text;
                reviewerName.textContent = review.name;
                reviewerLocation.textContent = review.location;
            }
        }
    }
    
    function rotateReviews() {
        currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
        updateReview(currentReviewIndex);
    }
    
    function startRotation() {
        if (!prefersReducedMotion) {
            rotationInterval = setInterval(rotateReviews, 12000);
        }
    }
    
    function stopRotation() {
        if (rotationInterval) {
            clearInterval(rotationInterval);
            rotationInterval = null;
        }
    }
    
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            stopRotation();
            
            if (swipeDistance > 0) {
                currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
            } else {
                currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
            }
            
            updateReview(currentReviewIndex);
            
            setTimeout(() => {
                if (!prefersReducedMotion) {
                    startRotation();
                }
            }, 8000);
        }
    }
    
    if (reviewContainer) {
        reviewContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        reviewContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
        
        reviewContainer.addEventListener('mouseenter', stopRotation);
        reviewContainer.addEventListener('mouseleave', () => {
            if (!prefersReducedMotion) {
                setTimeout(startRotation, 1000);
            }
        });
        
        reviewContainer.addEventListener('touchstart', () => {
            if (!prefersReducedMotion) {
                reviewContainer.style.transform = 'scale(0.98)';
            }
        });
        
        reviewContainer.addEventListener('touchend', () => {
            if (!prefersReducedMotion) {
                reviewContainer.style.transform = 'scale(1)';
            }
        });
    }
    
    // Initialize reviews
    updateReview(0);
    startRotation();
    
    // Respect reduced motion preference changes
    const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionMediaQuery.addEventListener('change', (e) => {
        if (e.matches) {
            stopRotation();
        } else {
            startRotation();
        }
    });
    
    console.log('Reviews component initialized with touch navigation and auto-rotation');
    
})();