# BookIt: Experiences & Slots

A full-stack web application for browsing and booking travel experiences and time slots. This project was built as a full-stack intern assignment, featuring a complete end-to-end booking flow from browsing to confirmation.

## 🚀 Live Demo

* **Frontend (Hosted on Vercel):** [https://your-frontend-link.vercel.app](https://your-frontend-link.vercel.app)
* **Backend (Hosted on Render):** [https://your-backend-link.onrender.com](https://your-backend-link.onrender.com)

## 📸 Screenshot

*(Add a screenshot of your application's home page here)*


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