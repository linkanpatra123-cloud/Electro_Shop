# 🛒 Full Stack E-Commerce Application

A full-stack e-commerce web application built with **Next.js**, featuring user authentication, product browsing, cart management, and secure checkout powered by **Razorpay**.

---

## ✨ Features

* 🔐 User registration and login
* 🔒 JWT-based authentication
* 🔑 Password hashing using bcryptjs
* 🛍️ Product listing and product details
* 🛒 Add to cart, update quantity and remove items
* 📦 Checkout with delivery address
* 💰 Order total and delivery charge calculation
* 💳 Razorpay payment integration
* ✅ Razorpay payment verification
* 🧹 Automatic cart clearing after successful payment
* ☁️ Cloudinary image upload
* 📱 Responsive UI
* 🛡️ Protected backend APIs
* 🗄️ Data storage using JSON files
* 🌐 REST-style backend APIs

---

## 🧰 Tech Stack

| Category         | Technology                  |
| ---------------- | --------------------------- |
| Frontend         | Next.js                     |
| UI               | React                       |
| Styling          | Bootstrap / React Bootstrap |
| State Management | Redux Toolkit               |
| HTTP Client      | Axios                       |
| Backend          | Node.js / Express           |
| Authentication   | JWT + bcryptjs              |
| Payment Gateway  | Razorpay                    |
| Image Upload     | Cloudinary                  |
| Storage          | JSON Files                  |

---

## 💳 Razorpay Payment Integration

This project uses **Razorpay** as the payment gateway.

### Payment Flow

```text
User adds products to cart
        ↓
Checkout
        ↓
Backend creates Razorpay Order
        ↓
Razorpay Checkout
        ↓
User completes payment
        ↓
Razorpay returns payment details
        ↓
Backend verifies Razorpay signature
        ↓
Payment marked as PAID
        ↓
Order confirmed
        ↓
Cart cleared
```

The backend handles Razorpay order creation and payment verification. Razorpay's secret key is kept only on the backend.

---

## 🔐 Environment Variables

The backend requires a `.env` file for sensitive configuration such as the **Razorpay API keys**.

### Backend `.env`

Create a `.env` file inside the `backend` folder:

```env
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET=your_jwt_secret
```

> ⚠️ Replace the values with your own credentials.

### Example Project Structure

```text
project/
│
├── frontend/
│
├── backend/
│   ├── .env
│   ├── server.js
│   ├── db.js
│   ├── middleware/
│   └── data/
│
├── .gitignore
└── README.md
```

### Important Security Rule

**Never upload the `.env` file to GitHub.**

Your backend `.gitignore` should contain:

```gitignore
node_modules/
.env
```

The project's backend `.gitignore` already excludes `.env`, along with generated data files.

---

## 🔑 Razorpay Credentials

You need two Razorpay credentials:

| Variable              | Purpose                                                  |
| --------------------- | -------------------------------------------------------- |
| `RAZORPAY_KEY_ID`     | Used to identify your Razorpay account                   |
| `RAZORPAY_KEY_SECRET` | Private secret used for server-side payment verification |

### ⚠️ Never expose:

```text
RAZORPAY_KEY_SECRET
```

in frontend code.

The secret key should only be accessed by the backend. Server-side payment verification is important for preventing fake or manipulated payment confirmations.

---

## 📦 Installation

Clone the repository:

```bash
git clone <repository-url>
```

Go to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the `.env` file:

```text
backend/.env
```

Add your Razorpay credentials:

```env
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
JWT_SECRET=your_secret
```

---

## ▶️ Run Backend

Inside the backend folder:

```bash
npm run dev
```

Or, depending on the project's scripts:

```bash
npm start
```

---

## 🗄️ Data Storage

This practice project uses JSON files for storing application data.

```text
backend/
└── data/
    ├── products.json
    ├── products-store.json
    ├── users.json
    └── store.json
```

Orders and payment information are stored in `store.json`. The backend database helper handles creating orders, creating payments, updating order/payment status, and retrieving orders.

---

## 🔐 Authentication

Authentication uses:

* JWT
* bcryptjs
* Protected API routes

The backend verifies the JWT token before allowing access to protected operations.

---

## 📁 Backend Structure

```text
backend/
│
├── data/
│   ├── products.json
│   ├── products-store.json
│   ├── users.json
│   └── store.json
│
├── middleware/
│   └── auth.js
│
├── db.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## 🛡️ Security

* 🚫 Never commit `.env` to GitHub
* 🚫 Never expose `RAZORPAY_KEY_SECRET`
* 🚫 Never put Razorpay secret credentials in frontend code
* 🚫 Never share API secrets publicly
* ✅ Keep sensitive credentials inside backend `.env`
* ✅ Verify Razorpay payments on the server
* ✅ Use JWT authentication for protected APIs

---

## 🚀 Future Improvements

* 📜 User order history
* 🧑‍💼 Admin dashboard
* ⭐ Product reviews and ratings
* ❤️ Wishlist
* 🔍 Product search and filtering
* 🎟️ Coupon system
* 📦 Advanced order tracking
* 💳 Additional payment gateways

---

## 👤 Author

**Your Name**

* GitHub: (https://github.com/linkanpatra123-cloud/Electro_Shop)

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
