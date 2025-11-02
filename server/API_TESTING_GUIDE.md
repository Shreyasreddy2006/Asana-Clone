# API Testing Guide

Complete guide for testing all API endpoints using curl, Postman, or any HTTP client.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. Authentication Flow

### Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65f...",
      "name": "John Doe",
      "email": "john@example.com",
      "onboarded": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

### Complete Onboarding
```bash
curl -X POST http://localhost:5000/api/auth/onboarding \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "workspaceName": "My Workspace",
    "workspaceDescription": "My first workspace"
  }'
```

---

## 2. Workspaces

### Get All Workspaces
```bash
curl -X GET http://localhost:5000/api/workspaces \
  -H "Authorization: Bearer <token>"
```

### Create Workspace
```bash
curl -X POST http://localhost:5000/api/workspaces \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering Team",
    "description": "Our engineering workspace"
  }'
```

### Get Single Workspace
```bash
curl -X GET http://localhost:5000/api/workspaces/<workspaceId> \
  -H "Authorization: Bearer <token>"
```

### Update Workspace
```bash
curl -X PUT http://localhost:5000/api/workspaces/<workspaceId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Workspace Name",
    "description": "Updated description"
  }'
```

### Invite Member to Workspace
```bash
curl -X POST http://localhost:5000/api/workspaces/<workspaceId>/members \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "member@example.com",
    "role": "member"
  }'
```

### Remove Member from Workspace
```bash
curl -X DELETE http://localhost:5000/api/workspaces/<workspaceId>/members/<userId> \
  -H "Authorization: Bearer <token>"
```

### Create Team in Workspace
```bash
curl -X POST http://localhost:5000/api/workspaces/<workspaceId>/teams \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend Team",
    "description": "Frontend developers"
  }'
```

---

## 3. Projects

### Get All Projects in Workspace
```bash
curl -X GET "http://localhost:5000/api/projects/workspace/<workspaceId>" \
  -H "Authorization: Bearer <token>"
```

### Get Projects with Filters
```bash
curl -X GET "http://localhost:5000/api/projects/workspace/<workspaceId>?status=active&team=<teamId>" \
  -H "Authorization: Bearer <token>"
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects/workspace/<workspaceId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Website Redesign",
    "description": "Complete website overhaul",
    "color": "#FF6B6B",
    "icon": "globe",
    "view": "board",
    "privacy": "public"
  }'
```

### Get Single Project
```bash
curl -X GET http://localhost:5000/api/projects/<projectId> \
  -H "Authorization: Bearer <token>"
```

### Update Project
```bash
curl -X PUT http://localhost:5000/api/projects/<projectId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "status": "active",
    "view": "list"
  }'
```

### Add Member to Project
```bash
curl -X POST http://localhost:5000/api/projects/<projectId>/members \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<userId>",
    "role": "editor"
  }'
```

### Create Section in Project
```bash
curl -X POST http://localhost:5000/api/projects/<projectId>/sections \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Backlog"
  }'
```

### Update Section
```bash
curl -X PUT http://localhost:5000/api/projects/<projectId>/sections/<sectionId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Section Name",
    "collapsed": false
  }'
```

### Create Custom Field
```bash
curl -X POST http://localhost:5000/api/projects/<projectId>/custom-fields \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priority Level",
    "type": "dropdown",
    "options": ["P0", "P1", "P2", "P3"],
    "required": false
  }'
```

---

## 4. Tasks

### Get All Tasks in Project
```bash
curl -X GET http://localhost:5000/api/tasks/project/<projectId> \
  -H "Authorization: Bearer <token>"
```

### Get Tasks with Filters
```bash
curl -X GET "http://localhost:5000/api/tasks/project/<projectId>?status=in_progress&priority=high" \
  -H "Authorization: Bearer <token>"
```

### Get My Tasks
```bash
curl -X GET http://localhost:5000/api/tasks/my-tasks \
  -H "Authorization: Bearer <token>"
```

### Search Tasks
```bash
curl -X GET "http://localhost:5000/api/tasks/search?q=design&workspace=<workspaceId>" \
  -H "Authorization: Bearer <token>"
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks/project/<projectId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Design homepage mockup",
    "description": "Create high-fidelity mockup for new homepage",
    "status": "todo",
    "priority": "high",
    "tags": ["design", "frontend"],
    "dueDate": "2024-12-31T23:59:59.000Z"
  }'
```

### Get Single Task
```bash
curl -X GET http://localhost:5000/api/tasks/<taskId> \
  -H "Authorization: Bearer <token>"
```

### Update Task
```bash
curl -X PUT http://localhost:5000/api/tasks/<taskId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "in_progress",
    "assignee": "<userId>",
    "priority": "urgent"
  }'
```

### Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/<taskId> \
  -H "Authorization: Bearer <token>"
```

---

## 5. Subtasks

### Add Subtask
```bash
curl -X POST http://localhost:5000/api/tasks/<taskId>/subtasks \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Research design trends"
  }'
