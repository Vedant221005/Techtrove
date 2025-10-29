# Tech Trove Sample App

A full-stack shopping cart application built with React, Vite, Express, and MongoDB.

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- ShadcN/UI (Tailwind-based components)
- React Router DOM

### Backend
- Node.js + Express
- MongoDB (via Mongoose)
- REST APIs

## Project Structure

```
/
├── frontend/          # React + Vite frontend
├── backend/           # Express + MongoDB backend
└── package.json       # Root workspace scripts
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```powershell
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   ```powershell
   # In backend folder
   copy .env
   ```
   Update the MongoDB connection string in `.env`

   MONGODB_URI=mongodb+srv://ranevedant05:vedant321@cluster0.smvof4e.mongodb.net/
   PORT=5001   

4. Start the development servers:
   ```powershell
   # From root directory
   npm run dev         # Starts both frontend & backend
   # Or individually:
   npm run dev:frontend  # Frontend only
   npm run dev:backend   # Backend only
   ```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start frontend only (port 5173)
- `npm run dev:backend` - Start backend only (port 5000)

## API Endpoints

- `GET /api/products` - Get all products
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:id` - Remove item from cart
- `GET /api/cart` - Get current cart
- `POST /api/checkout` - Process checkout