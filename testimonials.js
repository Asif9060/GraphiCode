// Testimonials Page Script
document.addEventListener("DOMContentLoaded", async () => {
   const testimonialsGrid = document.querySelector(".testimonials-grid");

   if (!testimonialsGrid) return;

   // Show loading state
   testimonialsGrid.innerHTML =
      '<p style="color: var(--text-alt); text-align: center; padding: 40px; grid-column: 1/-1;">Loading testimonials...</p>';

   try {
      // Load all testimonials
      const data = await api.getTestimonials();

      if (data.success && data.data.length > 0) {
         // Render testimonials
         testimonialsGrid.innerHTML = data.data
            .map((testimonial) => {
               const stars = "⭐".repeat(testimonial.rating);
               const initials = testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2);

               return `
          <div class="testimonial-card" tabindex="0">
            <div class="star-rating">${stars}</div>
            <p class="testimonial-text">"${testimonial.testimonial}"</p>
            <div class="testimonial-author">
              <div class="author-avatar">${initials}</div>
              <div class="author-info">
                <div class="author-name">${testimonial.name}</div>
                <div class="author-title">${testimonial.position}${
                  testimonial.company ? ", " + testimonial.company : ""
               }</div>
              </div>
            </div>
          </div>
        `;
            })
            .join("");
      } else {
         testimonialsGrid.innerHTML =
            '<p style="color: var(--text-alt); text-align: center; padding: 40px; grid-column: 1/-1;">No testimonials found.</p>';
      }
   } catch (error) {
      console.error("Error loading testimonials:", error);
      testimonialsGrid.innerHTML =
         '<p style="color: var(--danger); text-align: center; padding: 40px; grid-column: 1/-1;">Error loading testimonials. Please try again later.</p>';
   }
});
