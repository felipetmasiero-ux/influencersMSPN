# MSPN Influencer Commerce Platform

Full-stack influencer-commerce platform developed for a real business, integrating ecommerce workflows, affiliate attribution, coupon-based commission tracking, analytics dashboards, and cloud deployment infrastructure.

---

## Overview

MSPN Influencer Commerce Platform is a full-stack web application created for a real family business to manage ecommerce operations and influencer partnerships in a centralized system.

The platform combines:

- Ecommerce infrastructure
- Influencer coupon attribution
- Commission tracking
- Analytics dashboards
- Secure authentication
- Sales performance monitoring

The goal of the project was to build a scalable system capable of tracking influencer-driven sales while providing analytics and operational insights through a modern dashboard interface.

---

## Live Deployment

### Frontend
(Add frontend URL here)

### Backend API
(Add backend URL here)

---

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### Authentication & Security
- JWT Authentication
- bcrypt Password Hashing
- Protected Middleware Routes

### Deployment
- Vercel
- Render

---

## Core Features

## Ecommerce System
- Product listing and management
- Shopping cart system
- Persistent cart state
- Checkout simulation
- Order management

## Influencer Platform
- Unique influencer coupon codes
- Commission attribution engine
- Influencer ranking system
- Sales tracking by influencer
- Revenue analytics

## Analytics Dashboard
- Revenue metrics
- Order statistics
- Influencer rankings
- Ticket average calculations
- Interactive charts and analytics

## Authentication System
- JWT-based authentication
- Password encryption with bcrypt
- Protected routes and middleware authorization
- Session validation

## Backend Infrastructure
- REST API architecture
- MongoDB persistence
- Dynamic data aggregation
- Cloud deployment integration

---

## System Architecture

```text
Customer
   ↓
Frontend Ecommerce
   ↓
REST API (Node.js + Express)
   ↓
Authentication Layer (JWT + bcrypt)
   ↓
Coupon & Commission Engine
   ↓
MongoDB Atlas
   ↓
Analytics Dashboard
```

---

## Engineering Challenges

### Commission Attribution Logic
Designed a commission attribution system capable of associating completed purchases with influencer coupon codes while preventing duplicated commission events.

### Authentication & Authorization
Implemented stateless JWT authentication with protected middleware routes and bcrypt password hashing for secure user management.

### Persistent Shopping Cart
Built cart persistence logic capable of synchronizing frontend cart state with backend records across sessions and browser refreshes.

### Analytics Aggregation
Developed backend aggregation logic for calculating rankings, revenue metrics, commissions, and influencer performance dynamically from database records.

### Frontend & Backend Synchronization
Handled real-time synchronization between ecommerce interactions and dashboard analytics updates.

---

## Security

- JWT authentication
- bcrypt password hashing
- Protected middleware routes
- Authorization-based access control
- Secure API endpoint validation

---

## Scalability Considerations

The platform was designed using stateless REST APIs and cloud-hosted MongoDB infrastructure, enabling scalable backend architecture and independent frontend/backend deployment.

The modular structure also allows future integration of:
- Payment gateways
- Real-time analytics
- AI recommendation systems
- Fraud detection systems
- Advanced affiliate attribution

---

## Project Structure

```text
/frontend
/backend
/docs
```

---

## Screenshots

## Ecommerce Interface
(Add screenshot here)

## Influencer Dashboard
(Add screenshot here)

## Analytics System
(Add screenshot here)

## Authentication System
(Add screenshot here)

---

## Future Improvements

- Stripe payment integration
- Real-time analytics with Socket.IO
- AI-based influencer recommendation system
- Fraud detection for coupon abuse
- Advanced analytics dashboards
- Email notification system
- Automated commission payouts

---

## What I Learned

Through this project, I gained practical experience in:

- Full-stack web development
- REST API architecture
- Authentication systems
- Database modeling
- Cloud deployment
- Backend engineering
- Analytics aggregation
- System design
- Business-oriented software development

---

## Motivation

This platform was developed to solve a real operational problem for a family business, improving influencer sales attribution and commission management while creating a scalable ecommerce infrastructure.

---

## Author

Felipe Teixeira Masiero

GitHub:
https://github.com/felipetmasiero-ux
