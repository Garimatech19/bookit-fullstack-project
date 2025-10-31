# BookIt: Experiences & Slots

A full-stack web application for browsing and booking travel experiences and time slots, featuring a complete end-to-end booking flow from browsing to confirmation.

## 🚀 Live Demo

* **Frontend (Hosted on Vercel):** [https://bookit-fullstack-project.vercel.app/](https://bookit-fullstack-project.vercel.app/)
* **Backend (Hosted on Render):** [https://bookit-server-htf4.onrender.com](https://bookit-server-htf4.onrender.com)


## ✨ Features

* **Browse & Search:** View a grid of all available experiences and search by title or location.
* **Detailed View:** Click any experience to see full details, descriptions, and available dates/time slots.
* **Smart Slot Selection:** Dates and times are dynamically loaded from the backend. Sold-out slots are disabled.
* **Full Booking Flow:** A complete Home -> Details -> Checkout -> Confirmation user journey.
* **Promo Code Validation:** Apply and validate promo codes on the checkout page.
* **Secure Booking:** The backend uses database transactions to prevent double-booking the same slot.

---

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React, TypeScript, Vite |
| **Styling** | TailwindCSS |
| **Routing** | React Router DOM |
| **Forms** | React Hook Form |
| **Schema Validation** | Zod |
| **API Client** | Axios |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL |
| **ORM** | Prisma |

---

## ⚙️ Setup and Installation

Follow these instructions to get the project running on your local machine for development and testing.

### Prerequisites

* Node.js (v18 or later)
* npm (or yarn)
* Git
* A free PostgreSQL database (e.g., from [Render](https://render.com/) or [Railway](https://railway.app/))

---

### 1. Clone the Repository

```bash
git clone [https://github.com/your-username/bookit-project.git](https://github.com/your-username/bookit-project.git)
cd bookit-project
```

### 2. Backend Setup (/server)
Navigate to the server directory:

```bash
cd server
```
Install dependencies:

```Bash
npm install
```
Create a .env file and add your database URL

Create the file: touch .env

Add this line to the new .env file, replacing the value with your external DB connection string from Render/Railway

```bash
DATABASE_URL="postgres://your_user:your_password@your_[host.com/your_database](https://host.com/your_database)"
```

Run the database migration to create your tables:
```Bash
npx prisma migrate dev
```
Important: Populate the database with sample experiences and slots:

```Bash
npm run seed
```
Start the backend server:

```Bash
npm run dev
```
The server will be running on http://localhost:3001.

### 3. Frontend Setup (/client)
Open a new terminal and navigate to the client directory:

```Bash
cd client
```
Install dependencies:

```Bash

npm install
```
Create a .env.local file to point to your local backend

Create the file: touch .env.local

Add this line to the new .env.local file

```bash
VITE_API_URL="http://localhost:3001"
```

Start the frontend development server:

```Bash
npm run dev
```
The app will be running on http://localhost:5173.

### 🔌 API Endpoints
All endpoints are relative to the backend URL (e.g., http://localhost:3001).
| Method | Endpoint                  | Description                                                           |
| :----- | :------------------------ | :-------------------------------------------------------------------- |
| `GET`  | `/experiences`            | Get all experiences.                                                  |
| `GET`  | `/experiences?search=...` | Filter experiences by a search term (checks title and location).      |
| `GET`  | `/experiences/:id`        | Get details and available slots for a single experience.              |
| `POST` | `/promo/validate`         | Validates a promo code. Requires `{"code": "CODE_NAME"}` in the body. |
| `POST` | `/bookings`               | Create a new booking. (Uses a transaction to prevent double-booking). |


### 🎟️ Test Promo Codes
Use these codes on the checkout page to test the validation and discount logic:

## SAVE10 (₹10 off)

##FLAT100 (₹100 off)
