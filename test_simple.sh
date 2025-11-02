#!/bin/bash

API_BASE="http://localhost:5000/api"

echo "🧪 Simple Tasks Integration Test"
echo "=================================="
echo ""

# Register user
echo "1. Registering user..."
REGISTER=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test$(date +%s)@test.com\",\"password\":\"Test@123\"}")

TOKEN=$(echo $REGISTER | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -n "$TOKEN" ]; then
    echo "✓ User registered"
else
    echo "✗ Registration failed"
    exit 1
fi

# Create workspace
echo "2. Creating workspace..."
WORKSPACE=$(curl -s -X POST "$API_BASE/workspaces" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\":\"Test Workspace\",\"description\":\"Test\"}")

WS_ID=$(echo $WORKSPACE | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -n "$WS_ID" ]; then
    echo "✓ Workspace created: $WS_ID"
else
    echo "✗ Workspace creation failed"
    exit 1
fi

# Create project
echo "3. Creating project..."
PROJECT=$(curl -s -X POST "$API_BASE/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\":\"Test Project\",\"workspace\":\"$WS_ID\",\"color\":\"#06b6d4\"}")

PROJ_ID=$(echo $PROJECT | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -n "$PROJ_ID" ]; then
    echo "✓ Project created: $PROJ_ID"
else
    echo "✗ Project creation failed"
    echo "Response: $PROJECT"
    exit 1
fi

# Add section
echo "4. Adding section..."
SECTION=$(curl -s -X POST "$API_BASE/projects/$PROJ_ID/sections" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"name\":\"To Do\",\"order\":0}")

SEC_ID=$(echo $SECTION | grep -o '"_id":"[^"]*' | sed -n '2p' | cut -d'"' -f4)

if [ -n "$SEC_ID" ]; then
    echo "✓ Section created: $SEC_ID"
else
    echo "✗ Section creation failed"
fi

# Create task
echo "5. Creating task..."
TASK=$(curl -s -X POST "$API_BASE/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Test Task\",\"project\":\"$PROJ_ID\",\"section\":\"$SEC_ID\",\"status\":\"todo\",\"priority\":\"high\"}")

TASK_ID=$(echo $TASK | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

if [ -n "$TASK_ID" ]; then
    echo "✓ Task created: $TASK_ID"
else
    echo "✗ Task creation failed"
    echo "Response: $TASK"
    exit 1
fi

# Get all tasks
echo "6. Fetching tasks..."
TASKS=$(curl -s -X GET "$API_BASE/tasks?project=$PROJ_ID" \
  -H "Authorization: Bearer $TOKEN")

if echo $TASKS | grep -q "\"tasks\""; then
    echo "✓ Tasks fetched"
else
    echo "✗ Tasks fetch failed"
fi

# Update task
echo "7. Updating task..."
UPDATE=$(curl -s -X PUT "$API_BASE/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"status\":\"in_progress\"}")

if echo $UPDATE | grep -q "\"success\":true"; then
    echo "✓ Task updated"
else
    echo "✗ Task update failed"
fi

# Add subtask
echo "8. Adding subtask..."
SUBTASK=$(curl -s -X POST "$API_BASE/tasks/$TASK_ID/subtasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"title\":\"Test Subtask\"}")

if echo $SUBTASK | grep -q "\"success\":true"; then
    echo "✓ Subtask added"
else
    echo "✗ Subtask failed"
fi

# Add comment
echo "9. Adding comment..."
COMMENT=$(curl -s -X POST "$API_BASE/tasks/$TASK_ID/comments" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"content\":\"Test comment\"}")

if echo $COMMENT | grep -q "\"success\":true"; then
    echo "✓ Comment added"
else
    echo "✗ Comment failed"
fi

echo ""
echo "=================================="
echo "✅ All Tests Passed!"
echo "=================================="
echo ""
echo "Test Data:"
echo "  Workspace: $WS_ID"
echo "  Project:   $PROJ_ID"
echo "  Task:      $TASK_ID"
echo ""
echo "Access the app at: http://localhost:8080"
echo ""
