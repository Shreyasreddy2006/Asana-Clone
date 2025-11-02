import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useWorkspaceStore } from '@/store/workspace.store';
import { useProjectStore } from '@/store/project.store';
import { useTaskStore } from '@/store/task.store';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { TaskCard } from '@/components/TaskCard';
import { LearningCard } from '@/components/LearningCard';
import { Plus, MoreHorizontal, CheckCircle2, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CreateProjectDialog from '@/components/CreateProjectDialog';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { workspaces, currentWorkspace, fetchWorkspaces, setCurrentWorkspace } = useWorkspaceStore();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const navigate = useNavigate();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchWorkspaces();
    };
    loadData();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !currentWorkspace) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchProjects(currentWorkspace._id);
      fetchTasks();
    }
  }, [currentWorkspace, fetchProjects, fetchTasks]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const upcomingTasks = tasks.filter((task) => task.status !== 'completed').slice(0, 5);

  const completedThisWeek = tasks.filter((task) => {
    if (task.status !== 'completed') return false;
    const taskDate = new Date(task.updatedAt || task.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return taskDate >= weekAgo;
  }).length;

  const formatDateRange = (dueDate?: string) => {
    if (!dueDate) return 'No due date';
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getProjectForTask = (projectId?: string) => {
    if (!projectId) return { name: 'No project', color: '#6b7280' };
    const project = projects.find((p) => p._id === projectId);
    return {
      name: project?.name || 'Unknown project',
      color: project?.color || '#06b6d4',
    };
  };

  const collaboratorsCount = new Set(
    tasks.map((task) => task.assignee).filter(Boolean)
  ).size;

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className="flex-1 ml-60">
        <DashboardHeader />

        <main className="pt-12 p-8 text-white">
          <div className="mb-8">
            <p className="text-sm text-zinc-400 mb-1">{currentDate}</p>
            <h1 className="text-3xl font-normal">
              {getGreeting()}, {user.name}
            </h1>
            <div className="flex items-center gap-4 mt-4 text-sm text-zinc-400">
              <span>My week</span>
              <span>{completedThisWeek} tasks completed</span>
              <span>{collaboratorsCount} collaborators</span>
              <Button variant="outline" size="sm" className="bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                Customize
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold text-zinc-900">
                  {user.name ? getInitials(user.name) : 'U'}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">My tasks</h2>
                </div>
                <button className="p-2 hover:bg-zinc-800 rounded">
                  <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="flex gap-4 mb-4 border-b border-zinc-800">
                <button className="pb-2 text-sm font-medium border-b-2 border-white">
                  Upcoming
                </button>
                <button className="pb-2 text-sm text-zinc-400 hover:text-white">
                  Overdue
                </button>
                <button className="pb-2 text-sm text-zinc-400 hover:text-white">
                  Completed
                </button>
              </div>

              <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4 px-3 py-2">
                <Plus className="w-4 h-4" />
                <span>Create task</span>
              </button>

              <div className="space-y-2">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task) => {
                    const project = getProjectForTask(task.project);
                    return (
                      <TaskCard
                        key={task._id}
                        title={task.title}
                        project={project.name}
                        dateRange={formatDateRange(task.dueDate)}
                        projectColor={project.color}
                      />
                    );
                  })
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">
                    No upcoming tasks. Create one to get started!
                  </p>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Projects</h2>
                <button className="text-sm text-zinc-400 hover:text-white">
                  Recents
                </button>
              </div>

              <button
                onClick={() => setIsCreateProjectOpen(true)}
                className="w-full border-2 border-dashed border-zinc-700 rounded-lg p-4 flex items-center justify-center gap-2 text-zinc-400 hover:border-zinc-600 hover:text-white transition-colors mb-4"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Create project</span>
              </button>

              <div className="space-y-2">
                {projects && projects.length > 0 ? (
                  projects.slice(0, 3).map((project) => {
                    const projectTasks = tasks.filter(
                      (t) => t.project === project._id && t.dueDate
                    );
                    const dueSoonCount = projectTasks.filter((t) => {
                      const dueDate = new Date(t.dueDate!);
                      const today = new Date();
                      const daysUntilDue = Math.ceil(
                        (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                      );
                      return daysUntilDue <= 7 && daysUntilDue >= 0;
                    }).length;

                    return (
                      <div
                        key={project._id}
                        onClick={() => navigate(`/projects/${project._id}`)}
                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
                        style={{ backgroundColor: `${project.color}15` }}
                      >
                        <div
                          className="w-10 h-10 rounded flex items-center justify-center"
                          style={{ backgroundColor: project.color }}
                        >
                          <div className="w-6 h-6 border-2 border-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">{project.name}</h3>
                          <p className="text-xs text-zinc-400">
                            {dueSoonCount > 0
                              ? `${dueSoonCount} task${dueSoonCount !== 1 ? 's' : ''} due soon`
                              : 'No tasks due soon'}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-4">
                    No projects yet
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Learn Asana</h2>
              <button className="p-2 hover:bg-zinc-800 rounded">
                <MoreHorizontal className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <LearningCard
                title="Getting started"
                description="Learn the basics and see how Asana helps you get work done."
                duration="3 min"
                icon="🚀"
              />
              <LearningCard
                title="Automate work with rules"
                description="Learn how to streamline work by automating tasks in Asana."
                duration="3 min"
                icon="⚡"
              />
              <LearningCard
                title="Manage projects in Asana"
                description="Plan, organize, and manage your projects effectively."
                duration="15 min"
                icon="📊"
              />
              <LearningCard
                title="Avoid silos with portfolios"
                description="Learn how to achieve visibility for better visibility."
                duration="5 min"
                icon="📈"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Tasks I've assigned</h2>
                <button className="p-2 hover:bg-zinc-800 rounded">
                  <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="flex gap-4 mb-6 border-b border-zinc-800">
                <button className="pb-2 text-sm font-medium border-b-2 border-white">
                  Upcoming
                </button>
                <button className="pb-2 text-sm text-zinc-400 hover:text-white">
                  Overdue
                </button>
                <button className="pb-2 text-sm text-zinc-400 hover:text-white">
                  Completed
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-zinc-600" />
                </div>
                <p className="text-sm text-zinc-400 mb-4 text-center">
                  Assign tasks to your colleagues, and keep track of them here.
                </p>
                <Button variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700">
                  Assign task
                </Button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Goals</h2>
                <button className="p-2 hover:bg-zinc-800 rounded">
                  <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              <div className="flex gap-4 mb-6 border-b border-zinc-800">
                <button className="pb-2 text-sm font-medium border-b-2 border-white">
                  My goals
                </button>
                <button className="pb-2 text-sm text-zinc-400 hover:text-white">
                  Team
                </button>
              </div>

              <div className="bg-zinc-800/30 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">You haven't added team goals yet.</p>
                <p className="text-xs text-zinc-400 mb-4">
                  Add a goal so your team knows what you plan to achieve.
                </p>
                <Button variant="outline" size="sm" className="bg-transparent border-zinc-700 hover:bg-zinc-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Create goal
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 w-[90%]" />
                    </div>
                  </div>
                  <span className="text-sm text-zinc-400">90%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[75%]" />
                    </div>
                  </div>
                  <span className="text-sm text-zinc-400">75%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">People</h2>
                <span className="text-sm text-zinc-400">Frequent collaborators</span>
              </div>
              <button className="p-2 hover:bg-zinc-800 rounded">
                <MoreHorizontal className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                <UsersIcon className="w-8 h-8 text-zinc-600" />
              </div>
              <p className="text-sm mb-4">
                Invite your teammates to collaborate in Asana
              </p>
              <Button variant="secondary" size="sm" className="bg-zinc-800 hover:bg-zinc-700">
                Invite teammates
              </Button>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <p className="text-sm text-zinc-400">Drag and drop new widgets</p>
            <Button variant="outline" size="sm" className="ml-4 bg-transparent border-zinc-700 hover:bg-zinc-800">
              Customize
            </Button>
          </div>
        </main>
      </div>

      <CreateProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />
    </div>
  );
}
