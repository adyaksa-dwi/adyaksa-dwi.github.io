// ----------------------------------------------------
// FORCE SCROLL TO TOP ON REFRESH
// ----------------------------------------------------
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// ----------------------------------------------------
// LANGUAGE SWITCHER (EN / ID)
// ----------------------------------------------------
const translations = {
    en: {
        nav_home: "Home",
        nav_about: "About",
        nav_portfolio: "Portfolio",
        nav_contact: "Contact",
        nav_hire: "Hire Me",
        hero_desc: "Multimedia Enthusiast & Creative Technologist.<br>Looking for the creator?",
        btn_explore: "EXPLORE WORK",
        btn_profile: "PROFILE",
        scroll: "SCROLL",
        about_title: "MOTION GRAPHIC <span class=\"text-outline\">DESIGNER</span>",
        about_desc: "Hello, I am Dwi Adyaksa, a graduate from Jakarta State Polytechnic working in the multimedia industry, with a focus on Motion Graphics and Videography. I am also actively exploring new things, one of which is the 3D world. For me, the 3D world is a universal bridge to connect various other media, such as 3D Animation, 3D Modelling, and 3D Game Development. I believe that strong visual communication is born from small details and boundless innovation.",
        lumina_desc: "Lumina Flux, the beauty of the name is in how the two words, Lumina and Flux, combine to create a new, powerful meaning that perfectly describes your skills. \"Lumina\" is a word rooted in Latin, and it means light. \"Flux\" means a continuous change or flow. Think of a river in a state of constant motion. When you put them together, Lumina Flux means \"the flow of light\". It doesn't just describe what you do; it describes how you do it—with a sense of motion, change, and creativity that flows like light itself.",
        portfolio_title: "My <span class=\"text-outline\">Portfolio</span>",
        contact_title: "Let's<br>Collaborate",
        contact_desc: "Interested in building extraordinary digital experiences? Contact me for projects, collaborations, or just to say hello.",
        contact_label_name: "NAME",
        contact_label_email: "EMAIL",
        contact_label_message: "MESSAGE",
        contact_ph_name: "Enter your name",
        contact_ph_email: "email@example.com",
        contact_ph_message: "Tell me about your project...",
        contact_submit: "SEND MESSAGE"
    },
    id: {
        nav_home: "Beranda",
        nav_about: "Profil",
        nav_portfolio: "Portofolio",
        nav_contact: "Kontak",
        nav_hire: "Rekrut Saya",
        hero_desc: "Multimedia Enthusiast & Creative Technologist.<br>Mencari sang kreator?",
        btn_explore: "JELAJAHI KARYA",
        btn_profile: "PROFIL",
        scroll: "GULIR",
        about_title: "MOTION GRAPHIC <span class=\"text-outline\">DESIGNER</span>",
        about_desc: "Halo, saya Dwi Adyaksa, mahasiswa lulusan Politeknik Negeri Jakarta yang bergerak di industri multimedia, dengan fokus pada Motion Graphics dan Videography. Saya juga aktif untuk eksplorasi berbagai hal baru, salah satunya adalah dunia 3D. Bagi saya, dunia 3D adalah jembatan universal untuk menghubungkan berbagai media yang lain, seperti Animasi 3D, 3D Modelling, dan 3D Game Development. Saya percaya bahwa komunikasi visual yang kuat lahir dari detail kecil dan inovasi tanpa batas.",
        lumina_desc: "Lumina Flux, keindahan namanya terletak pada bagaimana dua kata, Lumina dan Flux, bergabung menciptakan makna baru yang kuat dan secara sempurna menggambarkan keahlian Anda. \"Lumina\" berasal dari bahasa Latin yang berarti cahaya. \"Flux\" berarti perubahan atau aliran yang terus-menerus. Bayangkan sebuah sungai yang selalu bergerak. Jika digabungkan, Lumina Flux berarti \"aliran cahaya\". Ini tidak hanya mendeskripsikan apa yang Anda lakukan; tetapi juga bagaimana Anda melakukannya—dengan rasa pergerakan, perubahan, dan kreativitas yang mengalir layaknya cahaya itu sendiri.",
        portfolio_title: "Portofolio <span class=\"text-outline\">Saya</span>",
        contact_title: "Mari<br>Berkolaborasi",
        contact_desc: "Tertarik untuk membangun pengalaman digital yang luar biasa? Hubungi saya untuk proyek, kolaborasi, atau sekadar menyapa.",
        contact_label_name: "NAMA",
        contact_label_email: "EMAIL",
        contact_label_message: "PESAN",
        contact_ph_name: "Masukkan nama Anda",
        contact_ph_email: "email@contoh.com",
        contact_ph_message: "Ceritakan tentang proyek Anda...",
        contact_submit: "KIRIM PESAN"
    }
};

let currentLang = localStorage.getItem('language') || 'en';

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;

    // Update button text
    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang.toUpperCase();

    // Update innerHTML for standard elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });
}

window.toggleLanguage = function () {
    window.luminaAudio?.playSfxClick();
    const newLang = currentLang === 'en' ? 'id' : 'en';
    applyLanguage(newLang);
    // Restart typewriter if it's running
    if (typeof updateTypewriterPhrases === 'function') {
        updateTypewriterPhrases(true); // Pass true to trigger instant update
    }
};

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
});

// Navigation Scroll Spy & Background Wallpaper Transitions
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");
// Attach hover SFX to desktop nav links
navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => window.luminaAudio?.playSfxHover());
});
const bgElements = document.querySelectorAll("[data-bg-section]");

// Attach hover SFX to buttons, social links, and portfolio cards
document.querySelectorAll('button, .button, .btn, .social-link, .spiral-card, .portfolio-item').forEach(el => {
    el.addEventListener('mouseenter', () => window.luminaAudio?.playSfxHover());
});

const bgSectionMap = {
    "home": "home",
    "about": "about",
    "lumina-flux": "about", // Philosophy section uses Profile/About wallpaper
    "portfolio": "portfolio",
    "contact": "contact"
};

let currentBgSection = "";

function handleScrollAndBgs() {
    if (document.body.style.position === 'fixed') return; // Jangan update UI (seperti navbar & bg) saat layar sedang dikunci oleh overlay

    let current = "";
    sections.forEach((section) => {
        // Abaikan section yang sedang di-hide (misal saat membuka detail kategori portfolio)
        if (section.offsetParent === null) return;
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 150) {
            current = section.getAttribute("id");
        }
    });

    // Update active nav links
    navLinks.forEach((link) => {
        link.classList.remove("text-primary", "font-bold", "border-b-2", "border-primary", "pb-1");
        link.classList.add("text-on-surface-variant", "font-medium");
        if (link.getAttribute("href").includes(current)) {
            link.classList.remove("text-on-surface-variant", "font-medium");
            link.classList.add("text-primary", "font-bold", "border-b-2", "border-primary", "pb-1");
        }
    });

    // Update background wallpaper transitions
    if (current && bgSectionMap[current]) {
        const targetBgSection = bgSectionMap[current];
        if (targetBgSection !== currentBgSection) {
            currentBgSection = targetBgSection;
            bgElements.forEach(el => {
                if (el.getAttribute("data-bg-section") === targetBgSection) {
                    el.classList.remove("opacity-0");
                    el.classList.add("opacity-100");
                } else {
                    el.classList.remove("opacity-100");
                    el.classList.add("opacity-0");
                }
            });
        }
    }

    // Update Three.js canvas container visibility (fade out when not on home)
    const threeContainer = document.getElementById("global-three-container");
    if (threeContainer) {
        if (!current || current === "home") {
            threeContainer.classList.remove("opacity-0");
            threeContainer.classList.add("opacity-100");
        } else {
            threeContainer.classList.remove("opacity-100");
            threeContainer.classList.add("opacity-0");
        }
    }

    const nav = document.getElementById('main-nav');
    if (window.scrollY > 50) {
        nav.classList.add('bg-surface/90', 'shadow-md');
        nav.classList.remove('bg-surface/80', 'shadow-sm');
    } else {
        nav.classList.remove('bg-surface/90', 'shadow-md');
        nav.classList.add('bg-surface/80', 'shadow-sm');
    }
}

window.addEventListener("scroll", handleScrollAndBgs);
// Initialize backgrounds and scroll spy status immediately
setTimeout(handleScrollAndBgs, 50);

// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
mobileBtn.addEventListener('click', () => {
    window.luminaAudio?.playSfxClick();
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    const icon = mobileBtn.querySelector('span');
    icon.textContent = icon.textContent === 'menu' ? 'close' : 'menu';
});
mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        window.luminaAudio?.playSfxClick();
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        mobileBtn.querySelector('span').textContent = 'menu';
    });
});

window.openPortfolioOverlay = function () {
    const overlay = document.getElementById('portfolio-overlay');
    if (!overlay) return;

    // Lock body scroll and perfectly preserve scroll position
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    window.lastMainPageScroll = window.scrollY;

    // Compensate for disappearing scrollbar to prevent layout jump
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.getElementById('main-nav').style.paddingRight = `${scrollbarWidth}px`; // Juga kompensasi untuk fixed navbar

    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.lastMainPageScroll}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    // iOS Safari requires overflow:hidden on html too to fully prevent background scroll
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    // Trigger the 3D staggered entrance animation IMMEDIATELY
    // before the overlay even becomes visible to prevent flash/glitch
    if (window.portfolioViewMode === 'spiral' && document.getElementById('category-content-view').classList.contains('hidden')) {
        if (window.spiralCarousel) {
            window.spiralCarousel.triggerEntrance();
        }
    }

    // Play open SFX
    window.luminaAudio?.playSfxOpen();

    // Show overlay
    overlay.classList.remove('hidden');
    overlay.classList.add('flex'); // Because it uses flex-col

    // Trigger cinematic animation
    setTimeout(() => {
        overlay.classList.remove('opacity-0', 'translate-y-24', 'scale-[0.95]');
        overlay.classList.add('opacity-100', 'translate-y-0', 'scale-100');

        // Ensure scrollbar is hidden if in spiral mode, or shown if in grid/category
        if (window.portfolioViewMode === 'spiral' && document.getElementById('category-content-view').classList.contains('hidden')) {
            overlay.style.overflowY = 'hidden';
        } else {
            overlay.style.overflowY = 'auto';
        }
    }, 10);
};

window.closePortfolioOverlay = function () {
    window.luminaAudio?.playSfxClose();
    const overlay = document.getElementById('portfolio-overlay');
    if (!overlay) return;

    // Restore body scroll and perfect position IMMEDIATELY to prevent delayed scrollbar pop
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.style.touchAction = '';
    document.documentElement.style.overflow = '';
    document.getElementById('main-nav').style.paddingRight = '';

    if (window.lastMainPageScroll !== undefined) {
        // Force instant scroll bypassing CSS smooth behavior if any
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, window.lastMainPageScroll);
        // Restore CSS behavior
        setTimeout(() => {
            document.documentElement.style.scrollBehavior = '';
        }, 10);
    }

    // Trigger cinematic exit animation
    overlay.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
    overlay.classList.add('opacity-0', 'translate-y-24', 'scale-[0.95]');

    // Wait for transition to finish before hiding
    setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('flex');
    }, 800); // 800ms matches the transition-duration
};

