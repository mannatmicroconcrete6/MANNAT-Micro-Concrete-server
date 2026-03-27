# Mannat Micro Concrete - Server API

This is the backend server for the Mannat Micro Concrete web application. It handles authentication, lead management, analytics, and integrations with third-party services like Cloudinary, SendGrid, and WhatsApp.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose)
- **Authentication:** JWT (JSON Web Tokens)
- **Services:** Cloudinary (Media), SendGrid (Email), Meta WhatsApp API

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- NPM or Yarn
- MongoDB instance (Local or Atlas)

### 2. Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 3. Environment variables

1. Copy the `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in the required credentials in the `.env` file.

### 4. Running the server

Start the server in development mode:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`.

## 📂 Project Structure

- `controllers/`: Request handlers for API routes.
- `models/`: Mongoose schemas and data models.
- `routes/`: API endpoint definitions.
- `middleware/`: Authentication and error handling middleware.
- `config/`: Database and external service configurations.
- `utils/`: Helper scripts for email, WhatsApp, and Cloudinary.
- `seedAdmin.js`: Script to initialize the admin user.

---
*Developed for Mannat Micro Concrete.*
