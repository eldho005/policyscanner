/**
 * COVERAGE CALCULATOR COMPONENT - STANDALONE VERSION
 * DIME calculation with Ontario tax brackets + Tooltips + Chart visualization
 * Can be used independently or as part of larger component system
 */

// ==========================================================================
// COVERAGE CALCULATOR STATE MANAGEMENT
// ==========================================================================

const CoverageCalculatorComponent = {
    isInitialized: false,
    tooltipsInitialized: false
};

// ==========================================================================
// TOOLTIP FUNCTIONALITY - COVERAGE CALCULATOR SPECIFIC
// ==========================================================================

// Tooltip texts for coverage calculator fields
const tooltipTexts = {
    age: "Your current age for coverage calculation",
    dependents: "Number of children for education cost planning",
    income: "Annual income before taxes for replacement calculation",
    incomeYears: "Years of income replacement your family would need",
    debts: "Credit cards, loans, and other debts to pay off",
    mortgage: "Outstanding mortgage balance to cover",
    educationCost: "Estimated education costs per child",
    savings: "Current savings and investments to reduce coverage needs"
};

function createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'coverage-calculator-tooltip';
    tooltip.textContent = text;
    return tooltip;
}

function showTooltip(trigger, tooltip) {
    tooltip.classList.add('show');
    console.log('Showing tooltip:', tooltip.textContent);
}

function hideTooltip(tooltip) {
    tooltip.classList.remove('show');
    console.log('Hiding tooltip');
}

function initializeCoverageCalculatorTooltips() {
    if (CoverageCalculatorComponent.tooltipsInitialized) {
        console.log('Coverage calculator tooltips already initialized');
        return;
    }
    
    console.log('Initializing coverage calculator tooltips...');
    
    try {
        // Find all tooltip triggers within coverage calculator components
        const tooltipTriggers = document.querySelectorAll('.ps-component--coverage-calculator .coverage-calculator-component__tooltip-trigger') ||
                               document.querySelectorAll('.coverage-calculator-component .coverage-calculator-component__tooltip-trigger') ||
                               document.querySelectorAll('.coverage-calculator-component__tooltip-trigger');
        
        console.log(`Found ${tooltipTriggers.length} tooltip triggers`);
        
        tooltipTriggers.forEach((trigger, index) => {
            // Find the associated field ID by looking at the field structure
            const field = trigger.closest('.coverage-calculator-component__field');
            const input = field?.querySelector('input, select');
            const fieldId = input?.id;
            
            if (fieldId && tooltipTexts[fieldId]) {
                // Create and append tooltip to the trigger
                const tooltip = createTooltip(tooltipTexts[fieldId]);
                trigger.appendChild(tooltip);
                
                // Add event listeners to the question mark trigger only
                trigger.addEventListener('mouseenter', () => showTooltip(trigger, tooltip));
                trigger.addEventListener('mouseleave', () => hideTooltip(tooltip));
                
                console.log(`Tooltip initialized for field: ${fieldId}`);
            } else {
                console.warn(`No tooltip text found for field: ${fieldId}`);
            }
        });
        
        CoverageCalculatorComponent.tooltipsInitialized = true;
        console.log('Coverage calculator tooltips initialization complete');
        
    } catch (error) {
        console.error('Error initializing coverage calculator tooltips:', error);
    }
}

// ==========================================================================
// ONTARIO TAX CALCULATOR - 2024 TAX BRACKETS
// ==========================================================================

/**
 * Calculate Ontario take-home pay using 2024 tax brackets
 * Includes federal tax, provincial tax, CPP, and EI deductions
 * @param {number} grossIncome - Annual gross income
 * @returns {number} Net take-home pay after all deductions
 */