window.openCategoryTab = function (event, title, categoryId) {
    window.luminaAudio?.playSfxOpen();
    window.lastScrollPositionPortfolio = document.getElementById('portfolio-overlay').scrollTop || 0;
    window.activePortfolioCategory = categoryId; // Simpan status kategori yang sedang aktif
    const cardEl = event ? event.currentTarget : null;
    const imgEl = cardEl ? cardEl.querySelector('img') : null;

    // Filter portfolio items terlebih dahulu dan siapkan untuk animasi
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach(item => {
        if (item.getAttribute('data-category') === categoryId) {
            item.classList.remove('hidden-item');
            // Persiapan awal animasi stagger: sembunyikan dan turunkan posisi
            item.style.opacity = '0';
            item.style.transform = 'translateY(40px)';
            item.style.transition = 'none'; // Matikan transisi agar reset instan
        } else {
            item.classList.add('hidden-item');
        }
    });

    const titleEl = document.getElementById('active-category-title');
    titleEl.textContent = title;

    if (imgEl && event) {
        // --- PACÔME PERTANT FLIP ANIMATION ---
        const heroImg = document.getElementById('category-hero-image');
        heroImg.src = imgEl.src;

        // 1. FIRST: Dapatkan posisi dan ukuran gambar saat di dalam card
        const firstRect = imgEl.getBoundingClientRect();
        const computedStyle = getComputedStyle(cardEl);

        // Persiapan: Sembunyikan view seleksi kategori
        document.getElementById('category-selection-view').classList.add('hidden');
        document.getElementById('portfolio-header').classList.add('hidden');
        const topHeader = document.getElementById('overlay-top-header');
        if (topHeader) {
            topHeader.style.position = 'absolute'; // Instantly remove from layout flow
            topHeader.classList.add('opacity-0', '-translate-y-full');
            setTimeout(() => topHeader.classList.add('hidden'), 500);
        }

        // Toggle Masonry layout untuk Photography
        const grid = document.getElementById('portfolio-grid');
        if (categoryId === 'photography') {
            grid.classList.add('masonry-active');
        } else {
            grid.classList.remove('masonry-active');
        }

        // Reset styles that might have been applied by previous close animation
        const contentView = document.getElementById('category-content-view');
        contentView.style.position = '';
        contentView.style.top = '';
        contentView.style.left = '';
        contentView.style.width = '';
        contentView.style.zIndex = '';
        contentView.style.transform = '';
        contentView.style.opacity = '';
        contentView.style.transition = '';
        contentView.classList.remove('hidden');

        // Enable scrolling for category content view
        document.getElementById('portfolio-overlay').style.overflowY = 'auto';

        // Tampilkan filter tabs khusus untuk Motion Graphics
        const motionFilters = document.getElementById('motion-filters');
        if (motionFilters) {
            if (categoryId === 'motion') {
                motionFilters.classList.remove('hidden');
                // Auto-click "All" to reset filter state when opening
                const allFilterBtn = document.querySelector('.motion-filter-btn[data-filter="all"]');
                if (allFilterBtn) allFilterBtn.click();
            } else {
                motionFilters.classList.add('hidden');
            }
        }

        // Tampilkan content view normal
        document.getElementById('category-content-view').classList.remove('hidden');

        // Reset scroll ke atas seketika agar posisi LAST akurat
        window.scrollTo({ top: 0, behavior: 'instant' });

        // 2. LAST: Dapatkan posisi target (Hero Header)
        const lastRect = heroImg.getBoundingClientRect();

        // Sembunyikan sementara teks dan gambar asli
        titleEl.classList.add('opacity-0', 'translate-y-8');
        heroImg.style.visibility = 'hidden';

        // 3. PLAY: Buat elemen Clone untuk terbang
        const clone = imgEl.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.top = firstRect.top + 'px';
        clone.style.left = firstRect.left + 'px';
        clone.style.width = firstRect.width + 'px';
        clone.style.height = firstRect.height + 'px';
        clone.style.margin = '0';
        clone.style.zIndex = '9999';
        clone.style.objectFit = 'cover';

        // Atasi bug radius hilang dengan menggunakan nilai radius spesifik viewport
        const startRadius = window.innerWidth < 768 ? '40px' : '60px';
        clone.style.borderRadius = startRadius;

        // Tangkap posisi object-position jika ada
        clone.style.objectPosition = getComputedStyle(imgEl).objectPosition;
        document.body.appendChild(clone);

        // Animasi terbang dengan easing eksponensial dramatis
        const animation = clone.animate([
            {
                top: firstRect.top + 'px',
                left: firstRect.left + 'px',
                width: firstRect.width + 'px',
                height: firstRect.height + 'px',
                borderRadius: startRadius
            },
            {
                top: lastRect.top + 'px',
                left: lastRect.left + 'px',
                width: lastRect.width + 'px',
                height: lastRect.height + 'px',
                borderRadius: '24px' // Sesuai dengan rounded-3xl container tujuan
            }
        ], {
            duration: 800, // 0.8 detik
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // ease-out-expo
            fill: 'forwards'
        });

        animation.onfinish = () => {
            clone.remove();
            heroImg.style.visibility = 'visible';
            // Munculkan teks dan tombol setelah gambar mendarat
            document.getElementById('category-hero-overlay')?.classList.remove('opacity-0');
            document.getElementById('category-close-btn')?.classList.remove('opacity-0', 'scale-90');
            titleEl.classList.remove('opacity-0', 'translate-y-8');

            // Animasi Stagger untuk kartu portfolio di dalam kategori ini
            const visibleItems = document.querySelectorAll(`.portfolio-item[data-category="${categoryId}"]`);
            visibleItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';

                    // Setelah animasi selesai, reset transition agar hover effect (glow-hover) berfungsi normal lagi
                    setTimeout(() => {
                        item.style.transition = '';
                    }, 600);
                }, index * 100 + 200); // Tunda 200ms setelah gambar mendarat, lalu stagger tiap 100ms
            });
        };
    } else {
        // Fallback jika tidak ada event animasi
        document.getElementById('category-selection-view').classList.add('hidden');
        document.getElementById('portfolio-header').classList.add('hidden');
        const topHeader = document.getElementById('overlay-top-header');
        if (topHeader) {
            topHeader.style.position = 'absolute'; // Instantly remove from layout flow
            topHeader.classList.add('opacity-0', '-translate-y-full');
            setTimeout(() => topHeader.classList.add('hidden'), 500);
        }
        const fallbackContentView = document.getElementById('category-content-view');
        fallbackContentView.style.position = '';
        fallbackContentView.style.top = '';
        fallbackContentView.style.left = '';
        fallbackContentView.style.width = '';
        fallbackContentView.style.zIndex = '';
        fallbackContentView.style.transform = '';
        fallbackContentView.style.opacity = '';
        fallbackContentView.style.transition = '';
        fallbackContentView.classList.remove('hidden');

        document.getElementById('portfolio-overlay').scrollTo({ top: 0, behavior: 'instant' });
        document.getElementById('category-hero-overlay')?.classList.remove('opacity-0');
        document.getElementById('category-close-btn')?.classList.remove('opacity-0', 'scale-90');
        titleEl.classList.remove('opacity-0', 'translate-y-8');

        // Fallback Stagger (jika tidak ada animasi terbang)
        const visibleItems = document.querySelectorAll(`.portfolio-item[data-category="${categoryId}"]`);
        visibleItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                setTimeout(() => {
                    item.style.transition = '';
                }, 600);
            }, index * 100 + 100);
        });
    }
};

window.filterPortfolio = function (filterValue) {
    // Update active button state
    const buttons = document.querySelectorAll('.motion-filter-btn');
    buttons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filterValue) {
            btn.classList.add('bg-primary-container', 'text-white', 'border-primary-container');
            btn.classList.remove('text-on-surface-variant', 'border-outline-variant', 'hover:text-on-surface');
        } else {
            btn.classList.remove('bg-primary-container', 'text-white', 'border-primary-container');
            btn.classList.add('text-on-surface-variant', 'border-outline-variant', 'hover:text-on-surface');
        }
    });

    // Filter items
    const categoryId = window.activePortfolioCategory || 'motion';
    const items = document.querySelectorAll(`.portfolio-item[data-category="${categoryId}"]`);

    let delayIndex = 0;

    items.forEach(item => {
        const itemFilter = item.getAttribute('data-sub-category');
        const shouldShow = filterValue === 'all' || itemFilter === filterValue;

        if (shouldShow) {
            item.classList.remove('hidden-item');

            // Re-trigger animate in
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'none';

            // Force reflow
            void item.offsetWidth;

            setTimeout(() => {
                item.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';

                setTimeout(() => {
                    item.style.transition = '';
                }, 400);
            }, delayIndex * 50);

            delayIndex++;
        } else {
            // Hide item
            item.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';

            setTimeout(() => {
                item.classList.add('hidden-item');
                item.style.transition = '';
            }, 300);
        }
    });
}

window.closeCategoryTab = function () {
    window.luminaAudio?.playSfxClose();
    window.activePortfolioCategory = null; // Reset kategori aktif
    const titleEl = document.getElementById('active-category-title');
    titleEl.classList.add('opacity-0', 'translate-y-8'); // Sembunyikan teks

    // Sembunyikan overlay dan tombol kembali
    document.getElementById('category-hero-overlay')?.classList.add('opacity-0');
    document.getElementById('category-close-btn')?.classList.add('opacity-0', 'scale-90');

    const contentView = document.getElementById('category-content-view');
    const selectionView = document.getElementById('category-selection-view');
    const header = document.getElementById('portfolio-header');
    const overlay = document.getElementById('portfolio-overlay');

    // 1. Kunci ukuran dan posisi SEBELUM merubah DOM
    const rect = contentView.getBoundingClientRect();
    const parentRect = contentView.parentElement.getBoundingClientRect();
    const currentScrollY = overlay.scrollTop;
    const targetScrollY = window.lastScrollPositionPortfolio || 0;
    const scrollDelta = currentScrollY - targetScrollY;

    // 2. Set absolute position to offset the scroll jump flawlessly
    // absoluteTop = jarak visual layar (rect.top) dikurangi batas kontainer (parentRect.top) 
    // dikurangi lonjakan scroll agar elemen terkunci diam secara visual
    const absoluteTop = rect.top - parentRect.top - scrollDelta;
    const absoluteLeft = rect.left - parentRect.left;

    // KUNCI: Wajib set posisi kiri/atas presisi & dimensi agar elemen terkunci diam persis di layarnya
    contentView.style.position = 'absolute';
    contentView.style.top = absoluteTop + 'px';
    contentView.style.left = absoluteLeft + 'px';
    contentView.style.width = rect.width + 'px';
    contentView.style.height = rect.height + 'px';
    contentView.style.zIndex = '50';

    // 4. Paksa browser melakukan reflow
    void overlay.offsetHeight;
    void contentView.offsetWidth;

    // 5. Scroll secara instan ke posisi portfolio yang lama di overlay
    overlay.scrollTo({ top: targetScrollY, behavior: 'instant' });

    // Ensure overlay scrollbar state is restored based on mode
    if (window.portfolioViewMode === 'spiral') {
        overlay.style.overflowY = 'hidden';
    } else {
        overlay.style.overflowY = 'auto';
    }

    // 6. Jalankan animasi di frame berikutnya
    requestAnimationFrame(() => {
        // Animasi keluar (Merosot & Memudar)
        contentView.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        contentView.style.opacity = '0';
        contentView.style.transform = 'translateY(80px)';
        // Siapkan arsip karya
        selectionView.classList.remove('hidden');
        header.classList.remove('hidden');

        // Trigger ulang animasi Helix jika mode saat ini adalah spiral
        if (window.portfolioViewMode === 'spiral' && window.spiralCarousel) {
            window.spiralCarousel.triggerEntrance();
        }

        const topHeader = document.getElementById('overlay-top-header');
        if (topHeader) {
            topHeader.classList.remove('hidden');
            topHeader.style.position = ''; // Restore to sticky
            void topHeader.offsetWidth; // Force reflow
            topHeader.classList.remove('opacity-0', '-translate-y-full');
        }
        selectionView.style.opacity = '0';
        selectionView.style.transform = 'scale(0.85)';

        // Delay sangat singkat untuk memastikan state awal render
        setTimeout(() => {
            selectionView.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            selectionView.style.opacity = '1';
            selectionView.style.transform = 'scale(1)';
        }, 50);

        // 7. Bersihkan semua inline style setelah animasi selesai
        setTimeout(() => {
            contentView.classList.add('hidden');
            contentView.style.position = '';
            contentView.style.top = '';
            contentView.style.left = '';
            contentView.style.width = '';
            contentView.style.zIndex = '';
            contentView.style.transition = '';
            contentView.style.opacity = '';
            contentView.style.transform = '';

            selectionView.style.transition = '';
            selectionView.style.transform = '';
        }, 800);
    });
};









