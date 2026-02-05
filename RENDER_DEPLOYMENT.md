# Render Deployment Guide

This guide will help you deploy your Cybercrime Investigation Dashboard on Render **manually** (without render.yaml).

## Prerequisites

1. A GitHub account with your code pushed
2. A Render account (sign up at https://render.com)
3. A Brevo account for email (optional but recommended)

## Step 1: Deploy PostgreSQL Database

1. Go to your Render Dashboard: https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `cybercrime-db`
   - **Database**: `cybercrime_db`
   - **User**: `cybercrime_user`
   - **Plan**: Free
   - **Region**: Oregon (or closest to you)
4. Click **"Create Database"**
5. **Copy the Internal Database URL** - you'll need this for the backend

## Step 2: Deploy Backend Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (`yashikart/cybercrime`)
3. Configure the service:
   - **Name**: `cybercrime-backend`
   - **Environment**: `Python 3`
   - **Region**: Oregon (same as database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. **Add Environment Variables** (click "Add Environment Variable" for each):
   
   **IMPORTANT**: Add this FIRST to specify Python version:
   ```
   PYTHON_VERSION=3.12.7
   ```
   
   Then add the rest:
   ```
   DATABASE_URL=<paste-internal-database-url-from-step-1>
   SECRET_KEY=<generate-a-random-secret-key-here>
   DEBUG=False
   PORT=10000
   CORS_ORIGINS=https://cybercrime-frontend.onrender.com,http://localhost:5173
   EVIDENCE_STORAGE_PATH=/opt/render/project/src/backend/evidence_storage
   BREVO_API_KEY=<your-brevo-api-key-if-using>
   OPENROUTER_API_KEY=<your-openrouter-key-if-using>
   ```

5. Click **"Create Web Service"**

6. **Wait for deployment** - Note your backend URL (e.g., `https://cybercrime-backend.onrender.com`)

## Step 3: Update Backend CORS Settings

After backend deployment, update the `CORS_ORIGINS` environment variable:
1. Go to your backend service → **Environment** tab
2. Edit `CORS_ORIGINS` to include your frontend URL:
   ```
   CORS_ORIGINS=https://cybercrime-frontend.onrender.com,https://cybercrime-backend.onrender.com
   ```
3. Save and wait for redeployment

## Step 4: Update Frontend API Configuration

**IMPORTANT**: Your frontend currently uses hardcoded `http://localhost:3000` URLs. You need to update them to use environment variables.

### Option 1: Create an API Utility (Recommended)

Create `frontend/src/lib/api.ts`:
```typescript
// API base URL - uses environment variable in production, localhost in development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

// Helper function to build API URLs
export const apiUrl = (path: string) => {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};
```

Then update your fetch calls from:
```typescript
fetch("http://localhost:3000/api/v1/complaints/")
```

To:
```typescript
import { apiUrl } from '@/lib/api';
fetch(apiUrl("complaints/"))
```

### Option 2: Quick Fix (Temporary)

For a quick deployment, you can use a global variable. Add to `frontend/src/main.tsx`:
```typescript
// Set API URL from environment variable
(window as any).API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
```

Then create a simple helper and update fetch calls accordingly.

**Note**: You'll need to update all API calls in your frontend components. Search for `"http://localhost:3000"` and replace with the environment variable approach.

## Step 5: Deploy Frontend Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect the same GitHub repository (`yashikart/cybercrime`)
3. Configure:
   - **Name**: `cybercrime-frontend`
   - **Environment**: `Node`
   - **Region**: Oregon (same as backend)
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx vite preview --host 0.0.0.0 --port $PORT`
   - **Plan**: Free

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://cybercrime-backend.onrender.com/api/v1
   PORT=10000
   ```
   *(Replace `cybercrime-backend` with your actual backend service name)*

5. Click **"Create Web Service"**

6. **Wait for deployment** - Note your frontend URL (e.g., `https://cybercrime-frontend.onrender.com`)

## Step 6: Update Frontend Environment Variable

After frontend deployment, update `VITE_API_URL`:
1. Go to frontend service → **Environment** tab
2. Update `VITE_API_URL` with your actual backend URL:
   ```
   VITE_API_URL=https://cybercrime-backend.onrender.com/api/v1
   ```
3. **Important**: After changing environment variables, you need to **manually redeploy**:
   - Go to **Manual Deploy** → **Deploy latest commit**

## Step 7: Configure Email (Brevo) - Optional

1. Sign up at https://www.brevo.com (if not already)
2. Go to Settings → API Keys
3. Create a new API key
4. Copy the key (starts with `xkeysib-...`)
5. Add it to backend environment variables as `BREVO_API_KEY`

## Important Notes

### Free Tier Limitations

- **Sleep after inactivity**: Free services sleep after 15 minutes of inactivity
- **Cold starts**: First request after sleep takes ~30 seconds
- **Database**: Free PostgreSQL has 90-day retention limit
- **Storage**: Evidence files are ephemeral on free tier (use S3 for production)

### Environment Variables Reference

**Backend Required:**
- `DATABASE_URL` - PostgreSQL connection string (from database service)
- `SECRET_KEY` - Random secret for JWT tokens
- `DEBUG` - Set to `False` for production
- `PORT` - Usually `10000` (Render sets this automatically via `$PORT`)
- `CORS_ORIGINS` - Comma-separated list of allowed origins

**Backend Optional:**
- `BREVO_API_KEY` - For email functionality
- `OPENROUTER_API_KEY` - For AI features
- `EVIDENCE_STORAGE_PATH` - File storage path

**Frontend Required:**
- `VITE_API_URL` - Backend API URL
- `PORT` - Usually `10000`

### Troubleshooting

1. **Build fails with "metadata-generation-failed" or Rust/Cargo errors**:
   - **Solution**: Add `PYTHON_VERSION=3.12.7` environment variable to your backend service
   - Render defaults to Python 3.13 which may not have pre-built wheels for all packages
   - Go to backend service → **Environment** → Add `PYTHON_VERSION=3.12.7`
   - Save and redeploy

2. **Backend won't start**:
   - Check logs in Render dashboard → **Logs** tab
   - Verify `DATABASE_URL` is correct (use Internal Database URL)
   - Ensure all required environment variables are set
   - Check if `requirements.txt` has all dependencies

2. **CORS errors**:
   - Update `CORS_ORIGINS` in backend to include frontend URL
   - Make sure URLs don't have trailing slashes
   - Restart backend service after changing env vars

3. **Database connection issues**:
   - Use **Internal Database URL** (not External) for backend
   - Format: `postgresql://user:password@host:5432/database`
   - Ensure PostgreSQL service is running

4. **Frontend can't reach backend**:
   - Verify `VITE_API_URL` matches backend URL exactly
   - Check backend is running and accessible
   - **Important**: After changing `VITE_API_URL`, manually redeploy frontend
   - Check browser console for errors

5. **Build failures**:
   - Check build logs in Render dashboard
   - Verify `requirements.txt` or `package.json` are correct
   - Check Root Directory is set correctly (`backend` or `frontend`)

### Post-Deployment Checklist

- [ ] Backend is accessible at `https://cybercrime-backend.onrender.com`
- [ ] Frontend is accessible at `https://cybercrime-frontend.onrender.com`
- [ ] Backend health check: `https://cybercrime-backend.onrender.com/health`
- [ ] Database connection is working (check backend logs)
- [ ] CORS is configured correctly (no CORS errors in browser console)
- [ ] Email service is configured (Brevo API key added)
- [ ] Superadmin account can log in
- [ ] File uploads work (evidence storage)
- [ ] API endpoints respond correctly
- [ ] Frontend can communicate with backend

### Updating Your Deployment

1. Push changes to GitHub (`git push origin main`)
2. Render automatically detects changes
3. Services rebuild automatically
4. Check deployment logs for errors
5. If environment variables changed, manually redeploy

### Getting Your Service URLs

- Backend URL: `https://cybercrime-backend.onrender.com`
- Frontend URL: `https://cybercrime-frontend.onrender.com`
- Database URL: Found in database service → **Connections** tab

### Production Considerations

1. **Use PostgreSQL**: ✅ Already configured
2. **File Storage**: For production, use AWS S3 or similar for evidence storage
3. **Environment Variables**: Never commit secrets to Git
4. **SSL**: Render provides SSL automatically
5. **Custom Domain**: You can add custom domains in Render settings
6. **Upgrade Plan**: Consider upgrading from free tier for production

## Need Help?

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Check deployment logs in Render dashboard → **Logs** tab
- Check service status in Render dashboard → **Events** tab
