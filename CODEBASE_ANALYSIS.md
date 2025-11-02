# Asana-Clone Codebase Structure Analysis

## Project Overview

**Repository**: `/Users/anshalkumar/Asana-Clone`  
**Current Branch**: `client-server`  
**Architecture**: Client-Server with React frontend and Node.js/Express backend

---

## Technology Stack

### Frontend (Client)
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **State Management**: Zustand 5.0.8
- **Styling**: Tailwind CSS 3.4.17 with shadcn/ui components
- **UI Component Library**: Radix UI (accessibility-first components)
- **Form Handling**: React Hook Form 7.61.1 + Zod validation
- **HTTP Client**: Axios 1.13.1
- **Query Management**: TanStack React Query 5.83.0
- **Routing**: React Router DOM 6.30.1
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **Notifications**: react-hot-toast, sonner
- **Icons**: Lucide React 0.462.0
- **Date Handling**: date-fns 3.6.0

### Backend (Server)
- **Framework**: Express 5.1.0
- **Database**: MongoDB with Mongoose 8.19.2
- **Authentication**: JWT (jsonwebtoken 9.0.2), bcryptjs
- **Real-time**: Socket.io 4.8.1
- **Security**: Helmet 8.1.0, CORS 2.8.5
- **Validation**: express-validator 7.3.0
- **File Upload**: Multer 2.0.2
- **Logging**: Morgan 1.10.1
- **Environment**: dotenv 17.2.3

---

## Client-Side Architecture

### Directory Structure

```
client/src/
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── AppSidebar.tsx           # Main navigation sidebar
│   ├── DashboardHeader.tsx       # Top navigation bar
│   ├── CreateTaskDialog.tsx      # Task creation modal
│   ├── CreateProjectDialog.tsx   # Project creation modal
│   ├── TaskCard.tsx             # Reusable task card component
│   ├── LearningCard.tsx         # Learning/onboarding cards
│   └── ProtectedRoute.tsx        # Auth wrapper for routes
├── pages/
│   ├── Index.tsx                # Landing page
│   ├── Login.tsx                # Login page
│   ├── Register.tsx             # Registration page
│   ├── Dashboard.tsx            # Main dashboard (home)
│   ├── MyTasks.tsx              # User's tasks list view
│   ├── ProjectDetail.tsx        # Project details with multiple views
│   ├── Welcome.tsx              # Welcome/onboarding page
│   ├── Onboarding.tsx           # Setup wizard
│   └── NotFound.tsx             # 404 page
├── store/                       # Zustand stores (state management)
│   ├── auth.store.ts            # Authentication state
│   ├── task.store.ts            # Tasks state
│   ├── project.store.ts         # Projects state
│   └── workspace.store.ts       # Workspaces state
├── services/                    # API service layer
│   ├── auth.service.ts          # Auth API calls
│   ├── task.service.ts          # Task API calls
│   ├── project.service.ts       # Project API calls
│   └── workspace.service.ts     # Workspace API calls
├── lib/
│   ├── axios.ts                 # Configured axios instance
│   └── utils.ts                 # Utility functions
├── hooks/
│   ├── use-toast.ts             # Toast notifications
│   └── use-mobile.tsx           # Mobile responsive hook
├── App.tsx                      # Main app component with routing
├── main.tsx                     # React entry point
└── index.css                    # Global styles
```

### Key Pages & Components

#### 1. **Dashboard.tsx** (Main dashboard)
- **Purpose**: Home view with overview, upcoming tasks, and projects
- **Features**:
  - Greeting with current date/time
  - "My tasks" section (upcoming tasks)
  - Projects section with task counts
  - "Learn Asana" educational cards
  - "Tasks I've assigned" section
  - Goals section with progress bars
  - People/collaborators section
- **Data Flow**: Fetches workspaces, projects, and tasks on mount
- **Components Used**: AppSidebar, DashboardHeader, TaskCard, LearningCard, CreateProjectDialog

