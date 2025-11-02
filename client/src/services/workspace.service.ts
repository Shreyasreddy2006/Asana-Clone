import api from '@/lib/axios';

export interface WorkspaceMember {
  user: string;
  role: 'owner' | 'admin' | 'member' | 'guest';
  joinedAt: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: string;
  members: WorkspaceMember[];
  projects: string[];
  teams: string[];
  settings: {
    color: string;
    isPublic: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspaceData {
  name: string;
  description?: string;
  settings?: {
    color?: string;
    isPublic?: boolean;
  };
}

export const workspaceService = {
  // Get all workspaces for current user
  getAll: async (): Promise<{ success: boolean; workspaces: Workspace[] }> => {
    const response = await api.get('/workspaces');
    return response.data;
  },

  // Get workspace by ID
  getById: async (id: string): Promise<{ success: boolean; workspace: Workspace }> => {
    const response = await api.get(`/workspaces/${id}`);
    return response.data;
  },

  // Create new workspace
  create: async (data: CreateWorkspaceData): Promise<{ success: boolean; workspace: Workspace }> => {
    const response = await api.post('/workspaces', data);
    return response.data;
  },

  // Update workspace
  update: async (id: string, data: Partial<CreateWorkspaceData>): Promise<{ success: boolean; workspace: Workspace }> => {
    const response = await api.put(`/workspaces/${id}`, data);
    return response.data;
  },

  // Delete workspace
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/workspaces/${id}`);
    return response.data;
  },

  // Add member to workspace
  addMember: async (id: string, data: { email: string; role: WorkspaceMember['role'] }): Promise<{ success: boolean; workspace: Workspace }> => {
    const response = await api.post(`/workspaces/${id}/members`, data);
    return response.data;
  },

  // Update member role
  updateMember: async (workspaceId: string, memberId: string, role: WorkspaceMember['role']): Promise<{ success: boolean; workspace: Workspace }> => {
    const response = await api.put(`/workspaces/${workspaceId}/members/${memberId}`, { role });
    return response.data;
  },

  // Remove member from workspace
  removeMember: async (workspaceId: string, memberId: string): Promise<{ success: boolean; workspace: Workspace }> => {
    const response = await api.delete(`/workspaces/${workspaceId}/members/${memberId}`);
    return response.data;
  },
};
