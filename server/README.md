# Asana Clone - Backend Server

A comprehensive backend server for the Asana Clone application built with Node.js, Express, MongoDB, and Socket.IO.

## Features

### Core Functionality
- ✅ **Authentication & User Management** - JWT-based authentication, user profiles, preferences
- ✅ **Workspace Management** - Create and manage multiple workspaces with role-based access
- ✅ **Team Management** - Organize users into teams within workspaces
- ✅ **Project Management** - Create projects with multiple views (List, Board, Timeline, Calendar)
- ✅ **Task Management** - Complete task CRUD with subtasks, dependencies, and custom fields
- ✅ **Sections** - Organize tasks within customizable sections
- ✅ **Comments & Collaboration** - Threaded comments with mentions and emoji reactions
- ✅ **Activity Tracking** - Comprehensive activity logs for all actions
- ✅ **Notifications** - Real-time notifications for assignments, mentions, and updates
- ✅ **File Attachments** - Upload and attach files to tasks and comments
- ✅ **Search & Filtering** - Advanced search and filtering capabilities
- ✅ **Workflow Automations** - Create custom automation rules
- ✅ **Real-time Updates** - WebSocket integration for live collaboration

### Technical Features
- RESTful API design
- MongoDB with Mongoose ODM
- JWT authentication
- WebSocket (Socket.IO) for real-time updates
- File upload support with Multer
- Role-based access control
- Activity logging
- Comprehensive error handling
- Security with Helmet.js

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn

## Installation

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # MongoDB Atlas Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/asana-clone?retryWrites=true&w=majority

   # JWT Secret (use a strong random string)
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   JWT_EXPIRE=7d

   # File Upload
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads

   # CORS
   CLIENT_URL=http://localhost:5173
   ```

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose the FREE tier (M0 Sandbox)
   - Select a cloud provider and region
   - Create cluster

3. **Configure Database Access:**
   - Go to "Database Access" in the left sidebar
   - Add a new database user
   - Choose authentication method (Username/Password recommended)
   - Create username and password (save these!)
   - Set user privileges to "Read and write to any database"

4. **Configure Network Access:**
   - Go to "Network Access" in the left sidebar
   - Add IP Address
   - For development, you can click "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, add your server's IP address

5. **Get Connection String:**
   - Go to "Database" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `asana-clone` (or your preferred database name)
   - Update `MONGODB_URI` in your `.env` file

   Example:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/asana-clone?retryWrites=true&w=majority
   ```

## Running the Server

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:5000` with hot-reload enabled.

### Production Mode
```bash
npm start
```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/me` | Get current user | Yes |
| PUT | `/auth/profile` | Update user profile | Yes |
| POST | `/auth/onboarding` | Complete onboarding | Yes |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/search?q=query` | Search users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| GET | `/users/notifications` | Get notifications | Yes |
| PUT | `/users/notifications/:id/read` | Mark notification as read | Yes |
| PUT | `/users/notifications/read-all` | Mark all notifications as read | Yes |
| GET | `/users/activity` | Get activity feed | Yes |

### Workspaces
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/workspaces` | Get all workspaces | Yes |
| POST | `/workspaces` | Create workspace | Yes |
| GET | `/workspaces/:id` | Get workspace by ID | Yes |
| PUT | `/workspaces/:id` | Update workspace | Yes |
| DELETE | `/workspaces/:id` | Delete workspace | Yes |
| POST | `/workspaces/:id/members` | Invite member | Yes |
| DELETE | `/workspaces/:id/members/:userId` | Remove member | Yes |
| PUT | `/workspaces/:id/members/:userId` | Update member role | Yes |
| GET | `/workspaces/:id/teams` | Get teams | Yes |
| POST | `/workspaces/:id/teams` | Create team | Yes |

