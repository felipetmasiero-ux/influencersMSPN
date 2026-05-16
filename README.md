# 🚀 MSPN Influencer Commerce Platform

## 📌 Case Study

Full-stack influencer commerce system built to support a real business by my father, enabling coupon-based influencer marketing, commission tracking, and sales analytics.

The goal was to replace manual tracking of influencer sales with an automated, scalable system.

---

## 🎯 Problem

The business needed a way to:

- Track which influencer generated each sale
- Manage unique coupon codes per influencer
- Calculate commissions automatically
- Monitor sales performance and growth
- Replace manual spreadsheets and fragmented tracking

Without a system, attribution errors and lack of visibility were common.

---

## 💡 Solution

I built a full-stack platform that centralizes the entire influencer commerce workflow:

- Ecommerce frontend for customer purchases
- Coupon system linked to influencers
- Commission calculation engine
- Analytics dashboard for performance tracking
- Secure backend API with authentication
- Cloud deployment for scalability

---

## 🏗️ System Architecture

```txt
Customer
  → Ecommerce Frontend
      → REST API (Node.js + Express)
          → Coupon & Commission Engine
              → MongoDB Atlas
                  → Influencer Analytics Dashboard
```

## 🌐 Live Deployments

- **Frontend (Vercel):** https://influencers-mspn.vercel.app
- **Backend (Render):** https://influencersmspn.onrender.com
- **Database:** MongoDB Atlas Cluster

---

## 🖼️ Screenshots

### Ecommerce
<p align="center">
  <img src="./screenshots/ecommerce1.png" width="30%">
  <img src="./screenshots/ecommerce2.png" width="30%">
  <img src="./screenshots/ecommerce3.png" width="30%">
</p>

---

### Influencer Dashboard
<p align="center">
  <img src="./screenshots/admin.png" width="80%">
</p>

---

### Analytics
<p align="center">
  <img src="./screenshots/analytics1.png" width="30%">
  <img src="./screenshots/analytics2.png" width="30%">
  <img src="./screenshots/analytics3.png" width="30%">
</p>

---

### Authentication
<p align="center">
  <img src="./screenshots/login.png" width="45%">
  <img src="./screenshots/registro.png" width="45%">
</p>

---

## 🧠 Key Learnings

- Full-stack architecture design with separation of concerns
- REST API development using Express.js
- Authentication and security using JWT and bcrypt
- State management for ecommerce cart persistence
- Commission-based business logic implementation
- Integration between frontend, backend, and cloud services
- Deployment workflows using Vercel and Render
- Database modeling and optimization with MongoDB Atlas
