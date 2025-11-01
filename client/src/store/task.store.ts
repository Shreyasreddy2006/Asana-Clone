import { create } from 'zustand';
import { taskService, Task, CreateTaskData, TaskFilters } from '@/services/task.service';

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  setCurrentTask: (task: Task | null) => void;
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, data: Partial<CreateTaskData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addComment: (taskId: string, text: string) => Promise<void>;
  addSubtask: (taskId: string, title: string, assignee?: string) => Promise<void>;
  updateSubtask: (taskId: string, subtaskId: string, completed: boolean) => Promise<void>;
  setFilters: (filters: TaskFilters) => void;
  clearError: () => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  filters: {},
  isLoading: false,
  error: null,

  fetchTasks: async (filters) => {
    set({ isLoading: true, error: null });
    const filtersToUse = filters || get().filters;
    try {
      const response = await taskService.getAll(filtersToUse);
      set({ tasks: response.tasks, isLoading: false, filters: filtersToUse });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch tasks',
        isLoading: false,
      });
    }
  },

  setCurrentTask: (task) => {
    set({ currentTask: task });
  },

  createTask: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.create(data);
      const newTask = response.task;
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
      return newTask;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create task',
        isLoading: false,
      });
      throw error;
    }
  },

  updateTask: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.update(id, data);
      const updatedTask = response.task;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === id ? updatedTask : t)),
        currentTask:
          state.currentTask?._id === id ? updatedTask : state.currentTask,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update task',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await taskService.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t._id !== id),
        currentTask: state.currentTask?._id === id ? null : state.currentTask,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete task',
        isLoading: false,
      });
      throw error;
    }
  },

  addComment: async (taskId, text) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.addComment(taskId, text);
      const updatedTask = response.task;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? updatedTask : t)),
        currentTask:
          state.currentTask?._id === taskId ? updatedTask : state.currentTask,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add comment',
        isLoading: false,
      });
      throw error;
    }
  },

  addSubtask: async (taskId, title, assignee) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.addSubtask(taskId, { title, assignee });
      const updatedTask = response.task;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? updatedTask : t)),
        currentTask:
          state.currentTask?._id === taskId ? updatedTask : state.currentTask,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to add subtask',
        isLoading: false,
      });
      throw error;
    }
  },

  updateSubtask: async (taskId, subtaskId, completed) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskService.updateSubtask(taskId, subtaskId, { completed });
      const updatedTask = response.task;
      set((state) => ({
        tasks: state.tasks.map((t) => (t._id === taskId ? updatedTask : t)),
        currentTask:
          state.currentTask?._id === taskId ? updatedTask : state.currentTask,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update subtask',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (filters) => {
    set({ filters });
  },

  clearError: () => set({ error: null }),
}));
