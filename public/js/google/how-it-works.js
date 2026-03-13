/* ==========================================================================
   HOW IT WORKS - INTERACTIVE PHONE DEMO
   Pure Vanilla JavaScript - Robust and Clean
   ========================================================================== */

// Global state
const HowItWorksDemo = {
  currentScreen: 1,
  totalScreens: 4,
  autoAdvanceInterval: null,
  isInitialized: false
};

/* ==========================================================================
   Core Navigation Functions
   ========================================================================== */

function showScreen(screenNumber) {
  // Hide all screens
  const allScreens = document.querySelectorAll('.howitworks__screen');
  allScreens.forEach(screen => {
    screen.classList.remove('howitworks__screen--active');
  });
  
  // Show target screen
  const targetScreen = document.querySelector(`[data-screen="${screenNumber}"]`);
  if (targetScreen) {
    targetScreen.classList.add('howitworks__screen--active');
    HowItWorksDemo.currentScreen = screenNumber;
    updateProgressBar();
    return true;
  }
  return false;
}

function nextScreen() {
  if (HowItWorksDemo.currentScreen < HowItWorksDemo.totalScreens) {
    showScreen(HowItWorksDemo.currentScreen + 1);
  } else {
    // Reset to first screen
    showScreen(1);
  }
}

function updateProgressBar() {
  const progressBar = document.querySelector('.howitworks__progress-bar');
  if (progressBar) {
    // Show progress for first 3 screens only (form screens)
    const formScreens = 3;
    let progressScreen = Math.min(HowItWorksDemo.currentScreen, formScreens);
    const percentage = (progressScreen / formScreens) * 100;
    progressBar.style.width = `${percentage}%`;
  }
}

/* ==========================================================================
   Auto-advance System
   ========================================================================== */

function startAutoAdvance() {
  stopAutoAdvance(); // Clear any existing interval
  
  HowItWorksDemo.autoAdvanceInterval = setInterval(() => {
    nextScreen();
  }, 4000); // 4 seconds per screen
}

function stopAutoAdvance() {
  if (HowItWorksDemo.autoAdvanceInterval) {
    clearInterval(HowItWorksDemo.autoAdvanceInterval);
    HowItWorksDemo.autoAdvanceInterval = null;
  }
}

function restartAutoAdvance() {
  stopAutoAdvance();
  startAutoAdvance();
}

/* ==========================================================================
   Interactive Elements
   ========================================================================== */

function setupOptionSelection() {
  const options = document.querySelectorAll('.howitworks__option');
  
  options.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove selected state from all options
      options.forEach(opt => opt.classList.remove('howitworks__option--selected'));
      
      // Add selected state to clicked option
      this.classList.add('howitworks__option--selected');
      
      // Restart auto-advance
      restartAutoAdvance();
    });
  });
}

function setupFormInteractions() {
  const formElements = document.querySelectorAll('.howitworks__form-select, .howitworks__form-input');
  
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

function setupContinueButtons() {
  const continueButtons = document.querySelectorAll('.howitworks__continue-btn');
  
  continueButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      nextScreen();
      restartAutoAdvance();
    });
  });
}

function setupGetRateButton() {
  const getRateButton = document.querySelector('.howitworks__get-rate-btn');
  
  if (getRateButton) {
    getRateButton.addEventListener('click', function(e) {
      e.preventDefault();
      nextScreen(); // Go to completion screen
      restartAutoAdvance();
    });
  }
}

/* ==========================================================================
   Intersection Observer for Performance
   ========================================================================== */

function setupIntersectionObserver() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: just start auto-advance
    startAutoAdvance();
    return;
  }
  
  const phoneContainer = document.querySelector('.howitworks__phone-container');
  
  if (phoneContainer) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startAutoAdvance();
          } else {
            stopAutoAdvance();
          }
        });
      },
      { threshold: 0.3 }
    );
    
    observer.observe(phoneContainer);
  }
}

/* ==========================================================================
   Touch Navigation for Mobile
   ========================================================================== */

function setupTouchNavigation() {
  const phoneContent = document.querySelector('.howitworks__phone-content');
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
    
    // Check if it's a horizontal swipe (minimum 50px)
    if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > 50) {
      if (distX > 0 && HowItWorksDemo.currentScreen > 1) {
        // Swipe right - previous screen
        showScreen(HowItWorksDemo.currentScreen - 1);
        restartAutoAdvance();
      } else if (distX < 0 && HowItWorksDemo.currentScreen < HowItWorksDemo.totalScreens) {
        // Swipe left - next screen
        nextScreen();
        restartAutoAdvance();
      }
    }
  }, { passive: true });
}

