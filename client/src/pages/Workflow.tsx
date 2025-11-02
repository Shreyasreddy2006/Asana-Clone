import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Plus, Zap, CheckCircle, Mail, Clock, GitBranch, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useUIStore } from '@/store/ui.store';

export default function Workflow() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const [activeTab, setActiveTab] = useState<'my-workflows' | 'templates'>('my-workflows');

  const workflows = [
    {
      id: '1',
      name: 'Auto-assign tasks',
      project: 'Marketing Campaign',
      trigger: 'When a task is created',
      action: 'Assign to project owner',
      active: true,
      runs: 24,
    },
    {
      id: '2',
      name: 'Notify on completion',
      project: 'Product Launch',
      trigger: 'When a task is completed',
      action: 'Send notification to assignee',
      active: true,
      runs: 18,
    },
    {
      id: '3',
      name: 'Due date reminder',
      project: 'Q4 Planning',
      trigger: 'When task is 1 day before due',
      action: 'Send reminder email',
      active: false,
      runs: 0,
    },
  ];

  const workflowTemplates = [
    {
      id: 't1',
      name: 'Task assignment',
      description: 'Automatically assign tasks based on rules',
      icon: CheckCircle,
      color: 'bg-blue-500',
      category: 'Task Management',
    },
    {
      id: 't2',
      name: 'Email notifications',
      description: 'Send email updates for important changes',
      icon: Mail,
      color: 'bg-green-500',
      category: 'Communication',
    },
    {
      id: 't3',
      name: 'Due date reminders',
      description: 'Remind assignees about upcoming deadlines',
      icon: Clock,
      color: 'bg-orange-500',
      category: 'Time Management',
    },
    {
      id: 't4',
      name: 'Status transitions',
      description: 'Automate task status changes based on events',
      icon: GitBranch,
      color: 'bg-purple-500',
      category: 'Automation',
    },
    {
      id: 't5',
      name: 'Project milestones',
      description: 'Trigger actions when milestones are reached',
      icon: CheckCircle,
      color: 'bg-pink-500',
      category: 'Project Management',
    },
    {
      id: 't6',
      name: 'Team notifications',
      description: 'Keep your team informed with automated updates',
      icon: Mail,
      color: 'bg-cyan-500',
      category: 'Communication',
    },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} transition-all duration-300`}>
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold mb-2">Workflows</h1>
                <p className="text-sm text-neutral-400">
                  Automate repetitive tasks and streamline your work
                </p>
              </div>
              <Button
                onClick={() => toast.info('Create workflow feature coming soon!')}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create workflow
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 text-sm">
              <button
                onClick={() => setActiveTab('my-workflows')}
                className={`pb-3 ${
                  activeTab === 'my-workflows'
                    ? 'border-b-2 border-white font-medium text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                My workflows
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`pb-3 ${
                  activeTab === 'templates'
                    ? 'border-b-2 border-white font-medium text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Templates
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto px-8 py-6">
            {activeTab === 'my-workflows' && (
              <div className="space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-semibold mb-1">{workflows.length}</div>
                    <div className="text-xs text-neutral-400">Total workflows</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-semibold mb-1">
                      {workflows.filter((w) => w.active).length}
                    </div>
                    <div className="text-xs text-neutral-400">Active workflows</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4">
                    <div className="text-2xl font-semibold mb-1">
                      {workflows.reduce((sum, w) => sum + w.runs, 0)}
                    </div>
                    <div className="text-xs text-neutral-400">Total runs</div>
                  </div>
                </div>

                {/* Workflows List */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                  {workflows.length > 0 ? (
                    <div className="divide-y divide-neutral-800">
                      {workflows.map((workflow) => (
                        <div
                          key={workflow.id}
                          className="p-5 hover:bg-neutral-800/30 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-5 h-5 text-blue-500" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-sm font-medium text-white">
                                    {workflow.name}
                                  </h4>
                                  {workflow.active ? (
                                    <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-medium rounded border border-green-500/30">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 bg-neutral-700 text-neutral-400 text-xs font-medium rounded border border-neutral-600">
                                      Inactive
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-neutral-400 mb-2">
                                  {workflow.project}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-neutral-400">
                                  <span className="px-2 py-1 bg-neutral-800 rounded">
                                    {workflow.trigger}
                                  </span>
                                  <span>→</span>
                                  <span className="px-2 py-1 bg-neutral-800 rounded">
                                    {workflow.action}
                                  </span>
                                </div>
                                <div className="text-xs text-neutral-500 mt-2">
                                  {workflow.runs} runs
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => toast.info('Edit workflow feature coming soon!')}
                              className="p-2 hover:bg-neutral-800 rounded"
                            >
                              <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                        <Zap className="w-8 h-8 text-neutral-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
                      <p className="text-sm text-neutral-400 mb-4">
                        Create your first workflow to automate repetitive tasks
                      </p>
                      <Button
                        onClick={() => toast.info('Create workflow feature coming soon!')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Create workflow
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="space-y-6">
                <div className="text-sm text-neutral-400">
                  Get started quickly with pre-built automation templates
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {workflowTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => toast.info(`${template.name} template coming soon!`)}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 hover:bg-neutral-800/50 transition-colors text-left group"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg ${template.color}/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                        >
                          <template.icon className={`w-6 h-6 text-white`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-medium text-white">{template.name}</h4>
                            <span className="text-xs text-neutral-500 px-2 py-1 bg-neutral-800 rounded">
                              {template.category}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 leading-relaxed">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Workflow Builder Promotion */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 mt-8">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-neutral-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Build custom workflows
                    </h3>
                    <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
                      Create powerful automations by combining triggers and actions. Set up rules
                      to automatically assign tasks, send notifications, update fields, and more.
                    </p>
                    <Button
                      onClick={() => toast.info('Workflow builder coming soon!')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Open workflow builder
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
