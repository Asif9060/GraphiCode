// Blog Page Script
document.addEventListener("DOMContentLoaded", async () => {
   const blogContainer = document.querySelector(".blog main section > div");

   if (!blogContainer) return;

   // Show loading state
   blogContainer.innerHTML =
      '<p style="color: var(--text-alt); text-align: center; padding: 40px; grid-column: 1/-1;">Loading blog posts...</p>';

   try {
      // Load all blog posts
      const data = await api.getBlogs();

      if (data.success && data.data.length > 0) {
         // Render blog posts
         blogContainer.innerHTML = data.data
            .map((blog) => {
               const date = new Date(blog.publishDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
               });

               return `
          <article class="card-surface" style="padding: 0; overflow: hidden; cursor: pointer; transition: transform 0.3s ease, box-shadow 0.3s ease;" onmouseover="this.style.transform='translateY(-5px)'" onmouseout="this.style.transform='translateY(0)'">
            <img src="${blog.featuredImage}" alt="${blog.title}" style="width: 100%; height: 200px; object-fit: cover;" loading="lazy" />
            <div style="padding: 25px;">
              <p class="muted" style="font-size: 0.85rem; margin-bottom: 10px;">${date}</p>
              <h3 style="margin-bottom: 10px; font-size: 1.3rem;">${blog.title}</h3>
              <p class="muted" style="margin-bottom: 15px;">${blog.excerpt}</p>
              <a href="#" style="color: var(--accent); text-decoration: none; font-weight: 600;" data-slug="${blog.slug}">Read More →</a>
            </div>
          </article>
        `;
            })
            .join("");

         // Add click handlers for read more links
         document.querySelectorAll("[data-slug]").forEach((link) => {
            link.addEventListener("click", async (e) => {
               e.preventDefault();
               const slug = link.dataset.slug;
               // For now, just alert. Could be expanded to show blog detail
               alert(`Opening blog post: ${slug}\nFull blog detail page coming soon!`);
            });
         });
      } else {
         blogContainer.innerHTML =
            '<p style="color: var(--text-alt); text-align: center; padding: 40px; grid-column: 1/-1;">No blog posts found.</p>';
      }
   } catch (error) {
      console.error("Error loading blog posts:", error);
      blogContainer.innerHTML =
         '<p style="color: var(--danger); text-align: center; padding: 40px; grid-column: 1/-1;">Error loading blog posts. Please try again later.</p>';
   }
});
