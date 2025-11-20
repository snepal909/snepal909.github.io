// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger icon
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Close mobile menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll effect to navbar and track scroll direction
let lastScroll = 0;
let scrollDirection = 'down';
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Determine scroll direction
    scrollDirection = currentScroll > lastScroll ? 'down' : 'up';
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Scroll to top on page refresh/reload
if (window.history.scrollRestoration) {
    window.history.scrollRestoration = 'manual';
}

// Scroll to top when page loads
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

// Also scroll to top on page show (handles back/forward navigation)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.scrollTo(0, 0);
    }
});

// Track previous intersection states for elements
const elementStates = new Map();

// Intersection Observer for fade-in/fade-out animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const element = entry.target;
        const rect = entry.boundingClientRect;
        const wasIntersecting = elementStates.get(element) || false;
        const isNowIntersecting = entry.isIntersecting;
        
        // Update state
        elementStates.set(element, isNowIntersecting);
        
        if (isNowIntersecting && !wasIntersecting) {
            // Element is entering viewport - fade in
            // Determine direction based on scroll direction
            if (scrollDirection === 'up') {
                // Scrolling up - element comes from above (negative translateY)
                // Set initial state
                element.style.transform = 'translateY(-20px)';
                element.style.opacity = '0';
                // Force a reflow to ensure initial state is applied
                void element.offsetHeight;
                // Animate to visible
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            } else {
                // Scrolling down - element comes from below (positive translateY)
                // Element should already be at translateY(20px) from initialization
                // Just animate to visible
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        } else if (!isNowIntersecting && wasIntersecting) {
            // Element is leaving viewport - fade out
            if (rect.top < 0) {
                // Element is above viewport - fade out upward
                element.style.opacity = '0';
                element.style.transform = 'translateY(-20px)';
            } else {
                // Element is below viewport - fade out downward
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
            }
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Also observe hero section for fade effect
const hero = document.querySelector('.hero');
if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    hero.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(hero);
}

// Handle profile image loading
const profileImg = document.getElementById('profile-img');
if (profileImg) {
    profileImg.addEventListener('error', function() {
        // If image fails to load, show a placeholder
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'profile-placeholder';
        placeholder.innerHTML = `
            <div style="width: 100%; max-width: 400px; aspect-ratio: 1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem; margin: 0 auto;">
                <p style="padding: 2rem; text-align: center;">Add your profile image as profile.jpg</p>
            </div>
        `;
        this.parentElement.appendChild(placeholder);
    });
}

// Image Modal functionality
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.querySelector('.image-modal-close');
const funstuffItems = document.querySelectorAll('.funstuff-item');

// Open modal when clicking on funstuff items
funstuffItems.forEach(item => {
    item.addEventListener('click', function() {
        const imageSrc = this.getAttribute('data-image');
        const caption = this.getAttribute('data-caption');
        
        modalImage.src = imageSrc;
        modalImage.alt = caption;
        modalCaption.textContent = caption;
        
        imageModal.classList.add('active');
        document.body.classList.add('modal-open');
    });
});

// Close modal when clicking the X button
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close modal when clicking outside the image
imageModal.addEventListener('click', function(e) {
    if (e.target === imageModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && imageModal.classList.contains('active')) {
        closeModal();
    }
});

function closeModal() {
    imageModal.classList.remove('active');
    document.body.classList.remove('modal-open');
}

