import api from '@/lib/axios';

export interface ProjectMember {
  user: string;
  role: 'owner' | 'editor' | 'viewer';
}

export interface ProjectSection {
  _id?: string;
  name: string;
  order: number;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  workspace: string;
  owner: string;
  team?: string;
  members: ProjectMember[];
  sections: ProjectSection[];
  color: string;
  icon: string;
  view: 'list' | 'board' | 'timeline' | 'calendar';
  status: 'active' | 'archived' | 'completed';
  dueDate?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  workspace: string;
  team?: string;
  color?: string;
  icon?: string;
  view?: Project['view'];
  status?: Project['status'];
  dueDate?: string;
  isPrivate?: boolean;
}

export const projectService = {
  // Get all projects
  getAll: async (workspaceId?: string): Promise<{ success: boolean; projects: Project[] }> => {
    const url = workspaceId ? `/projects?workspace=${workspaceId}` : '/projects';
    const response = await api.get(url);
    return response.data;
  },

  // Get project by ID
  getById: async (id: string): Promise<{ success: boolean; project: Project }> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  create: async (data: CreateProjectData): Promise<{ success: boolean; project: Project }> => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Update project
  update: async (id: string, data: Partial<CreateProjectData>): Promise<{ success: boolean; project: Project }> => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Add section to project
  addSection: async (id: string, data: { name: string; order?: number }): Promise<{ success: boolean; project: Project }> => {
    const response = await api.post(`/projects/${id}/sections`, data);
    return response.data;
  },
};
