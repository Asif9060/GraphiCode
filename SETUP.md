# GraphiCode - Quick Setup Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Start MongoDB

Make sure MongoDB is running locally on port 27017, or update the `.env` file with your MongoDB Atlas connection string.

### Step 3: Seed the Database

```bash
npm run seed
```

This creates:

-  ✅ Admin user (admin@graphicode.com / Admin@123)
-  ✅ 3 Portfolio items
-  ✅ 3 Services
-  ✅ 3 Testimonials
-  ✅ 2 Blog posts

### Step 4: Start the Backend Server

```bash
npm run dev
```

Server running at: http://localhost:5000

### Step 5: Open the Frontend

Open `index.html` in your browser or use:

```bash
# From project root
python -m http.server 8000
```

Website: http://localhost:8000

### Step 6: Access Admin Panel

1. Go to: http://localhost:8000/admin/login.html
2. Login with: admin@graphicode.com / Admin@123
3. Start managing content!

## 📝 What You Can Do Now

### Public Website

-  ✅ View dynamic portfolio items
-  ✅ See services offered
-  ✅ Read client testimonials
-  ✅ Browse blog posts
-  ✅ Submit contact form

### Admin Panel

-  ✅ Add/Edit/Delete portfolio projects
-  ✅ Manage services
-  ✅ Control testimonials
-  ✅ Write & publish blog posts
-  ✅ View contact submissions
-  ✅ Dashboard statistics

## 🔧 Common Issues

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Make sure MongoDB is running

```bash
# Start MongoDB
mongod
```

### API Not Loading

```
Failed to fetch
```

**Solution**:

1. Check if backend is running on port 5000
2. Verify CORS is enabled
3. Check browser console for errors

### Can't Login to Admin

**Solution**:

1. Make sure you ran `npm run seed`
2. Use exact credentials: admin@graphicode.com / Admin@123
3. Check browser console for errors

## 📚 Next Steps

1. **Change Admin Password**: First thing after login!
2. **Add Your Content**: Replace sample data with real content
3. **Customize Design**: Modify CSS in `home.css` and `admin.css`
4. **Deploy**: Follow deployment guide in README.md

## 🎯 Key Features Implemented

### Backend

-  ✅ RESTful API with Express
-  ✅ MongoDB integration with Mongoose
-  ✅ JWT authentication
-  ✅ File upload support
-  ✅ Input validation
-  ✅ Error handling

### Admin Panel

-  ✅ Secure login system
-  ✅ Dashboard with statistics
-  ✅ Full CRUD operations
-  ✅ Form validation
-  ✅ Modal-based editing
-  ✅ Responsive design

### Frontend

-  ✅ Dynamic content loading
-  ✅ API integration
-  ✅ Category filtering
-  ✅ Contact form submission
-  ✅ Responsive design
-  ✅ Dark/Light theme toggle

## 📞 Need Help?

Check these files:

-  `README.md` - Full documentation
-  `server/README.md` - Backend details
-  `.env` - Configuration
-  Browser console - Frontend errors
-  Server console - Backend errors

---

**Happy Coding! 🎉**
