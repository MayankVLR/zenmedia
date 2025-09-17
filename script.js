const nav = document.querySelector(".nav");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector(".nav-menu");
const modal = document.querySelector("[data-modal]");
const modalClose = modal ? modal.querySelector("[data-modal-close]") : null;
const modalOpeners = document.querySelectorAll("[data-modal-open]");
const contactForm = document.getElementById("contactForm");
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);
let lastFocusedElement = null;

function throttle(func, limit) {
  let inThrottle;
  return function throttled(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      window.setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

function updateNavAppearance() {
  if (!nav) return;
  const isScrolled = window.scrollY > 50;
  nav.classList.toggle("nav--scrolled", isScrolled);
}

updateNavAppearance();
window.addEventListener("scroll", throttle(updateNavAppearance, 100), {
  passive: true,
});

function closeNavMenu() {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove("active");
  navMenu.setAttribute("aria-hidden", "true");
  navToggle.classList.remove("active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
}

if (navToggle && navMenu) {
  navToggle.setAttribute("aria-label", "Open navigation");
  navMenu.setAttribute("aria-hidden", "true");

  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    const nextState = !expanded;

    navToggle.classList.toggle("active", nextState);
    navMenu.classList.toggle("active", nextState);
    navToggle.setAttribute("aria-expanded", String(nextState));
    navMenu.setAttribute("aria-hidden", String(!nextState));
    navToggle.setAttribute(
      "aria-label",
      nextState ? "Close navigation" : "Open navigation",
    );
  });
}

if (navMenu) {
  navMenu.addEventListener("click", (event) => {
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.tagName === "A" || target.tagName === "BUTTON")
    ) {
      closeNavMenu();
    }
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeNavMenu();
  }
});

function openModal(event) {
  if (event) {
    event.preventDefault();
  }

  if (!modal) return;

  lastFocusedElement = document.activeElement;
  modal.removeAttribute("hidden");
  modal.style.display = "block";
  document.body.classList.add("modal-open");

  const firstInput = modal.querySelector("input, select, textarea, button");
  if (firstInput instanceof HTMLElement) {
    firstInput.focus();
  }
}

function closeModal() {
  if (!modal) return;

  modal.style.display = "none";
  modal.setAttribute("hidden", "");
  document.body.classList.remove("modal-open");

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
  }
}

modalOpeners.forEach((trigger) => {
  trigger.addEventListener("click", openModal);
});

if (modalClose) {
  modalClose.addEventListener("click", (event) => {
    event.preventDefault();
    closeModal();
  });
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (navToggle && navToggle.classList.contains("active")) {
      closeNavMenu();
    }
    closeModal();
  }
});

function showSuccessMessage() {
  if (!contactForm) return;

  const existingMessage = contactForm.querySelector(".success-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const successMessage = document.createElement("div");
  successMessage.className = "success-message";
  successMessage.setAttribute("role", "status");
  successMessage.textContent =
    "Message sent successfully! We will get back to you soon.";
  contactForm.prepend(successMessage);

  window.setTimeout(() => {
    successMessage.classList.add("show");
  }, 20);

  window.setTimeout(() => {
    successMessage.classList.remove("show");
    window.setTimeout(() => {
      successMessage.remove();
    }, 500);
  }, 2800);
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector(".submit-btn");
    if (!(submitBtn instanceof HTMLButtonElement)) {
      return;
    }

    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;

    window.setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalContent;
      contactForm.reset();
      showSuccessMessage();

      window.setTimeout(() => {
        closeModal();
      }, 1600);
    }, 1200);
  });
}

const canvas = document.getElementById("hero-canvas");
const heroSection = document.querySelector(".hero");

if (canvas && heroSection) {
  const ctx = canvas.getContext("2d");

  if (ctx) {
    let particles = [];
    let animationFrameId;
    const particleSize = 1;
    const particleSpeed = 0.35;
    const connectionDistance = 140;

    function getParticleCount() {
      if (window.innerWidth >= 1280) return 70;
      if (window.innerWidth >= 768) return 55;
      return 40;
    }

    function setCanvasSize() {
      canvas.width = window.innerWidth;
      const targetHeight = heroSection.offsetHeight + heroSection.offsetTop;
      canvas.height = Math.max(window.innerHeight, targetHeight);
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * particleSpeed,
        vy: (Math.random() - 0.5) * particleSpeed,
        alpha: Math.random() * 0.8 + 0.2,
      };
    }

    function initParticles() {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i += 1) {
        particles.push(createParticle());
      }
    }

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        const updatedParticle = particle;
        updatedParticle.x += updatedParticle.vx;
        updatedParticle.y += updatedParticle.vy;

        if (updatedParticle.x < 0 || updatedParticle.x > canvas.width) {
          updatedParticle.vx *= -1;
        }
        if (updatedParticle.y < 0 || updatedParticle.y > canvas.height) {
          updatedParticle.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(
          updatedParticle.x,
          updatedParticle.y,
          particleSize,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(99, 102, 241, ${updatedParticle.alpha})`;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const otherParticle = particles[j];
          const dx = updatedParticle.x - otherParticle.x;
          const dy = updatedParticle.y - otherParticle.y;
          const distance = Math.hypot(dx, dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(updatedParticle.x, updatedParticle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = window.requestAnimationFrame(drawFrame);
    }

    function stopAnimation() {
      window.cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function startAnimation() {
      canvas.style.display = "";
      stopAnimation();
      setCanvasSize();
      initParticles();
      drawFrame();
    }

    if (!prefersReducedMotion.matches) {
      startAnimation();
    } else {
      canvas.style.display = "none";
    }

    const handleResize = throttle(() => {
      if (prefersReducedMotion.matches) return;
      setCanvasSize();
      initParticles();
    }, 200);

    window.addEventListener("resize", handleResize);

    const motionChangeHandler = (event) => {
      if (event.matches) {
        canvas.style.display = "none";
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    if (typeof prefersReducedMotion.addEventListener === "function") {
      prefersReducedMotion.addEventListener("change", motionChangeHandler);
    } else if (typeof prefersReducedMotion.addListener === "function") {
      prefersReducedMotion.addListener(motionChangeHandler);
    }
  } else {
    canvas.style.display = "none";
  }
}

const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const href = anchor.getAttribute("href");
    if (!href || href.length <= 1) return;

    const target = document.querySelector(href);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
