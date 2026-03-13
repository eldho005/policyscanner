/**
 * Insurance Sidebar - Simple Open/Close Functionality
 * Mobile-first progressive design - Function-based approach
 * 
 * @version 1.0.0
 */

// Global variables
let sidebarPlan = null;
let overlayPlan = null;
let modalPlan = null;
let openBtnPlan= null;
let closeBtnPlan = null;
let isOpenPlan = false;

/**
 * Initialize the sidebar
 */
function initSidebarPlan() {
  // Find elements
  sidebarPlan = document.querySelector('#insuranceSidebar');
  overlayPlan = document.querySelector('.insurance-sidebar__overlay');
  modalPlan = document.querySelector('.insurance-sidebar__modal');
  openBtnPlan = document.querySelector('.openPlanDetailSidebar');
  closeBtnPlan = document.querySelector('.insurance-sidebar__close');
  
  // Initialize if elements exist
  if (sidebarPlan && overlayPlan && modalPlan) {
    bindEventsPlan();
  }
}

/**
 * Bind all event listeners
 */
function bindEventsPlan() {
  // Open button event
  if (openBtnPlan) {
    openBtnPlan.addEventListener('click', openSidebarPlan);
  }
  
  // Close button event
  if (closeBtnPlan) {
    closeBtnPlan.addEventListener('click', closeSidebarPlan);
  }
  
  // Close on overlay click
  overlayPlan.addEventListener('click', function(e) {
    if (e.target === overlayPlan) {
      closeSidebarPlan();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && isOpenPlan) {
      closeSidebarPlan();
    }
  });



	$(document).on('click', '.openPlanDetailSidebar', function(e){
		e.preventDefault();
		let cardId = $(this).data('card');
		bindHTML(cardId);
		openSidebarPlan();
	});

}

/**
 * Open the sidebar
 */
function openSidebarPlan() {
  if (isOpenPlan) return;
  
  // Add active classes for smooth animation
  overlayPlan.classList.add('insurance-sidebar__overlay--active');
  modalPlan.classList.add('insurance-sidebar__modal--active');
  
  // Prevent body scroll on mobile
  document.body.style.overflow = 'hidden';
  
  // Update state
  isOpenPlan = true;
  
  // Focus close button for accessibility
  setTimeout(function() {
    if (closeBtnPlan) {
      closeBtnPlan.focus();
    }
  }, 100);
}

/**
 * Close the sidebar
 */
function closeSidebarPlan() {
  if (!isOpenPlan) return;
  
  // Remove active classes for smooth animation
  overlayPlan.classList.remove('insurance-sidebar__overlay--active');
  modalPlan.classList.remove('insurance-sidebar__modal--active');
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  // Update state
  isOpenPlan = false;
  
  // Return focus to open button
  if (openBtnPlan) {
    openBtnPlan.focus();
  }
}

/**
 * Toggle sidebar open/closed
 */
