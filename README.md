# MSPN Influencer Commerce Platform
Full-stack influencer-commerce platform built for a real business, integrating ecommerce workflows, coupon attribution, commission tracking, analytics dashboards, and cloud deployment.

## Tech Stack
- Frontend: HTML, CSS, JavaScript                  
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Authentication: JWT + bcrypt
- Deployment: Vercel + Render

## Features
### Ecommerce System
- Shopping cart
- Product management
- Persistent cart state
- Checkout simulation

### Influencer Platform
- Unique influencer coupon codes
- Commission attribution system
- Influencer rankings
- Sales tracking

### Analytics Dashboard
- Revenue analytics
- Order metrics
- Ticket average
- Growth indicators
- Interactive charts

### Security
- JWT authentication
- bcrypt password hashing
- Protected routes
- Middleware authorization

### Backend Infrastructure
- REST API architecture
- MongoDB persistence
- Cloud deployment
- Real-time data integration

## System Architecture
Customer
   ↓
Frontend Ecommerce
   ↓
REST API (Express.js)
   ↓
Coupon & Commission Engine
   ↓
MongoDB Atlas
   ↓
Influencer Analytics Dashboard

## Deployment
Frontend deployed on Vercel  
Backend deployed on Render  
Database hosted on MongoDB Atlas

## Screenshots

### Ecommerce

<p align="center">
  <img src="./screenshots/ecommerce1.png" width="30%">
  <img src="./screenshots/ecommerce2.png" width="30%">
  <img src="./screenshots/ecommerce3.png" width="30%">
</p>

---

### Influencer Dashboard

<p align="center">
  <img src="./screenshots/admin.png" width="70%">
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
