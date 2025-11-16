const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("../models/Admin");
const Portfolio = require("../models/Portfolio");
const Service = require("../models/Service");
const Testimonial = require("../models/Testimonial");
const Blog = require("../models/Blog");

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/graphicode", {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

const seedData = async () => {
   try {
      // Clear existing data
      await Admin.deleteMany();
      await Portfolio.deleteMany();
      await Service.deleteMany();
      await Testimonial.deleteMany();
      await Blog.deleteMany();

      console.log("🗑️  Data cleared...");

      // Create admin user
      await Admin.create({
         name: "Admin",
         email: process.env.ADMIN_EMAIL || "admin@graphicode.com",
         password: process.env.ADMIN_PASSWORD || "Admin@123",
         role: "superadmin",
      });

      console.log("✅ Admin created");

      // Create Services
      await Service.insertMany([
         {
            title: "Web Development",
            icon: "W",
            shortDescription: "Responsive, fast, CMS-ready websites",
            fullDescription:
               "Build fast, responsive websites that convert visitors into customers. From landing pages to full-scale platforms.",
            features: [
               "Responsive Design",
               "SEO Optimized",
               "Fast Performance",
               "Mobile First",
               "CMS Integration",
            ],
            order: 1,
            isActive: true,
         },
         {
            title: "Branding",
            icon: "G",
            shortDescription: "Logos, identity, print design",
            fullDescription:
               "Create a memorable brand identity that stands out. We design logos, visual systems, and print materials.",
            features: [
               "Logo Design",
               "Brand Guidelines",
               "Visual Identity",
               "Print Materials",
               "Brand Strategy",
            ],
            order: 2,
            isActive: true,
         },
         {
            title: "Apps",
            icon: "A",
            shortDescription: "Mobile & Progressive Web Apps",
            fullDescription:
               "Native and cross-platform apps that engage users and drive business growth on all devices.",
            features: [
               "iOS & Android",
               "Progressive Web Apps",
               "Cross-Platform",
               "Real-time Apps",
               "App Maintenance",
            ],
            order: 3,
            isActive: true,
         },
      ]);

      console.log("✅ Services created");

      // Create Portfolio Items
      await Portfolio.insertMany([
         {
            title: "Startup Site",
            description: "E-commerce landing page",
            category: "web",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
            technologies: ["React", "Node.js", "MongoDB"],
            featured: true,
            order: 1,
            isActive: true,
         },
         {
            title: "Design System",
            description: "Component library for modern brands",
            category: "branding",
            image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
            technologies: ["Figma", "Sketch", "Adobe XD"],
            featured: true,
            order: 2,
            isActive: true,
         },
         {
            title: "Mobile App UI",
            description: "User flows & interactive prototypes",
            category: "apps",
            image: "https://images.unsplash.com/photo-1508385082359-fc8b6f79b2c5?q=80&w=1200&auto=format&fit=crop",
            technologies: ["React Native", "Flutter"],
            featured: true,
            order: 3,
            isActive: true,
         },
      ]);

      console.log("✅ Portfolio items created");

      // Create Testimonials
      await Testimonial.insertMany([
         {
            name: "Tasneem",
            position: "CEO",
            company: "BrightTech",
            rating: 5,
            testimonial:
               "GraphiCode transformed our website into a stunning platform. Their attention to detail and creative approach exceeded our expectations.",
            featured: true,
            order: 1,
            isActive: true,
         },
         {
            name: "Asif",
            position: "Product Manager",
            company: "TechVision",
            rating: 5,
            testimonial:
               "Their team delivered fast and quality branding work. Professional and responsive throughout the entire process.",
            featured: true,
            order: 2,
            isActive: true,
         },
         {
            name: "Naim",
            position: "Startup Founder",
            company: "NextGen Apps",
            rating: 5,
            testimonial:
               "Highly recommend for app development and support. They understood our vision perfectly and created something remarkable.",
            featured: true,
            order: 3,
            isActive: true,
         },
      ]);

      console.log("✅ Testimonials created");

      // Create Blog Posts
      await Blog.insertMany([
         {
            title: "Top 5 Web Design Trends in 2025",
            excerpt:
               "A quick look at emerging styles shaping the web design world this year.",
            content:
               "Web design continues to evolve rapidly. In 2025, we are seeing trends that prioritize user experience, performance, and accessibility more than ever before...",
            featuredImage:
               "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
            author: "GraphiCode Team",
            category: "web-design",
            tags: ["trends", "design", "2025"],
            published: true,
            featured: true,
            publishDate: new Date("2025-11-10"),
         },
         {
            title: "How Branding Impacts Your Business",
            excerpt:
               "Discover the power of a strong brand identity and how to build one.",
            content:
               "Branding is more than just a logo. It is the complete experience your customers have with your business...",
            featuredImage:
               "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1200&auto=format&fit=crop",
            author: "GraphiCode Team",
            category: "branding",
            tags: ["branding", "business", "identity"],
            published: true,
            featured: false,
            publishDate: new Date("2025-11-05"),
         },
      ]);

      console.log("✅ Blog posts created");

      console.log("\n✅ Database seeded successfully!");
      console.log("\n📧 Admin Login:");
      console.log(`   Email: ${process.env.ADMIN_EMAIL || "admin@graphicode.com"}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD || "Admin@123"}`);

      process.exit(0);
   } catch (error) {
      console.error("❌ Error seeding data:", error);
      process.exit(1);
   }
};

seedData();
