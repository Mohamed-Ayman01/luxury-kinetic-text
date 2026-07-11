/**
 * VÉLOURS / ATELIER — Awwwards Motion Design Architecture (Upgraded & Glitch-Free)
 * Features: Lenis Smooth Scroll, Kinetic Typography, GSAP ScrollTrigger, Custom Cursor & Magnetic UI
 */

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.lagSmoothing(0);

    const elasticEase = "elastic.out(1, 0.35)";

    /* ==========================================================================
       1. LENIS SMOOTH SCROLLING & ANCHOR LINK CLICK HANDLING
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== "#") {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    lenis.scrollTo(targetElement, {
                        offset: -80,
                        duration: 1.4,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            }
        });
    });

    /* ==========================================================================
       2. PRELOADER & INITIAL REVELATION CURTAIN (FAIL-SAFE & ZERO-BUG)
       ========================================================================== */
    const counterEl = document.getElementById("preloader-counter");
    let count = 0;
    let preloaderFinished = false;

    function finishPreloader() {
        if (preloaderFinished) return;
        preloaderFinished = true;
        document.body.classList.remove("loading");
        document.body.classList.add("loaded");
        gsap.set("#preloader", { display: "none", pointerEvents: "none" });
        initScrollAnimations();
        ScrollTrigger.refresh();
    }

    const preloaderTimeline = gsap.timeline({
        paused: true,
        onComplete: finishPreloader
    });

    preloaderTimeline
        .to(".preloader-brand", { y: -30, opacity: 0, duration: 0.45, ease: "power3.inOut" })
        .to(".preloader-counter-wrap", { y: -40, opacity: 0, duration: 0.45, ease: "power3.inOut" }, "-=0.3")
        .to(".preloader-curtain", { y: "0%", duration: 0.65, ease: "expo.inOut" })
        .to("#preloader", { y: "-100%", duration: 0.85, ease: "expo.inOut" })
        .fromTo(".hero-title", 
            { y: 80, opacity: 0, fontVariationSettings: "'wght' 100" },
            { y: 0, opacity: 1, fontVariationSettings: "'wght' 300", duration: 1.4, ease: "expo.out" }, 
            "-=0.45"
        )
        .from(".split-reveal", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }, "-=1.0")
        .from(".navbar", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=1.0");

    const countInterval = setInterval(() => {
        count += Math.floor(Math.random() * 12) + 6;
        if (count >= 100) {
            count = 100;
            clearInterval(countInterval);
            if (counterEl) counterEl.textContent = "100";
            preloaderTimeline.play();
        } else {
            if (counterEl) counterEl.textContent = count < 10 ? `0${count}` : count;
        }
    }, 30);

    setTimeout(() => {
        finishPreloader();
    }, 2800);

    /* ==========================================================================
       3. CUSTOM CURSOR & DYNAMIC OVERRIDE SYSTEM
       ========================================================================== */
    const cursorDot = document.getElementById("cursor-dot");
    const cursorRing = document.getElementById("cursor-ring");
    const cursorText = document.getElementById("cursor-text");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let prevMouseX = mouseX;
    let prevMouseY = mouseY;
    let mouseVelocity = 0;

    const xDotTo = gsap.quickTo(cursorDot, "x", { duration: 0.05, ease: "power3" });
    const yDotTo = gsap.quickTo(cursorDot, "y", { duration: 0.05, ease: "power3" });
    const xRingTo = gsap.quickTo(cursorRing, "x", { duration: 0.35, ease: "power3" });
    const yRingTo = gsap.quickTo(cursorRing, "y", { duration: 0.35, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        xDotTo(mouseX);
        yDotTo(mouseY);
        xRingTo(mouseX);
        yRingTo(mouseY);

        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        mouseVelocity = Math.sqrt(dx * dx + dy * dy);
        prevMouseX = mouseX;
        prevMouseY = mouseY;

        const heroTitle = document.querySelector(".hero-title");
        if (heroTitle && document.body.classList.contains("loaded")) {
            const rect = heroTitle.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(mouseX - centerX, mouseY - centerY);
            
            if (dist < 450) {
                const targetWght = Math.min(800, Math.max(200, 800 - (dist / 450) * 600 + mouseVelocity * 3));
                gsap.to(heroTitle, {
                    fontVariationSettings: `'wght' ${Math.round(targetWght)}`,
                    overwrite: "auto",
                    duration: 0.2,
                    ease: "power2.out"
                });
            } else {
                gsap.to(heroTitle, {
                    fontVariationSettings: `'wght' 200`,
                    overwrite: "auto",
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        }
    });

    document.querySelectorAll("[data-cursor]").forEach((item) => {
        item.addEventListener("mouseenter", () => {
            const cursorMode = item.getAttribute("data-cursor");
            if (cursorMode === "hover" || cursorMode === "KINETIC" || cursorMode === "SCROLL") {
                cursorRing.classList.add("hover-active");
            } else {
                cursorRing.classList.add("text-active");
                if (cursorText) cursorText.textContent = cursorMode;
            }
        });

        item.addEventListener("mouseleave", () => {
            cursorRing.classList.remove("hover-active", "text-active");
            if (cursorText) cursorText.textContent = "";
        });
    });

    /* ==========================================================================
       4. MAGNETIC & ELASTIC TEXT TARGETS
       ========================================================================== */
    function bindMagnetic(el) {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(el, {
                x: relX * 0.35,
                y: relY * 0.35,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        el.addEventListener("mouseleave", () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 1.1,
                ease: elasticEase
            });
        });
    }

    document.querySelectorAll(".magnetic").forEach(bindMagnetic);

    // Staggered Elastic Entrance for Size Pills on Product Card Hover
    document.querySelectorAll(".product-card").forEach((card) => {
        const pills = card.querySelectorAll(".size-pill");
        card.addEventListener("mouseenter", () => {
            gsap.fromTo(pills, 
                { y: 15, opacity: 0, scale: 0.8 },
                { y: 0, opacity: 1, scale: 1, stagger: 0.05, duration: 0.6, ease: elasticEase, overwrite: "auto" }
            );
        });
    });

    /* ==========================================================================
       5. ROBUST SPLIT-TEXT REVELATION UTILITY
       ========================================================================== */
    function splitTextByWords(element) {
        const text = element.innerText.trim();
        element.innerHTML = "";
        const words = text.split(/\s+/);
        words.forEach((word, index) => {
            const wrapper = document.createElement("span");
            wrapper.className = "split-word-wrap";

            const inner = document.createElement("span");
            inner.className = "split-word-inner";
            inner.innerText = word + (index < words.length - 1 ? "\u00A0" : "");

            wrapper.appendChild(inner);
            element.appendChild(wrapper);
        });
    }

    document.querySelectorAll(".split-words").forEach((el) => {
        splitTextByWords(el);
    });

    /* ==========================================================================
       6. SCROLL-DRIVEN ARCHITECTURE & ZERO-BUG KINETIC REACTIONS
       ========================================================================== */
    function initScrollAnimations() {
        ScrollTrigger.batch(".reveal-card", {
            onEnter: (elements) => {
                gsap.fromTo(elements, 
                    { y: 60, opacity: 0 },
                    { y: 0, opacity: 1, stagger: 0.12, duration: 1.1, ease: "power3.out", overwrite: true }
                );
            },
            once: true
        });

        const quoteWords = document.querySelectorAll(".philosophy-section .split-word-inner");
        if (quoteWords.length > 0) {
            gsap.fromTo(quoteWords,
                { y: "110%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    stagger: 0.025,
                    duration: 1.0,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: ".philosophy-section",
                        start: "top 75%",
                    }
                }
            );
        }

        const marqueeContents = gsap.utils.toArray(".marquee-content");
        if (marqueeContents.length > 0) {
            const marqueeTween = gsap.to(marqueeContents, {
                xPercent: -100,
                repeat: -1,
                duration: 22,
                ease: "none"
            });

            lenis.on("scroll", ({ velocity }) => {
                const speedBoost = 1 + Math.min(3, Math.abs(velocity || 0) * 0.15);
                gsap.to(marqueeTween, {
                    timeScale: velocity < 0 ? -speedBoost : speedBoost,
                    duration: 0.2,
                    overwrite: true,
                    onComplete: () => {
                        gsap.to(marqueeTween, { timeScale: 1, duration: 0.6 });
                    }
                });
            });
        }

        const kineticHeadings = document.querySelectorAll(".kinetic-heading");
        const kineticScrolls = document.querySelectorAll(".kinetic-scroll");
        let lastVelocity = 0;

        lenis.on("scroll", ({ velocity }) => {
            const absVel = Math.abs(velocity || 0);
            if (Math.abs(absVel - lastVelocity) > 0.2) {
                lastVelocity = absVel;
                const skewVal = Math.min(6, Math.max(-6, velocity * -0.25));
                
                kineticHeadings.forEach((h) => {
                    gsap.to(h, {
                        skewX: skewVal,
                        letterSpacing: `${-0.02 + Math.min(0.03, absVel * 0.001)}em`,
                        duration: 0.3,
                        overwrite: "auto",
                        ease: "power2.out"
                    });
                });

                const targetWeight = Math.min(800, Math.max(300, 300 + absVel * 20));
                kineticScrolls.forEach((h) => {
                    gsap.to(h, {
                        fontVariationSettings: `'wght' ${Math.round(targetWeight)}`,
                        duration: 0.3,
                        overwrite: "auto",
                        ease: "power2.out"
                    });
                });
            }
        });

        gsap.fromTo(".philosophy-inner",
            { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)", opacity: 0.3 },
            {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: ".philosophy-section",
                    start: "top 65%",
                    end: "center 40%",
                    scrub: 1.0
                }
            }
        );
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
            ScrollTrigger.refresh();
        });
    }
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });
});
