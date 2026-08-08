# MediPredict - Server (Express API)

This directory contains the main REST API backend that bridges the React client, the MongoDB database, and the Python ML Service.

## Features
- JWT Authentication and Password Hashing (bcryptjs)
- RESTful endpoints for user profiles and diagnostic reports
- Internal proxy requests to the FastAPI Machine Learning service
- Centralized error handling and logging (morgan, helmet)

## Setup
```bash
npm install
```

## Environment Variables
Create a `.env` file in this directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/disease_prediction
JWT_SECRET=your_jwt_secret
ML_SERVICE_URL=http://localhost:8000
```

## Development
```bash
npm run dev
```

## Production
For local production mode:
```bash
npm start
```
For Vercel deployment, the entry point is routed through `api/index.js` to ensure the database connects in a serverless environment.