/* ==========================================================================
   Page Visibility Management
   ========================================================================== */

function setupVisibilityHandling() {
  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoAdvance();
    } else {
      startAutoAdvance();
    }
  });
  
  // Handle window focus/blur
  window.addEventListener('focus', startAutoAdvance);
  window.addEventListener('blur', stopAutoAdvance);
  
  // Clean up on page unload
  window.addEventListener('beforeunload', stopAutoAdvance);
}

/* ==========================================================================
   Initialization
   ========================================================================== */

function initializeDemo() {
  console.log('🚀 Initializing How It Works Demo...');
  
  // Check if already initialized
  if (HowItWorksDemo.isInitialized) {
    console.log('✅ Demo already initialized');
    return;
  }
  
  // Ensure first screen is active
  showScreen(1);
  
  // Setup all interactive elements
  setupOptionSelection();
  setupFormInteractions();
  setupContinueButtons();
  setupGetRateButton();
  
  // Setup navigation
  setupTouchNavigation();
  
  // Setup visibility handling
  setupVisibilityHandling();
  
  // Setup intersection observer for performance
  setupIntersectionObserver();
  
  // Mark as initialized
  HowItWorksDemo.isInitialized = true;
  
  console.log('✅ How It Works Demo initialized successfully');
  
  // Start auto-advance after a short delay
  setTimeout(() => {
    startAutoAdvance();
    console.log('▶️ Auto-advance started');
  }, 2000);
}

/* ==========================================================================
   Public API
   ========================================================================== */

// Make functions globally available
window.nextScreen = nextScreen;
window.showScreen = showScreen;

// Expose demo controls
window.HowItWorksDemo = {
  // Navigation
  nextScreen,
  showScreen,
  goToScreen: showScreen, // Alias
  resetToFirstScreen: () => showScreen(1),
  
  // Controls
  start: startAutoAdvance,
  stop: stopAutoAdvance,
  restart: restartAutoAdvance,
  
  // State
  getCurrentScreen: () => HowItWorksDemo.currentScreen,
  getTotalScreens: () => HowItWorksDemo.totalScreens,
  isRunning: () => HowItWorksDemo.autoAdvanceInterval !== null,
  
  // Debugging
  debug: () => {
    console.log('📊 Demo State:', {
      currentScreen: HowItWorksDemo.currentScreen,
      totalScreens: HowItWorksDemo.totalScreens,
      isRunning: HowItWorksDemo.autoAdvanceInterval !== null,
      isInitialized: HowItWorksDemo.isInitialized
    });
  }
};

/* ==========================================================================
   DOM Ready Handler
   ========================================================================== */

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeDemo);
} else {
  // DOM is already loaded
  initializeDemo();
}

// Fallback initialization after a delay
setTimeout(() => {
  if (!HowItWorksDemo.isInitialized) {
    console.log('⚠️ Fallback initialization triggered');
    initializeDemo();
  }
}, 3000);

/* ==========================================================================
   Development Helpers (for testing)
   ========================================================================== */

// Add keyboard shortcuts for development/testing
if (typeof window !== 'undefined') {
  document.addEventListener('keydown', (e) => {
    // Only work when How It Works section is in view
    const howitworksSection = document.querySelector('.howitworks');
    if (!howitworksSection) return;
    
    // Arrow key navigation
    if (e.key === 'ArrowRight' && HowItWorksDemo.currentScreen < HowItWorksDemo.totalScreens) {
      e.preventDefault();
      nextScreen();
      restartAutoAdvance();
    } else if (e.key === 'ArrowLeft' && HowItWorksDemo.currentScreen > 1) {
      e.preventDefault();
      showScreen(HowItWorksDemo.currentScreen - 1);
      restartAutoAdvance();
    } else if (e.key === 'Home') {
      e.preventDefault();
      showScreen(1);
      restartAutoAdvance();
    } else if (e.key === 'End') {
      e.preventDefault();
      showScreen(HowItWorksDemo.totalScreens);
      restartAutoAdvance();
    }
    
    // Development shortcuts (Ctrl/Cmd + number keys)
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
      e.preventDefault();
      const screenNum = parseInt(e.key);
      showScreen(screenNum);
      console.log(`🎯 Jumped to screen ${screenNum}`);
    }
  });
  
  console.log('⌨️ Keyboard shortcuts enabled:');
  console.log('   Arrow Left/Right: Navigate screens');
  console.log('   Home: Go to first screen');
  console.log('   End: Go to last screen');
  console.log('   Ctrl/Cmd + 1-4: Jump to specific screen');
}