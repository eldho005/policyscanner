/**
 * Quote Header Component JavaScript
 * Handles all interactive functionality for the quote header
 * Follows modern JavaScript practices with clean event handling
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all header functionality
    initStickyHeader();
    initQuoteCards();
    initHeaderFilters();
    initHeaderToggles();
    initHeaderSelects();
    initUserProfile();
});

/**
 * Sticky Header Functionality
 * Adds enhanced shadow when scrolled
 */
function initStickyHeader() {
    const header = document.querySelector('.quote-header');
    if (!header) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add enhanced shadow when scrolled
        if (scrollTop > 10) {
            header.classList.add('quote-header--scrolled');
        } else {
            header.classList.remove('quote-header--scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, { passive: true });
}

/**
 * Quote Cards Functionality
 * Handles tabs and buttons within quote cards
 */
function initQuoteCards() {
    const quoteCards = document.querySelectorAll('.quote-card');
    
    quoteCards.forEach(card => {
        // Tab switching functionality
        const tabs = card.querySelectorAll('.quote-card__features-tab');
        const panes = card.querySelectorAll('.quote-card__tab-pane');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Remove active state from all tabs and panes in this card
                tabs.forEach(t => t.classList.remove('quote-card__features-tab--active'));
                panes.forEach(p => p.classList.remove('quote-card__tab-pane--active'));
                
                // Add active state to clicked tab
                tab.classList.add('quote-card__features-tab--active');
                
                // Add active state to corresponding pane
                const targetPane = card.querySelector(`#${targetTab}`);
                if (targetPane) {
                    targetPane.classList.add('quote-card__tab-pane--active');
                }
                
                console.log(`Tab switched to: ${targetTab}`);
            });
        });
        
        // Button functionality
        const buttons = card.querySelectorAll('.quote-card__button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.textContent.trim();
                console.log(`Quote card button clicked: ${action}`);
                
                // Emit custom event for external handling
                card.dispatchEvent(new CustomEvent('quoteCard:action', {
                    detail: { 
                        action,
                        cardData: getCardData(card),
                        viewport: getViewportInfo()
                    }
                }));
            });
        });
    });
}

/**
 * Header Filter Pills Functionality
 * Handles All, With Medical, No Medical filter buttons
 */
function initHeaderFilters() {
    const filters = document.querySelectorAll('.quote-header__filter');
    
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            // Remove active state from all filters
            filters.forEach(f => f.classList.remove('quote-header__filter--active'));
            
            // Add active state to clicked filter
            this.classList.add('quote-header__filter--active');
            
            const filterValue = this.textContent.trim();
            console.log(`Filter changed to: ${filterValue}`);
            
            // Emit custom event for filtering functionality
            document.dispatchEvent(new CustomEvent('quoteHeader:filterChanged', {
                detail: { filter: filterValue }
            }));
        });
    });
}

/**
 * Month/Year Toggle Functionality
 * Handles the period toggle buttons
 */
function initHeaderToggles() {
    const toggleBtns = document.querySelectorAll('.quote-header__toggle-btn');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active state from all toggle buttons
            toggleBtns.forEach(b => b.classList.remove('quote-header__toggle-btn--active'));
            
            // Add active state to clicked button
            this.classList.add('quote-header__toggle-btn--active');
            
            const period = this.textContent.trim();
            console.log(`Period changed to: ${period}`);
            
            // Emit custom event for period change
            document.dispatchEvent(new CustomEvent('quoteHeader:periodChanged', {
                detail: { period: period.toLowerCase() }
            }));
        });
    });
}

/**
 * Select Dropdowns Functionality
 * Handles Coverage and Term select changes
 */
function initHeaderSelects() {
    const selects = document.querySelectorAll('.quote-header__select');
    
    selects.forEach(select => {
        select.addEventListener('change', function() {
            const label = this.previousElementSibling.textContent.replace(':', '').trim();
            const value = this.value;
            
            console.log(`${label} changed to: ${value}`);
            
            // Emit custom event for select changes
            document.dispatchEvent(new CustomEvent('quoteHeader:selectChanged', {
                detail: { 
                    field: label.toLowerCase(),
                    value: value 
                }
            }));
        });
    });
}

/**
 * User Profile Section Functionality
 * Handles Edit Profile clicks
 */
function initUserProfile() {
    const userSection = document.querySelector('.quote-header__user-section');
    
    if (userSection) {
        userSection.addEventListener('click', function() {
            console.log('Edit Profile clicked');
            
            // Emit custom event for profile functionality
            document.dispatchEvent(new CustomEvent('quoteHeader:profileClicked'));
            
            // Add your profile functionality here
            // Examples:
            // window.location.href = '/profile';
            // showProfileModal();
            // toggleProfileDropdown();
        });
    }
}

/**
 * Helper Functions
 */

/**
 * Extract card data for event handling
 * @param {Element} card - The quote card element
 * @returns {Object} Card data object
 */
function getCardData(card) {
    const logo = card.querySelector('.quote-card__logo img');
    const price = card.querySelector('.quote-card__price-amount');
    const badges = Array.from(card.querySelectorAll('.quote-card__badge')).map(b => b.textContent.trim());
    
    return {
        company: logo?.alt || '',
        price: price?.textContent || '',
        badges: badges
    };
}

/**
 * Get current viewport information
 * @returns {Object} Viewport data object
 */
function getViewportInfo() {
    const width = window.innerWidth;
    let viewport = 'mobile';
    if (width >= 992) viewport = 'desktop';
    else if (width >= 768) viewport = 'tablet';
    
    return {
        width,
        viewport,
        featuresVisible: viewport === 'desktop',
        isMobile: viewport === 'mobile'
    };
}

/**
 * Public API for external integration
 * Allows other scripts to interact with the header component
 */
window.QuoteHeader = {
    /**
     * Set active filter programmatically
     * @param {string} filterName - Name of filter to activate
     */
    setActiveFilter: function(filterName) {
        const filters = document.querySelectorAll('.quote-header__filter');
        const targetFilter = Array.from(filters).find(f => 
            f.textContent.trim().toLowerCase() === filterName.toLowerCase()
        );
        
        if (targetFilter) {
            targetFilter.click();
        }
    },
    
    /**
     * Set active period programmatically
     * @param {string} period - 'month' or 'year'
     */
    setActivePeriod: function(period) {
        const toggleBtns = document.querySelectorAll('.quote-header__toggle-btn');
        const targetBtn = Array.from(toggleBtns).find(btn => 
            btn.textContent.trim().toLowerCase() === period.toLowerCase()
        );
        
        if (targetBtn) {
            targetBtn.click();
        }
    },
    
    /**
     * Update select values programmatically
     * @param {Object} values - Object with coverage and/or term values
     */
    updateSelects: function(values) {
        if (values.coverage) {
            const coverageSelect = document.querySelector('.quote-header__select');
            if (coverageSelect) {
                coverageSelect.value = values.coverage;
                coverageSelect.dispatchEvent(new Event('change'));
            }
        }
        
        if (values.term) {
            const termSelect = document.querySelectorAll('.quote-header__select')[1];
            if (termSelect) {
                termSelect.value = values.term;
                termSelect.dispatchEvent(new Event('change'));
            }
        }
    }
};