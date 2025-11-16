const API_URL = 'https://graphicode.onrender.com/api';
let currentToken = localStorage.getItem("adminToken");

// Check authentication
if (!currentToken) {
   window.location.href = "login.html";
}

// Set admin name
document.getElementById("adminName").textContent =
   localStorage.getItem("adminName") || "Admin";

// Navigation
document.querySelectorAll(".nav-item[data-section]").forEach((item) => {
   item.addEventListener("click", (e) => {
      e.preventDefault();
      const section = item.dataset.section;
      showSection(section);
   });
});

function showSection(section) {
   // Update active nav item
   document
      .querySelectorAll(".nav-item")
      .forEach((nav) => nav.classList.remove("active"));
   document.querySelector(`[data-section="${section}"]`).classList.add("active");

   // Update page title
   const titles = {
      dashboard: "Dashboard",
      portfolio: "Portfolio Management",
      services: "Services Management",
      testimonials: "Testimonials Management",
      blog: "Blog Management",
      contacts: "Contact Messages",
   };
   document.getElementById("pageTitle").textContent = titles[section];

   // Show section
   document
      .querySelectorAll(".content-section")
      .forEach((sec) => sec.classList.remove("active"));
   document.getElementById(`${section}-section`).classList.add("active");

   // Load data
   switch (section) {
      case "dashboard":
         loadDashboard();
         break;
      case "portfolio":
         loadPortfolio();
         break;
      case "services":
         loadServices();
         break;
      case "testimonials":
         loadTestimonials();
         break;
      case "blog":
         loadBlogs();
         break;
      case "contacts":
         loadContacts();
         break;
   }
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", (e) => {
   e.preventDefault();
   localStorage.removeItem("adminToken");
   localStorage.removeItem("adminName");
   window.location.href = "login.html";
});

// API Helper
async function apiRequest(endpoint, method = "GET", data = null) {
   const options = {
      method,
      headers: {
         Authorization: `Bearer ${currentToken}`,
         "Content-Type": "application/json",
      },
   };

   if (data && method !== "GET") {
      options.body = JSON.stringify(data);
   }

   const response = await fetch(`${API_URL}${endpoint}`, options);
   return await response.json();
}

// Dashboard
async function loadDashboard() {
   try {
      const data = await apiRequest("/admin/dashboard/stats");
      if (data.success) {
         document.getElementById("portfolioCount").textContent = data.data.portfolio;
         document.getElementById("servicesCount").textContent = data.data.services;
         document.getElementById("testimonialsCount").textContent =
            data.data.testimonials;
         document.getElementById("blogsCount").textContent = data.data.blogs;
         document.getElementById("contactsNew").textContent = data.data.contacts.new;
      }
   } catch (error) {
      console.error("Error loading dashboard:", error);
   }
}

// Portfolio Functions
async function loadPortfolio() {
   try {
      const data = await apiRequest("/admin/portfolio");
      const list = document.getElementById("portfolioList");

      if (data.success && data.data.length > 0) {
         list.innerHTML = data.data
            .map(
               (item) => `
        <div class="table-item">
          <div>
            <strong>${item.title}</strong>
            <p style="color: var(--text-dim); margin: 5px 0 0 0;">${item.category} • ${
                  item.isActive ? "Active" : "Inactive"
               }</p>
          </div>
          <div class="table-actions">
            <button class="btn-edit" onclick="editPortfolio('${item._id}')">Edit</button>
            <button class="btn-delete" onclick="deletePortfolio('${
               item._id
            }')">Delete</button>
          </div>
        </div>
      `
            )
            .join("");
      } else {
         list.innerHTML =
            '<p style="color: var(--text-dim);">No portfolio items found.</p>';
      }
   } catch (error) {
      console.error("Error loading portfolio:", error);
   }
}

function showAddPortfolioForm() {
   const modal = document.getElementById("modal");
   const modalBody = document.getElementById("modalBody");

   modalBody.innerHTML = `
    <h2>Add Portfolio Item</h2>
    <form id="portfolioForm" onsubmit="submitPortfolio(event)">
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" required />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description" required></textarea>
      </div>
      <div class="form-group">
        <label>Category</label>
        <select name="category" required>
          <option value="web">Web</option>
          <option value="branding">Branding</option>
          <option value="apps">Apps</option>
        </select>
      </div>
      <div class="form-group">
        <label>Image URL</label>
        <input type="url" name="image" required />
      </div>
      <div class="form-group">
        <label>Project Link (optional)</label>
        <input type="url" name="link" />
      </div>
      <div class="form-group">
        <label><input type="checkbox" name="featured" /> Featured</label>
      </div>
      <div class="form-group">
        <label><input type="checkbox" name="isActive" checked /> Active</label>
      </div>
      <button type="submit" class="btn-primary btn-block">Add Portfolio Item</button>
    </form>
  `;

   modal.classList.add("show");
}

