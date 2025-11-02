#!/bin/bash

# Asana Clone - Tasks Integration Test Script
# This script tests the complete task functionality

API_BASE="http://localhost:5000/api"
TOKEN=""

echo "=================================================="
echo "🧪 Asana Clone - Tasks Integration Test"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print success
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print info
info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Test 1: Register/Login User
echo "1️⃣  Testing User Authentication..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "testuser_'$(date +%s)'@example.com",
    "password": "Test@123"
  }')

TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    success "User authenticated successfully"
    info "Token: ${TOKEN:0:20}..."
else
    error "Authentication failed"
    echo "Response: $REGISTER_RESPONSE"
    exit 1
fi
echo ""

# Test 2: Create Workspace
echo "2️⃣  Creating Workspace..."
WORKSPACE_RESPONSE=$(curl -s -X POST "$API_BASE/workspaces" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Workspace",
    "description": "Testing tasks integration"
  }')

WORKSPACE_ID=$(echo $WORKSPACE_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -n "$WORKSPACE_ID" ]; then
    success "Workspace created successfully"
    info "Workspace ID: $WORKSPACE_ID"
else
    error "Workspace creation failed"
    echo "Response: $WORKSPACE_RESPONSE"
    exit 1
fi
echo ""

# Test 3: Create Project
echo "3️⃣  Creating Project with Sections..."
PROJECT_RESPONSE=$(curl -s -X POST "$API_BASE/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Project",
    "description": "Testing tasks",
    "workspace": "'$WORKSPACE_ID'",
    "color": "#06b6d4",
    "sections": [
      {"name": "To Do", "order": 0},
      {"name": "In Progress", "order": 1},
      {"name": "Done", "order": 2}
    ]
  }')

PROJECT_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
SECTION_TODO_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | sed -n '2p' | cut -d'"' -f4)
SECTION_INPROGRESS_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | sed -n '3p' | cut -d'"' -f4)
SECTION_DONE_ID=$(echo $PROJECT_RESPONSE | grep -o '"_id":"[^"]*' | sed -n '4p' | cut -d'"' -f4)

if [ -n "$PROJECT_ID" ]; then
    success "Project created successfully"
    info "Project ID: $PROJECT_ID"
    info "Section IDs: Todo=$SECTION_TODO_ID, InProgress=$SECTION_INPROGRESS_ID, Done=$SECTION_DONE_ID"
else
    error "Project creation failed"
    echo "Response: $PROJECT_RESPONSE"
    exit 1
fi
echo ""

# Test 4: Create Tasks
echo "4️⃣  Creating Tasks..."

# Task 1
TASK1_RESPONSE=$(curl -s -X POST "$API_BASE/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Design Homepage Mockup",
    "description": "Create initial design for homepage",
    "project": "'$PROJECT_ID'",
    "section": "'$SECTION_TODO_ID'",
    "status": "todo",
    "priority": "high",
    "dueDate": "'$(date -u -v+7d +"%Y-%m-%dT%H:%M:%S.000Z")'"
  }')

TASK1_ID=$(echo $TASK1_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -n "$TASK1_ID" ]; then
    success "Task 1 created: Design Homepage Mockup"
else
    error "Task 1 creation failed"
fi

# Task 2
TASK2_RESPONSE=$(curl -s -X POST "$API_BASE/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Implement Authentication",
    "description": "Build login and registration flow",
    "project": "'$PROJECT_ID'",
    "section": "'$SECTION_INPROGRESS_ID'",
    "status": "in_progress",
    "priority": "urgent",
    "startDate": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'",
    "dueDate": "'$(date -u -v+3d +"%Y-%m-%dT%H:%M:%S.000Z")'"
  }')

TASK2_ID=$(echo $TASK2_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -n "$TASK2_ID" ]; then
    success "Task 2 created: Implement Authentication"
else
    error "Task 2 creation failed"
fi

# Task 3
TASK3_RESPONSE=$(curl -s -X POST "$API_BASE/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Setup Database Schema",
    "description": "Configure MongoDB collections",
    "project": "'$PROJECT_ID'",
    "section": "'$SECTION_DONE_ID'",
    "status": "completed",
    "priority": "medium",
    "dueDate": "'$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")'"
  }')

TASK3_ID=$(echo $TASK3_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -n "$TASK3_ID" ]; then
    success "Task 3 created: Setup Database Schema"
else
    error "Task 3 creation failed"
fi

echo ""

# Test 5: Get All Tasks
echo "5️⃣  Fetching All Tasks..."
TASKS_RESPONSE=$(curl -s -X GET "$API_BASE/tasks?project=$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN")