function toggleSidebarPlan() {
  if (isOpenPlan) {
    closeSidebarPlan();
  } else {
    openSidebarPlan();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initSidebarPlan);





function bindHTML(cardId){
	let $card = $('.'+cardId);
	
	let rateData = {
		tagId : $card.data('tagid'),
		company : $card.data('company'),
		company_logo : $card.data('company-logo'),
		company_started : $card.data('company-started'),
		company_rating : $card.data('company-rating'),
		company_headquarters : $card.data('company-headquarters'),
		company_market_scope : $card.data('company-market_scope'),
		monthly_price : $card.data('monthly_price'),
		yearly_price : $card.data('yearly_price'),
		coverage : $card.data('coverage'),
		term : $card.data('term'),
		term_type : $card.data('term_type'),
		term_key : $card.data('term_key'),
		age : $card.data('age'),
		age_until : $card.data('age_until'),
	}
	
	
	//...
	let covAmount = '$'+rateData.monthly_price;
	let coverage_premium_text = 'Monthly Premium';
	let coverage_premium_amount = `$${rateData.monthly_price} (guaranteed for the full ${rateData.term})`;
	let ageUntil = 'At age '+rateData.age_until;
	if(currentPremium=='yearly'){
		// covAmount = '$'+rateData.yearly_price+'/year';
		// coverage_premium_text = 'Yearly Premium';
		// coverage_premium_amount = `$${rateData.yearly_price} (guaranteed for the full ${rateData.term})`;
	}
	if(rateData.term_type == 'whole-life'){
		ageUntil = 'Life time or Age 100';
		if(rateData.term_key == '100'){
			coverage_premium_amount = `$${rateData.monthly_price} (Guaranteed for life or Age 100)`;
		}
		else {
			coverage_premium_amount = `$${rateData.monthly_price} (Pay for ${rateData.term_key} Years premiums end at age ${rateData.age + rateData.term_key})`;
		}
	}

	
	$('.coverage_premium').html(covAmount);
	$('.coverage_premium_text').html(coverage_premium_text);
	$('.coverage_premium_amount').html(coverage_premium_amount);
	$('.ageUntil').html(ageUntil);

	//..
	//...no_medical
	$('#insuranceSidebar .medicalExam').html('Free Health assessment (Helps to secure best rate)');
	if(rateData.tagId=='no_medical'){
		$('#insuranceSidebar .medicalExam').html('Not Required');
	}
	
	//....
	$('.company-logo').html(`<img src="${rateData.company_logo}">`);
	$('.comp_title').html('About '+rateData.company);
	$('.comp_name').html(rateData.company);
	$('.comp_rating_founded').html(`Founded ${rateData.company_started} • ${rateData.company_rating} Rating • HQ - ${rateData.company_headquarters}`);
		
	// $('.comp_rating').html(rateData.company_rating+' Rating');
	// $('.comp_headquarters').html(rateData.company_headquarters);
	// $('.comp_market_scope').html(rateData.company_market_scope);
	
	$('.insurance-sidebar__logo').attr('src', rateData.company_logo);
	$('.insurance-sidebar__logo').attr('alt', rateData.company);
	

	//term life
	let descHtml = `<p class="insurance-sidebar__text">
					The ${rateData.term} policy from ${rateData.company} provides your family with $${rateData.coverage} in coverage for ${covAmount}, with coverage guaranteed until age ${rateData.age_until}.
					</p>
				<p class="insurance-sidebar__text">
					Your premium will not increase during the term, and you get valuable built-in features such as Term Conversion rights and Lifetime Coverage options.
				</p>
				<p class="insurance-sidebar__text">
					Before your coverage expires, you can convert to whole life or renew your policy without any additional medical exams, though at a higher premium.
				</p>`;
	//...

	//whole life
	if(rateData.term_type == 'whole-life'){
		if(rateData.term_key == '100'){
			descHtml = `
			<p>${rateData.company} - ${rateData.term} offers $${rateData.coverage} in permanent coverage for just ${covAmount}. The premiums are guaranteed to remain constant for life or until age 100.</p>

			<p>This policy provides lifelong protection and builds guaranteed cash value every year until age 100.</p> 
			<p>You can access the cash value a few years after the policy begins—making it a potential source of tax-efficient retirement income and long-term savings.</p>
			`;
		}
		else {
			descHtml = `
			<p>${rateData.company} - ${rateData.term} offers $${rateData.coverage} in permanent coverage, with premiums of ${covAmount} paid over just ${rateData.term_key} years.</p>

			<p>After ${rateData.term_key} years, your payments end—but your coverage continues for life or until age 100, with guaranteed cash value that continues to grow over time.</p>
			<p>You can access the cash value a few years after the policy begins—making it a potential source of tax-efficient retirement income and long-term savings.</p>
			`;
		}

		//...
	}
	else if(rateData.term_type == 'mortgage'){
		descHtml = `
			<p>${rateData.company} - Mortgage Protection plan provides $${rateData.coverage} in coverage through a ${rateData.term_key} Year Term Life Insurance policy for just ${covAmount}.</p>

			<p>Unlike traditional mortgage insurance, this plan uses term life insurance to protect against mortgage defaults if you pass away during the term — and it’s generally more affordable. You own the policy, so it stays with you even if you switch lenders, refinance, or move.</p>
			<p>Your family receives the full $${rateData.coverage} directly and can use it however they choose. This offers significantly more flexibility than traditional mortgage insurance, which pays to the lender directly.</p>
			`;
	}
	
	$('.insurance-desc').html(descHtml);


	
}




