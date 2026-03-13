// ==========================================================================
// ENHANCED TOC COMPONENT - COMPLETE MOBILE & DESKTOP SUPPORT
// Mobile accordion + Desktop sidebar + Fixed 25% viewport scroll spy
// ==========================================================================

function initializeTOCComponent() {
    if (PolicyScannerComponents.toc.isInitialized) {
        console.log('TOC component already initialized');
        return;
    }
    
    console.log('Initializing enhanced TOC component with 25% viewport detection...');
    
    try {
        // Mobile TOC elements
        const mobileToggleBtn = document.getElementById('mobileToggleBtn');
        const mobileContent = document.getElementById('mobileContent');
        const mobileIcon = document.getElementById('mobileIcon');
        const mobileLinks = document.querySelectorAll('.mobile-link');
        
        // Desktop TOC elements
        const desktopProgress = document.getElementById('desktopProgress');
        const desktopLinks = document.querySelectorAll('.desktop-link');
        
        // All sections for scroll spy - multiple fallback selectors
        let sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) {
            sections = document.querySelectorAll('[id^="section-"], [id*="what-is"], [id*="types-of"], [id*="best-"], [id*="calculate"], [id*="coverage"]');
        }
        if (sections.length === 0) {
            sections = document.querySelectorAll('h2[id], h3[id]');
        }
        
        console.log('Found sections:', Array.from(sections).map(s => s.id));
        console.log('Found mobile links:', mobileLinks.length);
        console.log('Found desktop links:', desktopLinks.length);
        
        // Track current active section - ensure we always have one
        let currentActiveSection = sections.length > 0 ? sections[0].id : '';
        let currentActiveIndex = 0;
        
        // ==========================================================================
        // MOBILE ACCORDION FUNCTIONALITY
        // ==========================================================================
        
        if (mobileToggleBtn && mobileContent && mobileIcon) {
            console.log('Initializing mobile TOC accordion...');
            
            // Mobile toggle button click handler
            mobileToggleBtn.addEventListener('click', function() {
                const isExpanded = mobileContent.classList.contains('toc-mobile__content--expanded');
                
                if (isExpanded) {
                    // Collapse mobile TOC
                    mobileContent.classList.remove('toc-mobile__content--expanded');
                    mobileIcon.textContent = '▼';
                    mobileIcon.classList.remove('toc-mobile__icon--expanded');
                    console.log('Mobile TOC collapsed');
                } else {
                    // Expand mobile TOC
                    mobileContent.classList.add('toc-mobile__content--expanded');
                    mobileIcon.textContent = '▲';
                    mobileIcon.classList.add('toc-mobile__icon--expanded');
                    console.log('Mobile TOC expanded');
                }
            });
            
            // Auto-collapse mobile TOC when any link is clicked
            mobileLinks.forEach((link, index) => {
                link.addEventListener('click', function() {
                    console.log(`Mobile link clicked: ${this.getAttribute('href')}`);
                    
                    // Delay collapse to allow navigation to complete
                    setTimeout(() => {
                        mobileContent.classList.remove('toc-mobile__content--expanded');
                        mobileIcon.textContent = '▼';
                        mobileIcon.classList.remove('toc-mobile__icon--expanded');
                        console.log('Mobile TOC auto-collapsed after link click');
                    }, 300);
                });
            });
            
            console.log('Mobile TOC accordion initialized successfully');
        } else {
            console.log('Mobile TOC elements not found, skipping mobile initialization');
        }
        
        // ==========================================================================
        // DESKTOP CLICK HANDLERS
        // ==========================================================================
        
        // Add click handlers to desktop links for logging
        desktopLinks.forEach((link, index) => {
            link.addEventListener('click', function() {
                console.log(`Desktop link clicked: ${this.getAttribute('href')}`);
            });
        });
        
        // ==========================================================================
        // 25% VIEWPORT SCROLL SPY FUNCTIONALITY
        // ==========================================================================
        
        function updateActiveSection() {
            if (sections.length === 0) {
                console.log('No sections found for scroll spy');
                return;
            }
            
            const viewportHeight = window.innerHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Calculate 25% viewport threshold
            // When section top reaches 75% down from viewport top = section is 25% into viewport
            const threshold = viewportHeight * 0.75;
            
            let newActiveSection = currentActiveSection;
            let newActiveIndex = currentActiveIndex;
            
            // Find the last section that has entered 25% into viewport
            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                
                try {
                    const rect = section.getBoundingClientRect();
                    const sectionTop = rect.top;
                    
                    // Section has entered 25% into viewport when its top is at or above the 75% mark
                    if (sectionTop <= threshold) {
                        newActiveSection = section.id;
                        newActiveIndex = i;
                        // Continue to find the LAST section that meets this criteria
                    }
                } catch (e) {
                    console.warn('Error calculating section position for:', section.id, e);
                }
            }
            
            // Ensure we always have an active section (fallback to first)
            if (!newActiveSection && sections.length > 0) {
                newActiveSection = sections[0].id;
                newActiveIndex = 0;
                console.log('Fallback: Setting first section as active');
            }
            
            // Only update UI if the active section changed
            if (newActiveSection !== currentActiveSection) {
                const previousSection = currentActiveSection;
                currentActiveSection = newActiveSection;
                currentActiveIndex = newActiveIndex;
                
                console.log(`TOC active section changed: ${previousSection} → ${currentActiveSection} (${currentActiveIndex + 1}/${sections.length}) [25% viewport rule]`);
                
                // Update the UI highlighting
                updateTOCHighlighting();
            }
        }
        
        // ==========================================================================
        // TOC HIGHLIGHTING UPDATE FUNCTION
        // ==========================================================================
        
        function updateTOCHighlighting() {
            if (!currentActiveSection) {
                console.log('No active section to highlight');
                return;
            }
            
            const targetHash = `#${currentActiveSection}`;
            
            // Clear all active states first
            desktopLinks.forEach(link => {
                link.classList.remove('toc-desktop__link--current');
            });
            mobileLinks.forEach(link => {
                link.classList.remove('toc-mobile__link--current');
            });
            
            // Set new active states
            let desktopUpdated = false;
            let mobileUpdated = false;
            
            // Update desktop TOC highlighting
            desktopLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === targetHash) {
                    link.classList.add('toc-desktop__link--current');
                    desktopUpdated = true;
                }
            });
            
            // Update mobile TOC highlighting
            mobileLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === targetHash) {
                    link.classList.add('toc-mobile__link--current');
                    mobileUpdated = true;
                }
            });
            
            // Update progress indicator
            if (desktopProgress && sections.length > 0) {
                const progressText = `Section ${currentActiveIndex + 1} of ${sections.length}`;
                desktopProgress.textContent = progressText;
            }
            
            console.log(`TOC highlighting updated for ${currentActiveSection}: desktop=${desktopUpdated}, mobile=${mobileUpdated}`);
        }
        
        // ==========================================================================
        // INITIALIZE FIRST SECTION AS ACTIVE
        // ==========================================================================
        
        if (sections.length > 0) {
            currentActiveSection = sections[0].id;
            currentActiveIndex = 0;
            
            console.log(`Initializing with first section active: ${currentActiveSection}`);
            
            // Set initial highlighting
            updateTOCHighlighting();
        }
        
        // ==========================================================================
        // SCROLL EVENT LISTENERS - OPTIMIZED FOR MOBILE & DESKTOP
        // ==========================================================================
        
        let isUpdating = false;
        let scrollTimer = null;
        
        function handleScroll() {
            // Clear any pending timer
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            
            // Use requestAnimationFrame for smooth performance
            if (!isUpdating) {
                isUpdating = true;
                requestAnimationFrame(() => {
                    updateActiveSection();
                    isUpdating = false;
                });
            }
            
            // Backup timer for reliability
            scrollTimer = setTimeout(() => {
                updateActiveSection();
            }, 100);
        }
        
        // Add optimized scroll listener with passive flag for mobile performance
        window.addEventListener('scroll', handleScroll, { 
            passive: true,
            capture: false 
        });
        
        // ==========================================================================
        // MOBILE-SPECIFIC EVENT HANDLERS
        // ==========================================================================
        
        // Handle mobile orientation changes (portrait/landscape)
        window.addEventListener('orientationchange', () => {
            console.log('Orientation changed, updating TOC after delay');
            setTimeout(() => {
                updateActiveSection();
            }, 300); // Allow time for orientation change to complete
        });
        
        // Handle window resize events (mobile keyboard, browser chrome changes)
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            // Debounce resize events
            if (resizeTimer) {
                clearTimeout(resizeTimer);
            }
            resizeTimer = setTimeout(() => {
                console.log('Window resized, updating TOC');
                updateActiveSection();
            }, 150);
        });
        
        // Handle mobile touch events for better responsiveness
        if ('ontouchstart' in window) {
            console.log('Touch device detected, adding touch optimizations');
            
            // Add touch-friendly click handlers
            [mobileToggleBtn].filter(Boolean).forEach(element => {
                element.addEventListener('touchstart', function() {
                    // Add visual feedback for touch
                    this.style.opacity = '0.7';
                }, { passive: true });
                
                element.addEventListener('touchend', function() {
                    // Remove visual feedback
                    setTimeout(() => {
                        this.style.opacity = '';
                    }, 150);
                }, { passive: true });
            });
        }
        
        // ==========================================================================
        // INITIAL SCROLL SPY UPDATE
        // ==========================================================================
        
        // Force initial update after everything is set up
        setTimeout(() => {
            console.log('Running initial scroll spy update');
            updateActiveSection();
        }, 200);
        
        // Additional update after page fully loads and settles
        setTimeout(() => {
            console.log('Running delayed scroll spy update');
            updateActiveSection();
        }, 1000);
        
        // ==========================================================================
        // COMPONENT INITIALIZATION COMPLETE
        // ==========================================================================
        
        PolicyScannerComponents.toc.isInitialized = true;
        console.log('Enhanced TOC component initialization complete:', {
            mobileAccordion: !!(mobileToggleBtn && mobileContent && mobileIcon),
            sectionsFound: sections.length,
            mobileLinks: mobileLinks.length,
            desktopLinks: desktopLinks.length,
            viewportDetection: '25%',
            touchOptimized: 'ontouchstart' in window
        });
        
    } catch (error) {
        console.error('Error initializing TOC component:', error);
        
        // Attempt basic fallback initialization
        try {
            console.log('Attempting fallback TOC initialization...');
            
            // Basic mobile toggle fallback
            const fallbackBtn = document.getElementById('mobileToggleBtn');
            const fallbackContent = document.getElementById('mobileContent');
            
            if (fallbackBtn && fallbackContent) {
                fallbackBtn.addEventListener('click', () => {
                    fallbackContent.classList.toggle('toc-mobile__content--expanded');
                });
                console.log('Fallback mobile toggle initialized');
            }
            
        } catch (fallbackError) {
            console.error('Fallback initialization also failed:', fallbackError);
        }
    }
}

