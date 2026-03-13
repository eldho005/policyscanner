/**
 * PolicyScanner - Common Sidebar Functionality
 * Version: 1.1
 * Last updated: April 21, 2025
 * 
 * This script provides a flexible, reusable sidebar system for PolicyScanner.
 * It supports multiple sidebars on a page, filter tabs, collapsible sections,
 * and plan/coverage options selection.
 */

(function() {
    'use strict';
    
    // Store references to initialized sidebars
    const initializedSidebars = {};
    
    /**
     * Initialize all sidebars present on the page
     */
    function initSidebars() {
        // Find all sidebars in the document
        const sidebars = document.querySelectorAll('.policy-sidebar');
        
        if (!sidebars.length) return;
        
        // Create backdrop if it doesn't exist
        createBackdropIfNeeded();
        
        // Set up each sidebar
        sidebars.forEach(sidebar => {
            const sidebarId = sidebar.id || 'policy-sidebar-' + Math.random().toString(36).substring(2, 9);
            sidebar.id = sidebarId;
            
            setupSidebar(sidebar);
            initializedSidebars[sidebarId] = sidebar;
        });
        
        // Add event listeners to trigger buttons
        document.addEventListener('click', function(event) {
            const triggerBtn = event.target.closest('[data-toggle="sidebar"]');
            if (!triggerBtn) return;
            
            event.preventDefault();
            
            const targetSidebarSelector = triggerBtn.getAttribute('data-target');
            const sidebar = document.querySelector(targetSidebarSelector);
            
            if (sidebar) {
                openSidebar(sidebar);
            }
        });
        
        // Global ESC key handling
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                const activeSidebar = document.querySelector('.policy-sidebar.active');
                if (activeSidebar) {
                    closeSidebar(activeSidebar);
                }
            }
        });
    }
    
    /**
     * Create backdrop element if it doesn't exist
     */
    function createBackdropIfNeeded() {
        if (!document.querySelector('.sidebar-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'sidebar-backdrop';
            document.body.appendChild(backdrop);
            
            // Add click event to backdrop
            backdrop.addEventListener('click', function() {
                const activeSidebar = document.querySelector('.policy-sidebar.active');
                if (activeSidebar) {
                    closeSidebar(activeSidebar);
                }
            });
        }
    }
    
    /**
     * Set up an individual sidebar
     * @param {HTMLElement} sidebar - The sidebar element
     */
    function setupSidebar(sidebar) {
        // Set up close buttons
        const closeBtn = sidebar.querySelector('.close-btn');
        const actionCloseBtn = sidebar.querySelector('.action-close-sidebar');
        
        // Set up close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeSidebar(sidebar);
            });
        }
        
        // Set up action close button (e.g., "Got It" or "Apply")
        if (actionCloseBtn) {
            actionCloseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                closeSidebar(sidebar);
            });
        }
        
        // Set up filter tabs
        setupFilterTabs(sidebar);
        
        // Set up collapsible sections
        setupCollapsibleSections(sidebar);
        
        // Set up plan tabs
        setupPlanTabs(sidebar);
        
        // Set up coverage options
        setupCoverageOptions(sidebar);
    }
    
    /**
     * Open a sidebar
     * @param {HTMLElement} sidebar - The sidebar to open
     */
    function openSidebar(sidebar) {
        const backdrop = document.querySelector('.sidebar-backdrop');
        
        sidebar.classList.add('active');
        
        if (backdrop) {
            backdrop.classList.add('active');
        }
        
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';
        
        // Dispatch event
        const event = new CustomEvent('sidebar:opened', {
            bubbles: true,
            detail: { sidebarId: sidebar.id }
        });
        sidebar.dispatchEvent(event);
        
        // Focus the first focusable element for accessibility
        setTimeout(() => {
            const focusableElements = sidebar.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }, 100);
    }
    
    /**
     * Close a sidebar
     * @param {HTMLElement} sidebar - The sidebar to close
     */
    function closeSidebar(sidebar) {
        const backdrop = document.querySelector('.sidebar-backdrop');
        
        sidebar.classList.remove('active');
        
        if (backdrop) {
            backdrop.classList.remove('active');
        }
        
        // Restore background scrolling
        document.body.style.overflow = '';
        
        // Dispatch event
        const event = new CustomEvent('sidebar:closed', {
            bubbles: true,
            detail: { sidebarId: sidebar.id }
        });
        sidebar.dispatchEvent(event);
    }
    
    /**
     * Set up filter tabs within a sidebar
     * @param {HTMLElement} sidebar - The sidebar containing filter tabs
     */
    function setupFilterTabs(sidebar) {
        const filterTabs = sidebar.querySelectorAll('.filter-tab');
        
        if (!filterTabs.length) return;
        
        // Add click handler for filter tabs
        sidebar.addEventListener('click', function(event) {
            const filterTab = event.target.closest('.filter-tab');
            if (!filterTab) return;
            
            // Remove active class from all tabs
            filterTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            filterTab.classList.add('active');
            
            // Get the filter category
            const filter = filterTab.getAttribute('data-filter');
            
            // Get section cards
            const sectionCards = sidebar.querySelectorAll('.section-card');
            
            // Filter the sections
            sectionCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Dispatch filter event
            const filterEvent = new CustomEvent('sidebar:filter', {
                bubbles: true,
                detail: { 
                    sidebarId: sidebar.id,
                    filter: filter
                }
            });
            sidebar.dispatchEvent(filterEvent);
        });
    }
    
    /**
     * Set up collapsible sections within a sidebar
     * @param {HTMLElement} sidebar - The sidebar containing collapsible sections
     */
    function setupCollapsibleSections(sidebar) {
        // Find all toggles
        const toggles = sidebar.querySelectorAll('[data-toggle="collapse"]');
        
        toggles.forEach(toggle => {
            // Set initial aria attributes for accessibility
            const targetId = toggle.getAttribute('aria-controls');
            const target = document.getElementById(targetId);
            
            if (!target) return;
            
            const isExpanded = target.classList.contains('show');
            toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            
            // Add chevron icon if not present
            if (!toggle.querySelector('.chevron-icon')) {
                const chevronIcon = document.createElement('span');
                chevronIcon.className = 'chevron-icon';
                chevronIcon.innerHTML = '<i class="bi bi-chevron-down"></i>'; // Using Bootstrap Icons
                toggle.appendChild(chevronIcon);
                
                if (isExpanded) {
                    chevronIcon.classList.add('expand-icon-active');
                }
            }
        });
        
        // Add click event delegation
        sidebar.addEventListener('click', function(event) {
            const toggle = event.target.closest('[data-toggle="collapse"]');
            if (!toggle) return;
            
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
            const targetId = toggle.getAttribute('aria-controls');
            const target = document.getElementById(targetId);
            
            if (!target) return;
            
            // Toggle the expanded state
            toggle.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle the collapse section
            if (isExpanded) {
                target.classList.remove('show');
                toggle.querySelector('.chevron-icon')?.classList.remove('expand-icon-active');
            } else {
                target.classList.add('show');
                toggle.querySelector('.chevron-icon')?.classList.add('expand-icon-active');
            }
            
            // Dispatch collapse event
            const collapseEvent = new CustomEvent('sidebar:collapse', {
                bubbles: true,
                detail: { 
                    sidebarId: sidebar.id,
                    targetId: targetId,
                    isExpanded: !isExpanded
                }
            });
            sidebar.dispatchEvent(collapseEvent);
        });
    }
    
    /**
     * Set up plan tabs within a sidebar
     * @param {HTMLElement} sidebar - The sidebar containing plan tabs
     */
    function setupPlanTabs(sidebar) {
        const planTabs = sidebar.querySelectorAll('.plan-tab');
        
        if (!planTabs.length) return;
        
        // Add click event delegation
        sidebar.addEventListener('click', function(event) {
            const planTab = event.target.closest('.plan-tab');
            if (!planTab) return;
            
            // Remove active class from all tabs
            planTabs.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            planTab.classList.add('active');
            
            // Get the plan ID
            const planId = planTab.getAttribute('data-plan');
            
            // Get all plan content containers
            const planContents = sidebar.querySelectorAll('.plan-content');
            
            // Hide all and show selected
            planContents.forEach(content => {
                content.classList.remove('active');
                
                if (content.id === planId + '-plan') {
                    content.classList.add('active');
                }
            });
            
            // Dispatch plan change event
            const planEvent = new CustomEvent('sidebar:planChanged', {
                bubbles: true,
                detail: { 
                    sidebarId: sidebar.id,
                    planId: planId
                }
            });
            sidebar.dispatchEvent(planEvent);
        });
    }
    
    /**
     * Set up coverage options within a sidebar
     * @param {HTMLElement} sidebar - The sidebar containing coverage options
     */
    function setupCoverageOptions(sidebar) {
        const coverageOptions = sidebar.querySelectorAll('.coverage-option');
        
        if (!coverageOptions.length) return;
        
        // Add click event delegation
        sidebar.addEventListener('click', function(event) {
            const option = event.target.closest('.coverage-option');
            if (!option) return;
            
            // Get the parent container to group related options
            const container = option.closest('.coverage-options');
            
            // Remove selected class from siblings
            container.querySelectorAll('.coverage-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            option.classList.add('selected');
            
            // Dispatch coverage selected event
            const coverageEvent = new CustomEvent('sidebar:coverageSelected', {
                bubbles: true,
                detail: { 
                    sidebarId: sidebar.id,
                    optionId: option.id,
                    optionValue: option.getAttribute('data-value')
                }
            });
            sidebar.dispatchEvent(coverageEvent);
        });
    }
    
    /**
     * Initialize a sidebar with configuration options
     * @param {Object} options - Configuration options
     * @returns {Object} - Public API for the sidebar
     */
    function initSidebar(options = {}) {
        // Default options
        const defaults = {
            sidebarId: 'policy-sidebar',
            autoOpen: false,
            autoOpenDelay: 500,
            onOpen: null,
            onClose: null,
            onFilterChange: null,
            onPlanChange: null,
            onCoverageSelect: null
        };
        
        // Merge defaults with provided options
        const config = {...defaults, ...options};
        
        // Get sidebar element
        const sidebar = document.getElementById(config.sidebarId);
        
        // Ensure backdrop exists
        createBackdropIfNeeded();
        
        if (!sidebar) {
            console.error(`Sidebar with ID "${config.sidebarId}" not found.`);
            return null;
        }
        
        // Set up the sidebar
        setupSidebar(sidebar);
        
        // Store in initialized sidebars
        initializedSidebars[config.sidebarId] = sidebar;
        
        // Set up event handlers if provided
        if (typeof config.onOpen === 'function') {
            sidebar.addEventListener('sidebar:opened', config.onOpen);
        }
        
        if (typeof config.onClose === 'function') {
            sidebar.addEventListener('sidebar:closed', config.onClose);
        }
        
        if (typeof config.onFilterChange === 'function') {
            sidebar.addEventListener('sidebar:filter', config.onFilterChange);
        }
        
        if (typeof config.onPlanChange === 'function') {
            sidebar.addEventListener('sidebar:planChanged', config.onPlanChange);
        }
        
        if (typeof config.onCoverageSelect === 'function') {
            sidebar.addEventListener('sidebar:coverageSelected', config.onCoverageSelect);
        }
        
        // Auto-open if configured
        if (config.autoOpen) {
            setTimeout(() => {
                openSidebar(sidebar);
            }, config.autoOpenDelay);
        }
        
        // Return public API for this sidebar
        return {
            open: () => openSidebar(sidebar),
            close: () => closeSidebar(sidebar),
            element: sidebar,
            id: config.sidebarId
        };
    }
    
    /**
     * Programmatically open a sidebar by ID
     * @param {string} sidebarId - ID of the sidebar to open
     */
    function open(sidebarId) {
        const sidebar = initializedSidebars[sidebarId] || document.getElementById(sidebarId);
        if (sidebar) {
            openSidebar(sidebar);
        } else {
            console.error(`Sidebar with ID "${sidebarId}" not found.`);
        }
    }
    
    /**
     * Programmatically close a sidebar by ID
     * @param {string} sidebarId - ID of the sidebar to close
     */
    function close(sidebarId) {
        const sidebar = initializedSidebars[sidebarId] || document.getElementById(sidebarId);
        if (sidebar) {
            closeSidebar(sidebar);
        } else {
            console.error(`Sidebar with ID "${sidebarId}" not found.`);
        }
    }
    
    /**
     * Check if a sidebar is currently open
     * @param {string} sidebarId - ID of the sidebar to check
     * @returns {boolean} True if sidebar is open, false otherwise
     */
    function isOpen(sidebarId) {
        const sidebar = initializedSidebars[sidebarId] || document.getElementById(sidebarId);
        return sidebar ? sidebar.classList.contains('active') : false;
    }
    
    // Initialize sidebars when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebars);
    } else {
        initSidebars();
    }
    
    // Export public API
    window.PolicyScanner = window.PolicyScanner || {};
    window.PolicyScanner.Sidebar = {
        init: initSidebar,
        open: open,
        close: close,
        isOpen: isOpen
    };
  })();
  