async function submitPortfolio(e) {
   e.preventDefault();
   const form = e.target;
   const formData = new FormData(form);

   const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      image: formData.get("image"),
      link: formData.get("link"),
      featured: formData.get("featured") === "on",
      isActive: formData.get("isActive") === "on",
   };

   try {
      const result = await apiRequest("/portfolio", "POST", data);
      if (result.success) {
         alert("Portfolio item added successfully!");
         closeModal();
         loadPortfolio();
      }
   } catch (error) {
      alert("Error adding portfolio item");
      console.error(error);
   }
}

async function deletePortfolio(id) {
   if (confirm("Are you sure you want to delete this portfolio item?")) {
      try {
         const result = await apiRequest(`/portfolio/${id}`, "DELETE");
         if (result.success) {
            alert("Portfolio item deleted!");
            loadPortfolio();
         }
      } catch (error) {
         alert("Error deleting portfolio item");
         console.error(error);
      }
   }
}

// Services Functions
async function loadServices() {
   try {
      const data = await apiRequest("/admin/services");
      const list = document.getElementById("servicesList");

      if (data.success && data.data.length > 0) {
         list.innerHTML = data.data
            .map(
               (item) => `
        <div class="table-item">
          <div>
            <strong>${item.title}</strong>
            <p style="color: var(--text-dim); margin: 5px 0 0 0;">${item.shortDescription}</p>
          </div>
          <div class="table-actions">
            <button class="btn-edit" onclick="editService('${item._id}')">Edit</button>
            <button class="btn-delete" onclick="deleteService('${item._id}')">Delete</button>
          </div>
        </div>
      `
            )
            .join("");
      } else {
         list.innerHTML = '<p style="color: var(--text-dim);">No services found.</p>';
      }
   } catch (error) {
      console.error("Error loading services:", error);
   }
}

function showAddServiceForm() {
   const modal = document.getElementById("modal");
   const modalBody = document.getElementById("modalBody");

   modalBody.innerHTML = `
    <h2>Add Service</h2>
    <form id="serviceForm" onsubmit="submitService(event)">
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" required />
      </div>
      <div class="form-group">
        <label>Icon (1-3 characters)</label>
        <input type="text" name="icon" maxlength="3" required />
      </div>
      <div class="form-group">
        <label>Short Description</label>
        <textarea name="shortDescription" maxlength="200" required></textarea>
      </div>
      <div class="form-group">
        <label><input type="checkbox" name="isActive" checked /> Active</label>
      </div>
      <button type="submit" class="btn-primary btn-block">Add Service</button>
    </form>
  `;

   modal.classList.add("show");
}

async function submitService(e) {
   e.preventDefault();
   const form = e.target;
   const formData = new FormData(form);

   const data = {
      title: formData.get("title"),
      icon: formData.get("icon"),
      shortDescription: formData.get("shortDescription"),
      isActive: formData.get("isActive") === "on",
   };

   try {
      const result = await apiRequest("/services", "POST", data);
      if (result.success) {
         alert("Service added successfully!");
         closeModal();
         loadServices();
      }
   } catch (error) {
      alert("Error adding service");
      console.error(error);
   }
}

async function deleteService(id) {
   if (confirm("Are you sure you want to delete this service?")) {
      try {
         const result = await apiRequest(`/services/${id}`, "DELETE");
         if (result.success) {
            alert("Service deleted!");
            loadServices();
         }
      } catch (error) {
         alert("Error deleting service");
         console.error(error);
      }
   }
}

// Testimonials Functions
async function loadTestimonials() {
   try {
      const data = await apiRequest("/admin/testimonials");
      const list = document.getElementById("testimonialsList");

      if (data.success && data.data.length > 0) {
         list.innerHTML = data.data
            .map(
               (item) => `
        <div class="table-item">
          <div>
            <strong>${item.name}</strong> - ${item.position}
            <p style="color: var(--text-dim); margin: 5px 0 0 0;">${item.testimonial.substring(
               0,
               100
            )}...</p>
          </div>
          <div class="table-actions">
            <button class="btn-edit" onclick="editTestimonial('${
               item._id
            }')">Edit</button>
            <button class="btn-delete" onclick="deleteTestimonial('${
               item._id
            }')">Delete</button>
          </div>
        </div>
      `
            )
            .join("");
      } else {
         list.innerHTML = '<p style="color: var(--text-dim);">No testimonials found.</p>';
      }
   } catch (error) {
      console.error("Error loading testimonials:", error);
   }
}

