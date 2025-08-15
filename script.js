window.onload = function() {
    // --- Starfield Animation ---
    // This section creates a dynamic starfield background effect.
    // We use two canvases to create a parallax effect for a sense of depth.

    const starfield = document.getElementById('starfield');
    const starfield2 = document.getElementById('starfield2');
    const ctx1 = starfield.getContext('2d');
    const ctx2 = starfield2.getContext('2d');

    // Store star data
    let stars1 = [];
    let stars2 = [];
    let speed = 0.5;

    // Adjust canvas size on window resize
    function resizeCanvas() {
        starfield.width = window.innerWidth;
        starfield.height = window.innerHeight;
        starfield2.width = window.innerWidth;
        starfield2.height = window.innerHeight;
    }

    // Initialize stars
    function initStars(count, speedMultiplier) {
        let stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 1.5 + 0.5,
                speed: Math.random() * speedMultiplier + 0.1
            });
        }
        return stars;
    }

    // Draw and move stars
    function animateStars(ctx, starsArray, speedFactor) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        starsArray.forEach(star => {
            star.y += star.speed * speedFactor * speed;
            if (star.y > window.innerHeight) {
                star.y = 0;
                star.x = Math.random() * window.innerWidth;
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function gameLoop() {
        animateStars(ctx1, stars1, 1);
        animateStars(ctx2, stars2, 2.5); // Second layer moves faster
        requestAnimationFrame(gameLoop);
    }

    // Initialize on page load
    resizeCanvas();
    stars1 = initStars(200, 1);
    stars2 = initStars(100, 1.5);
    window.addEventListener('resize', resizeCanvas);
    gameLoop();

    // --- Scroll-based Reveal Effect ---
    // This section adds a class to elements with the 'reveal' class when they enter the viewport.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });

    document.querySelectorAll('.reveal').forEach(element => {
        observer.observe(element);
    });

    // --- Dynamic Skill Rings ---
    // This section calculates and animates the SVG skill rings.
    const skillRings = document.querySelectorAll('.skill');

    skillRings.forEach(skill => {
        const ring = skill.querySelector('.ring .progress');
        const percentage = parseInt(skill.dataset.percentage);
        const radius = ring.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = circumference;

        // Animate the ring on scroll
        const ringObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const offset = circumference - (percentage / 100) * circumference;
                ring.style.strokeDashoffset = offset;
                ringObserver.unobserve(skill); // Stop observing once animated
            }
        }, {
            threshold: 0.7
        });

        ringObserver.observe(skill);
    });
    
    // --- Collapsible Sections and Back-to-Top button ---
    // This part handles the toggling of hidden content and the scroll-to-top button.
    document.querySelectorAll('.btn[data-target]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.classList.toggle('open');
                // You can add logic here to smoothly scroll to the target if needed
            }
        });
    });

    const toTopBtn = document.querySelector('.to-top');
    if (toTopBtn) {
        toTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Show/hide back-to-top button based on scroll position
    window.addEventListener('scroll', () => {
        if (toTopBtn) {
            if (window.scrollY > 300) {
                toTopBtn.style.display = 'block';
            } else {
                toTopBtn.style.display = 'none';
            }
        }
    });
};