// ==========================================================================
// DEBUG FUNCTIONS - FOR DEVELOPMENT/TESTING
// ==========================================================================

/**
 * Debug function to visualize 25% viewport threshold and section positions
 * Call debugTOC25Percent() in console to see what's happening
 */
window.debugTOC25Percent = function() {
    const sections = document.querySelectorAll('section[id]');
    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight * 0.75;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    console.log('=== TOC 25% VIEWPORT DEBUG ===');
    console.log('Viewport height:', viewportHeight + 'px');
    console.log('Current scroll position:', Math.round(scrollTop) + 'px');
    console.log('25% threshold line (75% down from top):', Math.round(threshold) + 'px');
    console.log('');
    
    let shouldBeActive = '';
    let shouldBeIndex = 0;
    
    sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;
        const entered25Percent = sectionTop <= threshold;
        
        if (entered25Percent) {
            shouldBeActive = section.id;
            shouldBeIndex = i;
        }
        
        console.log(`${entered25Percent ? '✓' : '○'} Section ${i + 1}: ${section.id}`);
        console.log(`    Top position: ${Math.round(sectionTop)}px`);
        console.log(`    Bottom position: ${Math.round(sectionBottom)}px`);
        console.log(`    Height: ${Math.round(rect.height)}px`);
        console.log(`    Distance to 25% line: ${Math.round(sectionTop - threshold)}px`);
        console.log(`    Entered 25% viewport: ${entered25Percent}`);
        console.log('');
    });
    
    console.log(`Should be active: ${shouldBeActive} (${shouldBeIndex + 1}/${sections.length})`);
    
    // Show what's actually active in the TOC
    const activeDesktop = document.querySelector('.toc-desktop__link--current');
    const activeMobile = document.querySelector('.toc-mobile__link--current');
    
    console.log('Currently active in TOC:');
    console.log('  Desktop:', activeDesktop ? activeDesktop.getAttribute('href') : 'none');
    console.log('  Mobile:', activeMobile ? activeMobile.getAttribute('href') : 'none');
    
    // Create visual debug line on screen (removes automatically after 5 seconds)
    const existingLine = document.getElementById('debug-25-line');
    if (existingLine) {
        existingLine.remove();
    }
    
    const debugLine = document.createElement('div');
    debugLine.id = 'debug-25-line';
    debugLine.style.cssText = `
        position: fixed;
        top: ${threshold}px;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, red, orange, red);
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
    `;
    document.body.appendChild(debugLine);
    
    // Add label
    const debugLabel = document.createElement('div');
    debugLabel.style.cssText = `
        position: fixed;
        top: ${threshold - 30}px;
        left: 20px;
        background: red;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-family: monospace;
        z-index: 10000;
        pointer-events: none;
    `;
    debugLabel.textContent = '25% Viewport Threshold';
    document.body.appendChild(debugLabel);
    
    console.log('Red line shows 25% viewport threshold for 5 seconds');
    
    // Remove debug elements after 5 seconds
    setTimeout(() => {
        debugLine.remove();
        debugLabel.remove();
    }, 5000);
};

