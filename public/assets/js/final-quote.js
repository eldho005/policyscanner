document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const elements = {
        // Coverage Type Modal Elements
        modal: document.getElementById('coverageTypeModal'),
        coverageOptions: {
            WL: document.getElementById('wholeLifeOption'),
            TI: document.getElementById('termLifeOption'),
            MI: document.getElementById('mortgageOption'),
            CI: document.getElementById('criticalIllnessOption')
        },
        currentInsuranceTypeDisplay: document.getElementById('currentInsuranceType'),
        
        // Quote Page Elements
        tooltipTriggers: document.querySelectorAll('[data-bs-toggle="tooltip"]'),
        featuresTabs: document.querySelectorAll('.features-tab'),
        tabPanes: document.querySelectorAll('.tab-pane'),
        coverageSlider: document.getElementById('coverageSlider'),
        sliderValue: document.querySelector('.slider-value'),
        periodButtons: document.querySelectorAll('.period-btn'),
        filterPills: document.querySelectorAll('.filter-pill'),
        allCoverageOptions: document.querySelectorAll('.coverage-option')
    };
    
    // Configuration values
    const config = {
        coverageValues: ['$500K', '$1M', '$2M', '$3M', '$5M'],
        insuranceTypes: {
            WL: { 
                code: 'WL', 
                productType: 'Whole Life NP', 
                displayName: 'Whole Life Insurance' 
            },
            TI: { 
                code: 'TI', 
                productType: 'Level Term', 
                displayName: 'Term Life Insurance' 
            },
            MI: { 
                code: 'MI', 
                productType: 'Decreasing Term', 
                displayName: 'Mortgage Protection' 
            },
            CI: { 
                code: 'CI', 
                productType: 'Critical Illness', 
                displayName: 'Critical Illness Insurance' 
            }
        }
    };
    
    // Initialize state
    const state = {
        selectedInsurance: localStorage.getItem('ins') || 'WL'
    };
    
    // Initialize UI components
    function initializeUI() {
        // Initialize tooltips
        if (elements.tooltipTriggers.length) {
            elements.tooltipTriggers.forEach(el => new bootstrap.Tooltip(el));
        }
        
        // Initialize insurance type display
        updateInsuranceTypeDisplay(state.selectedInsurance);
        
        // Update modal badge on first load
        if (elements.modal) {
            const bsModal = new bootstrap.Modal(elements.modal);
            
            elements.modal.addEventListener('show.bs.modal', () => {
                // Update current badge when modal opens
                updateCurrentBadge(state.selectedInsurance);
            });
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // 1. Feature tabs functionality
        elements.featuresTabs.forEach(tab => {
            tab.addEventListener('click', handleTabClick);
        });
        
        // 2. Coverage slider functionality
        if (elements.coverageSlider) {
            elements.coverageSlider.addEventListener('input', handleSliderChange);
        }
        
        // 3. Period toggle buttons
        elements.periodButtons.forEach(button => {
            button.addEventListener('click', handlePeriodToggle);
        });
        
        // 4. Filter pill selection
        elements.filterPills.forEach(pill => {
            pill.addEventListener('click', handlePillSelection);
        });
        
        // 5. Coverage options in modal
        Object.entries(elements.coverageOptions).forEach(([code, element]) => {
            if (element) {
                element.addEventListener('click', () => handleCoverageSelection(code));
                
                // Add keyboard accessibility
                element.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCoverageSelection(code);
                    }
                });
            }
        });
    }
    
    // Event Handlers
    function handleTabClick() {
        const section = this.closest('.features-section');
        const tabId = this.getAttribute('data-tab');
        
        // Update tab active states
        section.querySelectorAll('.features-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        this.classList.add('active');
        
        // Show corresponding content
        section.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
    }
    
    function handleSliderChange() {
        if (elements.sliderValue) {
            elements.sliderValue.textContent = config.coverageValues[this.value - 1];
        }
    }
    
    function handlePeriodToggle() {
        elements.periodButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    }
    
    function handlePillSelection() {
        //elements.filterPills.forEach(pill => pill.classList.remove('active'));
        //this.classList.add('active');
    }
    
    function handleCoverageSelection(code) {
        const loader = document.getElementById('quoteLoaderBg');
    
        // Immediately mark the selection (visually)
        state.selectedInsurance = code;
        localStorage.setItem('ins', code);
        updateCurrentBadge(code);
        updateInsuranceTypeDisplay(code);
    
        // Show loader
        if (loader) loader.style.display = 'flex';
    
        setTimeout(() => {
            // Simulate loading completion
            if (loader) loader.style.display = 'none';
    
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('coverageTypeModal'));
            if (modal) modal.hide();
    
            // Trigger event
            const event = new CustomEvent('coverageTypeChanged', {
                detail: config.insuranceTypes[code]
            });
            document.dispatchEvent(event);
        }, 2000); // 2-second delay
    }
 
    
 
    
    // UI Update Functions
    function updateCurrentBadge(code) {
        // Clear existing badges
        document.querySelectorAll('.current-option').forEach(badge => badge.remove());
        
        // Add badge to selected option
        const selectedOption = elements.coverageOptions[code];
        if (selectedOption) {
            const badge = document.createElement('span');
            badge.className = 'current-option';
            badge.textContent = 'Current';
            selectedOption.querySelector('.d-flex').appendChild(badge);
        }
    }
    
    function updateInsuranceTypeDisplay(code) {
        if (elements.currentInsuranceTypeDisplay) {
            //const insuranceType = config.insuranceTypes[code];
            //elements.currentInsuranceTypeDisplay.textContent = insuranceType.displayName;
        }
    }
    
    // Initialize the application
    initializeUI();
    setupEventListeners();
});