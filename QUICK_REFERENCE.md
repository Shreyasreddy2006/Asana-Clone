# Asana-Clone - Quick Reference Guide

## File Structure at a Glance

### Client Entry Points
- **Main App**: `/client/src/App.tsx` - Route configuration
- **Root Component**: `/client/src/main.tsx` - React entry point
- **Config**: `/client/vite.config.ts`, `/client/tailwind.config.ts`

### Key Client Directories
```
client/src/
├── pages/              # Page components (routes)
├── components/         # Reusable components
├── store/             # Zustand state management
├── services/          # API service layer
├── lib/               # Utilities and configs
└── hooks/             # Custom React hooks
```

### Key Server Directories
```
server/src/
├── routes/            # Express route handlers
├── controllers/       # Route logic
├── models/            # MongoDB schemas
├── middleware/        # Express middleware
├── config/            # Configuration files
└── utils/             # Utility functions
```

---

## Common Tasks & File Locations

### Adding a New Page
1. Create file: `/client/src/pages/YourPage.tsx`
2. Add route to: `/client/src/App.tsx`
3. Add sidebar link in: `/client/src/components/AppSidebar.tsx`
4. Use stores: `useAuthStore`, `useTaskStore`, etc.

### Adding a New Component
1. Create file: `/client/src/components/YourComponent.tsx`
2. Use UI components from: `/client/src/components/ui/`
3. Import and use in pages or other components

### Modifying Task Functionality
1. **Data Model**: Check `/server/src/models/Task.js`
2. **API Endpoint**: Check `/server/src/routes/task.routes.js`
3. **Controller Logic**: `/server/src/controllers/task.controller.js`
4. **Service Layer**: `/client/src/services/task.service.ts`
5. **State Management**: `/client/src/store/task.store.ts`
6. **UI Components**: `/client/src/pages/MyTasks.tsx` or `/pages/ProjectDetail.tsx`

### Adding Form Validation
1. Use React Hook Form: Already imported in most dialogs
2. Use Zod schemas: See `/client/src/components/CreateTaskDialog.tsx` for pattern
3. Example schema location: Inside component file or `/client/src/lib/`

---

## Current Views & Routes

| Route | Component | Purpose | Status |
|-------|-----------|---------|--------|
| `/` | Index.tsx | Landing page | Complete |
| `/login` | Login.tsx | Authentication | Complete |
| `/register` | Register.tsx | User signup | Complete |
| `/dashboard` | Dashboard.tsx | Home overview | Complete |
| `/my-tasks` | MyTasks.tsx | Personal task list | Complete |
| `/projects/:projectId` | ProjectDetail.tsx | Project view | Partial |
| `/welcome` | Welcome.tsx | First-time greeting | Complete |
| `/onboarding` | Onboarding.tsx | Setup wizard | Complete |
| `/inbox` | Not created | Task inbox | Not implemented |
| `/reporting` | Not created | Analytics | Not implemented |
| `/portfolios` | Not created | Portfolio view | Not implemented |
| `/goals` | Not created | Goals tracking | Not implemented |

---

## State Management Quick Reference

### Accessing Stores

```typescript
import { useAuthStore } from '@/store/auth.store';
import { useTaskStore } from '@/store/task.store';
import { useProjectStore } from '@/store/project.store';
import { useWorkspaceStore } from '@/store/workspace.store';

// In component
const { user, login, logout } = useAuthStore();
const { tasks, fetchTasks, createTask, updateTask } = useTaskStore();
const { projects, fetchProjects, currentProject } = useProjectStore();
const { workspaces, currentWorkspace } = useWorkspaceStore();
```

### Common Patterns

**Fetching Data on Mount**
```typescript
useEffect(() => {
  fetchTasks();
  fetchProjects();
}, []);
```

**Creating Data**
```typescript
const { createTask } = useTaskStore();
try {
  const newTask = await createTask({
    title: 'Task title',
    project: projectId,
    priority: 'high',
    dueDate: '2025-11-10'
  });
} catch (error) {
  toast.error('Failed to create task');
}
```