function calculateOntarioTakeHome(grossIncome) {
    if (!grossIncome || grossIncome <= 0) return 0;
    
    let federalTax = 0;
    let provincialTax = 0;
    
    // CPP and EI calculations (2024 maximum amounts)
    const cpp = Math.min(grossIncome * 0.0595, 3754.45);
    const ei = Math.min(grossIncome * 0.0229, 1002.45);
    
    // Federal Tax Brackets (2024)
    const federalBrackets = [
        { min: 15000, max: 49750, rate: 0.15 },
        { min: 49750, max: 99500, rate: 0.205 },
        { min: 99500, max: 216800, rate: 0.26 },
        { min: 216800, max: Infinity, rate: 0.33 }
    ];
    
    federalBrackets.forEach(bracket => {
        if (grossIncome > bracket.min) {
            const taxableIncome = Math.min(grossIncome - bracket.min, bracket.max - bracket.min);
            federalTax += taxableIncome * bracket.rate;
        }
    });
    
    // Ontario Provincial Tax Brackets (2024)
    const provincialBrackets = [
        { min: 11570, max: 46015, rate: 0.0505 },
        { min: 46015, max: 91000, rate: 0.0915 },
        { min: 91000, max: 150000, rate: 0.1116 },
        { min: 150000, max: 220000, rate: 0.1216 },
        { min: 220000, max: Infinity, rate: 0.1316 }
    ];
    
    provincialBrackets.forEach(bracket => {
        if (grossIncome > bracket.min) {
            const taxableIncome = Math.min(grossIncome - bracket.min, bracket.max - bracket.min);
            provincialTax += taxableIncome * bracket.rate;
        }
    });
    
    const totalDeductions = federalTax + provincialTax + cpp + ei;
    const netIncome = Math.max(0, grossIncome - totalDeductions);
    
    console.log(`Tax calculation for ${formatCurrency(grossIncome)}:`, {
        federalTax: formatCurrency(federalTax),
        provincialTax: formatCurrency(provincialTax),
        cpp: formatCurrency(cpp),
        ei: formatCurrency(ei),
        totalDeductions: formatCurrency(totalDeductions),
        netIncome: formatCurrency(netIncome)
    });
    
    return netIncome;
}

// ==========================================================================
// UTILITY FUNCTIONS - CURRENCY & INPUT HANDLING
// ==========================================================================

function formatCurrency(amount) {
    if (!amount || amount === 0) return '$0';
    return '$' + Math.round(amount).toLocaleString('en-CA');
}

