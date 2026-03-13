/**
 * Component Manager - Master Integration Layer
 * Manages all PolicyScanner components on a single page
 * Prevents conflicts and coordinates initialization
 */

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.initialized = false;
        this.namespace = 'PolicyScanner';
        
        // Create global namespace
        window[this.namespace] = window[this.namespace] || {
            components: {},
            instances: {},
            utils: {}
        };
    }
    
    /**
     * Initialize all components in the correct order
     */
    init() {
        if (this.initialized) {
            console.warn('ComponentManager already initialized');
            return;
        }
        
        console.log('🚀 Initializing PolicyScanner Components...');
        
        // Initialize in dependency order
        this.initQuoteCards();
        //this.initInsuranceSidebar();
        this.initEditProfile();
        
        // Setup global coordination
        this.setupGlobalEventHandlers();
        this.setupModalCoordination();
        
        this.initialized = true;
        console.log('✅ All components initialized successfully');
        
        // Log component status
        this.logComponentStatus();
    }
    

    
    /**
     * Initialize Quote Cards Component
     */
    initQuoteCards() {
        const cards = document.querySelectorAll('.quote-card');
        const companionCards = document.querySelectorAll('.companion-card');
        
        if (cards.length > 0) {
            try {
                // Initialize quote cards
                const quoteCardInstances = [];
                cards.forEach(card => {
                    const instance = new QuoteCard(card);
                    quoteCardInstances.push(instance);
                });
                
                // Initialize companion cards
                this.initCompanionCards(companionCards);
                
                this.components.set('quoteCards', quoteCardInstances);
                window[this.namespace].instances.quoteCards = quoteCardInstances;
                
                // Setup global event listeners
                this.setupQuoteCardEvents();
                
                console.log(`✅ Quote Cards initialized (${cards.length} cards, ${companionCards.length} companion cards)`);
            } catch (error) {
                console.error('❌ Quote Cards initialization failed:', error);
            }
        }
    }
    
    /**
     * Initialize companion cards (extracted from final-quote.js)
     */
    initCompanionCards(companionCards) {
        companionCards.forEach(card => {
            const button = card.querySelector('.companion-card__button');
            if (button) {
                // Mobile-optimized touch handling
                button.addEventListener('touchstart', () => {
                    button.style.transform = 'scale(0.99)';
                }, { passive: true });
                
                button.addEventListener('touchend', () => {
                    button.style.transform = '';
                }, { passive: true });
                
                button.addEventListener('click', () => {
                    const action = button.textContent.trim();
                    const cardType = card.classList.contains('companion-card--schedule') ? 'schedule' : 'review';
                    
                    console.log(`Companion card action: ${action} (${cardType})`);
                    
                    // Emit custom event
                    card.dispatchEvent(new CustomEvent('companionCard:action', {
                        detail: { 
                            action,
                            cardType,
                            viewport: this.getViewportInfo()
                        }
                    }));
                });
            }
        });
    }
    
    /**
     * Setup quote card events (extracted from final-quote.js)
     */
    setupQuoteCardEvents() {
        document.addEventListener('quoteCard:action', (e) => {
            console.log('Quote card action:', e.detail);
            this.onQuoteCardAction(e.detail);
        });
        
        document.addEventListener('companionCard:action', (e) => {
            console.log('Companion card action:', e.detail);
            this.onCompanionCardAction(e.detail);
        });
    }
    
    /**
     * Initialize Insurance Sidebar Component
     */
    initInsuranceSidebar() {
        const sidebarElement = document.querySelector('.insurance-sidebar');
        if (sidebarElement) {
            try {
                const insuranceSidebar = new InsuranceSidebar({
                    enableEscapeKey: false, // We'll handle escape centrally
                    enableOutsideClick: true
                });
                
                this.components.set('insuranceSidebar', insuranceSidebar);
                window[this.namespace].instances.insuranceSidebar = insuranceSidebar;
                
                // Setup event listeners
                document.addEventListener('insuranceSidebar:opened', (e) => {
                    console.log('Insurance sidebar opened');
                    this.onModalOpened('insuranceSidebar');
                });
                
                document.addEventListener('insuranceSidebar:closed', (e) => {
                    console.log('Insurance sidebar closed');
                    this.onModalClosed('insuranceSidebar');
                });
                
                console.log('✅ Insurance Sidebar initialized');
            } catch (error) {
                console.error('❌ Insurance Sidebar initialization failed:', error);
            }
        }
    }
    
    /**
     * Initialize Edit Profile Component
     */
    initEditProfile() {
        const editProfileElement = document.querySelector('.edit-profile-sidebar');
        if (editProfileElement) {
            try {
                // Edit profile auto-initializes via its own init() function
                // We just need to call it manually
                if (typeof init === 'function') {
                    init(); // Call edit-profile.js init function
                }
                
                this.components.set('editProfile', true);
                window[this.namespace].instances.editProfile = true;
                
                console.log('✅ Edit Profile initialized');
            } catch (error) {
                console.error('❌ Edit Profile initialization failed:', error);
            }
        }
    }
    
    /**
     * Setup coordinated global event handlers
     */
    setupGlobalEventHandlers() {
        // Unified escape key handler with modal priority
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
        });
        
        // Coordinated resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    /**
     * Setup modal coordination to prevent conflicts
     */
    setupModalCoordination() {
        this.activeModals = new Set();
    }
    
    /**
     * Handle escape key with modal priority
     */
    handleEscapeKey(e) {
        // Priority order: Edit Profile -> Insurance Sidebar
        
        // Check if edit profile is open
        const editProfileSidebar = document.querySelector('.edit-profile-sidebar--active');
        if (editProfileSidebar) {
            // Let edit profile handle its own escape (it has unsaved changes logic)
            return;
        }
        
        // Check if insurance sidebar is open
        const insuranceSidebar = this.components.get('insuranceSidebar');
        if (insuranceSidebar && insuranceSidebar.isOpen) {
            insuranceSidebar.close(e);
            e.preventDefault();
            return;
        }
    }
    
    /**
     * Handle coordinated resize events
     */
    handleResize() {
        const viewport = this.getViewportInfo();
        console.log(`📱 Viewport changed: ${viewport.viewport} (${viewport.width}px)`);
        
        // Notify components that need resize handling
        // Quote cards handle their own resize via individual instances
        // Quote header handles its own resize
    }
    
    /**
     * Modal state management
     */
    onModalOpened(modalName) {
        this.activeModals.add(modalName);
        document.body.style.overflow = 'hidden';
    }
    
    onModalClosed(modalName) {
        this.activeModals.delete(modalName);
        
        // Only restore scroll if no modals are open
        if (this.activeModals.size === 0) {
            document.body.style.overflow = '';
        }
    }
    
    /**
     * Event handlers for component integration
     */
    onHeaderFilterChange(detail) {
        // Update quote cards based on filter
        // Implementation depends on business logic
        console.log('Filter change - could update quote cards:', detail);
    }
    
    onHeaderToggleChange(detail) {
        // Update price display based on period
        console.log('Period change - could update prices:', detail);
    }
    
    onQuoteCardAction(detail) {
        // Handle quote card button clicks
        if (detail.action === 'View Plan Details') {
            // Open insurance sidebar
            const sidebar = this.components.get('insuranceSidebar');
            if (sidebar) {
                sidebar.open();
            }
        } else if (detail.action === 'Get This Rate') {
            // Handle rate selection
            console.log('Rate selected:', detail);
        }
    }
    
    onCompanionCardAction(detail) {
        // Handle companion card actions
        if (detail.cardType === 'schedule') {
            console.log('Schedule call requested');
            // Open scheduling modal or redirect
        } else if (detail.cardType === 'review') {
            console.log('Review requested');
            // Open review flow
        }
    }
    
    /**
     * Utility functions
     */
    getViewportInfo() {
        const width = window.innerWidth;
        let viewport = 'mobile';
        if (width >= 992) viewport = 'desktop';
        else if (width >= 768) viewport = 'tablet';
        
        return {
            width,
            viewport,
            layout: viewport === 'desktop' ? 'side-by-side' : 'stacked'
        };
    }
    
    /**
     * Log component initialization status
     */
    logComponentStatus() {
        console.group('📊 Component Status');
        
        this.components.forEach((instance, name) => {
            const status = instance ? '✅ Active' : '❌ Failed';
            console.log(`${name}: ${status}`);
        });
        
        const viewport = this.getViewportInfo();
        console.log(`📱 Viewport: ${viewport.viewport} (${viewport.width}px)`);
        console.log(`📐 Layout: ${viewport.layout}`);
        
        console.groupEnd();
    }
    
    /**
     * Public API for external integration
     */
    getComponent(name) {
        return this.components.get(name);
    }
    
    getAllComponents() {
        return Array.from(this.components.keys());
    }
    
    getStatus() {
        return {
            initialized: this.initialized,
            components: this.getAllComponents(),
            activeModals: Array.from(this.activeModals),
            viewport: this.getViewportInfo()
        };
    }
}

// Auto-initialize when DOM is ready
let componentManager;

document.addEventListener('DOMContentLoaded', () => {
    componentManager = new ComponentManager();
    componentManager.init();
    
    // Make globally accessible
    window.PolicyScanner.manager = componentManager;
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentManager;
}