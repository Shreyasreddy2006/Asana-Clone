import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Star, MoreHorizontal, X, Plus, Users } from 'lucide-react';
import { useUIStore } from '@/store/ui.store';

export default function PortfolioDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const portfolioName = location.state?.portfolioName || 'hhhhh';
  const [showShareModal, setShowShareModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [notifyOnAdd, setNotifyOnAdd] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'timeline' | 'dashboard' | 'progress' | 'workload' | 'messages'>('list');
  const [showAddViewModal, setShowAddViewModal] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className={`flex-1 ${sidebarCollapsed ? 'ml-0' : 'ml-60'} transition-all duration-300`}>
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h1 className="text-2xl font-semibold">{portfolioName}</h1>
                <button className="p-1 hover:bg-neutral-800 rounded">
                  <Star className="w-5 h-5 text-neutral-400" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowShareModal(true)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 text-sm"
                >
                  Share
                </Button>
                <button className="p-2 hover:bg-neutral-800 rounded">
                  <MoreHorizontal className="w-5 h-5 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => setActiveTab('list')}
                className={`pb-3 ${activeTab === 'list' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                List
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-3 ${activeTab === 'timeline' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Timeline
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`pb-3 ${activeTab === 'dashboard' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`pb-3 ${activeTab === 'progress' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Progress
              </button>
              <button
                onClick={() => setActiveTab('workload')}
                className={`pb-3 ${activeTab === 'workload' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Workload
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`pb-3 ${activeTab === 'messages' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Messages
              </button>
              <button
                onClick={() => setShowAddViewModal(true)}
                className="pb-3 text-neutral-400 hover:text-white flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conditional Content Based on Active Tab */}
          {activeTab === 'list' && (
            <>
              {/* Toolbar */}
              <div className="px-8 py-3 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add work
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Filter
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Sort
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Group
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Options
                  </button>
                  <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* List View Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-900 border-b border-neutral-800">
                    <tr>
                      <th className="text-left px-8 py-3 text-xs font-medium text-neutral-400">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Task progress</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Due date</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Priority</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400">Owner</th>
                      <th className="px-4 py-3 text-xs font-medium text-neutral-400">
                        <Plus className="w-4 h-4" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-800 hover:bg-neutral-900">
                      <td className="px-8 py-4 text-sm text-neutral-400">Add a project or portfolio by name</td>
                      <td className="px-4 py-4"></td>
                      <td className="px-4 py-4"></td>
                      <td className="px-4 py-4"></td>
                      <td className="px-4 py-4"></td>
                      <td className="px-4 py-4"></td>
                      <td className="px-4 py-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'timeline' && (
            <>
              {/* Toolbar */}
              <div className="px-8 py-3 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add work
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Today
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-400">Quarters</span>
                  <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Filter
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Sort
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Group
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Options
                  </button>
                  <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Timeline Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-900 border-b border-neutral-800">
                    <tr>
                      <th className="text-left px-8 py-3 text-xs font-medium text-neutral-400 w-64">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 w-32">Owner</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-neutral-400 w-32">Status</th>
                      <th className="px-4 py-3 text-xs font-medium text-neutral-400 border-l border-neutral-800" colSpan={3}>
                        <div className="text-center mb-1">Q3 2025</div>
                        <div className="flex">
                          <div className="flex-1 text-center text-[10px]">September</div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-neutral-400 border-l border-neutral-800" colSpan={3}>
                        <div className="text-center mb-1">Q4 2025</div>
                        <div className="flex">
                          <div className="flex-1 text-center text-[10px]">October</div>
                          <div className="flex-1 text-center text-[10px]">November</div>
                          <div className="flex-1 text-center text-[10px]">December</div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-neutral-400 border-l border-neutral-800" colSpan={3}>
                        <div className="text-center mb-1">Q1 2026</div>
                        <div className="flex">
                          <div className="flex-1 text-center text-[10px]">January</div>
                          <div className="flex-1 text-center text-[10px]">February</div>
                          <div className="flex-1 text-center text-[10px]">March</div>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-neutral-400 border-l border-neutral-800" colSpan={2}>
                        <div className="text-center mb-1">Q2 2026</div>
                        <div className="flex">
                          <div className="flex-1 text-center text-[10px]">April</div>
                          <div className="flex-1 text-center text-[10px]">May</div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-800 hover:bg-neutral-900">
                      <td className="px-8 py-4 text-sm text-neutral-400">Add a project or portfolio by name</td>
                      <td className="px-4 py-4"></td>
                      <td className="px-4 py-4"></td>
                      <td className="px-4 py-4 border-l border-neutral-800" colSpan={3}></td>
                      <td className="px-4 py-4 border-l border-neutral-800" colSpan={3}></td>
                      <td className="px-4 py-4 border-l border-neutral-800" colSpan={3}></td>
                      <td className="px-4 py-4 border-l border-neutral-800" colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeTab === 'dashboard' && (
            <div className="p-8">
              {/* Dashboard View with Charts */}
              <div className="grid grid-cols-2 gap-6">
                {/* Total tasks */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-neutral-300">Total tasks</h3>
                    <button className="text-xs text-neutral-500">No filters</button>
                  </div>
                  <div className="flex items-center justify-center h-32">
                    <div className="text-6xl font-bold text-white">0</div>
                  </div>
                </div>

                {/* Total completed tasks */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-neutral-300">Total completed tasks</h3>
                    <button className="text-xs text-neutral-500">1 Filter</button>
                  </div>
                  <div className="flex items-center justify-center h-32">
                    <div className="text-6xl font-bold text-white">0</div>
                  </div>
                </div>

                {/* Total incomplete tasks */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-neutral-300">Total incomplete tasks</h3>
                    <button className="text-xs text-neutral-500">1 Filter</button>
                  </div>
                  <div className="flex items-center justify-center h-32">
                    <div className="text-6xl font-bold text-white">0</div>
                  </div>
                </div>

                {/* Total overdue tasks */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-neutral-300">Total overdue tasks</h3>
                    <button className="text-xs text-neutral-500">1 Filter</button>
                  </div>
                  <div className="flex items-center justify-center h-32">
                    <div className="text-6xl font-bold text-white">0</div>
                  </div>
                </div>

                {/* Total projects by project status */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 col-span-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-neutral-300">Total projects by project status</h3>
                    <button className="text-xs text-neutral-500">See all</button>
                  </div>
                  <div className="flex items-center justify-center h-48">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#404040" strokeWidth="16" fill="none" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">0</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total incomplete tasks by project */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 col-span-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-neutral-300">Total incomplete tasks by project</h3>
                    <button className="text-xs text-neutral-500">1 Filter</button>
                  </div>
                  <div className="flex items-center justify-center h-48">
                    <div className="w-full flex items-end justify-around gap-2 h-32">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex-1 bg-neutral-700 rounded-t" style={{ height: '0%' }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="flex flex-col items-center justify-center min-h-[500px] px-8">
              <div className="text-center max-w-2xl">
                <h2 className="text-xl font-semibold text-white mb-3">
                  This portfolio has <span className="text-neutral-400">no status</span> — yet.
                </h2>
                <div className="grid grid-cols-4 gap-4 mt-8 mb-8">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-neutral-400">Projects on track</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-neutral-400">Projects at risk</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-neutral-400">Projects off track</div>
                  </div>
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                    <div className="text-3xl font-bold text-white mb-1">0</div>
                    <div className="text-sm text-neutral-400">Total projects</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workload' && (
            <>
              {/* Toolbar */}
              <div className="px-8 py-3 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded flex items-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add work
                  </button>
                  <div className="flex items-center gap-2 ml-4">
                    <button className="p-1 hover:bg-neutral-800 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <span className="text-sm text-neutral-300">Today</span>
                    <button className="p-1 hover:bg-neutral-800 rounded">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    No date
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Days (small)
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Filter
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    People
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Task count
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                    Options
                  </button>
                </div>
              </div>

              {/* Workload View */}
              <div className="flex flex-col items-center justify-center min-h-[500px] px-8">
                <div className="text-center max-w-2xl">
                  <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-full bg-neutral-700 mb-2"></div>
                          <div className="h-24 w-12 bg-neutral-800 rounded relative">
                            <div className="absolute bottom-0 left-0 right-0 h-0 bg-neutral-600 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-white mb-3">
                    Open a window into your team's workload
                  </h2>
                  <p className="text-neutral-400 text-sm">
                    It's easy. Just add projects to your portfolio. For the best overview, make sure projects include assigned tasks and dates.{' '}
                    <a href="#" className="text-blue-400 hover:text-blue-300">Learn more about workload</a>
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'messages' && (
            <div className="flex flex-col items-center justify-center min-h-[500px] px-8">
              <div className="text-center max-w-xl">
                <div className="mb-8">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-24 h-16 bg-pink-200 rounded-2xl opacity-80"></div>
                    <div className="w-16 h-12 bg-red-400 rounded-2xl"></div>
                    <div className="w-32 h-20 bg-pink-300 rounded-2xl opacity-90"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Connect your words to your work
                </h2>
                <p className="text-neutral-400 mb-6">
                  Send a message to kick off projects. Or discuss tasks. Or brainstorm ideas.
                </p>
                <div className="flex items-center gap-2 max-w-2xl mx-auto bg-neutral-900 border border-neutral-700 rounded-lg p-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                    AY
                  </div>
                  <input
                    type="text"
                    placeholder="Send message to members"
                    className="flex-1 bg-transparent border-none text-white placeholder-neutral-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg w-full max-w-2xl mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h2 className="text-xl font-semibold text-white">Share hhhhh</h2>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-neutral-800 rounded"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Invite with email */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">Invite with email</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Add people, emails, or teams..."
                    className="flex-1 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                  <select className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none focus:border-blue-500">
                    <option>Editor</option>
                    <option>Viewer</option>
                    <option>Admin</option>
                  </select>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                    Invite
                  </Button>
                </div>
                <label className="flex items-center gap-2 mt-3 text-sm text-neutral-300">
                  <input
                    type="checkbox"
                    checked={notifyOnAdd}
                    onChange={(e) => setNotifyOnAdd(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-600 bg-neutral-800"
                  />
                  Notify when work is added to the portfolio
                </label>
              </div>

              {/* Access settings */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white mb-3">Access settings</h3>
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-800 rounded-lg">
                  <div className="w-8 h-8 bg-neutral-700 rounded flex items-center justify-center">
                    <Users className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">My workspace</div>
                  </div>
                  <button className="p-1 hover:bg-neutral-700 rounded">
                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Members */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">Members</h3>
                  <button className="text-sm text-blue-400 hover:text-blue-300">
                    Manage notifications
                  </button>
                </div>

                {/* Everyone at My workspace */}
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 rounded-lg">
                  <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">Everyone at My workspace</div>
                    <div className="text-xs text-neutral-400">Your organization</div>
                  </div>
                  <select className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none">
                    <option>Editor</option>
                  </select>
                </div>

                {/* Aman Yadav */}
                <div className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 rounded-lg">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-sm font-bold text-neutral-900">
                    AY
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-white">Aman Yadav</div>
                    <div className="text-xs text-neutral-400">7799amanyadav7799@gmail.com</div>
                  </div>
                  <select className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 rounded text-white text-sm focus:outline-none">
                    <option>Portfolio admin</option>
                  </select>
                </div>
              </div>

              {/* Copy link */}
              <div className="pt-4 border-t border-neutral-800">
                <button className="flex items-center gap-2 text-sm text-neutral-300 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Copy portfolio link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add View Modal */}
      {showAddViewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-neutral-900 rounded-lg w-full max-w-4xl max-h-[85vh] flex flex-col">
            {/* Modal Header with Close Button */}
            <div className="flex justify-end px-6 pt-4 pb-2 flex-shrink-0">
              <button
                onClick={() => setShowAddViewModal(false)}
                className="p-2 hover:bg-neutral-800 rounded"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="px-6 pb-6 overflow-y-auto flex-1">
              {/* Popular Section */}
              <div className="mb-6">
                <h3 className="text-xs font-medium text-neutral-400 mb-3">Popular</h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* List */}
                  <button className="flex items-start gap-4 p-4 bg-neutral-800 hover:bg-neutral-750 rounded-lg text-left transition-colors border border-neutral-700">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">List</h4>
                      <p className="text-xs text-neutral-400">Track across multiple projects in a powerful table</p>
                    </div>
                  </button>

                  {/* Timeline */}
                  <button className="flex items-start gap-4 p-4 bg-neutral-800 hover:bg-neutral-750 rounded-lg text-left transition-colors border border-neutral-700">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Timeline</h4>
                      <p className="text-xs text-neutral-400">Schedule work over time</p>
                    </div>
                  </button>

                  {/* Dashboard */}
                  <button className="flex items-start gap-4 p-4 bg-neutral-800 hover:bg-neutral-750 rounded-lg text-left transition-colors border border-neutral-700">
                    <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Dashboard</h4>
                      <p className="text-xs text-neutral-400">Monitor work metrics and insights</p>
                    </div>
                  </button>

                  {/* Workload */}
                  <button className="flex items-start gap-4 p-4 bg-neutral-800 hover:bg-neutral-750 rounded-lg text-left transition-colors border border-neutral-700">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Workload</h4>
                      <p className="text-xs text-neutral-400">Manage your team's time and capacity</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Other Section */}
              <div className="mb-6">
                <h3 className="text-xs font-medium text-neutral-400 mb-3">Other</h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Note */}
                  <button className="flex items-start gap-4 p-4 bg-neutral-800 hover:bg-neutral-750 rounded-lg text-left transition-colors border border-neutral-700">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-1">Note</h4>
                      <p className="text-xs text-neutral-400">Write meeting notes and more</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-neutral-800">
                <a href="#" className="text-sm text-blue-400 hover:text-blue-300">Send feedback</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
