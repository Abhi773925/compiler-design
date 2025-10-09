# PrepMate - Collaborative Coding Platform

## 🚀 Overview

PrepMate is a modern collaborative coding platform designed for technical interviews, pair programming, and algorithm practice. Built with the MERN stack and featuring real-time collaboration, video calls, chat, and LeetCode-style DSA problems.

## ✨ Features

- **🔐 Google OAuth Authentication** - Secure login with Google
- **💻 Live Code Editor** - Real-time collaborative code editing
- **👥 Live Collaboration** - Work together in real-time with your team
- **📹 Video Calls** - Integrated video conferencing for pair programming
- **💬 Chat Features** - Built-in messaging and communication tools
- **🖥️ Terminal Access** - Full terminal with GitHub integration
- **🧮 DSA Problems** - LeetCode-style problems with test cases and execution
- **🌓 Dark/Light Mode** - Beautiful UI with theme switching
- **📱 Responsive Design** - Works perfectly on all devices

## 🛠️ Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Aceternity UI** - Beautiful UI components
- **Google OAuth** - Authentication
- **Socket.IO Client** - Real-time communication

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication
- **JWT** - JSON Web Tokens for authentication
- **Google OAuth Library** - Google authentication

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google OAuth credentials
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repository-url>
   cd compiler-design
   ```

2. **Set up the Frontend**

   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

3. **Set up the Backend**

   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Configuration**

   ```bash
   # In the backend directory
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/prepmate
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=http://localhost:5173
   ```

5. **Google OAuth Setup**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5173` to authorized origins
   - Copy Client ID and update both frontend and backend

6. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

### 🏃‍♂️ Running the Application

1. **Start the Backend**

   ```bash
   cd backend
   npm run dev
   ```

   Backend will run on `https://compiler-design.onrender.com`

2. **Start the Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
compiler-design/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── ui/         # UI components (Aceternity)
│   │   │   ├── layout/     # Layout components
│   │   │   ├── auth/       # Authentication components
│   │   │   └── landingpage/ # Landing page components
│   │   ├── context/        # React context providers
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utility functions
│   │   └── assets/         # Static assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── package.json
└── README.md
```

## 🎨 UI Components

PrepMate uses custom Aceternity UI components:

- **MovingBorder** - Animated border effects
- **TypewriterEffect** - Typewriter text animation
- **Spotlight** - Spotlight background effect
- **Button** - Customizable button component
- **TextGenerateEffect** - Text generation animation

## 🔧 Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/preferences` - Update user preferences
- `POST /api/auth/logout` - Logout user

### Users

- `GET /api/users/profile/:id` - Get user profile
- `PATCH /api/users/profile` - Update user profile
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/search` - Search users

### Projects

- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/collaborators` - Add collaborator

## 🎯 Roadmap

### Phase 1 (Current)

- ✅ Landing page with modern UI
- ✅ Google OAuth authentication
- ✅ Dark/Light mode toggle
- ✅ Responsive design
- ✅ Basic project structure

### Phase 2 (Next)

- 🔄 Live code editor implementation
- 🔄 Real-time collaboration
- 🔄 Video call integration
- 🔄 Chat system
- 🔄 Terminal with GitHub integration

### Phase 3 (Future)

- 📋 DSA problems database
- 🧪 Test case execution
- 📊 Analytics and progress tracking
- 🎨 Advanced UI animations
- 🔍 Advanced search and filtering

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Aceternity UI](https://ui.aceternity.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Socket.IO](https://socket.io/) for real-time communication

## 📞 Support

If you have any questions or need help, please open an issue or contact the development team.

---

**Happy Coding! 🚀**
