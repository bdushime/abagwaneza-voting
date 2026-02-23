# 🗳️ Abagwaneza Online Voting System

A simple, secure, and mobile-friendly web application built for community elections. This system was designed specifically for users with limited technical experience, replacing complex email/password logins with a familiar **Name + PIN** system (similar to Mobile Money).

##  Key Features

* **Simple Authentication:** Users log in by selecting their name from a dropdown and entering a secure 5-digit PIN.
* **Mobile-First Design:** Large buttons, clear text, and high-contrast elements designed for easy use on smartphones.
* **Conflict Prevention:** The system strictly enforces a "One Vote Per Position" rule.
* **Live Results Dashboard:** A read-only results page with visual progress bars showing the current voting standings in real-time.

##  Tech Stack

**Frontend:**
* React (Vite)
* Axios (API requests)
* Custom CSS (Mobile-responsive)

**Backend:**
* Node.js & Express.js
* MongoDB (Mongoose)
* CORS & Dotenv

---

##  Local Setup & Installation

Follow these steps to run the project on your local machine.

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB installed)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/abagwaneza-voting.git](https://github.com/your-username/abagwaneza-voting.git)
cd abagwaneza-voting
