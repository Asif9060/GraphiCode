# GraphiCode - Deployment Guide

## 🌐 Production Deployment

### Option 1: Deploy Backend to Railway

1. **Create Railway Account**: https://railway.app

2. **Create New Project**:

   ```bash
   # Install Railway CLI
   npm i -g @railway/cli

   # Login
   railway login

   # Navigate to server folder
   cd server

   # Initialize Railway project
   railway init
   ```

3. **Add MongoDB**:

   -  In Railway dashboard, click "New"
   -  Select "Database" → "MongoDB"
   -  Copy the connection string

4. **Set Environment Variables**:

   ```
   MONGODB_URI=<your-railway-mongodb-connection>
   JWT_SECRET=<generate-strong-secret>
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy**:

   ```bash
   railway up
   ```

6. **Get Your Backend URL**:
   -  Example: `https://your-app.railway.app`

### Option 2: Deploy Backend to Render

1. **Create Render Account**: https://render.com

2. **Create New Web Service**:

   -  Connect your GitHub repository
   -  Select server folder
   -  Build command: `npm install`
   -  Start command: `npm start`

3. **Add Environment Variables** in Render dashboard

4. **Deploy** automatically on git push

### Option 3: Deploy Backend to Heroku

1. **Create Heroku Account**: https://heroku.com

2. **Install Heroku CLI**:

   ```bash
   npm install -g heroku
   heroku login
   ```

3. **Create Heroku App**:

   ```bash
   cd server
   heroku create your-app-name
   ```

4. **Add MongoDB Atlas**:

   -  Sign up at https://www.mongodb.com/cloud/atlas
   -  Create free cluster
   -  Get connection string
   -  Add to Heroku config vars

5. **Set Environment Variables**:

   ```bash
   heroku config:set MONGODB_URI=<your-atlas-connection>
   heroku config:set JWT_SECRET=<your-secret>
   heroku config:set NODE_ENV=production
   ```

6. **Deploy**:
   ```bash
   git push heroku main
   ```

## 🎨 Deploy Frontend

### Option 1: Netlify (Recommended)

1. **Prepare Frontend**:

   -  Update `api.js` - change `API_BASE_URL` to your deployed backend URL

   ```javascript
   const API_BASE_URL = "https://your-backend.railway.app/api";
   ```

2. **Deploy via Netlify UI**:

   -  Go to https://netlify.com
   -  Drag and drop your project folder
   -  OR connect GitHub repository

3. **Deploy via Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

### Option 2: Vercel

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 3: GitHub Pages

1. **Update API URL** in `api.js`

2. **Create `.nojekyll` file** in root

3. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Enable GitHub Pages**:
   -  Go to repository settings
   -  Pages → Source: main branch
   -  Your site: `https://username.github.io/repository`

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings

In `server/server.js`:

```javascript
app.use(
   cors({
      origin: ["https://your-frontend.netlify.app"],
      credentials: true,
   })
);
```

### 2. Update Frontend API URL

In `api.js` and `admin/admin.js`:

```javascript
const API_BASE_URL = "https://your-backend.railway.app/api";
```

### 3. Seed Production Database

```bash
# SSH into your server or use Railway CLI
railway run npm run seed

# Or for Heroku
heroku run npm run seed
```

### 4. Create Admin User

If seed doesn't work in production:

```bash
# Use MongoDB Compass or Studio 3T to manually insert admin user
# Make sure to hash the password!
```

### 5. Test Everything

-  ✅ Public website loads
-  ✅ API endpoints work
-  ✅ Admin login works
-  ✅ CRUD operations work
-  ✅ Contact form works
-  ✅ Images load properly

## 🔐 Security Checklist

-  [ ] Change default admin password
-  [ ] Use strong JWT_SECRET
-  [ ] Enable HTTPS only
-  [ ] Configure CORS properly
-  [ ] Set secure cookie flags
-  [ ] Enable rate limiting
-  [ ] Validate all inputs
-  [ ] Don't expose .env in git
-  [ ] Use MongoDB Atlas whitelist
-  [ ] Enable MongoDB authentication

## 📊 Monitoring

### Backend Monitoring

```javascript
// Add to server.js
app.get("/health", (req, res) => {
   res.json({
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date(),
   });
});
```

### Error Tracking

Consider adding:

-  Sentry (error tracking)
-  LogRocket (session replay)
-  MongoDB Atlas monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
   push:
      branches: [main]

jobs:
   deploy:
      runs-on: ubuntu-latest

      steps:
         - uses: actions/checkout@v2

         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
              node-version: "16"

         - name: Install dependencies
           run: |
              cd server
              npm install

         - name: Deploy to Railway
           run: railway up
           env:
              RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

## 📱 Domain Configuration

### Custom Domain on Netlify

1. Go to Domain settings
2. Add custom domain
3. Follow DNS configuration instructions

### Custom Domain on Railway

1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records

## 🚀 Performance Optimization

### Backend

-  Enable gzip compression
-  Add Redis caching
-  Optimize MongoDB queries
-  Use CDN for images

### Frontend

-  Minify CSS/JS
-  Optimize images
-  Enable browser caching
-  Use lazy loading

## 📈 Scaling

### Horizontal Scaling

-  Use load balancer
-  Multiple backend instances
-  MongoDB replica sets

### Vertical Scaling

-  Upgrade server resources
-  Optimize database queries
-  Add indexes to MongoDB

## 🔍 Troubleshooting

### API Not Accessible

-  Check CORS settings
-  Verify environment variables
-  Check firewall rules
-  Test with curl/Postman

### Database Connection Failed

-  Verify MongoDB URI
-  Check network access
-  Verify username/password
-  Check IP whitelist

### 502 Bad Gateway

-  Backend not running
-  Wrong port configuration
-  Memory issues
-  Check server logs

---

## 🎉 Deployment Checklist

-  [ ] Backend deployed
-  [ ] Frontend deployed
-  [ ] Database seeded
-  [ ] Admin account created
-  [ ] CORS configured
-  [ ] Environment variables set
-  [ ] Custom domain configured (optional)
-  [ ] SSL/HTTPS enabled
-  [ ] All pages work
-  [ ] Admin panel accessible
-  [ ] API endpoints tested
-  [ ] Contact form works

**Your GraphiCode website is now live! 🚀**
