// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
if (hamburger && menu) {
   hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      hamburger.setAttribute("aria-expanded", String(!expanded));
      hamburger.classList.toggle("active");
      menu.classList.toggle("open");
   });
}

// Dark Mode Toggle with localStorage
const themeBtn = document.getElementById("themeToggle");
const body = document.body;
const savedTheme = localStorage.getItem("graphicode_theme");
if (savedTheme === "light") body.classList.add("light");
updateThemeIcon();

themeBtn.addEventListener("click", () => {
   body.classList.toggle("light");
   localStorage.setItem(
      "graphicode_theme",
      body.classList.contains("light") ? "light" : "dark"
   );
   updateThemeIcon();
});

function updateThemeIcon() {
   themeBtn.textContent = body.classList.contains("light") ? "☀️" : "🌙";
}

// Authentication UI Helpers
const AUTH_SESSION_KEY = "graphicode_user_session";
let authModalElement = null;
let authModalMode = "login";
let authSubmitInFlight = false;
let authEscapeListenerAttached = false;

function initAuthUI() {
   const loginTrigger = document.getElementById("loginTrigger");
   const signupTrigger = document.getElementById("signupTrigger");
   const logoutTrigger = document.getElementById("logoutTrigger");
   const profileTrigger = document.getElementById("profileTrigger");

   if (!loginTrigger && !signupTrigger && !logoutTrigger && !profileTrigger) {
      return;
   }

   const session = getStoredSession();
   updateAuthControls(session);

   loginTrigger?.addEventListener("click", () => openAuthModal("login"));
   signupTrigger?.addEventListener("click", () => openAuthModal("signup"));
   logoutTrigger?.addEventListener("click", handleLogout);
   profileTrigger?.addEventListener("click", handleProfileNavigate);

   if (session?.token && typeof api !== "undefined") {
      verifyStoredSession(session);
   }
}

function getStoredSession() {
   if (typeof window === "undefined") return null;
   try {
      const stored = window.localStorage.getItem(AUTH_SESSION_KEY);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object" && parsed.token) {
         return parsed;
      }
   } catch (error) {
      console.warn("Unable to parse stored auth session", error);
   }
   return null;
}

function setStoredSession(session) {
   if (typeof window === "undefined") return;
   if (session && typeof session === "object" && session.token) {
      window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
   }
}

function clearStoredSession() {
   if (typeof window === "undefined") return;
   window.localStorage.removeItem(AUTH_SESSION_KEY);
}

function updateAuthControls(session) {
   const loginTrigger = document.getElementById("loginTrigger");
   const signupTrigger = document.getElementById("signupTrigger");
   const logoutTrigger = document.getElementById("logoutTrigger");
   const profileTrigger = document.getElementById("profileTrigger");
   const isAuthenticated = Boolean(session && session.token);

   if (loginTrigger) loginTrigger.hidden = isAuthenticated;
   if (signupTrigger) signupTrigger.hidden = isAuthenticated;
   if (logoutTrigger) logoutTrigger.hidden = !isAuthenticated;
   if (profileTrigger) {
      profileTrigger.hidden = !isAuthenticated;
      if (isAuthenticated && session.user && session.user.name) {
         const firstName = session.user.name.split(" ")[0];
         profileTrigger.textContent = `Hi, ${firstName}`;
      } else {
         profileTrigger.textContent = "Track Services";
      }
   }
}

async function verifyStoredSession(session) {
   if (!session?.token || typeof api === "undefined") return;
   try {
      const response = await api.getCurrentUser();
      if (response?.success && response.data) {
         const updatedSession = { token: session.token, user: response.data };
         setStoredSession(updatedSession);
         updateAuthControls(updatedSession);
      }
   } catch (error) {
      console.warn("Session validation failed", error);
      clearStoredSession();
      updateAuthControls(null);
   }
}

function handleLogout(event) {
   event?.preventDefault();
   clearStoredSession();
   updateAuthControls(null);
}

function handleProfileNavigate(event) {
   event?.preventDefault();
   window.location.href = "services.html";
}

function openAuthModal(mode = "login") {
   authModalMode = mode;
   const modal = ensureAuthModal();
   const form = modal.querySelector("#authModalForm");
   form.reset();
   updateAuthModalMode(mode);
   modal.classList.add("is-open");
   modal.setAttribute("aria-hidden", "false");
   document.body.classList.add("modal-open");
   const focusTarget = mode === "signup" ? form.elements.name : form.elements.email;
   focusTarget?.focus();
}

function closeAuthModal() {
   if (!authModalElement) return;
   authModalElement.classList.remove("is-open");
   authModalElement.setAttribute("aria-hidden", "true");
   document.body.classList.remove("modal-open");
}