#### 2. **ProjectDetail.tsx** (Project view with multiple layouts)
- **Purpose**: Detailed view of a single project with multiple view options
- **View Options**:
  - **List View**: Tasks grouped by sections (default, fully implemented)
  - **Board View**: Kanban-style columns by sections
  - **Timeline View**: Gantt chart (placeholder - coming soon)
  - **Calendar View**: Calendar-based task view (placeholder - coming soon)
- **Features**:
  - Task status indicator (checkbox with icon)
  - Priority badges (color-coded)
  - Due dates
  - Assignee avatars
  - Add task buttons per section
- **Data Structure**: Projects have sections, tasks belong to sections
- **Key State**: `selectedView` (list|board|timeline|calendar)

#### 3. **MyTasks.tsx** (User's personal task list)
- **Purpose**: Comprehensive task management view for the current user
- **View Options**:
  - **List View** (current): Table format with sections
  - **Board**: (UI prepared, not fully implemented)
  - **Calendar**: (UI prepared, not fully implemented)
  - **Dashboard**: (UI prepared, not fully implemented)
  - **Files**: (UI prepared, not fully implemented)
- **Task Sections**:
  - Recently Assigned (created in last 3 days)
  - Do Today (tasks due today or overdue)
  - Do Next Week (tasks due within 7 days)
  - Do Later (all other tasks)
- **Features**:
  - Collapsible sections with chevron icons
  - Task completion toggle (checkbox)
  - Due date formatting (relative dates: Today, Tomorrow, or date format)
  - Project color indicators
  - Workspace display
  - Filter, Sort, Group, Options buttons (UI only)
  - Add task button per section
- **Filtering**: Tasks assigned to or created by the current user
- **Styling**: Dark theme (neutral-950 background)

### State Management (Zustand Stores)

#### **auth.store.ts**
```typescript
{
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Methods
  login(email, password)
  register(name, email, password)
  logout()
  loadUser()
  clearError()
}
```

#### **task.store.ts**
```typescript
{
  tasks: Task[]
  currentTask: Task | null
  filters: TaskFilters
  isLoading: boolean
  error: string | null
  
  // Methods
  fetchTasks(filters?)
  setCurrentTask(task)
  createTask(data)
  updateTask(id, data)
  deleteTask(id)
  addComment(taskId, text)
  addSubtask(taskId, title, assignee?)
  updateSubtask(taskId, subtaskId, completed)
  setFilters(filters)
  clearError()
}
```

#### **project.store.ts**
```typescript
{
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
  
  // Methods
  fetchProjects(workspaceId?)
  setCurrentProject(project)
  createProject(data)
  updateProject(id, data)
  deleteProject(id)
  addSection(projectId, name, order?)
  clearError()
}
```

#### **workspace.store.ts**
```typescript
{
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  isLoading: boolean
  error: string | null
  
  // Methods
  fetchWorkspaces()
  setCurrentWorkspace(workspace)
  createWorkspace(data)
  updateWorkspace(id, data)
  deleteWorkspace(id)
  clearError()
}
```

### Data Models/Interfaces

#### **Task**
```typescript
{
  _id: string
  title: string
  description?: string
  project: string | Project
  section?: string
  assignee?: string | User
  assignedBy?: string | User
  status: 'todo' | 'in_progress' | 'completed' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  dueDate?: string
  startDate?: string
  completedAt?: string
  tags: string[]
  subtasks: Subtask[]
  attachments: TaskAttachment[]
  comments: TaskComment[]
  followers: string[]
  dependencies: string[]
  order: number
  createdAt: string
  updatedAt: string
}
```

#### **Project**
```typescript
{
  _id: string
  name: string
  description?: string
  workspace: string
  owner: string
  team?: string
  members: ProjectMember[]
  sections: ProjectSection[]  // Sections like "To Do", "In Progress", "Done"
  color: string               // Hex color for project
  icon: string                // Emoji or icon
  view: 'list' | 'board' | 'timeline' | 'calendar'
  status: 'active' | 'archived' | 'completed'
  dueDate?: string
  isPrivate: boolean
  createdAt: string
  updatedAt: string
}
```

