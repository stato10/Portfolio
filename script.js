// Modern Navigation Toggle for Artist Design
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const body = document.body;

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        body.classList.toggle('nav-active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('nav-active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('nav-active');
        }
    });
}

// Enhanced smooth scrolling with proper navbar offset
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            // Calculate proper offset for sticky navbar
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const targetTop = target.offsetTop;
            const offsetTop = targetTop - navbarHeight - 20; // Extra padding
            
            console.log(`Navigating to ${targetId}:`);
            console.log(`- Target element:`, target);
            console.log(`- Target offsetTop: ${targetTop}px`);
            console.log(`- Navbar height: ${navbarHeight}px`);
            console.log(`- Final scroll position: ${Math.max(0, offsetTop)}px`);
            console.log(`- Current scroll position: ${window.pageYOffset}px`);
            console.log(`- Window height: ${window.innerHeight}px`);
            
            // Use a more precise calculation for different sections
            let finalScrollPosition;
            
            if (targetId === '#hero') {
                // For hero section, scroll to the very top
                finalScrollPosition = 0;
            } else {
                // For other sections, account for navbar and some padding
                const sectionPadding = 40; // Extra space for better visual separation
                finalScrollPosition = Math.max(0, targetTop - navbarHeight - sectionPadding);
            }
            
            console.log(`- Calculated final position: ${finalScrollPosition}px`);
            
            window.scrollTo({
                top: finalScrollPosition,
                behavior: 'smooth'
            });
            
            // Add temporary visual feedback
            target.style.transition = 'all 0.3s ease';
            target.style.transform = 'scale(1.01)';
            target.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
            
            setTimeout(() => {
                target.style.transform = 'scale(1)';
                target.style.boxShadow = 'none';
            }, 600);
            
            // Close mobile menu if open
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('nav-active');
            }
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current link
            if (this.classList.contains('nav-link')) {
                this.classList.add('active');
            }
            
            console.log(`Navigating to ${targetId}`);
        } else {
            console.warn(`Target element ${targetId} not found`);
        }
    });
});

// Modern navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.9)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }
});

// Modern active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
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

// Portfolio hover effects for artist design
document.addEventListener('DOMContentLoaded', () => {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.portfolio-overlay');
        const content = item.querySelector('.portfolio-content');
        const image = item.querySelector('.portfolio-image img');
        
        item.addEventListener('mouseenter', () => {
            if (overlay) overlay.style.opacity = '1';
            if (content) content.style.transform = 'translateY(0)';
            if (image) {
                image.style.transform = 'scale(1.1)';
                image.style.filter = 'grayscale(0%)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            if (overlay) overlay.style.opacity = '0';
            if (content) content.style.transform = 'translateY(30px)';
            if (image) {
                image.style.transform = 'scale(1)';
                image.style.filter = 'grayscale(100%)';
            }
        });
    });
    
    // Skills animation on scroll
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBars = entry.target.querySelectorAll('.skill-progress');
                    skillBars.forEach((bar, index) => {
                        setTimeout(() => {
                            const progress = bar.getAttribute('data-progress');
                            bar.style.width = progress + '%';
                        }, index * 200);
                    });
                    skillObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        skillObserver.observe(skillsSection);
    }
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


// Parallax effect for hero section
function initParallaxEffects() {
    function clearHeroTransformIfMobile() {
        const hero = document.querySelector('.hero');
        if (window.innerWidth <= 600 && hero) {
            hero.style.transform = '';
        }
    }
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        // Disable parallax on mobile
        if (window.innerWidth <= 600) {
            if (hero) hero.style.transform = '';
            return;
        }
        const rate = scrolled * -0.3;
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
    // Also clear on load and resize
    window.addEventListener('DOMContentLoaded', clearHeroTransformIfMobile);
    window.addEventListener('resize', clearHeroTransformIfMobile);
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
    // Only apply cursor effects on screens larger than 768px
    if (window.innerWidth <= 768) return;

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

    // Remove cursor effects when window is resized to mobile size
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.cursor-trail').forEach(dot => dot.remove());
        }
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

