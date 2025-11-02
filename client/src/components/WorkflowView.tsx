import { useState } from 'react';
import { Project } from '@/services/project.service';
import { Plus, Zap, CheckCircle, Mail, Clock, GitBranch } from 'lucide-react';
import { toast } from 'sonner';

interface WorkflowViewProps {
  project: Project;
}

export default function WorkflowView({ project }: WorkflowViewProps) {
  const [workflows] = useState([
    {
      id: '1',
      name: 'Auto-assign tasks',
      trigger: 'When a task is created',
      action: 'Assign to project owner',
      active: true,
    },
    {
      id: '2',
      name: 'Notify on completion',
      trigger: 'When a task is completed',
      action: 'Send notification to assignee',
      active: true,
    },
  ]);

  const workflowTemplates = [
    {
      id: 't1',
      name: 'Task assignment',
      description: 'Automatically assign tasks based on rules',
      icon: CheckCircle,
      color: 'bg-blue-500',
    },
    {
      id: 't2',
      name: 'Email notifications',
      description: 'Send email updates for important changes',
      icon: Mail,
      color: 'bg-green-500',
    },
    {
      id: 't3',
      name: 'Due date reminders',
      description: 'Remind assignees about upcoming deadlines',
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      id: 't4',
      name: 'Status transitions',
      description: 'Automate task status changes based on events',
      icon: GitBranch,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white mb-1">Workflows</h2>
          <p className="text-sm text-neutral-400">
            Automate repetitive tasks and streamline your project workflow
          </p>
        </div>
        <button
          onClick={() => toast.info('Create workflow feature coming soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Create workflow</span>
        </button>
      </div>

      {/* Active Workflows */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg">
        <div className="p-5 border-b border-neutral-800">
          <h3 className="text-sm font-semibold text-white">Active workflows</h3>
        </div>
        <div className="divide-y divide-neutral-800">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="p-5 hover:bg-neutral-800/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm font-medium text-white">{workflow.name}</h4>
                      {workflow.active && (
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-xs font-medium rounded border border-green-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                      <span className="px-2 py-1 bg-neutral-800 rounded">{workflow.trigger}</span>
                      <span>→</span>
                      <span className="px-2 py-1 bg-neutral-800 rounded">{workflow.action}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toast.info('Edit workflow feature coming soon!')}
                  className="text-xs text-neutral-500 hover:text-white transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Templates */}
      <div>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-white mb-1">Workflow templates</h3>
          <p className="text-xs text-neutral-500">
            Get started quickly with pre-built automation templates
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {workflowTemplates.map((template) => (
            <button
              key={template.id}
              onClick={() => toast.info(`${template.name} template coming soon!`)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 hover:border-neutral-700 hover:bg-neutral-800/50 transition-colors text-left group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${template.color}/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <template.icon className={`w-5 h-5 text-white`} style={{ filter: 'brightness(0) saturate(100%)' }} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white mb-1">{template.name}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Builder (Preview) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-neutral-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Build custom workflows</h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mb-6">
            Create powerful automations by combining triggers and actions. Set up rules to automatically
            assign tasks, send notifications, update fields, and more.
          </p>
          <button
            onClick={() => toast.info('Workflow builder coming soon!')}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Open workflow builder
          </button>
        </div>
      </div>
    </div>
  );
}
