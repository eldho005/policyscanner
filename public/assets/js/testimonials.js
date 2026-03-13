// Testimonial Carousel Initialization
$(document).ready(function() {
  $("#testimonialSlider").owlCarousel({
    items: 1,
    loop: true,
    margin: 20,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    smartSpeed: 800,
    nav: true,
    navText: ['<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>'],
    dots: true,
    responsive: {
      0: {
        items: 1,
        nav: false
      },
      768: {
        items: 1
      },
      992: {
        items: 1,
        nav: true
      }
    }
  });
});