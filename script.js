document.addEventListener("DOMContentLoaded", () => {

    // ── CUSTOM CURSOR ──
    const dot  = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");

    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + "px";
        dot.style.top  = mouseY + "px";
    });

    // Ring follows with smooth lag
    (function animateRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.left = ringX + "px";
        ring.style.top  = ringY + "px";
        requestAnimationFrame(animateRing);
    })();

    // Hover state on interactive elements
    const hoverTargets = document.querySelectorAll("a, button, .skill-pill, .project-card, .nav-contact, .nav-resume");
    hoverTargets.forEach(el => {
        el.addEventListener("mouseenter", () => ring.classList.add("hovering"));
        el.addEventListener("mouseleave", () => ring.classList.remove("hovering"));
    });

    // Click effect
    document.addEventListener("mousedown", () => { dot.classList.add("clicking");  ring.classList.add("clicking"); });
    document.addEventListener("mouseup",   () => { dot.classList.remove("clicking"); ring.classList.remove("clicking"); });

    // Hide cursor when leaving window
    document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; ring.style.opacity = "0"; });
    document.addEventListener("mouseenter", () => { dot.style.opacity = "1"; ring.style.opacity = "1"; });

    // ── THEME SWITCH (hero scroll) ──
    const body = document.body;
    const heroSection = document.getElementById("hero");

    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                body.classList.remove("theme-dark");
                body.classList.add("theme-light");
            } else {
                body.classList.remove("theme-light");
                body.classList.add("theme-dark");
            }
        });
    }, { rootMargin: "-10% 0px 0px 0px", threshold: 0 });

    themeObserver.observe(heroSection);

    // ── NAVBAR SCROLL SHRINK ──
    const navbar = document.getElementById("navbar");
    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 60);
    });

    // ── HAMBURGER MENU ──
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => navLinks.classList.remove("open"));
    });

    // ── CONTACT MODAL ──
    const initContactBtn = document.getElementById("init-contact-btn");
    const contactModal = document.getElementById("contact-modal");
    const modalCloseBtn = document.getElementById("modal-close-btn");

    initContactBtn.addEventListener("click", (e) => {
        e.preventDefault();
        contactModal.classList.add("active");
    });

    modalCloseBtn.addEventListener("click", () => contactModal.classList.remove("active"));

    contactModal.addEventListener("click", (e) => {
        if (e.target === contactModal) contactModal.classList.remove("active");
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") contactModal.classList.remove("active");
    });

    // ── ARCHITECTURE MODAL ──
    const openArchBtn = document.getElementById("open-arch-modal-btn");
    const archModal = document.getElementById("arch-modal");
    const archCloseBtn = document.getElementById("arch-close-btn");

    if (openArchBtn && archModal && archCloseBtn) {
        openArchBtn.addEventListener("click", (e) => {
            e.preventDefault();
            archModal.classList.add("active");
        });

        archCloseBtn.addEventListener("click", () => archModal.classList.remove("active"));

        archModal.addEventListener("click", (e) => {
            if (e.target === archModal) archModal.classList.remove("active");
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") archModal.classList.remove("active");
        });
    }

    // ── STAT COUNTER ANIMATION ──
    const counters = document.querySelectorAll(".stat-number");
    let countersStarted = false;

    function startCounters() {
        if (countersStarted) return;
        countersStarted = true;
        counters.forEach(counter => {
            const target = +counter.dataset.target;
            const suffix = counter.dataset.suffix || "";
            const duration = 1800;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + suffix;
            }, 16);
        });
    }

    const heroObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) startCounters();
    }, { threshold: 0.3 });

    heroObserver.observe(heroSection);

    // ── SCROLL REVEAL ──
    const revealItems = document.querySelectorAll(".reveal-item");

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // stagger siblings
                const siblings = entry.target.parentElement.querySelectorAll(".reveal-item");
                siblings.forEach((el, idx) => {
                    setTimeout(() => el.classList.add("visible"), idx * 120);
                });
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealItems.forEach(el => revealObserver.observe(el));

    // ── SKILL BAR ANIMATION ──
    const skillBars = document.querySelectorAll(".skill-bar-fill");

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                setTimeout(() => {
                    bar.style.width = bar.dataset.width + "%";
                }, 200);
                barObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => barObserver.observe(bar));

    // ── CONTACT FORM (mailto fallback) ──
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const submitBtn = document.getElementById("form-submit-btn");
    const submitText = document.getElementById("submit-text");

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("cf-name").value.trim();
        const email = document.getElementById("cf-email").value.trim();
        const subject = document.getElementById("cf-subject").value.trim();
        const message = document.getElementById("cf-message").value.trim();

        submitText.textContent = "SENDING...";
        submitBtn.disabled = true;

        // Build mailto link as a reliable fallback
        const mailtoBody = `Hi Prince,%0A%0AMy name is ${encodeURIComponent(name)}.%0A%0A${encodeURIComponent(message)}%0A%0AReply to: ${encodeURIComponent(email)}`;
        const mailtoLink = `mailto:prince774623princeyadav@gmail.com?subject=${encodeURIComponent(subject)}&body=${mailtoBody}`;

        setTimeout(() => {
            window.location.href = mailtoLink;
            formStatus.textContent = "✓ Opening your email client...";
            formStatus.className = "form-status success";
            submitText.textContent = "SEND MESSAGE →";
            submitBtn.disabled = false;
            contactForm.reset();
        }, 800);
    });

    // ── ACTIVE NAV LINK HIGHLIGHT ──
    const sections = document.querySelectorAll("section[id], footer[id]");
    const navAnchors = document.querySelectorAll(".nav-links a");

    const activeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navAnchors.forEach(a => {
                    a.style.color = a.getAttribute("href") === `#${id}` ? "var(--neon-lime)" : "";
                });
            }
        });
    }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });

    sections.forEach(s => activeObserver.observe(s));
});
