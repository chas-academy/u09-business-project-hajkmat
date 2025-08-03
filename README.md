# Hajkmat Business Project

This is a full-stack web application for managing and sharing hiking recipes and recipe lists. The project is built with a React + Vite frontend and a Node.js + Express + MongoDB backend.

https://hajkmat.netlify.app/

## Features
- User authentication (login, protected routes)
- Create, view, and delete recipe lists
- Add and remove recipes from lists
- Search for recipes using filters (cuisine, diet, meal type)
- Responsive and mobile-friendly design
- Modal for viewing all recipes in a list

## Technologies
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, Passport.js
- **API:** Spoonacular (for recipe search)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/chas-academy/u09-business-project-hajkmat.git
   cd u09-business-project-hajkmat
   ```
2. Install dependencies for both frontend and backend:
   ```bash
   cd backend
   npm install
   cd ../frontend/hajkmat-frontend
   npm install
   ```
3. Set up environment variables:
   - Backend: Create a `.env` file in `backend/` with your MongoDB URI and JWT secret.
   - Frontend: Add your Spoonacular API key to `.env` in `frontend/hajkmat-frontend/`.

### Running Locally
- **Backend:**
  ```bash
  cd backend
  npm run dev
  ```
- **Frontend:**
  ```bash
  cd frontend/hajkmat-frontend
  npm run dev
  ```
- Visit `http://localhost:5173` in your browser.

## Folder Structure
```
backend/
  api/
    controllers/
    models/
    routes/
    ...
frontend/
  hajkmat-frontend/
    src/
      components/
      hooks/
      services/
      ...
```

## Deployment
- The project can be deployed on platforms like Render (backend) and Netlify/Vercel (frontend).
- Make sure to set environment variables in your deployment settings.


## Figma
https://www.figma.com/design/DRReyBRFgGgPKhP8jtifPe/Hajkmat-U09?node-id=0-1&t=64K4NsVOISgb6JHv-1
