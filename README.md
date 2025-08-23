# Payment Gateway System 

## 📌 Project Overview
This project is a **Payment Gateway System** built using the **MERN stack (MongoDB, Express.js, React, Node.js)** with **PayPal integration**.  
It provides users with the ability to either:
- Subscribe to a plan, or  
- Purchase products.  

The system securely processes payments, manages subscriptions, and records transactions in MongoDB.  

---

## 🚀 Features
- User authentication.  
- Subscription and one-time purchase support.  
- Integration with **PayPal API** for secure payments.  
- Transaction and subscription logging in MongoDB.  
- Success and confirmation handling with frontend UI.  
- Clear separation of backend (Node.js + Express) and frontend (React).  

---

## 🛠️ Tech Stack
- **Frontend**: React.js, Axios, TailwindCSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB with Mongoose ODM  
- **Payment Gateway**: PayPal REST SDK / API  
- **Authentication**: JWT (JSON Web Tokens)  

---

## 📊 System Flow
The system follows the below workflow:  

1. User logs in.  
2. Chooses either **Subscription** or **Purchase**.  
3. Provides required details (plan/product/payment info).  
4. Data is sent to the backend.  
5. PayPal processes the payment.  
6. On success:  
   - Subscriptions are saved to DB.  
   - Purchases are saved with product details.  
7. User sees confirmation / success message.  

---

