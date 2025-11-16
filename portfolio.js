// Portfolio Page Script
document.addEventListener("DOMContentLoaded", async () => {
   const portfolioGrid = document.querySelector(".portfolio-grid");

   if (!portfolioGrid) return;

   // Show loading state
   portfolioGrid.innerHTML =
      '<p style="color: var(--text-alt); text-align: center; padding: 40px; grid-column: 1/-1;">Loading portfolio...</p>';

   try {
      // Load all portfolio items
      const data = await api.getPortfolio();

      if (data.success && data.data.length > 0) {
         // Render portfolio items
         portfolioGrid.innerHTML = data.data
            .map(
               (item) => `
        <div class="portfolio-item" data-category="${item.category}" tabindex="0">
          <img src="${item.image}" alt="${item.title}" loading="lazy" />
          <div class="portfolio-meta">
            <h4>${item.title}</h4>
            <p>${item.description}</p>
          </div>
        </div>
      `
            )
            .join("");

         // Setup filter functionality
         setupPortfolioFilters(data.data);
      } else {
         portfolioGrid.innerHTML =
            '<p style="color: var(--text-alt); text-align: center; padding: 40px; grid-column: 1/-1;">No portfolio items found.</p>';
      }
   } catch (error) {
      console.error("Error loading portfolio:", error);
      portfolioGrid.innerHTML =
         '<p style="color: var(--danger); text-align: center; padding: 40px; grid-column: 1/-1;">Error loading portfolio items. Please try again later.</p>';
   }
});

function setupPortfolioFilters(portfolioData) {
   const filterButtons = document.querySelectorAll(".filter-btn");
   const portfolioItems = document.querySelectorAll(".portfolio-item");

   filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
         // Update active button
         filterButtons.forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-pressed", "false");
         });
         btn.classList.add("active");
         btn.setAttribute("aria-pressed", "true");

         const filter = btn.getAttribute("data-filter");

         // Filter portfolio items
         portfolioItems.forEach((item) => {
            if (filter === "all" || item.getAttribute("data-category") === filter) {
               item.style.display = "block";
            } else {
               item.style.display = "none";
            }
         });
      });
   });
}
