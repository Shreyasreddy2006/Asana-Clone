import { useState } from 'react';
import { X, Upload, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WorkflowGalleryProps {
  onClose: () => void;
  onCreateBlankProject: () => void;
}

export default function WorkflowGallery({ onClose, onCreateBlankProject }: WorkflowGalleryProps) {
  const [activeTab, setActiveTab] = useState('My organization');

  const tabs = [
    { id: 'For you', label: 'For you' },
    { id: 'My organization', label: 'My organization' },
    { id: 'Marketing', label: 'Marketing' },
    { id: 'Operations & PMO', label: 'Operations & PMO' },
    { id: 'Productivity', label: 'Productivity' },
    { id: 'More', label: 'More' },
  ];

  return (
    <div className="fixed inset-0 bg-[#2b2b2b] z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-[#2b2b2b] border-b border-neutral-700 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-300" />
            </button>
            <h1 className="text-lg font-semibold text-white">Workflow gallery</h1>
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded font-medium">New</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-neutral-300 hover:text-white underline">
              Send feedback
            </button>
            <Button
              variant="outline"
              className="border-neutral-600 text-neutral-300 hover:bg-neutral-700 bg-transparent text-sm"
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
                  : 'border-transparent text-neutral-400 hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Page Title */}
        <h2 className="text-2xl font-semibold text-white mb-6">My workspace's workflows</h2>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <Button className="bg-neutral-700 hover:bg-neutral-600 text-white text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create
          </Button>

          <div className="flex items-center gap-3">
            <button className="text-sm text-neutral-300 hover:text-white flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Filter
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 rounded border border-neutral-700">
              <span className="text-sm text-neutral-400">My workspace</span>
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Find a template"
                className="pl-9 pr-4 py-1.5 bg-neutral-800 border border-neutral-700 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 w-64"
              />
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20">
          {/* Canvas Illustration */}
          <div className="mb-8">
            <svg width="200" height="150" viewBox="0 0 200 150" fill="none">
              {/* Easel legs */}
              <path d="M60 140 L80 80 L90 80 L70 140 Z" fill="#d97598" />
              <path d="M140 140 L120 80 L110 80 L130 140 Z" fill="#d97598" />

              {/* Easel top */}
              <rect x="75" y="35" width="50" height="50" fill="#f5f5f5" stroke="#d97598" strokeWidth="3" />

              {/* Paint palette */}
              <ellipse cx="170" cy="120" rx="15" ry="20" fill="#d97598" />
              <circle cx="168" cy="115" r="3" fill="#fff" />
              <circle cx="168" cy="125" r="3" fill="#fff" />
              <circle cx="173" cy="120" r="3" fill="#fff" />
            </svg>
          </div>

          <h3 className="text-xl font-semibold text-white mb-2">There's nothing here yet</h3>
          <p className="text-sm text-neutral-400 mb-6">Looks like no one has created any project templates</p>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Create new template
          </Button>
        </div>
      </div>
    </div>
  );
}
