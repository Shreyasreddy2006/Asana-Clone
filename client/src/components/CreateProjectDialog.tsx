import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useProjectStore } from '@/store/project.store';
import { useWorkspaceStore } from '@/store/workspace.store';
import { projectService } from '@/services/project.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import WorkflowGallery from '@/pages/WorkflowGallery';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  view: z.enum(['list', 'board', 'timeline', 'calendar']),
  color: z.string().optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateProjectDialog({ open, onOpenChange }: CreateProjectDialogProps) {
  const { createProject, isLoading } = useProjectStore();
  const { currentWorkspace } = useWorkspaceStore();
  const [selectedColor, setSelectedColor] = useState('#4573D2');
  const [showWorkflowGallery, setShowWorkflowGallery] = useState(true);
  const [showBlankProjectForm, setShowBlankProjectForm] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      view: 'list',
      color: '#4573D2',
    },
  });

  const selectedView = watch('view');

  const colors = [
    '#4573D2', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Orange
  ];

  const onSubmit = async (data: ProjectFormData) => {
    if (!currentWorkspace) {
      toast.error('Please select a workspace first');
      return;
    }

    try {
      const project = await createProject({
        ...data,
        workspace: currentWorkspace._id,
        color: selectedColor,
      });

      // Add default sections to the project
      const defaultSections = [
        { name: 'To Do', order: 0 },
        { name: 'In Progress', order: 1 },
        { name: 'Done', order: 2 },
      ];

      for (const section of defaultSections) {
        await projectService.addSection(project._id, section);
      }

      toast.success('Project created successfully!');
      reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleClose = () => {
    setShowWorkflowGallery(true);
    setShowBlankProjectForm(false);
    reset();
    onOpenChange(false);
  };

  const handleBlankProject = () => {
    setShowWorkflowGallery(false);
    setShowBlankProjectForm(true);
  };

  // Show workflow gallery as full-screen overlay
  if (open && showWorkflowGallery) {
    return (
      <WorkflowGallery
        onClose={handleClose}
        onCreateBlankProject={handleBlankProject}
      />
    );
  }

  // Show blank project form in dialog
  if (open && showBlankProjectForm) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Blank Project</DialogTitle>
              <DialogDescription>
                Create a new project to organize your tasks and collaborate with your team.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g. Website Redesign"
                  {...register('name')}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What is this project about?"
                  {...register('description')}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Default View</Label>
                <Select
                  value={selectedView}
                  onValueChange={(value) => setValue('view', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="board">Board</SelectItem>
                    <SelectItem value="timeline">Timeline</SelectItem>
                    <SelectItem value="calendar">Calendar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Project Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        setValue('color', color);
                      }}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        selectedColor === color
                          ? 'ring-2 ring-offset-2 ring-primary scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowBlankProjectForm(false);
                  setShowWorkflowGallery(true);
                }}
              >
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
