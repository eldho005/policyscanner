// Enhanced Modal Controller with Premium UX
class InsuranceSelectionModal {
	constructor() {
		this.modal = document.getElementById('insuranceSelectionModal');
		this.openBtn = document.getElementById('openModalBtn');
		this.closeBtn = document.getElementById('closeModalBtn');
		this.options = document.querySelectorAll('.insurance-selection__option');
		this.currentSelection = 'term-life';
		
		this.init();
	}
	
	init() {
		// Event listeners
		this.openBtn.addEventListener('click', () => this.open());
		this.closeBtn.addEventListener('click', () => this.close());
		this.modal.addEventListener('click', (e) => {
			if (e.target === this.modal) this.close();
		});
		
		// Option selection with enhanced UX
		this.options.forEach(option => {
			option.addEventListener('click', () => {
				const type = option.dataset.type;
				this.selectOption(type);
				
				// Provide visual feedback before closing
				setTimeout(() => {
					this.close();
				}, 600);
			});
		});
		
		// Enhanced keyboard support
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && this.isOpen()) {
				this.close();
			}
		});
	}
	
	open() {
		this.modal.classList.add('insurance-selection--active');
		document.body.style.overflow = 'hidden';
		
		// Enhanced focus management
		setTimeout(() => {
			const currentOption = this.modal.querySelector('.insurance-selection__option--current');
			if (currentOption) currentOption.focus();
		}, 300);
		
		console.log('Insurance selection modal opened');
	}
	
	close() {
		this.modal.classList.remove('insurance-selection--active');
		document.body.style.overflow = '';
		
		console.log('Insurance selection modal closed');
	}
	
	isOpen() {
		return this.modal.classList.contains('insurance-selection--active');
	}
	
	selectOption(type) {
		// Remove current selection
		this.options.forEach(option => {
			option.classList.remove('insurance-selection__option--current');
			const badge = option.querySelector('.insurance-selection__option-badge');
			if (badge) badge.remove();
		});
		
		// Add new selection with premium animation
		const selectedOption = this.modal.querySelector(`[data-type="${type}"]`);
		if (selectedOption) {
			selectedOption.classList.add('insurance-selection__option--current');
			
			// Create and add current badge
			const badge = document.createElement('span');
			badge.className = 'insurance-selection__option-badge';
			badge.textContent = 'Current';
			selectedOption.appendChild(badge);
		}
		
		this.currentSelection = type;
		
		// Dispatch custom event for integration
		const event = new CustomEvent('insuranceSelection:changed', { 
			detail: { type: type, option: selectedOption },
			bubbles: true 
		});
		document.dispatchEvent(event);
		
		console.log('Insurance type selected:', type);
	}
}

// Initialize enhanced modal
const insuranceModal = new InsuranceSelectionModal();

// Listen for selection changes
document.addEventListener('insuranceSelection:changed', (e) => {
	console.log('Selection changed to:', e.detail.type);
	// Integration point for your application
});