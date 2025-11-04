import { useState } from 'react';
import { Task } from '@/services/task.service';
import { Project, ProjectSection, projectService } from '@/services/project.service';
import { Plus, Calendar, User, MoreHorizontal, Trash2, Edit2, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BoardViewProps {
  project: Project;
  tasks: Task[];
  onUpdateTask: (taskId: string, field: string, value: any) => Promise<void>;
  onCreateTask: (sectionId: string, title: string) => Promise<void>;
}

interface TaskCardProps {
  task: Task;
  onUpdateTask: (taskId: string, field: string, value: any) => Promise<void>;
}

function TaskCard({ task, onUpdateTask }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isCompleted = task.status === 'completed';

  const getPriorityColor = (priority?: string) => {
    const colors = {
      low: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
      medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' },
      high: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30' },
      urgent: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
    };
    return colors[priority as keyof typeof colors] || null;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      todo: null,
      in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', label: 'On track' },
      completed: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30', label: 'Completed' },
      blocked: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30', label: 'At risk' },
    };
    return colors[status as keyof typeof colors];
  };

  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);
  const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : 'Unknown';
  const assigneeInitials = assigneeName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-neutral-800 border border-neutral-700 rounded-lg p-3 hover:border-neutral-600 transition-colors cursor-grab active:cursor-grabbing group"
    >
      <div className="flex items-start gap-2 mb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateTask(task._id, 'status', isCompleted ? 'todo' : 'completed');
          }}
          className="w-4 h-4 rounded-full border-2 border-neutral-600 hover:border-neutral-400 transition-colors flex-shrink-0 mt-0.5"
        >
          {isCompleted && (
            <div className="w-full h-full rounded-full bg-green-600 border-2 border-green-600 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
        <span className={`text-sm flex-1 ${isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}>
          {task.title}
        </span>
      </div>

      {/* Tags/Badges */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {priorityColor && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${priorityColor.bg} ${priorityColor.text} ${priorityColor.border}`}>
            {task.priority?.charAt(0).toUpperCase() + (task.priority?.slice(1) || '')}
          </span>
        )}
        {statusColor && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusColor.bg} ${statusColor.text} ${statusColor.border}`}>
            {statusColor.label}
          </span>
        )}
      </div>

      {/* Footer with assignee and due date */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
        )}
        {task.assignee && (
          <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-semibold text-neutral-900 ml-auto">
            {assigneeInitials}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BoardView({ project, tasks, onUpdateTask, onCreateTask }: BoardViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [addingTaskToSection, setAddingTaskToSection] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [sectionOptionsOpen, setSectionOptionsOpen] = useState<string | null>(null);
  const [isRenamingSectionId, setIsRenamingSectionId] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group tasks by section
  const tasksBySection = project.sections?.reduce((acc, section) => {
    const sectionId = section._id || section.name;
    acc[sectionId] = tasks.filter(task => {
      if (!task.section) return false;
      const taskSectionId = typeof task.section === 'string' ? task.section : task.section._id;
      return taskSectionId === section._id;
    });
    return acc;
  }, {} as Record<string, Task[]>) || {};

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTaskId = active.id as string;
    const overSectionId = over.id as string;

    // Find the task being dragged
    const task = tasks.find(t => t._id === activeTaskId);
    if (!task) {
      setActiveId(null);
      return;
    }

    // Find the current section
    const currentSectionId = typeof task.section === 'string' ? task.section : task.section?._id;

    // If dropped on a different section, update the task
    if (currentSectionId !== overSectionId) {
      onUpdateTask(activeTaskId, 'section', overSectionId);
      toast.success('Task moved to new section!');
    }

    setActiveId(null);
  };

  const handleAddTask = async (sectionId: string) => {
    if (!newTaskTitle.trim()) return;

    try {
      await onCreateTask(sectionId, newTaskTitle.trim());
      setNewTaskTitle('');
      setAddingTaskToSection(null);
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTask(sectionId);
    } else if (e.key === 'Escape') {
      setAddingTaskToSection(null);
      setNewTaskTitle('');
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim()) {
      toast.error('Please enter a section name');
      return;
    }

    try {
      await projectService.addSection(project._id, {
        name: newSectionName.trim(),
        order: (project.sections?.length || 0) + 1,
      });
      toast.success('Section created');
      setNewSectionName('');
      setIsAddSectionOpen(false);
    } catch (error) {
      toast.error('Failed to create section');
    }
  };

  const handleRenameSection = async (sectionId: string) => {
    if (!renamingValue.trim()) {
      toast.error('Please enter a section name');
      return;
    }

    try {
      await projectService.updateSection(project._id, sectionId, { name: renamingValue.trim() });
      toast.success('Section renamed');
      setIsRenamingSectionId(null);
      setRenamingValue('');
      setSectionOptionsOpen(null);
    } catch (error) {
      toast.error('Failed to rename section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) {
      return;
    }

    try {
      await projectService.deleteSection(project._id, sectionId);
      toast.success('Section deleted');
      setSectionOptionsOpen(null);
    } catch (error) {
      toast.error('Failed to delete section');
    }
  };

  const activeTask = activeId ? tasks.find(t => t._id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {project.sections?.map((section) => {
          const sectionId = section._id || section.name;
          const sectionTasks = tasksBySection[sectionId] || [];
          const isAddingTask = addingTaskToSection === sectionId;

          return (
            <div
              key={sectionId}
              className="flex-shrink-0 w-80 bg-neutral-900 border border-neutral-800 rounded-lg"
            >
              {/* Section Header */}
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  {isRenamingSectionId === sectionId ? (
                    <input
                      autoFocus
                      type="text"
                      value={renamingValue}
                      onChange={(e) => setRenamingValue(e.target.value)}
                      onBlur={() => handleRenameSection(sectionId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRenameSection(sectionId);
                        if (e.key === 'Escape') setIsRenamingSectionId(null);
                      }}
                      className="flex-1 bg-neutral-800 text-white text-sm font-semibold border border-neutral-700 rounded px-2 py-1"
                    />
                  ) : (
                    <h3 className="text-sm font-semibold text-neutral-200">
                      {section.name} <span className="text-neutral-500 font-normal">{sectionTasks.length}</span>
                    </h3>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setSectionOptionsOpen(sectionOptionsOpen === sectionId ? null : sectionId)}
                      className="text-neutral-500 hover:text-neutral-300 transition-colors ml-2"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {sectionOptionsOpen === sectionId && (
                      <div className="absolute right-0 mt-1 w-40 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                        <button
                          onClick={() => {
                            setIsRenamingSectionId(sectionId);
                            setRenamingValue(section.name);
                            setSectionOptionsOpen(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-700 transition-colors rounded-t-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                          Rename
                        </button>
                        <button
                          onClick={() => handleDeleteSection(sectionId)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors rounded-b-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Task List - Droppable Area */}
              <SortableContext
                id={sectionId}
                items={sectionTasks.map(t => t._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="p-4 space-y-3 min-h-[200px]">
                  {sectionTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onUpdateTask={onUpdateTask}
                    />
                  ))}

                  {/* Add Task Input */}
                  {isAddingTask && (
                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-3">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, sectionId)}
                        placeholder="Task name"
                        autoFocus
                        className="w-full bg-transparent text-sm text-neutral-200 placeholder-neutral-600 outline-none border-none"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleAddTask(sectionId)}
                          disabled={!newTaskTitle.trim()}
                          className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Add task
                        </button>
                        <button
                          onClick={() => {
                            setAddingTaskToSection(null);
                            setNewTaskTitle('');
                          }}
                          className="text-xs px-3 py-1.5 text-neutral-400 hover:text-white transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </SortableContext>

              {/* Add Task Button */}
              {!isAddingTask && (
                <div className="p-4 pt-0">
                  <button
                    onClick={() => setAddingTaskToSection(sectionId)}
                    className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors w-full"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add task</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add Section Button */}
        <div className="flex-shrink-0 w-80">
          <button
            onClick={() => setIsAddSectionOpen(true)}
            className="w-full h-32 bg-neutral-900/50 border-2 border-dashed border-neutral-800 rounded-lg flex flex-col items-center justify-center gap-2 text-neutral-500 hover:text-neutral-300 hover:border-neutral-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm font-medium">Add section</span>
          </button>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeTask && (
          <div className="bg-neutral-800 border-2 border-blue-500 rounded-lg p-3 opacity-90 w-80 cursor-grabbing">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-neutral-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-neutral-200">{activeTask.title}</span>
            </div>
          </div>
        )}
      </DragOverlay>

      {/* Add Section Dialog */}
      <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create new section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-2">Section name</label>
              <Input
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="e.g., To Do, In Progress, Done"
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setIsAddSectionOpen(false)}
                variant="outline"
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddSection}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Section
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DndContext>
  );
}