#### **ProjectSection**
```typescript
{
  _id?: string
  name: string               // e.g., "To Do", "In Progress", "Done"
  order: number
}
```

#### **Workspace**
```typescript
{
  _id: string
  name: string
  description?: string
  owner: string
  members: WorkspaceMember[]
  createdAt: string
  updatedAt: string
}
```

---

## Existing Components & Features

### Layout Components
- **AppSidebar**: Main navigation sidebar with:
  - Create button
  - Navigation items (Home, My tasks, Inbox)
  - Insights section (Reporting, Portfolios, Goals)
  - Projects list
  - Team section
  - Trial/billing info
- **DashboardHeader**: Top navigation bar with user menu and search

### Task Management Components
- **TaskCard**: Reusable task display component showing:
  - Task title
  - Project name with color indicator
  - Due date (formatted)
- **CreateTaskDialog**: Modal form for creating tasks with:
  - Title, description inputs
  - Project selection
  - Status and priority dropdowns
  - Due date picker
  - Form validation (Zod)

### UI Component Library
- Full shadcn/ui component set available:
  - Buttons, inputs, selects, textareas
  - Dialogs, alerts, drawers
  - Dropdowns, popovers, tooltips
  - Tabs, accordion, collapsible
  - Toast notifications
  - Calendar picker
  - Tables, pagination
  - Badges, badges, progress bars

---

## What Needs to be Created/Updated for Task List Layout

### Missing Components/Features

1. **TaskListItem Component** (for rendering individual tasks in a list)
   - Status indicator (circle/checkbox)
   - Task title
   - Priority indicator
   - Due date
   - Assignee avatar
   - Project indicator
   - Click handler for task detail view

2. **TaskListSection Component** (for collapsible sections)
   - Section header with count
   - Collapsible/expandable functionality
   - List of tasks in section
   - Add task button in section

3. **TaskDetailModal/Panel** (for task details)
   - Full task information display
   - Edit functionality
   - Subtasks display and management
   - Comments/activity feed
   - Attachments
   - Followers
   - Dependencies

4. **Filters & Controls**
   - Filter by status, priority, assignee, due date, project
   - Sort by various fields
   - Group by status/priority/assignee/project
   - Search functionality

5. **Board View Component** (Kanban)
   - Multiple columns for sections
   - Draggable task cards
   - Add task per column
   - Column management

6. **Timeline/Gantt View** (currently placeholder)
   - Horizontal timeline display
   - Drag to change dates
   - Dependency visualization

7. **Calendar View** (currently placeholder)
   - Month/week view
   - Tasks displayed on dates
   - Click to create task

8. **Task Actions**
   - Inline editing (title, status, priority)
   - Bulk operations (select multiple, change status)
   - Task deletion
   - Duplicate task
   - Archive task

---

## API Endpoints

### Task Endpoints
- `GET /tasks?project=...&assignee=...&status=...&priority=...&section=...`
- `GET /tasks/:id`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `POST /tasks/:id/comments`
- `PUT /tasks/:id/comments/:commentId`
- `DELETE /tasks/:id/comments/:commentId`
- `POST /tasks/:id/subtasks`
- `PUT /tasks/:id/subtasks/:subtaskId`
- `DELETE /tasks/:id/subtasks/:subtaskId`
- `POST /tasks/:id/followers`
- `DELETE /tasks/:id/followers/:userId`
- `POST /tasks/:id/dependencies`
- `DELETE /tasks/:id/dependencies/:dependencyId`

### Project Endpoints
- `GET /projects?workspace=...`
- `GET /projects/:id`
- `POST /projects`
- `PUT /projects/:id`
- `DELETE /projects/:id`
- `POST /projects/:id/sections`
- `PUT /projects/:id/sections/:sectionId`
- `DELETE /projects/:id/sections/:sectionId`
- `POST /projects/:id/members`
- `PUT /projects/:id/members/:memberId`
- `DELETE /projects/:id/members/:memberId`

