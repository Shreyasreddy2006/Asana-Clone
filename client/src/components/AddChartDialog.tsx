import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LayoutGrid } from 'lucide-react';
import { useState } from 'react';

interface AddChartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddChartDialog({ open, onOpenChange }: AddChartDialogProps) {
  const [activeCategory, setActiveCategory] = useState('Recommended');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl bg-neutral-900 border-neutral-700 text-white p-0 gap-0 max-h-[90vh]">
        {/* Header */}
        <div className="border-b border-neutral-800 px-6 py-4">
          <DialogTitle className="text-xl font-semibold text-white">Add chart</DialogTitle>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-48 border-r border-neutral-800 p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveCategory('Recommended')}
                className={`w-full text-left px-3 py-2 text-sm rounded ${
                  activeCategory === 'Recommended'
                    ? 'text-blue-400 bg-neutral-800'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                Recommended
              </button>
              <button
                onClick={() => setActiveCategory('Resourcing')}
                className={`w-full text-left px-3 py-2 text-sm rounded ${
                  activeCategory === 'Resourcing'
                    ? 'text-blue-400 bg-neutral-800'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                Resourcing
              </button>
              <button
                onClick={() => setActiveCategory('Work health')}
                className={`w-full text-left px-3 py-2 text-sm rounded ${
                  activeCategory === 'Work health'
                    ? 'text-blue-400 bg-neutral-800'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                Work health
              </button>
              <button
                onClick={() => setActiveCategory('Progress')}
                className={`w-full text-left px-3 py-2 text-sm rounded ${
                  activeCategory === 'Progress'
                    ? 'text-blue-400 bg-neutral-800'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                Progress
              </button>
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            <h3 className="text-lg font-semibold mb-4">{activeCategory}</h3>

            {/* Chart Grid */}
            <div className="grid grid-cols-3 gap-4">
              {activeCategory === 'Recommended' && (
                <>
              {/* Add custom chart */}
              <button className="border-2 border-dashed border-neutral-700 rounded-lg p-6 flex flex-col items-center justify-center hover:border-neutral-600 transition-colors h-32">
                <LayoutGrid className="w-8 h-8 text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-300">Add custom chart</p>
              </button>

              {/* Incomplete tasks by project */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Incomplete tasks by project</p>
                  <div className="flex items-end gap-1 mt-auto">
                    <div className="w-6 h-8 bg-teal-500 rounded-sm"></div>
                    <div className="w-6 h-12 bg-teal-500 rounded-sm"></div>
                    <div className="w-6 h-6 bg-teal-500 rounded-sm"></div>
                    <div className="w-6 h-10 bg-teal-500 rounded-sm"></div>
                  </div>
                </div>
              </button>

              {/* Projects by status */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Projects by status</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="w-12 h-12 rounded-full border-8 border-green-500 border-t-red-500 border-r-yellow-500"></div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
                </>
              )}

              {activeCategory === 'Resourcing' && (
                <>
              {/* Estimated and actual time by assignee */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors relative">
                <span className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">New</span>
                <div className="flex flex-col items-start h-full">
                  <p className="text-xs font-medium mb-2">Estimated and actual time by assignee</p>
                  <div className="flex items-end gap-1 mt-auto">
                    <div className="w-4 h-10 bg-purple-400 rounded-sm"></div>
                    <div className="w-4 h-12 bg-pink-500 rounded-sm"></div>
                    <div className="w-4 h-8 bg-purple-300 rounded-sm"></div>
                    <div className="w-4 h-14 bg-pink-400 rounded-sm"></div>
                    <div className="w-4 h-6 bg-purple-400 rounded-sm"></div>
                    <div className="w-4 h-11 bg-pink-500 rounded-sm"></div>
                  </div>
                </div>
              </button>

              {/* Estimated and actual time over time */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors relative">
                <span className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">New</span>
                <div className="flex flex-col items-start h-full">
                  <p className="text-xs font-medium mb-2">Estimated and actual time over time</p>
                  <div className="relative w-full h-16 mt-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      <polyline points="0,40 20,30 40,35 60,20 80,25 100,15" fill="none" stroke="#8b5cf6" strokeWidth="2"/>
                      <polyline points="0,45 20,38 40,42 60,30 80,35 100,28" fill="none" stroke="#fbbf24" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </button>

              {/* Tasks by assignee and task status */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors relative">
                <span className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded">New</span>
                <div className="flex flex-col items-start h-full">
                  <p className="text-xs font-medium mb-2">Tasks by assignee and task status</p>
                  <div className="flex items-end gap-1 mt-auto">
                    <div className="w-5 h-8 bg-purple-400 rounded-sm"></div>
                    <div className="w-5 h-12 bg-purple-300 rounded-sm"></div>
                    <div className="w-5 h-14 bg-purple-500 rounded-sm"></div>
                    <div className="w-5 h-10 bg-purple-400 rounded-sm"></div>
                  </div>
                </div>
              </button>

              {/* Upcoming tasks by assignee this week */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-xs font-medium mb-2">Upcoming tasks by assignee this week</p>
                  <div className="flex items-end justify-around w-full gap-1 mt-auto">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-1 h-12 bg-blue-400 rounded-full"></div>
                      <div className="w-4 h-4 rounded-full bg-neutral-600"></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-1 h-10 bg-blue-400 rounded-full"></div>
                      <div className="w-4 h-4 rounded-full bg-neutral-600"></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-1 h-8 bg-blue-400 rounded-full"></div>
                      <div className="w-4 h-4 rounded-full bg-neutral-600"></div>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-1 h-14 bg-blue-400 rounded-full"></div>
                      <div className="w-4 h-4 rounded-full bg-neutral-600"></div>
                    </div>
                  </div>
                </div>
              </button>

              {/* This month's tasks by project */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-xs font-medium mb-2">This month's tasks by project</p>
                  <div className="flex items-end gap-1 mt-auto">
                    <div className="w-5 h-8 bg-red-500 rounded-sm"></div>
                    <div className="w-5 h-6 bg-yellow-500 rounded-sm"></div>
                    <div className="w-5 h-12 bg-green-500 rounded-sm"></div>
                    <div className="w-5 h-10 bg-blue-500 rounded-sm"></div>
                  </div>
                </div>
              </button>

              {/* Custom field total */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-xs font-medium mb-2">Custom field total</p>
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mt-auto">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-neutral-900">133</p>
                      <div className="w-8 h-1 bg-blue-500 mx-auto mt-1"></div>
                    </div>
                  </div>
                </div>
              </button>
                </>
              )}

              {activeCategory === 'Work health' && (
                <>
              {/* Time in custom field */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Time in custom field</p>
                  <div className="flex items-end gap-1 mt-auto">
                    <div className="w-6 h-10 bg-blue-500 rounded-sm"></div>
                    <div className="w-6 h-14 bg-teal-500 rounded-sm"></div>
                    <div className="w-6 h-8 bg-yellow-500 rounded-sm"></div>
                    <div className="w-6 h-12 bg-orange-500 rounded-sm"></div>
                  </div>
                </div>
              </button>

              {/* Tasks by custom field */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Tasks by custom field</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="w-12 h-12 rounded-full border-8 border-blue-500 border-t-green-500 border-r-yellow-500 border-b-red-500"></div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Overdue tasks by project */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Overdue tasks by project</p>
                  <div className="flex items-end gap-1 mt-auto">
                    <div className="w-6 h-12 bg-red-500 rounded-sm"></div>
                    <div className="w-6 h-8 bg-red-500 rounded-sm"></div>
                    <div className="w-6 h-14 bg-red-500 rounded-sm"></div>
                    <div className="w-6 h-10 bg-red-500 rounded-sm"></div>
                  </div>
                </div>
              </button>

              {/* Upcoming tasks by project */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Upcoming tasks by project</p>
                  <div className="flex items-end gap-1 mt-auto">
                    <div className="w-5 h-8 bg-blue-500 rounded-sm"></div>
                    <div className="w-5 h-12 bg-blue-500 rounded-sm"></div>
                    <div className="w-5 h-10 bg-blue-500 rounded-sm"></div>
                    <div className="w-5 h-6 bg-neutral-600 rounded-sm"></div>
                  </div>
                </div>
              </button>

              {/* Custom field total by projects */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Custom field total by projects</p>
                  <div className="flex items-end gap-1 mt-auto">
                    <div className="w-5 h-10 bg-purple-400 rounded-sm"></div>
                    <div className="w-5 h-14 bg-purple-300 rounded-sm"></div>
                    <div className="w-5 h-12 bg-purple-500 rounded-sm"></div>
                    <div className="w-5 h-8 bg-purple-400 rounded-sm"></div>
                  </div>
                </div>
              </button>

              {/* Projects by custom field */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Projects by custom field</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="w-12 h-12 rounded-full border-8 border-pink-500 border-t-teal-500 border-r-purple-500"></div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Goals by status */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Goals by status</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="w-12 h-12 rounded-full border-8 border-green-500 border-t-red-500 border-r-yellow-500"></div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
                </>
              )}

              {activeCategory === 'Progress' && (
                <>
              {/* Projects with the most completed tasks */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Projects with the most completed tasks</p>
                  <div className="flex items-end gap-1 mt-auto">
                    <div className="w-5 h-10 bg-teal-500 rounded-sm"></div>
                    <div className="w-5 h-14 bg-teal-500 rounded-sm"></div>
                    <div className="w-5 h-12 bg-teal-500 rounded-sm"></div>
                    <div className="w-5 h-8 bg-neutral-600 rounded-sm"></div>
                  </div>
                </div>
              </button>

              {/* Tasks by completion status this month */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Tasks by completion status this month</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="w-12 h-12 rounded-full border-8 border-blue-500 border-t-green-500 border-r-yellow-500"></div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="w-8 h-1 bg-neutral-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              {/* Tasks completed by month */}
              <button className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-700 transition-colors">
                <div className="flex flex-col items-start h-full">
                  <p className="text-sm font-medium mb-2">Tasks completed by month</p>
                  <div className="relative w-full h-16 mt-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 50">
                      <polyline points="0,40 20,35 40,30 60,25 80,20 100,15" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                      <circle cx="20" cy="35" r="2" fill="#3b82f6"/>
                      <circle cx="40" cy="30" r="2" fill="#3b82f6"/>
                      <circle cx="60" cy="25" r="2" fill="#3b82f6"/>
                      <circle cx="80" cy="20" r="2" fill="#3b82f6"/>
                    </svg>
                  </div>
                </div>
              </button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
