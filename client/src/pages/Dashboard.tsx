import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useWorkspaceStore } from '@/store/workspace.store';
import { useProjectStore } from '@/store/project.store';
import { useTaskStore } from '@/store/task.store';
import { useUIStore } from '@/store/ui.store';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { TaskCard } from '@/components/TaskCard';
import { LearningCard } from '@/components/LearningCard';
import { Plus, MoreHorizontal, ChevronDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreateProjectDialog from '@/components/CreateProjectDialog';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { workspaces, currentWorkspace, fetchWorkspaces, setCurrentWorkspace } = useWorkspaceStore();
  const { projects, fetchProjects } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { sidebarCollapsed } = useUIStore();
  const navigate = useNavigate();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

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
  const overdueTasks = tasks.filter((task) => {
    if (task.status === 'completed' || !task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  });

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

    // Format: "Nov 1 - 4"
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const endDay = day + 3;

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return `${month} ${day} – ${endDay}`;
  };

  const getProjectForTask = (projectId?: string) => {
    if (!projectId) return { name: 'No project', color: '#71717A' };
    const project = projects.find((p) => p._id === projectId);
    return {
      name: project?.name || 'Unknown project',
      color: project?.color || '#06B6D4',
    };
  };

  const collaboratorsCount = new Set(
    tasks.map((task) => task.assignee).filter(Boolean)
  ).size;

  // Mock collaborators for display
  const collaborators = [
    { id: '1', name: 'hvkhb@gmail.com', initials: 'hv', color: '#A78BFA' },
    { id: '2', name: 'nunn@gmail.com', initials: 'nu', color: '#FCD34D' },
    { id: '3', name: 'HJUHJJ@GMAIL.COM', initials: 'HJ', color: '#FBBF24' },
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      <AppSidebar />

      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} transition-all duration-300`}>
        <DashboardHeader />

        <main className="pt-12 px-8 pb-12 text-white">
          {/* Header Section */}
          <div className="mb-7">
            <p className="text-[13px] text-[#71717A] mb-2">{currentDate}</p>
            <div className="flex items-start justify-between">
              <h1 className="text-[34px] font-normal leading-tight tracking-tight">
                {getGreeting()}, {user.name?.split(' ')[0]?.toLowerCase() || 'user'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <button className="flex items-center gap-1 text-[13px] text-[#9CA3AF] hover:text-white transition-colors">
                  <span>My week</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1.5 text-[13px] text-[#9CA3AF]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{completedThisWeek} tasks completed</span>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-[#9CA3AF]">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{collaboratorsCount} collaborators</span>
                </div>
                <button
                  onClick={() => setShowCustomizeModal(!showCustomizeModal)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-[#D1D5DB] border border-[#374151] rounded hover:bg-[#1F2937] transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span>Customize</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6 mb-8">
            {/* Left Column - My Tasks */}
            <div className="bg-[#1F1F23] rounded-lg border border-[#2E2E32] overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center gap-3 p-5 border-b border-[#2E2E32]">
                <div className="w-10 h-10 rounded-full bg-[#EC4899] flex items-center justify-center text-sm font-bold text-white">
                  {user.name ? getInitials(user.name) : 'U'}
                </div>
                <div className="flex-1 flex items-center gap-1">
                  <button
                    onClick={() => navigate('/my-tasks')}
                    className="text-[17px] font-semibold hover:text-[#E5E5E5] transition-colors"
                  >
                    My tasks
                  </button>
                  <button className="w-3 h-3 text-[#6B7280] hover:text-white opacity-60">
                    <svg fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                  </button>
                </div>
                <button className="p-2 hover:bg-[#2E2E32] rounded transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 px-5 border-b border-[#2E2E32]">
                <button className="pb-3 pt-3 text-[14px] font-medium border-b-2 border-white text-white">
                  Upcoming
                </button>
                <button className="pb-3 pt-3 text-[14px] text-[#9CA3AF] hover:text-white relative">
                  Overdue
                  {overdueTasks.length > 0 && (
                    <span className="ml-1.5 text-[11px] bg-[#374151] text-[#9CA3AF] px-1.5 py-0.5 rounded">
                      {overdueTasks.length}
                    </span>
                  )}
                </button>
                <button className="pb-3 pt-3 text-[14px] text-[#9CA3AF] hover:text-white">
                  Completed
                </button>
              </div>

              {/* Task List */}
              <div className="p-5">
                <button
                  onClick={() => navigate('/my-tasks')}
                  className="flex items-center gap-2 text-[13px] text-[#6B7280] hover:text-white mb-4 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create task</span>
                </button>

                <div className="space-y-0.5">
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
                    <div className="py-16 text-center">
                      <p className="text-[14px] text-[#6B7280]">
                        No upcoming tasks. Create one to get started!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Projects and People */}
            <div className="space-y-6">
              {/* Projects Section */}
              <div className="bg-[#1F1F23] rounded-lg border border-[#2E2E32] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-semibold">Projects</h2>
                  <button className="flex items-center gap-1 text-[13px] text-[#9CA3AF] hover:text-white">
                    <span>Recents</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setIsCreateProjectOpen(true)}
                  className="w-full border-2 border-dashed border-[#374151] rounded-lg p-4 flex items-center justify-center gap-2 text-[#9CA3AF] hover:border-[#4B5563] hover:text-white transition-colors mb-4"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[13px]">Create project</span>
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
                        <button
                          key={project._id}
                          onClick={() => navigate(`/projects/${project._id}`)}
                          className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#27272A]/30 transition-colors"
                        >
                          <div
                            className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: project.color || '#06B6D4' }}
                          >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-[14px] font-medium">{project.name}</h3>
                            <p className="text-[12px] text-[#9CA3AF]">
                              {dueSoonCount > 0
                                ? `${dueSoonCount} task${dueSoonCount !== 1 ? 's' : ''} due soon`
                                : 'On track'}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-[13px] text-[#9CA3AF] text-center py-4">
                      No projects yet
                    </p>
                  )}
                </div>
              </div>

              {/* People Section */}
              <div className="bg-[#1F1F23] rounded-lg border border-[#2E2E32] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[17px] font-semibold">People</h2>
                    <span className="text-[13px] text-[#9CA3AF]">Frequent collaborators</span>
                  </div>
                  <button className="p-1.5 hover:bg-[#2E2E32] rounded transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-[#9CA3AF]" />
                  </button>
                </div>

                <div className="space-y-3">
                  <button className="w-full border-2 border-dashed border-[#374151] rounded-lg p-4 flex items-center justify-center gap-2 text-[#9CA3AF] hover:border-[#4B5563] hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="text-[13px]">Invite</span>
                  </button>

                  {collaborators.map((person) => (
                    <div key={person.id} className="flex items-center gap-3 py-1">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ backgroundColor: person.color }}
                      >
                        <span className="text-white">{person.initials}</span>
                      </div>
                      <span className="text-[13px] text-[#9CA3AF]">{person.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Learn Asana Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[20px] font-semibold">Learn Asana</h2>
              <button className="p-1.5 hover:bg-[#1F1F23] rounded transition-colors">
                <MoreHorizontal className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <LearningCard
                title="Getting started"
                description="Learn the basics and see how Asana helps you get work done."
                duration="3 min"
                type="video"
                icon={
                  <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
                    <path d="M60 10L75 45L110 45L82.5 65L95 100L60 77.5L25 100L37.5 65L10 45L45 45L60 10Z" fill="white" opacity="0.9"/>
                    <circle cx="60" cy="95" r="8" fill="white" opacity="0.6"/>
                    <circle cx="45" cy="90" r="5" fill="white" opacity="0.5"/>
                    <circle cx="75" cy="90" r="5" fill="white" opacity="0.5"/>
                  </svg>
                }
              />
              <LearningCard
                title="Manage student organizations"
                description="Learn how to organize meetings, events, and projects in Asana."
                duration="5 min read"
                type="article"
                icon={
                  <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
                    <path d="M70 30C70 30 75 35 75 45C75 55 70 60 60 65C50 70 40 65 35 55L30 45" stroke="white" strokeWidth="3" fill="none" opacity="0.8"/>
                    <ellipse cx="50" cy="70" rx="15" ry="8" fill="white" opacity="0.6"/>
                    <ellipse cx="70" cy="75" rx="12" ry="6" fill="white" opacity="0.5"/>
                    <circle cx="40" cy="85" r="8" fill="white" opacity="0.7"/>
                  </svg>
                }
              />
              <LearningCard
                title="Manage tasks in Asana"
                description="Learn how to create and manage tasks in Asana."
                duration="14 min"
                type="video"
                icon={
                  <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
                    <rect x="35" y="35" width="50" height="35" rx="4" fill="white" opacity="0.3"/>
                    <path d="M45 50L55 60L80 35" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
                    <circle cx="75" cy="30" r="12" fill="#FCD34D" opacity="0.8"/>
                    <path d="M72 25L75 30L78 25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                }
              />
              <LearningCard
                title="Avoid silos with portfolios"
                description="Learn how to use portfolios for better visibility."
                duration="5 min"
                type="video"
                icon={
                  <svg className="w-24 h-24" viewBox="0 0 120 120" fill="none">
                    <rect x="30" y="50" width="20" height="40" rx="2" fill="white" opacity="0.6"/>
                    <rect x="55" y="35" width="20" height="55" rx="2" fill="white" opacity="0.75"/>
                    <rect x="80" y="45" width="20" height="45" rx="2" fill="white" opacity="0.8"/>
                  </svg>
                }
              />
            </div>
          </div>

          {/* Customization Widget Area */}
          {showCustomizeModal && (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-8" onClick={() => setShowCustomizeModal(false)}>
              <div className="bg-[#1F1F23] border border-[#374151] rounded-lg p-8 max-w-2xl w-full relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowCustomizeModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-[#2E2E32] rounded transition-colors"
                >
                  <X className="w-5 h-5 text-[#9CA3AF]" />
                </button>
                <h2 className="text-xl font-semibold mb-6">Drag and drop new widgets</h2>
                <div className="flex items-center justify-center py-12">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="text-sm font-medium">Customize</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <CreateProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />
    </div>
  );
}
