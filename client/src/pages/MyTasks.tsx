import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useTaskStore } from '@/store/task.store';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import CreateTaskDialog from '@/components/CreateTaskDialog';
import { ChevronDown, ChevronRight, Plus, Circle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Task } from '@/services/task.service';
import { toast } from 'sonner';

export default function MyTasks() {
  const { user, isLoading } = useAuthStore();
  const { tasks, fetchTasks, updateTask } = useTaskStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'list' | 'board' | 'calendar' | 'dashboard' | 'files'>('list');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'recently-assigned': true,
    'do-today': true,
    'do-next-week': true,
    'do-later': true,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading) {
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

  // Filter tasks by user (assignee or creator)
  const myTasks = (tasks || []).filter(
    (task) => {
      const assigneeId = typeof task.assignee === 'string' ? task.assignee : task.assignee?._id;
      const assignedById = typeof task.assignedBy === 'string' ? task.assignedBy : task.assignedBy?._id;
      return assigneeId === user._id || assignedById === user._id;
    }
  );

  // Categorize tasks into sections
  const getTaskSections = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeekEnd = new Date(today);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);

    const recentlyAssigned: Task[] = [];
    const doToday: Task[] = [];
    const doNextWeek: Task[] = [];
    const doLater: Task[] = [];

    myTasks.forEach((task) => {
      if (task.status === 'completed') return;

      // Recently assigned (created in last 3 days)
      const createdDate = new Date(task.createdAt);
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      if (createdDate >= threeDaysAgo) {
        recentlyAssigned.push(task);
      }

      // Categorize by due date
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

        if (dueDateOnly <= today) {
          doToday.push(task);
        } else if (dueDateOnly > today && dueDateOnly <= nextWeekEnd) {
          doNextWeek.push(task);
        } else {
          doLater.push(task);
        }
      } else {
        doLater.push(task);
      }
    });

    return {
      'recently-assigned': recentlyAssigned,
      'do-today': doToday,
      'do-next-week': doNextWeek,
      'do-later': doLater,
    };
  };

  const sections = getTaskSections();

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

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
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
    // Navigate to task detail page - will implement later
    // For now, just show a toast
    toast.info('Task detail view coming soon!');
  };

  const renderTaskRow = (task: Task) => {
    const isCompleted = task.status === 'completed';

    return (
      <tr
        key={task._id}
        onClick={() => handleTaskClick(task._id)}
        className="border-b border-neutral-800 hover:bg-neutral-800/50 cursor-pointer transition-colors"
      >
        <td className="py-3 px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => handleToggleComplete(task, e)}
              className="w-5 h-5 rounded-full border-2 border-neutral-500 hover:border-white transition-colors flex-shrink-0 flex items-center justify-center"
            >
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-green-500 fill-green-500" />
              )}
            </button>
            <span className={`text-sm ${isCompleted ? 'text-neutral-500 line-through' : 'text-white'}`}>
              {task.title}
            </span>
          </div>
        </td>
        <td className="py-3 px-4">
          <span className="text-sm text-neutral-400">
            {formatDueDate(task.dueDate)}
          </span>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            {/* Collaborators - will show avatars when implemented */}
          </div>
        </td>
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <Circle
              className="w-3 h-3"
              style={{
                fill: typeof task.project === 'object' ? task.project?.color || '#06b6d4' : '#06b6d4',
                color: typeof task.project === 'object' ? task.project?.color || '#06b6d4' : '#06b6d4'
              }}
            />
            <span
              className="text-sm"
              style={{
                color: typeof task.project === 'object' ? task.project?.color || '#06b6d4' : '#06b6d4'
              }}
            >
              {typeof task.project === 'object' ? task.project?.name : task.project || 'No Project'}
            </span>
          </div>
        </td>
        <td className="py-3 px-4">
          <span className="text-sm text-neutral-400">My workspace</span>
        </td>
        <td className="py-3 px-4">
          <button className="p-1 hover:bg-neutral-700 rounded">
            <Plus className="w-4 h-4 text-neutral-500" />
          </button>
        </td>
      </tr>
    );
  };

  const renderSection = (
    sectionId: string,
    title: string,
    tasks: Task[]
  ) => {
    const isExpanded = expandedSections[sectionId];

    return (
      <div key={sectionId} className="mb-6">
        <button
          onClick={() => toggleSection(sectionId)}
          className="flex items-center gap-2 mb-2 hover:text-white transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          )}
          <h2 className="text-base font-semibold text-white">{title}</h2>
        </button>

        {isExpanded && (
          <>
            {tasks.length > 0 ? (
              <table className="w-full">
                <tbody>{tasks.map(renderTaskRow)}</tbody>
              </table>
            ) : null}
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2 py-2 px-4 text-sm text-neutral-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add task...</span>
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className="flex-1 ml-60">
        <DashboardHeader />

        <main className="pt-12">
          {/* Header Section */}
          <div className="border-b border-neutral-800 bg-neutral-900">
            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold text-neutral-900">
                  {user.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'U'}
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white">My tasks</h1>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6">
                {['List', 'Board', 'Calendar', 'Dashboard', 'Files'].map((tab) => (
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
            <div className="px-6 py-3 border-t border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 h-8"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add task
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 text-xs"
                >
                  Filter
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 text-xs"
                >
                  Sort
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 text-xs"
                >
                  Group
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 text-xs"
                >
                  Options
                </Button>
              </div>
            </div>

            {/* Column Headers */}
            <div className="px-6 bg-neutral-900/50">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-neutral-800">
                    <th className="py-2 px-4 text-xs font-medium text-neutral-400">Name</th>
                    <th className="py-2 px-4 text-xs font-medium text-neutral-400">Due date</th>
                    <th className="py-2 px-4 text-xs font-medium text-neutral-400">Collaborators</th>
                    <th className="py-2 px-4 text-xs font-medium text-neutral-400">Projects</th>
                    <th className="py-2 px-4 text-xs font-medium text-neutral-400">Task visibility</th>
                    <th className="py-2 px-4 text-xs font-medium text-neutral-400 w-12">
                      <Plus className="w-4 h-4" />
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          {/* Task Sections */}
          <div className="px-6 py-6">
            {renderSection('recently-assigned', 'Recently assigned', sections['recently-assigned'])}
            {renderSection('do-today', 'Do today', sections['do-today'])}
            {renderSection('do-next-week', 'Do next week', sections['do-next-week'])}
            {renderSection('do-later', 'Do later', sections['do-later'])}

            <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mt-6">
              <Plus className="w-4 h-4" />
              <span>Add section</span>
            </button>
          </div>
        </main>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
