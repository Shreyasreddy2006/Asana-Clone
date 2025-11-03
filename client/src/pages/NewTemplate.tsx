import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NewTemplateProps {
  onClose: () => void;
}

export default function NewTemplate({ onClose }: NewTemplateProps) {
  const [templateTitle, setTemplateTitle] = useState('');
  const [privacy, setPrivacy] = useState('Anyone in team can edit');

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] z-50 flex">
      {/* Left Panel - Form */}
      <div className="w-[480px] bg-[#1a1a1a] p-8 flex flex-col">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-white mb-3">New template</h1>
        <p className="text-neutral-400 text-sm mb-8">
          Build out reusable templates and share it with your team to help them kick off new projects in seconds.
        </p>

        {/* Form Fields */}
        <div className="flex-1 space-y-6">
          {/* Title of template */}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Title of template
            </label>
            <input
              type="text"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-700 text-white py-2 focus:outline-none focus:border-neutral-500"
              placeholder=""
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Privacy
            </label>
            <select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-neutral-700 text-white px-3 py-2.5 rounded focus:outline-none focus:border-neutral-500"
            >
              <option value="Anyone in team can edit">Anyone in team can edit</option>
              <option value="Only me">Only me</option>
              <option value="Specific people">Specific people</option>
            </select>
          </div>
        </div>

        {/* Create template button */}
        <Button
          className="w-full bg-neutral-700 hover:bg-neutral-600 text-white py-3"
          disabled={!templateTitle}
        >
          Create template
        </Button>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 bg-gradient-to-br from-[#1e3a8a] to-[#1e40af] relative overflow-hidden">
        {/* Decorative curves */}
        <div className="absolute inset-0">
          <svg className="absolute top-0 left-0 w-full h-32" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,0 Q300,50 600,0 T1200,0 L1200,100 L0,100 Z" fill="rgba(255,255,255,0.05)" />
          </svg>
          <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path d="M0,100 Q300,50 600,100 T1200,100 L1200,0 L0,0 Z" fill="rgba(255,255,255,0.05)" />
          </svg>
        </div>

        {/* Preview Content */}
        <div className="relative h-full flex items-center justify-center p-16">
          <div className="bg-[#2a2a2a] rounded-lg shadow-2xl w-full max-w-4xl">
            {/* Mock Project Header */}
            <div className="border-b border-neutral-700 px-6 py-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-neutral-700 rounded"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-medium">Overview</span>
                    <span className="text-blue-400 font-medium border-b-2 border-blue-400 pb-1">List</span>
                    <span className="text-neutral-500">Board</span>
                    <span className="text-neutral-500">Timeline</span>
                    <span className="text-neutral-500">Calendar</span>
                    <span className="text-neutral-500">Workflow</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
                  <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
                  <div className="w-8 h-8 bg-neutral-700 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Mock Task List */}
            <div className="p-6">
              {/* First Row - Uncompleted Tasks */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 border-2 border-neutral-600 rounded"></div>
                  <div className="h-3 bg-neutral-600 rounded w-1/2"></div>
                  <div className="w-8 h-8 bg-neutral-700 rounded-full ml-auto"></div>
                  <div className="w-6 h-6 bg-neutral-700 rounded"></div>
                  <div className="h-6 bg-neutral-700 rounded w-24"></div>
                  <div className="h-6 bg-cyan-400 rounded w-32"></div>
                  <div className="h-6 bg-green-400 rounded w-32"></div>
                  <div className="h-6 bg-pink-400 rounded w-32"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 border-2 border-neutral-600 rounded"></div>
                  <div className="h-3 bg-neutral-600 rounded w-2/3"></div>
                  <div className="w-8 h-8 bg-neutral-700 rounded-full ml-auto"></div>
                  <div className="w-6 h-6 bg-neutral-700 rounded"></div>
                  <div className="h-6 bg-neutral-700 rounded w-24"></div>
                  <div className="h-6 bg-blue-400 rounded w-32"></div>
                  <div className="h-6 bg-teal-400 rounded w-32"></div>
                  <div className="h-6 bg-pink-300 rounded w-32"></div>
                </div>
              </div>

              {/* Empty Row */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-5 h-5 border-2 border-neutral-600 rounded"></div>
                <div className="h-3 bg-neutral-700 rounded w-1/3"></div>
                <div className="w-8 h-8 bg-neutral-700 rounded-full ml-auto"></div>
                <div className="w-6 h-6 bg-neutral-700 rounded"></div>
                <div className="h-6 bg-neutral-700 rounded w-24"></div>
              </div>

              {/* Completed Tasks */}
              <div className="space-y-3 mt-8">
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="h-3 bg-neutral-600 rounded w-1/2"></div>
                  <div className="w-8 h-8 bg-neutral-700 rounded-full ml-auto"></div>
                  <div className="w-6 h-6 bg-neutral-700 rounded"></div>
                  <div className="h-6 bg-neutral-700 rounded w-24"></div>
                  <div className="h-6 bg-blue-400 rounded w-32"></div>
                  <div className="h-6 bg-orange-400 rounded w-32"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="h-3 bg-neutral-600 rounded w-2/3"></div>
                  <div className="w-8 h-8 bg-neutral-700 rounded-full ml-auto"></div>
                  <div className="w-6 h-6 bg-neutral-700 rounded"></div>
                  <div className="h-6 bg-neutral-700 rounded w-24"></div>
                  <div className="h-6 bg-purple-400 rounded w-32"></div>
                  <div className="h-6 bg-red-400 rounded w-32"></div>
                  <div className="h-6 bg-pink-300 rounded w-32"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="h-3 bg-neutral-600 rounded w-1/2"></div>
                  <div className="w-8 h-8 bg-neutral-700 rounded-full ml-auto"></div>
                  <div className="w-6 h-6 bg-neutral-700 rounded"></div>
                  <div className="h-6 bg-neutral-700 rounded w-24"></div>
                  <div className="w-6 h-6 bg-neutral-700 rounded"></div>
                  <div className="w-6 h-6 bg-neutral-700 rounded"></div>
                  <div className="h-6 bg-pink-400 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
}