function parseCurrency(value) {
    if (!value) return 0;
    const cleaned = value.toString().replace(/[$,\s]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

function formatCurrencyInput(input) {
    try {
        const value = parseCurrency(input.value);
        if (value > 0) {
            input.value = value.toLocaleString('en-CA');
        } else if (input.value && value === 0) {
            input.value = '';
        }
    } catch (error) {
        console.warn('Error formatting currency input:', error);
        input.value = '';
    }
}

function validateInput(value, min = 0, max = Infinity) {
    const num = typeof value === 'string' ? parseCurrency(value) : value;
    return Math.max(min, Math.min(max, num || 0));
}

// ==========================================================================
// DIME CALCULATION ENGINE - CORE LOGIC
// ==========================================================================

/**
 * DIME Calculation Method:
 * D = Debts (other than mortgage)
 * I = Income replacement (net income × years)
 * M = Mortgage balance
 * E = Education fund (children × cost per child)
 */
function calculateDIME() {
    try {
        console.log('Starting DIME calculation...');
        
        // Find coverage calculator component with multiple fallback selectors
        const calculatorComponent = document.querySelector('.ps-component--coverage-calculator .coverage-calculator-component') ||
                                  document.querySelector('.ps-component--coverage-calculator') ||
                                  document.querySelector('.coverage-calculator-component') ||
                                  document.querySelector('[class*="coverage-calculator"]');
        
        if (!calculatorComponent) {
            console.log('Coverage calculator component not found');
            return;
        }
        
        // Get all input values from within the component
        const age = validateInput(calculatorComponent.querySelector('#age')?.value || 35, 18, 80);
        const dependents = validateInput(calculatorComponent.querySelector('#dependents')?.value || 2, 0, 10);
        const grossIncome = validateInput(parseCurrency(calculatorComponent.querySelector('#income')?.value || '75000'), 0, 10000000);
        const incomeYears = validateInput(calculatorComponent.querySelector('#incomeYears')?.value || 10, 0, 30);
        const debts = validateInput(parseCurrency(calculatorComponent.querySelector('#debts')?.value || '25000'), 0, 5000000);
        const mortgage = validateInput(parseCurrency(calculatorComponent.querySelector('#mortgage')?.value || '300000'), 0, 10000000);
        const educationCostPerChild = validateInput(calculatorComponent.querySelector('#educationCost')?.value || 50000, 0, 200000);
        const savings = validateInput(parseCurrency(calculatorComponent.querySelector('#savings')?.value || '100000'), 0, 50000000);

        console.log('Input values:', {
            age, dependents, grossIncome, incomeYears,
            debts, mortgage, educationCostPerChild, savings
        });

        // STEP 1: Calculate Ontario net income from gross
        const netIncome = calculateOntarioTakeHome(grossIncome);
        console.log(`Tax calculation: ${formatCurrency(grossIncome)} gross → ${formatCurrency(netIncome)} net`);
        
        // STEP 2: Calculate DIME components
        const D = debts;  // Other debts (credit cards, loans, etc.)
        const I = netIncome * incomeYears;  // Income replacement
        const M = mortgage;  // Mortgage balance
        const E = dependents * educationCostPerChild;  // Education fund
        
        console.log('DIME Components:', {
            'D (Other Debts)': formatCurrency(D),
            'I (Income Replacement)': formatCurrency(I),
            'M (Mortgage)': formatCurrency(M),
            'E (Education Fund)': formatCurrency(E)
        });
        
        // STEP 3: Calculate totals
        const dimeTotal = D + I + M + E;
        const recommendedCoverage = Math.max(0, dimeTotal - savings);

        console.log('DIME Results:', {
            'Total DIME': formatCurrency(dimeTotal),
            'Minus Savings': formatCurrency(savings),
            'Final Recommendation': formatCurrency(recommendedCoverage)
        });

        // STEP 4: Update UI within the component
        updateCoverageResults(recommendedCoverage, dimeTotal, calculatorComponent);
        updateCoverageLegend(I, D + M, E, incomeYears, calculatorComponent);  // Combine D+M for display
        updateCoverageChart(I, D + M, E, calculatorComponent);  // Combine debts and mortgage for chart
        
        return {
            recommendedCoverage,
            dimeTotal,
            components: { D, I, M, E },
            netIncome,
            grossIncome
        };
        
    } catch (error) {
        console.error('Error in DIME calculation:', error);
        
        // Try to find component for error state
        const calculatorComponent = document.querySelector('.ps-component--coverage-calculator') ||
                                  document.querySelector('.coverage-calculator-component');
        if (calculatorComponent) {
            updateCoverageResults(0, 0, calculatorComponent);
        }
        
        return null;
    }
}

// ==========================================================================
// UI UPDATE FUNCTIONS - RESULTS DISPLAY
// ==========================================================================

function updateCoverageResults(recommendedCoverage, dimeTotal, component) {
    console.log('Updating coverage results:', { recommendedCoverage, dimeTotal });
    
    const resultElement = component.querySelector('#resultAmount');
    const totalElement = component.querySelector('#totalAmount');
    
    if (resultElement) {
        resultElement.textContent = formatCurrency(recommendedCoverage);
        console.log('Updated recommended coverage:', resultElement.textContent);
    }
    
    if (totalElement) {
        totalElement.textContent = formatCurrency(dimeTotal);
        console.log('Updated DIME total:', totalElement.textContent);
    }
}

function updateCoverageLegend(incomeReplacement, debtsPlusMortgage, educationFund, incomeYears, component) {
    console.log('Updating coverage legend:', { incomeReplacement, debtsPlusMortgage, educationFund, incomeYears });
    
    const incomeLabelElement = component.querySelector('#incomeLabel');
    if (incomeLabelElement) {
        const yearText = incomeYears === 0 ? 'None' : `${incomeYears} years`;
        incomeLabelElement.textContent = `Income Replacement (${yearText})`;
    }

    const incomeAmountElement = component.querySelector('#incomeAmount');
    const debtAmountElement = component.querySelector('#debtAmount');
    const educationAmountElement = component.querySelector('#educationAmount');
    
    if (incomeAmountElement) {
        incomeAmountElement.textContent = formatCurrency(incomeReplacement);
    }
    if (debtAmountElement) {
        debtAmountElement.textContent = formatCurrency(debtsPlusMortgage);
    }
    if (educationAmountElement) {
        educationAmountElement.textContent = formatCurrency(educationFund);
    }
}

function updateCoverageChart(incomeReplacement, debtsPlusMortgage, educationFund, component) {
    const total = incomeReplacement + debtsPlusMortgage + educationFund;
    const donutElement = component.querySelector('#donutChart');
    
    if (!donutElement) {
        console.log('Donut chart element not found');
        return;
    }
    
    if (total === 0) {
        donutElement.style.background = '#f0f0f0';
        console.log('Chart updated: no data to display');
        return;
    }

    // Calculate percentages for conic-gradient
    const incomePercent = (incomeReplacement / total) * 360;
    const debtPercent = (debtsPlusMortgage / total) * 360;
    const educationPercent = (educationFund / total) * 360;

    // Build gradient string
    let gradient = 'conic-gradient(';
    let currentDegree = 0;

    if (incomeReplacement > 0) {
        gradient += `#2DB5A8 ${currentDegree}deg ${currentDegree + incomePercent}deg`;
        currentDegree += incomePercent;
        if (debtsPlusMortgage > 0 || educationFund > 0) gradient += ', ';
    }

    if (debtsPlusMortgage > 0) {
        gradient += `#64B5F6 ${currentDegree}deg ${currentDegree + debtPercent}deg`;
        currentDegree += debtPercent;
        if (educationFund > 0) gradient += ', ';
    }

    if (educationFund > 0) {
        gradient += `#FFB74D ${currentDegree}deg ${currentDegree + educationPercent}deg`;
    }

    gradient += ')';
    
    donutElement.style.transition = 'all 0.6s ease';
    donutElement.style.background = gradient;

    console.log('Chart updated with proportions:', {
        income: Math.round((incomeReplacement / total) * 100) + '%',
        debts: Math.round((debtsPlusMortgage / total) * 100) + '%',
        education: Math.round((educationFund / total) * 100) + '%'
    });
}

// ==========================================================================
// EVENT LISTENERS & INPUT HANDLERS
// ==========================================================================

function setupCoverageCalculatorEventListeners() {
    console.log('Setting up coverage calculator event listeners...');
    
    // Find calculator component with multiple fallback selectors
    const calculatorComponent = document.querySelector('.ps-component--coverage-calculator .coverage-calculator-component') ||
                              document.querySelector('.ps-component--coverage-calculator') ||
                              document.querySelector('.coverage-calculator-component') ||
                              document.querySelector('[class*="coverage-calculator"]');
    
    if (!calculatorComponent) {
        console.log('Coverage calculator component not found for event listeners');
        return;
    }
    
    const inputIds = ['age', 'dependents', 'income', 'incomeYears', 'debts', 'mortgage', 'educationCost', 'savings'];
    const currencyInputIds = ['income', 'debts', 'mortgage', 'savings'];
    
    inputIds.forEach(id => {
        const element = calculatorComponent.querySelector(`#${id}`);
        if (element) {
            // Add change listener for immediate updates
            element.addEventListener('change', calculateDIME);
            
            if (currencyInputIds.includes(id)) {
                // Currency inputs - format on blur and throttle input
                element.addEventListener('blur', function() {
                    formatCurrencyInput(this);
                    calculateDIME();
                });
                
                element.addEventListener('input', function() {
                    // Only allow numbers and commas
                    this.value = this.value.replace(/[^0-9,]/g, '');
                    
                    // Throttle calculation for performance
                    clearTimeout(this.calculationTimeout);
                    this.calculationTimeout = setTimeout(calculateDIME, 500);
                });
            } else {
                // Regular inputs - throttle input
                element.addEventListener('input', function() {
                    clearTimeout(this.calculationTimeout);
                    this.calculationTimeout = setTimeout(calculateDIME, 300);
                });
            }
            
            console.log(`Event listener added for: ${id}`);
        } else {
            console.warn(`Element not found: ${id}`);
        }
    });
    
    console.log('Coverage calculator event listeners setup complete');
}

function setCoverageCalculatorDefaults() {
    console.log('Setting coverage calculator default values...');
    
    const calculatorComponent = document.querySelector('.ps-component--coverage-calculator .coverage-calculator-component') ||
                              document.querySelector('.ps-component--coverage-calculator') ||
                              document.querySelector('.coverage-calculator-component') ||
                              document.querySelector('[class*="coverage-calculator"]');
    
    if (!calculatorComponent) {
        console.log('Coverage calculator component not found for defaults');
        return;
    }
    
    const defaults = {
        age: '35',
        dependents: '2',
        income: '75000',
        incomeYears: '10',
        debts: '25000',
        mortgage: '300000',
        educationCost: '50000',
        savings: '100000'
    };
    
    Object.entries(defaults).forEach(([id, value]) => {
        const element = calculatorComponent.querySelector(`#${id}`);
        if (element && !element.value) {  // Only set if element is empty
            element.value = value;
            console.log(`Set default for ${id}: ${value}`);
        }
    });
    
    console.log('Coverage calculator defaults set');
}

// ==========================================================================
// MAIN INITIALIZATION FUNCTION
// ==========================================================================

function initializeCoverageCalculator() {
    if (CoverageCalculatorComponent.isInitialized) {
        console.log('Coverage calculator already initialized');
        return;
    }
    
    console.log('Initializing coverage calculator component...');
    
    try {
        // Check if component exists
        const calculatorComponent = document.querySelector('.ps-component--coverage-calculator .coverage-calculator-component') ||
                                  document.querySelector('.ps-component--coverage-calculator') ||
                                  document.querySelector('.coverage-calculator-component') ||
                                  document.querySelector('[class*="coverage-calculator"]');
        
        if (!calculatorComponent) {
            console.log('Coverage calculator component not found on page');
            return;
        }
        
        console.log('Coverage calculator component found, proceeding with initialization...');
        
        // Set default values
        setCoverageCalculatorDefaults();
        
        // Setup event listeners
        setupCoverageCalculatorEventListeners();
        
        // Initialize tooltips
        initializeCoverageCalculatorTooltips();
        
        // Run initial calculation after a short delay to ensure DOM is ready
        setTimeout(() => {
            console.log('Running initial DIME calculation...');
            calculateDIME();
        }, 100);
        
        CoverageCalculatorComponent.isInitialized = true;
        console.log('Coverage calculator initialization complete');
        
    } catch (error) {
        console.error('Error initializing coverage calculator:', error);
    }
}

// ==========================================================================
// PUBLIC API - COVERAGE CALCULATOR
// ==========================================================================

/**
 * Public API for the Coverage Calculator component
 */
window.CoverageCalculatorAPI = {
    
    /**
     * Initialize the coverage calculator
     */
    init: function() {
        initializeCoverageCalculator();
    },
    
    /**
     * Re-initialize the coverage calculator
     */
    reinit: function() {
        CoverageCalculatorComponent.isInitialized = false;
        CoverageCalculatorComponent.tooltipsInitialized = false;
        initializeCoverageCalculator();
    },
    
    /**
     * Run DIME calculation manually
     */
    calculate: function() {
        return calculateDIME();
    },
    
    /**
     * Get component status
     */
    getStatus: function() {
        return {
            isInitialized: CoverageCalculatorComponent.isInitialized,
            tooltipsInitialized: CoverageCalculatorComponent.tooltipsInitialized,
            componentFound: !!(document.querySelector('.coverage-calculator-component') || 
                             document.querySelector('.ps-component--coverage-calculator'))
        };
    },
    
    /**
     * Set input values programmatically
     */
    setValues: function(values) {
        const component = document.querySelector('.coverage-calculator-component') || 
                         document.querySelector('.ps-component--coverage-calculator');
        
        if (!component) {
            console.error('Coverage calculator component not found');
            return false;
        }
        
        Object.entries(values).forEach(([field, value]) => {
            const input = component.querySelector(`#${field}`);
            if (input) {
                input.value = value;
                console.log(`Set ${field} to ${value}`);
            }
        });
        
        // Recalculate after setting values
        setTimeout(calculateDIME, 100);
        return true;
    }
};

// ==========================================================================
// AUTO-INITIALIZATION
// ==========================================================================

// Auto-initialize when DOM is ready (standalone mode)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Small delay to ensure other scripts have loaded
        setTimeout(initializeCoverageCalculator, 200);
    });
} else {
    // DOM already loaded
    setTimeout(initializeCoverageCalculator, 200);
}

// Backup initialization for late-loading components
setTimeout(() => {
    if (!CoverageCalculatorComponent.isInitialized) {
        const component = document.querySelector('.coverage-calculator-component') || 
                         document.querySelector('.ps-component--coverage-calculator');
        if (component) {
            console.log('Backup initialization triggered for coverage calculator');
            initializeCoverageCalculator();
        }
    }
}, 1000);

// ==========================================================================
// COMPONENT SUMMARY
//
// ✅ COMPLETE COVERAGE CALCULATOR FUNCTIONALITY:
// - DIME calculation with Ontario 2024 tax brackets
// - Currency formatting and input validation
// - Interactive tooltips for all fields
// - Real-time chart updates with conic gradients
// - Event-driven recalculation
// - Default value management
//
// ✅ STANDALONE CAPABILITIES:
// - Works independently without larger component system
// - Auto-initialization with multiple fallbacks
// - Public API for external control
// - Component detection with multiple selectors
//
// ✅ PRODUCTION READY:
// - Error handling throughout
// - Performance optimizations (throttled inputs)
// - Comprehensive logging for debugging
// - Graceful degradation when elements missing
//
// USAGE: Include this file and it will auto-initialize any
// coverage calculator components found on the page.
// ==========================================================================