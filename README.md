# Pet Adoption Platform

## Overview
The **Pet Adoption Platform** is a full-stack web application built with the **MERN** stack, designed to facilitate seamless pet adoption and fostering. The platform provides features for pet listings, adoption applications, real-time messaging, user authentication, and more.

### Backend
- Built with **Node.js**, using **Express.js** as the backend framework.
- Implements **authentication and authorization** for secure access.
- Enables **real-time messaging** with **Socket.io**.
- Supports **email functionality** using **NodeMailer**.
- Follows the **MVC architecture** for modular and maintainable code.
- Provides well-structured **RESTful API endpoints** for various features.
- Deployed on **Render** with **MongoDB Atlas** as the database.

---

## Application Features
## API Endpoints

### **User Authentication**
| Feature | Method | Route | Description |
|------------|--------|---------------------------|----------------------------------|
| Register | POST | `/api/auth/register` | Register new users |
| Login | POST | `/api/auth/login` | Authenticate users |
| Fetch Users | POST | `/api/auth/all-users` | Retrieve all users |
| Fetch Shelter Users | POST | `/api/auth/shelters` | Retrieve all shelter users |
| Update Profile | POST | `/api/auth/update-profile/:id` | Update user profile details |

### **Pet Management**
| Feature | Method | Route | Description |
|-------------------|--------|-------------------------------|------------------------------------------------|
| Get All Pets | GET | `/api/pets` | Retrieve all pet listings |
| Get Pet by ID | GET | `/api/pets/:id` | Retrieve a specific pet by ID |
| Add New Pet | POST | `/api/pets` | Add a new pet (Shelters only) |
| Update Pet Details | PUT | `/api/pets/:id` | Update pet details (for fostering) |
| Update Adoption Status | PUT | `/api/adop/:id` | Update pet adoption details |
| Delete Pet | DELETE | `/api/pets/:id` | Remove a pet listing |
| Add Pet Review | POST | `/api/pets/:petId/review` | Submit a review for a pet |
| Get Pets by Shelter ID | GET | `/api/pets/shelter/:id` | Retrieve pets listed by a specific shelter |
| Get Fostering Pets by Shelter ID | GET | `/api/pets/shelter_fostering/:id` | Retrieve pets available for fostering |
| Get Fostering Data by Foster ID | GET | `/api/pets/foster/:id` | Retrieve pets assigned to a foster parent |
| Get Adoption Data by Adopter ID | GET | `/api/pets/adopter/:id` | Retrieve pets adopted by a user |
| Filter Pets by Breed & Age | GET | `/api/pets/filter?breed=GoldenRetriever&age=2` | Filter pets based on breed & age |
| Add Favorite Pet | POST | `/api/pets/:petId/favorite` | Add a pet to user's favorites |
| Get User’s Favorite Pets | GET | `/api/pets/favorites/:userId` | Retrieve user’s favorited pets |

### **Adoption Management**
| Feature | Method | Route | Description |
|----------------------|--------|---------------------|--------------------------------------------|
| Submit Application | POST | `/api/adoptions` | Submit an adoption application |
| View All Applications | GET | `/api/adoptions` | Retrieve all applications (Shelters only) |
| Update Application | PUT | `/api/adoptions/:id` | Update adoption application status |
| Delete Application | DELETE | `/api/adoptions/:id` | Remove an adoption application |

### **Reviews & Ratings**
| Feature | Method | Route | Description |
|---------------|--------|-------------------------|----------------------------------|
| Submit Review | POST | `/api/reviews` | Leave a review for a shelter |
| Get Reviews | GET | `/api/reviews/:shelterId` | Retrieve all reviews for a shelter |

### **Real-Time Messaging**
| Feature | Method | Route | Description |
|-----------------|--------|---------------------------|---------------------------|
| Send Message | POST | `/api/messages` | Send a message to a shelter or adopter |
| Get User Chats | GET | `/api/messagesById` | Retrieve chat messages by user ID |

### **Fostering**
| Feature | Method | Route | Description |
|-----------------|--------|----------------------|-------------------------------|
| Sign Up as Foster | POST | `/api/foster` | Register as a foster parent |
| Remove Foster Details | DELETE | `/api/foster/:id` | Delete fostering information |

### **Email Notifications**
| Feature | Method | Route | Description |
|----------------|--------|--------------------------------|-----------------------------------------------|
| Send Email | POST | `/api/generate-mail` | Trigger an email notification |
| Accept/Reject Adoption Request | POST | `/api/generate-mail/accept-reject` | Notify adopter/foster about application status |

---

## Deployment
- **Backend** hosted on **Render** with **MongoDB Atlas** as the database

## Technologies Used
### **Backend**
- Node.js with Express.js
- MongoDB Atlas
- Socket.io (Real-time messaging)
- NodeMailer (Email notifications)
- MVC Architecture
- Authentication & Authorization




