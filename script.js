document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initTyped();
    initAOS();
    initNavigation();
    initScrollEffects();
    initSkillColors();
    initSkillFilter();
    initStatCounters();
    initCopyEmail();
    initBackToTop();
    initParticles();
    initCursorGlow();
    initHeroParallax();
    initProjectModal();
    initTiltCards();
});

function initTyped() {
    if (typeof Typed === "undefined") return;

    new Typed("#typing", {
        strings: [
            "Computer Science Engineering Student",
            "Data Analytics Enthusiast",
            "Python Developer",
            "Excel Dashboard Developer"
        ],
        typeSpeed: 60,
        backSpeed: 40,
        loop: true,
        showCursor: false
    });
}

function initAOS() {
    if (typeof AOS === "undefined") return;

    AOS.init({
        duration: 700,
        once: true,
        offset: 60,
        easing: "ease-out-cubic"
    });
}

function initNavigation() {
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    const links = document.querySelectorAll(".nav-link");
    const header = document.querySelector(".header");

    let overlay = document.querySelector(".nav-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "nav-overlay";
        document.body.appendChild(overlay);
    }

    function closeMenu() {
        navToggle.classList.remove("active");
        navLinks.classList.remove("open");
        overlay.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    function openMenu() {
        navToggle.classList.add("active");
        navLinks.classList.add("open");
        overlay.classList.add("active");
        navToggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    navToggle.addEventListener("click", () => {
        navLinks.classList.contains("open") ? closeMenu() : openMenu();
    });

    overlay.addEventListener("click", closeMenu);

    links.forEach(link => {
        link.addEventListener("click", () => closeMenu());
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeMenu();
    });

    const sections = document.querySelectorAll("section[id]");

    function setActiveLink() {
        const scrollY = window.scrollY + header.offsetHeight + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (scrollY >= top && scrollY < top + height) {
                links.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    }

    window.addEventListener("scroll", setActiveLink, { passive: true });
    setActiveLink();
}

function initScrollEffects() {
    const header = document.querySelector(".header");
    const progressBar = document.querySelector(".scroll-progress");

    function onScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        header.classList.toggle("scrolled", scrollTop > 50);
        progressBar.style.width = `${progress}%`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
}

function initTheme() {
    const toggle = document.querySelector(".theme-toggle");
    const root = document.documentElement;

    function setTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }

    toggle?.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        setTheme(next);
    });
}

function initSkillColors() {
    const skillCards = document.querySelectorAll(".skill-card");

    skillCards.forEach(card => {
        const color = card.dataset.color;
        if (color) card.style.setProperty("--skill-color", color);
    });
}

function initSkillFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const skillCards = document.querySelectorAll(".skill-card");

    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            skillCards.forEach(card => {
                const match = filter === "all" || card.dataset.category === filter;
                card.classList.toggle("hidden", !match);
            });
        });
    });
}

function initStatCounters() {
    const statNumbers = document.querySelectorAll(".stat-number");
    let animated = false;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    statNumbers.forEach(el => animateCounter(el));
                    observer.disconnect();
                }
            });
        },
        { threshold: 0.5 }
    );

    const statsSection = document.querySelector(".stats-grid");
    if (statsSection) observer.observe(statsSection);
}

function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const isDecimal = target % 1 !== 0;
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        el.textContent = isDecimal ? current.toFixed(2) : Math.floor(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = isDecimal ? target.toFixed(2) : target;
        }
    }

    requestAnimationFrame(update);
}

function initCopyEmail() {
    const copyBtn = document.querySelector(".copy-email");
    const toast = document.querySelector(".toast");
    if (!copyBtn) return;

    copyBtn.addEventListener("click", async () => {
        const email = copyBtn.dataset.email;

        try {
            await navigator.clipboard.writeText(email);
            showToast("Email copied to clipboard!");
        } catch {
            showToast("Could not copy email");
        }
    });

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
    }
}

function initBackToTop() {
    const btn = document.querySelector(".back-to-top");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        btn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function initParticles() {
    const canvas = document.querySelector(".hero-particles");
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let animationId;
    let width, height;

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    const particleColors = [
        [129, 140, 248],
        [244, 114, 182],
        [52, 211, 153],
        [251, 146, 60]
    ];

    function createParticles() {
        const count = window.innerWidth < 768 ? 30 : 55;
        particles = Array.from({ length: count }, (_, i) => ({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.2,
            color: particleColors[i % particleColors.length]
        }));
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            const [r, g, b] = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
            ctx.fill();
        });

        particles.forEach((a, i) => {
            for (let j = i + 1; j < particles.length; j++) {
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    const [r, g, bl] = a.color;
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${r}, ${g}, ${bl}, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        });

        animationId = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    draw();

    window.addEventListener("resize", () => {
        resize();
        createParticles();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            draw();
        }
    });
}

function initCursorGlow() {
    const glow = document.querySelector(".cursor-glow");
    if (!glow || !window.matchMedia("(pointer: fine)").matches) return;

    let visible = false;

    document.addEventListener("mousemove", e => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
        if (!visible) {
            glow.classList.add("active");
            visible = true;
        }
    });

    document.addEventListener("mouseleave", () => {
        glow.classList.remove("active");
        visible = false;
    });
}

function initHeroParallax() {
    const heroImage = document.querySelector(".hero-image");
    if (!heroImage || !window.matchMedia("(pointer: fine)").matches) return;

    const hero = document.querySelector(".hero");

    hero.addEventListener("mousemove", e => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        heroImage.style.transform = `translate(${x * 12}px, ${y * 12}px)`;
    });

    hero.addEventListener("mouseleave", () => {
        heroImage.style.transform = "";
    });
}

function initProjectModal() {
    const modal = document.querySelector(".project-modal");
    const cards = document.querySelectorAll(".project-card");
    const closeBtn = modal.querySelector(".modal-close");
    const backdrop = modal.querySelector(".modal-backdrop");
    const modalImg = modal.querySelector(".modal-image img");
    const modalTag = modal.querySelector(".modal-tag");
    const modalTitle = modal.querySelector("#modal-title");
    const modalDesc = modal.querySelector(".modal-desc");
    const modalGithub = modal.querySelector(".modal-link-github");
    const modalDemo = modal.querySelector(".modal-link-demo");

    let lastFocused = null;

    function setModalLink(linkEl, url) {
        const hasLink = !!(url && url.trim() && !url.includes("PASTE_"));
        linkEl.style.display = hasLink ? "inline-flex" : "none";
        if (hasLink) linkEl.href = url;
    }

    function openModal(card) {
        modalImg.src = card.dataset.image;
        modalImg.alt = card.dataset.title;
        modalTag.textContent = card.dataset.tag;
        modalTitle.textContent = card.dataset.title;
        modalDesc.textContent = card.dataset.desc;
        setModalLink(modalGithub, card.dataset.github);
        setModalLink(modalDemo, card.dataset.demo);

        lastFocused = document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = "hidden";

        requestAnimationFrame(() => modal.classList.add("open"));
        closeBtn.focus();
    }

    function closeModal() {
        modal.classList.remove("open");
        document.body.style.overflow = "";

        const onEnd = () => {
            modal.hidden = true;
            modal.removeEventListener("transitionend", onEnd);
            if (lastFocused) lastFocused.focus();
        };

        modal.addEventListener("transitionend", onEnd);
    }

    cards.forEach(card => {
        card.addEventListener("click", () => openModal(card));
        card.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openModal(card);
            }
        });
    });

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && !modal.hidden) closeModal();
    });
}

function initTiltCards() {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const cards = document.querySelectorAll(".project-card, .certificate-card, .stat-card, .experience-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}