function initPhotographyTunnel() {
    const stage = document.getElementById('tunnel-stage');
    if (!stage) return;
    stage.innerHTML = '';
    tunnelPhotos = [];
    tunnelScrollTarget = 0;
    tunnelScrollCurrent = 0;

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Build photo pool (~50 photos)
    const pool = [];
    while (pool.length < 50) {
        for (const src of photographyImages) {
            pool.push(src);
            if (pool.length >= 50) break;
        }
    }
    // Shuffle
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    for (let i = 0; i < pool.length; i++) {
        const img = document.createElement('img');
        img.src = pool[i];
        img.alt = 'Photography';
        img.className = 'tunnel-photo';
        img.draggable = false;

        const baseW = 180 + Math.random() * 220;
        const baseH = baseW * (0.6 + Math.random() * 0.6);

        const angle = Math.random() * Math.PI * 2;
        const radius = 120 + Math.random() * 500;
        const vx = Math.cos(angle) * radius;
        const vy = Math.sin(angle) * radius;
        const vz = -(200 + i * 240 + Math.random() * 200);
        const rot = (Math.random() - 0.5) * 12;

        stage.appendChild(img);
        tunnelPhotos.push({ el: img, vx, vy, vz, baseW, baseH, rot, src: pool[i] });
    }

    // Start animation loop
    window.addEventListener('scroll', onTunnelScroll, { passive: true });
    if (tunnelRAF) cancelAnimationFrame(tunnelRAF);
    tunnelRAF = requestAnimationFrame(tunnelRenderLoop);

    setTimeout(() => {
        document.getElementById('tunnel-close-btn')?.classList.remove('opacity-0', 'translate-y-[-20px]');
    }, 800);
}

function onTunnelScroll() {
    const tunnelView = document.getElementById('photography-tunnel-view');
    if (!tunnelView || tunnelView.classList.contains('hidden')) return;
    const maxScroll = tunnelView.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    tunnelScrollTarget = progress * TUNNEL_SPEED;
}

function tunnelRenderLoop() {
    const tunnelView = document.getElementById('photography-tunnel-view');
    if (!tunnelView || tunnelView.classList.contains('hidden')) {
        tunnelRAF = null;
        return;
    }

    // Smooth lerp
    tunnelScrollCurrent += (tunnelScrollTarget - tunnelScrollCurrent) * LERP_FACTOR;

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (const photo of tunnelPhotos) {
        const dz = photo.vz + tunnelScrollCurrent;

        // Behind camera or too far → hide
        if (dz >= TUNNEL_PERSPECTIVE || dz < -TUNNEL_SPEED * 0.8) {
            photo.el.style.display = 'none';
            continue;
        }

        const distFromCam = -dz;
        const scale = TUNNEL_PERSPECTIVE / (TUNNEL_PERSPECTIVE + distFromCam);

        const sx = cx + photo.vx * scale;
        const sy = cy + photo.vy * scale;
        const sw = photo.baseW * scale;
        const sh = photo.baseH * scale;

        // Opacity: fade out near, fade in from far
        let opacity = 1;
        if (distFromCam < 100) {
            opacity = Math.max(0, distFromCam / 100);
        } else if (distFromCam > 3000) {
            opacity = Math.max(0, 1 - (distFromCam - 3000) / 5000);
        }

        const zIndex = Math.round(scale * 1000);

        photo.el.style.display = 'block';
        photo.el.style.position = 'absolute';
        photo.el.style.left = (sx - sw / 2) + 'px';
        photo.el.style.top = (sy - sh / 2) + 'px';
        photo.el.style.width = sw + 'px';
        photo.el.style.height = sh + 'px';
        photo.el.style.opacity = opacity.toFixed(3);
        photo.el.style.zIndex = zIndex;
        photo.el.style.transform = 'rotate(' + (photo.rot * scale).toFixed(2) + 'deg)';
        photo.el.style.pointerEvents = opacity < 0.15 ? 'none' : 'auto';
    }

    // Fade out title
    const title = document.getElementById('tunnel-title');
    if (title) {
        title.style.opacity = Math.max(0, 1 - tunnelScrollCurrent / 400).toFixed(3);
    }

    tunnelRAF = requestAnimationFrame(tunnelRenderLoop);
}

window.closePhotographyTunnel = function () {
    const tunnelView = document.getElementById('photography-tunnel-view');
    const closeBtn = document.getElementById('tunnel-close-btn');

    closeBtn.classList.add('opacity-0', 'translate-y-[-20px]');
    tunnelView.style.transition = 'opacity 0.5s ease';
    tunnelView.style.opacity = '0';

    window.removeEventListener('scroll', onTunnelScroll);
    if (tunnelRAF) { cancelAnimationFrame(tunnelRAF); tunnelRAF = null; }

    setTimeout(() => {
        tunnelView.classList.add('hidden');
        tunnelView.style.opacity = '';
        tunnelView.style.transition = '';

        const portfolioSection = document.getElementById('portfolio');
        const selectionView = document.getElementById('category-selection-view');
        const header = document.getElementById('portfolio-header');

        document.getElementById('home')?.classList.remove('hidden');
        document.getElementById('about')?.classList.remove('hidden');
        document.getElementById('lumina-flux')?.classList.remove('hidden');
        document.getElementById('contact')?.classList.remove('hidden');
        document.getElementById('main-footer')?.classList.remove('hidden');

        void portfolioSection.offsetHeight;
        window.scrollTo({ top: portfolioSection.offsetTop, behavior: 'instant' });

        selectionView.classList.remove('hidden', 'opacity-0', 'scale-90', 'pointer-events-none');
        selectionView.classList.add('scale-100');
        header.classList.remove('hidden', 'opacity-0', '-translate-y-8', 'pointer-events-none');
    }, 500);
}


