// API Configuration
const API_BASE_URL = 'https://graphicode.onrender.com/api';

// API Helper Class
class GraphiCodeAPI {
   constructor(baseURL = API_BASE_URL) {
      this.baseURL = baseURL;
   }

   async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
         headers: {
            "Content-Type": "application/json",
            ...options.headers,
         },
         ...options,
      };

      try {
         const response = await fetch(url, config);
         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.message || "API request failed");
         }

         return data;
      } catch (error) {
         console.error("API Error:", error);
         throw error;
      }
   }

   // Portfolio API
   async getPortfolio(category = null) {
      let endpoint = "/portfolio";
      if (category && category !== "all") {
         endpoint += `?category=${category}`;
      }
      return this.request(endpoint);
   }

   async getPortfolioItem(id) {
      return this.request(`/portfolio/${id}`);
   }

   // Services API
   async getServices() {
      return this.request("/services");
   }

   async getService(id) {
      return this.request(`/services/${id}`);
   }

   // Testimonials API
   async getTestimonials(featured = false) {
      let endpoint = "/testimonials";
      if (featured) {
         endpoint += "?featured=true";
      }
      return this.request(endpoint);
   }

   async getTestimonial(id) {
      return this.request(`/testimonials/${id}`);
   }

   // Blog API
   async getBlogs(options = {}) {
      let endpoint = "/blog";
      const params = new URLSearchParams();

      if (options.category) params.append("category", options.category);
      if (options.featured) params.append("featured", "true");
      if (options.limit) params.append("limit", options.limit);

      const queryString = params.toString();
      if (queryString) endpoint += `?${queryString}`;

      return this.request(endpoint);
   }

   async getBlogPost(slug) {
      return this.request(`/blog/${slug}`);
   }

   // Contact API
   async submitContact(contactData) {
      return this.request("/contact", {
         method: "POST",
         body: JSON.stringify(contactData),
      });
   }
}

// Create and export API instance
const api = new GraphiCodeAPI();

// Render Functions
const renderPortfolio = (items, containerId = "portfolioGrid") => {
   const container =
      document.getElementById(containerId) || document.querySelector(".grid");
   if (!container) return;

   if (!items || items.length === 0) {
      container.innerHTML =
         '<p style="color: var(--text-alt); text-align: center; padding: 40px;">No portfolio items found.</p>';
      return;
   }

   container.innerHTML = items
      .map(
         (item) => `
    <div class="proj card-surface" data-category="${item.category}" tabindex="0" aria-label="${item.title}, ${item.description}">
      <img loading="lazy" src="${item.image}" alt="${item.title}" />
      <div class="meta">
        <strong>${item.title}</strong>
        <div class="muted">${item.description}</div>
      </div>
    </div>
  `
      )
      .join("");
};

const renderServices = (services, containerId = "servicesGrid") => {
   const container =
      document.getElementById(containerId) || document.querySelector(".services");
   if (!container) return;

   if (!services || services.length === 0) {
      container.innerHTML = '<p style="color: var(--text-alt);">No services found.</p>';
      return;
   }

   container.innerHTML = services
      .map(
         (service) => `
    <article class="svc" tabindex="0" aria-describedby="${service.title.toLowerCase()}-desc">
      <div class="icon">${service.icon}</div>
      <div>
        <h4>${service.title}</h4>
        <p id="${service.title.toLowerCase()}-desc" class="muted">${
            service.shortDescription
         }</p>
      </div>
    </article>
  `
      )
      .join("");
};

const renderTestimonials = (testimonials, containerId = "testimonialsGrid") => {
   const container =
      document.getElementById(containerId) || document.querySelector(".testimonial-list");
   if (!container) return;

   if (!testimonials || testimonials.length === 0) {
      container.innerHTML =
         '<p style="color: var(--text-alt);">No testimonials found.</p>';
      return;
   }

   container.innerHTML = testimonials
      .map((testimonial) => {
         const stars = "⭐".repeat(testimonial.rating);
         const initials = testimonial.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2);

         return `
      <blockquote tabindex="0" class="testimonial">
        <div class="star-rating">${stars}</div>
        <p>"${testimonial.testimonial}"</p>
        <footer>
          <div class="testimonial-author">
            <div class="author-avatar">${initials}</div>
            <div class="author-info">
              <div class="author-name">${testimonial.name}</div>
              <div class="author-title">${testimonial.position}${
            testimonial.company ? ", " + testimonial.company : ""
         }</div>
            </div>
          </div>
        </footer>
      </blockquote>
    `;
      })
      .join("");
};

const renderBlogs = (blogs, containerId = "blogsGrid") => {
   const container =
      document.getElementById(containerId) || document.querySelector(".blog");
   if (!container) return;

   if (!blogs || blogs.length === 0) {
      container.innerHTML = '<p style="color: var(--text-alt);">No blog posts found.</p>';
      return;
   }

   container.innerHTML = blogs
      .map((blog) => {
         const date = new Date(blog.publishDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
         });

         return `
      <article tabindex="0" class="blog-post card-surface">
        <img src="${blog.featuredImage}" alt="${blog.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 15px;" loading="lazy" />
        <p class="muted" style="font-size: 0.85rem; margin-bottom: 10px;">${date}</p>
        <h4>${blog.title}</h4>
        <p>${blog.excerpt}</p>
        <a href="#" class="read-more" data-slug="${blog.slug}">Read More</a>
      </article>
    `;
      })
      .join("");
};

// Helper function to show loading state
const showLoading = (containerId) => {
   const container = document.getElementById(containerId);
   if (container) {
      container.innerHTML =
         '<p style="color: var(--text-alt); text-align: center; padding: 20px;">Loading...</p>';
   }
};

// Helper function to show error
const showError = (containerId, message = "Error loading data") => {
   const container = document.getElementById(containerId);
   if (container) {
      container.innerHTML = `<p style="color: var(--danger); text-align: center; padding: 20px;">${message}</p>`;
   }
};
