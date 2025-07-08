// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('contactModal');
const closeModal = document.querySelector('.close');
const contactForm = document.getElementById('contactForm');
const navbar = document.querySelector('.nav'); // Select the nav element directly

// Mobile Navigation Toggle (if you add a hamburger menu and nav-menu)
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}


// Modal Functions
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModalFunc() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = 'Message sent successfully! We will get back to you soon.';
    contactForm.prepend(successMessage);

    setTimeout(() => {
        successMessage.classList.add('show');
    }, 10); // Small delay to trigger CSS transition

    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => successMessage.remove(), 500); // Remove after fade out
    }, 3000); // Message disappears after 3 seconds
}

// Modal Event Listeners
closeModal.addEventListener('click', closeModalFunc);

// Close modal when clicking outside of it
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModalFunc();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModalFunc();
    }
});

// Form Submission Handling
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading"></span> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Show success message
            showSuccessMessage();

            // Reset form
            contactForm.reset();

            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;

            // Close modal immediately after success message is shown and form is reset
            closeModalFunc();

        }, 2000); // This delay is for simulating the "sending" process
    });
}

// Interactive 3D Background (Hero Canvas)
const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const numParticles = 100;
    const particleSize = 1;
    const particleSpeed = 0.5;
    const connectionDistance = 100;

    canvas.width = window.innerWidth;
    canvas.height = document.body.scrollHeight; // Set canvas height to full body scroll height

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = document.body.scrollHeight;
        initParticles(); // Reinitialize particles on resize
    });

    class Particle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * particleSpeed;
            this.vy = (Math.random() - 0.5) * particleSpeed;
            this.alpha = Math.random();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, particleSize, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`; // Primary color
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${1 - (distance / connectionDistance)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
}


// Navbar scroll effect
const navbarElement = document.querySelector('.nav'); // Select the actual nav element
const heroSection = document.querySelector('.hero');

// Function to update nav link active state based on scroll position (if needed)
function updateNavLinkActiveState() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - (navbarElement ? navbarElement.offsetHeight : 0) - 50; // Offset for fixed nav
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.add('active');
        } else {
            document.querySelector('.nav-links a[href*=' + sectionId + ']').classList.remove('active');
        }
    });
}


// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Navbar scroll effect
    if (window.scrollY > 50) { // Changed threshold to 50px for faster change
        if (navbarElement) {
            navbarElement.style.background = 'rgba(255, 255, 255, 0.9)'; // Slightly less transparent
            navbarElement.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)'; // Softer shadow
        }
    } else {
        if (navbarElement) {
            navbarElement.style.background = 'rgba(255, 255, 255, 0.8)'; // Original state
            navbarElement.style.boxShadow = 'none';
        }
    }
    // updateNavLinkActiveState(); // Re-enable if you want active link highlighting
}, 100)); // Throttled to run every 100ms

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Initial check for navbar background
    if (window.scrollY > 50) {
        if (navbarElement) {
            navbarElement.style.background = 'rgba(255, 255, 255, 0.9)';
            navbarElement.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
        }
    } else {
        if (navbarElement) {
            navbarElement.style.background = 'rgba(255, 255, 255, 0.8)';
            navbarElement.style.boxShadow = 'none';
        }
    }

    // Optionally update initial active state
    // updateNavLinkActiveState();
});