function showAddTestimonialForm() {
   const modal = document.getElementById("modal");
   const modalBody = document.getElementById("modalBody");

   modalBody.innerHTML = `
    <h2>Add Testimonial</h2>
    <form id="testimonialForm" onsubmit="submitTestimonial(event)">
      <div class="form-group">
        <label>Name</label>
        <input type="text" name="name" required />
      </div>
      <div class="form-group">
        <label>Position/Title</label>
        <input type="text" name="position" required />
      </div>
      <div class="form-group">
        <label>Company (optional)</label>
        <input type="text" name="company" />
      </div>
      <div class="form-group">
        <label>Rating</label>
        <select name="rating" required>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
        </select>
      </div>
      <div class="form-group">
        <label>Testimonial</label>
        <textarea name="testimonial" required></textarea>
      </div>
      <div class="form-group">
        <label><input type="checkbox" name="featured" /> Featured</label>
      </div>
      <div class="form-group">
        <label><input type="checkbox" name="isActive" checked /> Active</label>
      </div>
      <button type="submit" class="btn-primary btn-block">Add Testimonial</button>
    </form>
  `;

   modal.classList.add("show");
}

async function submitTestimonial(e) {
   e.preventDefault();
   const form = e.target;
   const formData = new FormData(form);

   const data = {
      name: formData.get("name"),
      position: formData.get("position"),
      company: formData.get("company"),
      rating: parseInt(formData.get("rating")),
      testimonial: formData.get("testimonial"),
      featured: formData.get("featured") === "on",
      isActive: formData.get("isActive") === "on",
   };

   try {
      const result = await apiRequest("/testimonials", "POST", data);
      if (result.success) {
         alert("Testimonial added successfully!");
         closeModal();
         loadTestimonials();
      }
   } catch (error) {
      alert("Error adding testimonial");
      console.error(error);
   }
}

async function deleteTestimonial(id) {
   if (confirm("Are you sure you want to delete this testimonial?")) {
      try {
         const result = await apiRequest(`/testimonials/${id}`, "DELETE");
         if (result.success) {
            alert("Testimonial deleted!");
            loadTestimonials();
         }
      } catch (error) {
         alert("Error deleting testimonial");
         console.error(error);
      }
   }
}

// Blog Functions
async function loadBlogs() {
   try {
      const data = await apiRequest("/admin/blog");
      const list = document.getElementById("blogList");

      if (data.success && data.data.length > 0) {
         list.innerHTML = data.data
            .map(
               (item) => `
        <div class="table-item">
          <div>
            <strong>${item.title}</strong>
            <p style="color: var(--text-dim); margin: 5px 0 0 0;">${
               item.published ? "Published" : "Draft"
            } • ${item.category}</p>
          </div>
          <div class="table-actions">
            <button class="btn-edit" onclick="editBlog('${item._id}')">Edit</button>
            <button class="btn-delete" onclick="deleteBlog('${item._id}')">Delete</button>
          </div>
        </div>
      `
            )
            .join("");
      } else {
         list.innerHTML = '<p style="color: var(--text-dim);">No blog posts found.</p>';
      }
   } catch (error) {
      console.error("Error loading blogs:", error);
   }
}

function showAddBlogForm() {
   const modal = document.getElementById("modal");
   const modalBody = document.getElementById("modalBody");

   modalBody.innerHTML = `
    <h2>Add Blog Post</h2>
    <form id="blogForm" onsubmit="submitBlog(event)">
      <div class="form-group">
        <label>Title</label>
        <input type="text" name="title" required />
      </div>
      <div class="form-group">
        <label>Excerpt</label>
        <textarea name="excerpt" maxlength="300" required></textarea>
      </div>
      <div class="form-group">
        <label>Content</label>
        <textarea name="content" rows="6" required></textarea>
      </div>
      <div class="form-group">
        <label>Featured Image URL</label>
        <input type="url" name="featuredImage" required />
      </div>
      <div class="form-group">
        <label>Category</label>
        <select name="category" required>
          <option value="web-design">Web Design</option>
          <option value="app-development">App Development</option>
          <option value="branding">Branding</option>
          <option value="marketing">Marketing</option>
          <option value="technology">Technology</option>
          <option value="tutorials">Tutorials</option>
        </select>
      </div>
      <div class="form-group">
        <label><input type="checkbox" name="published" /> Published</label>
      </div>
      <div class="form-group">
        <label><input type="checkbox" name="featured" /> Featured</label>
      </div>
      <button type="submit" class="btn-primary btn-block">Add Blog Post</button>
    </form>
  `;

   modal.classList.add("show");
}

