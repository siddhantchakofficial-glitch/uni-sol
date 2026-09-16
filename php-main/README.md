# 🛡️ UniSpark Innovation — Full-Stack Security Systems CMS & Website

A modern, full-stack enterprise web application and Content Management System (CMS) built for **UniSpark Innovation Security Systems & Equipment Trading L.L.C (UAE)**.

---

## 📌 Table of Contents

- [1. Project Architecture & Overview](#1-project-architecture--overview)
- [2. Complete Folder Structure](#2-complete-folder-structure)
- [3. Installation & Setup Guide (Clone / Copy)](#3-installation--setup-guide-clone--copy)
- [4. Environment Variables Configuration](#4-environment-variables-configuration)
- [5. How to Run the Applications](#5-how-to-run-the-applications)
- [6. Authentication & Login Overview](#6-authentication--login-overview)
- [7. CMS Sections & Features](#7-cms-sections--features)
- [8. Data Flow & Live Sync Mechanism](#8-data-flow--live-sync-mechanism)
- [9. REST API Reference](#9-rest-api-reference)
- [10. Troubleshooting & Common Issues](#10-troubleshooting--common-issues)

---

## 1. Project Architecture & Overview

The repository is organized into three distinct, decoupled applications:

```
                          ┌────────────────────────────────────────────────────────┐
                          │                ADMIN PANEL (Port 5173)                 │
                          │   React 18 + Vite + Lucide Icons + Dark Theme Design   │
                          │      Full Visual CMS for all pages and components      │
                          └───────────────────────────┬────────────────────────────┘
                                                      │  REST API (JSON / Multipart)
                                                      ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             BACKEND API (Port 5000)                              │
│          Node.js + Express.js + Mongoose ORM + JWT Auth + Bcrypt Hashing          │
│                      MongoDB Atlas Database + Cloudinary CDN                     │
└─────────────────────────────────────────────┬────────────────────────────────────┘
                                              │  Live Polling (8s) + Focus Refresh
                                              ▼
                          ┌────────────────────────────────────────────────────────┐
                          │               PUBLIC WEBSITE (Port 3001)               │
                          │    React 18 + Vite + Tailwind CSS + FontAwesome + SEO  │
                          │          Dynamic Public Website for UAE Customers      │
                          └────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend Website (`unise-php`)** | React 18, Vite, React Router v6, Tailwind CSS, FontAwesome 6, Lucide React |
| **Admin Panel (`admin`)** | React 18, Vite, Lucide React, Custom Dark Theme CSS Design System |
| **Backend API (`backend`)** | Node.js, Express.js, Mongoose, MongoDB Atlas, Cloudinary SDK, JWT, BcryptJS |
| **Database** | MongoDB Atlas (Cloud) with graceful in-memory fallback |
| **Storage / Media** | Cloudinary Image CDN + Base64 fallback |

---

## 2. Complete Folder Structure

```
php/                                        ← Root Workspace
├── README.md                               ← Main Project Documentation (this file)
│
├── 📁 admin/                               ← CMS Admin Panel Application
│   ├── index.html                          ← HTML Entry
│   ├── package.json                        ← Dependencies & Scripts
│   ├── vite.config.js                      ← Vite Build Config (Port 5173)
│   └── src/
│       ├── main.jsx                        ← React Root Mount
│       ├── App.jsx                         ← Router, Auth Guards & Layout Wrapper
│       ├── index.css                       ← Global Admin Dark Theme & CSS Tokens
│       │
│       ├── components/                     ← Shared Admin UI Components
│       │   ├── Header.jsx                  ← Top Navigation Bar (Logo, Theme, Profile)
│       │   ├── Sidebar.jsx                 ← Left Sidebar (Dashboard, Website, Users, Enquiries)
│       │   ├── AuthModal.jsx               ← User Switch / Re-login Modal
│       │   └── Toast.jsx                   ← Global Floating Toast Notification
│       │
│       ├── views/                          ← Visual CMS Page Editors
│       │   ├── DashboardView.jsx           ← Main Dashboard with all Page Cards & Live Links
│       │   ├── LoginPage.jsx               ← Secure Login & Registration Screen
│       │   ├── HeaderEditor.jsx            ← Header Navigation & Logo Editor
│       │   ├── Home.jsx                    ← Homepage Hero, Stats & Partners CMS
│       │   ├── About.jsx                   ← About Us Page CMS (Story, Team, Milestones)
│       │   ├── SolutionsEditor.jsx         ← 9 Solutions Cards + Full Inside Page Modal CMS
│       │   ├── IndustriesEditor.jsx        ← Industry Cards + Full Inside Page Modal CMS
│       │   ├── ContactEditor.jsx           ← Contact Information & Map Settings
│       │   ├── FooterEditor.jsx            ← Footer CMS (Brand, Social, Links, Contact, Copyright)
│       │   ├── UserManagementView.jsx      ← Admin User CRUD & Role Permissions
│       │   ├── ContactMessages.jsx         ← Form Submissions & Inquiries Inbox
│       │   └── GenericSectionEditor.jsx    ← Fallback Section Editor
│       │
│       └── services/
│           └── api.js                      ← Centralized Backend API Client (`http://localhost:5000/api`)
│
├── 📁 backend/                             ← Node.js & Express REST API Server
│   ├── server.js                           ← Express Server Entry & Route Registrations
│   ├── package.json                        ← Dependencies & Scripts
│   ├── .env                                ← Environment Variables (Mongo URI, Cloudinary, Port)
│   │
│   ├── config/
│   │   ├── db.js                           ← MongoDB Atlas Connection with Auto-Reconnection
│   │   └── cloudinary.js                   ← Cloudinary Media Upload Client
│   │
│   ├── models/                             ← Mongoose Schemas (MongoDB Collections)
│   │   ├── User.js                         ← User Schema (Name, Email, Password Hash, Role, Status)
│   │   ├── HeaderConfig.js                 ← Header Navigation Schema
│   │   ├── HeroConfig.js                   ← Homepage Hero Schema
│   │   ├── Section2Config.js               ← Stats & Key Differentiators Schema
│   │   ├── Section3Config.js               ← Solutions & Full Inside Pages Schema
│   │   ├── Section4Config.js               ← Partner Logos Strip Schema
│   │   ├── Section5Config.js               ← Industries & Full Inside Pages Schema
│   │   ├── Section6Config.js               ← Why Us & CTA Section Schema
│   │   ├── FooterConfig.js                 ← Footer (Brand, Social, Columns, Contact Strip) Schema
│   │   ├── PartnerConfig.js                ← Partner Brands Schema
│   │   └── StatsConfig.js                  ← Company Stats Counter Schema
│   │
│   ├── controllers/                        ← Business Logic (GET auto-seed + PUT updates)
│   │   ├── authController.js               ← User Registration, Login & JWT Generation
│   │   ├── userController.js               ← User CRUD Operations
│   │   ├── headerController.js             ← Header Read/Write
│   │   ├── heroController.js               ← Hero Read/Write
│   │   ├── section2Controller.js           ← Section 2 Read/Write
│   │   ├── section3Controller.js           ← Solutions & Inside Page CMS + Cloudinary Media
│   │   ├── section4Controller.js           ← Section 4 Read/Write
│   │   ├── section5Controller.js           ← Industries & Inside Page CMS + Cloudinary Media
│   │   ├── section6Controller.js           ← Section 6 Read/Write
│   │   ├── footerController.js             ← Footer Read/Write + Cloudinary Logo
│   │   ├── partnerController.js            ← Partner Logos Read/Write
│   │   └── statsController.js              ← Stats Counters Read/Write
│   │
│   ├── routes/                             ← Express Router Definitions
│   │   ├── authRoutes.js                   ← `/api/auth`
│   │   ├── userRoutes.js                   ← `/api/users`
│   │   ├── headerRoutes.js                 ← `/api/header`
│   │   ├── heroRoutes.js                   ← `/api/hero`
│   │   ├── section2Routes.js               ← `/api/section2`
│   │   ├── section3Routes.js               ← `/api/section3` (Solutions)
│   │   ├── section4Routes.js               ← `/api/section4` (Partners)
│   │   ├── section5Routes.js               ← `/api/section5` (Industries)
│   │   ├── section6Routes.js               ← `/api/section6` (Why Us)
│   │   ├── footerRoutes.js                 ← `/api/footer`
│   │   ├── partnerRoutes.js                ← `/api/partners`
│   │   └── statsRoutes.js                  ← `/api/stats`
│   │
│   ├── about/                              ← Co-located About Module
│   │   ├── AboutConfig.js                  ← About Page Mongoose Schema
│   │   ├── aboutController.js              ← About Page Logic & Image Upload
│   │   └── aboutRoutes.js                  ← `/api/about`
│   │
│   └── contact/                            ← Co-located Contact Module
│       ├── ContactConfig.js                ← Contact Info Schema
│       ├── ContactMessage.js               ← Customer Inquiry Form Schema
│       ├── contactController.js            ← Inquiries Submission & Fetch Handlers
│       └── contactRoutes.js                ← `/api/contact`
│
└── 📁 unise-php/                           ← Public Frontend Website Application
    ├── index.html                          ← HTML Document Entry
    ├── package.json                        ← Dependencies & Scripts
    ├── tailwind.config.js                  ← Tailwind CSS Configuration
    ├── vite.config.js                      ← Vite Config (Port 3001)
    ├── public/
    │   └── images/                         ← Static Vector & Logo Assets
    └── src/
        ├── main.jsx                        ← React Root Mount
        ├── App.jsx                         ← React Router v6 Page Routes & Modal Providers
        ├── index.css                       ← Tailwind Styles & Custom UI Animations
        │
        ├── components/                     ← Reusable UI Section Components
        │   ├── Header.jsx                  ← Main Site Navigation with Floating Actions
        │   ├── Footer.jsx                  ← Dynamic Footer (Fetches from `/api/footer`)
        │   ├── HeroSection.jsx             ← Homepage Hero Banner (Fetches `/api/hero`)
        │   ├── SolutionsSection.jsx        ← Homepage Solutions Grid (Fetches `/api/section3`)
        │   ├── IndustriesSection.jsx       ← Homepage Industries Grid (Fetches `/api/section5`)
        │   ├── AboutSection.jsx            ← Homepage About Summary (Fetches `/api/about`)
        │   ├── StatsSection.jsx            ← Live Numbers & Stats Bar (Fetches `/api/stats`)
        │   ├── WhyUsSection.jsx            ← Differentiators Grid (Fetches `/api/section6`)
        │   ├── PartnersSection.jsx         ← Infinite Partner Logo Carousel
        │   ├── CtaSection.jsx              ← Reusable Call-to-Action Strip
        │   ├── DivisionsSection.jsx        ← Business Divisions Showcase
        │   ├── OurGroupSection.jsx         ← Group Companies Presentation
        │   ├── KeyDifferentiatorsSection.jsx← Enterprise Advantage Cards
        │   └── EnquiryModal.jsx            ← Global Contact & Quote Request Modal
        │
        ├── pages/                          ← Full Route Pages
        │   ├── HomePage.jsx                ← `/`
        │   ├── AboutPage.jsx               ← `/about-us`
        │   ├── SolutionsPage.jsx           ← `/solutions`
        │   ├── SolutionDetailPage.jsx      ← `/solutions/:slug` (Dynamic CMS Driven)
        │   ├── IndustriesPage.jsx          ← `/industries`
        │   ├── IndustryDetailPage.jsx      ← `/industries/:slug` (Dynamic CMS Driven)
        │   ├── ContactPage.jsx             ← `/contact-us`
        │   ├── ProductsPage.jsx            ← `/products`
        │   ├── PrivacyPolicyPage.jsx       ← `/privacy-policy`
        │   └── TermsPage.jsx               ← `/terms-and-conditions`
        │
        └── data/                           ← Static Offline Fallback Data
            ├── solutionsData.js            ← 9 Solutions Default Records
            ├── industriesData.js           ← 6 Industries Default Records
            └── productsData.js             ← Product Showcase Default Records
```

---

## 3. Installation & Setup Guide (Clone / Copy)

### Prerequisites

Ensure you have installed:
- **Node.js**: `v18.x` or `v20.x` or newer ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.x` or newer (comes with Node.js)
- **Git**: For version control

---

### Step 1: Clone or Copy the Repository

```bash
# Clone the repository
git clone https://github.com/Sumitkumar817/php.git

# Enter the root directory
cd php
```

---

### Step 2: Install Dependencies for All 3 Tiers

Install packages in `backend`, `admin`, and `unise-php`:

#### 1. Backend Server
```bash
cd backend
npm install
cd ..
```

#### 2. Admin Panel
```bash
cd admin
npm install
cd ..
```

#### 3. Public Website
```bash
cd unise-php
npm install
cd ..
```

---

## 4. Environment Variables Configuration & Live Deployments

### 🌐 Live Production Deployments
- **Backend API (Render)**: `https://unispark-backend-api.onrender.com/`
- **Public Website (Vercel)**: `https://unispark-website-kappa.vercel.app/`
- **CMS Admin Panel (Vercel)**: `https://unispark-admin-eight.vercel.app/`

---

### Backend `.env` File (`backend/.env`)
```env
# Server Port
PORT=5000

# MongoDB Atlas Connection String
MONGO_URI="mongodb+srv://samofficialsamuel8_db_user:UoMmbAV8KDAfJ6SC@cluster0.i30toji.mongodb.net/?appName=Cluster0"

# JWT Secret for Admin Authentication
JWT_SECRET=unispark-admin-super-secret-jwt-key-2026

# Cloudinary CDN Configuration
CLOUDINARY_CLOUD_NAME=xon36kkb
CLOUDINARY_API_KEY=597535137581924
CLOUDINARY_API_SECRET=gWijXbJts35W5LwFfrlg7NzD36g
```

### Admin Panel `.env` File (`admin/.env` & `admin/.env.production`)
```env
VITE_API_BASE_URL=https://unispark-backend-api.onrender.com/api
VITE_WEBSITE_URL=https://unispark-website-kappa.vercel.app
```

### Public Website `.env` File (`unise-php/.env` & `unise-php/.env.production`)
```env
VITE_API_BASE_URL=https://unispark-backend-api.onrender.com/api
```

---

## 5. How to Run the Applications

To run the entire system locally, open **3 separate terminal windows**:

### 🟢 Terminal 1: Start Backend API (Port 5000)
```bash
cd backend
npm start
```
> API Server will be running at: `http://localhost:5000`  
> Connected to: **MongoDB Atlas**

---

### 🔵 Terminal 2: Start Admin Panel (Port 5173)
```bash
cd admin
npm run dev
```
> Admin Panel will be available at: `http://localhost:5173`

---

### 🟣 Terminal 3: Start Public Website (Port 3001)
```bash
cd unise-php
npm run dev
```
> Public Website will be available at: `http://localhost:3001`

---

## 6. Authentication & Login Overview

### 🔒 Strict Security Policy
- **No Instant Demo Bypass**: Quick/demo login shortcuts have been removed.
- **Account Verification**: Only users who create/register their own accounts or have valid credentials in MongoDB Atlas can log in.
- **Password Encryption**: All passwords are encrypted with `bcryptjs` (salt factor: 10).
- **Session Tokens**: JWT authentication tokens with 7-day expiration are stored securely in `localStorage`.

---

### 🔑 How to Log In & Register

1. Open the Admin Panel at **`http://localhost:5173`**.
2. If you already have an account:
   - Enter your registered **Email Address**.
   - Enter your **Password**.
   - Click **"Sign In to Dashboard"**.
3. If you do not have an account yet:
   - Click the **"Create One"** button below the sign-in form.
   - Enter your **Full Name**.
   - Enter your **Email Address**.
   - Enter a secure **Password**.
   - Select your **Account Role** (`Super Admin`, `Admin`, `Editor`).
   - Click **"Register & Access Dashboard"**.
   - Your account is immediately created in MongoDB Atlas and you will be logged in.

---

### 👥 Default Seeded Accounts

If the database is freshly initialized, the following default seed accounts are available:

| Name | Email | Default Password | Role |
|---|---|---|---|
| **Sumit Kumar** | `sumit.kumar@example.com` | `password123` | Super Admin |
| **Priya Sharma** | `priya.s@example.com` | `password123` | Admin |
| **Alexander Wright** | `alex.w@example.com` | `password123` | Editor |

> 💡 **Tip**: You can create new admin accounts or change passwords at any time from **Admin Panel -> Website -> Users** (`UserManagementView.jsx`).

---

## 7. CMS Sections & Features

| CMS Section | Sidebar Menu | Features & Capabilities |
|---|---|---|
| **Dashboard** | `Dashboard` | Overview cards for all 9 website pages + direct links to live pages |
| **Hero Section** | `Website -> Home` | Main banner, headline, subtitle, hero video URL, action buttons |
| **Header** | `Website -> Header` | Header logo upload (Cloudinary/Base64), navigation links, sticky header |
| **About Page** | `Website -> About` | Company background, story, milestones, certifications, leadership team |
| **Solutions** | `Website -> Solutions` | 9 solution cards + **"Inside Page"** full CMS modal (Hero banner, scope of work, key features, authorized brands with image uploads, dynamic CTA) |
| **Industries** | `Website -> Industries` | Sector cards + **"Inside Page"** full CMS modal (Industry challenges, custom solutions, architecture diagrams, trusted brands, dynamic CTA) |
| **Contact Page** | `Website -> Contact` | Office location, UAE service areas, phone numbers, email addresses, Google Map embed |
| **Footer** | `Website -> Footer` | 6-tab CMS: Brand logo, tagline, group companies, social icons, column titles, quick links, contact strip, copyright |
| **Users** | `Website -> Users` | Add, edit roles (`Super Admin`, `Admin`, `Editor`), update status, delete admin users |
| **Enquiries** | `Enquiries` | View all customer quote requests and contact form submissions in real time |

---

## 8. Data Flow & Live Sync Mechanism

```
  [ Admin User ]
        │
        │ Edits content (e.g. Solutions inside page, Footer logo, Hero video)
        ▼
  [ Admin Panel ]  ───( HTTP PUT JSON / Cloudinary Image )───▶  [ Backend Server (Port 5000) ]
                                                                             │
                                                                             │ Mongoose ORM
                                                                             ▼
                                                                  [ MongoDB Atlas Cluster ]
                                                                             ▲
                                                                             │
                                                                    ( Live Fetch & Sync )
                                                                             │
                                                                [ Public Website (Port 3001) ]
                                                                 • Polls `/api/*` every 8s
                                                                 • Refreshes on window focus
                                                                 • Updates without page reload
```

---

## 9. REST API Reference

All backend routes are prefixed with `/api`.

| Route | Methods | Description |
|---|---|---|
| `/api/auth/login` | `POST` | Authenticate user with email + password, returns JWT |
| `/api/auth/register` | `POST` | Create a new user account |
| `/api/users` | `GET`, `POST` | List all admin users / Create new user |
| `/api/users/:id` | `GET`, `PUT`, `DELETE` | Fetch, update, or remove a specific user |
| `/api/header` | `GET`, `PUT` | Read or update top navigation bar settings |
| `/api/hero` | `GET`, `PUT` | Read or update homepage hero banner |
| `/api/section2` | `GET`, `PUT` | Read or update stats & differentiators |
| `/api/section3` | `GET`, `PUT` | **Solutions CMS**: 9 cards + full inside-page data & images |
| `/api/section4` | `GET`, `PUT` | Read or update partner brand logos strip |
| `/api/section5` | `GET`, `PUT` | **Industries CMS**: sector cards + full inside-page data & images |
| `/api/section6` | `GET`, `PUT` | Read or update "Why Choose Us" / CTA section |
| `/api/footer` | `GET`, `PUT` | **Footer CMS**: brand, social links, columns, contact strip, copyright |
| `/api/about` | `GET`, `PUT` | Read or update About Us page data |
| `/api/contact` | `GET`, `PUT`, `POST` | Read/update contact details + submit new enquiry message |

---

## 10. Troubleshooting & Common Issues

### 1. MongoDB Connection Issue
- **Symptom**: `MongoDB Atlas Notice: Could not connect to Atlas cluster`
- **Solution**: Check your MongoDB Atlas **Network Access**. Ensure your current IP is added to the IP Access List, or add `0.0.0.0/0` (Allow access from anywhere) in Atlas Dashboard -> Security -> Network Access.
- *Note*: If MongoDB is temporarily unreachable, the backend automatically uses an in-memory storage fallback so the app continues to run without crashing.

### 2. Port Already in Use
- If Port `5000`, `5173`, or `3001` is occupied by another process on Windows:
  ```powershell
  # Find process using port 5000
  netstat -ano | findstr :5000

  # Kill process by PID (e.g., PID 1234)
  taskkill /PID 1234 /F
  ```

### 3. Images Not Uploading to Cloudinary
- If Cloudinary credentials are empty or expired, the backend automatically handles base64 image strings and saves them directly to MongoDB as data URLs.

---

## 📄 License & Ownership

© 2026 **UniSpark Innovation Security Systems & Equipment Trading L.L.C**. All rights reserved.  
*Dubai, United Arab Emirates.*
