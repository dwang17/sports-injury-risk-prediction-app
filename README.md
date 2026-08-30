# LoadSense - Sports Injury Risk Prediction

Model was creating in scikit-learn 1.6.1, and Python 3.12 must be used for this application

Creating Environment
Version check: py -3.12 --version
py -3.12 -m venv venv
source venv/Scripts/activate

Run backend:
uvicorn app.main:app --reload

Input Validation:
API inputs are restricted to the value ranges represented in the model's training dataset. This helps prevent predictions on out-of-distribution inputs the model was not trained to handle. Missing values are supported and handled by the model's preprocessing pipeline.

## Deployment

This application is structured for deployment with the frontend on Vercel and the backend on Render.

### Render Backend Configuration

- **Service Type:** Web Service
- **Root Directory:** backend
- **Build Command:** pip install -r requirements.txt
- **Start Command:** uvicorn app.main:app --host 0.0.0.0 --port $PORT
- **Health Check Path:** /health
- **Environment Variable:**
  - `FRONTEND_URL=https://your-vercel-domain.vercel.app` (set after deploying the frontend)

### Vercel Frontend Configuration

- **Root Directory:** frontend
- **Framework:** Next.js
- **Environment Variable:**
  - `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com`

### Deployment Order

1. Deploy the backend on Render.
2. Test the health check at `/health`, explore API docs at `/docs`, and verify predictions with a test POST to `/predict`.
3. Deploy the frontend on Vercel using the Render backend URL.
4. Add the Vercel production URL to the `FRONTEND_URL` environment variable on Render.
5. Redeploy the backend on Render and test the complete application end-to-end.

**Note:** Render's free tier services may spin down after inactivity. The first prediction request after a period of inactivity may be slower than usual.

**Important:** Do not include trailing slashes in the `FRONTEND_URL` or `NEXT_PUBLIC_API_URL` environment variables. Both values should be normalized without trailing slashes.