function ensureAuthModal() {
   if (authModalElement) return authModalElement;

   const modal = document.createElement("div");
   modal.className = "auth-modal";
   modal.id = "authModal";
   modal.setAttribute("aria-hidden", "true");
   modal.innerHTML = `
      <div class="auth-modal__overlay" data-auth-close></div>
      <div class="auth-modal__panel" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
         <button type="button" class="auth-modal__close" aria-label="Close" data-auth-close>&times;</button>
         <div class="auth-modal__header">
            <h2 class="auth-modal__title" id="authModalTitle"></h2>
            <p class="auth-modal__subtitle muted"></p>
         </div>
         <form class="auth-modal__form" id="authModalForm" novalidate>
            <div class="form-group" data-auth-field="name">
               <label class="form-label" for="authName">Full name</label>
               <input class="form-field form-field--accent" id="authName" name="name" type="text" autocomplete="name" />
            </div>
            <div class="form-group" data-auth-field="email">
               <label class="form-label" for="authEmail">Email address</label>
               <input class="form-field form-field--accent" id="authEmail" name="email" type="email" autocomplete="email" required />
            </div>
            <div class="form-group" data-auth-field="phone">
               <label class="form-label" for="authPhone">Phone (optional)</label>
               <input class="form-field form-field--accent" id="authPhone" name="phone" type="tel" autocomplete="tel" />
            </div>
            <div class="form-group" data-auth-field="password">
               <label class="form-label" for="authPassword">Password</label>
               <input class="form-field form-field--accent" id="authPassword" name="password" type="password" autocomplete="current-password" required />
            </div>
            <div class="auth-modal__message" role="alert" aria-live="assertive"></div>
            <button type="submit" class="cta-btn auth-modal__submit"></button>
            <p class="auth-modal__switch muted">
               <span data-auth-switch-text></span>
               <button type="button" class="auth-modal__switch-btn" data-auth-switch></button>
            </p>
         </form>
      </div>
   `;

   document.body.appendChild(modal);

   const form = modal.querySelector("#authModalForm");
   form.addEventListener("submit", handleAuthSubmit);

   modal.querySelectorAll("[data-auth-close]").forEach((el) => {
      el.addEventListener("click", closeAuthModal);
   });

   const panel = modal.querySelector(".auth-modal__panel");
   panel.addEventListener("click", (event) => event.stopPropagation());

   modal.addEventListener("click", (event) => {
      if (event.target.dataset.authClose !== undefined || event.target === modal) {
         closeAuthModal();
      }
   });

   modal.querySelector("[data-auth-switch]").addEventListener("click", switchAuthMode);

   if (!authEscapeListenerAttached) {
      document.addEventListener("keydown", handleAuthEscape);
      authEscapeListenerAttached = true;
   }

   authModalElement = modal;
   return modal;
}

function updateAuthModalMode(mode) {
   if (!authModalElement) return;

   const title = authModalElement.querySelector(".auth-modal__title");
   const subtitle = authModalElement.querySelector(".auth-modal__subtitle");
   const submitButton = authModalElement.querySelector(".auth-modal__submit");
   const switchText = authModalElement.querySelector("[data-auth-switch-text]");
   const switchBtn = authModalElement.querySelector("[data-auth-switch]");
   const nameField = authModalElement.querySelector('[data-auth-field="name"]');
   const phoneField = authModalElement.querySelector('[data-auth-field="phone"]');
   const passwordInput = authModalElement.querySelector("#authPassword");
   const message = authModalElement.querySelector(".auth-modal__message");
   const form = authModalElement.querySelector("#authModalForm");

   message.textContent = "";
   message.classList.remove("is-error", "is-success");

   form.elements.name.required = mode === "signup";

   if (mode === "signup") {
      title.textContent = "Create your account";
      subtitle.textContent = "Book services faster and track progress in one place.";
      submitButton.textContent = "Create account";
      switchText.textContent = "Already have an account?";
      switchBtn.textContent = "Log in";
      nameField.hidden = false;
      phoneField.hidden = false;
      passwordInput.setAttribute("autocomplete", "new-password");
   } else {
      title.textContent = "Welcome back";
      subtitle.textContent = "Log in to manage your projects and service requests.";
      submitButton.textContent = "Log in";
      switchText.textContent = "New to GraphiCode?";
      switchBtn.textContent = "Sign up";
      nameField.hidden = true;
      phoneField.hidden = true;
      form.elements.name.value = "";
      form.elements.phone.value = "";
      passwordInput.setAttribute("autocomplete", "current-password");
   }

   authModalElement.setAttribute("data-mode", mode);
}

