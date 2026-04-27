const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (current && link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
    } else {
        header.style.boxShadow = "0 4px 6px -1px rgba(12, 12, 12, 0.1)";
    }
});

const revealElements = document.querySelectorAll(
    ".intro-section, .video-section, .about-card, .gallery-item"
);

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
};
revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "all 0.8s ease";
});

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);



$(document).ready(function () {

    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        var target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate(
                { scrollTop: target.offset().top },
                800
            );
        }
    });

    $('.nav-link').css({
        opacity: 0  
    });

    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 50) {
            $('header').css('box-shadow', '0 6px 15px rgba(0,0,0,0.2)');
        } else {
            $('header').css('box-shadow', '0 4px 6px -1px rgba(12, 12, 12, 0.1)');
        }
    });

    var $revealElements = $(".intro-section, .video-section, .about-card, .gallery-item");
 
    $revealElements.css({
        opacity: 0,
        transform: 'translateY(40px)',
        transition: 'all 0.8s ease'
    });

    function revealOnScrollJQ() {
        var windowHeight = $(window).height();
        $revealElements.each(function () {
            var elementTop = $(this).offset().top - $(window).scrollTop();
            if (elementTop < windowHeight - 100) {
                $(this).css({
                    opacity: 1,
                    transform: 'translateY(0)'
                });
            }
        });
    }

    $(window).on('scroll load', revealOnScrollJQ);

});