**Updating Data**
```typescript
const { updateTask } = useTaskStore();
await updateTask(taskId, { 
  status: 'completed',
  priority: 'medium' 
});
```

---

## UI Component Library

### Most Used shadcn/ui Components

```typescript
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
```

### Styling Classes

**Dark Theme Colors**
- Background: `bg-neutral-950`, `bg-neutral-900`
- Text: `text-white`, `text-neutral-400`
- Borders: `border-neutral-800`
- Hover: `hover:bg-neutral-800`

**Status Colors**
- Completed: Green (`text-green-500`, `bg-green-500`)
- Urgent: Red (`text-red-700`, `bg-red-100`)
- High: Orange (`text-orange-700`, `bg-orange-100`)
- Medium: Yellow (`text-yellow-700`, `bg-yellow-100`)
- Low: Green (`text-green-700`, `bg-green-100`)

---

## API Service Pattern

### Creating a Service

```typescript
// /client/src/services/yourService.ts

import api from '@/lib/axios';

export interface YourInterface {
  _id: string;
  name: string;
  // ... other fields
}

export const yourService = {
  getAll: async () => {
    const response = await api.get('/your-endpoint');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/your-endpoint/${id}`);
    return response.data;
  },

  create: async (data: YourInterface) => {
    const response = await api.post('/your-endpoint', data);
    return response.data;
  },

  update: async (id: string, data: Partial<YourInterface>) => {
    const response = await api.put(`/your-endpoint/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/your-endpoint/${id}`);
    return response.data;
  },
};
```

### Axios Configuration

Located at: `/client/src/lib/axios.ts`
- Base URL configured automatically
- JWT token added to all requests via interceptors
- Error handling middleware included

---

## Form Handling Pattern

### Using React Hook Form + Zod

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.date().optional(),
});

type FormData = z.infer<typeof schema>;

export default function MyForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Submit data
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <p>{errors.title.message}</p>}
    </form>
  );
}
```

---

## Data Models Cheat Sheet

### Task Object Structure
```javascript
{
  _id: "mongo_id",
  title: "Task title",
  description: "Task description",
  project: "project_id" | { _id, name, color },
  section: "section_id",
  assignee: "user_id" | { _id, name, email, avatar },
  status: "todo" | "in_progress" | "completed" | "blocked",
  priority: "low" | "medium" | "high" | "urgent",
  dueDate: "2025-11-10T00:00:00Z",
  startDate: "2025-11-01T00:00:00Z",
  tags: ["tag1", "tag2"],
  subtasks: [ { _id, title, completed, assignee } ],
  comments: [ { _id, user, text, createdAt } ],
  attachments: [ { _id, name, url, type, uploadedBy, uploadedAt } ],
  followers: ["user_id1", "user_id2"],
  dependencies: ["task_id1"],
  order: 1,
  createdAt: "2025-11-02T15:30:00Z",
  updatedAt: "2025-11-02T15:30:00Z"
}
```

### Project Object Structure
```javascript
{
  _id: "mongo_id",
  name: "Project name",
  description: "Project description",
  workspace: "workspace_id",
  owner: "user_id",
  team: "team_id",
  members: [ { user: "user_id", role: "owner|editor|viewer" } ],
  sections: [ { _id, name: "To Do", order: 1 } ],
  color: "#FF6B35",
  icon: "📝",
  view: "list" | "board" | "timeline" | "calendar",
  status: "active" | "archived" | "completed",
  dueDate: "2025-12-31T00:00:00Z",
  isPrivate: false,
  createdAt: "2025-11-02T15:30:00Z",
  updatedAt: "2025-11-02T15:30:00Z"
}
```

### User Object Structure
```javascript
{
  _id: "mongo_id",
  name: "User Name",
  email: "user@example.com",
  password: "hashed_password",
  avatar: "url_to_avatar",
  workspaces: ["workspace_id1"],
  teams: ["team_id1"],
  createdAt: "2025-11-02T15:30:00Z",
  updatedAt: "2025-11-02T15:30:00Z"
}
```

---

## Common Development Tasks

