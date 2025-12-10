# DreamHome - Full Stack Real Estate Application

## 🚀 Project Overview
This project is a complete, responsive Full Stack Real Estate Platform built using the **MERN Stack**. It features a modern user-facing website and a secure administrative dashboard for managing properties, client testimonials, and inquiries.

### 🔗 Live Links
| Service | URL | Notes |
| :--- | :--- | :--- |
| **Live Website (Frontend)** | [https://real-estate-assignment-five.vercel.app/](https://real-estate-assignment-five.vercel.app/) | Primary URL for users and recruiters. |
| **Admin Panel Access** | [https://real-estate-assignment-five.vercel.app/admin](https://real-estate-assignment-five.vercel.app/admin) | Fully functional content management. |
| **Backend API (Health Check)**| [https://realestateassignment.onrender.com](https://realestateassignment.onrender.com) | Server URL for API connectivity. |

---

## 🛠️ Technology Stack

* **Frontend (Deployment: Vercel):**
    * React.js (Vite)
    * Bootstrap / Custom CSS (Responsive Layout)
    * React Router
* **Backend (Deployment: Render):**
    * Node.js
    * Express.js
* **Database:**
    * MongoDB Atlas (Cloud Database)

---

## ✨ Key Features & Bonus Implementation

### User Interface (Landing Page)
* **Responsive Design:** Optimized for all screen sizes (phone, tablet, desktop).
* **Smooth Navigation:** Anchor links (e.g., Services, Reviews) scroll smoothly with fixed header offset.
* **Instant Visibility:** Reviews and Project cards are guaranteed visible immediately on load (instant data initialization).
* **Contact Form:** Submits inquiries directly to the database.

### Admin Dashboard (Content Management)
* **Responsive Layout:** Uses Offcanvas/Hamburger Menu for mobile and a fixed sidebar for desktop.
* **Data Management (CRUD):** Complete functionality to manage and delete **Projects**, **Clients**, **Inquiries**, and **Subscribers**.
* **BONUS FEATURE: Image Cropping:** Implemented a cropping tool using `react-image-crop` to enforce a specific aspect ratio (e.g., 450x350) on property images before they are uploaded to the backend.

---

## ⚙️ Local Setup Guide

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Kanizfatimakhan/RealEstateAssignment.git](https://github.com/Kanizfatimakhan/RealEstateAssignment.git)
    cd RealEstateAssignment
    ```

2.  **Setup Backend (Server):**
    ```bash
    cd server
    npm install
    node index.js  # Server runs on http://localhost:5000
    ```

3.  **Setup Frontend (Client):**
    ```bash
    cd client
    npm install
    npm run dev  # Frontend runs on http://localhost:5173
    ```
*(Note: Ensure your MongoDB connection string is correctly configured in the server's environment variables.)*
