const nav = document.querySelector(".nav");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector(".nav-links");
const modal = document.querySelector("[data-modal]");
const modalClose = document.querySelector("[data-modal-close]");
const modalForm = document.querySelector("#contactForm");
const modalOpeners = document.querySelectorAll("[data-modal-open]");
const feedbackContainer = modalForm
  ? modalForm.querySelector(".form-feedback")
  : null;
let lastFocusedElement = null;

if (navToggle) {
  navToggle.setAttribute("aria-label", "Open navigation");
}

function toggleNavScrolled() {
  if (!nav) return;
  const shouldAdd = window.scrollY > 16;
  nav.classList.toggle("nav--scrolled", shouldAdd);
}

toggleNavScrolled();
window.addEventListener("scroll", toggleNavScrolled, { passive: true });

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      navToggle.setAttribute("aria-label", "Close navigation");
    } else {
      navToggle.setAttribute("aria-label", "Open navigation");
    }
  });
}

if (navLinks && nav) {
  navLinks.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.matches("a, button")) {
      nav.classList.remove("nav--open");
      if (navToggle) {
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation");
      }
    }
  });
}

function openModal(event) {
  if (event) {
    event.preventDefault();
  }
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.removeAttribute("hidden");
  document.body.classList.add("modal-open");
  const firstInput = modal.querySelector("input, select, textarea, button");
  if (firstInput instanceof HTMLElement) {
    firstInput.focus();
  }
}

function closeModal() {
  if (!modal) return;
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
    closeModal();
  }
});

if (modalForm) {
  modalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const submitButton = modalForm.querySelector(".submit-btn");
    if (!(submitButton instanceof HTMLButtonElement)) {
      return;
    }

    const originalLabel = submitButton.textContent || "";
    submitButton.disabled = true;
    submitButton.textContent = "Sending…";

    window.setTimeout(() => {
      modalForm.reset();
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;

      if (feedbackContainer) {
        feedbackContainer.textContent =
          "Message sent successfully! We will get back to you soon.";
        feedbackContainer.classList.add("success");
      }

      window.setTimeout(() => {
        if (feedbackContainer) {
          feedbackContainer.textContent = "";
          feedbackContainer.classList.remove("success");
        }
        closeModal();
      }, 1600);
    }, 800);
  });
}
