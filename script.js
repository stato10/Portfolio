// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const body = document.body;

if (navToggle && navMenu) {
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        body.classList.toggle('nav-active');
});

// Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.classList.remove('nav-active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.classList.remove('nav-active');
        }
    });
}

// Smooth scrolling for anchor links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(250, 250, 250, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'rgba(250, 250, 250, 0.95)';
        navbar.style.boxShadow = 'none';
        }
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Form submission handling
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple form validation
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            alert('Message sent successfully! I\'ll get back to you soon.');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Creative Portfolio Animations and Interactions

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.style.getPropertyValue('--delay') || '0s';
            
            setTimeout(() => {
                entry.target.classList.add('animated');
            }, parseFloat(delay) * 1000);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Enhanced smooth scrolling with proper navbar offset
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Calculate proper offset for sticky navbar
                const header = document.querySelector('.header');
                const topTagline = document.querySelector('.top-tagline');
                const headerHeight = header ? header.offsetHeight : 0;
                const taglineHeight = topTagline ? topTagline.offsetHeight : 0;
                const totalOffset = headerHeight + taglineHeight + 20; // Extra 20px breathing room
                
                // Add fun bouncing effect
                target.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    target.style.transform = 'scale(1)';
                }, 200);
                
                // Calculate target position with offset
                const targetPosition = target.offsetTop - totalOffset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Parallax effect for hero section
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const rate = scrolled * -0.3;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Dynamic skill tag interactions
function initSkillTagAnimations() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        // Add staggered animation delay
        tag.style.setProperty('--delay', `${index * 0.05}s`);
        
        // Add click effect
        tag.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Add random color pulse on hover
        tag.addEventListener('mouseenter', function() {
            const colors = ['#f0f8ff', '#f8f0ff', '#f0fff8', '#fff8f0'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.style.backgroundColor = randomColor;
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

// Project cards hover effects
function initProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
}

// Portrait floating animation
function initPortraitAnimation() {
    const portrait = document.querySelector('.about-portrait');
    
    if (portrait) {
        setInterval(() => {
            portrait.style.animation = 'float 3s ease-in-out infinite';
        }, 100);
    }
}

// Enhanced navigation with active states and proper offset detection
function initNavigationEffects() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const header = document.querySelector('.header');
        const topTagline = document.querySelector('.top-tagline');
        const headerHeight = header ? header.offsetHeight : 0;
        const taglineHeight = topTagline ? topTagline.offsetHeight : 0;
        const totalOffset = headerHeight + taglineHeight + 50; // Buffer for active detection
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Check if section is in viewport considering navbar offset
            if (scrollY >= (sectionTop - totalOffset) && 
                scrollY < (sectionTop + sectionHeight - totalOffset)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Fun cursor trail effect
function initCursorEffects() {
    const trail = [];
    const maxTrail = 10;
    
    document.addEventListener('mousemove', (e) => {
        trail.push({ x: e.clientX, y: e.clientY });
        
        if (trail.length > maxTrail) {
            trail.shift();
        }
        
        // Remove existing trail dots
        document.querySelectorAll('.cursor-trail').forEach(dot => dot.remove());
        
        // Create new trail dots
        trail.forEach((point, index) => {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: ${6 - index * 0.5}px;
                height: ${6 - index * 0.5}px;
                background: #666;
                border-radius: 50%;
                pointer-events: none;
                left: ${point.x}px;
                top: ${point.y}px;
                opacity: ${(maxTrail - index) / maxTrail * 0.5};
                z-index: 9999;
                transition: all 0.1s ease;
            `;
            document.body.appendChild(dot);
        });
    });
}

// Social links enhanced effects
function initSocialLinksEffects() {
    const socialLinks = document.querySelectorAll('.social-links a');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Stato Nickname Interactive Features
function initStatoInteractions() {
    const statoNickname = document.querySelector('.stato-nickname');
    if (statoNickname) {
        // Add special letter-by-letter animation on hover
        statoNickname.addEventListener('mouseenter', function() {
            this.innerHTML = '<span>s</span><span>t</span><span>a</span><span>t</span><span>o</span>';
            const letters = this.querySelectorAll('span');
            letters.forEach((letter, index) => {
                letter.style.display = 'inline-block';
                letter.style.animationDelay = `${index * 0.1}s`;
                letter.style.animation = 'letterBounce 0.6s ease';
            });
        });
        
        statoNickname.addEventListener('mouseleave', function() {
            this.innerHTML = 'stato';
        });
        
        // Add click effect
        statoNickname.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 1s ease';
            }, 10);
        });
    }
}

// Smart navbar auto-hide functionality - disappear BEFORE reaching brand section
function initSmartNavbar() {
    const header = document.querySelector('.header');
    const statoBrand = document.querySelector('.stato-brand');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (statoBrand) {
            const statoBrandTop = statoBrand.offsetTop;
            const headerHeight = header.offsetHeight;
            const preHideOffset = 50; // Reduced offset to hide navbar closer to brand section
            
            // Hide navbar when entering the brand section
            if (scrollTop >= (statoBrandTop - headerHeight - preHideOffset)) {
                header.classList.add('header-hidden');
                header.classList.remove('header-visible');
            } else {
                // Show navbar when above brand section
                header.classList.remove('header-hidden');
                header.classList.add('header-visible');
            }
        }
    });
}

// Add special "stato" brand section scroll effects
function initStatoBrandEffects() {
    const statoBrand = document.querySelector('.stato-brand');
    if (statoBrand) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            const background = statoBrand.querySelector('::before');
            if (background) {
                background.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize all interactive features
    initSmoothScrolling();
    initParallaxEffects();
    initSkillTagAnimations();
    initProjectCardEffects();
    initPortraitAnimation();
    initNavigationEffects();
    initCursorEffects();
    initSocialLinksEffects();
    initStatoInteractions();
    initStatoBrandEffects();
    initSmartNavbar();
    
    // Add loading animation
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Add CSS for active navigation state and stato animations
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: #000 !important;
        font-weight: 400;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    body.loaded * {
        transition: all 0.3s ease !important;
    }
    
    .hero {
        transition: transform 0.1s ease-out !important;
    }
    
    @keyframes letterBounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }
    
    .stato-nickname span {
        display: inline-block;
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(style);

// Typing effect for hero text (optional enhancement)
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Cursor trail effect (optional enhancement)
let cursor = {
    x: 0,
    y: 0
};

document.addEventListener('mousemove', (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
});

// Theme toggle functionality (if you want to add dark mode later)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Load saved theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up Up Down Down Left Right Left Right B A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        // Easter egg activated!
        document.body.style.animation = 'rainbow 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);
    }
});

// Add rainbow animation to CSS dynamically
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        25% { filter: hue-rotate(90deg); }
        50% { filter: hue-rotate(180deg); }
        75% { filter: hue-rotate(270deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// Custom Cursor
(function() {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        // Grow cursor on interactive elements
        const hoverables = [
            'a', 'button', '.skill-tag', '.action-btn', '.stato-btn', '.project-card', '.nav-link', '.contact-link'
        ];
        hoverables.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
            });
        });
    }
})();

// Skill Tag Active State
(function() {
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            skillTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
        tag.addEventListener('mouseleave', function() {
            // Do not remove active on mouseleave, keep it until another is hovered
        });
        tag.addEventListener('click', function() {
            skillTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
})(); 