### Workspace Endpoints
- `GET /workspaces`
- `GET /workspaces/:id`
- `POST /workspaces`
- `PUT /workspaces/:id`
- `DELETE /workspaces/:id`

### Authentication Endpoints
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

---

## Server-Side Structure

### Models
- **User.js**: User schema with email, password, name, etc.
- **Task.js**: Task schema with all task fields
- **Project.js**: Project schema with sections, members, etc.
- **Workspace.js**: Workspace schema
- **Team.js**: Team schema
- **Comment.js**: Comment/activity schema
- **Notification.js**: Notification schema
- **Automation.js**: Automation rules schema
- **ActivityLog.js**: Activity tracking schema

### Controllers
- **auth.controller.js**: Login, register, authentication
- **task.controller.js**: CRUD operations for tasks
- **project.controller.js**: CRUD operations for projects
- **workspace.controller.js**: CRUD operations for workspaces
- **user.controller.js**: User profile management

### Routes
- `/src/routes/auth.routes.js`
- `/src/routes/task.routes.js`
- `/src/routes/project.routes.js`
- `/src/routes/workspace.routes.js`
- `/src/routes/user.routes.js`

### Middleware
- **auth.js**: JWT authentication middleware
- **errorHandler.js**: Error handling middleware

### Utils
- **notifications.js**: Notification logic
- **automations.js**: Automation rules engine

### Config
- **db.js**: MongoDB connection
- **socket.js**: Socket.io configuration

---

## Key Features Already Implemented

1. **Authentication**: Login, register, JWT tokens
2. **User Dashboard**: Overview with tasks, projects, stats
3. **My Tasks Page**: List view with sections and filtering
4. **Project Management**: Create, edit, delete projects
5. **Task Management**: Create, edit, delete tasks with details
6. **Multiple View Options**: UI structure for list, board, timeline, calendar (partial)
7. **Workspace Management**: Create and manage workspaces
8. **Form Validation**: Zod schemas for data validation
9. **Error Handling**: Global error handlers and toast notifications
10. **Dark Theme**: Complete dark theme styling with Tailwind

---

## Architecture Patterns Used

1. **Component-Based Architecture**: React with functional components
2. **State Management**: Zustand for simple, lightweight state
3. **Service Layer**: Separate services for API calls
4. **Custom Hooks**: React hooks for reusable logic
5. **Form Handling**: React Hook Form + Zod for validation
6. **Protected Routes**: Role-based access control wrapper
7. **API Client**: Centralized Axios instance with interceptors
8. **Responsive Design**: Tailwind CSS with mobile-first approach
9. **Type Safety**: Full TypeScript coverage on client

---

## Current Styling & Theme

- **Color Scheme**: Dark (neutral-950 background, neutral-900 containers)
- **Primary Colors**: Orange accents (#FF6B35 or similar)
- **Text Colors**: White for primary, neutral-400 for secondary
- **Components**: Tailwind CSS + shadcn/ui
- **Shadows & Borders**: Subtle, using border-neutral-800

---

## Performance Considerations

1. **Code Splitting**: Vite enables automatic route-based code splitting
2. **Query Caching**: TanStack React Query for automatic API caching
3. **State Management**: Zustand is lightweight compared to Redux
4. **Virtual Scrolling**: Not yet implemented (might be needed for large task lists)
5. **Lazy Loading**: Images and components can be lazy loaded
6. **Bundle Size**: Good baseline with minimal dependencies

---

## Next Steps for Task List Layout Enhancement

1. Create `TaskListItem` component for better task row rendering
2. Create `TaskListSection` component for collapsible sections
3. Implement `TaskDetailPanel` for task details view
4. Add advanced filtering and sorting capabilities
5. Implement board/kanban view with drag-and-drop
6. Create timeline/Gantt view
7. Add calendar view
8. Implement task bulk operations
9. Add search functionality
10. Create task templates
11. Add task dependencies visualization
12. Implement activity timeline