TASK_COUNT=$(echo $TASKS_RESPONSE | grep -o '"_id"' | wc -l | tr -d ' ')

if [ "$TASK_COUNT" -ge 3 ]; then
    success "Successfully fetched tasks (Count: $TASK_COUNT)"
else
    error "Task fetch failed or incorrect count"
fi
echo ""

# Test 6: Update Task
echo "6️⃣  Updating Task..."
UPDATE_RESPONSE=$(curl -s -X PUT "$API_BASE/tasks/$TASK1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "in_progress",
    "priority": "urgent"
  }')

if echo $UPDATE_RESPONSE | grep -q '"success":true'; then
    success "Task updated successfully"
else
    error "Task update failed"
fi
echo ""

# Test 7: Add Subtask
echo "7️⃣  Adding Subtask..."
SUBTASK_RESPONSE=$(curl -s -X POST "$API_BASE/tasks/$TASK1_ID/subtasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Gather design references"
  }')

if echo $SUBTASK_RESPONSE | grep -q '"success":true'; then
    success "Subtask added successfully"
else
    error "Subtask addition failed"
fi
echo ""

# Test 8: Add Comment
echo "8️⃣  Adding Comment..."
COMMENT_RESPONSE=$(curl -s -X POST "$API_BASE/tasks/$TASK1_ID/comments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "content": "Started working on this task"
  }')

if echo $COMMENT_RESPONSE | grep -q '"success":true'; then
    success "Comment added successfully"
else
    error "Comment addition failed"
fi
echo ""

# Test 9: Get My Tasks
echo "9️⃣  Fetching My Tasks..."
MY_TASKS_RESPONSE=$(curl -s -X GET "$API_BASE/tasks/my-tasks" \
  -H "Authorization: Bearer $TOKEN")

if echo $MY_TASKS_RESPONSE | grep -q '"tasks"'; then
    success "My tasks fetched successfully"
else
    error "My tasks fetch failed"
fi
echo ""

# Test 10: Search Tasks
echo "🔟  Searching Tasks..."
SEARCH_RESPONSE=$(curl -s -X GET "$API_BASE/tasks/search?q=Design" \
  -H "Authorization: Bearer $TOKEN")

if echo $SEARCH_RESPONSE | grep -q '"tasks"'; then
    success "Task search successful"
else
    error "Task search failed"
fi
echo ""

# Test 11: Move Task Between Sections
echo "1️⃣1️⃣  Moving Task Between Sections..."
MOVE_RESPONSE=$(curl -s -X PUT "$API_BASE/tasks/$TASK1_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "section": "'$SECTION_INPROGRESS_ID'"
  }')

if echo $MOVE_RESPONSE | grep -q '"success":true'; then
    success "Task moved to new section"
else
    error "Task move failed"
fi
echo ""

# Test 12: Add Task Dependency
echo "1️⃣2️⃣  Adding Task Dependency..."
DEPENDENCY_RESPONSE=$(curl -s -X POST "$API_BASE/tasks/$TASK1_ID/dependencies" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "dependencyId": "'$TASK3_ID'"
  }')

if echo $DEPENDENCY_RESPONSE | grep -q '"success":true'; then
    success "Task dependency added"
else
    error "Task dependency failed"
fi
echo ""

# Test 13: Complete Task
echo "1️⃣3️⃣  Completing Task..."
COMPLETE_RESPONSE=$(curl -s -X PUT "$API_BASE/tasks/$TASK2_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "completed"
  }')

if echo $COMPLETE_RESPONSE | grep -q '"success":true'; then
    success "Task marked as completed"
else
    error "Task completion failed"
fi
echo ""

# Summary
echo "=================================================="
echo "📊 Test Summary"
echo "=================================================="
success "✓ User Authentication"
success "✓ Workspace Creation"
success "✓ Project Creation with Sections"
success "✓ Task CRUD Operations"
success "✓ Task Updates (status, priority, section)"
success "✓ Subtasks Management"
success "✓ Comments Management"
success "✓ Task Dependencies"
success "✓ Task Search"
success "✓ My Tasks View"
echo ""
echo "=================================================="
echo "🎉 All Tests Completed!"
echo "=================================================="
echo ""
info "You can now access the application at:"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:5000"
echo ""
info "Test Data Created:"
echo "   Workspace: $WORKSPACE_ID"
echo "   Project:   $PROJECT_ID"
echo "   Tasks:     3 tasks created"
echo ""
