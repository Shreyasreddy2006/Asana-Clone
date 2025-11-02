# Asana Clone - Full-Stack Project Management Application

A production-ready, full-stack clone of Asana built with modern web technologies. This application provides comprehensive project management features including workspaces, projects, tasks, teams, and real-time collaboration.

## Features

### Core Functionality
- **User Authentication** - JWT-based authentication with secure password hashing
- **Workspaces** - Create and manage multiple workspaces
- **Projects** - Organize work into projects with sections
- **Tasks** - Create, assign, and track tasks with rich features:
  - Subtasks
  - Comments
  - Attachments
  - Dependencies
  - Followers
  - Due dates and priorities
- **Teams** - Collaborate with team members
- **Real-time Updates** - Socket.io integration for live collaboration
- **Email Notifications** - Automated email notifications for important events

### Production Features
- **Security**
  - Helmet.js for security headers
  - Rate limiting on critical endpoints
  - Input validation and sanitization
  - JWT authentication
  - CORS configuration

- **Performance**
  - Redis caching layer
  - Database query optimization
  - Compression middleware
  - File upload handling with Multer

- **Monitoring & Logging**
  - Winston logging infrastructure
  - HTTP request logging
  - Error tracking
  - Performance monitoring ready

- **Testing**
  - Jest testing framework
  - Unit and integration tests
  - Test coverage reporting

- **CI/CD**
  - GitHub Actions workflow
  - Automated testing
  - Security audits
  - Docker build verification

- **Deployment**
  - Docker containerization
  - Docker Compose for local development
  - Production-ready configuration

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer
- **Email**: Nodemailer
- **Real-time**: Socket.io
- **Security**: Helmet, express-rate-limit
- **Logging**: Winston
- **Testing**: Jest, Supertest

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Real-time**: Socket.io Client

## Project Structure

```
Asana/
├── Server/                 # Backend application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Entry point
│   ├── tests/             # Test files
│   ├── logs/              # Log files
│   ├── uploads/           # File uploads
│   ├── Dockerfile         # Docker configuration
│   └── package.json
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   └── App.tsx        # Root component
│   ├── Dockerfile         # Docker configuration
│   ├── nginx.conf         # Nginx configuration
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml         # CI/CD pipeline
├── docker-compose.yml     # Docker Compose config
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- MongoDB 7.0 or higher
- Redis 7.0 or higher (optional, for caching)
- npm or yarn

### Environment Variables

Create a `.env` file in the `Server` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=8765

# Database
MONGODB_URI=mongodb://localhost:27017/asana-clone

# Redis (optional)
REDIS_URL=redis://localhost:6379
REDIS_ENABLED=false

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:8080

# Email Configuration (optional)
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your-email@ethereal.email
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@asanaclone.com
EMAIL_FROM_NAME=Asana Clone
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:8765/api
VITE_SOCKET_URL=http://localhost:8765
```

### Installation & Running

#### Option 1: Local Development

**Backend:**
```bash
cd Server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

The backend will run on http://localhost:8765 and frontend on http://localhost:8080

#### Option 2: Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Backend on port 8765
- Frontend on port 8080

## API Documentation

### Base URL
`http://localhost:8765/api`

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/profile` | Update user profile |
| POST | `/auth/onboarding` | Complete onboarding |

### Workspace Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/workspaces` | Get all workspaces |
| POST | `/workspaces` | Create workspace |
| GET | `/workspaces/:id` | Get workspace by ID |
| PUT | `/workspaces/:id` | Update workspace |
| DELETE | `/workspaces/:id` | Delete workspace |
| POST | `/workspaces/:id/members` | Add member |
| DELETE | `/workspaces/:id/members/:userId` | Remove member |

### Project Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all projects |
| POST | `/projects` | Create project |
| GET | `/projects/:id` | Get project by ID |
| PUT | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| POST | `/projects/:id/sections` | Add section |
| PUT | `/projects/:id/sections/:sectionId` | Update section |
| DELETE | `/projects/:id/sections/:sectionId` | Delete section |
| POST | `/projects/:id/members` | Add member |
| DELETE | `/projects/:id/members/:userId` | Remove member |

### Task Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks (with advanced filtering) |
| POST | `/tasks` | Create task |
| GET | `/tasks/:id` | Get task by ID |
| PUT | `/tasks/:id` | Update task |
| DELETE | `/tasks/:id` | Delete task |
| POST | `/tasks/:id/comments` | Add comment |
| PUT | `/tasks/:id/comments/:commentId` | Update comment |
| DELETE | `/tasks/:id/comments/:commentId` | Delete comment |
| POST | `/tasks/:id/subtasks` | Add subtask |
| PUT | `/tasks/:id/subtasks/:subtaskId` | Update subtask |
| DELETE | `/tasks/:id/subtasks/:subtaskId` | Delete subtask |
| POST | `/tasks/:id/attachments` | Upload attachment |
| DELETE | `/tasks/:id/attachments/:attachmentId` | Delete attachment |
| POST | `/tasks/:id/followers` | Add follower |
| DELETE | `/tasks/:id/followers/:userId` | Remove follower |
| POST | `/tasks/:id/dependencies` | Add dependency |
| DELETE | `/tasks/:id/dependencies/:dependencyId` | Remove dependency |

### Team Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teams` | Get all teams |
| POST | `/teams` | Create team |
| GET | `/teams/:id` | Get team by ID |
| PUT | `/teams/:id` | Update team |
| DELETE | `/teams/:id` | Delete team |
| POST | `/teams/:id/members` | Add member |
| PUT | `/teams/:id/members/:memberId` | Update member role |
| DELETE | `/teams/:id/members/:userId` | Remove member |

## Testing

### Backend Tests

```bash
cd Server

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration
```

### Frontend Tests

```bash
cd client

# Run tests
npm test
```

## Deployment

### Docker Deployment

1. Build images:
```bash
docker-compose build
```

2. Push to registry:
```bash
docker tag asana-server your-registry/asana-server:latest
docker push your-registry/asana-server:latest

docker tag asana-client your-registry/asana-client:latest
docker push your-registry/asana-client:latest
```

3. Deploy to your hosting platform

### Manual Deployment

**Backend:**
```bash
cd Server
npm install --production
npm start
```

**Frontend:**
```bash
cd client
npm install
npm run build
# Serve the dist folder with nginx or any static server
```

## Performance Optimizations

- ✅ Redis caching for frequently accessed data
- ✅ MongoDB indexes on commonly queried fields
- ✅ Pagination for large datasets
- ✅ Compression middleware
- ✅ Rate limiting to prevent abuse
- ✅ File upload size limits
- ✅ Query optimization with Mongoose lean()
- ✅ Production build optimization

## Security Features

- ✅ Helmet.js security headers
- ✅ CORS configuration
- ✅ Rate limiting on auth endpoints
- ✅ Input validation and sanitization
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ File upload validation
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection

## Monitoring & Logging

- Winston logging infrastructure
- HTTP request logging
- Error tracking and logging
- Log rotation and archival
- Performance metrics ready

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Authors

Built with ❤️ by the development team

## Support

For issues and questions, please create an issue in the GitHub repository.
