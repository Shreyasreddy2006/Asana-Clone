import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Star, MoreHorizontal, X, Plus, Users } from 'lucide-react';

export default function PortfolioDetail() {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [notifyOnAdd, setNotifyOnAdd] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className="flex-1 ml-60">
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h1 className="text-2xl font-semibold">hhhhh</h1>
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
              <button className="pb-3 border-b-2 border-white font-medium text-white">
                List
              </button>
              <button className="pb-3 text-neutral-400 hover:text-white">
                Timeline
              </button>
              <button className="pb-3 text-neutral-400 hover:text-white">
                Dashboard
              </button>
            </div>
          </div>

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
                    <div className="text-center mb-1">Q4 2025</div>
                    <div className="flex">
                      <div className="flex-1 text-center">October</div>
                      <div className="flex-1 text-center">November</div>
                      <div className="flex-1 text-center">December</div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-neutral-400 border-l border-neutral-800" colSpan={3}>
                    <div className="text-center mb-1">Q1 2026</div>
                    <div className="flex">
                      <div className="flex-1 text-center">January</div>
                      <div className="flex-1 text-center">February</div>
                      <div className="flex-1 text-center">March</div>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-neutral-400 border-l border-neutral-800" colSpan={2}>
                    <div className="text-center mb-1">Q2 2026</div>
                    <div className="flex">
                      <div className="flex-1 text-center">April</div>
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
                  <td className="px-4 py-4 border-l border-neutral-800" colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
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
    </div>
  );
}
