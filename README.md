# Asana Clone - Full Stack Project Management Application (JavaScript Version)

A comprehensive project management application inspired by Asana, built with the MERN stack and **pure JavaScript** (no TypeScript).

## 🎉 **Now 100% JavaScript!**

The frontend has been completely converted from TypeScript to JavaScript for easier development and onboarding.

## Features

### Core Functionality
- **User Authentication** - Secure JWT-based authentication with registration and login
- **Workspaces** - Create and manage multiple workspaces with team collaboration
- **Projects** - Organize work into projects with customizable views (List, Board, Calendar)
- **Tasks** - Full task management with:
  - Subtasks and dependencies
  - Assignees and due dates
  - Priority levels and status tracking
  - Comments and attachments
  - Tags and custom fields
- **Teams** - Collaborate with team members across projects
- **Real-time Updates** - Stay synchronized with your team

### UI/UX Features
- Modern, clean Asana-inspired interface
- Responsive design for all devices
- Intuitive navigation and task organization
- Multiple project views (List, Board, Timeline, Calendar)
- Drag-and-drop task management
- Smart search and filtering

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend (**JavaScript**)
- **React 19** - UI library
- **JavaScript (ES6+)** - No TypeScript!
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Headless UI** - Accessible components
- **React Icons** - Icon library
- **date-fns** - Date utilities

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd Asana-Clone
   ```

2. **Set up the Server**
   ```bash
   cd Server
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Set up the Client**
   ```bash
   cd Client
   npm install
   cp .env.example .env
   # Edit .env with your API URL
   ```

### Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start the Server** (in a new terminal)
   ```bash
   cd Server
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Start the Client** (in a new terminal)
   ```bash
   cd Client
   npm run dev
   # Client runs on http://localhost:5173
   ```

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Register a new account or login
   - Start creating workspaces, projects, and tasks!

## Project Structure

```
Asana-Clone/
├── Server/                 # Backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Entry point
│   └── package.json
│
├── Client/                # Frontend application (JavaScript)
│   ├── src/
│   │   ├── components/    # Reusable components (.jsx)
│   │   ├── pages/         # Page components (.jsx)
│   │   ├── layouts/       # Layout components (.jsx)
│   │   ├── store/         # State management (.js)
│   │   ├── services/      # API services (.js)
│   │   ├── types/         # Empty (no types needed)
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   └── package.json
│
├── README.md
├── SETUP.md
├── FIXES_APPLIED.md
└── TYPESCRIPT_TO_JAVASCRIPT_CONVERSION.md
```

## API Documentation

See [Server/README.md](Server/README.md) for complete API documentation.

### Key Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/workspaces` - Get all workspaces
- `GET /api/projects` - Get all projects
- `GET /api/tasks` - Get all tasks
- And many more...

## Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[FIXES_APPLIED.md](FIXES_APPLIED.md)** - All bug fixes and improvements
- **[TYPESCRIPT_TO_JAVASCRIPT_CONVERSION.md](TYPESCRIPT_TO_JAVASCRIPT_CONVERSION.md)** - TypeScript → JavaScript conversion details
- **[Server/README.md](Server/README.md)** - Backend API documentation
- **[Client/README.md](Client/README.md)** - Frontend documentation

## Key Features

✅ **100% JavaScript** - No TypeScript complexity
🎨 **Modern UI** - Asana-inspired design with gradients
🔐 **Secure Auth** - JWT-based authentication
📊 **Task Management** - Create, assign, prioritize, and track
👥 **Collaboration** - Workspaces, projects, and teams
🎯 **Multiple Views** - List, Board, and Calendar
📱 **Responsive** - Works on all devices
⚡ **Fast** - Built with Vite for optimal performance

## Why JavaScript Instead of TypeScript?

We converted the entire frontend to JavaScript for several benefits:

1. **Simpler Setup** - No TypeScript compilation
2. **Faster Builds** - No type checking overhead
3. **Easier Learning Curve** - More accessible for beginners
4. **More Flexible** - Dynamic typing for rapid development
5. **Smaller Footprint** - No TypeScript dependencies

## Development

### Code Style
- ES6+ features (arrow functions, destructuring, etc.)
- Functional components with hooks
- Clean, readable code with comments
- Consistent naming conventions

### State Management
- Zustand for global state
- React hooks for local state
- No Redux complexity

### Styling
- Tailwind CSS utility classes
- Custom Asana-inspired color palette
- Responsive design patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Troubleshooting

See [SETUP.md](SETUP.md) for common issues and solutions.

Quick fixes:
- **MongoDB not connecting**: Check if MongoDB is running
- **Port already in use**: Change PORT in .env
- **Build errors**: Clear node_modules and reinstall

## License

MIT License - feel free to use this project for learning and development!

## Acknowledgments

- Inspired by [Asana](https://asana.com)
- Built with modern JavaScript and React
- Uses the MERN stack

## Support

For issues or questions:
1. Check the documentation in the docs folder
2. Review SETUP.md for setup help
3. Check FIXES_APPLIED.md for known issues

---

**Happy Coding!** 🚀

Made with ❤️ using JavaScript and React
