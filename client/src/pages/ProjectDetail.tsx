import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/project.store';
import { useTaskStore } from '@/store/task.store';
import { useAuthStore } from '@/store/auth.store';
import { useUIStore } from '@/store/ui.store';
import { useWorkspaceStore } from '@/store/workspace.store';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import TimelineView from '@/components/TimelineView';
import OverviewTab from '@/components/OverviewTab';
import BoardView from '@/components/BoardView';
import DashboardView from '@/components/DashboardView';
import CalendarView from '@/components/CalendarView';
import WorkflowView from '@/components/WorkflowView';
import MessagesView from '@/components/MessagesView';
import FilesView from '@/components/FilesView';
import { ChevronDown, ChevronRight, Plus, Circle, CheckCircle2, List as ListIcon, X, Calendar as CalendarIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Task } from '@/services/task.service';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuthStore();
  const { projects, fetchProjects, currentProject, setCurrentProject, addSection } = useProjectStore();
  const { tasks, fetchTasks, updateTask, createTask } = useTaskStore();
  const { sidebarCollapsed } = useUIStore();
  const { currentWorkspace } = useWorkspaceStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'board' | 'timeline' | 'dashboard' | 'calendar' | 'workflow' | 'messages' | 'files'>('list');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [addingTaskToSection, setAddingTaskToSection] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingField, setEditingField] = useState<{ taskId: string; field: string } | null>(null);
  const [openDropdown, setOpenDropdown] = useState<{ taskId: string; field: string } | null>(null);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');

  useEffect(() => {
    if (user && projectId && currentWorkspace) {
      fetchProjects(currentWorkspace._id);
      fetchTasks({ project: projectId });
    }
  }, [user, projectId, currentWorkspace]);

  useEffect(() => {
    if (projectId && projects.length > 0) {
      const project = projects.find(p => p._id === projectId);
      if (project) {
        setCurrentProject(project);

        // Initialize all sections as expanded
        const expandedState: Record<string, boolean> = {};
        project.sections?.forEach(section => {
          expandedState[section._id || section.name] = true;
        });
        setExpandedSections(expandedState);
      }
    }
  }, [projectId, projects, setCurrentProject]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Check if click is outside dropdown
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [openDropdown]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="text-white">Loading project...</div>
      </div>
    );
  }

  // Filter tasks for this project
  const projectTasks = tasks.filter(task =>
    typeof task.project === 'string'
      ? task.project === projectId
      : task.project?._id === projectId
  );

  // Group tasks by section
  const tasksBySection = currentProject.sections?.reduce((acc, section) => {
    const sectionId = section._id || section.name;
    acc[sectionId] = projectTasks.filter(task => {
      if (!task.section) return false;
      const taskSectionId = typeof task.section === 'string' ? task.section : task.section._id;
      return taskSectionId === section._id;
    });
    return acc;
  }, {} as Record<string, Task[]>) || {};

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    // Format as "3 - 5 Nov" style
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });

    // Check if it's a range (for demo, just showing single date)
    return `${day} ${month}`;
  };

  const handleToggleComplete = async (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const newStatus = task.status === 'completed' ? 'todo' : 'completed';
      await updateTask(task._id, { status: newStatus });
      toast.success(newStatus === 'completed' ? 'Task completed!' : 'Task marked as incomplete');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleTaskClick = (taskId: string) => {
    toast.info('Task detail view coming soon!');
  };

  const handleAddTaskClick = (sectionId: string) => {
    setAddingTaskToSection(sectionId);
    setNewTaskTitle('');
  };

  const handleCancelAddTask = () => {
    setAddingTaskToSection(null);
    setNewTaskTitle('');
  };

  const handleCreateInlineTask = async (sectionId: string) => {
    if (!newTaskTitle.trim() || !projectId) return;

    try {
      await createTask({
        title: newTaskTitle.trim(),
        project: projectId,
        section: sectionId,
        status: 'todo',
        priority: 'medium',
      });

      toast.success('Task created successfully!');
      setAddingTaskToSection(null);
      setNewTaskTitle('');

      // Refresh tasks
      fetchTasks({ project: projectId });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleCreateTaskInSection = async (sectionId: string, title: string) => {
    if (!projectId) return;

    try {
      await createTask({
        title: title,
        project: projectId,
        section: sectionId,
        status: 'todo',
        priority: 'medium',
      });

      toast.success('Task created successfully!');
      // Refresh tasks
      fetchTasks({ project: projectId });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create task');
      throw error;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, sectionId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateInlineTask(sectionId);
    } else if (e.key === 'Escape') {
      handleCancelAddTask();
    }
  };

  const handleUpdateTaskField = async (taskId: string, field: string, value: any) => {
    try {
      await updateTask(taskId, { [field]: value });
      setOpenDropdown(null);
      if (projectId) {
        fetchTasks({ project: projectId });
      }
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const getPriorityColor = (priority?: string) => {
    if (!priority) return { bg: 'bg-transparent', text: 'text-neutral-500', border: 'border-transparent' };

    const colors = {
      low: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30' },
      medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', border: 'border-yellow-500/30' },
      high: { bg: 'bg-pink-500/10', text: 'text-pink-500', border: 'border-pink-500/30' },
      urgent: { bg: 'bg-red-500/10', text: 'text-red-500', border: 'border-red-500/30' },
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      todo: { bg: 'bg-transparent', text: 'text-neutral-500', border: 'border-transparent', label: '—' },
      in_progress: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500/30', label: 'On track', icon: true },
      completed: { bg: 'bg-green-500/10', text: 'text-green-500', border: 'border-green-500/30', label: 'Completed', icon: true },
      blocked: { bg: 'bg-orange-500/10', text: 'text-orange-500', border: 'border-orange-500/30', label: 'At risk', icon: false },
    };
    return colors[status as keyof typeof colors] || colors.todo;
  };

  const getPriorityLabel = (priority?: string) => {
    if (!priority) return '—';
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  const handleAddSection = async () => {
    if (!newSectionName.trim() || !projectId || !currentWorkspace) return;

    try {
      const nextOrder = currentProject?.sections?.length || 0;
      await addSection(projectId, newSectionName.trim(), nextOrder);
      toast.success('Section added successfully!');
      setIsAddingSection(false);
      setNewSectionName('');

      // Refresh projects to get updated sections
      fetchProjects(currentWorkspace._id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add section');
    }
  };

  const handleCancelAddSection = () => {
    setIsAddingSection(false);
    setNewSectionName('');
  };

  const handleSectionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSection();
    } else if (e.key === 'Escape') {
      handleCancelAddSection();
    }
  };

  const renderTaskRow = (task: Task) => {
    const isCompleted = task.status === 'completed';
    const statusColor = getStatusColor(task.status);
    const priorityColor = getPriorityColor(task.priority);
    const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : 'Unknown';
    const assigneeInitials = assigneeName
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

    const isPriorityDropdownOpen = openDropdown?.taskId === task._id && openDropdown?.field === 'priority';
    const isStatusDropdownOpen = openDropdown?.taskId === task._id && openDropdown?.field === 'status';
    const isAssigneeDropdownOpen = openDropdown?.taskId === task._id && openDropdown?.field === 'assignee';

    // Get project members for assignee dropdown
    const projectMembers = currentProject?.members || [];

    return (
      <tr
        key={task._id}
        className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors group"
      >
        <td className="py-2.5 px-4 border-r border-neutral-800/30">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => handleToggleComplete(task, e)}
              className="w-4 h-4 rounded-full border-2 border-neutral-600 hover:border-neutral-400 transition-colors flex-shrink-0 flex items-center justify-center relative"
            >
              {isCompleted && (
                <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-green-600 flex items-center justify-center absolute inset-0">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
            <span
              onClick={() => handleTaskClick(task._id)}
              className={`text-sm cursor-pointer ${isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-200'}`}
            >
              {task.title}
            </span>
          </div>
        </td>
        <td className="py-2.5 px-4 border-r border-neutral-800/30 relative">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(isAssigneeDropdownOpen ? null : { taskId: task._id, field: 'assignee' });
              }}
              className="flex items-center gap-2 hover:bg-neutral-700/30 -mx-2 px-2 py-1 rounded w-full"
            >
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-semibold text-neutral-900 flex-shrink-0">
                {assigneeInitials}
              </div>
              <span className="text-sm text-neutral-400">{assigneeName}</span>
            </button>
            {isAssigneeDropdownOpen && (
              <div data-dropdown className="absolute top-full left-0 mt-1 w-56 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <div className="px-3 py-2 text-xs text-neutral-500 font-medium">Assign to</div>
                  <button
                    onClick={() => handleUpdateTaskField(task._id, 'assignee', user?._id)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-semibold text-neutral-900">
                      {user?.name
                        ?.split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2) || 'U'}
                    </div>
                    <div className="flex-1">
                      <div className="text-neutral-200">{user?.name}</div>
                      <div className="text-xs text-neutral-500">Me</div>
                    </div>
                  </button>
                  {projectMembers.length > 0 && (
                    <>
                      <div className="border-t border-neutral-700 mt-1 pt-1"></div>
                      {projectMembers
                        .filter(member => {
                          const memberId = typeof member.user === 'string' ? member.user : member.user?._id;
                          return memberId !== user?._id;
                        })
                        .map((member) => {
                          const memberUser = typeof member.user === 'object' ? member.user : null;
                          const memberName = memberUser?.name || 'Unknown';
                          const memberInitials = memberName
                            ?.split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()
                            .slice(0, 2) || 'U';

                          return (
                            <button
                              key={memberUser?._id || Math.random()}
                              onClick={() => handleUpdateTaskField(task._id, 'assignee', memberUser?._id)}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
                            >
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                                {memberInitials}
                              </div>
                              <div className="text-neutral-200">{memberName}</div>
                            </button>
                          );
                        })}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </td>
        <td className="py-2.5 px-4 border-r border-neutral-800/30">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-sm text-neutral-400 hover:bg-neutral-700/30 px-2 py-1 rounded -mx-2 w-full text-left">
                {task.dueDate ? formatDueDate(task.dueDate) : 'Add due date'}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={task.dueDate ? new Date(task.dueDate) : undefined}
                onSelect={(date) => {
                  if (date) {
                    handleUpdateTaskField(task._id, 'dueDate', date.toISOString());
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </td>
        <td className="py-2.5 px-4 border-r border-neutral-800/30 relative">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(isPriorityDropdownOpen ? null : { taskId: task._id, field: 'priority' });
              }}
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${priorityColor.bg} ${priorityColor.text} ${priorityColor.border} hover:bg-neutral-700/30 min-w-[70px] justify-center`}
            >
              {getPriorityLabel(task.priority)}
            </button>
            {isPriorityDropdownOpen && (
              <div data-dropdown className="absolute top-full left-0 mt-1 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleUpdateTaskField(task._id, 'priority', null)}
                    className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-700 flex items-center gap-2"
                  >
                    —
                  </button>
                  <button
                    onClick={() => handleUpdateTaskField(task._id, 'priority', 'low')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-neutral-200">Low</span>
                  </button>
                  <button
                    onClick={() => handleUpdateTaskField(task._id, 'priority', 'medium')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                    <span className="text-neutral-200">Medium</span>
                  </button>
                  <button
                    onClick={() => handleUpdateTaskField(task._id, 'priority', 'high')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    <span className="text-neutral-200">High</span>
                  </button>
                </div>
                <div className="border-t border-neutral-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Edit options feature coming soon!');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-400 hover:bg-neutral-700"
                  >
                    Edit options
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Auto-fill feature coming soon!');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-400 hover:bg-neutral-700"
                  >
                    Auto-fill field value
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
        <td className="py-2.5 px-4 border-r border-neutral-800/30 relative">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(isStatusDropdownOpen ? null : { taskId: task._id, field: 'status' });
              }}
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium border ${statusColor.bg} ${statusColor.text} ${statusColor.border} hover:bg-neutral-700/30 min-w-[80px]`}
            >
              {statusColor.icon && <Check className="w-3 h-3" />}
              {statusColor.label}
            </button>
            {isStatusDropdownOpen && (
              <div data-dropdown className="absolute top-full left-0 mt-1 w-48 bg-neutral-800 border border-neutral-700 rounded-md shadow-lg z-50">
                <div className="py-1">
                  <button
                    onClick={() => handleUpdateTaskField(task._id, 'status', 'todo')}
                    className="w-full text-left px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-700 flex items-center gap-2"
                  >
                    —
                  </button>
                  <button
                    onClick={() => handleUpdateTaskField(task._id, 'status', 'in_progress')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-neutral-200">On track</span>
                  </button>
                  <button
                    onClick={() => handleUpdateTaskField(task._id, 'status', 'blocked')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <span className="w-3.5 h-3.5 flex items-center justify-center text-orange-500 font-bold">!</span>
                    <span className="text-neutral-200">At risk</span>
                  </button>
                  <button
                    onClick={() => handleUpdateTaskField(task._id, 'status', 'completed')}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-neutral-700 flex items-center gap-2"
                  >
                    <span className="w-3.5 h-3.5 flex items-center justify-center text-red-500 font-bold">×</span>
                    <span className="text-neutral-200">Off track</span>
                  </button>
                </div>
                <div className="border-t border-neutral-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Edit options feature coming soon!');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-400 hover:bg-neutral-700"
                  >
                    Edit options
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Auto-fill feature coming soon!');
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-400 hover:bg-neutral-700"
                  >
                    Auto-fill field value
                  </button>
                </div>
              </div>
            )}
          </div>
        </td>
        <td className="py-2.5 px-4 w-12">
          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-neutral-700 rounded transition-opacity">
            <Plus className="w-3.5 h-3.5 text-neutral-500" />
          </button>
        </td>
      </tr>
    );
  };

  const renderSection = (section: any) => {
    const sectionId = section._id || section.name;
    const isExpanded = expandedSections[sectionId];
    const sectionTasks = tasksBySection[sectionId] || [];
    const isAddingTask = addingTaskToSection === sectionId;

    return (
      <div key={sectionId} className="mb-4">
        <button
          onClick={() => toggleSection(sectionId)}
          className="flex items-center gap-2 mb-1 hover:text-white transition-colors group w-full"
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300" />
          )}
          <h2 className="text-sm font-semibold text-neutral-200">{section.name}</h2>
        </button>

        {isExpanded && (
          <>
            <table className="w-full mb-1">
              <tbody>
                {sectionTasks.map(renderTaskRow)}
                {isAddingTask && (
                  <tr className="border-b border-neutral-800/50 bg-neutral-800/20">
                    <td className="py-2.5 px-4" colSpan={6}>
                      <div className="flex items-center gap-3">
                        <button
                          className="w-4 h-4 rounded-full border-2 border-neutral-600 flex-shrink-0"
                        />
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, sectionId)}
                          placeholder="Write a task name"
                          autoFocus
                          className="flex-1 bg-transparent text-sm text-neutral-200 placeholder-neutral-600 outline-none border-none"
                        />
                        <button
                          onClick={() => handleCreateInlineTask(sectionId)}
                          disabled={!newTaskTitle.trim()}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add
                        </button>
                        <button
                          onClick={handleCancelAddTask}
                          className="text-neutral-500 hover:text-neutral-300"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {!isAddingTask && (
              <button
                onClick={() => handleAddTaskClick(sectionId)}
                className="flex items-center gap-2 py-2 px-4 text-sm text-neutral-500 hover:text-neutral-300 transition-colors group"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add task...</span>
              </button>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className={`flex-1 ${sidebarCollapsed ? 'ml-0' : 'ml-60'} transition-all duration-300`}>
        <DashboardHeader />

        <main className="pt-12">
          {/* Header Section */}
          <div className="border-b border-neutral-800 bg-neutral-900">
            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded flex items-center justify-center bg-cyan-600">
                  <ListIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white">{currentProject.name}</h1>
                </div>
                <button className="ml-auto text-neutral-400 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
                <button className="text-neutral-400 hover:text-white">Set status</button>
              </div>

              {/* Tabs */}
              <div className="flex gap-6">
                {['Overview', 'List', 'Board', 'Timeline', 'Dashboard', 'Calendar', 'Workflow', 'Messages', 'Files'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase() as any)}
                    className={`pb-3 px-1 text-sm border-b-2 transition-colors ${
                      activeTab === tab.toLowerCase()
                        ? 'border-white text-white font-medium'
                        : 'border-transparent text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <button className="pb-3 px-1 text-sm border-b-2 border-transparent text-neutral-400 hover:text-white">
                  +
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-6 py-2.5 border-t border-neutral-800/50 flex items-center justify-between bg-neutral-900/30">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Add to first section if exists
                    const firstSection = currentProject.sections?.[0];
                    if (firstSection) {
                      handleAddTaskClick(firstSection._id || firstSection.name);
                    }
                  }}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-7 text-xs font-medium"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add task
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 h-7 text-xs font-normal px-3"
                >
                  Filter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 h-7 text-xs font-normal px-3"
                >
                  Sort
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 h-7 text-xs font-normal px-3"
                >
                  Group
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 h-7 text-xs font-normal px-3"
                >
                  Options
                </Button>
              </div>
            </div>

            {/* Column Headers */}
            {activeTab === 'list' && (
              <div className="px-6 bg-neutral-900/50 sticky top-12 z-10">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-neutral-800/50">
                      <th className="py-2 px-4 text-xs font-normal text-neutral-500 border-r border-neutral-800/30">Name</th>
                      <th className="py-2 px-4 text-xs font-normal text-neutral-500 border-r border-neutral-800/30">Assignee</th>
                      <th className="py-2 px-4 text-xs font-normal text-neutral-500 border-r border-neutral-800/30">Due date</th>
                      <th className="py-2 px-4 text-xs font-normal text-neutral-500 border-r border-neutral-800/30">Priority</th>
                      <th className="py-2 px-4 text-xs font-normal text-neutral-500 border-r border-neutral-800/30">Status</th>
                      <th className="py-2 px-4 text-xs font-normal text-neutral-500 w-12">
                        <button className="hover:bg-neutral-800 p-1 rounded transition-colors">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                </table>
              </div>
            )}
          </div>

          {/* Task Sections */}
          {activeTab === 'list' && (
            <div className="px-6 py-6">
              {currentProject.sections && currentProject.sections.length > 0 ? (
                <>
                  {currentProject.sections.map((section) => renderSection(section))}
                  {isAddingSection ? (
                    <div className="mt-4 px-4 py-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        onKeyDown={handleSectionKeyDown}
                        placeholder="Section name"
                        autoFocus
                        className="flex-1 bg-neutral-800 text-sm text-neutral-200 placeholder-neutral-500 outline-none border border-neutral-700 rounded px-3 py-1.5"
                      />
                      <button
                        onClick={handleAddSection}
                        disabled={!newSectionName.trim()}
                        className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                      <button
                        onClick={handleCancelAddSection}
                        className="text-neutral-500 hover:text-neutral-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsAddingSection(true)}
                      className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-300 transition-colors mt-4 px-4 py-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add section</span>
                    </button>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-neutral-500 mb-4">No sections yet</p>
                  {isAddingSection ? (
                    <div className="flex items-center gap-2 justify-center">
                      <input
                        type="text"
                        value={newSectionName}
                        onChange={(e) => setNewSectionName(e.target.value)}
                        onKeyDown={handleSectionKeyDown}
                        placeholder="Section name"
                        autoFocus
                        className="bg-neutral-800 text-sm text-neutral-200 placeholder-neutral-500 outline-none border border-neutral-700 rounded px-3 py-1.5"
                      />
                      <button
                        onClick={handleAddSection}
                        disabled={!newSectionName.trim()}
                        className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                      <button
                        onClick={handleCancelAddSection}
                        className="text-neutral-500 hover:text-neutral-300"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingSection(true)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add section
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="px-6 py-6">
              <OverviewTab
                project={currentProject}
                tasks={projectTasks}
              />
            </div>
          )}

          {/* Timeline View */}
          {activeTab === 'timeline' && (
            <div className="px-6 py-6">
              <TimelineView
                project={currentProject}
                tasks={projectTasks}
                onUpdateTask={handleUpdateTaskField}
              />
            </div>
          )}

          {/* Board View */}
          {activeTab === 'board' && (
            <div className="px-6 py-6">
              <BoardView
                project={currentProject}
                tasks={projectTasks}
                onUpdateTask={handleUpdateTaskField}
                onCreateTask={handleCreateTaskInSection}
              />
            </div>
          )}

          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <div className="px-6 py-6">
              <DashboardView
                project={currentProject}
                tasks={projectTasks}
              />
            </div>
          )}

          {/* Calendar View */}
          {activeTab === 'calendar' && (
            <div className="px-6 py-6">
              <CalendarView
                project={currentProject}
                tasks={projectTasks}
                onUpdateTask={handleUpdateTaskField}
              />
            </div>
          )}

          {/* Workflow View */}
          {activeTab === 'workflow' && (
            <div className="px-6 py-6">
              <WorkflowView project={currentProject} />
            </div>
          )}

          {/* Messages View */}
          {activeTab === 'messages' && (
            <div className="px-6 py-6">
              <MessagesView project={currentProject} />
            </div>
          )}

          {/* Files View */}
          {activeTab === 'files' && (
            <div className="px-6 py-6">
              <FilesView project={currentProject} />
            </div>
          )}
        </main>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        defaultProject={projectId}
      />
    </div>
  );
}
