import api from '@/lib/axios';

export interface Subtask {
  _id?: string;
  title: string;
  completed: boolean;
  assignee?: string;
}

export interface TaskComment {
  _id?: string;
  user: string;
  text: string;
  createdAt: string;
}

export interface TaskAttachment {
  _id?: string;
  name: string;
  url: string;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: string;
  section?: string;
  assignee?: string;
  assignedBy?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
  startDate?: string;
  completedAt?: string;
  tags: string[];
  subtasks: Subtask[];
  attachments: TaskAttachment[];
  comments: TaskComment[];
  followers: string[];
  dependencies: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  project: string;
  section?: string;
  assignee?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  dueDate?: string;
  startDate?: string;
  tags?: string[];
}

export interface TaskFilters {
  project?: string;
  assignee?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  section?: string;
}

export const taskService = {
  // Get all tasks with optional filters
  getAll: async (filters?: TaskFilters): Promise<{ success: boolean; tasks: Task[] }> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },

  // Get task by ID
  getById: async (id: string): Promise<{ success: boolean; task: Task }> => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // Create new task
  create: async (data: CreateTaskData): Promise<{ success: boolean; task: Task }> => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  // Update task
  update: async (id: string, data: Partial<CreateTaskData>): Promise<{ success: boolean; task: Task }> => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  // Delete task
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // Add comment to task
  addComment: async (id: string, text: string): Promise<{ success: boolean; task: Task }> => {
    const response = await api.post(`/tasks/${id}/comments`, { text });
    return response.data;
  },

  // Add subtask
  addSubtask: async (id: string, data: { title: string; assignee?: string }): Promise<{ success: boolean; task: Task }> => {
    const response = await api.post(`/tasks/${id}/subtasks`, data);
    return response.data;
  },

  // Update subtask
  updateSubtask: async (taskId: string, subtaskId: string, data: Partial<Subtask>): Promise<{ success: boolean; task: Task }> => {
    const response = await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, data);
    return response.data;
  },
};
