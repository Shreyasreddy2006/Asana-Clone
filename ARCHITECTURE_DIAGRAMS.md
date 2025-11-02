# Asana-Clone Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (React + TypeScript)                  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Pages                                │  │
│  │  ┌─────────────┬─────────────┬──────────────────────┐   │  │
│  │  │  Dashboard  │   MyTasks   │  ProjectDetail       │   │  │
│  │  └─────────────┴─────────────┴──────────────────────┘   │  │
│  │  ┌─────────────┬─────────────┬──────────────────────┐   │  │
│  │  │   Welcome   │ Onboarding  │   Login/Register     │   │  │
│  │  └─────────────┴─────────────┴──────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Components                             │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  TaskCard │ CreateTaskDialog │ AppSidebar │...  │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  UI Components (shadcn/ui, Radix UI)            │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            State Management (Zustand)                     │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐           │  │
│  │  │ auth     │ task     │ project  │workspace │           │  │
│  │  │ store    │ store    │ store    │ store    │           │  │
│  │  └──────────┴──────────┴──────────┴──────────┘           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Services (API Layer)                         │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐           │  │
│  │  │ auth     │ task     │ project  │workspace │           │  │
│  │  │ service  │ service  │ service  │ service  │           │  │
│  │  └──────────┴──────────┴──────────┴──────────┘           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Axios HTTP Client                           │  │
│  │  (Configured with interceptors, base URL, auth headers) │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │
┌─────────────────────────────────────────────────────────────────┐
│                  SERVER (Node.js + Express)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Routes                                │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐          │  │
│  │  │ /auth    │ /tasks   │ /projects│/workspace│          │  │
│  │  └──────────┴──────────┴──────────┴──────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Controllers                             │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐          │  │
│  │  │ auth     │ task     │ project  │workspace │          │  │
│  │  │ controller│ controller│ controller│controller│          │  │
│  │  └──────────┴──────────┴──────────┴──────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Middleware                              │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  JWT Auth Middleware │ Error Handler │ CORS     │   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  MongoDB Models                          │  │
│  │  ┌──────────┬──────────┬──────────┬──────────┐          │  │
│  │  │ User     │ Task     │ Project  │Workspace │          │  │
│  │  │ Team     │ Comment  │Notif     │Activity  │          │  │
│  │  └──────────┴──────────┴──────────┴──────────┘          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ MongoDB Driver
                              │
                    ┌─────────────────────┐
                    │   MongoDB Database  │
                    │  (Collections)      │
                    └─────────────────────┘
```

---

## Data Flow Diagram

### Task Creation Flow

```
User fills form
      │
      ▼
CreateTaskDialog component
      │
      ├─ React Hook Form validation (Zod schema)
      │
      ▼
useTaskStore.createTask(data)
      │
      ▼
taskService.create(data)
      │
      ▼
axios.post('/tasks', data)
      │
      ├─ JWT token in Authorization header
      │
      ▼
Server: POST /tasks route
      │
      ▼
Task controller
      │
      ├─ Validate input
      ├─ Check permissions
      │
      ▼
Task.create() (MongoDB)
      │
      ▼
Response: { success: true, task: {...} }
      │
      ▼
useTaskStore updates state
      │
      ▼
UI re-renders with new task
      │
      ▼
Toast notification: "Task created successfully!"
```

### Task Display Flow

```
User navigates to /my-tasks
      │
      ▼
MyTasks component mounts
      │
      ▼
useEffect hook triggers
      │
      ▼
useTaskStore.fetchTasks()
      │
      ▼
taskService.getAll()
      │
      ▼
axios.get('/tasks?filters')
      │
      ├─ JWT token in Authorization header
      │
      ▼
Server: GET /tasks route
      │
      ▼
Task controller
      │
      ├─ Apply filters (project, assignee, status, etc)
      │
      ▼
Task.find(filters) (MongoDB)
      │
      ▼
Response: { success: true, tasks: [...] }
      │
      ▼
useTaskStore.tasks updated
      │
      ▼
Component processes tasks:
      │
      ├─ Categorize into sections (Today, Next Week, Later)
      ├─ Format dates
      ├─ Group by assignment status
      │
      ▼
renderTaskRow for each task
      │
      ├─ Status checkbox
      ├─ Task title
      ├─ Due date
      ├─ Project indicator
      │
      ▼
UI displays task list with sections
```

---

## Component Hierarchy

### Dashboard Page Structure

```
Dashboard
├── AppSidebar
│   ├── Navigation Items
│   ├── Projects List
│   ├── Team Section
│   └── Trial Info
├── DashboardHeader
├── Main Content
│   ├── Greeting Section
│   ├── My Tasks Card
│   │   ├── TaskCard (x5)
│   │   └── Add Task Button
│   ├── Projects Card
│   │   ├── Project Items (x3)
│   │   └── Create Project Button
│   ├── Learn Asana Section
│   │   └── LearningCard (x4)
│   ├── Tasks I've Assigned Card
│   ├── Goals Card
│   └── People Card
└── CreateProjectDialog
```

### MyTasks Page Structure

```
MyTasks
├── AppSidebar
├── DashboardHeader
├── Header Section
│   ├── Title & Avatar
│   ├── Tab Navigation (List, Board, Calendar, etc)
│   ├── Action Bar
│   │   ├── Add Task Button
│   │   ├── Filter, Sort, Group, Options Buttons
│   │   └── Column Headers
│   └── Table Headers
├── Task Sections (x4)
│   ├── Recently Assigned
│   │   ├── Section Header
│   │   ├── TaskRow (x n)
│   │   │   ├── Status Checkbox
│   │   │   ├── Task Title
│   │   │   ├── Due Date
│   │   │   ├── Collaborators
│   │   │   ├── Project
│   │   │   └── Actions Menu
│   │   └── Add Task Button
│   ├── Do Today
│   │   └── (same structure)
│   ├── Do Next Week
│   │   └── (same structure)
│   └── Do Later
│       └── (same structure)
├── Add Section Button
└── CreateTaskDialog
```

### ProjectDetail Page Structure

```
ProjectDetail
├── Header
│   ├── Project Icon & Name
│   ├── View Tabs (List, Board, Timeline, Calendar)
│   └── Options Menu
├── Content
│   └── Selected View Component
│       ├── List View
│       │   └── Section (x n)
│       │       ├── Section Header
│       │       ├── TaskItem (x n)
│       │       └── Add Task Button
│       ├── Board View
│       │   └── Column (x n)
│       │       ├── Column Header
│       │       └── TaskCard (x n)
│       ├── Timeline View
│       │   └── Placeholder
│       └── Calendar View
│           └── Placeholder
```

---

## State Management Flow

### Task Store Lifecycle

```
Initial State
├── tasks: []
├── currentTask: null
├── filters: {}
├── isLoading: false
└── error: null