function switchAuthMode() {
   const newMode = authModalMode === "signup" ? "login" : "signup";
   authModalMode = newMode;
   const modal = ensureAuthModal();
   const form = modal.querySelector("#authModalForm");
   form.reset();
   updateAuthModalMode(newMode);
   const focusTarget = newMode === "signup" ? form.elements.name : form.elements.email;
   focusTarget?.focus();
}

async function handleAuthSubmit(event) {
   event.preventDefault();
   if (authSubmitInFlight) return;
   if (typeof api === "undefined") {
      console.warn("API helper is not available");
      return;
   }

   const modal = ensureAuthModal();
   const form = modal.querySelector("#authModalForm");
   const message = modal.querySelector(".auth-modal__message");
   const submitButton = modal.querySelector(".auth-modal__submit");

   message.textContent = "";
   message.classList.remove("is-error", "is-success");

   const formData = new FormData(form);
   const email = String(formData.get("email") || "").trim().toLowerCase();
   const password = String(formData.get("password") || "").trim();

   if (!email) {
      message.textContent = "Please enter your email.";
      message.classList.add("is-error");
      form.elements.email.focus();
      return;
   }

   const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailPattern.test(email)) {
      message.textContent = "Please enter a valid email address.";
      message.classList.add("is-error");
      form.elements.email.focus();
      return;
   }

   if (!password) {
      message.textContent = "Please enter your password.";
      message.classList.add("is-error");
      form.elements.password.focus();
      return;
   }

   if (authModalMode === "signup" && password.length < 6) {
      message.textContent = "Password must be at least 6 characters.";
      message.classList.add("is-error");
      form.elements.password.focus();
      return;
   }

   const payload = { email, password };

   if (authModalMode === "signup") {
      const name = String(formData.get("name") || "").trim();
      const phone = String(formData.get("phone") || "").trim();

      if (!name) {
         message.textContent = "Please enter your name.";
         message.classList.add("is-error");
         form.elements.name.focus();
         return;
      }

      payload.name = name;
      if (phone) payload.phone = phone;
   }

   authSubmitInFlight = true;
   submitButton.disabled = true;
   submitButton.textContent = authModalMode === "signup" ? "Creating account..." : "Logging in...";

   try {
      const response = authModalMode === "signup"
         ? await api.registerUser(payload)
         : await api.loginUser({ email, password });

      if (response?.success && response.data) {
         const session = {
            token: response.data.token,
            user: response.data.user,
         };
         setStoredSession(session);
         updateAuthControls(session);
         form.reset();
         closeAuthModal();
      } else {
         throw new Error("Unexpected response from server.");
      }
   } catch (error) {
      const errorMessage = extractAuthErrorMessage(error);
      message.textContent = errorMessage;
      message.classList.add("is-error");
      console.error("Authentication error:", error);
   } finally {
      authSubmitInFlight = false;
      submitButton.disabled = false;
      submitButton.textContent = authModalMode === "signup" ? "Create account" : "Log in";
   }
}

function extractAuthErrorMessage(error) {
   if (!error) return "Unable to process request. Please try again.";
   if (error.data) {
      if (Array.isArray(error.data.errors) && error.data.errors.length) {
         return error.data.errors[0].msg || "Please review the form and try again.";
      }
      if (error.data.message) {
         return error.data.message;
      }
   }
   if (error.message) {
      return error.message;
   }
   return "Unable to process request. Please try again.";
}

function handleAuthEscape(event) {
   if (event.key === "Escape" && authModalElement?.classList.contains("is-open")) {
      closeAuthModal();
   }
}

// Typed Text Animation for Hero Section
const typedPhrases = ["Clean Code.", "Fast Delivery.", "Creative Design."];
const typedElement = document.querySelector(".typed-text");
let typedIndex = 0,
   charIndex = 0,
   typing = true;

function typeText() {
   if (typing) {
      if (charIndex < typedPhrases[typedIndex].length) {
         typedElement.textContent += typedPhrases[typedIndex].charAt(charIndex);
         charIndex++;
         setTimeout(typeText, 120);
      } else {
         typing = false;
         setTimeout(typeText, 1000);
      }
   } else {
      if (charIndex > 0) {
         typedElement.textContent = typedPhrases[typedIndex].substring(0, charIndex - 1);
         charIndex--;
         setTimeout(typeText, 60);
      } else {
         typing = true;
         typedIndex = (typedIndex + 1) % typedPhrases.length;
         setTimeout(typeText, 300);
      }
   }
}
typeText();

