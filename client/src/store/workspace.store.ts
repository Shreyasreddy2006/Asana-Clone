import { create } from 'zustand';
import { workspaceService, Workspace, CreateWorkspaceData } from '@/services/workspace.service';

interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchWorkspaces: () => Promise<void>;
  setCurrentWorkspace: (workspace: Workspace) => void;
  createWorkspace: (data: CreateWorkspaceData) => Promise<Workspace>;
  updateWorkspace: (id: string, data: Partial<CreateWorkspaceData>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspaces: [],
  currentWorkspace: null,
  isLoading: false,
  error: null,

  fetchWorkspaces: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await workspaceService.getAll();
      const workspaces = response.workspaces;
      set({ workspaces, isLoading: false });

      // Set first workspace as current if none selected
      if (workspaces.length > 0 && !get().currentWorkspace) {
        set({ currentWorkspace: workspaces[0] });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch workspaces',
        isLoading: false,
      });
    }
  },

  setCurrentWorkspace: (workspace) => {
    set({ currentWorkspace: workspace });
  },

  createWorkspace: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workspaceService.create(data);
      const newWorkspace = response.workspace;
      set((state) => ({
        workspaces: [...state.workspaces, newWorkspace],
        currentWorkspace: newWorkspace,
        isLoading: false,
      }));
      return newWorkspace;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create workspace',
        isLoading: false,
      });
      throw error;
    }
  },

  updateWorkspace: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workspaceService.update(id, data);
      const updatedWorkspace = response.workspace;
      set((state) => ({
        workspaces: state.workspaces.map((w) =>
          w._id === id ? updatedWorkspace : w
        ),
        currentWorkspace:
          state.currentWorkspace?._id === id
            ? updatedWorkspace
            : state.currentWorkspace,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update workspace',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteWorkspace: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await workspaceService.delete(id);
      set((state) => {
        const newWorkspaces = state.workspaces.filter((w) => w._id !== id);
        return {
          workspaces: newWorkspaces,
          currentWorkspace:
            state.currentWorkspace?._id === id
              ? newWorkspaces[0] || null
              : state.currentWorkspace,
          isLoading: false,
        };
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete workspace',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