// Google Sheets Dynamic Integration
async function loadDynamicPortfolio() {
    const sheetId = '1anhPdL6etR7KwwtEUUj1ZYpO49EwIY6JYO76V4DX-p4';
    const sheets = [
        { gid: '0', category: 'motion', label: 'MOTION GRAPHICS' },
        { gid: '284798931', category: '3d', label: '3D MODELLING' },
        // { gid: '1127387480', category: 'graphic', label: 'GRAPHIC DESIGN' }, // Hidden per user request
        { gid: '1532829572', category: 'photography', label: 'PHOTOGRAPHY' },
        { gid: '2069598161', category: 'videography', label: 'VIDEOGRAPHY' },
        { gid: '1969393925', category: 'magazines', label: 'MAGAZINES' },
        { gid: '1662877084', category: 'mockup', label: 'MOCKUP DESIGNS' },
        { gid: '976825207', category: 'game', label: 'GAME DEVELOPMENT' },
        { gid: '404770039', category: '3danimation', label: '3D ANIMATION' }
    ];

    // Fungsi parser CSV yang tangguh untuk membaca newline (Alt+Enter) di dalam Google Sheets
    function parseCSV(str) {
        let arr = [];
        let quote = false;
        let row = [];
        let col = '';
        for (let c = 0; c < str.length; c++) {
            let cc = str[c], nc = str[c + 1];
            if (cc === '"') {
                if (quote && nc === '"') { col += '"'; c++; }
                else { quote = !quote; }
            } else if (cc === ',' && !quote) {
                row.push(col);
                col = '';
            } else if (cc === '\r' && nc === '\n' && !quote) {
                row.push(col);
                arr.push(row);
                row = [];
                col = '';
                c++;
            } else if (cc === '\n' && !quote) {
                row.push(col);
                arr.push(row);
                row = [];
                col = '';
            } else {
                col += cc;
            }
        }
        row.push(col);
        arr.push(row);
        return arr;
    }

    const container = document.getElementById('dynamic-portfolio-container');
    if (!container) return;
    container.innerHTML = '';

    let allHtml = '';
    let displayIndex = 0;

    for (const sheet of sheets) {
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${sheet.gid}`;
        try {
            const response = await fetch(url);
            const text = await response.text();

            // Gunakan parser CSV yang mendukung newline di dalam sel (kutipan)
            const rows = parseCSV(text).filter(row => row.length > 1 && row[0] && row[0].trim() !== '');

            for (let i = 1; i < rows.length; i++) {
                const row = rows[i];

                const title = row[0] ? row[0].trim() : 'Untitled';
                let description = '';
                let thumbnail = '';
                let videoUrl = '';
                let imageCol = '';

                let externalLink = '';
                let subCategory = '';

                if (sheet.category === 'game') {
                    description = row[1] ? row[1].trim() : '';
                    videoUrl = row[2] ? row[2].trim() : ''; // Kolom 3: Images (comma separated)
                    externalLink = row[3] ? row[3].trim() : ''; // Kolom 4: Link
                } else if (sheet.category === 'motion') {
                    thumbnail = (row[1] && row[1].trim() !== '' && row[1].trim() !== '-') ? row[1].trim() : '';
                    videoUrl = row[2] ? row[2].trim() : '';
                    subCategory = row[3] ? row[3].trim() : '';
                } else if (sheet.category === 'videography' || sheet.category === 'magazines' || sheet.category === 'mockup' || sheet.category === '3d' || sheet.category === '3danimation') {
                    thumbnail = (row[1] && row[1].trim() !== '' && row[1].trim() !== '-') ? row[1].trim() : '';
                    videoUrl = row[2] ? row[2].trim() : '';
                } else {
                    description = row[1] ? row[1].trim() : '';
                    thumbnail = (row[2] && row[2].trim() !== '') ? row[2].trim() : '';
                    imageCol = thumbnail;
                }

                const thumbMatch = thumbnail.match(/\/d\/([a-zA-Z0-9_-]+)/);
                if (thumbMatch && thumbMatch[1]) {
                    thumbnail = `https://lh3.googleusercontent.com/d/${thumbMatch[1]}=w800`;
                }

                let onClickAttr = '';
                let playIcon = '';
                let opacityClass = 'opacity-100';

                // Pisahkan logika khusus untuk Game Carousel
                if (sheet.category === 'game' && videoUrl) {
                    opacityClass = 'opacity-60 group-hover:opacity-80 transition-opacity';
                    const encodedImages = encodeURIComponent(videoUrl);
                    const encodedDesc = encodeURIComponent(description);
                    const encodedLink = encodeURIComponent(externalLink);
                    onClickAttr = `onclick="openGameModal('${title.replace(/'/g, "\\'")}', '${encodedImages}', '${encodedDesc}', '${encodedLink}')"`;
                    playIcon = `<span class="material-symbols-outlined text-[48px] text-white z-10 bg-primary-container/50 rounded-full p-2 backdrop-blur-md">sports_esports</span>`;

                    if (!thumbnail) {
                        const firstUrl = videoUrl.split(/[,\n]+/)[0].trim();
                        const gDriveMatch = firstUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                        if (gDriveMatch && gDriveMatch[1]) {
                            thumbnail = `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}=w800`;
                        }
                    }
                }
                // Pisahkan logika khusus untuk Mockup & 3D Carousel
                else if ((sheet.category === 'mockup' || sheet.category === '3d') && videoUrl) {
                    opacityClass = 'opacity-60 group-hover:opacity-80 transition-opacity';
                    // videoUrl di sini adalah kumpulan link yang dipisahkan koma
                    const encodedImages = encodeURIComponent(videoUrl);
                    onClickAttr = `onclick="openCarouselModal('${title.replace(/'/g, "\\'")}', '${encodedImages}')"`;
                    playIcon = `<span class="material-symbols-outlined text-[48px] text-white z-10 bg-primary-container/50 rounded-full p-2 backdrop-blur-md">photo_library</span>`;

                    // Fallback thumbnail pertama jika kosong
                    if (!thumbnail) {
                        const firstUrl = videoUrl.split(/[,\n]+/)[0].trim();
                        const gDriveMatch = firstUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                        if (gDriveMatch && gDriveMatch[1]) {
                            thumbnail = `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}=w800`;
                        }
                    }
                }
                // Pastikan videoUrl valid (dimulai dengan http)
                else if (videoUrl && videoUrl.toLowerCase().startsWith('http')) {

                    // Auto replace /view with /preview for Google Drive iframe compatibility (CSP Fix)
                    if (videoUrl.includes('drive.google.com') && videoUrl.includes('/view')) {
                        videoUrl = videoUrl.replace('/view', '/preview');
                    }

                    opacityClass = 'opacity-60 group-hover:opacity-80 transition-opacity';
                    onClickAttr = `onclick="openVideoModal('${encodeURIComponent(videoUrl)}')"`

                    if (sheet.category === 'magazines') {
                        playIcon = `<span class="material-symbols-outlined text-[48px] text-white z-10 bg-primary-container/50 rounded-full p-2 backdrop-blur-md">menu_book</span>`;
                    } else {
                        playIcon = `<span class="material-symbols-outlined text-[48px] text-white z-10 bg-primary-container/50 rounded-full p-2 backdrop-blur-md">play_arrow</span>`;
                    }

                    if (!thumbnail) {
                        const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                        const gDriveMatch = videoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                        if (ytMatch && ytMatch[1]) {
                            thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
                        } else if (gDriveMatch && gDriveMatch[1]) {
                            if (sheet.category === 'magazines') {
                                // Gunakan endpoint thumbnail Drive khusus untuk merender halaman pertama PDF
                                thumbnail = `https://drive.google.com/thumbnail?id=${gDriveMatch[1]}&sz=w800`;
                            } else {
                                // lh3.googleusercontent lebih stabil untuk file gambar murni (JPG/PNG)
                                thumbnail = `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}=w800`;
                            }
                        }
                    }
                } else {
                    let highResImage = imageCol;
                    if (thumbMatch && thumbMatch[1]) highResImage = `https://lh3.googleusercontent.com/d/${thumbMatch[1]}=w1920`;
                    onClickAttr = `onclick="openImageModal('${highResImage}', '${title.replace(/'/g, "\\'")}', '${sheet.label}', '${description.replace(/'/g, "\\'")}')"`;
                }

                if (!thumbnail) thumbnail = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

                let colSpan = 'md:col-span-3'; // Membagi 12 grid menjadi 4 kolom yang rata
                let heightClass = 'h-64 md:h-80'; // Tinggi seragam
                let objectFit = 'object-cover';

                // Normalize subCategory to remove spaces and special chars, e.g. "Featured Projects" -> "featured-projects", "Bumper" -> "bumper"
                const normalizedSubCat = subCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                if (sheet.category === 'magazines') {
                    colSpan = 'md:col-span-4'; // Majalah tetap 3 kolom (karena proporsi portrait A4 butuh ruang lebih)
                    heightClass = 'aspect-[1/1.414] h-auto md:h-auto'; // Proporsi kertas A4
                    objectFit = 'object-contain bg-[#1a1a1a]'; // Contain agar seluruh sampul terlihat tanpa terpotong
                } else if (sheet.category === 'photography') {
                    heightClass = 'h-auto'; // Masonry membutuhkan tinggi natural
                    objectFit = 'object-cover';
                }

                const iconSize = 'text-[48px]'; // Ukuran ikon seragam

                if (playIcon) {
                    if (sheet.category === 'magazines') {
                        playIcon = `<span class="material-symbols-outlined ${iconSize} text-white z-10 bg-primary-container/50 rounded-full p-2 backdrop-blur-md">menu_book</span>`;
                    } else if (sheet.category === 'mockup' || sheet.category === '3d') {
                        playIcon = `<span class="material-symbols-outlined ${iconSize} text-white z-10 bg-primary-container/50 rounded-full p-2 backdrop-blur-md">photo_library</span>`;
                    } else {
                        playIcon = `<span class="material-symbols-outlined ${iconSize} text-white z-10 bg-primary-container/50 rounded-full p-2 backdrop-blur-md">play_arrow</span>`;
                    }
                }

                // Assign random idle animation (0, 1, or 2) to each item based on its index
                const idleAnimClass = `idle-anim-${displayIndex % 3}`;

                // Atur background teks judul, jadikan transparan khusus untuk photography
                let textBgClass = 'bg-gradient-to-t from-background/90 to-transparent';
                let textShadowClass = '';
                if (sheet.category === 'photography') {
                    textBgClass = 'bg-transparent';
                    textShadowClass = 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'; // Tambahkan bayangan kuat agar teks tetap terbaca di foto terang
                }

                allHtml += `
                        <div class="portfolio-item ${colSpan} glow-hover cursor-pointer group ${idleAnimClass}" data-category="${sheet.category}" data-sub-category="${normalizedSubCat}" style="view-transition-name: p-item-${displayIndex}" ${onClickAttr}>
                            <div class="card-image-wrapper ${heightClass} relative flex items-center justify-center overflow-hidden rounded-3xl shadow-xl">
                                <img alt="${title}" class="absolute inset-0 w-full h-full ${objectFit} ${opacityClass}" src="${thumbnail}">
                                ${playIcon}
                                <div class="absolute bottom-0 left-0 w-full p-4 ${textBgClass} z-10 pointer-events-none transition-opacity duration-300">
                                    <span class="text-label-caps font-label-caps text-secondary-container ${textShadowClass}">${sheet.label}</span>
                                    <h3 class="text-headline-md font-headline-md text-white text-lg ${textShadowClass}">${title}</h3>
                                </div>
                            </div>
                        </div>`;

                displayIndex++;
            }
        } catch (e) {
            console.error("Error loading sheet", sheet.label, e);
        }
    }

    container.innerHTML = allHtml;

    // Terapkan filter jika user sudah keburu klik salah satu kategori sebelum loading selesai
    if (window.activePortfolioCategory) {
        const items = container.querySelectorAll('.portfolio-item');
        items.forEach(item => {
            if (item.getAttribute('data-category') === window.activePortfolioCategory) {
                item.classList.remove('hidden-item');
            } else {
                item.classList.add('hidden-item');
            }
        });
    }
}

// 3D Tilt Effect on Hover
function init3DTiltEffect() {
    const container = document.getElementById('portfolio-grid');
    if (!container) return;

    container.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.portfolio-item');
        if (!card) return;

        // Hanya terapkan jika ini card foto/portfolio, dan perangkat punya mouse (bukan touch)
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element.
        const y = e.clientY - rect.top;  // y position within the element.

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
        const rotateY = ((x - centerX) / centerX) * 10;

        // Terapkan ke elemen wrapper di dalam card (bukan cardnya langsung agar grid tidak rusak)
        const wrapper = card.querySelector('.card-image-wrapper');
        if (wrapper) {
            wrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.15, 1.15, 1.15)`;
            wrapper.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
            wrapper.style.boxShadow = '0 30px 60px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.1)';
            wrapper.style.zIndex = '10';
        }
    });

    container.addEventListener('mouseout', (e) => {
        const card = e.target.closest('.portfolio-item');
        if (!card) return;

        const wrapper = card.querySelector('.card-image-wrapper');
        if (wrapper) {
            wrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            wrapper.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease-out';
            wrapper.style.boxShadow = '';
            wrapper.style.zIndex = '1';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadDynamicPortfolio();
    init3DTiltEffect();
});

// Contact Form Logic (DITAMBAHKAN)
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah form reload halaman

    // Web3Forms Access Key
    const WEB3FORMS_ACCESS_KEY = "98575b28-2d5a-4801-b2ac-553aed8220bd";

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "MENGIRIM...";
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);
    formData.append("access_key", WEB3FORMS_ACCESS_KEY);

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            alert('Terima kasih! Pesan Anda berhasil terkirim langsung ke email saya.');
            contactForm.reset();
        } else {
            console.error("Web3Forms Error:", data);
            alert('Maaf, terjadi kesalahan. Pastikan Access Key sudah benar!');
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert('Gagal mengirim pesan. Silakan periksa koneksi internet Anda.');
    } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Global Modal Logic
window.openImageModal = function (imgUrl, title, category, description) {
    document.getElementById('modal-image-img').src = imgUrl;
    const titleEl = document.getElementById('modal-image-title');
    if (titleEl) titleEl.textContent = title;

    const catEl = document.getElementById('modal-image-cat');
    if (catEl) catEl.textContent = category;

    const descEl = document.getElementById('modal-image-desc');
    if (descEl) {
        descEl.textContent = description || '';
    }
    openModal('modal-image');
};

function openVideoModal(encodedUrl) {
    const videoUrl = decodeURIComponent(encodedUrl);
    const iframe = document.getElementById('portfolio-video');
    if (iframe) {
        // Deteksi YouTube
        const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        // Deteksi Vimeo
        const vimeoMatch = videoUrl.match(/vimeo\.com\/(?:.*#|.*\/videos\/)?([0-9]+)/);
        // Deteksi Google Drive
        const gDriveMatch = videoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);

        if (ytMatch && ytMatch[1]) {
            iframe.className = "w-full h-full outline-none bg-black rounded-lg";
            iframe.src = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
        } else if (vimeoMatch && vimeoMatch[1]) {
            iframe.className = "w-full h-full outline-none bg-black rounded-lg";
            iframe.src = `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
        } else if (gDriveMatch && gDriveMatch[1]) {
            // Terapkan crop khusus Google Drive untuk menyembunyikan tombol popout asli
            iframe.className = "absolute top-[-60px] left-0 w-full h-[calc(100%+60px)] outline-none bg-black";
            iframe.src = `https://drive.google.com/file/d/${gDriveMatch[1]}/preview`;
        } else {
            // Fallback jika berupa MP4 URL langsung atau URL lainnya
            iframe.className = "w-full h-full outline-none bg-black rounded-lg";
            iframe.src = videoUrl;
        }
    }
    openModal('modal-video');
}