async function submitBlog(e) {
   e.preventDefault();
   const form = e.target;
   const formData = new FormData(form);

   const data = {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      featuredImage: formData.get("featuredImage"),
      category: formData.get("category"),
      published: formData.get("published") === "on",
      featured: formData.get("featured") === "on",
   };

   try {
      const result = await apiRequest("/blog", "POST", data);
      if (result.success) {
         alert("Blog post added successfully!");
         closeModal();
         loadBlogs();
      }
   } catch (error) {
      alert("Error adding blog post");
      console.error(error);
   }
}

async function deleteBlog(id) {
   if (confirm("Are you sure you want to delete this blog post?")) {
      try {
         const result = await apiRequest(`/blog/${id}`, "DELETE");
         if (result.success) {
            alert("Blog post deleted!");
            loadBlogs();
         }
      } catch (error) {
         alert("Error deleting blog post");
         console.error(error);
      }
   }
}

// Contacts Functions
async function loadContacts() {
   try {
      const data = await apiRequest("/contact");
      const list = document.getElementById("contactsList");

      if (data.success && data.data.length > 0) {
         list.innerHTML = data.data
            .map(
               (item) => `
        <div class="table-item">
          <div>
            <strong>${item.name}</strong> - ${item.email}
            <p style="color: var(--text-dim); margin: 5px 0 0 0;">${item.message.substring(
               0,
               100
            )}...</p>
            <small style="color: var(--text-dim);">Status: ${item.status} • ${new Date(
                  item.createdAt
               ).toLocaleDateString()}</small>
          </div>
          <div class="table-actions">
            <button class="btn-view" onclick="viewContact('${item._id}')">View</button>
            <button class="btn-delete" onclick="deleteContact('${
               item._id
            }')">Delete</button>
          </div>
        </div>
      `
            )
            .join("");
      } else {
         list.innerHTML =
            '<p style="color: var(--text-dim);">No contact messages found.</p>';
      }
   } catch (error) {
      console.error("Error loading contacts:", error);
   }
}

async function viewContact(id) {
   try {
      const data = await apiRequest(`/contact/${id}`);
      if (data.success) {
         const item = data.data;
         const modal = document.getElementById("modal");
         const modalBody = document.getElementById("modalBody");

         modalBody.innerHTML = `
        <h2>Contact Message</h2>
        <div style="margin: 20px 0;">
          <p><strong>Name:</strong> ${item.name}</p>
          <p><strong>Email:</strong> ${item.email}</p>
          <p><strong>Phone:</strong> ${item.phone || "N/A"}</p>
          <p><strong>Project Type:</strong> ${item.projectType}</p>
          <p><strong>Date:</strong> ${new Date(item.createdAt).toLocaleString()}</p>
          <p><strong>Status:</strong> ${item.status}</p>
          <div style="margin-top: 20px;">
            <strong>Message:</strong>
            <p style="background: var(--card); padding: 15px; border-radius: 8px; margin-top: 10px;">${
               item.message
            }</p>
          </div>
        </div>
      `;

         modal.classList.add("show");
      }
   } catch (error) {
      alert("Error viewing contact");
      console.error(error);
   }
}

async function deleteContact(id) {
   if (confirm("Are you sure you want to delete this contact message?")) {
      try {
         const result = await apiRequest(`/contact/${id}`, "DELETE");
         if (result.success) {
            alert("Contact message deleted!");
            loadContacts();
         }
      } catch (error) {
         alert("Error deleting contact message");
         console.error(error);
      }
   }
}

// Modal Functions
function closeModal() {
   document.getElementById("modal").classList.remove("show");
}

// Placeholder functions for edit
function editPortfolio(id) {
   alert("Edit functionality coming soon!");
}
function editService(id) {
   alert("Edit functionality coming soon!");
}
function editTestimonial(id) {
   alert("Edit functionality coming soon!");
}
function editBlog(id) {
   alert("Edit functionality coming soon!");
}

// Initialize
loadDashboard();
