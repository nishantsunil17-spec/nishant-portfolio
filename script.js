/**
 * Nishant Pardeshi Portfolio
 * Azure Data Engineer | Production-Ready JavaScript
 */

(function() {
    'use strict';

    // DOM Elements
    const nav = document.getElementById('nav');
    const resumeBtn = document.getElementById('resumeBtn');

    /**
     * Navigation scroll effect
     */
    function handleNavScroll() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    /**
     * Smooth scroll for anchor links
     */
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const navHeight = nav.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Section reveal animations using Intersection Observer
     */
    function initSectionAnimations() {
        const sections = document.querySelectorAll('.section');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Active navigation link based on scroll position
     */
    function initActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

        function updateActiveLink() {
            const scrollPosition = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    /**
     * Resume button functionality
     * Checks if resume.pdf exists and enables download
     */
    function initResumeButton() {
        if (!resumeBtn) return;

        // Check if resume.pdf exists
        fetch('resume.pdf', { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    enableResumeDownload();
                }
            })
            .catch(() => {
                // Resume doesn't exist, keep button disabled
            });
    }

    /**
     * Enable resume download when file is available
     */
    function enableResumeDownload() {
        if (!resumeBtn) return;

        resumeBtn.disabled = false;
        resumeBtn.classList.remove('btn-disabled');
        resumeBtn.classList.add('btn-secondary');

        // Hide tooltip
        const tooltip = resumeBtn.parentElement.querySelector('.tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }

        // Add click handler for download
        resumeBtn.addEventListener('click', function() {
            const link = document.createElement('a');
            link.href = 'resume.pdf';
            link.download = 'Nishant_Pardeshi_Resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    /**
     * Throttle function for performance
     */
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Initialize all functionality
     */
    function init() {
        initSmoothScroll();
        initSectionAnimations();
        initActiveNavLinks();
        initResumeButton();

        // Throttled scroll handler for nav
        window.addEventListener('scroll', throttle(handleNavScroll, 100), { passive: true });

        // Initial check
        handleNavScroll();
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
