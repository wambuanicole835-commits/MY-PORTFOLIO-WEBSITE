/* =========================================
   Wambua Nicole - Portfolio JavaScript
   Features: Live Clock, Calendar, Canvas BG,
   Custom Cursor, Theme Toggle, Form Handling
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LIVE ANIMATED BACKGROUND (CANVAS)
    // ==========================================
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let particles = [];

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                const isLight = document.body.classList.contains('light-mode');
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isLight ? 'rgba(106, 27, 154, 0.4)' : 'rgba(0, 212, 255, 0.5)';
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) particles.push(new Particle());

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            const isLight = document.body.classList.contains('light-mode');
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = isLight 
                            ? `rgba(106, 27, 154, ${0.15 - dist/800})` 
                            : `rgba(0, 212, 255, ${0.15 - dist/800})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }


    // ==========================================
    // 2. CUSTOM CURSOR EFFECT (FIXED)
    // ==========================================
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    const hoverTargets = document.querySelectorAll('a, button, .cta-btn, .social-icon, .theme-btn, input, textarea, select, .hamburger, .project-link');

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    function animateCursor() {
        // Smooth trailing effect
        outlineX += (mouseX - outlineX) * 0.15;
        outlineY += (mouseY - outlineY) * 0.15;
        
        if (cursorOutline) {
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
        }
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effect for interactive elements
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            if (cursorOutline) cursorOutline.classList.add('hover-effect');
        });
        target.addEventListener('mouseleave', () => {
            if (cursorOutline) cursorOutline.classList.remove('hover-effect');
        });
    });


    // ==========================================
    // 3. THEME TOGGLE (DARK/LIGHT MODE)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Apply saved theme
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            // Save preference
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
            } else {
                localStorage.setItem('theme', 'dark');
            }
        });
    }


    // ==========================================
    // 4. LIVE DASHBOARD - CLOCK & DATE
    // ==========================================
    const clockElement = document.getElementById('live-clock');
    const dateElement = document.getElementById('live-date');

    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        
        if (clockElement) clockElement.textContent = `${hours}:${minutes}:${seconds}`;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('en-GB', options);
        if (dateElement) dateElement.textContent = dateString;
    }

    updateClock();
    setInterval(updateClock, 1000);


    // ==========================================
    // 5. LIVE DASHBOARD - MINI CALENDAR
    // ==========================================
    const calendarDays = document.getElementById('calendar-days');
    const calendarMonthYear = document.getElementById('cal-month-year');

    function generateCalendar() {
        if (!calendarDays || !calendarMonthYear) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const today = now.getDate();

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        calendarDays.innerHTML = '';

        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dayNames.forEach(day => {
            const dayNameElement = document.createElement('div');
            dayNameElement.classList.add('cal-day-name');
            dayNameElement.textContent = day;
            calendarDays.appendChild(dayNameElement);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let startDay = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = 0; i < startDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('cal-day', 'empty');
            calendarDays.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('cal-day');
            dayDiv.textContent = day;
            if (day === today) dayDiv.classList.add('today');
            calendarDays.appendChild(dayDiv);
        }
    }
    generateCalendar();


    // ==========================================
    // 6. MOBILE NAVIGATION (HAMBURGER)
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }


    // ==========================================
    // 7. SCROLL REVEAL ANIMATIONS
    // ==========================================
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.card, .timeline-item, .project-card, .widget, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });


    // ==========================================
    // 8. NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });


    // ==========================================
    // 9. SCROLL TO TOP BUTTON
    // ==========================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.style.display = 'block';
                setTimeout(() => scrollTopBtn.style.opacity = '1', 10);
            } else {
                scrollTopBtn.style.opacity = '0';
                setTimeout(() => { if (window.scrollY <= 400) scrollTopBtn.style.display = 'none'; }, 300);
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ==========================================
    // 10. DYNAMIC "DAYS CODING" COUNTER
    // ==========================================
    const uptimeCounter = document.getElementById('uptime-counter');
    if (uptimeCounter) {
        const startDate = new Date('2024-01-01'); 
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let currentCount = 0;
        const duration = 2000;
        const increment = diffDays / (duration / 16);

        const animateCounter = () => {
            currentCount += increment;
            if (currentCount < diffDays) {
                uptimeCounter.textContent = Math.floor(currentCount);
                requestAnimationFrame(animateCounter);
            } else {
                uptimeCounter.textContent = diffDays;
            }
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterObserver.observe(uptimeCounter);
    }


    // ==========================================
    // 11. FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in all fields.';
                formStatus.style.color = '#ff5f56';
                return;
            }

            formStatus.textContent = 'Sending message...';
            formStatus.style.color = 'var(--accent-cyan)';

            setTimeout(() => {
                formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                formStatus.style.color = 'var(--accent-green)';
                contactForm.reset();
                setTimeout(() => { formStatus.textContent = ''; }, 5000);
            }, 1500);
        });
    }

    const findMeForm = document.getElementById('findMeForm');
    const findMeStatus = document.getElementById('find-me-status');
    if (findMeForm) {
        findMeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('finderName').value.trim();
            const purpose = document.getElementById('finderPurpose').value;

            findMeStatus.textContent = 'Submitting your request...';
            findMeStatus.style.color = 'var(--accent-cyan)';

            setTimeout(() => {
                findMeStatus.textContent = `Thank you, ${name}! Your ${purpose} request has been received. I will contact you soon.`;
                findMeStatus.style.color = 'var(--accent-green)';
                findMeForm.reset();
                setTimeout(() => { findMeStatus.textContent = ''; }, 6000);
            }, 1500);
        });
    }

});