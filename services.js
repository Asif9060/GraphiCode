// Services Page Script
document.addEventListener("DOMContentLoaded", async () => {
   const servicesContainer = document.querySelector(".services-container");

   if (!servicesContainer) return;

   // Show loading state
   servicesContainer.innerHTML =
      '<p style="color: var(--text-alt); text-align: center; padding: 40px; grid-column: 1/-1;">Loading services...</p>';

   try {
      // Load all services
      const data = await api.getServices();

      if (data.success && data.data.length > 0) {
         // Render services
         servicesContainer.innerHTML = data.data
            .map(
               (service) => `
        <article class="service-card" tabindex="0">
          <div class="service-icon">${service.icon}</div>
          <div class="service-content">
            <h3>${service.title}</h3>
            <p class="muted">${service.fullDescription || service.shortDescription}</p>
            ${
               service.features && service.features.length > 0
                  ? `
              <ul class="service-list">
                ${service.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
            `
                  : ""
            }
          </div>
        </article>
      `
            )
            .join("");
      } else {
         servicesContainer.innerHTML =
            '<p style="color: var(--text-alt); text-align: center; padding: 40px; grid-column: 1/-1;">No services found.</p>';
      }
   } catch (error) {
      console.error("Error loading services:", error);
      servicesContainer.innerHTML =
         '<p style="color: var(--danger); text-align: center; padding: 40px; grid-column: 1/-1;">Error loading services. Please try again later.</p>';
   }
});
