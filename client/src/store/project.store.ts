import { create } from 'zustand';
import { projectService, Project, CreateProjectData } from '@/services/project.service';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProjects: (workspaceId?: string) => Promise<void>;
  setCurrentProject: (project: Project) => void;
  createProject: (data: CreateProjectData) => Promise<Project>;
  updateProject: (id: string, data: Partial<CreateProjectData>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSection: (projectId: string, name: string, order?: number) => Promise<void>;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,

  fetchProjects: async (workspaceId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.getAll(workspaceId);
      set({ projects: response.projects, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch projects',
        isLoading: false,
      });
    }
  },

  setCurrentProject: (project) => {
    set({ currentProject: project });
  },

  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.create(data);
      const newProject = response.project;
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
      return newProject;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create project',
        isLoading: false,
      });
      throw error;
    }
  },

  updateProject: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.update(id, data);
      const updatedProject = response.project;
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === id ? updatedProject : p
        ),
        currentProject:
          state.currentProject?._id === id
            ? updatedProject
            : state.currentProject,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update project',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectService.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== id),
        currentProject:
          state.currentProject?._id === id ? null : state.currentProject,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete project',
        isLoading: false,
      });
      throw error;
    }
  },

  addSection: async (projectId, name, order) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectService.addSection(projectId, { name, order });
      const updatedProject = response.project;
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === projectId ? updatedProject : p
        ),
        currentProject:
          state.currentProject?._id === projectId
            ? updatedProject
            : state.currentProject,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add section',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
