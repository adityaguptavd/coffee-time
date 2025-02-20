$(function() {
    // Custom utility Jquery function
    $.fn.inScrollView = function(offset = 145) {
        const elementTop = $(this).offset().top;
        const elementBottom = elementTop + $(this).outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();
        return (elementTop < (viewportBottom - offset)) && (elementBottom > (viewportTop + offset));
    }

    let ticking = false;
    let scrolling = false; // to disable scroll event during smooth scrolling

    function trackSection() {
        const header = $('header');
        if(!header.length) return; // skip if header not found due to any issue
        if(window.scrollY === 0) {
            if(header.hasClass('shadow')) {
                header.removeClass('shadow');
            }
        }
        else {
            if(!header.hasClass('shadow')) {
                header.addClass('shadow');
            }
        }
        // Tracking section of the page in viewport through id
        let found = false;
        $('.nav a').each(function() {
            const sectionId = $(this).attr("href"); // Get href value of the anchor tag
            if(!sectionId.startsWith("#")) {
                return;  // avoid non-id hrefs i.e., external links
            }
            // Get section through section id
            const section = $(sectionId);
            if(section.length && section.inScrollView()) {
                $('.nav a').removeClass('active');
                $(this).addClass('active');
                found = true;
                return false;
            }
        });
        // if (!found) $(".nav li").removeClass("active"); // If no section found, remove active class
        ticking = false;
    }

    // .nav links click event
    $('ul.nav').on('click', function(e) {
        e.preventDefault();
        if(e.target.tagName === 'A') {
            const targetId = e.target.getAttribute('href');
            if(!targetId.startsWith("#")) return; // avoid external links
            const section = $(targetId);
            if(section.length) {
                scrolling = true;
                $('.nav a').removeClass('active');
                $(e.target).addClass('active');
                $("html, body").animate(
                    { scrollTop: section.offset().top - 135 }, // Adjust offset if needed
                    400, // Animation duration (adjust for smoother scrolling)
                    function() {
                        setTimeout(() => {
                            scrolling = false; // Re-enable scroll detection after animation
                        }, 600);
                    }
                );
            }
        }
    });

    // Scroll event for header animation and location in page
    $(window).on('scroll', function() {
        if(!ticking && !scrolling) {
            requestAnimationFrame(trackSection);
            ticking = true;
        }
    });

    // run on page load
    trackSection();

    // Nav toggling function
    function toggleNav() {
        $('.menu-icon').toggle();
        $('nav ul.flex').toggleClass('open');
        $('header + .overlay, header .overlay').fadeToggle();
    }

    // Small devices nav show/hide
    $('.menu-icon, header + .overlay, header .overlay').on('click', toggleNav);

    // .nav links additional click event for small devices
    $('nav ul.nav').on('click', function(e) {
        e.preventDefault();
        if($(this).hasClass('open') && e.target.tagName === 'A') {
            toggleNav();
        }
    });

    // Order button click event
    $('.order-now').on('click', function() {
        $('main .overlay, .popup-order').fadeIn();
        $('#selectedCoffee').val($(this).data('value'));
        $('#quantity').val("");
    });

    $('main .overlay, [class^="popup-"] .close span').on('click', function() {
        $('main .overlay, [class^="popup-"]').hide();
    });

    $('.vouchers .btn').on('click', function() {
        $('main .overlay, .popup-voucher').fadeIn();
    });

    // Place order
    $('.form-order, .form-voucher').on('submit', function(e) {
        e.preventDefault();
        $('main .overlay, [class^="popup-"]').hide();
    });
});