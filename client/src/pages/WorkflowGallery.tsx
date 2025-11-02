import { useState } from 'react';
import { X, ChevronRight, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkflowCard } from '@/components/WorkflowCard';

interface WorkflowGalleryProps {
  onClose: () => void;
  onCreateBlankProject: () => void;
}

export default function WorkflowGallery({ onClose, onCreateBlankProject }: WorkflowGalleryProps) {
  const [activeTab, setActiveTab] = useState('for-you');

  const tabs = [
    { id: 'for-you', label: 'For you' },
    { id: 'my-organization', label: 'My organization' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'operations', label: 'Operations & PMO' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'more', label: 'More' },
  ];

  const marketingWorkflows = [
    {
      title: 'Campaign management by ClassPass',
      description: 'Plan, schedule, and track complex marketing campaigns with one workflow built to manage deadlines and deliverables.',
      organization: 'ClassPass',
      badge: 'Trusted by top teams',
      color: 'border-l-[4px] border-l-amber-700',
      bgColor: 'bg-gradient-to-br from-amber-900/20 to-orange-900/10',
      previewType: 'timeline' as const,
    },
    {
      title: 'Creative requests',
      description: 'Track creative requests, collect feedback, and manage each production stage to deliver assets on time.',
      badge: '',
      color: 'border-l-[4px] border-l-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-900/20 to-pink-900/10',
      previewType: 'list' as const,
    },
    {
      title: 'Content calendar by AppLovin',
      description: 'Track content types, statuses, and channels to manage publishing across teams.',
      organization: 'AppLovin',
      badge: 'Trusted by top teams',
      color: 'border-l-[4px] border-l-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-900/20 to-rose-900/10',
      previewType: 'timeline' as const,
    },
  ];

  const quickStartWorkflows = [
    {
      title: 'Content calendar',
      description: 'Plan content, organize assets, and view schedules by channel to keep your marketing teams organized.',
      badge: 'Great for marketing',
      color: 'border-l-[4px] border-l-purple-500',
      bgColor: 'bg-gradient-to-br from-purple-900/20 to-pink-900/10',
      previewType: 'timeline' as const,
    },
    {
      title: 'Project timeline',
      description: 'Map out dependencies, milestones, and deadlines to keep your projects on track.',
      badge: 'Great for ops & PMO',
      color: 'border-l-[4px] border-l-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-900/20 to-amber-900/10',
      previewType: 'timeline' as const,
    },
    {
      title: 'Bug tracking',
      description: 'File, assign, and prioritize bugs in one place to fix issues faster.',
      badge: 'Great for IT',
      color: 'border-l-[4px] border-l-green-600',
      bgColor: 'bg-gradient-to-br from-green-900/20 to-emerald-900/10',
      previewType: 'list' as const,
    },
    {
      title: 'Cross-functional project plan',
      description: 'Create tasks, add due dates, and organize work by stage to align teams across your organization.',
      badge: 'Great for all teams',
      color: 'border-l-[4px] border-l-pink-500',
      bgColor: 'bg-gradient-to-br from-pink-900/20 to-purple-900/10',
      previewType: 'list' as const,
    },
    {
      title: '1:1 Meeting agenda',
      description: 'Track agenda items, meeting notes, and next steps so you can keep your conversations focused and meaningful.',
      badge: 'Great for all teams',
      color: 'border-l-[4px] border-l-rose-500',
      bgColor: 'bg-gradient-to-br from-rose-900/20 to-pink-900/10',
      previewType: 'list' as const,
    },
    {
      title: 'Meeting agenda',
      description: 'Capture agenda items, next steps, and action items to keep meetings focused and productive.',
      badge: 'Great for all teams',
      color: 'border-l-[4px] border-l-blue-500',
      bgColor: 'bg-gradient-to-br from-blue-900/20 to-cyan-900/10',
      previewType: 'list' as const,
    },
  ];

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#1a1a1a] border-b border-neutral-800 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-400" />
            </button>
            <h1 className="text-lg font-semibold text-white">Workflow gallery</h1>
            <span className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-xs rounded">New</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-neutral-400 hover:text-white hover:bg-transparent text-sm"
            >
              Send feedback
            </Button>
            <Button
              variant="outline"
              className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 bg-transparent text-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button
              onClick={onCreateBlankProject}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              + Blank project
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-1 text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-500'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Marketing Workflows Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Workflows built for marketing teams
              </h2>
              <p className="text-sm text-neutral-400">
                Help your marketing teams track, plan, and deliver impactful work in Asana
              </p>
            </div>
            <button className="flex items-center gap-1 text-sm text-neutral-400 hover:text-white font-medium">
              View more
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketingWorkflows.map((workflow, index) => (
              <WorkflowCard key={index} {...workflow} />
            ))}
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Start working in seconds
            </h2>
            <p className="text-sm text-neutral-400">
              Power your everyday processes with Asana's most popular workflows
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickStartWorkflows.map((workflow, index) => (
              <WorkflowCard key={index} {...workflow} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
