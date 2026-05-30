// Navigation Scroll Spy
        const sections = document.querySelectorAll("section");
        const navLinks = document.querySelectorAll(".nav-link");
        window.addEventListener("scroll", () => {
            let current = "";
            sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                if (scrollY >= sectionTop - 100) { current = section.getAttribute("id"); }
            });
            navLinks.forEach((link) => {
                link.classList.remove("text-primary", "font-bold", "border-b-2", "border-primary", "pb-1");
                link.classList.add("text-on-surface-variant", "font-medium");
                if (link.getAttribute("href").includes(current)) {
                    link.classList.remove("text-on-surface-variant", "font-medium");
                    link.classList.add("text-primary", "font-bold", "border-b-2", "border-primary", "pb-1");
                }
            });
            const nav = document.getElementById('main-nav');
            if (window.scrollY > 50) {
                nav.classList.add('bg-surface/90', 'shadow-md');
                nav.classList.remove('bg-surface/80', 'shadow-sm');
            } else {
                nav.classList.remove('bg-surface/90', 'shadow-md');
                nav.classList.add('bg-surface/80', 'shadow-sm');
            }
        });

        // Mobile Menu Toggle
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
            const icon = mobileBtn.querySelector('span');
            icon.textContent = icon.textContent === 'menu' ? 'close' : 'menu';
        });
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                mobileBtn.querySelector('span').textContent = 'menu';
            });
        });

        // Portfolio Filter Logic (DITAMBAHKAN)
        const filterBtns = document.querySelectorAll('.filter-btn');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Hapus state aktif dari semua tombol
                filterBtns.forEach(b => {
                    b.classList.remove('text-primary', 'border-b', 'border-primary');
                    b.classList.add('text-on-surface-variant');
                });
                // Beri state aktif pada tombol yang diklik
                btn.classList.remove('text-on-surface-variant');
                btn.classList.add('text-primary', 'border-b', 'border-primary');

                const filter = btn.getAttribute('data-filter');
                
                // Fungsi logika untuk menyembunyikan/menampilkan item
                const filterLogic = () => {
                    const currentPortfolioItems = document.querySelectorAll('.portfolio-item');
                    currentPortfolioItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
                            item.classList.remove('hidden-item');
                        } else {
                            item.classList.add('hidden-item');
                        }
                    });
                };

                // Eksekusi dengan View Transitions API jika didukung untuk efek Fade-In mulus
                if (document.startViewTransition) {
                    document.startViewTransition(filterLogic);
                } else {
                    filterLogic();
                }
            });
        });

        // Google Sheets Dynamic Integration
        async function loadDynamicPortfolio() {
            const sheetId = '1anhPdL6etR7KwwtEUUj1ZYpO49EwIY6JYO76V4DX-p4';
            const sheets = [
                { gid: '0', category: 'motion', label: 'MOTION GRAPHICS' },
                { gid: '284798931', category: '3d', label: '3D MODELLING' },
                { gid: '1127387480', category: 'graphic', label: 'GRAPHIC DESIGN' }
            ];
            
            const container = document.getElementById('dynamic-portfolio-container');
            if(!container) return;
            container.innerHTML = '';
            
            let allHtml = '';
            let displayIndex = 0;

            for (const sheet of sheets) {
                const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${sheet.gid}`;
                try {
                    const response = await fetch(url);
                    const text = await response.text();
                    
                    const rows = text.split('\n').map(row => {
                        const regex = /(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|([^,]*))(?:,|$)/g;
                        let arr = [];
                        let match;
                        while (match = regex.exec(row)) {
                            arr.push(match[1] ? match[1].replace(/\"\"/g, '\"') : match[2]);
                            if (match.index === regex.lastIndex) regex.lastIndex++;
                        }
                        return arr;
                    }).filter(row => row.length > 1 && row[0].trim() !== '');
                    
                    for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        
                        const title = row[0] ? row[0].trim() : 'Untitled';
                        let thumbnail = (row[1] && row[1].trim() !== '') ? row[1].trim() : '';
                        let videoUrl = row[2] ? row[2].trim() : '';
                        
                        const thumbMatch = thumbnail.match(/\/d\/([a-zA-Z0-9_-]+)/);
                        if(thumbMatch && thumbMatch[1]) {
                            thumbnail = `https://lh3.googleusercontent.com/d/${thumbMatch[1]}=w800`;
                        }

                        let onClickAttr = '';
                        let playIcon = '';
                        let opacityClass = 'opacity-100'; 
                        
                        if (videoUrl) {
                            opacityClass = 'opacity-60 group-hover:opacity-80 transition-opacity';
                            onClickAttr = `onclick="openVideoModal('${encodeURIComponent(videoUrl)}')"`
                            playIcon = `<span class="material-symbols-outlined text-[48px] text-white z-10 bg-primary-container/50 rounded-full p-2 backdrop-blur-md">play_arrow</span>`;
                            
                            if (!thumbnail) {
                                const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
                                const gDriveMatch = videoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                                if (ytMatch && ytMatch[1]) {
                                    thumbnail = `https://img.youtube.com/vi/${ytMatch[1]}/maxresdefault.jpg`;
                                } else if (gDriveMatch && gDriveMatch[1]) {
                                    thumbnail = `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}=w800`;
                                }
                            }
                        } else {
                            let highResImage = row[1] ? row[1].trim() : '';
                            if(thumbMatch && thumbMatch[1]) highResImage = `https://lh3.googleusercontent.com/d/${thumbMatch[1]}=w1920`;
                            onClickAttr = `onclick="openImageModal('${highResImage}', '${title.replace(/'/g, "\\'")}', '${sheet.label}')"`;
                        }
                        
                        if(!thumbnail) thumbnail = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                        
                        const colSpan = displayIndex === 0 ? 'md:col-span-7' : (displayIndex % 3 === 0 ? 'md:col-span-8' : 'md:col-span-4');
                        const heightClass = displayIndex === 0 ? 'h-64 md:h-96' : 'h-64 md:h-80';
                        const iconSize = displayIndex === 0 ? 'text-[64px]' : 'text-[48px]';
                        
                        if (playIcon) {
                             playIcon = `<span class="material-symbols-outlined ${iconSize} text-white z-10 bg-primary-container/50 rounded-full p-2 backdrop-blur-md">play_arrow</span>`;
                        }
                        
                        allHtml += `
                        <div class="portfolio-item ${colSpan} bg-surface-container-low p-2 rounded-lg glow-hover cursor-pointer group" data-category="${sheet.category}" style="view-transition-name: p-item-${displayIndex}" ${onClickAttr}>
                            <div class="card-image-wrapper ${heightClass} relative flex items-center justify-center">
                                <img alt="${title}" class="absolute inset-0 w-full h-full object-cover ${opacityClass}" src="${thumbnail}">
                                ${playIcon}
                                <div class="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background/90 to-transparent z-10">
                                    <span class="text-label-caps font-label-caps text-secondary-container">${sheet.label}</span>
                                    <h3 class="text-headline-md font-headline-md text-on-surface text-lg">${title}</h3>
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
            
            const activeBtn = Array.from(filterBtns).find(btn => btn.classList.contains('text-primary'));
            if(activeBtn) {
                activeBtn.click();
            }
        }

        document.addEventListener('DOMContentLoaded', loadDynamicPortfolio);

        // Contact Form Logic (DITAMBAHKAN)
        const contactForm = document.getElementById('contact-form');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Mencegah form reload halaman
            alert('Terima kasih! Pesan Anda telah terkirim kepada Dwi Adyaksa.');
            contactForm.reset();
        });

        // Global Modal Logic
        window.openImageModal = function(imgUrl, title, category) {
            document.getElementById('modal-image-img').src = imgUrl;
            document.getElementById('modal-image-title').textContent = title;
            document.getElementById('modal-image-cat').textContent = category;
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
                    iframe.src = `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
                } else if (vimeoMatch && vimeoMatch[1]) {
                    iframe.src = `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
                } else if (gDriveMatch && gDriveMatch[1]) {
                    iframe.src = `https://drive.google.com/file/d/${gDriveMatch[1]}/preview`;
                } else {
                    // Fallback jika berupa MP4 URL langsung atau URL lainnya
                    iframe.src = videoUrl;
                }
            }
            openModal('modal-video');
        }

        function openModal(modalId) {
            const modal = document.getElementById(modalId);
            const content = modal.querySelector('.modal-content');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            content.style.opacity = '0';
            content.style.transform = 'scale(0.95)';
            setTimeout(() => {
                content.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                content.style.opacity = '1';
                content.style.transform = 'scale(1)';
            }, 10);
            document.body.style.overflow = 'hidden';
        }
        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            const content = modal.querySelector('.modal-content');
            
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

            content.style.opacity = '0';
            content.style.transform = 'scale(0.95)';
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }, 300);
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                ['modal-image', 'modal-video', 'modal-game'].forEach(id => {
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
            const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            
            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimasi performa
            container.appendChild(renderer.domElement);

            // Tentukan warna solid berdasarkan tema saat memuat pertama kali
            const isDarkMode = document.documentElement.classList.contains('dark');
            const initialSolidColor = isDarkMode ? 0x050505 : 0xffffff;
            window.sharedMaterialSolid = new THREE.MeshBasicMaterial({ color: initialSolidColor });

            // Palet Warna untuk Edges
            window.darkNeonColors = [0x00eefc, 0x39ff14, 0xbc13fe, 0xff7300, 0xccff00]; // Neon terang untuk Dark Mode
            window.lightNeonColors = [0x0054d6, 0x008800, 0x7700cc, 0xcc4400, 0x889900]; // Warna pekat untuk Light Mode
            
            const activeColors = isDarkMode ? window.darkNeonColors : window.lightNeonColors;

            // Shared materials untuk optimalisasi & sinkronisasi tema
            window.sharedWireframes = [];
            window.sharedGlows = [];
            for (let i = 0; i < 5; i++) {
                window.sharedWireframes.push(new THREE.LineBasicMaterial({ color: activeColors[i], transparent: true, opacity: 1.0 }));
                window.sharedGlows.push(new THREE.LineBasicMaterial({ color: activeColors[i], transparent: true, opacity: 0.3 }));
            }

            function createShape(geometry, x, y, z, scale) {
                const isWireframeOnly = Math.random() < 0.4; // 40% probabilitas tanpa face

                // Jika wireframe only, gunakan Group sebagai kontainer. Jika solid, gunakan Mesh.
                const root = isWireframeOnly 
                    ? new THREE.Group() 
                    : new THREE.Mesh(geometry, window.sharedMaterialSolid);
                
                // Pilih warna neon acak berdasarkan index
                const colorIndex = Math.floor(Math.random() * 5);
                
                const wireframe = new THREE.LineSegments(
                    new THREE.WireframeGeometry(geometry), 
                    window.sharedWireframes[colorIndex]
                );
                
                // Efek Neon Glow (wireframe kedua yang sedikit lebih besar)
                const glowWireframe = new THREE.LineSegments(
                    new THREE.WireframeGeometry(geometry), 
                    window.sharedGlows[colorIndex]
                );
                glowWireframe.scale.set(1.05, 1.05, 1.05);

                root.add(wireframe);
                root.add(glowWireframe);
                
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

            // Kumpulan Geometri untuk di-random
            const geometries = [
                new THREE.BoxGeometry(1.2, 1.2, 1.2),
                new THREE.TetrahedronGeometry(1.2),
                new THREE.SphereGeometry(0.8, 12, 12),
                new THREE.CylinderGeometry(0.6, 0.6, 1.5, 12),
                new THREE.CylinderGeometry(0.8, 0.8, 1.2, 6)
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
                const width = window.innerWidth;
                const height = window.innerHeight;
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
                    heroText.style.textShadow = `${shadowX}px ${shadowY}px 20px rgba(0, 102, 255, 0.4), ${-shadowX}px ${-shadowY}px 30px rgba(188, 19, 254, 0.3)`;
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
                if (window.sharedMaterialSolid) window.sharedMaterialSolid.color.setHex(0x050505);
                
                if (window.sharedWireframes && window.darkNeonColors) {
                    for (let i = 0; i < 5; i++) {
                        window.sharedWireframes[i].color.setHex(window.darkNeonColors[i]);
                        window.sharedGlows[i].color.setHex(window.darkNeonColors[i]);
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
                if (window.sharedMaterialSolid) window.sharedMaterialSolid.color.setHex(0xffffff);

                if (window.sharedWireframes && window.lightNeonColors) {
                    for (let i = 0; i < 5; i++) {
                        window.sharedWireframes[i].color.setHex(window.lightNeonColors[i]);
                        window.sharedGlows[i].color.setHex(window.lightNeonColors[i]);
                    }
                }
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
            const phrases = [
                { prefix: "VISUALIZING THE ", highlight: "FUTURE" },
                { prefix: "CRAFTING DIGITAL ", highlight: "EXPERIENCES" },
                { prefix: "ENGINEERING ", highlight: "TOMORROW" },
                { prefix: "DESIGNING BEYOND ", highlight: "REALITY" }
            ];
            
            let phraseIndex = 0;
            // Start fully typed for the first phrase
            let charIndex = phrases[0].prefix.length + phrases[0].highlight.length; 
            let isDeleting = true; 
            let isPaused = true;

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
                    typewriterElement.innerHTML = `${currentPhrase.prefix}<br><span class="text-primary-container">${currentPhrase.highlight.substring(0, highlightChars)}</span>`;
                }

                let typingSpeed = isDeleting ? 40 : 80;

                if (!isPaused) {
                    if (!isDeleting && charIndex === totalLength) {
                        isPaused = true;
                        // Tunggu 3 detik sebelum mulai menghapus
                        setTimeout(() => { isPaused = false; isDeleting = true; typeWriter(); }, 3000);
                        return;
                    } else if (isDeleting && charIndex === 0) {
                        isDeleting = false;
                        phraseIndex = (phraseIndex + 1) % phrases.length;
                        typingSpeed = 500; // Jeda sejenak sebelum mulai mengetik kata baru
                    }
                }

                setTimeout(typeWriter, typingSpeed);
            }
            
            // Memulai siklus pertama setelah delay 3 detik (karena teks pertama sudah tertulis statis di HTML)
            setTimeout(() => {
                isPaused = false;
                typeWriter();
            }, 3000);
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
        });