// Global Carousel Variables
let carouselImages = [];
let carouselTitles = [];
let currentCarouselIndex = 0;

window.openCarouselModal = function (titleRaw, encodedUrls, encodedDesc = '', encodedLink = '') {
    const rawStr = decodeURIComponent(encodedUrls);
    // Split berdasarkan koma atau baris baru (newline) dan bersihkan spasi
    const urls = rawStr.split(/[,\n]+/).map(u => u.trim()).filter(u => u !== '');

    // Split judul jika dipisahkan dengan koma atau baris baru
    const titles = titleRaw.split(/[,\n]+/).map(t => t.trim());

    if (urls.length === 0) return;

    // Ubah link Google Drive biasa menjadi link gambar beresolusi tinggi (lh3.googleusercontent)
    carouselImages = urls.map(url => {
        const gMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (gMatch && gMatch[1]) {
            return `https://lh3.googleusercontent.com/d/${gMatch[1]}=w1920`;
        }
        return url; // Biarkan jika bukan link gdrive
    });

    // Sesuaikan judul dengan masing-masing gambar
    carouselTitles = carouselImages.map((_, index) => {
        return titles[index] ? titles[index] : titles[0]; // Jika judul kurang, gunakan judul pertama
    });

    currentCarouselIndex = 0;

    const descEl = document.getElementById('carousel-desc');
    const linkEl = document.getElementById('carousel-link');
    const titleEl = document.getElementById('carousel-title');
    const container = document.getElementById('carousel-image-container');

    // Set text elements
    if (titleEl && carouselTitles.length > 0) {
        titleEl.textContent = carouselTitles[0];
    }

    if (encodedDesc) {
        const descStr = decodeURIComponent(encodedDesc);
        descEl.textContent = descStr;
        descEl.classList.remove('hidden');
    } else {
        descEl.classList.add('hidden');
    }

    if (encodedLink) {
        const linkStr = decodeURIComponent(encodedLink);
        linkEl.href = linkStr;
        linkEl.classList.remove('hidden');
    } else {
        linkEl.classList.add('hidden');
    }

    // Populate images into scrolling container
    if (container) {
        container.innerHTML = '';
        carouselImages.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.className = 'w-full h-auto object-cover max-w-[1200px] drop-shadow-2xl';
            img.loading = 'lazy';
            container.appendChild(img);
        });
        container.scrollTop = 0; // reset scroll position
    }

    openModal('modal-carousel');
};

function openModal(modalId) {
    window.luminaAudio?.playSfxOpen();
    const modal = document.getElementById(modalId);
    const content = modal.querySelector('.modal-content');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.style.opacity = '0';
    modal.style.transition = 'opacity 0.4s ease';
    content.style.opacity = '0';
    content.style.transform = 'scale(0.95)';
    setTimeout(() => {
        modal.style.opacity = '1';
        content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        content.style.opacity = '1';
        content.style.transform = 'scale(1)';
    }, 10);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}


function closeModal(modalId) {
    window.luminaAudio?.playSfxClose();
    const modal = document.getElementById(modalId);
    const content = modal.querySelector('.modal-content');

    // Keluar dari mode full screen jika sedang aktif
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        // Reset ikon fullscreen
        const icon = document.getElementById('fullscreen-icon');
        if (icon) icon.textContent = 'fullscreen';
    }

    // Logika untuk menghentikan pemutaran video saat modal ditutup
    if (modalId === 'modal-video') {
        const video = document.getElementById('portfolio-video');
        if (video) {
            if (video.tagName.toLowerCase() === 'video') {
                video.pause();
            } else if (video.tagName.toLowerCase() === 'iframe') {
                const tempSrc = video.src;
                video.src = '';
                video.src = tempSrc;
            }
        }
    }

    modal.style.transition = 'opacity 0.4s ease';
    modal.style.opacity = '0';
    content.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    content.style.opacity = '0';
    content.style.transform = 'scale(0.95)';
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';

        // Reset Carousel saat ditutup
        if (modalId === 'modal-carousel') {
            const container = document.getElementById('carousel-image-container');
            if (container) container.innerHTML = '';
            carouselImages = [];
        }
    }, 400);
}
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        ['modal-image', 'modal-video', 'modal-game', 'modal-carousel'].forEach(id => {
            const modal = document.getElementById(id);
            if (!modal.classList.contains('hidden')) { closeModal(id); }
        });
    }
});

// ----------------------------------------------------
// THREE.JS 3D MONOLITH HERO SECTION
// ----------------------------------------------------
function initThreeJS() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // antialias untuk pinggiran halus

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimasi performa
    container.appendChild(renderer.domElement);

    // Tambahkan Cahaya agar 3D terlihat halus dan nyata
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 15);
    scene.add(directionalLight);

    const isDarkMode = document.documentElement.classList.contains('dark');

    // Palet Warna Pastel/Earthy/Ocean
    window.darkNeonColors = [0x7dd3fc, 0x5eead4, 0x0284c7, 0x818cf8, 0x0369a1]; // Deep Ocean
    window.lightNeonColors = [0xe6bca6, 0xa3b19b, 0xd6cfc7, 0xe29785, 0x766a66]; // Light Pastel

    const activeColors = isDarkMode ? window.darkNeonColors : window.lightNeonColors;

    // Generate tekstur radial halus untuk efek Glow
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const context = glowCanvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    // Shared materials
    window.sharedMaterialsSolid = [];
    window.sharedMaterialsGlow = [];

    for (let i = 0; i < 5; i++) {
        // Gunakan Lambert Material agar ada interaksi cahaya 3D yang halus
        window.sharedMaterialsSolid.push(new THREE.MeshLambertMaterial({
            color: activeColors[i],
            transparent: true,
            opacity: 0.95
        }));

        // Material Sprite untuk efek Glow (Halus bersinar)
        window.sharedMaterialsGlow.push(new THREE.SpriteMaterial({
            map: glowTexture,
            color: activeColors[i],
            transparent: true,
            opacity: isDarkMode ? 0.8 : 0.5,
            blending: isDarkMode ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthWrite: false, // Agar tidak menutupi bentuk utama
            depthTest: false // Mencegah glitch terpotong tajam oleh bentuk 3D lain
        }));
    }

    function createShape(geometry, x, y, z, scale) {
        const colorIndex = Math.floor(Math.random() * 5);

        const root = new THREE.Group();

        // Mesh Utama
        const mesh = new THREE.Mesh(geometry, window.sharedMaterialsSolid[colorIndex]);

        // Sprite Glow (Aura melingkar lembut yang selalu menghadap kamera)
        const glow = new THREE.Sprite(window.sharedMaterialsGlow[colorIndex]);
        // Perbesar aura agar menutupi objek 3D
        glow.scale.set(3.5, 3.5, 3.5);

        root.add(mesh);
        root.add(glow);

        root.position.set(x, y, z);
        root.scale.set(scale, scale, scale);

        // Simpan posisi awal untuk animasi floating dan parallax
        root.userData = {
            baseX: x,
            baseY: y,
            baseZ: z,
            floatSpeed: Math.random() * 1.5 + 0.5,
            floatOffset: Math.random() * Math.PI * 2,
            rotSpeedX: (Math.random() - 0.5) * 0.005,
            rotSpeedY: (Math.random() - 0.5) * 0.005,
            parallaxFactor: Math.random() * 1.5 + 0.2 // Seberapa kuat merespons kursor
        };

        scene.add(root);
        shapes.push(root);
        return root;
    }

    const shapes = [];
    const isMobile = window.innerWidth < 768;

    // Tentukan penyebaran posisi berdasarkan perangkat
    const spreadX = isMobile ? 8 : 25;
    const spreadY = isMobile ? 12 : 15;

    // Kumpulan Geometri (Bentuk Campuran dengan Mesh Smooth)
    const geometries = [
        new THREE.BoxGeometry(1.2, 1.2, 1.2), // Kubus
        new THREE.TetrahedronGeometry(1.2),   // Segitiga/Piramida
        new THREE.SphereGeometry(0.8, 32, 32), // Bola (Smooth)
        new THREE.TorusGeometry(0.8, 0.3, 32, 64), // Donat (Smooth)
        new THREE.CylinderGeometry(0.6, 0.6, 1.5, 32) // Tabung (Smooth)
    ];

    // Buat 20 objek tersebar
    for (let i = 0; i < 20; i++) {
        const geo = geometries[Math.floor(Math.random() * geometries.length)];
        const x = (Math.random() - 0.5) * spreadX;
        const y = (Math.random() - 0.5) * spreadY;
        // Kedalaman sangat variatif: ada yang dekat (-2) ada yang jauh banget (-25)
        const z = -2 - Math.random() * 23;
        const scale = Math.random() * 0.8 + 0.5;
        shapes.push(createShape(geo, x, y, z, scale));
    }

    // Floating Animation Setup
    const clock = new THREE.Clock();

    // Mouse Interaction Setup (sangat halus)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Scroll Interaction Setup
    let scrollY = 0;
    let targetScrollY = 0;

    // Gunakan document body agar merespons di seluruh halaman
    document.addEventListener('mousemove', (event) => {
        // Konversi ke koordinat -1 sampai 1
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Pantau pergerakan scroll
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    });

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Lerp target pergerakan mouse (Parallax movement yang sangat halus)
        targetX += (mouseX - targetX) * 0.02; // Angka 0.02 membuat pergerakan sangat natural/lambat
        targetY += (mouseY - targetY) * 0.02;

        // Lerp untuk scroll parallax (agar sangat smooth tidak kaku saat di-scroll)
        scrollY += (targetScrollY - scrollY) * 0.05;

        // Animasi setiap objek
        shapes.forEach((shape, index) => {
            const data = shape.userData;

            // Rotasi alami perlahan
            shape.rotation.x += data.rotSpeedX;
            shape.rotation.y += data.rotSpeedY;

            // Efek melayang (floating up and down)
            const floatY = Math.sin(time * data.floatSpeed + data.floatOffset) * 0.5;

            // Pergerakan mengikuti mouse (Parallax)
            const parallaxX = targetX * data.parallaxFactor;
            const parallaxY = targetY * data.parallaxFactor;

            // Efek Scroll Parallax (objek bergerak ke atas dengan kecepatan berbeda saat discroll)
            // Objek yang lebih dekat (Z lebih kecil negatifnya) bergerak lebih cepat
            const scrollParallaxY = (scrollY * 0.005) * (data.parallaxFactor * 1.5);

            // Terapkan posisi akhir
            shape.position.x = data.baseX + parallaxX;
            shape.position.y = data.baseY + floatY + parallaxY + scrollParallaxY;

            // Tambahkan rotasi reaktif terhadap mouse
            shape.rotation.x += (targetY * 0.01);
            shape.rotation.y += (targetX * 0.01);
        });

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
}

