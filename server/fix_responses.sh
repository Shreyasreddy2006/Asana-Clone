#!/bin/bash

# This script fixes all controller responses to match frontend expectations

cd /Users/shreyasreddysingireddy/Documents/Asana-Clone/Asana-Clone/server

echo "Fixing project controller responses..."
# Fix project controller - change 'data: projects' to 'projects:'
sed -i.bak 's/data: projects/projects/g' src/controllers/project.controller.js
# Fix 'data: project' to 'project:'
sed -i.bak2 's/data: project\([,}]\)/project\1/g' src/controllers/project.controller.js

# Handle both projectId param and query param
sed -i.bak3 's/req\.params\.projectId/req.params.projectId || req.query.project/g' src/controllers/project.controller.js
sed -i.bak4 's/req\.params\.workspaceId/req.params.workspaceId || req.query.workspace/g' src/controllers/project.controller.js

echo "Fixing task controller responses..."
# Fix task controller - change 'data: tasks' to 'tasks:'
sed -i.bak 's/data: tasks/tasks/g' src/controllers/task.controller.js
# Fix 'data: task' to 'task:'
sed -i.bak2 's/data: task\([,}]\)/task\1/g' src/controllers/task.controller.js
# Fix 'data: grouped' to keep as 'data: grouped' (for my-tasks)
# Change project param handling
sed -i.bak3 's/project: req\.params\.projectId/project: req.params.projectId || req.query.project/g' src/controllers/task.controller.js

echo "Fixing user controller responses..."
sed -i.bak 's/data: users/users/g' src/controllers/user.controller.js
sed -i.bak2 's/data: user\([,}]\)/user\1/g' src/controllers/user.controller.js
sed -i.bak3 's/data: notifications/notifications/g' src/controllers/user.controller.js
sed -i.bak4 's/data: activities/activities/g' src/controllers/user.controller.js
sed -i.bak5 's/data: {$/data: {/g' src/controllers/user.controller.js

echo "Cleaning up backup files..."
rm -f src/controllers/*.bak*

echo "Done! Response formats updated."
