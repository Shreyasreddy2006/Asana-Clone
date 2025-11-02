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
  project: string | { _id: string; name: string; color?: string };
  section?: string;
  assignee?: string | { _id: string; name: string; email: string; avatar?: string };
  assignedBy?: string | { _id: string; name: string; email: string; avatar?: string };
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

  // Delete subtask
  deleteSubtask: async (taskId: string, subtaskId: string): Promise<{ success: boolean; task: Task }> => {
    const response = await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return response.data;
  },

  // Update comment
  updateComment: async (taskId: string, commentId: string, text: string): Promise<{ success: boolean; task: Task }> => {
    const response = await api.put(`/tasks/${taskId}/comments/${commentId}`, { text });
    return response.data;
  },

  // Delete comment
  deleteComment: async (taskId: string, commentId: string): Promise<{ success: boolean; task: Task }> => {
    const response = await api.delete(`/tasks/${taskId}/comments/${commentId}`);
    return response.data;
  },

  // Add follower (follow task)
  addFollower: async (taskId: string): Promise<{ success: boolean; task: Task }> => {
    const response = await api.post(`/tasks/${taskId}/followers`);
    return response.data;
  },

  // Remove follower (unfollow task)
  removeFollower: async (taskId: string, userId?: string): Promise<{ success: boolean; task: Task }> => {
    const url = userId ? `/tasks/${taskId}/followers/${userId}` : `/tasks/${taskId}/followers`;
    const response = await api.delete(url);
    return response.data;
  },

  // Add dependency
  addDependency: async (taskId: string, dependencyId: string): Promise<{ success: boolean; task: Task }> => {
    const response = await api.post(`/tasks/${taskId}/dependencies`, { dependencyId });
    return response.data;
  },

  // Remove dependency
  removeDependency: async (taskId: string, dependencyId: string): Promise<{ success: boolean; task: Task }> => {
    const response = await api.delete(`/tasks/${taskId}/dependencies/${dependencyId}`);
    return response.data;
  },
};
