import { useState, useRef } from 'react';
import { Project } from '@/services/project.service';
import { Upload, File, FileText, Image, Video, Music, Download, Trash2, Eye, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fileService, FileInfo } from '@/services/file.service';
import { useAuthStore } from '@/store/auth.store';

interface FilesViewProps {
  project: Project;
}

interface FileWithIcon extends FileInfo {
  icon: React.ComponentType<{ className?: string }>;
}

export default function FilesView({ project }: FilesViewProps) {
  const { user } = useAuthStore();
  const [files, setFiles] = useState<FileWithIcon[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return FileText;
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) return Image;
    if (['mp4', 'mov', 'avi', 'mkv'].includes(ext || '')) return Video;
    if (['mp3', 'wav', 'flac', 'aac'].includes(ext || '')) return Music;
    return FileText;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || !user) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);
    const uploadedFiles: FileWithIcon[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const result = await fileService.uploadFile(file);

        if (result.success) {
          uploadedFiles.push({
            ...result.file,
            icon: getFileIcon(result.file.name),
          });
        }
      }

      if (uploadedFiles.length > 0) {
        setFiles([...files, ...uploadedFiles]);
        toast.success(`Uploaded ${uploadedFiles.length} file(s)`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file(s)');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = (file: FileWithIcon) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${file.name}...`);
  };

  const handleDelete = async (file: FileWithIcon) => {
    if (!file._id) {
      toast.error('Cannot delete file');
      return;
    }

    try {
      await fileService.deleteFile(file._id);
      setFiles(files.filter((f) => f._id !== file._id));
      toast.success(`${file.name} deleted`);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handlePreview = (file: FileWithIcon) => {
    window.open(file.url, '_blank');
  };

  const getFileTypeColor = (type: string) => {
    const colors = {
      pdf: 'text-red-500',
      figma: 'text-purple-500',
      image: 'text-blue-500',
      video: 'text-green-500',
      audio: 'text-yellow-500',
      default: 'text-neutral-500',
    };
    return colors[type as keyof typeof colors] || colors.default;
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload Area */}
      <div
        onClick={handleFileUpload}
        className="border-2 border-dashed border-neutral-700 rounded-lg p-12 hover:border-neutral-600 hover:bg-neutral-900/50 transition-colors cursor-pointer group"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-800 group-hover:bg-neutral-700 flex items-center justify-center mb-4 transition-colors">
            {uploading ? (
              <Loader className="w-8 h-8 text-neutral-500 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-neutral-500 group-hover:text-neutral-400 transition-colors" />
            )}
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Upload files</h3>
          <p className="text-sm text-neutral-500 mb-4 max-w-md">
            All attachments to tasks & messages in this project will appear here
          </p>
          <button
            onClick={handleFileUpload}
            disabled={uploading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Choose files'}
          </button>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
          <div className="p-5 border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">All files</h3>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 border border-neutral-700 rounded hover:bg-neutral-700 transition-colors">
                  <option>All types</option>
                  <option>Images</option>
                  <option>Documents</option>
                  <option>Videos</option>
                </select>
                <select className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 border border-neutral-700 rounded hover:bg-neutral-700 transition-colors">
                  <option>Sort by date</option>
                  <option>Sort by name</option>
                  <option>Sort by size</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-neutral-800">
            {files.map((file) => (
              <div
                key={file._id || file.name}
                className="p-4 hover:bg-neutral-800/30 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <file.icon className={`w-6 h-6 ${getFileTypeColor(file.type)}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white truncate mb-1">
                      {file.name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span>Uploaded by {file.uploadedBy}</span>
                      <span>•</span>
                      <span>{format(new Date(file.uploadedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handlePreview(file)}
                      className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(file)}
                      className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
              <File className="w-8 h-8 text-neutral-600" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">No files yet</h3>
            <p className="text-sm text-neutral-500 max-w-md mb-6">
              Upload files or attach them to tasks and messages. All project files will be
              organized here for easy access.
            </p>
            <button
              onClick={handleFileUpload}
              disabled={uploading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload your first file
            </button>
          </div>
        </div>
      )}

      {/* Storage Info */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Storage</h3>
          <span className="text-xs text-neutral-500">4.3 GB of 100 GB used</span>
        </div>
        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full" style={{ width: '4.3%' }} />
        </div>
      </div>
    </div>
  );
}