// Inisialisasi Three.js setelah DOM dimuat
document.addEventListener('DOMContentLoaded', initThreeJS);

// ----------------------------------------------------
// HERO TEXT & BACKGROUND INTERACTIVE (PARALLAX)
// ----------------------------------------------------
const heroText = document.getElementById('hero-main-text');
const heroBg = document.getElementById('hero-bg-image');

if (heroText || heroBg) {
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

        if (heroText) {
            heroText.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            const shadowX = xAxis * 2;
            const shadowY = yAxis * 2;

            // Sesuaikan warna bayangan dengan tema
            if (document.documentElement.classList.contains('dark')) {
                // Neon biru & ungu untuk Dark Mode
                heroText.style.textShadow = `${shadowX}px ${shadowY}px 20px rgba(0, 102, 255, 0.4), ${-shadowX}px ${-shadowY}px 30px rgba(188, 19, 254, 0.3)`;
            } else {
                // Warna pastel hangat (Terracotta & Sage) untuk Light Mode
                heroText.style.textShadow = `${shadowX}px ${shadowY}px 20px rgba(211, 124, 104, 0.25), ${-shadowX}px ${-shadowY}px 30px rgba(163, 177, 155, 0.25)`;
            }
        }
    });

    // Parallax saat scroll khusus untuk background
    window.addEventListener('scroll', () => {
        if (heroBg) {
            const scrollOffset = window.scrollY * 0.3; // Kecepatan scroll parallax
            // Tetap pertahankan transform dari CSS awal lalu tambahkan translateY
            heroBg.style.transform = `scale(1.1) translateY(${scrollOffset}px)`;
        }
    });

    // Reset saat mouse keluar
    document.addEventListener('mouseleave', () => {
        if (heroText) {
            heroText.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
            heroText.style.textShadow = 'none';
        }
    });
}

// ----------------------------------------------------
// THEME SWITCHER LOGIC
// ----------------------------------------------------
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const themeKnob = document.getElementById('theme-toggle-knob');
const html = document.documentElement;

function applyThemeUI(isDark) {
    if (isDark) {
        if (themeIcon) {
            themeIcon.textContent = 'dark_mode';
            themeIcon.style.transform = 'rotate(-360deg)';
            themeIcon.style.color = '#ffffff'; // Ikon putih
        }
        if (themeKnob) {
            themeKnob.style.transform = 'translateX(0px)';
            themeKnob.style.backgroundColor = '#3b82f6'; // Biru pekat (Bulan)
        }
        if (window.sharedMaterialsSolid && window.darkNeonColors) {
            for (let i = 0; i < 5; i++) {
                window.sharedMaterialsSolid[i].color.setHex(window.darkNeonColors[i]);
                if (window.sharedMaterialsGlow) {
                    window.sharedMaterialsGlow[i].color.setHex(window.darkNeonColors[i]);
                    window.sharedMaterialsGlow[i].blending = THREE.AdditiveBlending;
                    window.sharedMaterialsGlow[i].opacity = 0.8;
                }
            }
        }
    } else {
        if (themeIcon) {
            themeIcon.textContent = 'light_mode';
            themeIcon.style.transform = 'rotate(360deg)';
            themeIcon.style.color = '#1a1a1a'; // Ikon gelap
        }
        if (themeKnob) {
            themeKnob.style.transform = 'translateX(32px)';
            themeKnob.style.backgroundColor = '#facc15'; // Kuning cerah (Matahari)
        }
        if (window.sharedMaterialsSolid && window.lightNeonColors) {
            for (let i = 0; i < 5; i++) {
                window.sharedMaterialsSolid[i].color.setHex(window.lightNeonColors[i]);
                if (window.sharedMaterialsGlow) {
                    window.sharedMaterialsGlow[i].color.setHex(window.lightNeonColors[i]);
                    window.sharedMaterialsGlow[i].blending = THREE.NormalBlending;
                    window.sharedMaterialsGlow[i].opacity = 0.5;
                }
            }
        }
    }

    // Update Aurora colors on theme change
    if (typeof window.updateAuroraColors === 'function') {
        window.updateAuroraColors(isDark);
    }
}

// Cek Local Storage pada awal load
if (localStorage.getItem('theme') === 'light') {
    html.classList.remove('dark');
    applyThemeUI(false);
} else if (localStorage.getItem('theme') === 'dark') {
    html.classList.add('dark');
    applyThemeUI(true);
} else {
    // Default load
    applyThemeUI(html.classList.contains('dark'));
}

if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
        window.luminaAudio?.playSfxClick();
        const x = e.clientX;
        const y = e.clientY;

        // Hitung radius maksimal untuk menyapu seluruh layar dari titik klik
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        html.style.setProperty('--click-x', `${x}px`);
        html.style.setProperty('--click-y', `${y}px`);
        html.style.setProperty('--click-r', `${endRadius}px`);

        const toggleLogic = () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            applyThemeUI(isDark);
        };

        // Gunakan View Transitions API jika didukung browser
        if (document.startViewTransition) {
            html.classList.add('theme-transitioning');
            const transition = document.startViewTransition(toggleLogic);
            transition.finished.finally(() => {
                html.classList.remove('theme-transitioning');
            });
        } else {
            toggleLogic();
        }
    });
}

// ----------------------------------------------------
// TYPEWRITER EFFECT (HERO TEXT)
// ----------------------------------------------------
const typewriterElement = document.getElementById('typewriter-text');
if (typewriterElement) {
    let phrases = [];
    let phraseIndex = 0;
    let isDeleting = true;
    let isPaused = true;
    let typeWriterTimeout;

    window.updateTypewriterPhrases = function (instantUpdate = false) {
        let oldTotalLength = 0;
        if (phrases.length > 0) {
            oldTotalLength = phrases[phraseIndex].prefix.length + phrases[phraseIndex].highlight.length;
        }

        if (currentLang === 'id') {
            phrases = [
                { prefix: "Dimana cahaya dan aliran ", highlight: "Menciptakan Dunia Baru" },
                { prefix: "Bercerita lewat ", highlight: "Karya" },
                { prefix: "Menciptakan ruang ", highlight: "Nyaman" },
                { prefix: "Berbagi ide & ", highlight: "Inspirasi" }
            ];
        } else {
            phrases = [
                { prefix: "Where light and motion ", highlight: "Craft New World" },
                { prefix: "Telling stories through ", highlight: "Art" },
                { prefix: "Creating comfortable ", highlight: "Spaces" },
                { prefix: "Sharing ideas & ", highlight: "Inspiration" }
            ];
        }

        if (instantUpdate && oldTotalLength > 0) {
            const currentPhrase = phrases[phraseIndex];
            const newTotalLength = currentPhrase.prefix.length + currentPhrase.highlight.length;

            // Menghitung rasio pengetikan agar status animasi tetap sama
            const ratio = charIndex / oldTotalLength;
            charIndex = Math.round(ratio * newTotalLength);

            // Update the display immediately without resetting animation state
            if (charIndex <= currentPhrase.prefix.length) {
                typewriterElement.innerHTML = currentPhrase.prefix.substring(0, charIndex);
            } else {
                const highlightChars = charIndex - currentPhrase.prefix.length;
                typewriterElement.innerHTML = `${currentPhrase.prefix}<br><span class="text-primary">${currentPhrase.highlight.substring(0, highlightChars)}</span>`;
            }
        }
    };

    updateTypewriterPhrases();

    // Start fully typed for the first phrase
    let charIndex = phrases[0].prefix.length + phrases[0].highlight.length;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        const totalLength = currentPhrase.prefix.length + currentPhrase.highlight.length;

        if (!isPaused) {
            if (isDeleting) charIndex--;
            else charIndex++;
        }

        if (charIndex <= currentPhrase.prefix.length) {
            typewriterElement.innerHTML = currentPhrase.prefix.substring(0, charIndex);
        } else {
            const highlightChars = charIndex - currentPhrase.prefix.length;
            typewriterElement.innerHTML = `${currentPhrase.prefix}<br><span class="text-primary">${currentPhrase.highlight.substring(0, highlightChars)}</span>`;
        }

        let typingSpeed = isDeleting ? 40 : 80;

        if (!isPaused) {
            if (!isDeleting && charIndex === totalLength) {
                isPaused = true;
                // Tunggu 3 detik sebelum mulai menghapus
                typeWriterTimeout = setTimeout(() => { isPaused = false; isDeleting = true; typeWriter(); }, 3000);
                return;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 500; // Jeda sejenak sebelum mulai mengetik kata baru
            }
        }

        typeWriterTimeout = setTimeout(typeWriter, typingSpeed);
    }

    // Memulai siklus pertama setelah delay 3 detik
    typeWriterTimeout = setTimeout(() => {
        isPaused = false;
        typeWriter();
    }, 3000);
}