// Music Player Controls
(function() {
  const audio = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const progressBar = document.getElementById('progressBar');
  const muteBtn = document.getElementById('muteBtn');
  const muteIcon = document.getElementById('muteIcon');
  const unmuteIcon = document.getElementById('unmuteIcon');
  const musicOverlay = document.getElementById('musicOverlay');
  const musicOverlayBtn = document.getElementById('musicOverlayBtn');
  const silentOverlayBtn = document.getElementById('silentOverlayBtn');
  const musicPlayer = document.querySelector('.music-player');

  if (!audio || !playBtn || !playIcon || !pauseIcon || !progressBar || !muteBtn || !muteIcon || !unmuteIcon || !musicOverlay || !musicOverlayBtn || !silentOverlayBtn) return;

  // Show overlay on load
  musicOverlay.style.display = '';
  document.body.style.overflow = 'hidden';

  // Handle music option
  musicOverlayBtn.addEventListener('click', function() {
    audio.play().catch(() => {});
    playIcon.style.display = 'none';
    pauseIcon.style.display = '';
    musicOverlay.style.display = 'none';
    document.body.style.overflow = '';
    musicPlayer.style.display = 'flex';
  });

  // Handle silent option
  silentOverlayBtn.addEventListener('click', function() {
    musicOverlay.style.display = 'none';
    document.body.style.overflow = '';
    musicPlayer.style.display = 'none';
  });

  // Update play/pause button state based on audio state
  function updatePlayPauseButton() {
    if (audio.paused) {
      playIcon.style.display = '';
      pauseIcon.style.display = 'none';
    } else {
      playIcon.style.display = 'none';
      pauseIcon.style.display = '';
    }
  }

  // Listen for audio state changes
  audio.addEventListener('play', updatePlayPauseButton);
  audio.addEventListener('pause', updatePlayPauseButton);

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  muteBtn.addEventListener('click', () => {
    audio.muted = !audio.muted;
    muteIcon.style.display = audio.muted ? 'none' : '';
    unmuteIcon.style.display = audio.muted ? '' : 'none';
  });

  audio.addEventListener('ended', () => {
    playIcon.style.display = '';
    pauseIcon.style.display = 'none';
    progressBar.value = 0;
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      progressBar.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  progressBar.addEventListener('input', () => {
    if (audio.duration) {
      audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
  });
})();

// Fix navbar showing in the middle of the section on first load
window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  if (header) {
    header.classList.remove('header-hidden');
    header.classList.add('header-visible');
  }
});

// Contact Form Functionality
(function() {
    const contactModal = document.getElementById('contactModal');
    const contactForm = document.getElementById('contactForm');
    const closeModal = document.querySelector('.close-modal');
    const emailLink = document.querySelector('a[href^="mailto:"]');

    // Initialize EmailJS
    emailjs.init("SvUh9nfkU6oYoNIF9"); // Replace with your EmailJS public key

    // Open modal when clicking email link
    if (emailLink) {
        emailLink.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            contactModal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Remove any existing message
            const existingMessage = contactForm.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            try {
                const formData = {
                    name: contactForm.name.value,
                    email: contactForm.email.value,
                    subject: contactForm.subject.value,
                    message: contactForm.message.value
                };

                await emailjs.send(
                    "service_ju5loxj", // Replace with your EmailJS service ID
                    "template_6zg4au2", // Replace with your EmailJS template ID
                    formData
                );

                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-message success';
                successMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                contactForm.appendChild(successMessage);

                // Reset form
                contactForm.reset();

                // Close modal after 3 seconds
                setTimeout(() => {
                    contactModal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 3000);

            } catch (error) {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'form-message error';
                errorMessage.textContent = 'Failed to send message. Please try again later.';
                contactForm.appendChild(errorMessage);
            } finally {
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
})(); 

// ========================================
// 4K VIDEO QUALITY OPTIMIZATION
// ========================================

(function() {
    'use strict';
    
    // 4K Video Quality Optimization
    function optimize4KVideo() {
        const iframe = document.querySelector('.hero-video');
        if (iframe) {
            console.log('Optimizing video for 4K quality...');
            
            // Force high-resolution display properties
            iframe.style.imageRendering = 'high-quality';
            iframe.style.imageRendering = '-webkit-optimize-contrast';
            
            // Ensure 4K quality parameters are present
            let src = iframe.src;
            const qualityParams = [
                'vq=hd2160',
                'quality=hd2160', 
                'hd=1',
                'fmt=22'
            ];
            
            qualityParams.forEach(param => {
                if (!src.includes(param.split('=')[0])) {
                    src += src.includes('?') ? '&' : '?';
                    src += param;
                }
            });
            
            if (src !== iframe.src) {
                iframe.src = src;
                console.log('4K quality parameters added to video URL');
            }
            
            // Set optimal viewport for 4K display
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
                );
            }
            
            // Force hardware acceleration
            iframe.style.transform = 'translateZ(0) scale(1.02)';
            iframe.style.willChange = 'transform';
            iframe.style.backfaceVisibility = 'hidden';
            
            console.log('4K Video optimization completed');
        }
    }
    
    // Apply optimization immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimize4KVideo);
    } else {
        optimize4KVideo();
    }
    
    // Re-apply optimization after a delay to ensure iframe is fully loaded
    setTimeout(optimize4KVideo, 2000);
    setTimeout(optimize4KVideo, 5000);
    
    // Monitor video quality and re-optimize if needed
    setInterval(() => {
        const iframe = document.querySelector('.hero-video');
        if (iframe && !iframe.src.includes('vq=hd2160')) {
            console.log('Re-applying 4K optimization...');
            optimize4KVideo();
        }
    }, 10000);
    
})();

// ========================================
// NAVIGATION SCROLL SPY
// ========================================

(function() {
    'use strict';
    
    // Scroll spy for navigation
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        if (sections.length === 0 || navLinks.length === 0) return;
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    // Remove active class from all nav links
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                    });
                    
                    // Add active class to current nav link
                    const activeLink = document.querySelector(`.nav-link[href="#${currentId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
        
        console.log('Scroll spy initialized for navigation');
    }
    
    // Initialize scroll spy
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollSpy);
    } else {
        initScrollSpy();
    }
    
})();

// ========================================
// NAVIGATION TESTING & VALIDATION
// ========================================

(function() {
    'use strict';
    
    // Test all navigation links
    function validateNavigation() {
        console.log('🔍 NAVIGATION VALIDATION STARTED');
        console.log('=====================================');
        
        // Define expected navigation mappings
        const navigationMap = {
            'HOME': '#hero',
            'WORK': '#portfolio', 
            'ABOUT': '#about',
            'CONTACT': '#contact',
            'VIEW WORK': '#portfolio',
            'GET IN TOUCH': '#contact'
        };
        
        // Check navbar links
        console.log('📍 NAVBAR LINKS:');
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.textContent.trim();
            const href = link.getAttribute('href');
            const expectedHref = navigationMap[text];
            const targetExists = document.querySelector(href) !== null;
            
            console.log(`  ${text}: ${href} → ${targetExists ? '✅ Target exists' : '❌ Target missing'}`);
            if (expectedHref && href !== expectedHref) {
                console.warn(`    ⚠️  Expected ${expectedHref}, got ${href}`);
            }
        });
        
        // Check hero buttons
        console.log('📍 HERO BUTTONS:');
        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        heroButtons.forEach(button => {
            const text = button.textContent.trim();
            const href = button.getAttribute('href');
            const isExternal = href && (href.startsWith('http') || href.startsWith('//'));
            
            if (isExternal) {
                console.log(`  ${text}: ${href} → ✅ External link`);
            } else if (href && href.startsWith('#')) {
                const targetExists = document.querySelector(href) !== null;
                console.log(`  ${text}: ${href} → ${targetExists ? '✅ Target exists' : '❌ Target missing'}`);
                
                const expectedHref = navigationMap[text];
                if (expectedHref && href !== expectedHref) {
                    console.warn(`    ⚠️  Expected ${expectedHref}, got ${href}`);
                }
            } else {
                console.warn(`  ${text}: ${href} → ⚠️  Invalid link format`);
            }
        });
        
        // Check section positions
        console.log('📍 SECTION POSITIONS:');
        Object.values(navigationMap).forEach(sectionId => {
            const section = document.querySelector(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                const offsetTop = section.offsetTop;
                console.log(`  ${sectionId}: offsetTop=${offsetTop}px, visible=${rect.top < window.innerHeight && rect.bottom > 0}`);
            }
        });
        
        console.log('=====================================');
        console.log('🔍 NAVIGATION VALIDATION COMPLETED');
        
        return {
            navLinksValid: Array.from(navLinks).every(link => {
                const href = link.getAttribute('href');
                return href && document.querySelector(href) !== null;
            }),
            heroButtonsValid: Array.from(heroButtons).every(button => {
                const href = button.getAttribute('href');
                return href && (href.startsWith('http') || document.querySelector(href) !== null);
            })
        };
    }
    
    // Add click event testing
    function addNavigationTesting() {
        const allNavElements = document.querySelectorAll('a[href^="#"], .nav-link, .hero-buttons .btn[href^="#"]');
        
        allNavElements.forEach(element => {
            element.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const text = this.textContent.trim();
                
                console.log(`🖱️  Navigation clicked: "${text}" → ${href}`);
                
                // Let the normal navigation happen, then verify
                setTimeout(() => {
                    const target = document.querySelector(href);
                    if (target) {
                        const rect = target.getBoundingClientRect();
                        const navbar = document.querySelector('.navbar');
                        const navbarHeight = navbar ? navbar.offsetHeight : 80;
                        
                        console.log(`📍 Navigation result for ${href}:`);
                        console.log(`   - Target top: ${rect.top}px`);
                        console.log(`   - Navbar height: ${navbarHeight}px`);
                        console.log(`   - Is properly positioned: ${rect.top <= navbarHeight + 50 && rect.top >= -50}`);
                    }
                }, 1000);
            });
        });
    }
    
    // Initialize testing when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                validateNavigation();
                addNavigationTesting();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            const results = validateNavigation();
            addNavigationTesting();
            
            // Show validation results in console
            if (results.navLinksValid && results.heroButtonsValid) {
                console.log('✅ ALL NAVIGATION LINKS ARE WORKING CORRECTLY!');
            } else {
                console.warn('⚠️  Some navigation links may have issues. Check the details above.');
            }
        }, 1000);
    }
    
})();

// ========================================
// EMERGENCY BUTTON FIX & DEBUGGING
// ========================================

(function() {
    'use strict';
    
    console.log('🚨 EMERGENCY BUTTON FIX INITIALIZING...');
    
    console.log('✅ Navigation system ready!');
    
    // Force re-initialize all navigation after a delay
    function emergencyButtonFix() {
        console.log('🔧 FIXING ALL NAVIGATION BUTTONS');
        
        // Get all navigation elements
        const navLinks = document.querySelectorAll('.nav-link');
        const heroButtons = document.querySelectorAll('.hero-buttons .btn[href^="#"]');
        const allNavElements = [...navLinks, ...heroButtons];
        
        console.log(`Found ${navLinks.length} nav links and ${heroButtons.length} hero buttons`);
        
        // Remove existing listeners and add new ones
        allNavElements.forEach((element, index) => {
            // Create a completely new click handler
            const newClickHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const href = this.getAttribute('href');
                const text = this.textContent.trim();
                
                console.log(`🖱️ Navigating: ${text} → ${href}`);
                
                if (href && href.startsWith('#')) {
                    const target = document.querySelector(href);
                    
                    if (target) {
                        
                        // Calculate scroll position
                        const navbar = document.querySelector('.navbar');
                        const navbarHeight = navbar ? navbar.offsetHeight : 80;
                        
                        let scrollPosition;
                        if (href === '#hero') {
                            scrollPosition = 0;
                        } else {
                            scrollPosition = Math.max(0, target.offsetTop - navbarHeight - 50);
                        }
                        
                        // Optimized single scroll method
                        // Navigate to target section
                        
                        // Use scrollIntoView for better reliability
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Adjust for navbar after scroll completes
                        setTimeout(() => {
                            const currentPos = window.pageYOffset;
                            const adjustedPos = Math.max(0, currentPos - navbarHeight - 20);
                            
                            if (Math.abs(currentPos - adjustedPos) > 10) {
                                window.scrollTo({
                                    top: adjustedPos,
                                    behavior: 'smooth'
                                });
                            }
                            
                            console.log(`✅ Navigation complete to ${target.id}`);
                        }, 800);
                        
                        // Visual confirmation
                        target.style.border = '3px solid lime';
                        setTimeout(() => {
                            target.style.border = 'none';
                        }, 2000);
                        
                        // Close mobile menu if open
                        const hamburger = document.getElementById('hamburger');
                        const navMenu = document.getElementById('nav-menu');
                        if (hamburger && navMenu) {
                            hamburger.classList.remove('active');
                            navMenu.classList.remove('active');
                            document.body.classList.remove('nav-active');
                        }
                        
                    } else {
                        console.error(`❌ Target not found: ${href}`);
                    }
                }
            };
            
            // Remove old listeners by cloning the element
            const newElement = element.cloneNode(true);
            element.parentNode.replaceChild(newElement, element);
            
            // Add the new click handler
            newElement.addEventListener('click', newClickHandler);
            
            console.log(`✅ Fixed button ${index + 1}: ${newElement.textContent.trim()}`);
        });
        
        console.log('🎉 ALL BUTTONS FIXED AND READY!');
    }
    
    // Run the fix after everything is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(emergencyButtonFix, 3000);
        });
    } else {
        setTimeout(emergencyButtonFix, 3000);
    }
    
})();

// ========================================
// PORTFOLIO FILTERING SYSTEM
// ========================================

(function() {
    'use strict';
    
    console.log('🎨 Initializing portfolio filters...');
    
    function initializePortfolioFilters() {
        // Get all filter buttons and portfolio items
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        // Add click handlers to filter buttons
        filterButtons.forEach((button, index) => {
            // Remove existing listeners by cloning
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            const filterValue = newButton.getAttribute('data-filter');
            const buttonText = newButton.textContent.trim();
            
            newButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`🎯 Filter: ${buttonText}`);
                
                // Update active button state
                filterButtons.forEach(btn => {
                    const actualBtn = document.querySelector(`[data-filter="${btn.getAttribute('data-filter')}"]`);
                    if (actualBtn) {
                        actualBtn.classList.remove('active', 'shadcn-button-primary');
                        actualBtn.classList.add('shadcn-button-outline');
                    }
                });
                
                // Set clicked button as active
                this.classList.remove('shadcn-button-outline');
                this.classList.add('active', 'shadcn-button-primary');
                
                // Filter portfolio items
                filterPortfolioItems(filterValue);
                
                // Visual feedback
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
            
            console.log(`✅ Filter ready: "${buttonText}"`);
        });
        
        console.log('🎉 Portfolio filters ready!');
    }
    
    function filterPortfolioItems(filterValue) {
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        let visibleCount = 0;
        
        // Apply filter with animations
        portfolioItems.forEach((item, index) => {
            const itemCategories = item.getAttribute('data-category') || '';
            const shouldShow = filterValue === 'all' || itemCategories.includes(filterValue);
            
            if (shouldShow) {
                // Show item with animation
                item.classList.remove('hidden');
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
                item.style.display = 'block';
                visibleCount++;
                
                // Stagger animation
                setTimeout(() => {
                    item.style.animation = 'slideInFromBottom 0.6s ease-out';
                }, index * 100);
                
            } else {
                // Hide item with animation
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        console.log(`✅ Filter applied: ${visibleCount} projects shown`);
        
        // Update grid layout after filtering
        setTimeout(() => {
            const portfolioGrid = document.querySelector('.portfolio-grid');
            if (portfolioGrid) {
                // Trigger reflow for better grid layout
                portfolioGrid.style.opacity = '0.99';
                setTimeout(() => {
                    portfolioGrid.style.opacity = '1';
                }, 50);
            }
        }, 400);
    }
    
    // Initialize after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializePortfolioFilters, 1000);
        });
    } else {
        setTimeout(initializePortfolioFilters, 1000);
    }
    
})();

// ========================================
// ADVANCED PORTFOLIO VISUAL EFFECTS
// ========================================

(function() {
    'use strict';
    
    console.log('🎨 Initializing advanced portfolio effects...');
    
    function initializeAdvancedEffects() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                easing: 'ease-out-cubic',
                offset: 100
            });
            console.log('✅ AOS animations initialized');
        }
        
        // Initialize Vanilla Tilt for 3D effects
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelectorAll('.tilt-card'), {
                max: 15,
                speed: 400,
                glare: true,
                'max-glare': 0.5,
                perspective: 1000,
                'gyroscope-min-angle-x': -45,
                'gyroscope-max-angle-x': 45,
                'gyroscope-min-angle-y': -45,
                'gyroscope-max-angle-y': 45
            });
            console.log('✅ 3D tilt effects initialized');
        }
        
        // Initialize GSAP ScrollTrigger animations
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            
            // Advanced portfolio grid animation
            gsap.fromTo('.portfolio-item', 
                {
                    y: 100,
                    opacity: 0,
                    scale: 0.8
                },
                {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: '.portfolio-grid',
                        start: 'top 80%',
                        end: 'bottom 20%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
            
            // Filter buttons animation
            gsap.fromTo('.filter-btn', 
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.portfolio-filters',
                        start: 'top 85%'
                    }
                }
            );
            
            // Section title animation
            gsap.fromTo('.section-title', 
                {
                    scale: 0.8,
                    opacity: 0
                },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: '.section-title',
                        start: 'top 85%'
                    }
                }
            );
            
            console.log('✅ GSAP scroll animations initialized');
        }
        
        // Initialize Particles.js background
        if (typeof particlesJS !== 'undefined') {
            particlesJS('portfolio-particles', {
                particles: {
                    number: {
                        value: 50,
                        density: {
                            enable: true,
                            value_area: 800
                        }
                    },
                    color: {
                        value: "#ffffff"
                    },
                    shape: {
                        type: "circle",
                        stroke: {
                            width: 0,
                            color: "#000000"
                        }
                    },
                    opacity: {
                        value: 0.1,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 1,
                            opacity_min: 0.05,
                            sync: false
                        }
                    },
                    size: {
                        value: 3,
                        random: true,
                        anim: {
                            enable: true,
                            speed: 2,
                            size_min: 1,
                            sync: false
                        }
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: "#ffffff",
                        opacity: 0.05,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 1,
                        direction: "none",
                        random: true,
                        straight: false,
                        out_mode: "out",
                        bounce: false,
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200
                        }
                    }
                },
                interactivity: {
                    detect_on: "canvas",
                    events: {
                        onhover: {
                            enable: true,
                            mode: "repulse"
                        },
                        onclick: {
                            enable: false
                        },
                        resize: true
                    },
                    modes: {
                        repulse: {
                            distance: 100,
                            duration: 0.4
                        }
                    }
                },
                retina_detect: true
            });
            console.log('✅ Particle background initialized');
        }
        
        // Advanced hover effects for portfolio items
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        portfolioItems.forEach(item => {
            const overlay = item.querySelector('.portfolio-overlay');
            const content = item.querySelector('.portfolio-content');
            
            item.addEventListener('mouseenter', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(overlay, {
                        opacity: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                    
                    gsap.fromTo(content.children, 
                        { y: 30, opacity: 0 },
                        { 
                            y: 0, 
                            opacity: 1, 
                            duration: 0.4, 
                            stagger: 0.1,
                            ease: "power2.out"
                        }
                    );
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(overlay, {
                        opacity: 0,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                }
            });
        });
        
        console.log('✅ Portfolio hover effects initialized');
    }
    
    // Enhanced filter system with animations
    function enhanceFilterSystem() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        // Add enhanced click effects
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (typeof gsap !== 'undefined') {
                    // Button click animation
                    gsap.to(this, {
                        scale: 0.95,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1,
                        ease: "power2.inOut"
                    });
                }
            });
        });
        
        console.log('✅ Enhanced filter animations ready');
    }
    
    // Initialize everything when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                initializeAdvancedEffects();
                enhanceFilterSystem();
            }, 500);
        });
    } else {
        setTimeout(() => {
            initializeAdvancedEffects();
            enhanceFilterSystem();
        }, 500);
    }
    
})();