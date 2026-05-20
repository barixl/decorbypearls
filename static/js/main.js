// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) loader.classList.add('hidden');
    }, 1600);
});

// Nav scroll
const nav = document.getElementById('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });
}

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Parallax
window.addEventListener('scroll', () => {
    const bg = document.getElementById('parallax-bg');
    if (!bg) return;
    const el = document.getElementById('parallax-el');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const speed = 0.35;
    bg.style.transform = `translateY(${-rect.top * speed}px)`;
});

// Counter animation
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const targetStr = el.textContent;
            const target = parseInt(targetStr);
            if (isNaN(target)) return;
            
            const suffix = targetStr.replace(/[0-9]/g, '');
            let current = 0;
            const step = target / 60;
            const timer = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = Math.floor(current) + suffix;
                if (current >= target) clearInterval(timer);
            }, 25);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));


// Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : 'initial';
    });

    // Close menu when clicking a link (or toggle dropdown on mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const parentLi = link.parentElement;
            if (window.innerWidth <= 1024 && parentLi.classList.contains('dropdown')) {
                e.preventDefault();
                parentLi.classList.toggle('active');
                return;
            }
            menuBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'initial';
            // Reset any open dropdowns
            navLinks.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        });
    });
}

// LIGHTBOX LOGIC
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

let currentGalleryImages = []; // Array of {src, alt}
let currentIndex = 0;

function openLightbox(images, index) {
    currentGalleryImages = images;
    currentIndex = index;
    updateLightbox();
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateLightbox() {
    if (!currentGalleryImages.length) return;
    const imageData = currentGalleryImages[currentIndex];
    lightboxImage.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImage.src = imageData.src;
        lightboxImage.alt = imageData.alt;
        lightboxImage.onload = () => {
            lightboxImage.style.opacity = '1';
        };
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentGalleryImages.length}`;
    }, 200);
}

function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = 'initial';
}

function nextImage() {
    currentIndex = (currentIndex + 1) % currentGalleryImages.length;
    updateLightbox();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateLightbox();
}

if (lightboxOverlay) {
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay || e.target.classList.contains('lightbox-wrapper')) {
            closeLightbox();
        }
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });
}

// Global listener for gallery items
document.addEventListener('click', (e) => {
    const galleryItem = e.target.closest('.gallery-item, .lightbox-enabled');
    if (galleryItem) {
        const img = galleryItem.tagName === 'IMG' ? galleryItem : galleryItem.querySelector('img');
        if (img) {
            const section = galleryItem.closest('section') || document.body;
            const selector = galleryItem.classList.contains('gallery-item') ? '.gallery-item img' : '.lightbox-enabled img, img.lightbox-enabled';
            const allGalleryItems = section.querySelectorAll(selector);
            
            let images = Array.from(allGalleryItems).map(i => ({
                src: i.src,
                alt: i.alt || ''
            }));
            
            if (!images.some(i => i.src === img.src)) {
                images = [{src: img.src, alt: img.alt || ''}];
            }
            
            const index = images.findIndex(i => i.src === img.src);
            openLightbox(images, index !== -1 ? index : 0);
        }
    }
});

// Scroll Top Functionality
const scrollTopBtn = document.getElementById('scroll-top');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