Action: fetchTasks()
├── Set isLoading: true
├── Call taskService.getAll(filters)
├── On success:
│   ├── Set tasks: [...]
│   ├── Set isLoading: false
│   └── Set error: null
└── On error:
    ├── Set error: message
    └── Set isLoading: false

Action: createTask()
├── Set isLoading: true
├── Call taskService.create(data)
├── On success:
│   ├── Add task to tasks array
│   ├── Set isLoading: false
│   └── Return new task
└── On error:
    ├── Set error: message
    └── Set isLoading: false

Action: updateTask()
├── Set isLoading: true
├── Call taskService.update(id, data)
├── On success:
│   ├── Update task in tasks array
│   ├── Update currentTask if it's the same
│   └── Set isLoading: false
└── On error:
    ├── Set error: message
    └── Set isLoading: false
```

---

## Authentication Flow

```
User visits /login
      │
      ▼
Credentials submitted
      │
      ▼
authService.login(email, password)
      │
      ▼
axios.post('/auth/login', credentials)
      │
      ▼
Server validates and returns:
      │
      ├─ token (JWT)
      └─ user { _id, name, email, ... }
      │
      ▼
Store in localStorage
      │
      ├─ localStorage.setItem('token', token)
      └─ localStorage.setItem('user', JSON.stringify(user))
      │
      ▼
Update auth store
      │
      ├─ user: User
      ├─ token: string
      ├─ isAuthenticated: true
      │
      ▼
Redirect to /dashboard or /onboarding
      │
      ▼
All subsequent requests include:
      │
      └─ Authorization: Bearer {token}
```

---

## API Request/Response Pattern

### Task Creation Request

```
POST /tasks

Headers:
  Authorization: Bearer eyJhbGc...
  Content-Type: application/json

Body:
{
  "title": "Design homepage mockup",
  "description": "Create mockups for the new homepage",
  "project": "project_id_123",
  "section": "section_id_456",
  "status": "todo",
  "priority": "high",
  "dueDate": "2025-11-10T00:00:00.000Z"
}

Response (200):
{
  "success": true,
  "task": {
    "_id": "task_id_789",
    "title": "Design homepage mockup",
    "description": "Create mockups for the new homepage",
    "project": "project_id_123",
    "section": "section_id_456",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-11-10T00:00:00.000Z",
    "assignee": null,
    "assignedBy": "user_id_123",
    "tags": [],
    "subtasks": [],
    "attachments": [],
    "comments": [],
    "followers": [],
    "dependencies": [],
    "order": 1,
    "createdAt": "2025-11-02T15:30:00.000Z",
    "updatedAt": "2025-11-02T15:30:00.000Z"
  }
}

Error Response (400):
{
  "success": false,
  "message": "Task title is required"
}
```

---

## Key Workflows

### 1. Project Setup Workflow

```
1. User logs in
2. Navigate to Dashboard
3. Click "Create Project" button
4. Fill project form (name, color, icon, description)
5. Project created with default sections (To Do, In Progress, Done)
6. Project appears in sidebar
7. User can click to navigate to project detail
```

### 2. Task Management Workflow

```
1. User navigates to My Tasks or Project Detail
2. Task appears in list/board view
3. User can:
   - Toggle completion (checkbox)
   - Click task to view details
   - Update priority, due date, assignee
   - Add comments and subtasks
   - Upload attachments
   - Delete task
```

### 3. Project Navigation Workflow

```
1. User clicks on project in sidebar
2. Navigates to /projects/:projectId
3. ProjectDetail component loads
4. Can switch between List, Board, Timeline, Calendar views
5. Tasks grouped by sections (To Do, In Progress, Done, etc)
```

---

## Component Reusability

### Shared Components

```
TaskCard
├── Used in: Dashboard (upcoming tasks section)
├── Props: title, project, dateRange, projectColor
└── Renders: Task title with project indicator and due date

LearningCard
├── Used in: Dashboard (Learn Asana section)
├── Props: title, description, duration, icon
└── Renders: Educational content card

CreateTaskDialog
├── Used in: Dashboard, MyTasks, ProjectDetail
├── Props: open, onOpenChange, defaultSection
└── Renders: Task creation form modal

CreateProjectDialog
├── Used in: Dashboard, AppSidebar
├── Props: open, onOpenChange
└── Renders: Project creation form modal

TaskRow (rendered in MyTasks)
├── Props: task, onToggleComplete, onTaskClick
└── Renders: Task table row with all details

AppSidebar
├── Used in: All authenticated pages
├── Renders: Navigation with projects list

DashboardHeader
├── Used in: All authenticated pages
├── Renders: Top navigation bar
```

