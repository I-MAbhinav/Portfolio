document.addEventListener("DOMContentLoaded", () => {
    // 1. Custom Smooth Animated Cursor (CSS Driven)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorTrail = document.querySelector('.cursor-trail');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        
        cursorTrail.style.left = `${posX}px`;
        cursorTrail.style.top = `${posY}px`;
    });

    // Hover effect for interactive elements
    const interactables = document.querySelectorAll('a, button, .bento-card, .project-card, .cert-item, .tagcloud--item');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorTrail.classList.add('hover');
            cursorDot.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursorTrail.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    });
    
    // Delegation for dynamic elements like TagCloud
    document.body.addEventListener('mouseenter', (e) => {
        if(e.target && e.target.classList && e.target.classList.contains('tagcloud--item')) {
            cursorTrail.classList.add('hover');
            cursorDot.classList.add('hover');
        }
    }, true);
    document.body.addEventListener('mouseleave', (e) => {
        if(e.target && e.target.classList && e.target.classList.contains('tagcloud--item')) {
            cursorTrail.classList.remove('hover');
            cursorDot.classList.remove('hover');
        }
    }, true);

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth Scrolling for Nav Links
    document.querySelectorAll('.nav-links a, .hero-actions a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 2. 3D TagCloud Sphere
    const sphereContainer = document.querySelector('#sphere-wrapper');
    if (sphereContainer && typeof TagCloud !== 'undefined') {
        const icons = [
            'javascript/javascript-original.svg',
            'react/react-original.svg',
            'nodejs/nodejs-original.svg',
            'html5/html5-original.svg',
            'css3/css3-original.svg',
            'python/python-original.svg',
            'java/java-original.svg',
            'c/c-original.svg',
            'cplusplus/cplusplus-original.svg',
            'docker/docker-original.svg',
            'git/git-original.svg',
            'github/github-original.svg'
        ];

        const texts = icons.map(icon => {
            return `<div class="sphere-item-card"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon}" alt="tech-icon" class="sphere-img"/></div>`;
        });

        let radius = 250;
        if (window.innerWidth <= 992) radius = 200;
        if (window.innerWidth <= 768) radius = 170;

        TagCloud('#sphere-wrapper', texts, {
            radius: radius,
            maxSpeed: 'fast',
            initSpeed: 'normal',
            direction: 135,
            keep: true,
            useHTML: true
        });

        // Hack to ensure TagCloud items render the HTML properly if useHTML flag is not fully supported by this version
        setTimeout(() => {
            document.querySelectorAll('.tagcloud--item').forEach(el => {
                // If it rendered as literal text, it will contain the string '<div'
                if (el.innerText.includes('<div')) {
                    el.innerHTML = el.innerText;
                }
            });
        }, 100);
    }

    // 3. Scroll Reveal Animations using IntersectionObserver
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Optional: Stop observing once revealed
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));
    
    // Trigger reveals that are already in viewport on load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('active');
            }
        });
    }, 100);
});
