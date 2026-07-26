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

    lenis.on('scroll', (e) => {
        ScrollTrigger.update();
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (e.scroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

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
       2. INITIAL REVELATION (PRELOADER REMOVED)
       ========================================================================== */
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
    
    // Using setTimeout to ensure DOM is ready for ScrollTrigger calculation
    setTimeout(() => {
        initScrollAnimations();
        ScrollTrigger.refresh();
        
        const introTimeline = gsap.timeline();
        introTimeline
            .fromTo(".hero-title", 
                { y: 80, opacity: 0, fontVariationSettings: "'wght' 100" },
                { y: 0, opacity: 1, fontVariationSettings: "'wght' 300", duration: 1.4, ease: "expo.out" }
            )
            .from(".split-reveal", { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: "power3.out" }, "-=1.0")
            .from(".navbar", { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=1.0");
    }, 50);

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
        const mainNavbar = document.querySelector(".navbar");
        let lastVelocity = 0;

        lenis.on("scroll", (e) => {
            // Navbar scrolled state
            if (mainNavbar) {
                if (e.scroll > 50) {
                    mainNavbar.classList.add("scrolled");
                } else {
                    mainNavbar.classList.remove("scrolled");
                }
            }
            
            const velocity = e.velocity;
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
    /* ==========================================================================
       7. SHOPPING CART LOGIC
       ========================================================================== */
    let cartItems = [];
    try {
        const storedCart = localStorage.getItem('velours_cart');
        if (storedCart) {
            cartItems = JSON.parse(storedCart);
        }
    } catch (e) {
        console.error("Could not parse cart from localStorage", e);
    }
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPrice = document.getElementById('cart-total-price');

    function toggleCart(e) {
        if(e) e.preventDefault();
        const isActive = cartPanel.classList.contains('active');
        if(isActive) {
            cartPanel.classList.remove('active');
            if(cartOverlay) cartOverlay.classList.remove('active');
            lenis.start();
        } else {
            cartPanel.classList.add('active');
            if(cartOverlay) cartOverlay.classList.add('active');
            lenis.stop();
        }
    }

    if (openCartBtn) openCartBtn.addEventListener('click', toggleCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    // Mobile Navigation Drawer Wiring
    const mobileNavOpen = document.getElementById('mobile-nav-open');
    const mobileNavClose = document.getElementById('mobile-nav-close');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');
    const mobileOpenCartBtn = document.getElementById('mobile-open-cart-btn');

    if (mobileNavOpen && mobileNavDrawer) {
        mobileNavOpen.addEventListener('click', () => {
            mobileNavDrawer.classList.add('active');
        });
    }

    if (mobileNavClose && mobileNavDrawer) {
        mobileNavClose.addEventListener('click', () => {
            mobileNavDrawer.classList.remove('active');
        });
    }

    if (mobileNavDrawer) {
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileNavDrawer.classList.remove('active');
            });
        });
    }

    if (mobileOpenCartBtn) {
        mobileOpenCartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (mobileNavDrawer) mobileNavDrawer.classList.remove('active');
            toggleCart(e);
        });
    }

    // Attach Checkout button redirect
    const checkoutBtn = document.querySelector('#cart-panel .btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'checkout.html';
        });
    }

    function saveCart() {
        localStorage.setItem('velours_cart', JSON.stringify(cartItems));
    }

    function updateCartUI() {
        saveCart();
        
        let total = 0;
        let count = 0;
        let html = '';
        
        cartItems.forEach((item, index) => {
            const rawPrice = parseFloat(item.price.replace(/[^0-9.]/g, ''));
            const qty = parseInt(item.qty) || 1;
            const size = item.size || '46';
            total += rawPrice * qty;
            count += qty;
            
            const thumbSrc = item.img ? item.img : 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80';
            
            html += `
                <div class="cart-item">
                    <img class="cart-item-thumb" src="${thumbSrc}" alt="${item.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-info">
                            <h4>${item.title.replace(/\s*\(SIZE.*\)/, '')}</h4>
                            <span class="cart-item-size">SIZE: ${size}</span>
                            <div class="cart-item-qty">
                                <span>QTY:</span>
                                <button class="cart-qty-btn minus" data-index="${index}">-</button>
                                <span class="qty-num">${qty}</span>
                                <button class="cart-qty-btn plus" data-index="${index}">+</button>
                            </div>
                        </div>
                        <div class="cart-item-price-col">
                            <span class="cart-item-price">${item.price}</span>
                            <button class="remove-item-btn" data-index="${index}">REMOVE</button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        if (cartItemsContainer) {
            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your bag is currently empty.</div>';
            } else {
                cartItemsContainer.innerHTML = html;
            }
        }
        
        if (cartTotalPrice) {
            cartTotalPrice.textContent = `$${total.toLocaleString()} USD`;
        }
        
        const navBagCount = document.getElementById('open-cart-btn');
        const mobileBagCount = document.getElementById('mobile-open-cart-btn');
        if (navBagCount) {
            navBagCount.textContent = `BAG [${count}]`;
        }
        if (mobileBagCount) {
            mobileBagCount.textContent = `BAG [${count}]`;
        }
        
        // Attach remove and qty listeners
        document.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                cartItems.splice(idx, 1);
                updateCartUI();
            });
        });
        document.querySelectorAll('.cart-qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                const isPlus = e.target.classList.contains('plus');
                if (isPlus) {
                    cartItems[idx].qty = (parseInt(cartItems[idx].qty) || 1) + 1;
                } else {
                    cartItems[idx].qty = Math.max(1, (parseInt(cartItems[idx].qty) || 1) - 1);
                }
                updateCartUI();
            });
        });
    }

    document.querySelectorAll('.add-to-bag').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = e.target.closest('.lookbook-item, .product-card');
            if (parent) {
                let title = "VÉLOURS ITEM";
                let price = "$0 USD";
                
                const codeEl = parent.querySelector('.item-code');
                const titleEl = parent.querySelector('h3');
                const priceEl = parent.querySelector('.item-price, .product-price');
                
                if (codeEl) {
                    const parts = codeEl.textContent.split(' / ');
                    title = parts.length > 1 ? parts[1] : parts[0];
                } else if (titleEl) {
                    title = titleEl.textContent;
                }
                
                if (priceEl) price = priceEl.textContent;
                
                const size = "46";
                const cleanTitle = title.replace(/\s*\(SIZE.*\)/, '');
                const existing = cartItems.find(i => i.title.replace(/\s*\(SIZE.*\)/, '') === cleanTitle && i.size === size);
                
                const imgEl = parent.querySelector('.img-primary, .collection-img, img');
                const img = imgEl ? imgEl.src : 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=400&q=80';

                if (existing) {
                    existing.qty = (parseInt(existing.qty) || 1) + 1;
                } else {
                    cartItems.push({ title: cleanTitle, price, size, qty: 1, img });
                }
                
                const originalText = btn.textContent;
                btn.textContent = "ADDED";
                btn.style.backgroundColor = "var(--text-dark)";
                btn.style.color = "var(--bg-white)";
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = "";
                    btn.style.color = "";
                }, 1500);

                updateCartUI();
                if (cartPanel) {
                    cartPanel.classList.add('active');
                    if (cartOverlay) cartOverlay.classList.add('active');
                    lenis.stop();
                }
            }
        });
    });

    updateCartUI();

    /* ==========================================================================
       PRODUCT DETAIL PAGE (PDP) LOGIC
       ========================================================================== */
    const pdpTitle = document.getElementById('pdp-title');
    if (pdpTitle) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || 'VL-001';

        const productCatalog = {
            'VL-001': { title: 'VL-001 / OBSIDIAN COAT', price: '$1,850 USD', desc: 'Sculpted from heavy double-faced Italian wool, featuring raw-edge seams, hidden horn button closure, and an oversized architectural silhouette.', img: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80', materials: '100% Northern Italian Virgin Wool (780g/m²). Lined with unbleached Japanese Cupro. Tailored at our partner atelier in Bergamo, Italy.', fit: 'Designed for a relaxed, sculptural fit with dropped shoulders. Model is 188cm / 6\'2" wearing size 48.' },
            'VL-002': { title: 'VL-002 / ARCHITECTURAL BLAZER', price: '$1,350 USD', desc: 'Double-breasted tailoring crafted from fine merino wool with padded sharp shoulders and waist cinch.', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80', materials: '100% Merino Wool suiting woven in Biella. Horn buttons and pure silk half-lining.', fit: 'Tailored for a sharp, exaggerated shoulder and suppressed waist. True to size.' },
            'VL-003': { title: 'VL-003 / CASHMERE KNIT', price: '$720 USD', desc: 'Seamless heavy gauge cashmere sweater with raw hems and a relaxed drop-shoulder cut.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80', materials: '100% Mongolian Cashmere. Spun and knitted without seams for ultimate comfort.', fit: 'Oversized, boxy fit. Size down for a more traditional silhouette.' },
            'VL-004': { title: 'VL-004 / TRENCH COAT', price: '$2,100 USD', desc: 'Water-repellent heavyweight cotton gabardine trench with extreme collar lapels and belt fasteners.', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80', materials: '100% Cotton Gabardine treated with sustainable DWR finish. Unlined for trans-seasonal wear.', fit: 'Voluminous A-line silhouette with raglan sleeves. Adjustable waist belt for structure.' },
            'VL-005': { title: 'VL-005 / RAW SILK SHIRT', price: '$890 USD', desc: 'Hand-loomed unbleached silk shirt featuring mother-of-pearl buttons and relaxed architectural drape.', img: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80', materials: '100% Raw Unbleached Silk. Featuring naturally occurring slubs and textural variations.', fit: 'Fluid, relaxed fit with elongated sleeves and a dropped back hem.' },
            'VL-006': { title: 'VL-006 / TAILORED TROUSER', price: '$640 USD', desc: 'Deep double-pleated wool trousers featuring high waist rise and wide straight leg cut.', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80', materials: '100% Worsted Wool. Breathable mid-weight fabric suitable for all seasons.', fit: 'High-waisted with a very wide, straight leg. Fits true to waist size.' },
            'VL-007': { title: 'VL-007 / LEATHER AVIATOR JACKET', price: '$3,400 USD', desc: 'Drum-dyed Northern Italian leather jacket with silver hardware and vintage patinated finish.', img: 'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=1200&q=80', materials: '100% Full-Grain Calfskin Leather. Tanned in Tuscany. Heavy duty Excella hardware.', fit: 'Cropped body length with slightly elongated sleeves. Standard fit.' }
        };

        const item = productCatalog[productId] || productCatalog['VL-001'];
        
        pdpTitle.textContent = item.title;
        document.getElementById('pdp-sku-crumb').textContent = productId;
        document.getElementById('pdp-price').textContent = item.price;
        document.getElementById('pdp-desc').textContent = item.desc;
        
        const materialsEl = document.getElementById('pdp-materials');
        if (materialsEl) materialsEl.textContent = item.materials || '';
        
        const fitEl = document.getElementById('pdp-fit');
        if (fitEl) fitEl.textContent = item.fit || '';
        
        const pdpImgEl = document.getElementById('pdp-main-image');
        if (pdpImgEl) {
            const customImg = urlParams.get('img');
            pdpImgEl.src = customImg ? decodeURIComponent(customImg) : item.img;
            setTimeout(() => { pdpImgEl.style.opacity = '1'; }, 50);
        }

        // Size Selector Interactivity
        let selectedSize = '46';
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                selectedSize = e.target.textContent;
            });
        });

        // Quantity Selector Interactivity
        let currentQty = 1;
        const qtyVal = document.getElementById('qty-val');
        const qtyMinus = document.getElementById('qty-minus');
        const qtyPlus = document.getElementById('qty-plus');

        if (qtyMinus && qtyPlus) {
            qtyMinus.addEventListener('click', () => {
                if (currentQty > 1) {
                    currentQty--;
                    qtyVal.textContent = currentQty;
                }
            });
            qtyPlus.addEventListener('click', () => {
                currentQty++;
                qtyVal.textContent = currentQty;
            });
        }

        // Add to Bag Button
        const pdpAddBtn = document.getElementById('pdp-add-btn');
        if (pdpAddBtn) {
            pdpAddBtn.addEventListener('click', () => {
                const cleanTitle = item.title.replace(/\s*\(SIZE.*\)/, '');
                const existing = cartItems.find(i => i.title.replace(/\s*\(SIZE.*\)/, '') === cleanTitle && i.size === selectedSize);
                
                if (existing) {
                    existing.qty = (parseInt(existing.qty) || 1) + currentQty;
                } else {
                    cartItems.push({
                        title: cleanTitle,
                        price: item.price,
                        size: selectedSize,
                        qty: currentQty,
                        img: item.img
                    });
                }
                updateCartUI();
                if (cartPanel) {
                    cartPanel.classList.add('active');
                    if (cartOverlay) cartOverlay.classList.add('active');
                }
            });
        }

        // Dynamic Complementary Pieces (filters out the active product)
        const relatedGrid = document.querySelector('.pdp-related .lookbook-grid');
        if (relatedGrid) {
            const otherCatalogKeys = Object.keys(productCatalog).filter(key => key !== productId);
            const recommendedKeys = otherCatalogKeys.slice(0, 3);
            
            let relatedHTML = '';
            recommendedKeys.forEach(key => {
                const rec = productCatalog[key];
                relatedHTML += `
                <div class="lookbook-item reveal-card spotlight-item" data-cursor="EXPLORE">
                    <div class="image-wrapper fade-switch">
                        <img class="img-primary" src="${rec.img}" alt="${rec.title}">
                        <a href="product.html?id=${key}&img=${encodeURIComponent(rec.img)}" class="btn-view-product">VIEW PRODUCT</a>
                    </div>
                    <div class="item-meta">
                        <span class="item-code">${rec.title}</span>
                        <span class="item-price">${rec.price}</span>
                    </div>
                    <button class="add-to-bag">ADD TO BAG</button>
                </div>`;
            });
            relatedGrid.innerHTML = relatedHTML;

            relatedGrid.querySelectorAll('.add-to-bag').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const card = e.target.closest('.lookbook-item');
                    if (card) {
                        const title = card.querySelector('.item-code')?.textContent || 'ARCHIVAL ITEM';
                        const price = card.querySelector('.item-price')?.textContent || '$0 USD';
                        const img = card.querySelector('.img-primary')?.src || '';
                        
                        const existing = cartItems.find(i => i.title === title && i.size === '46');
                        if (existing) {
                            existing.qty = (parseInt(existing.qty) || 1) + 1;
                        } else {
                            cartItems.push({ title, price, img, size: '46', qty: 1 });
                        }
                        saveCart();
                        updateCartUI();
                        if (cartPanel) {
                            cartPanel.classList.add('active');
                            if (cartOverlay) cartOverlay.classList.add('active');
                            lenis.stop();
                        }
                    }
                });
            });
        }
    }

    /* ==========================================================================
       CHECKOUT PAGE SUMMARY LOGIC
       ========================================================================== */
    const checkoutItemsList = document.getElementById('checkout-items-list');
    if (checkoutItemsList) {
        let total = 0;
        let html = '';

        if (cartItems.length === 0) {
            checkoutItemsList.innerHTML = '<div style="color:var(--accent-pewter);">No items in checkout bag.</div>';
        } else {
            cartItems.forEach(item => {
                const priceVal = parseFloat(item.price.replace(/[$, USD]/g, ''));
                const qtyVal = item.qty || 1;
                total += priceVal * qtyVal;
                html += `
                    <div class="co-item-row">
                        <div class="co-item-info">
                            <h4>${item.title}</h4>
                            <span>SIZE: ${item.size || '46'} | QTY: ${qtyVal}</span>
                        </div>
                        <div>${item.price}</div>
                    </div>
                `;
            });
            checkoutItemsList.innerHTML = html;
        }

        const subtotalEl = document.getElementById('co-subtotal');
        const taxEl = document.getElementById('co-tax');
        const totalEl = document.getElementById('co-total');

        const tax = Math.round(total * 0.08);
        const finalTotal = total + tax;

        if (subtotalEl) subtotalEl.textContent = `$${total.toLocaleString('en-US')} USD`;
        if (taxEl) taxEl.textContent = `$${tax.toLocaleString('en-US')} USD`;
        if (totalEl) totalEl.textContent = `$${finalTotal.toLocaleString('en-US')} USD`;
    }
});