// Portfolio Filtering
const filterButtons = document.querySelectorAll(".filter-btn");
const projects = document.querySelectorAll(".proj");
filterButtons.forEach((btn) => {
   btn.addEventListener("click", () => {
      // Update active button aria
      filterButtons.forEach((b) => {
         b.classList.remove("active");
         b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");

      const filter = btn.getAttribute("data-filter");
      projects.forEach((p) => {
         if (filter === "all" || p.getAttribute("data-category") === filter) {
            p.style.display = "block";
         } else {
            p.style.display = "none";
         }
      });
   });
});

// Scroll Spy Navbar + subtle scroll shadow
const navLinks = document.querySelectorAll(".nav-link");
const sections = [...navLinks]
   .map((link) => document.querySelector(link.getAttribute("href")))
   .filter(Boolean);

window.addEventListener("scroll", () => {
   const scrollY = window.pageYOffset;

   sections.forEach((section, i) => {
      if (
         section.offsetTop <= scrollY + 80 &&
         section.offsetTop + section.offsetHeight > scrollY + 80
      ) {
         navLinks.forEach((link) => link.classList.remove("active"));
         navLinks[i].classList.add("active");
      }
   });

   // Back to Top Button Show/Hide
   const backToTop = document.getElementById("backToTop");
   if (backToTop) {
      if (scrollY > 400) {
         backToTop.classList.add("show");
      } else {
         backToTop.classList.remove("show");
      }
   }
});

// Back to Top Button Click
const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
   backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   });
}

// Contact Form Validation & Simple Captcha
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
if (contactForm) {
   contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      formMessage.textContent = "";
      const name = contactForm.name.value.trim();
      const email = contactForm.email.value.trim();
      const message = contactForm.message.value.trim();
      const captcha = contactForm.captchaInput
         ? contactForm.captchaInput.value.trim()
         : "11";

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name) {
         formMessage.textContent = "Please enter your name.";
         contactForm.name.focus();
         return;
      }
      if (!email || !emailPattern.test(email)) {
         formMessage.textContent = "Please enter a valid email.";
         contactForm.email.focus();
         return;
      }
      if (!message) {
         formMessage.textContent = "Please enter your message.";
         contactForm.message.focus();
         return;
      }
      if (contactForm.captchaInput && captcha !== "11") {
         formMessage.textContent = "Captcha answer is incorrect.";
         contactForm.captchaInput.focus();
         return;
      }

      // Send message to API
      formMessage.textContent = "Sending message...";
      formMessage.style.color = "var(--text-alt)";

      try {
         if (typeof api !== "undefined") {
            const response = await api.submitContact({ name, email, message });
            if (response.success) {
               formMessage.textContent =
                  "Thank you for contacting us, " +
                  name +
                  "! We will get back to you soon.";
               formMessage.style.color = "var(--accent)";
               contactForm.reset();
            }
         } else {
            // Fallback if API not loaded
            setTimeout(() => {
               formMessage.textContent = "Thank you for contacting us, " + name + "!";
               formMessage.style.color = "var(--accent)";
               contactForm.reset();
            }, 1500);
         }
      } catch (error) {
         formMessage.textContent = "Error sending message. Please try again later.";
         formMessage.style.color = "var(--danger)";
         console.error("Contact form error:", error);
      }
   });
}

// Keyboard focus visible class for accessibility
window.addEventListener("keydown", (e) => {
   if (e.key === "Tab") {
      document.body.classList.add("show-focus");
   }
});

// Load dynamic data from API
document.addEventListener("DOMContentLoaded", async () => {
   initAuthUI();

   // Check if API is available
   if (typeof api === "undefined") {
      console.warn("API not loaded, using static content");
      return;
   }

   try {
      // Load portfolio items on index page
      if (document.querySelector(".portfolio .grid")) {
         const portfolioData = await api.getPortfolio();
         if (portfolioData.success) {
            renderPortfolio(portfolioData.data.slice(0, 3)); // Show first 3 on homepage
         }
      }

      // Load services on index page
      if (document.querySelector(".services")) {
         const servicesData = await api.getServices();
         if (servicesData.success) {
            renderServices(servicesData.data.slice(0, 3)); // Show first 3 on homepage
         }
      }

      // Load testimonials on index page
      if (document.querySelector(".testimonials .testimonial-list")) {
         const testimonialsData = await api.getTestimonials(true);
         if (testimonialsData.success) {
            renderTestimonials(testimonialsData.data.slice(0, 3)); // Show first 3 on homepage
         }
      }

      // Load blog posts on index page
      if (document.querySelector(".blog")) {
         const blogsData = await api.getBlogs({ limit: 2 });
         if (blogsData.success) {
            renderBlogs(blogsData.data);
         }
      }
   } catch (error) {
      console.error("Error loading dynamic content:", error);
   }
});