// ----------------------------------------------------
// 3D SPIRAL HELIX CAROUSEL
// ----------------------------------------------------
class SpiralCarousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        this.cards = Array.from(this.container.querySelectorAll('.spiral-card'));
        this.totalCards = this.cards.length;

        // Progress and scrolling
        this.progress = 0;
        this.baseSpeed = 0.0004; // Diperlambat dari 0.001 agar idle lebih elegan
        this.speed = this.baseSpeed;
        this.targetSpeed = this.baseSpeed;
        this.scrollOffset = 0;
        this.currentScrollOffset = 0;

        // Settings
        this.rotations = 2; // Berapa kali melilit dalam satu putaran penuh
        this.totalHeight = window.innerWidth < 768 ? 900 : 1200; // Diperbesar agar kartu ter-render hingga ke luar layar
        this.radius = window.innerWidth < 768 ? 90 : 320; // Dikurangi drastis di mobile agar tidak terpotong (clipping)

        // Entrance Animation State
        this.isEntering = false;
        this.entranceStartTime = 0;
        this.entranceDuration = 1400; // 1.4 seconds total entrance time (dipercepat dari 2.5s)

        this.init();
    }

    triggerEntrance() {
        this.isEntering = true;
        this.entranceStartTime = performance.now();
        // Reset rotasi awal sedikit mundur agar putarannya dramatis
        this.progress = -0.15;
    }

    init() {
        const overlay = document.getElementById('portfolio-overlay');
        if (!overlay) return;

        // Hanya pause animasi idle jika user menyorot (hover) sebuah kartu spesifik
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.targetSpeed = 0);
            card.addEventListener('mouseleave', () => this.targetSpeed = this.baseSpeed);
        });

        let touchStartY = 0;
        let touchStartX = 0;

        overlay.addEventListener('touchstart', (e) => {
            if (window.portfolioViewMode !== 'spiral' || !document.getElementById('category-content-view').classList.contains('hidden')) return;
            this.targetSpeed = 0;
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        overlay.addEventListener('touchmove', (e) => {
            if (window.portfolioViewMode === 'spiral' && document.getElementById('category-content-view').classList.contains('hidden')) {
                const deltaY = touchStartY - e.touches[0].clientY;
                const deltaX = touchStartX - e.touches[0].clientX;

                // Gunakan pergerakan terjauh (vertikal atau horizontal) untuk memutar
                const delta = Math.abs(deltaY) > Math.abs(deltaX) ? deltaY : deltaX;
                this.scrollOffset += delta * 0.0015; // Sensitivitas swipe

                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;

                // Cegah scroll halaman / pull-to-refresh jika swiping di dalam carousel
                e.preventDefault();
            }
        }, { passive: false });

        overlay.addEventListener('touchend', () => {
            this.targetSpeed = this.baseSpeed;
        });

        // Memungkinkan scroll untuk memutar untaian DNA dari bagian mana saja di overlay
        overlay.addEventListener('wheel', (e) => {
            // Hanya cegah scroll dan putar spiral JIKA sedang di mode spiral dan tidak membuka detail
            if (window.portfolioViewMode === 'spiral' && document.getElementById('category-content-view').classList.contains('hidden')) {
                e.preventDefault(); // Mencegah overlay ikut scroll
                this.scrollOffset += e.deltaY * 0.001; // Tambahkan ke scrollOffset spiral
            }
        }, { passive: false });

        window.addEventListener('resize', () => {
            this.totalHeight = window.innerWidth < 768 ? 900 : 1200;
            this.radius = window.innerWidth < 768 ? 90 : 320;
        });

        this.animate();
    }

    animate(currentTime) {
        if (!currentTime) currentTime = performance.now();

        if (window.portfolioViewMode === 'grid') {
            // Hentikan kalkulasi transform 3D saat mode grid
            this.cards.forEach(card => {
                card.style.transform = '';
                card.style.opacity = '';
                card.style.filter = '';
                card.style.pointerEvents = '';
            });
            requestAnimationFrame((t) => this.animate(t));
            return;
        }

        // Hitung progres global entrance animation
        let entranceGlobalProgress = 1;
        if (this.isEntering) {
            entranceGlobalProgress = (currentTime - this.entranceStartTime) / this.entranceDuration;
            if (entranceGlobalProgress >= 1) {
                entranceGlobalProgress = 1;
                this.isEntering = false;
            }
        }

        // Interpolasi kecepatan putaran otomatis (smooth stop/start)
        this.speed += (this.targetSpeed - this.speed) * 0.05;
        this.progress += this.speed;

        // Interpolasi scroll manual (biar licin/smooth)
        this.currentScrollOffset += (this.scrollOffset - this.currentScrollOffset) * 0.05;

        // Total pergerakan adalah gabungan putaran otomatis + putaran scroll
        let totalProgress = this.progress + this.currentScrollOffset;

        // Memastikan nilai selalu berada di rentang 0 hingga 1 dengan aman
        // Menghindari glitch nilai negatif saat di-scroll cepat ke atas
        totalProgress = (totalProgress % 1 + 1) % 1;

        // Ambil palet warna dari 3D Monolith berdasarkan tema saat ini
        const isDark = document.documentElement.classList.contains('dark');
        const lightColorsRGB = ['230, 188, 166', '163, 177, 155', '214, 207, 199', '226, 151, 133', '118, 106, 102'];
        const darkColorsRGB = ['125, 211, 252', '94, 234, 212', '2, 132, 199', '129, 140, 248', '3, 105, 161'];
        const activeColors = isDark ? darkColorsRGB : lightColorsRGB;

        this.cards.forEach((card, i) => {
            // Pasang warna glow spesifik untuk kartu ini
            card.style.setProperty('--glow-rgb', activeColors[i % activeColors.length]);

            // Staggered Entrance Progress (tiap kartu masuk bergantian)
            let cardEntranceProgress = 1;
            if (this.isEntering) {
                // Jeda (stagger) berdasarkan urutan index kartu
                // Kartu terakhir mulai masuk pada 40% dari total durasi entrance
                let staggerDelay = (i / this.totalCards) * 0.4;
                let normalizedTime = entranceGlobalProgress - staggerDelay;
                let durationMultiplier = 1 / 0.6; // Masing-masing kartu butuh 60% dari total durasi

                cardEntranceProgress = Math.max(0, Math.min(1, normalizedTime * durationMultiplier));
                // Ease Out Quart: Melambat secara mulus di akhir
                cardEntranceProgress = 1 - Math.pow(1 - cardEntranceProgress, 4);
            }

            // Posisi di sepanjang garis helix (0 sampai 1)
            let normalizedI = (i / this.totalCards + totalProgress) % 1;

            // Konversi ke posisi Y (Atas ke Bawah)
            let baseY = (normalizedI - 0.5) * this.totalHeight;
            let y = baseY;

            // Konversi ke Rotasi (Sudut)
            let baseAngle = normalizedI * 360 * this.rotations;
            let angle = baseAngle;

            let extraScale = 1;

            // Terapkan efek entrance
            if (this.isEntering) {
                // Terbang dari bawah: Y ditambah 800px dan perlahan naik
                y = baseY + (1 - cardEntranceProgress) * 800;
                // Berputar masuk: Tambahan putaran 180 derajat
                angle = baseAngle + (1 - cardEntranceProgress) * 180;
                // Membesar: Mulai dari skala 0
                extraScale = cardEntranceProgress;
            }

            card.style.transform = `translate(-50%, -50%) translateY(${y}px) rotateY(${angle}deg) translateZ(${this.radius}px) scale(${extraScale})`;

            // Perhitungan Opasitas untuk memudarkan kartu di ujung atas dan bawah (Off-screen fade)
            let edgeDist = Math.abs(normalizedI - 0.5) * 2; // 0 di tengah, 1 di ujung
            let opacity = 1;
            // Memudar secara organik saat kartu mulai keluar dari pandangan layar (y > 450)
            if (edgeDist > 0.75) {
                opacity = Math.max(0, 1 - (edgeDist - 0.75) * 4); // Cepat memudar hingga 0 di ujung ekstrim
            }
            if (this.isEntering) {
                opacity = Math.max(0, opacity * cardEntranceProgress);
            }
            card.style.opacity = Math.max(0, opacity);

            // Perhitungan kedalaman (menghadap ke depan atau belakang)
            // Gunakan baseAngle agar perhitungan shadow/filter sesuai dengan posisi aslinya
            let rad = baseAngle * (Math.PI / 180);
            let facing = Math.cos(rad);

            // Perbaikan CSS 3D Stacking: Atur Z-Index berdasarkan posisi Z agar browser merender urutan yang benar
            card.style.zIndex = Math.round(facing * 1000) + 1000;

            if (facing < 0 || opacity < 0.1 || cardEntranceProgress < 0.1) {
                card.style.pointerEvents = 'none'; // Tidak bisa diklik kalau membelakangi layar atau transparan
                let blurAmount = Math.abs(facing) * 6; // Kartu makin ke belakang makin blur (max 6px)
                card.style.filter = `brightness(${0.3 + (facing + 1) * 0.35}) blur(${blurAmount}px)`;
            } else {
                card.style.pointerEvents = 'auto'; // Bisa diklik saat menghadap layar
                card.style.filter = 'brightness(1) blur(0px)';
            }
        });

        requestAnimationFrame((t) => this.animate(t));
    }
}

// ----------------------------------------------------
// SCROLL REVEAL ANIMATION
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // Menghilangkan kelas agar kembali beranimasi saat discroll ulang
                entry.target.classList.remove('is-visible');
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Memicu animasi ketika elemen sudah masuk 100px ke dalam layar
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Inisialisasi 3D Spiral Carousel
    window.spiralCarousel = new SpiralCarousel('category-selection-view');
});

// ----------------------------------------------------
// FULLSCREEN API LOGIC
// ----------------------------------------------------
window.toggleFullScreen = function (elementId) {
    const elem = document.getElementById(elementId);
    const icon = document.getElementById('fullscreen-icon');

    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen().catch(err => console.error(err));
        } else if (elem.webkitRequestFullscreen) { /* Safari */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE11 */
            elem.msRequestFullscreen();
        }
        if (icon) icon.textContent = 'fullscreen_exit';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        if (icon) icon.textContent = 'fullscreen';
    }
};

// Update icon if user exits fullscreen using Esc key
document.addEventListener('fullscreenchange', () => {
    const icon = document.getElementById('fullscreen-icon');
    if (icon) {
        icon.textContent = document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
    }
});

// ----------------------------------------------------
// PORTFOLIO VIEW TOGGLE LOGIC
// ----------------------------------------------------
window.portfolioViewMode = 'spiral';

window.togglePortfolioView = function (mode) {
    if (window.portfolioViewMode === mode) return;
    window.luminaAudio?.playSfxClick();

    const container = document.getElementById('category-selection-view');
    const stage = document.getElementById('spiral-stage');
    const btnSpiral = document.getElementById('btn-view-spiral');
    const btnGrid = document.getElementById('btn-view-grid');

    // 1. Animasi keluar (Fade out & Scale down)
    container.style.opacity = '0';
    container.style.transform = 'scale(0.95)';

    setTimeout(() => {
        window.portfolioViewMode = mode;

        if (mode === 'spiral') {
            btnSpiral.className = 'text-primary flex items-center gap-1.5 transition-colors border-b-2 border-primary pb-0.5';
            btnGrid.className = 'text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors border-b-2 border-transparent hover:border-outline-variant pb-0.5';

            // Restoring the full-screen flex classes for spiral
            container.className = 'relative w-full flex-grow group transition-all duration-500 flex items-center justify-center';
            container.style.perspective = '1500px';

            // Hapus mask CSS agar kartu bebas melayang melewati Navigation Bar
            container.style.maskImage = 'none';
            container.style.webkitMaskImage = 'none';

            stage.className = 'absolute w-0 h-0 transition-all duration-500';
            stage.style.transformStyle = 'preserve-3d';

            // Disable scrollbar for spiral mode
            document.getElementById('portfolio-overlay').style.overflowY = 'hidden';

            document.querySelectorAll('.spiral-card').forEach(card => {
                card.classList.add('transition-none'); // KUNCI UTAMA: Cegah flying animation
                card.classList.add('absolute', 'w-[75vw]', 'max-w-[240px]', 'h-40', 'md:max-w-none', 'md:w-96', 'md:h-64', '-translate-x-1/2', '-translate-y-1/2', 'rounded-[40px]', 'md:rounded-[60px]');
                card.classList.remove('relative', 'w-full', 'aspect-[4/3]', 'rounded-3xl', 'hover:scale-105', 'hover:-translate-y-3', 'hover:z-[60]', 'transition-all');
                card.querySelector('.bg-gradient-to-r').classList.remove('hidden');
            });

            setTimeout(() => {
                if (window.portfolioViewMode === 'spiral') {
                    document.querySelectorAll('.spiral-card').forEach(card => {
                        card.classList.remove('transition-none');
                        card.classList.add('transition-[box-shadow,border-color]');
                    });
                }
            }, 50);

            // Trigger ulang animasi masuk spiral
            if (window.spiralCarousel) {
                window.spiralCarousel.triggerEntrance();
            }
        } else {
            btnSpiral.className = 'text-on-surface-variant hover:text-on-surface flex items-center gap-1.5 transition-colors border-b-2 border-transparent hover:border-outline-variant pb-0.5';
            btnGrid.className = 'text-primary flex items-center gap-1.5 transition-colors border-b-2 border-primary pb-0.5';

            // Grid layout classes
            container.className = 'relative w-full flex-grow py-8 transition-all duration-500';
            container.style.perspective = 'none';

            // Matikan efek mask agar scroll grid normal
            container.style.maskImage = 'none';
            container.style.webkitMaskImage = 'none';

            stage.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-all duration-500 w-full';
            stage.style.transformStyle = 'flat';

            // Enable scrollbar for grid mode
            document.getElementById('portfolio-overlay').style.overflowY = 'auto';

            document.querySelectorAll('.spiral-card').forEach(card => {
                card.classList.add('transition-none'); // KUNCI UTAMA: Cegah flying animation
                card.classList.remove('absolute', 'w-[75vw]', 'max-w-[240px]', 'h-40', 'md:max-w-none', 'md:w-96', 'md:h-64', '-translate-x-1/2', '-translate-y-1/2', 'rounded-[40px]', 'md:rounded-[60px]', 'transition-[box-shadow,border-color]');
                // Pasang class grid & hover DITAMBAH TANPA animasi transisi dulu
                card.classList.add('relative', 'w-full', 'aspect-[4/3]', 'rounded-3xl', 'hover:scale-105', 'hover:-translate-y-3', 'hover:z-[60]');
                card.querySelector('.bg-gradient-to-r').classList.add('hidden'); // Hilangkan lengkungan shadow
            });

            // Tunda pemberian efek transition agar penempatan awal grid tidak ter-animasi secara chaos
            setTimeout(() => {
                if (window.portfolioViewMode === 'grid') {
                    document.querySelectorAll('.spiral-card').forEach(card => {
                        card.classList.remove('transition-none');
                        card.classList.add('transition-all');
                    });
                }
            }, 50);
        }

        // 2. Animasi masuk (Fade in & Scale normal)
        requestAnimationFrame(() => {
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
        });

    }, 300); // Tunggu animasi keluar selesai (300ms)
}
// Global Game Modal Variables
let gameImages = [];
let currentGameIndex = 0;

