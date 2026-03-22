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
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId !== '#') {
                e.preventDefault();
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
            initNetworkCanvas();
        }, 100);

        // Network Canvas Animation
        const initNetworkCanvas = () => {
            const canvas = document.getElementById('network-canvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            
            let width, height;
            const resize = () => {
                width = sphereContainer.clientWidth;
                height = sphereContainer.clientHeight;
                canvas.width = width;
                canvas.height = height;
            };
            window.addEventListener('resize', resize);
            resize();

            const drawNetwork = () => {
                ctx.clearRect(0, 0, width, height);
                const items = document.querySelectorAll('.sphere-item-card');
                const containerRect = sphereContainer.getBoundingClientRect();

                const points = [];
                items.forEach(item => {
                    const rect = item.getBoundingClientRect();
                    // Center of the item relatively
                    const x = rect.left + rect.width / 2 - containerRect.left;
                    const y = rect.top + rect.height / 2 - containerRect.top;
                    
                    // We can use parent element's opacity given by TagCloud to simulate Z-depth fade
                    const parentStyle = window.getComputedStyle(item.parentElement);
                    const opacity = parseFloat(parentStyle.opacity || 1);
                    
                    points.push({ x, y, opacity });
                });

                // Max distance to draw a connecting line
                const connectionDistance = 180; 
                
                ctx.lineWidth = 1.5;
                for (let i = 0; i < points.length; i++) {
                    for (let j = i + 1; j < points.length; j++) {
                        const p1 = points[i];
                        const p2 = points[j];
                        
                        const dx = p1.x - p2.x;
                        const dy = p1.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist < connectionDistance) {
                            // Fade line out as distance grows, and also based on item Z-depth
                            const alpha = (1 - (dist / connectionDistance)) * p1.opacity * p2.opacity;
                            if (alpha > 0.05) {
                                ctx.beginPath();
                                ctx.moveTo(p1.x, p1.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
                                ctx.stroke();
                            }
                        }
                    }
                }
                requestAnimationFrame(drawNetwork);
            };
            // Start loop
            requestAnimationFrame(drawNetwork);
        };
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

    // 4. Bitmoji Easter Egg
    const bitmojiAvatar = document.getElementById('bitmoji-avatar');
    let isEasterEggRunning = false;
    
    if (bitmojiAvatar) {
        // Prevent default navigation if wrapped in <a>
        bitmojiAvatar.parentElement.addEventListener('click', (e) => {
            if (e.target === bitmojiAvatar || isEasterEggRunning) {
                e.preventDefault();
            }
        });

        bitmojiAvatar.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isEasterEggRunning) return;
            isEasterEggRunning = true;

            const targets = [
                document.getElementById('bump-target-1'),
                document.getElementById('bump-target-2'),
                document.getElementById('bump-target-3'),
            ].filter(Boolean);

            if (targets.length === 0) {
                isEasterEggRunning = false;
                return;
            }

            // Create clone
            const rect = bitmojiAvatar.getBoundingClientRect();
            const clone = document.createElement('img');
            clone.src = bitmojiAvatar.src;
            clone.className = 'bitmoji-clone';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            document.body.appendChild(clone);

            // Hide original temporarily
            bitmojiAvatar.style.opacity = '0';

            const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            // Small pop effect at launch
            clone.style.transform = `scale(1.2) rotate(10deg)`;
            await sleep(400);

            // Fly sequence
            for (let i = 0; i < targets.length; i++) {
                const target = targets[i];
                const targetRect = target.getBoundingClientRect();
                
                // Fly to target
                clone.style.left = `${targetRect.left + (targetRect.width / 2) - 30}px`;
                clone.style.top = `${targetRect.top + (targetRect.height / 2) - 30}px`;
                clone.style.transform = `scale(1.5) rotate(${Math.random() * 40 - 20}deg)`;
                
                await sleep(1000); // wait for fly animation to finish
                
                // Bump target
                target.classList.add('bumped');
                setTimeout(() => target.classList.remove('bumped'), 600);
                
                await sleep(300); // pause slightly before next fly
            }

            // Fly back home
            const originalRect = bitmojiAvatar.getBoundingClientRect();
            clone.style.left = `${originalRect.left}px`;
            clone.style.top = `${originalRect.top}px`;
            clone.style.transform = `scale(1) rotate(0deg)`;
            clone.style.width = `${originalRect.width}px`;
            clone.style.height = `${originalRect.height}px`;

            await sleep(1000);

            // Cleanup
            clone.remove();
            bitmojiAvatar.style.opacity = '1';
            isEasterEggRunning = false;
        });
    }

    // 5. Certificate Modal (Lightbox)
    const modal = document.getElementById("cert-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".modal-close");
    const certImages = document.querySelectorAll(".cert-image img");

    if (modal && certImages.length > 0) {
        // Add click events to all certificate images
        certImages.forEach(img => {
            img.addEventListener('click', () => {
                modal.classList.add("show");
                modalImg.src = img.src;
            });
            
            // Apply custom cursor hover effect
            img.addEventListener('mouseenter', () => {
                cursorTrail.classList.add('hover');
                cursorDot.classList.add('hover');
            });
            img.addEventListener('mouseleave', () => {
                cursorTrail.classList.remove('hover');
                cursorDot.classList.remove('hover');
            });
        });

        const closeModal = () => {
            modal.classList.remove("show");
        };

        // Close on X button click
        closeBtn.addEventListener("click", closeModal);
        
        // Close on background click
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("show")) {
                closeModal();
            }
        });
        
        // Apply custom cursor hover effect to close button
        closeBtn.addEventListener('mouseenter', () => {
            cursorTrail.classList.add('hover');
            cursorDot.classList.add('hover');
        });
        closeBtn.addEventListener('mouseleave', () => {
            cursorTrail.classList.remove('hover');
            cursorDot.classList.remove('hover');
        });
    }
});
