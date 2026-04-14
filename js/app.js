// d:\Vibe\浩子网站\js\app.js

document.addEventListener('DOMContentLoaded', () => {

    // 0. Splash Preloader Logic
    const preloader = document.getElementById('site-preloader');
    if (preloader) {
        // Prevent scrolling while loading
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';

        const hidePreloader = () => {
            preloader.classList.add('expand');
            setTimeout(() => {
                preloader.style.display = 'none';
                document.documentElement.style.overflow = '';
                document.body.style.overflow = '';
            }, 1000); // 1s wait for explosive outward animation
        };
        
        // Speed up the minimum wait time to feel fast and snappy
        const minLoadingTime = new Promise(resolve => setTimeout(resolve, 600));
        const pageLoad = new Promise(resolve => {
            if (document.readyState === 'complete') resolve();
            else window.addEventListener('load', resolve);
        });

        Promise.all([minLoadingTime, pageLoad]).then(hidePreloader)
               .catch(() => setTimeout(hidePreloader, 1000)); // Fallback
    }

    // 1. Header Scroll Effect
    const header = document.getElementById('site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Intersection Observer for 'Reveal Up' Animations
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Unobserve after revealing once for performance
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Trigger initial reveal immediately for above the fold content
    setTimeout(() => {
        const heroReveals = document.querySelectorAll('#hero .reveal-up');
        heroReveals.forEach(el => el.classList.add('active'));
    }, 100);

    // 3. Parallax Effect on Hero
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollVal = window.scrollY;
            if (scrollVal < window.innerHeight) {
                // Subtle move down
                heroBg.style.transform = `translateY(${scrollVal * 0.4}px)`;
            }
        });
    }

    // 0.5. Inject Student Gallery (22 photos)
    const studentGalleryContainer = document.getElementById('student-gallery-container');
    if (studentGalleryContainer) {
        let galleryHtml = '';
        let pattern = [2, 1, 2, 2, 1, 2]; // 1 = full height item, 2 = two half height items
        let patternIdx = 0;
        let imgIdx = 1;

        const createOverlay = (i) => `
            <div class="item-overlay">
                <div class="item-info">
                    <h4>
                        <span class="lang lang-en">Student Work #${i}</span>
                        <span class="lang lang-zh">学生作品 #${i}</span>
                    </h4>
                    <p>
                        <span class="lang lang-en">Charlotte Art Studio</span>
                        <span class="lang lang-zh">Charlotte 原创艺术</span>
                    </p>
                </div>
            </div>
        `;

        const studentGalleryImages = [
            "student_art_1.jpg", "student_art_2.jpg", "student_art_3.jpg", 
            "student_art_4.jpg", "student_art_6.jpg", "student_art_7.jpg", 
            "student_art_9.jpg", "student_art_10.jpg", "student_art_11.jpg", 
            "student_art_12.jpg", "student_art_13.jpg", "student_art_14.jpg", 
            "student_art_15.jpg", "student_art_16.jpg", "student_art_17.jpg", 
            "student_art_18.jpg", "student_art_19.jpg", "student_art_20.jpg", 
            "student_art_22.jpg"
        ];
        
        let imgIdxArr = 0;

        while (imgIdxArr < studentGalleryImages.length) {
            let colSize = pattern[patternIdx % pattern.length];
            if (colSize === 2 && imgIdxArr + 1 >= studentGalleryImages.length) {
                colSize = 1; // single remaining image takes full height
            }

            galleryHtml += `<div class="marquee-column">`;
            if (colSize === 1) {
                let imgFile = studentGalleryImages[imgIdxArr++];
                let displayNum = imgFile.replace(/\D/g, ''); // Extract the numeric part for the overlay text
                galleryHtml += `
                    <div class="marquee-item item-large" onclick="openLightbox('assets/gallery/${imgFile}')">
                        <img src="assets/gallery/${imgFile}" alt="Student Artwork" loading="lazy">
                        ${createOverlay(displayNum)}
                    </div>`;
            } else {
                let imgFile1 = studentGalleryImages[imgIdxArr++];
                let imgFile2 = studentGalleryImages[imgIdxArr++];
                let displayNum1 = imgFile1.replace(/\D/g, '');
                let displayNum2 = imgFile2.replace(/\D/g, '');
                galleryHtml += `
                    <div class="marquee-item item-small" onclick="openLightbox('assets/gallery/${imgFile1}')">
                        <img src="assets/gallery/${imgFile1}" alt="Student Artwork" loading="lazy">
                        ${createOverlay(displayNum1)}
                    </div>`;
                galleryHtml += `
                    <div class="marquee-item item-small" onclick="openLightbox('assets/gallery/${imgFile2}')">
                        <img src="assets/gallery/${imgFile2}" alt="Student Artwork" loading="lazy">
                        ${createOverlay(displayNum2)}
                    </div>`;
            }
            galleryHtml += `</div>`;
            patternIdx++;
        }

        // Duplicate the html content to allow for seamless endless scrolling animation
        studentGalleryContainer.innerHTML = `<div class="portfolio-marquee-track" style="animation-duration: 50s; animation-direction: reverse;">${galleryHtml}${galleryHtml}</div>`;
    }

    // 4. Portfolio Horizontal Auto-scroll (Marquee)
    const portfolioMarqueeTrack = document.querySelector('.portfolio-marquee-track');
    if (portfolioMarqueeTrack) {
        const portfolioImages = [
            "assets/portfolio/1.jpg",
            "assets/portfolio/12.jpg",
            "assets/portfolio/2022粘土2-3.jpg",
            "assets/portfolio/3.jpg",
            "assets/portfolio/5.jpg",
            "assets/portfolio/6.jpg",
            "assets/portfolio/6.png",
            "assets/portfolio/7.jpg",
            "assets/portfolio/Chapter03_005.jpg",
            "assets/portfolio/Comic_004.jpg",
            "assets/portfolio/Illustration13.jpg",
            "assets/portfolio/Illustration3.jpg",
            "assets/portfolio/Illustration6.jpg"
        ];

        let marqueeHtml = '';
        let pattern = [1, 2, 1, 2, 2, 1]; // 1 = full height item, 2 = two half height items
        let patternIdx = 0;
        let imgIdx = 0;

        while (imgIdx < portfolioImages.length) {
            let colSize = pattern[patternIdx % pattern.length];
            if (colSize === 2 && imgIdx + 1 >= portfolioImages.length) {
                colSize = 1; // single remaining image takes full height
            }

            marqueeHtml += `<div class="marquee-column">`;
            if (colSize === 1) {
                let src = portfolioImages[imgIdx++];
                marqueeHtml += `<div class="marquee-item item-large"><img src="${src}" alt="Portfolio Artwork" loading="lazy" onclick="openLightbox('${src}')"></div>`;
            } else {
                let src1 = portfolioImages[imgIdx++];
                let src2 = portfolioImages[imgIdx++];
                marqueeHtml += `<div class="marquee-item item-small"><img src="${src1}" alt="Portfolio Artwork" loading="lazy" onclick="openLightbox('${src1}')"></div>`;
                marqueeHtml += `<div class="marquee-item item-small"><img src="${src2}" alt="Portfolio Artwork" loading="lazy" onclick="openLightbox('${src2}')"></div>`;
            }
            marqueeHtml += `</div>`;
            patternIdx++;
        }

        // Duplicate the html content to allow for seamless endless scrolling animation
        portfolioMarqueeTrack.innerHTML = marqueeHtml + marqueeHtml;
    }

    // 5. Music Toggle & Playlist Logic
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    // 播放列表配置：您可以随时增删这个数组里的歌曲路径
    const playlist = [
        'assets/bg_music_1.mp3',
        'assets/bg_music_2.mp3',
        'assets/bg_music_3.mp3'
    ];
    let currentTrackIndex = 0;

    if (musicBtn && bgMusic) {
        // 默认音量调小一点
        bgMusic.volume = 0.4;
        bgMusic.loop = false; // 关闭单曲循环，使用列表循环

        // 尝试播放
        const attemptPlay = () => {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicBtn.classList.add('playing');
            }).catch(err => {
                console.log("Audio auto-play prevented by browser:", err);
                isPlaying = false;
                musicBtn.classList.remove('playing');
            });
        };

        // 歌曲播放结束时，自动切换下一首
        bgMusic.addEventListener('ended', () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            bgMusic.src = playlist[currentTrackIndex];
            attemptPlay();
        });

        // 初始化第一首歌并尝试播放
        bgMusic.src = playlist[currentTrackIndex];
        attemptPlay();

        musicBtn.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                isPlaying = false;
                musicBtn.classList.remove('playing');
            } else {
                attemptPlay();
            }
        });
    }

    // 6. Language Toggle Logic
    const langToggleBtn = document.getElementById('lang-toggle');
    const htmlEl = document.documentElement;
    const inputsWithPlaceholders = document.querySelectorAll('input[data-en]');

    const applyLanguage = (lang) => {
        // 更新 html 标签属性，触发 CSS 切换
        htmlEl.setAttribute('data-lang', lang);
        localStorage.setItem('charlotte_lang', lang);
        
        // 更新表单的 placeholder
        inputsWithPlaceholders.forEach(input => {
            input.placeholder = input.getAttribute(`data-${lang}`);
        });

    };

    if (langToggleBtn) {
        // 初始化语言
        const savedLang = localStorage.getItem('charlotte_lang') || 'zh';
        applyLanguage(savedLang);

        // 绑定切换事件
        langToggleBtn.addEventListener('click', () => {
            const currentLang = htmlEl.getAttribute('data-lang');
            const newLang = currentLang === 'zh' ? 'en' : 'zh';
            applyLanguage(newLang);
        });
    }

    // 7. Lightbox Logic
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeLightboxBtns = document.querySelectorAll('.js-close-lightbox');

    window.openLightbox = (src) => {
        if (lightboxModal && lightboxImage) {
            lightboxImage.src = src;
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeLightbox = () => {
        if (lightboxModal) {
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            setTimeout(() => { if (lightboxImage) lightboxImage.src = ''; }, 300);
        }
    };

    if (closeLightboxBtns) {
        closeLightboxBtns.forEach(btn => btn.addEventListener('click', closeLightbox));
    }

    // Close lightbox on escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.getAttribute('aria-hidden') === 'false') {
            closeLightbox();
        }
    });

});
