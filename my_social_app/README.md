# My Social App - Scalable Social Platform

## Description
A modern, scalable social application built with React Native, leveraging cloud infrastructure and microservices architecture. The platform combines powerful technologies to deliver a robust, secure, and performant social networking experience.

## Architecture & Infrastructure

### Cloud Infrastructure
- **Oracle Cloud Infrastructure (OCI)**
  - Kubernetes Engine (OKE) for container orchestration
  - Virtual Cloud Network (VCN) for networking
  - Object Storage for file management
  - Identity and Access Management (IAM) for security

### Backend Services
- **Parse Server**
  - Custom cloud functions for business logic
  - Real-time messaging capabilities
  - Push notifications system
  - File storage and management

- **MongoDB**
  - Self-hosted on Kubernetes
  - Persistent storage with OCI Block Volume
  - Secure authentication and authorization
  - Data replication for high availability

### Frontend
- **React Native & Expo**
  - Cross-platform mobile application
  - Push notifications with Firebase Cloud Messaging (FCM)
  - Real-time messaging capabilities
  - Offline-first architecture with local SQLite database

### Media Management
- **Cloudinary**
  - Avatar and image management
  - Automatic image optimization
  - Secure file upload and delivery

## Key Features
- Authentication with Firebase
- Real-time messaging
- Push notifications via FCM
- Profile management with avatar support
- Contact management
- Secure data storage
- Offline capabilities
- Scalable infrastructure

## Technical Stack
- **Frontend**: React Native, Expo, Redux Toolkit
- **Backend**: Parse Server, Node.js
- **Database**: MongoDB
- **Cloud**: Oracle Cloud Infrastructure
- **Container Orchestration**: Kubernetes
- **Media**: Cloudinary
- **Push Notifications**: Firebase Cloud Messaging
- **Authentication**: Firebase Auth
- **Local Storage**: SQLite

## Security Features
- Kubernetes Secrets management
- Secure environment variables
- API key protection
- Database authentication
- Network security policies
- Encrypted communication

## Installation & Deployment

### Prerequisites
- Node.js and npm
- Docker and kubectl
- OCI CLI configured
- Firebase project setup
- Cloudinary account

### Local Development
1. Clone the repository:
    git clone https://github.com/jawjaww/my-social-app.git
    cd my_social_app
   
3. Install dependencies:
    npm install

4. Configure Firebase:
   - Create a Firebase project.
   - Add the `google-services.json` file for Android and `GoogleService-Info.plist` file for iOS.

5. Start the application:

   npm start


## Usage
1. Run the app on an emulator or a physical device:
   
   npm run android  

   # or
   
   npm run ios 

2. Sign up or sign in using the authentication screens.

3. Navigate through the app using the bottom tab navigator.


## License
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Professional Services
I am available for consultations or custom development. Contact me at [jawad.bentaleb@gmail.com](mailto:jawad.bentaleb@gmail.com) for more information.