import api from '@/lib/axios';

export interface NotificationSender {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface NotificationRelatedItem {
  _id: string;
  name?: string;
  title?: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender?: NotificationSender;
  type:
    | 'task_assigned'
    | 'task_completed'
    | 'task_due_soon'
    | 'task_overdue'
    | 'comment_added'
    | 'comment_mention'
    | 'project_invite'
    | 'workspace_invite'
    | 'task_updated'
    | 'task_deleted'
    | 'subtask_completed';
  title: string;
  message: string;
  link?: string;
  relatedTask?: NotificationRelatedItem;
  relatedProject?: NotificationRelatedItem;
  relatedWorkspace?: NotificationRelatedItem;
  relatedComment?: string;
  read: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unreadCount: number;
  };
}

export interface MarkReadResponse {
  success: boolean;
  data?: Notification;
  message?: string;
}

export const notificationService = {
  // Get all notifications
  getAll: async (filters?: { read?: boolean; limit?: number }): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();
    if (filters?.read !== undefined) {
      params.append('read', filters.read.toString());
    }
    if (filters?.limit) {
      params.append('limit', filters.limit.toString());
    }
    const response = await api.get(`/users/notifications?${params.toString()}`);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<MarkReadResponse> => {
    const response = await api.put(`/users/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<MarkReadResponse> => {
    const response = await api.put('/users/notifications/read-all');
    return response.data;
  },
};
