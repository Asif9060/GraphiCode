# GraphiCode Backend

This directory contains the backend API for the GraphiCode website.

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Update the `.env` file with your MongoDB connection string and other settings.

### 3. Seed the Database

Run the seed script to populate the database with initial data:

```bash
npm run seed
```

### 4. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will run on `http://localhost:5000`

## Default Admin Credentials

After running the seed script:

-  **Email:** admin@graphicode.com
-  **Password:** Admin@123

⚠️ **Important:** Change these credentials in production!

## API Endpoints

### Public Endpoints

-  `GET /api/portfolio` - Get all portfolio items
-  `GET /api/services` - Get all services
-  `GET /api/testimonials` - Get all testimonials
-  `GET /api/blog` - Get published blog posts
-  `POST /api/contact` - Submit contact form

### Protected Endpoints (Require Authentication)

-  `POST /api/auth/login` - Admin login
-  `GET /api/auth/me` - Get current admin info
-  `GET /api/admin/dashboard/stats` - Get dashboard statistics
-  All CRUD operations for portfolio, services, testimonials, and blog posts

## File Structure

```
server/
├── models/          # MongoDB schemas
├── routes/          # API routes
├── middleware/      # Authentication & file upload middleware
├── config/          # Configuration files
├── uploads/         # Uploaded files
├── server.js        # Main server file
├── package.json     # Dependencies
└── .env            # Environment variables
```
