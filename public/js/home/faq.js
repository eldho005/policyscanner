/* ==========================================================================
   FAQ JavaScript - Custom Accordion (No Bootstrap)
   Pure JavaScript implementation for FAQ expand/collapse
   ========================================================================== */

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFAQAccordion);
} else {
  initFAQAccordion();
}

function initFAQAccordion() {
  // Get all FAQ question buttons
  const faqQuestions = document.querySelectorAll('.faq__question');
  
  // Add click event listeners to each question
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      toggleFAQ(this);
    });
    
    // Add keyboard support (Enter and Space)
    question.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFAQ(this);
      }
    });
  });
}

function toggleFAQ(questionButton) {
  // Get the target answer element
  const targetId = questionButton.getAttribute('data-faq-target');
  const answerElement = document.getElementById(targetId);
  
  if (!answerElement) {
    console.error('FAQ answer element not found:', targetId);
    return;
  }
  
  // Check if this FAQ is currently expanded
  const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';
  
  // Close all other FAQ items (accordion behavior)
  closeAllFAQs();
  
  if (!isExpanded) {
    // Expand this FAQ
    expandFAQ(questionButton, answerElement);
  }
  // If it was expanded and we closed all, it stays closed (toggle behavior)
}

function expandFAQ(questionButton, answerElement) {
  // Update button state
  questionButton.setAttribute('aria-expanded', 'true');
  
  // Add expanded class to answer
  answerElement.classList.add('faq__answer--expanded');
  
  // Calculate and set the exact height for smooth animation
  const contentHeight = answerElement.scrollHeight;
  answerElement.style.maxHeight = contentHeight + 'px';
  
  // Optional: Smooth scroll to the question for better UX
  setTimeout(() => {
    questionButton.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }, 150);
}

function collapseFAQ(questionButton, answerElement) {
  // Update button state
  questionButton.setAttribute('aria-expanded', 'false');
  
  // Remove expanded class
  answerElement.classList.remove('faq__answer--expanded');
  
  // Reset max-height for smooth collapse
  answerElement.style.maxHeight = '0px';
}

function closeAllFAQs() {
  // Get all FAQ questions and answers
  const allQuestions = document.querySelectorAll('.faq__question');
  const allAnswers = document.querySelectorAll('.faq__answer');
  
  allQuestions.forEach(question => {
    question.setAttribute('aria-expanded', 'false');
  });
  
  allAnswers.forEach(answer => {
    answer.classList.remove('faq__answer--expanded');
    answer.style.maxHeight = '0px';
  });
}

/* ==========================================================================
   Optional: Analytics Tracking
   Track which FAQ questions users interact with
   ========================================================================== */

function trackFAQInteraction(questionText, action) {
  // Example: Send to Google Analytics or other tracking service
  if (typeof gtag !== 'undefined') {
    gtag('event', 'faq_interaction', {
      'event_category': 'FAQ',
      'event_label': questionText,
      'custom_parameter_1': action // 'expand' or 'collapse'
    });
  }
  
  // Example: Console log for debugging
  console.log('FAQ Interaction:', {
    question: questionText,
    action: action,
    timestamp: new Date().toISOString()
  });
}

/* ==========================================================================
   Accessibility Enhancements
   ========================================================================== */

// Handle focus management for keyboard users
document.addEventListener('keydown', function(event) {
  // Escape key closes all FAQs
  if (event.key === 'Escape') {
    closeAllFAQs();
    
    // Return focus to the first FAQ question
    const firstQuestion = document.querySelector('.faq__question');
    if (firstQuestion) {
      firstQuestion.focus();
    }
  }
});

// Ensure proper focus indicators are visible
document.addEventListener('keydown', function(event) {
  if (event.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

/* ==========================================================================
   Optional: URL Hash Support
   Allow linking to specific FAQ items via URL hash
   ========================================================================== */

function initHashSupport() {
  // Check if there's a hash in the URL on page load
  if (window.location.hash) {
    const targetId = window.location.hash.substring(1); // Remove #
    const targetElement = document.getElementById(targetId);
    
    if (targetElement && targetElement.classList.contains('faq__answer')) {
      // Find the corresponding question button
      const questionButton = document.querySelector(`[data-faq-target="${targetId}"]`);
      if (questionButton) {
        setTimeout(() => {
          toggleFAQ(questionButton);
        }, 500); // Small delay to ensure page is fully loaded
      }
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHashSupport);
} else {
  initHashSupport();
}