window.openGameModal = function (titleRaw, encodedUrls, encodedDesc = '', encodedLink = '') {
    const rawStr = decodeURIComponent(encodedUrls);
    const urls = rawStr.split(/[,\n]+/).map(u => u.trim()).filter(u => u !== '');

    if (urls.length === 0) return;

    gameImages = urls.map(url => {
        const gMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (gMatch && gMatch[1]) {
            return `https://lh3.googleusercontent.com/d/${gMatch[1]}=w1920`;
        }
        return url;
    });

    currentGameIndex = 0;

    const prevBtn = document.getElementById('game-prev');
    const nextBtn = document.getElementById('game-next');
    const titleEl = document.getElementById('modal-game-title');
    const descEl = document.getElementById('modal-game-desc');
    const linkEl = document.getElementById('modal-game-link');

    if (gameImages.length > 1) {
        prevBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    } else {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    }

    titleEl.textContent = titleRaw;

    if (encodedDesc) {
        const descStr = decodeURIComponent(encodedDesc);
        descEl.textContent = descStr;
    } else {
        descEl.textContent = '';
    }

    if (encodedLink) {
        const linkStr = decodeURIComponent(encodedLink);
        linkEl.href = linkStr;
        linkEl.classList.remove('hidden');
    } else {
        linkEl.classList.add('hidden');
    }

    updateGameDisplay();
    openModal('modal-game');
};

let gameDisplayTimeout;

function updateGameDisplay() {
    const imgEl = document.getElementById('modal-game-img');
    if (!imgEl || gameImages.length === 0) return;

    if (gameDisplayTimeout) clearTimeout(gameDisplayTimeout);

    imgEl.style.opacity = '0.3';
    gameDisplayTimeout = setTimeout(() => {
        imgEl.src = gameImages[currentGameIndex];
        imgEl.onload = () => {
            imgEl.style.opacity = '1';
        };
    }, 150);
}

window.prevGameImage = function () {
    if (gameImages.length <= 1) return;
    currentGameIndex = (currentGameIndex - 1 + gameImages.length) % gameImages.length;
    updateGameDisplay();
};

window.nextGameImage = function () {
    if (gameImages.length <= 1) return;
    currentGameIndex = (currentGameIndex + 1) % gameImages.length;
    updateGameDisplay();
};

// ----------------------------------------------------
// INTERACTIVE PROFILE LOGIC
// ----------------------------------------------------
let isProfileExpanded = false;

window.toggleProfile = function () {
    const container = document.getElementById('interactive-profile');
    const avatar = document.getElementById('profile-avatar');
    const imgs = document.querySelectorAll('#profile-img-light, #profile-img-dark');
    const hint = document.getElementById('profile-hint');
    const content = document.getElementById('profile-content');
    const text1 = document.getElementById('profile-text-1');
    const text2 = document.getElementById('profile-text-2');

    isProfileExpanded = !isProfileExpanded;

    if (isProfileExpanded) {
        window.luminaAudio?.playSfxOpen();
        
        // Expand container
        container.classList.remove('max-w-xs', 'md:max-w-md');
        container.classList.add('max-w-7xl');

        // Avatar changes
        avatar.classList.remove('w-64', 'h-64', 'md:w-80', 'md:h-80', 'rounded-[50%]');
        avatar.classList.add('w-48', 'h-48', 'md:w-80', 'md:h-80', 'rounded-[10%]', 'md:rounded-[8%]');

        // Image changes (Full color)
        imgs.forEach(img => {
            img.classList.remove('grayscale', 'group-hover:grayscale-[50%]');
            img.classList.add('grayscale-0');
        });

        // Hide hint
        hint.classList.add('opacity-0');
        setTimeout(() => hint.classList.add('hidden'), 300);

        // Show content container
        content.classList.remove('w-0', 'opacity-0');
        content.classList.add('w-full', 'opacity-100');

        // Staggered text reveal
        setTimeout(() => {
            text1.classList.remove('opacity-0', 'translate-y-8');
        }, 300);

        setTimeout(() => {
            text2.classList.remove('opacity-0', 'translate-y-8');
        }, 500);

    } else {
        window.luminaAudio?.playSfxClose();
        
        // Hide text immediately
        text1.classList.add('opacity-0', 'translate-y-8');
        text2.classList.add('opacity-0', 'translate-y-8');

        // Hide content container
        content.classList.remove('w-full', 'opacity-100');
        content.classList.add('w-0', 'opacity-0');

        // Show hint
        hint.classList.remove('hidden');
        setTimeout(() => hint.classList.remove('opacity-0'), 50);

        // Avatar changes
        avatar.classList.remove('w-48', 'h-48', 'md:w-80', 'md:h-80', 'rounded-[10%]', 'md:rounded-[8%]');
        avatar.classList.add('w-64', 'h-64', 'md:w-80', 'md:h-80', 'rounded-[50%]');

        // Image changes (Grayscale)
        setTimeout(() => {
            imgs.forEach(img => {
                img.classList.remove('grayscale-0');
                img.classList.add('grayscale', 'group-hover:grayscale-[50%]');
            });
        }, 500);

        // Collapse container
        setTimeout(() => {
            container.classList.remove('max-w-7xl');
            container.classList.add('max-w-xs', 'md:max-w-md');
        }, 300);
    }
};

// ----------------------------------------------------
// MARQUEE SELECTION REVEAL INTRO
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const introOverlay = document.getElementById('intro-overlay');
    const textWrapper = document.getElementById('intro-text-wrapper');
    const selectionBox = document.getElementById('intro-selection-box');
    const fakeCursor = document.getElementById('intro-fake-cursor');

    if (!introOverlay || !selectionBox || !textWrapper) return;

    // Wait slightly before calculating to ensure layout is ready
    setTimeout(() => {
        // 1. Get Text Wrapper bounding box
        const rect = textWrapper.getBoundingClientRect();

        // 2. Set Initial State (Bottom-Right point of the wrapper)
        // By setting right and bottom, when width/height increase, it grows towards top-left
        selectionBox.style.bottom = `${window.innerHeight - rect.bottom}px`;
        selectionBox.style.right = `${window.innerWidth - rect.right}px`;
        selectionBox.style.top = 'auto';
        selectionBox.style.left = 'auto';
        selectionBox.style.width = '0px';
        selectionBox.style.height = '0px';
        selectionBox.style.opacity = '1';
        selectionBox.style.transition = 'all 2s cubic-bezier(0.85, 0, 0.15, 1)';

        textWrapper.style.opacity = '1';
        textWrapper.style.clipPath = 'inset(100% 0% 0% 100%)'; // Clip from bottom-right (cut top and left)
        textWrapper.style.transition = 'clip-path 2s cubic-bezier(0.85, 0, 0.15, 1)';

        // 3. Start the Marquee Reveal Animation
        setTimeout(() => {
            // Expand Selection Box
            selectionBox.style.width = `${rect.width}px`;
            selectionBox.style.height = `${rect.height}px`;

            // Reveal Masked Text
            textWrapper.style.clipPath = 'inset(0% 0% 0% 0%)';

            // 4. End of Animation (Hold, Blink, then Fade smoothly)
            setTimeout(() => {
                // Fake cursor clicks and fades out
                fakeCursor.style.transition = 'all 0.4s ease';
                fakeCursor.style.transform = 'translate(-15px, -15px) scale(0.8)'; // pull away slightly
                fakeCursor.style.opacity = '0';

                // Box blinks like a selection confirming
                setTimeout(() => {
                    selectionBox.style.transition = 'opacity 0.2s';
                    selectionBox.style.opacity = '0';
                    setTimeout(() => selectionBox.style.opacity = '1', 150);
                    setTimeout(() => selectionBox.style.opacity = '0', 300);

                    // Smooth swipe up of the entire overlay
                    setTimeout(() => {
                        introOverlay.style.transition = 'transform 1s cubic-bezier(0.85, 0, 0.15, 1), opacity 1.5s ease-in-out';
                        introOverlay.style.transform = 'translateY(-100%)';
                        introOverlay.style.opacity = '0'; // Optional: fade it out as it swipes

                        // Wait for swipe up to almost finish before triggering website entrance
                        setTimeout(() => {
                            const entranceElements = document.querySelectorAll('.entrance-element');
                            entranceElements.forEach(el => {
                                const delay = el.getAttribute('data-entrance-delay') || 0;
                                setTimeout(() => {
                                    // Add smooth transition
                                    el.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
                                    // Remove initial hiding and blur classes, set to active
                                    el.classList.remove('opacity-0', '-translate-y-full', 'translate-y-[80px]', 'translate-y-[40px]', 'scale-110', 'blur-xl');
                                    el.classList.add('opacity-100', 'translate-y-0', 'scale-100', 'blur-0');
                                }, parseInt(delay));
                            });
                        }, 800); // Trigger just as the curtain is about to fully clear the screen

                        setTimeout(() => {
                            document.body.classList.remove('overflow-hidden');
                            introOverlay.style.display = 'none';
                        }, 1200); // Wait for the swipe to finish
                    }, 500); // Wait 0.5s after blinking
                }, 400);
            }, 2200); // Wait for the drag transition to finish
        }, 500); // Delay before starting the drag
    }, 100); // Initial DOM layout delay
});



