#!/usr/bin/env python3
import requests
import json
import sys
from datetime import datetime, timedelta

API_BASE = "http://localhost:5000/api"

def print_step(step, message):
    print(f"\n{step}️⃣  {message}")

def print_success(message):
    print(f"✓ {message}")

def print_error(message):
    print(f"✗ {message}")
    sys.exit(1)

def main():
    print("\n" + "="*50)
    print("🧪 Asana Clone - Complete Tasks Integration Test")
    print("="*50)

    # Test 1: Login
    print_step("1", "Authenticating user...")
    response = requests.post(f"{API_BASE}/auth/login", json={
        "email": "test1234@test.com",
        "password": "Test@123"
    })

    if response.status_code != 200:
        print_error("Authentication failed")

    data = response.json()
    token = data["data"]["token"]
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    print_success(f"User authenticated successfully")

    # Test 2: Create Workspace
    print_step("2", "Creating workspace...")
    response = requests.post(f"{API_BASE}/workspaces",
        headers=headers,
        json={"name": "Integration Test WS", "description": "Testing tasks"})

    if response.status_code != 201:
        print_error(f"Workspace creation failed: {response.json()}")

    workspace = response.json()["data"]
    workspace_id = workspace["_id"]
    print_success(f"Workspace created: {workspace_id}")

    # Test 3: Create Project
    print_step("3", "Creating project...")
    response = requests.post(f"{API_BASE}/projects",
        headers=headers,
        json={
            "name": "Test Project",
            "description": "Project for task testing",
            "workspace": workspace_id,
            "color": "#06b6d4"
        })

    if response.status_code != 201:
        print_error(f"Project creation failed: {response.json()}")

    project = response.json()["data"]
    project_id = project["_id"]
    print_success(f"Project created: {project_id}")

    # Test 4: Add Sections
    print_step("4", "Adding sections...")
    sections = []
    for i, name in enumerate(["To Do", "In Progress", "Done"]):
        response = requests.post(f"{API_BASE}/projects/{project_id}/sections",
            headers=headers,
            json={"name": name, "order": i})

        if response.status_code == 200:
            section = response.json()["data"]["sections"][-1]
            sections.append(section)
            print_success(f"Section created: {name}")

    # Test 5: Create Tasks
    print_step("5", "Creating tasks...")
    tasks = []
    task_data = [
        {"title": "Design Homepage", "section": sections[0]["_id"], "priority": "high", "status": "todo"},
        {"title": "Build API", "section": sections[1]["_id"], "priority": "urgent", "status": "in_progress"},
        {"title": "Setup Database", "section": sections[2]["_id"], "priority": "medium", "status": "completed"}
    ]

    for task_info in task_data:
        due_date = (datetime.now() + timedelta(days=7)).isoformat()
        response = requests.post(f"{API_BASE}/tasks",
            headers=headers,
            json={
                "title": task_info["title"],
                "project": project_id,
                "section": task_info["section"],
                "status": task_info["status"],
                "priority": task_info["priority"],
                "dueDate": due_date
            })

        if response.status_code == 201:
            task = response.json()["data"]
            tasks.append(task)
            print_success(f"Task created: {task_info['title']}")
        else:
            print_error(f"Task creation failed: {response.json()}")

    # Test 6: Get All Tasks
    print_step("6", "Fetching all tasks...")
    response = requests.get(f"{API_BASE}/tasks?project={project_id}", headers=headers)

    if response.status_code == 200:
        all_tasks = response.json()["tasks"]
        print_success(f"Fetched {len(all_tasks)} tasks")
    else:
        print_error("Failed to fetch tasks")

    # Test 7: Update Task
    print_step("7", "Updating task...")
    task_id = tasks[0]["_id"]
    response = requests.put(f"{API_BASE}/tasks/{task_id}",
        headers=headers,
        json={"status": "in_progress", "priority": "urgent"})

    if response.status_code == 200:
        print_success("Task updated successfully")
    else:
        print_error("Task update failed")

    # Test 8: Add Subtask
    print_step("8", "Adding subtask...")
    response = requests.post(f"{API_BASE}/tasks/{task_id}/subtasks",
        headers=headers,
        json={"title": "Research design trends"})

    if response.status_code == 200:
        print_success("Subtask added successfully")
    else:
        print_error("Subtask addition failed")

    # Test 9: Update Subtask
    print_step("9", "Completing subtask...")
    task_with_subtasks = response.json()["data"]
    subtask_id = task_with_subtasks["subtasks"][0]["_id"]

    response = requests.put(f"{API_BASE}/tasks/{task_id}/subtasks/{subtask_id}",
        headers=headers,
        json={"completed": True})

    if response.status_code == 200:
        print_success("Subtask marked as completed")
    else:
        print_error("Subtask update failed")

    # Test 10: Add Comment
    print_step("10", "Adding comment...")
    response = requests.post(f"{API_BASE}/tasks/{task_id}/comments",
        headers=headers,
        json={"content": "Started working on this task"})

    if response.status_code == 200:
        print_success("Comment added successfully")
    else:
        print_error("Comment addition failed")

    # Test 11: Add Task Dependency
    print_step("11", "Adding task dependency...")
    response = requests.post(f"{API_BASE}/tasks/{task_id}/dependencies",
        headers=headers,
        json={"dependencyId": tasks[2]["_id"]})

    if response.status_code == 200:
        print_success("Task dependency added")
    else:
        print_error("Task dependency failed")

    # Test 12: Move Task Between Sections
    print_step("12", "Moving task between sections...")
    response = requests.put(f"{API_BASE}/tasks/{task_id}",
        headers=headers,
        json={"section": sections[1]["_id"]})

    if response.status_code == 200:
        print_success("Task moved to new section")
    else:
        print_error("Task move failed")

    # Test 13: Get My Tasks
    print_step("13", "Fetching my tasks...")
    response = requests.get(f"{API_BASE}/tasks/my-tasks", headers=headers)

    if response.status_code == 200:
        my_tasks = response.json()["tasks"]
        print_success(f"Fetched {len(my_tasks)} personal tasks")
    else:
        print_error("My tasks fetch failed")

    # Test 14: Search Tasks
    print_step("14", "Searching tasks...")
    response = requests.get(f"{API_BASE}/tasks/search?q=Design", headers=headers)

    if response.status_code == 200:
        search_results = response.json()["tasks"]
        print_success(f"Found {len(search_results)} matching tasks")
    else:
        print_error("Task search failed")

    # Summary
    print("\n" + "="*50)
    print("📊 Test Summary")
    print("="*50)
    print("✓ Authentication")
    print("✓ Workspace Creation")
    print("✓ Project Creation")
    print("✓ Section Management")
    print("✓ Task CRUD Operations")
    print("✓ Task Updates")
    print("✓ Subtasks Management")
    print("✓ Comments Management")
    print("✓ Task Dependencies")
    print("✓ Section Movement")
    print("✓ My Tasks View")
    print("✓ Task Search")
    print("\n" + "="*50)
    print("🎉 All Tests Passed Successfully!")
    print("="*50)
    print(f"\n📌 Test Data Created:")
    print(f"   Workspace: {workspace_id}")
    print(f"   Project:   {project_id}")
    print(f"   Tasks:     {len(tasks)} tasks")
    print(f"\n🌐 Access the app at: http://localhost:8080")
    print()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        sys.exit(1)