### Projects
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/projects/workspace/:workspaceId` | Get all projects | Yes |
| POST | `/projects/workspace/:workspaceId` | Create project | Yes |
| GET | `/projects/:id` | Get project by ID | Yes |
| PUT | `/projects/:id` | Update project | Yes |
| DELETE | `/projects/:id` | Delete project | Yes |
| POST | `/projects/:id/members` | Add member | Yes |
| DELETE | `/projects/:id/members/:userId` | Remove member | Yes |
| POST | `/projects/:id/sections` | Create section | Yes |
| PUT | `/projects/:id/sections/:sectionId` | Update section | Yes |
| DELETE | `/projects/:id/sections/:sectionId` | Delete section | Yes |
| POST | `/projects/:id/custom-fields` | Create custom field | Yes |

### Tasks
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks/search` | Search tasks | Yes |
| GET | `/tasks/my-tasks` | Get my tasks | Yes |
| GET | `/tasks/project/:projectId` | Get tasks in project | Yes |
| POST | `/tasks/project/:projectId` | Create task | Yes |
| GET | `/tasks/:id` | Get task by ID | Yes |
| PUT | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |
| POST | `/tasks/:id/subtasks` | Add subtask | Yes |
| PUT | `/tasks/:id/subtasks/:subtaskId` | Update subtask | Yes |
| DELETE | `/tasks/:id/subtasks/:subtaskId` | Delete subtask | Yes |
| GET | `/tasks/:id/comments` | Get comments | Yes |
| POST | `/tasks/:id/comments` | Add comment | Yes |
| PUT | `/tasks/comments/:id` | Update comment | Yes |
| DELETE | `/tasks/comments/:id` | Delete comment | Yes |
| POST | `/tasks/comments/:id/reactions` | Add reaction | Yes |
| DELETE | `/tasks/comments/:id/reactions/:reactionId` | Remove reaction | Yes |
| POST | `/tasks/:id/followers` | Add follower | Yes |
| DELETE | `/tasks/:id/followers/:userId` | Remove follower | Yes |
| POST | `/tasks/:id/dependencies` | Add dependency | Yes |
| DELETE | `/tasks/:id/dependencies/:dependencyId` | Remove dependency | Yes |

### File Upload
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/upload` | Upload single file | No |
| POST | `/upload/multiple` | Upload multiple files | No |

### Health Check
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Server health check | No |

## Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  role: String (user, admin),
  workspaces: [ObjectId],
  teams: [ObjectId],
  preferences: {
    theme: String,
    notifications: Object,
    keyboardShortcuts: Boolean
  },
  onboarded: Boolean,
  timestamps: true
}
```

### Workspace
```javascript
{
  name: String,
  description: String,
  owner: ObjectId,
  members: [{
    user: ObjectId,
    role: String (owner, admin, member, guest),
    joinedAt: Date
  }],
  teams: [ObjectId],
  projects: [ObjectId],
  settings: Object,
  timestamps: true
}
```

### Project
```javascript
{
  name: String,
  description: String,
  workspace: ObjectId,
  team: ObjectId,
  owner: ObjectId,
  members: [{
    user: ObjectId,
    role: String (owner, editor, viewer),
    addedAt: Date
  }],
  sections: [{ name, order, collapsed }],
  customFields: [{ name, type, options, required }],
  color: String,
  icon: String,
  view: String (list, board, timeline, calendar),
  status: String (active, archived, completed),
  startDate: Date,
  dueDate: Date,
  privacy: String (public, private),
  taskCount: Number,
  completedTaskCount: Number,
  timestamps: true
}
```

### Task
```javascript
{
  title: String,
  description: String,
  project: ObjectId,
  section: ObjectId,
  assignee: ObjectId,
  assignedBy: ObjectId,
  creator: ObjectId,
  status: String (todo, in_progress, completed, blocked),
  priority: String (low, medium, high, urgent),
  tags: [String],
  startDate: Date,
  dueDate: Date,
  completedAt: Date,
  subtasks: [{ title, completed, order, completedBy, completedAt }],
  attachments: [{ name, url, size, type, uploadedBy, uploadedAt }],
  followers: [ObjectId],
  dependencies: {
    blockedBy: [ObjectId],
    blocking: [ObjectId]
  },
  customFields: Map,
  order: Number,
  commentCount: Number,
  timestamps: true
}
```

