/* ==========================================================================
   Quote Card JavaScript - Mobile-First Progressive Enhancement
   Industry standard mobile-optimized interactions
   ========================================================================== */

class QuoteCard {
    constructor(element) {
        this.element = element;
        this.init();
    }
    
    // Tab switching functionality - Desktop only
    bindTabEvents() {
        // Only bind tab events if features section is visible (desktop)
        const featuresSection = this.element.querySelector('.quote-card__features');
        if (!featuresSection || window.getComputedStyle(featuresSection).display === 'none') {
            return; // Skip tab binding on mobile/tablet
        }
        
        const tabs = this.element.querySelectorAll('.quote-card__features-tab');
        const panes = this.element.querySelectorAll('.quote-card__tab-pane');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.getAttribute('data-tab');
                
                // Remove active state from all tabs and panes
                tabs.forEach(t => t.classList.remove('quote-card__features-tab--active'));
                panes.forEach(p => p.classList.remove('quote-card__tab-pane--active'));
                
                // Add active state to clicked tab
                tab.classList.add('quote-card__features-tab--active');
                
                // Add active state to corresponding pane
                const targetPane = this.element.querySelector(`#${targetTab}, #${targetTab}-2`);
                if (targetPane) {
                    targetPane.classList.add('quote-card__tab-pane--active');
                }
                
                console.log(`Tab switched to: ${targetTab}`);
            });
        });
    }
    
    init() {
        this.bindEvents();
        this.bindTabEvents();
        
        // Re-bind tab events on window resize (responsive transitions)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            // Debounce resize events for performance
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.bindTabEvents();
            }, 250);
        });
    }
    
    bindEvents() {
        // Feature interactions - Desktop only
        const features = this.element.querySelectorAll('.quote-card__feature');
        features.forEach(feature => {
            feature.addEventListener('click', () => {
                const featureText = feature.querySelector('.quote-card__feature-text').textContent;
                console.log(`Feature clicked: ${featureText}`);
            });
        });
        
        // Button interactions - All devices with mobile-optimized touch handling
        const buttons = this.element.querySelectorAll('.quote-card__button');
        buttons.forEach(button => {
            // Mobile-optimized touch handling
            button.addEventListener('touchstart', () => {
                button.style.transform = 'scale(0.98)';
            }, { passive: true });
            
            button.addEventListener('touchend', () => {
                button.style.transform = '';
            }, { passive: true });
            
            button.addEventListener('click', () => {
                const action = button.textContent.trim();
                console.log(`Button clicked: ${action}`);
				
				
                // Emit custom event for external handling
                this.element.dispatchEvent(new CustomEvent('quoteCard:action', {
                    detail: { 
                        action,
                        cardData: this.getCardData(),
                        viewport: this.getViewportInfo()
                    }
                }));
            });
        });
    }
    
    getCardData() {
        const logo = this.element.querySelector('.quote-card__logo img');
        const price = this.element.querySelector('.quote-card__price-amount');
        const badges = Array.from(this.element.querySelectorAll('.quote-card__badge')).map(b => b.textContent.trim());
        
        return {
            company: logo?.alt || '',
            price: price?.textContent || '',
            badges: badges
        };
    }
    
    getViewportInfo() {
        const width = window.innerWidth;
        let viewport = 'mobile';
        if (width >= 992) viewport = 'desktop';
        else if (width >= 768) viewport = 'tablet';
        
        return {
            width,
            viewport,
            featuresVisible: viewport === 'desktop',
            paddingStrategy: viewport === 'mobile' ? '12px' : viewport === 'tablet' ? '16px' : '20px-32px'
        };
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile tooltip functionality
    let confirmTimeouts = new Map();
    
    function isMobile() {
        return window.innerWidth < 768;
    }
    
    function handleMobileTooltip(button) {
        if (!isMobile()){
			let cardId = button.getAttribute('data-card');
			getRateThis(cardId);
			return false;
		}
        
        const isConfirmMode = button.classList.contains('quote-card__button--confirm');
        
        if (!isConfirmMode) {
            // First tap - show tooltip and enter confirm mode
            button.classList.add('quote-card__button--confirm');
            button.textContent = 'Tap Again to Confirm';
            
            // Show tooltip
            button.classList.add('quote-card__button--show-tooltip');
            
            // Set timeout to reset
            const timeoutId = setTimeout(() => {
                resetButton(button);
            }, 8000);
            
            confirmTimeouts.set(button, timeoutId);
            return true; // Prevent default action
        } else {
            // Second tap - proceed
			//call Function
			let cardId = button.getAttribute('data-card');
			getRateThis(cardId);
			
            clearTimeout(confirmTimeouts.get(button));
            confirmTimeouts.delete(button);
            resetButton(button);
            return false; // Allow default action
        }
    }
    
    function resetButton(button) {
        button.classList.remove('quote-card__button--confirm', 'quote-card__button--show-tooltip');
        button.textContent = 'Get This Rate';
    }
    
    // Sticky header scroll enhancement
    const header = document.querySelector('.quote-header');
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
    
    // Initialize quote cards
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
            });
        });
        
        // Button functionality with mobile tooltip
        const buttons = card.querySelectorAll('.quote-card__button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Only apply mobile tooltip to primary CTA buttons
                if (button.classList.contains('quote-card__button--primary') && button.hasAttribute('data-tooltip')) {
                    const shouldPrevent = handleMobileTooltip(button);
                    if (shouldPrevent) {
                        e.preventDefault();
                        return;
                    }
                }
                console.log(`Button clicked: ${button.textContent.trim()}`);
            });
        });
    });
    
    // Reset buttons on window resize
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            document.querySelectorAll('.quote-card__button--confirm').forEach(resetButton);
            confirmTimeouts.forEach((timeout) => clearTimeout(timeout));
            confirmTimeouts.clear();
        }
    });
    
    // Filter functionality
    const filters = document.querySelectorAll('.quote-header__filter');
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            filters.forEach(f => f.classList.remove('quote-header__filter--active'));
            this.classList.add('quote-header__filter--active');
            console.log('Filter changed to:', this.textContent);
        });
    });
    
    // Toggle functionality
    const toggleBtns = document.querySelectorAll('.quote-header__toggle-btn');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleBtns.forEach(b => b.classList.remove('quote-header__toggle-btn--active'));
            this.classList.add('quote-header__toggle-btn--active');
            console.log('Period changed to:', this.textContent);
        });
    });
    
    // Select functionality
    const selects = document.querySelectorAll('.quote-header__select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            const label = this.previousElementSibling.textContent;
            console.log(`${label} changed to:`, this.value);
        });
    });
    
    // User profile section functionality
    const userSection = document.querySelector('.quote-header__user-section');
    if (userSection) {
        userSection.addEventListener('click', function() {
            console.log('Edit Profile clicked');
            // Add your profile functionality here
            // Examples:
            // window.location.href = '/profile';
            // showProfileModal();
            // toggleProfileDropdown();
        });
    }
});