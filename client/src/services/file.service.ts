import api from '@/lib/axios';

export interface FileInfo {
  _id?: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
}

export const fileService = {
  uploadFile: async (file: File): Promise<{ success: boolean; file: FileInfo }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getProjectFiles: async (projectId: string): Promise<{ success: boolean; files: FileInfo[] }> => {
    const response = await api.get(`/projects/${projectId}/files`);
    return response.data;
  },

  deleteFile: async (fileId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/files/${fileId}`);
    return response.data;
  },
};