## WebSocket Events

The server uses Socket.IO for real-time updates. Connect to the WebSocket server with authentication:

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: 'your-jwt-token'
  }
});

// Join rooms
socket.emit('join-workspace', workspaceId);
socket.emit('join-project', projectId);

// Listen for events
socket.on('notification', (data) => { /* handle notification */ });
socket.on('task-created', (data) => { /* handle task creation */ });
socket.on('task-updated', (data) => { /* handle task update */ });
socket.on('comment-added', (data) => { /* handle new comment */ });
```

### Available Events

**Client to Server:**
- `join-workspace` - Join workspace room
- `join-project` - Join project room
- `leave-workspace` - Leave workspace room
- `leave-project` - Leave project room

**Server to Client:**
- `notification` - New notification
- `activity` - New activity
- `workspace-updated` - Workspace updated
- `project-created` - Project created
- `project-updated` - Project updated
- `project-deleted` - Project deleted
- `task-created` - Task created
- `task-updated` - Task updated
- `task-deleted` - Task deleted
- `comment-added` - Comment added
- `member-added` - Member added
- `member-removed` - Member removed

## Automation System

Create workflow automations through the automation model:

### Triggers
- `task_created` - When a task is created
- `task_completed` - When a task is completed
- `task_moved` - When a task is moved to different section
- `status_changed` - When task status changes
- `assignee_changed` - When task assignee changes
- `due_date_approaching` - When due date is near
- `tag_added` - When a tag is added

### Actions
- `assign_task` - Assign task to user
- `move_to_section` - Move task to section
- `set_status` - Set task status
- `set_priority` - Set task priority
- `add_tag` - Add tag to task
- `send_notification` - Send notification
- `add_comment` - Add comment to task
- `set_due_date` - Set due date
- `mark_complete` - Mark task as complete

## Security

- JWT tokens for authentication
- Bcrypt for password hashing
- Helmet.js for HTTP headers security
- Input validation with express-validator
- Role-based access control
- CORS protection
- File upload restrictions

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── socket.js             # Socket.IO configuration
│   ├── models/
│   │   ├── User.js               # User model
│   │   ├── Workspace.js          # Workspace model
│   │   ├── Team.js               # Team model
│   │   ├── Project.js            # Project model
│   │   ├── Task.js               # Task model
│   │   ├── Comment.js            # Comment model
│   │   ├── Notification.js       # Notification model
│   │   ├── Automation.js         # Automation model
│   │   └── ActivityLog.js        # Activity log model
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── user.controller.js    # User operations
│   │   ├── workspace.controller.js # Workspace operations
│   │   ├── project.controller.js # Project operations
│   │   └── task.controller.js    # Task operations
│   ├── routes/
│   │   ├── auth.routes.js        # Auth routes
│   │   ├── user.routes.js        # User routes
│   │   ├── workspace.routes.js   # Workspace routes
│   │   ├── project.routes.js     # Project routes
│   │   └── task.routes.js        # Task routes
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── errorHandler.js       # Error handling
│   ├── utils/
│   │   ├── notifications.js      # Notification helpers
│   │   └── automations.js        # Automation execution
│   └── server.js                 # Main server file
├── uploads/                      # Uploaded files
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore file
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Error Handling

All errors return a consistent format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Success responses:

```json
{
  "success": true,
  "data": { ... }
}
```

## Development Tips

1. **Database Seeding**: Create a seed script to populate test data
2. **API Testing**: Use Postman or Thunder Client for testing endpoints
3. **Logging**: Check console logs for debugging
4. **MongoDB Compass**: Use MongoDB Compass to visualize your database

## Troubleshooting

### MongoDB Connection Issues
- Verify MongoDB URI is correct
- Check network access settings in MongoDB Atlas
- Ensure IP address is whitelisted
- Verify database user credentials

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### File Upload Issues
- Check `MAX_FILE_SIZE` in `.env`
- Verify `uploads/` directory exists
- Check file type restrictions in `server.js`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions, please create an issue in the GitHub repository.