### Running the Project

**Development Mode**
```bash
# Terminal 1 - Client
cd client
npm run dev

# Terminal 2 - Server
cd server
npm run dev
```

**Build for Production**
```bash
# Client
cd client
npm run build

# Server stays running with node src/server.js
```

### Adding a New Feature

1. **Plan the data model**: Update MongoDB schema in server
2. **Create API endpoints**: Add routes and controllers in server
3. **Add services**: Create/update service in client
4. **Add state management**: Update Zustand store if needed
5. **Create UI**: Build components for the feature
6. **Test**: Verify end-to-end functionality

### Debugging Tips

- Check Redux DevTools-like interface with Zustand (use browser dev tools)
- Use `console.log` to debug store state
- Check Network tab in DevTools for API calls
- Use server logs from terminal running `npm run dev`
- Check browser console for React errors

---

## Important Shortcuts & Patterns

### Toast Notifications
```typescript
import { toast } from 'sonner';

toast.success('Success message');
toast.error('Error message');
toast.info('Info message');
```

### Navigation
```typescript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard');
navigate(`/projects/${projectId}`);
```

### Date Formatting
```typescript
import { format } from 'date-fns';

format(new Date(), 'PPP'); // Nov 2, 2025
format(new Date(), 'MMM d'); // Nov 2
```

### Icons
```typescript
import { 
  Plus, 
  Check, 
  X, 
  ChevronDown, 
  MoreHorizontal,
  Search,
  Filter,
  Download
} from 'lucide-react';

<Plus className="w-4 h-4" />
```

---

## Environment Variables

### Client (`.env` in `/client`)
```
VITE_API_URL=http://localhost:3000/api
```

### Server (`.env` in `/server`)
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/asana-clone
JWT_SECRET=your_secret_key
```

---

## Performance Tips

1. **Lazy Load Routes**: Use React.lazy() for less-used pages
2. **Memoize Components**: Use React.memo() for expensive components
3. **Optimize Re-renders**: Use useCallback for callbacks passed to children
4. **Virtual Scrolling**: Consider for large task lists
5. **API Caching**: TanStack React Query already handles this
6. **Code Splitting**: Vite does this automatically

---

## Testing Areas

When making changes, verify:
- Tasks display correctly in all views (list, board, timeline, calendar)
- Creating/editing tasks updates the store and UI
- Filters work (by project, status, priority, assignee, due date)
- Dark theme applies to all pages
- Sidebar navigation works correctly
- Protected routes require authentication
- Forms validate before submission
- Error handling shows appropriate messages

---

## File Size Reference

Key component sizes:
- Dashboard.tsx: ~15KB
- MyTasks.tsx: ~16KB
- ProjectDetail.tsx: ~10KB
- task.store.ts: ~6KB
- task.service.ts: ~5KB

Total client bundle: Optimized with Vite (aim for <500KB gzipped)

---

## Git Workflow

**Current Branch**: `client-server`

### Making Changes
```bash
# Pull latest
git pull origin client-server

# Create feature branch
git checkout -b feature/feature-name

# Make changes, commit
git commit -m "Add feature description"

# Push to remote
git push origin feature/feature-name

# Create PR on GitHub
```

---

## Resources & Documentation

- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **Zustand**: https://github.com/pmndrs/zustand
- **React Hook Form**: https://react-hook-form.com
- **Zod**: https://zod.dev
- **Vite**: https://vitejs.dev
- **MongoDB**: https://docs.mongodb.com
- **Express**: https://expressjs.com

---

## Quick Checklist for New Features

- [ ] Created/updated MongoDB model (if needed)
- [ ] Created/updated server routes and controllers
- [ ] Created/updated service layer
- [ ] Added/updated Zustand store actions
- [ ] Created/updated UI components
- [ ] Added form validation (Zod schema)
- [ ] Added error handling (try-catch, toast messages)
- [ ] Added loading states
- [ ] Tested in dark theme
- [ ] Tested responsiveness (if applicable)
- [ ] Added comments for complex logic
- [ ] Committed changes with descriptive message