```

### Update Subtask
```bash
curl -X PUT http://localhost:5000/api/tasks/<taskId>/subtasks/<subtaskId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Delete Subtask
```bash
curl -X DELETE http://localhost:5000/api/tasks/<taskId>/subtasks/<subtaskId> \
  -H "Authorization: Bearer <token>"
```

---

## 6. Comments

### Get Task Comments
```bash
curl -X GET http://localhost:5000/api/tasks/<taskId>/comments \
  -H "Authorization: Bearer <token>"
```

### Add Comment
```bash
curl -X POST http://localhost:5000/api/tasks/<taskId>/comments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Great progress on this task! @john",
    "mentions": ["<userId>"]
  }'
```

### Update Comment
```bash
curl -X PUT http://localhost:5000/api/tasks/comments/<commentId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment text"
  }'
```

### Delete Comment
```bash
curl -X DELETE http://localhost:5000/api/tasks/comments/<commentId> \
  -H "Authorization: Bearer <token>"
```

### Add Reaction to Comment
```bash
curl -X POST http://localhost:5000/api/tasks/comments/<commentId>/reactions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "emoji": "👍"
  }'
```

---

## 7. Task Dependencies

### Add Dependency
```bash
curl -X POST http://localhost:5000/api/tasks/<taskId>/dependencies \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "<dependentTaskId>",
    "type": "blockedBy"
  }'
```

### Remove Dependency
```bash
curl -X DELETE http://localhost:5000/api/tasks/<taskId>/dependencies/<dependencyId> \
  -H "Authorization: Bearer <token>"
```

---

## 8. Followers

### Add Follower to Task
```bash
curl -X POST http://localhost:5000/api/tasks/<taskId>/followers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<userId>"
  }'
```

### Remove Follower
```bash
curl -X DELETE http://localhost:5000/api/tasks/<taskId>/followers/<userId> \
  -H "Authorization: Bearer <token>"
```

---

## 9. Notifications

### Get All Notifications
```bash
curl -X GET http://localhost:5000/api/users/notifications \
  -H "Authorization: Bearer <token>"
```

### Get Unread Notifications
```bash
curl -X GET "http://localhost:5000/api/users/notifications?read=false" \
  -H "Authorization: Bearer <token>"
```

### Mark Notification as Read
```bash
curl -X PUT http://localhost:5000/api/users/notifications/<notificationId>/read \
  -H "Authorization: Bearer <token>"
```

### Mark All Notifications as Read
```bash
curl -X PUT http://localhost:5000/api/users/notifications/read-all \
  -H "Authorization: Bearer <token>"
```

---

## 10. Activity Feed

### Get Activity Feed
```bash
curl -X GET http://localhost:5000/api/users/activity \
  -H "Authorization: Bearer <token>"
```

### Get Activity for Specific Workspace
```bash
curl -X GET "http://localhost:5000/api/users/activity?workspaceId=<workspaceId>" \
  -H "Authorization: Bearer <token>"
```

---

## 11. File Upload

### Upload Single File
```bash
curl -X POST http://localhost:5000/api/upload \
  -F "file=@/path/to/your/file.pdf"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "/uploads/file-1234567890-123456789.pdf",
    "name": "file.pdf",
    "size": 1024000,
    "type": "application/pdf"
  }
}
```

### Upload Multiple Files
```bash
curl -X POST http://localhost:5000/api/upload/multiple \
  -F "files=@/path/to/file1.jpg" \
  -F "files=@/path/to/file2.png"
```

---

## 12. Users

### Search Users
```bash
curl -X GET "http://localhost:5000/api/users/search?q=john" \
  -H "Authorization: Bearer <token>"
```

### Get User by ID
```bash
curl -X GET http://localhost:5000/api/users/<userId> \
  -H "Authorization: Bearer <token>"
```

---

## Complete Testing Flow

### 1. Setup Phase
```bash
# Register
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}' \
  | jq -r '.data.token')

echo "Token: $TOKEN"
```

### 2. Create Workspace
```bash
WORKSPACE_ID=$(curl -s -X POST http://localhost:5000/api/workspaces \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Workspace","description":"Testing"}' \
  | jq -r '.data._id')

echo "Workspace ID: $WORKSPACE_ID"
```

### 3. Create Project
```bash
PROJECT_ID=$(curl -s -X POST http://localhost:5000/api/projects/workspace/$WORKSPACE_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","color":"#FF6B6B"}' \
  | jq -r '.data._id')

echo "Project ID: $PROJECT_ID"
```

### 4. Create Task
```bash
TASK_ID=$(curl -s -X POST http://localhost:5000/api/tasks/project/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","status":"todo","priority":"high"}' \
  | jq -r '.data._id')

echo "Task ID: $TASK_ID"
```

### 5. Add Comment
```bash
curl -X POST http://localhost:5000/api/tasks/$TASK_ID/comments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"This is a test comment"}'
```

---

## Postman Collection

Import this as a Postman collection:

```json
{
  "info": {
    "name": "Asana Clone API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

Set the `token` variable after login, and use `{{token}}` in Authorization headers.

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Common Errors

### Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Please provide a name"
}
```

### Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

---

Happy Testing! 🚀
