# 🩸 Circulate Life - Blood Donation & Management System

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT%20Tokens-black?logo=jsonwebtokens)](https://jwt.io/)
[![Author](https://img.shields.io/badge/Author-Paras%20Nakum-red)](https://github.com/ParasNakum)

> A modern, full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application converted from the PHP/MySQL architecture of **Circulate Life**. Preserves every business workflow, database relation, and user role while modernizing the platform with React components, RESTful APIs, JWT authentication, and interactive dashboards.

---

## 🌟 Key Features & Role Architecture

### 👑 1. Administrator Portal
* **Live Overview Dashboard**: Real-time counters for recipients, voluntary donors, total users, requisition volume, and total storage units in cold reserves.
* **Blood Inventory Management**:
  * Real-time tracking across all 8 blood groups (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`).
  * Add blood entries from voluntary donors.
  * Remove blood units with audit logs.
  * Direct inline unit modifications and low-stock alerts.
  * Logging of expired blood units with disposal history.
* **Requisition Approvals**: Review emergency patient requisitions with medical slip attachments and one-click Accept/Reject decisions (automatically deducting required blood units upon approval).
* **Appointment Scheduling**: Confirm and manage donor appointment bookings with status flags.
* **User Directories**: Browse, filter, inspect profiles, and manage donor and recipient accounts.

---

### 🩸 2. Voluntary Donor Portal
* **Donor Dashboard**: Post-donation guidance, hydration reminders, and nutritional tips.
* **Appointment Booking**: Schedule donation slots by date, time window, and blood group.
* **Emergency Blood Requests**: Donors can also file urgent blood requisitions for family or friends with prescription attachments.
* **Donation History & Digital Certificate**:
  * Access verified donation records with unique Certificate IDs.
  * Printable **Certificate of Appreciation** modal.
* **Profile & Security**: Manage weight, contact info, residential address, and change password.

---

### 🏥 3. Recipient Portal
* **Emergency Request Desk**: Submit hospital blood requests specifying patient name, age, urgency, units needed, hospital, attending doctor, and diagnostic slips.
* **Real-time Status Tracking**: Monitor requisition status (`Pending`, `Accepted`, `Rejected`) live from the dashboard.
* **Profile Management**: Update contact phone, address, and password credentials.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide React, Modern CSS3 |
| **Backend** | Node.js, Express.js, RESTful Architecture, Multer (File Uploads) |
| **Database** | MongoDB (v4.2+), Mongoose ORM |
| **Security & Auth** | JSON Web Tokens (JWT), Bcrypt.js password hashing, Role-based Route Protection |
| **Tooling** | Git, npm, Postman, Nodemon |

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
Ensure you have installed:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

### 2. Clone the Repository
```bash
git clone https://github.com/ParasNakum/circulate-life.git
cd circulate-life
```

### 3. Backend Setup
```bash
cd backend
npm install
```
Configure your environment variables in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/circulate_life
JWT_SECRET=circulate_life_jwt_secure_secret_key_2026
```

Seed the initial database with sample donors, recipients, inventory, and requests:
```bash
npm run seed
```

Start the backend server:
```bash
npm start
```
> Server runs on `http://localhost:5000`

---

### 4. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> Frontend client runs on `http://localhost:5173`

---

## 🔑 Demo Login Credentials

For quick testing and demonstration, use the auto-fill buttons on the login screen or enter:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Administrator** | `admin@gmail.com` | `admin123` |
| **Donor** | `donor@gmail.com` | `donor123` |
| **Recipient** | `recipient@gmail.com` | `recipient123` |

---

## 📡 REST API Reference

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` - Register a new donor or recipient
* `POST /api/auth/login` - Authenticate user & retrieve JWT token
* `GET /api/auth/me` - Get authenticated profile
* `PUT /api/auth/update-profile` - Update profile details & change password
* `POST /api/auth/forgot-password` - Generate verification OTP
* `POST /api/auth/reset-password` - Reset password using OTP

### 👑 Admin Routes (`/api/admin`)
* `GET /api/admin/stats` - Summary dashboard metrics
* `GET /api/admin/donors` - Fetch all donors
* `DELETE /api/admin/donors/:id` - Remove donor account
* `GET /api/admin/recipients` - Fetch all recipients
* `DELETE /api/admin/recipients/:id` - Remove recipient account
* `GET /api/admin/blood-storage` - Get current blood inventory
* `POST /api/admin/blood-storage/add` - Add blood stock entry
* `POST /api/admin/blood-storage/remove` - Remove blood stock units
* `PUT /api/admin/blood-storage/:id` - Edit blood units directly
* `POST /api/admin/blood-storage/add-expired` - Log expired blood entry
* `GET /api/admin/blood-storage/history` - View donation & expiration logs
* `GET /api/admin/requests` - View all blood requests
* `POST /api/admin/requests/handle` - Accept or reject requisition
* `GET /api/admin/appointments` - View all donor appointments
* `POST /api/admin/appointments/handle` - Accept or reject appointment

### 🩸 Donor Routes (`/api/donor`)
* `GET /api/donor/stats` - Donor dashboard counts
* `POST /api/donor/request-blood` - Submit urgent blood requisition
* `GET /api/donor/my-requests` - View my requisitions
* `DELETE /api/donor/requests/:id` - Cancel requisition
* `POST /api/donor/appointment` - Book donation appointment
* `GET /api/donor/my-appointments` - View scheduled appointments
* `DELETE /api/donor/appointments/:id` - Cancel appointment
* `GET /api/donor/donation-history` - View completed donations & certificates

### 🏥 Recipient Routes (`/api/recipient`)
* `GET /api/recipient/stats` - Recipient dashboard statistics
* `POST /api/recipient/request-blood` - Submit emergency requisition
* `GET /api/recipient/my-requests` - View my requisitions
* `DELETE /api/recipient/requests/:id` - Cancel requisition

---

## 👤 Author

**Paras Nakum**
* **Role**: Aspiring Full-Stack Developer
* **Email**: parasnakum0261@gmail.com
* **LinkedIn**: [linkedin.com/in/paras-nakum-382295244](https://www.linkedin.com/in/paras-nakum-382295244)
* **Location**: Surat, Gujarat, India
