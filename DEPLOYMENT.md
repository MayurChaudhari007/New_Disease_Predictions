# Deployment Guide

This guide outlines the complete process to deploy the MediPredict ecosystem to production.

## Architecture Overview
The system consists of three separate microservices that need to be deployed:
1. **MongoDB Atlas**: Cloud Database.
2. **ML Service (FastAPI)**: Python backend handling AI predictions.
3. **Server (Express)**: Node.js API handling users, reports, and database logic.
4. **Client (React)**: Frontend UI.

---

## Step 1: Deploy MongoDB Atlas
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and add `0.0.0.0/0` (Allow Access from Anywhere). Vercel requires this since its IP addresses are dynamic.
3. Go to **Database Access** and create a user with read/write privileges.
4. Get your connection string (Select "Connect your application", Node.js driver).

---

## Step 2: Deploy ML Service (Vercel)
*Wait until your Vercel deployment completes to get the URL for the next step.*

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New... > Project**.
3. Import your GitHub repository.
4. Edit the **Root Directory** to `ml-service`.
5. Ensure the framework preset is set to **Other**.
6. Click **Deploy**.
7. *Note*: The `vercel.json` file inside `ml-service` automatically configures the `@vercel/python` builder.
8. Copy the generated domain name (e.g., `https://medipredict-ml.vercel.app`).

---

## Step 3: Deploy Server / Express API (Vercel)
1. In Vercel, click **Add New... > Project**.
2. Import the *same* GitHub repository again.
3. Edit the **Root Directory** to `server`.
4. Ensure the framework preset is set to **Other**.
5. Add the following **Environment Variables**:
   - `PORT`: `5000` (Optional on Vercel)
   - `MONGO_URI`: `your_mongodb_atlas_connection_string` (From Step 1)
   - `JWT_SECRET`: `a_strong_random_secret_string`
   - `ML_SERVICE_URL`: `https://your-deployed-ml-url.vercel.app` (From Step 2)
6. Click **Deploy**.
7. Copy the generated domain name (e.g., `https://medipredict-server.vercel.app`).

---

## Step 4: Deploy Client / React App (Vercel)
1. In Vercel, click **Add New... > Project**.
2. Import the *same* GitHub repository a third time.
3. Edit the **Root Directory** to `client`.
4. Ensure the framework preset is set to **Vite**.
5. Add the following **Environment Variables**:
   - `VITE_API_URL`: `https://your-deployed-server-url.vercel.app/api` (From Step 3)
6. Click **Deploy**.

## Post-Deployment Verification
Visit your frontend Vercel URL. You should be able to create an account, log in, generate a new prediction, and view your history seamlessly.
