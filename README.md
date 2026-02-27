<<<<<<< HEAD
# School Website & Admin Dashboard

Full-stack bilingual school website with admin management system for **New High School, Kolhapur**.

## 🚀 Tech Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express.js
- **Database**: MySQL
- **Languages**: English & Marathi (i18n)
- **Styling**: Modern CSS with design system

## 📁 Project Structure

```
School Project/
├── client/          # React frontend
├── server/          # Node.js backend
└── database/        # SQL schema
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- npm or yarn

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database and import schema
source d:/School\ Project/database/schema.sql
```

**Important**: Update the admin password hash in `database/schema.sql`:

```bash
cd server
node src/utils/hashPassword.js admin123
# Copy the generated hash and update the INSERT statement in schema.sql
```

### 2. Backend Setup

```bash
cd server

# Install dependencies (already done)
npm install

# Configure environment variables
# Edit .env file with your MySQL credentials:
# - DB_USER
# - DB_PASSWORD
# - DB_NAME

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client

# Install dependencies (already done)
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## 📚 API Endpoints

### Public Endpoints
- `GET /api/faculty` - Get all faculty
- `GET /api/events` - Get published events
- `GET /api/gallery` - Get gallery images
- `GET /api/announcements/active` - Get active announcements
- `POST /api/admissions` - Submit admission request
- `POST /api/contact` - Submit contact message

### Admin Endpoints (Require Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- All CRUD operations for faculty, events, gallery, etc.

## 🔐 Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

**⚠️ Change these credentials in production!**

## 🎨 Design System

The project uses a premium design system with:
- Vibrant color palette (Blue & Orange)
- Modern typography (Inter, Outfit fonts)
- Smooth animations and transitions
- Responsive grid system
- Reusable component styles

## 📝 Current Progress

### ✅ Completed
- [x] Project initialization
- [x] Database schema with all tables
- [x] Complete backend API (all modules)
- [x] Authentication system (JWT)
- [x] File upload handling
- [x] Frontend folder structure
- [x] i18n configuration (EN/MR)
- [x] API service layer
- [x] Premium design system

### 🚧 In Progress
- [ ] Frontend components (Navbar, Footer, etc.)
- [ ] Public website pages
- [ ] Admin dashboard pages

### ⏳ To Do
- [ ] Testing
- [ ] Deployment preparation

## 🌐 Features

### Public Website
- Bilingual support (English/Marathi)
- Dynamic homepage with announcements
- Faculty profiles
- Events & news
- Image gallery
- Admission form
- Contact form

### Admin Dashboard
- Secure login
- Faculty management (CRUD)
- Events & news management
- Gallery management
- View admission requests
- View contact messages
- Announcements management

## 📦 Dependencies

### Backend
- express, cors, dotenv
- mysql2
- jsonwebtoken, bcryptjs
- multer (file uploads)
- express-validator

### Frontend
- react, react-dom
- react-router-dom
- react-i18next
- axios
- react-hook-form

## 🛠️ Development

```bash
# Backend development
cd server
npm run dev

# Frontend development
cd client
npm run dev
```

## 📄 License

© 2026 New High School, Kolhapur. All rights reserved.
=======
# School_Project
>>>>>>> bc0fc2572331a02208fc6d83c6f45e48deea9536
