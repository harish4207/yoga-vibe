# Yoga Studio Management System

A full-stack web application for managing a yoga studio, built with React, Node.js, and TypeScript.

## Features

- User authentication (Email/Password and Google OAuth)
- Class scheduling and management
- Student registration and attendance tracking
- Payment integration with Razorpay
- Admin dashboard for studio management
- Responsive design for all devices

## Tech Stack

### Frontend
- React
- TypeScript
- Material-UI
- Redux Toolkit
- React Router
- Axios

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Passport.js (Authentication)
- JWT

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Cloud Console account (for OAuth)
- Razorpay account (for payments)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd yoga-studio
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:

Create `.env` files in both `client` and `server` directories with the following variables:

Server (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
```

Client (.env):
```
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
VITE_API_URL=http://localhost:5000/api
```

4. Start the development servers:

```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Material-UI](https://mui.com/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Google Fonts](https://fonts.google.com/) 