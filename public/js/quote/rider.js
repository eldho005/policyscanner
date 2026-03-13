/**
 * Simple Rider Sidebar
 * Just open/close sidebar functionality
 */

(function() {
    'use strict';
    
    function init() {
        // var openBtn = document.getElementById('openSidebarBtn');
        var openBtn = document.querySelector('.openRiders');
        var closeBtn = document.getElementById('closeSidebarBtn');
        var overlay = document.getElementById('riderSidebarOverlay');
        var modal = document.getElementById('riderSidebarModal');
        var riderButtons = document.querySelectorAll('.insurance-sidebar__rider-button');
        
        // if (!openBtn || !closeBtn || !overlay || !modal) return;
        
        // Open sidebar
        function openSidebar() {
            overlay.classList.add('insurance-sidebar__overlay--active');
            modal.classList.add('insurance-sidebar__modal--active');
            document.body.style.overflow = 'hidden';
        }
        
        // Close sidebar
        function closeSidebar() {
            overlay.classList.remove('insurance-sidebar__overlay--active');
            modal.classList.remove('insurance-sidebar__modal--active');
            document.body.style.overflow = '';
            
            // Close all accordions when sidebar closes
            // for (var i = 0; i < riderButtons.length; i++) {
            //     var button = riderButtons[i];
            //     var riderId = button.dataset.rider;
            //     var content = document.getElementById(riderId + '-content');
            //     var toggle = button.querySelector('.insurance-sidebar__rider-toggle');
                
            //     button.classList.remove('active');
            //     content.classList.remove('active');
            //     toggle.classList.remove('active');
            // }
        }
        
        // Toggle accordion
        function toggleAccordion(button) {
            var riderId = button.dataset.rider;
            var content = document.getElementById(riderId + '-content');
            var toggle = button.querySelector('.insurance-sidebar__rider-toggle');
            
            // Close all others first
            var riderButtons = document.querySelectorAll('.insurance-sidebar__rider-button');
            for (var i = 0; i < riderButtons.length; i++) {
                if (riderButtons[i] !== button) {
                    var otherRiderId = riderButtons[i].dataset.rider;
                    var otherContent = document.getElementById(otherRiderId + '-content');
                    var otherToggle = riderButtons[i].querySelector('.insurance-sidebar__rider-toggle');
                    
                    riderButtons[i].classList.remove('active');
                    otherContent.classList.remove('active');
                    otherToggle.classList.remove('active');
                }
            }
            
            // Toggle current
            if (content.classList.contains('active')) {
                button.classList.remove('active');
                content.classList.remove('active');
                toggle.classList.remove('active');
            } else {
                button.classList.add('active');
                content.classList.add('active');
                toggle.classList.add('active');
            }
        }
        
        // Event listeners
        // openBtn.addEventListener('click', openSidebar);
        $(document).on('click', '.openRiders', function(){
            openSidebar();
        });

        closeBtn.addEventListener('click', closeSidebar);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeSidebar();
        });
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeSidebar();
        });
        
        // Accordion functionality inside sidebar
        // for (var i = 0; i < riderButtons.length; i++) {
        //     riderButtons[i].addEventListener('click', function(e) {
        //         e.preventDefault();
        //         toggleAccordion(this);
        //     });
        // }
        $(document).on('click', '.insurance-sidebar__rider-button', function(e){
            e.preventDefault();
            toggleAccordion(this);
        });
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();