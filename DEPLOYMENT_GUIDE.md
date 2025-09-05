# Production Deployment Guide

## 🚀 Backend Deployment Status
✅ **Backend is deployed and running at:** [https://ev-project-aymy.onrender.com](https://ev-project-aymy.onrender.com)

## 📱 Frontend Deployment Options

### Option 1: Deploy to Vercel (Recommended)

#### For User Frontend (ev-user):
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Set the **Root Directory** to `frontend/ev-user`
5. Set **Build Command** to `npm run build`
6. Set **Output Directory** to `dist`
7. Add Environment Variables:
   - `VITE_API_BASE_URL` = `https://ev-project-aymy.onrender.com`
8. Click "Deploy"

#### For Admin Frontend (ev-admin):
1. Create another project in Vercel
2. Import the same GitHub repository
3. Set the **Root Directory** to `frontend/ev-admin/project`
4. Set **Build Command** to `npm run build`
5. Set **Output Directory** to `dist`
6. Add Environment Variables:
   - `VITE_API_BASE_URL` = `https://ev-project-aymy.onrender.com`
7. Click "Deploy"

### Option 2: Deploy to Netlify

#### For User Frontend:
1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "New site from Git"
3. Choose your repository
4. Set **Base directory** to `frontend/ev-user`
5. Set **Build command** to `npm run build`
6. Set **Publish directory** to `dist`
7. Add Environment Variables in Site Settings:
   - `VITE_API_BASE_URL` = `https://ev-project-aymy.onrender.com`
8. Click "Deploy site"

#### For Admin Frontend:
1. Create another site in Netlify
2. Set **Base directory** to `frontend/ev-admin/project`
3. Follow the same steps as above

### Option 3: Deploy to GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. Create `.github/workflows/deploy.yml` files for each frontend

## 🔧 Local Testing Before Deployment

Test your frontend applications locally with the production backend:

```bash
# Test User Frontend
cd frontend/ev-user
npm run build
npm run preview

# Test Admin Frontend
cd frontend/ev-admin/project
npm run build
npm run preview
```

## 📋 Post-Deployment Checklist

After deploying your frontends:

1. **Update Backend CORS**: Add your deployed frontend URLs to the CORS configuration
2. **Test API Integration**: Verify that frontend can communicate with backend
3. **Test Authentication**: Ensure login/register functionality works
4. **Test Core Features**: Verify station search, booking, and payment flows
5. **Update Documentation**: Update any hardcoded URLs in your documentation

## 🔄 Continuous Deployment

Once deployed, your applications will automatically redeploy when you push changes to your GitHub repository.

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your backend CORS configuration includes your deployed frontend URLs
2. **API Connection Failed**: Check if your backend is running and accessible
3. **Build Failures**: Ensure all dependencies are properly installed
4. **Environment Variables**: Verify that environment variables are set correctly in your hosting platform

### Testing Your Deployment:

1. **Backend API**: Visit [https://ev-project-aymy.onrender.com/api-docs](https://ev-project-aymy.onrender.com/api-docs) for Swagger documentation
2. **Frontend Apps**: Test all major functionality after deployment
3. **Cross-Origin Requests**: Verify that frontend can make API calls to backend

## 📞 Support

If you encounter any issues during deployment, check:
- Your hosting platform's documentation
- Browser console for errors
- Network tab for failed API requests
- Backend logs for server-side errors
