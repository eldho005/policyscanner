// How It Works Component JavaScript
// Interactive phone demo with progress tracking

(function() {
    'use strict';
    
    // Demo System
    const Demo = {
        currentScreen: 1,
        totalScreens: 4,
        autoAdvanceInterval: null,
        isInitialized: false,
        progressStep: 1
    };

    function showScreen(screenNumber) {
        const allScreens = document.querySelectorAll('.how-it-works__screen');
        allScreens.forEach(screen => {
            screen.classList.remove('how-it-works__screen--active');
        });
        
        const targetScreen = document.querySelector(`[data-screen="${screenNumber}"]`);
        if (targetScreen) {
            targetScreen.classList.add('how-it-works__screen--active');
            Demo.currentScreen = screenNumber;
            updateProgress();
            return true;
        }
        return false;
    }

    function nextScreen() {
        if (Demo.currentScreen < Demo.totalScreens) {
            showScreen(Demo.currentScreen + 1);
        } else {
            // CONTINUOUS LOOP: Restart from beginning
            showScreen(1);
            Demo.progressStep = 1; // Reset progress for continuous loop
        }
    }

    function updateProgress() {
        let targetStep = 1;
        
        if (Demo.currentScreen === 1) {
            targetStep = 1;
        } else if (Demo.currentScreen === 2) {
            targetStep = 2;
        } else if (Demo.currentScreen === 3) {
            targetStep = 3;
        } else if (Demo.currentScreen === 4) {
            targetStep = 3; // Keep showing step 3 content for completion screen
        }
        
        // UPDATED: Allow jumping to any step, not just progressive
        Demo.progressStep = targetStep;
        
        // Update progress segments
        const segments = document.querySelectorAll('.how-it-works__progress-segment');
        const labels = document.querySelectorAll('.how-it-works__progress-label');
        
        segments.forEach((segment, index) => {
            const step = index + 1;
            segment.classList.remove('how-it-works__progress-segment--completed', 'how-it-works__progress-segment--active');
            
            if (step < Demo.progressStep) {
                segment.classList.add('how-it-works__progress-segment--completed');
            } else if (step === Demo.progressStep) {
                segment.classList.add('how-it-works__progress-segment--active');
                segment.style.animation = 'none';
                segment.offsetHeight;
                segment.style.animation = null;
            }
        });
        
        // Update progress labels
        labels.forEach((label, index) => {
            const step = index + 1;
            label.classList.remove('how-it-works__progress-label--completed', 'how-it-works__progress-label--active');
            
            if (step < Demo.progressStep) {
                label.classList.add('how-it-works__progress-label--completed');
            } else if (step === Demo.progressStep) {
                label.classList.add('how-it-works__progress-label--active');
            }
        });
        
        // Update content by reading from HTML data attributes - NO HARDCODED VALUES
        updateContentFromHTML();
    }

    function updateContentFromHTML() {
        const title = document.querySelector('.how-it-works__progress-title');
        const subtitle = document.querySelector('.how-it-works__progress-subtitle');
        
        // Find the active step label and read its data attributes
        const activeLabel = document.querySelector(`.how-it-works__progress-label[data-step="${Demo.progressStep}"]`);
        
        if (activeLabel && title && subtitle) {
            const stepTitle = activeLabel.getAttribute('data-title');
            const stepSubtitle = activeLabel.getAttribute('data-subtitle');
            
            if (stepTitle) title.textContent = stepTitle;
            if (stepSubtitle) subtitle.textContent = stepSubtitle;
        }
    }

    function startAutoAdvance() {
        stopAutoAdvance();
        Demo.autoAdvanceInterval = setInterval(() => {
            nextScreen();
        }, 4000);
    }

    function stopAutoAdvance() {
        if (Demo.autoAdvanceInterval) {
            clearInterval(Demo.autoAdvanceInterval);
            Demo.autoAdvanceInterval = null;
        }
    }

    function restartAutoAdvance() {
        stopAutoAdvance();
        startAutoAdvance();
    }

    function setupOptionSelection() {
        const options = document.querySelectorAll('.how-it-works__option');
        options.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                options.forEach(opt => opt.classList.remove('how-it-works__option--selected'));
                this.classList.add('how-it-works__option--selected');
                restartAutoAdvance();
            });
        });
    }

    function setupFormInteractions() {
        const formElements = document.querySelectorAll('.how-it-works__form-group select, .how-it-works__form-group input');
        formElements.forEach(element => {
            element.addEventListener('focus', () => {
                stopAutoAdvance();
            });
            element.addEventListener('blur', () => {
                startAutoAdvance();
            });
            element.addEventListener('change', () => {
                restartAutoAdvance();
            });
        });
    }

    function setupProgressNavigation() {
        const labels = document.querySelectorAll('.how-it-works__progress-label');
        labels.forEach((label, index) => {
            label.addEventListener('click', function(e) {
                e.preventDefault();
                const step = parseInt(this.dataset.step);
                
                // JUMP TO ANY STEP: Allow clicking on any step
                Demo.progressStep = step;
                showScreen(step); // Show corresponding phone screen
                restartAutoAdvance();
            });
            
            label.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const step = parseInt(e.target.dataset.step);
                    
                    // JUMP TO ANY STEP: Allow keyboard navigation to any step
                    Demo.progressStep = step;
                    showScreen(step);
                    restartAutoAdvance();
                }
            });
        });
    }

    function setupButtonInteractions() {
        const continueButtons = document.querySelectorAll('.how-it-works__continue-btn');
        const getRateButtons = document.querySelectorAll('.how-it-works__get-rate-btn');
        
        continueButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                nextScreen();
                restartAutoAdvance();
            });
        });
        
        getRateButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                nextScreen();
                restartAutoAdvance();
            });
        });
    }

    function setupTouchNavigation() {
        const phoneContent = document.querySelector('.how-it-works__screen-content');
        if (!phoneContent) return;
        
        let startX = 0;
        let startY = 0;
        
        phoneContent.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        }, { passive: true });
        
        phoneContent.addEventListener('touchend', (e) => {
            const touch = e.changedTouches[0];
            const distX = touch.clientX - startX;
            const distY = touch.clientY - startY;
            
            if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 50) {
                if (distX > 0 && Demo.currentScreen > 1) {
                    showScreen(Demo.currentScreen - 1);
                    restartAutoAdvance();
                } else if (distX < 0 && Demo.currentScreen < Demo.totalScreens) {
                    nextScreen();
                    restartAutoAdvance();
                }
            }
        }, { passive: true });
    }

    function initializeDemo() {
        if (Demo.isInitialized) return;
        
        showScreen(1);
        updateContentFromHTML(); // Set initial content
        setupOptionSelection();
        setupFormInteractions();
        setupProgressNavigation();
        setupButtonInteractions();
        setupTouchNavigation();
        
        Demo.isInitialized = true;
        
        // Start auto-advance after initial delay
        setTimeout(() => {
            startAutoAdvance();
        }, 2000);
    }

    // Enhanced error handling
    window.addEventListener('error', function(e) {
        console.warn('How It Works component error handled:', e.error);
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDemo);
    } else {
        initializeDemo();
    }

    // Fallback initialization
    setTimeout(() => {
        if (!Demo.isInitialized) {
            initializeDemo();
        }
    }, 3000);

    console.log('How It Works component initialized');
    console.log('• Interactive phone demo with 4 screens');
    console.log('• Continuous loop - restarts after completion');
    console.log('• Clickable steps - jump to any step directly');
    console.log('• Auto-advance every 4 seconds');
    console.log('• Touch/swipe navigation');
    console.log('• Mobile-first responsive design');
    
})();