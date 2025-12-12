// Mobile Optimization Features

// 1. Touch Events Optimization
document.addEventListener('DOMContentLoaded', function () {
    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Add touch feedback
    const buttons = document.querySelectorAll('button, a[href]');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function () {
            this.classList.add('touch-active');
        });

        button.addEventListener('touchend', function () {
            this.classList.remove('touch-active');
        });
    });

    // Handle iOS viewport height
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    // Lazy load images if any
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Analytics for mobile interactions
    const trackEvents = {
        'menu_open': 'Menu aberto',
        'step_view': 'Passo visualizado',
        'result_preview': 'Prévia de resultado vista',
        'share_click': 'Compartilhamento clicado'
    };

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle back button for quiz
    if (window.location.pathname.includes('quiz.html')) {
        window.addEventListener('pageshow', function (event) {
            if (event.persisted) {
                // Page loaded from cache, reset if needed
                localStorage.removeItem('quizProgress');
            }
        });
    }

    // Battery saving features
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.saveData) {
            // Disable auto-playing videos if any
            // Reduce animation complexity
            document.body.classList.add('save-data');
        }
    }

    // Handle keyboard for mobile
    document.addEventListener('focusin', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            setTimeout(() => {
                e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    });
});

// 2. Performance Optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 3. Ad Management for Mobile
function loadAd(adElementId, adType) {
    const adElement = document.getElementById(adElementId);
    if (!adElement) return;

    // Only load ads on good connections
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            adElement.innerHTML = '<p class="ad-placeholder">Publicidade</p>';
            return;
        }
    }

    // Load ad based on screen size
    const screenWidth = window.innerWidth;
    let adSize;

    if (screenWidth < 768) {
        adSize = '320x50';
    } else if (screenWidth < 1024) {
        adSize = '728x90';
    } else {
        adSize = '970x250';
    }

    // Simulate ad load
    setTimeout(() => {
        adElement.innerHTML = `
            <div class="ad-loaded">
                <ins class="adsbygoogle"
                     style="display:block"
                     data-ad-client="ca-pub-XXXXXX"
                     data-ad-slot="XXXXXX"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>
        `;
        (adsbygoogle = window.adsbygoogle || []).push({});
    }, 1000);
}

// 4. Mobile Share Functionality
function shareOnWhatsApp() {
    const text = encodeURIComponent("Descobri meu perfil político no Politicômetro BR! Faça você também:");
    const url = encodeURIComponent(window.location.href);
    window.open(`whatsapp://send?text=${text}%20${url}`, '_blank');
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

// 5. Handle App-like Experience
if (window.matchMedia('(display-mode: standalone)').matches) {
    document.body.classList.add('standalone');
}

// 6. Preload next page for better UX
function preloadPage(url) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
}

// Preload quiz page when user hovers over CTA
const startButton = document.getElementById('startQuiz');
if (startButton) {
    startButton.addEventListener('touchstart', () => {
        preloadPage('quiz.html');
    });
}