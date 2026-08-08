# MediPredict - Client (Frontend)

This directory contains the React frontend for the MediPredict application, built with Vite and Tailwind CSS.

## Features
- Fully responsive modern UI
- SPA Routing via React Router DOM
- Secure JWT token handling in Local Storage
- PDF Generation using `html2pdf.js`
- Mobile-first off-canvas Sidebar

## Setup
```bash
npm install
```

## Environment Variables
Create a `.env` file in this directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## Development
```bash
npm run dev
```

## Production Build
```bash
npm run build
```
This generates the optimized static files in the `/dist` directory.
