

# StayFinder 🏡

**StayFinder** is a full-stack web application designed for seamless property listings, hotel/stay bookings, and robust admin management. Whether you're a **guest**, **host**, or **admin**, StayFinder provides a complete solution for managing stays and reservations. 

---

## 📁 Project Structure

```
stayfinder/
├── client/        # Frontend (React + Tailwind CSS + Vite)
└── server/        # Backend (Node.js + Express + MongoDB)
```

---

## ✨ Features

### 🔑 Authentication & Authorization

* User Sign Up & Login
* Admin Login (with separate route and access)
* Auth token-based route protection

### 🧳 Guest Functionality

* Browse all listings (`Explore.jsx`, `ShowAllListings.jsx`)
* View listing details (`SelectedListing.jsx`)
* Book a stay (`BookingPage.jsx`, `GuestBookingPageById.jsx`)
* Manage bookings (`MyBookings.jsx`)

### 🏠 Host Functionality

* Create new listings (`CreateListing.jsx`)
* Edit existing listings (`EditListing.jsx`)
* View personal listings (`ShowMyListings.jsx`)
* Track bookings for listed stays (`MyListingBookings.jsx`, `OwnerBookingPageById.jsx`)

### 👑 Admin Panel

* Admin dashboard (`AdminDashboard.jsx`)
* Manage listings (`AdminListings.jsx`, `AdminListingSelected.jsx`)
* Manage users (`AdminUsers.jsx`, `AdminUserSelected.jsx`)
* View all bookings (`AdminBookings.jsx`, `AdminBookingSelected.jsx`)
* Manage homepage content like hero sections (`AdminHeroSections.jsx`)

### 🌟 Other Highlights

* State management using custom stores (`authStore.js`, `listingStore.js`, etc.)
* Responsive UI built with Tailwind CSS
* File uploads for images (`upload.js`)
* MongoDB-based models for listings, bookings, users, reviews, hero sections

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Zustand (for state management)

### Backend

* Node.js
* Express.js
* MongoDB (with Mongoose)
* JWT (for auth)
* Multer (for image uploads)

---

## 🚀 Getting Started

### Prerequisites

* Node.js and npm installed
* MongoDB running locally or via Atlas

### Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/keerthiks16/stayfinder.git
   cd stayfinder
   ```

2. **Start the Backend**

   ```bash
   cd server
   npm install
   npm start
   ```

3. **Start the Frontend**

   ```bash
   cd client
   npm install
   npm run dev
   ```

---

## 🔒 Environment Variables

Add a `.env` file inside the `server/` directory with the following:

```env
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```


---