/**
 * Debug function to check TOC component status
 */
window.debugTOCStatus = function() {
    console.log('=== TOC COMPONENT STATUS ===');
    console.log('Initialized:', PolicyScannerComponents.toc.isInitialized);
    console.log('Mobile elements found:', {
        toggleBtn: !!document.getElementById('mobileToggleBtn'),
        content: !!document.getElementById('mobileContent'),
        icon: !!document.getElementById('mobileIcon'),
        links: document.querySelectorAll('.mobile-link').length
    });
    console.log('Desktop elements found:', {
        progress: !!document.getElementById('desktopProgress'),
        links: document.querySelectorAll('.desktop-link').length
    });
    console.log('Sections found:', document.querySelectorAll('section[id]').length);
};

// ==========================================================================
// STANDALONE TOC INITIALIZATION (for pages without component system)
// ==========================================================================
 
/**
 * Standalone TOC initialization for pages that don't use the component system
 * This is automatically used if PolicyScannerComponents is not defined
 */
function initStandaloneTOC() {
    console.log('Initializing standalone TOC (no component system detected)...');
    
    // Create a minimal component state for standalone mode
    window.PolicyScannerComponents = {
        toc: { isInitialized: false }
    };
    
    // Run the main TOC initialization
    initializeTOCComponent();
}

// Auto-initialize based on context
if (typeof window !== 'undefined') {
    if (typeof PolicyScannerComponents === 'undefined') {
        // Standalone mode - initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initStandaloneTOC);
        } else {
            initStandaloneTOC();
        }
    }
    // If PolicyScannerComponents exists, it will be initialized by the main component system
}

// ==========================================================================
// FAQ ACCORDION
// ==========================================================================
function initFaqAccordion() {
    var items = document.querySelectorAll('.faq-component__item');
    if (!items.length) return;
    items.forEach(function(item) {
        var btn = item.querySelector('.faq-component__question');
        if (!btn) return;
        btn.addEventListener('click', function() {
            var isActive = item.classList.contains('faq-component__item--active');
            // Close all
            items.forEach(function(i) {
                i.classList.remove('faq-component__item--active');
                var q = i.querySelector('.faq-component__question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });
            // Open clicked (unless it was already open)
            if (!isActive) {
                item.classList.add('faq-component__item--active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaqAccordion);
    } else {
        initFaqAccordion();
    }
}