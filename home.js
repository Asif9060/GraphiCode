// Hamburger Menu Toggle
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
hamburger.addEventListener("click", () => {
   const expanded = hamburger.getAttribute("aria-expanded") === "true";
   hamburger.setAttribute("aria-expanded", String(!expanded));
   hamburger.classList.toggle("active");
   menu.classList.toggle("open");
});

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

// Scroll Spy Navbar
const navLinks = document.querySelectorAll(".nav-link");
const sections = [...navLinks].map((link) =>
   document.querySelector(link.getAttribute("href"))
);
window.addEventListener("scroll", () => {
   let scrollY = window.pageYOffset;
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
   if (scrollY > 400) {
      backToTop.classList.add("show");
   } else {
      backToTop.classList.remove("show");
   }
});

// Back to Top Button Click
document.getElementById("backToTop").addEventListener("click", () => {
   window.scrollTo({ top: 0, behavior: "smooth" });
});

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
