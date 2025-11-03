import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Plus, X, Search, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
<<<<<<< Updated upstream
import { useUIStore } from '@/store/ui.store';
=======
import TeamSettingsDialog from '@/components/TeamSettingsDialog';
import WorkflowGallery from '@/pages/WorkflowGallery';
import NewTemplate from '@/pages/NewTemplate';
import CreateGoalDialog from '@/components/CreateGoalDialog';
import InviteMembersDialog from '@/components/InviteMembersDialog';
>>>>>>> Stashed changes

export default function Workspace() {
  const { sidebarCollapsed } = useUIStore();
  const [showSetupCard, setShowSetupCard] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'all-work' | 'messages' | 'calendar' | 'knowledge'>('overview');
  const [showAddTabModal, setShowAddTabModal] = useState(false);
  const [showCreateWorkDropdown, setShowCreateWorkDropdown] = useState(false);
  const [showTeamSettings, setShowTeamSettings] = useState(false);
  const [showAddWorkMenu, setShowAddWorkMenu] = useState(false);
  const [showWorkflowGallery, setShowWorkflowGallery] = useState(false);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [showCreateGoalDialog, setShowCreateGoalDialog] = useState(false);
  const [showInviteMembersDialog, setShowInviteMembersDialog] = useState(false);
  const [knowledgeEntries, setKnowledgeEntries] = useState<Array<{id: string, title: string, description: string}>>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleAddEntry = () => {
    const newEntry = {
      id: Date.now().toString(),
      title: 'Untitled entry',
      description: ''
    };
    setKnowledgeEntries([...knowledgeEntries, newEntry]);
  };

  const handleDeleteEntry = (id: string) => {
    setKnowledgeEntries(knowledgeEntries.filter(entry => entry.id !== id));
    setOpenMenuId(null);
  };

  const handleUpdateEntry = (id: string, field: 'title' | 'description', value: string) => {
    setKnowledgeEntries(knowledgeEntries.map(entry =>
      entry.id === id ? { ...entry, [field]: value } : entry
    ));
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className={`flex-1 ${sidebarCollapsed ? 'ml-0' : 'ml-60'} transition-all duration-300`}>
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header section - My workspace title and icon */}
          <div className="border-b border-neutral-800 px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center">
                <span className="text-2xl font-semibold text-neutral-300">M</span>
              </div>
              <h1 className="text-2xl font-semibold">My workspace</h1>
            </div>
          </div>

          {/* Tabs section */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
<<<<<<< Updated upstream
              {/* Right side - Action buttons */}
              {activeTab === 'members' && (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Invite
                </Button>
              )}
              {activeTab === 'all-work' && (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                  New project
                </Button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 text-sm">
=======
              {/* Tabs */}
              <div className="flex items-center gap-6 text-sm">
>>>>>>> Stashed changes
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-3 ${activeTab === 'overview' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`pb-3 ${activeTab === 'members' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Members
              </button>
              <button
                onClick={() => setActiveTab('all-work')}
                className={`pb-3 ${activeTab === 'all-work' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                All work
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`pb-3 ${activeTab === 'messages' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Messages
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`pb-3 ${activeTab === 'calendar' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('knowledge')}
                className={`pb-3 ${activeTab === 'knowledge' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Knowledge
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowAddTabModal(true)}
                  className="pb-3 text-neutral-400 hover:text-white flex items-center gap-1"
                  id="add-tab-button"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Add Tab Dropdown - positioned below the plus button */}
                {showAddTabModal && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div className="fixed inset-0 z-40" onClick={() => setShowAddTabModal(false)}></div>

                    {/* Dropdown menu */}
                    <div
                      className="absolute top-full left-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg w-64 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-2">
                        <button className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-center gap-3">
                          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <div className="text-sm text-white">Note</div>
                            <div className="text-xs text-blue-400">New</div>
                          </div>
                        </button>
                        <div className="border-t border-neutral-800 my-1"></div>
                        <button className="w-full px-4 py-2 text-left hover:bg-neutral-800 transition-colors">
                          <span className="text-sm text-neutral-400 hover:text-white">Send feedback</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
              </div>

              {/* Right side - Action buttons based on active tab */}
              <div>
                {activeTab === 'members' && (
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Invite
                  </Button>
                )}
                {activeTab === 'all-work' && (
                  <Button
                    onClick={() => setShowWorkflowGallery(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    New project
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Overview Tab Content */}
          {activeTab === 'overview' && (
<<<<<<< Updated upstream
            <div className="px-8 py-6">
              {/* Centered Workspace Icon and Title */}
              <div className="flex flex-col items-center justify-center mb-12 mt-8">
                <div className="w-32 h-32 rounded-full bg-neutral-700 flex items-center justify-center mb-6 border-4 border-neutral-600">
                  <span className="text-6xl font-semibold text-neutral-300">M</span>
=======
            <div className="px-8 py-6 max-w-7xl">
              {/* Centered Workspace Icon and Title */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-neutral-700 flex items-center justify-center mb-4">
                  <span className="text-3xl font-semibold text-neutral-300">M</span>
                </div>
                <h1 className="text-3xl font-semibold mb-2">My workspace</h1>
              </div>

              {/* Workspace Description and Create Work Button */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1 max-w-2xl">
                  <button
                    onClick={() => {
                      console.log('Clicking team description button');
                      setShowTeamSettings(true);
                    }}
                    className="text-sm text-neutral-400 hover:text-white"
                  >
                    Click to add team description...
                  </button>
>>>>>>> Stashed changes
                </div>
                <h1 className="text-4xl font-semibold mb-4">My workspace</h1>
                <button className="text-sm text-neutral-400 hover:text-white">
                  Click to add team description...
                </button>
              </div>

              {/* Workspace Description and Create Work Button */}
              <div className="flex items-start justify-between mb-8 max-w-7xl mx-auto">
                {/* Create Work Button moved to right */}
                <div className="flex-1"></div>

                <div className="relative">
                  <Button
                    onClick={() => setShowCreateWorkDropdown(!showCreateWorkDropdown)}
                    className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 flex items-center gap-2"
                  >
                    Create work
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>

                  {/* Create Work Dropdown */}
                  {showCreateWorkDropdown && (
                    <>
                      {/* Backdrop to close dropdown */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowCreateWorkDropdown(false)}></div>

                      {/* Dropdown menu */}
                      <div
                        className="absolute top-full right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg w-64 z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowCreateWorkDropdown(false);
                              setShowWorkflowGallery(true);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-center gap-3"
                          >
                            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-white">New team project</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowCreateWorkDropdown(false);
                              setShowNewTemplate(true);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-center gap-3"
                          >
                            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                            </svg>
                            <span className="text-sm text-white">New team template</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Setup Card */}
              {showSetupCard && (
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 mb-8 relative">
                  <button
                    onClick={() => setShowSetupCard(false)}
                    className="absolute top-4 right-4 p-1 hover:bg-neutral-800 rounded"
                  >
                    <X className="w-4 h-4 text-neutral-400" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-600"></div>
                    <span className="text-sm font-medium">Finish setting up your team</span>
                    <span className="text-xs text-neutral-500">1 of 3 steps completed</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Add team description */}
                    <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-1">Add team description</h3>
                          <p className="text-xs text-neutral-400">Describe your team's purpose and responsibilities</p>
                        </div>
                      </div>
                    </div>

                    {/* Add work */}
                    <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-1">Add work</h3>
                          <p className="text-xs text-neutral-400">Link existing projects, portfolios, or templates your team may find helpful</p>
                        </div>
                      </div>
                    </div>

                    {/* Add teammates */}
                    <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800 transition-colors cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-1">Add teammates</h3>
                          <p className="text-xs text-neutral-400">Start collaborating by inviting teammates to your new team</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Two Column Layout */}
              <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
                {/* Left Column - Curated work */}
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Curated work</h3>
                    <button className="text-sm text-blue-400 hover:text-blue-300">View all work</button>
                  </div>

                  {/* Work Items */}
                  <div className="space-y-3 mb-6">
                    {/* Work Item 1 */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-neutral-600 rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-neutral-700 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>

                    {/* Work Item 2 */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-neutral-600 rounded w-2/3 mb-2"></div>
                          <div className="h-2 bg-neutral-700 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>

                    {/* Work Item 3 */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-neutral-600 rounded w-3/5 mb-2"></div>
                          <div className="h-2 bg-neutral-700 rounded w-2/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-center relative">
                    <p className="text-sm text-neutral-400 mb-4">
                      Organize links to important work such as portfolios, projects,<br />
                      templates, etc. for your team members to find easily.
                    </p>
                    <Button
                      onClick={() => setShowAddWorkMenu(!showAddWorkMenu)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add work
                    </Button>

                    {/* Add Work Dropdown Menu */}
                    {showAddWorkMenu && (
                      <>
                        {/* Backdrop to close menu */}
                        <div className="fixed inset-0 z-40" onClick={() => setShowAddWorkMenu(false)}></div>

                        {/* Menu */}
                        <div
                          className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg w-80 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="py-2">
                            {/* Link existing work */}
                            <button className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-start gap-3">
                              <svg className="w-5 h-5 text-neutral-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <div>
                                <div className="text-sm font-medium text-white">Link existing work</div>
                                <div className="text-xs text-neutral-400 mt-0.5">Portfolios, projects, templates, etc.</div>
                              </div>
                            </button>

                            <div className="border-t border-neutral-800 my-1"></div>

                            {/* Link to any work */}
                            <button className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-start gap-3">
                              <svg className="w-5 h-5 text-neutral-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              <span className="text-sm text-white">Link to any work</span>
                            </button>

                            {/* Attach a file */}
                            <button className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-start gap-3">
                              <svg className="w-5 h-5 text-neutral-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <div>
                                <div className="text-sm text-white">Attach a file</div>
                                <div className="text-xs text-neutral-400 mt-0.5">Upload a file</div>
                              </div>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Column - Members and Goals */}
                <div className="space-y-6">
                  {/* Members Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Members</h3>
                      <button className="text-sm text-blue-400 hover:text-blue-300">View all 3</button>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                        AY
                      </div>
                      <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center text-xs font-bold text-white">
                        ds
                      </div>
                      <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
                        p
                      </div>
                      <button
                        onClick={() => setShowInviteMembersDialog(true)}
                        className="w-8 h-8 rounded-full bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4 text-neutral-300" />
                      </button>
                    </div>
                  </div>

                  {/* Goals Section */}
                  <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Goals</h3>
                      <Button
                        onClick={() => setShowCreateGoalDialog(true)}
                        className="bg-neutral-800 hover:bg-neutral-700 text-white text-sm"
                      >
                        Create goal
                      </Button>
                    </div>
                    <p className="text-sm text-neutral-400 mb-3">
                      This team hasn't created any goals yet
                    </p>
                    <p className="text-xs text-neutral-500">
                      Add a goal so the team can see what you hope to achieve.
                    </p>
                  </div>

                  {/* On track info */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                      <span>🟢 On track (0%)</span>
                      <span>•</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Members Tab Content */}
          {activeTab === 'members' && (
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <Button className="bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add member
                </Button>
                <button className="text-sm text-blue-400 hover:text-blue-300">Send feedback</button>
              </div>

              {/* Members Table */}
              <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-800/50 border-b border-neutral-700">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-neutral-400">Name</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-neutral-400">Job title</th>
                      <th className="px-6 py-3 text-xs font-medium text-neutral-400">
                        <Plus className="w-4 h-4" />
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-700">
                    {/* Member 1 */}
                    <tr className="hover:bg-neutral-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center text-xs font-bold text-white">
                            da
                          </div>
                          <span className="text-sm">damfo@gmail.com</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400"></td>
                      <td className="px-6 py-4"></td>
                    </tr>

                    {/* Member 2 */}
                    <tr className="hover:bg-neutral-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
                            pl
                          </div>
                          <span className="text-sm">pl@gmail.com</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400"></td>
                      <td className="px-6 py-4"></td>
                    </tr>

                    {/* Member 3 */}
                    <tr className="hover:bg-neutral-800/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                            AY
                          </div>
                          <span className="text-sm">Aman Yadav</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400"></td>
                      <td className="px-6 py-4"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* All Work Tab Content */}
          {activeTab === 'all-work' && (
            <div className="px-8 py-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-sm bg-neutral-800 hover:bg-neutral-700 text-white rounded">
                    Projects
                  </button>
                  <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white rounded">
                    Send feedback
                  </button>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button className="p-2 hover:bg-neutral-800 rounded">
                    <Search className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Projects Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Projects</h3>
                    <button className="text-sm text-blue-400 hover:text-blue-300">Send feedback</button>
                  </div>

                  <div className="space-y-3">
                    {/* Project Item */}
                    <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium mb-1">hkmn</h4>
                          <p className="text-xs text-neutral-500">Joined</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                            AY
                          </div>
                          <div className="w-6 h-6 rounded-full bg-neutral-600 flex items-center justify-center text-xs font-bold text-white">
                            da
                          </div>
                          <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">
                            pl
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Templates Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Templates</h3>
                    <button className="text-sm text-blue-400 hover:text-blue-300">Send feedback</button>
                  </div>

                  <div className="space-y-3">
                    {/* New Template Card */}
                    <div
                      onClick={() => setShowNewTemplate(true)}
                      className="border-2 border-dashed border-neutral-700 rounded-lg p-8 flex flex-col items-center justify-center hover:border-neutral-600 cursor-pointer transition-colors"
                    >
                      <Plus className="w-8 h-8 text-neutral-400 mb-2" />
                      <p className="text-sm text-neutral-300">New Template</p>
                    </div>

                    {/* Explore Templates */}
                    <div
                      onClick={() => setShowWorkflowGallery(true)}
                      className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center">
                          <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <span className="text-sm">Explore all templates</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages Tab Content */}
          {activeTab === 'messages' && (
            <div className="flex flex-col items-center justify-center min-h-[500px] px-8">
              <div className="max-w-3xl w-full">
                {/* Message Input */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                    AY
                  </div>
                  <input
                    type="text"
                    placeholder="Send message to members"
                    className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                  />
                </div>

                {/* Empty State */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-24 h-16 bg-pink-200 rounded-2xl opacity-80"></div>
                    <div className="w-16 h-12 bg-red-400 rounded-2xl"></div>
                    <div className="w-32 h-20 bg-pink-300 rounded-2xl opacity-90"></div>
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    Connect your words to your work
                  </h2>
                  <p className="text-neutral-400">
                    Send a message to kick off projects. Or discuss tasks. Or brainstorm ideas. You can also send messages from your email to{' '}
                    <span className="text-blue-400">team+121181431065624@mail.asana.com</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Calendar Tab Content */}
          {activeTab === 'calendar' && (
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button className="p-1.5 hover:bg-neutral-800 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">Today</span>
                  <button className="p-1.5 hover:bg-neutral-800 rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <span className="text-lg font-semibold">November 2025</span>
                </div>
                <div className="text-sm text-neutral-400">Weekends: Off</div>
              </div>

              {/* Calendar Grid */}
              <div className="bg-neutral-900 border border-neutral-700 rounded-lg overflow-hidden">
                <div className="grid grid-cols-5 border-b border-neutral-700">
                  <div className="px-4 py-2 text-xs font-medium text-neutral-400 border-r border-neutral-700">MON</div>
                  <div className="px-4 py-2 text-xs font-medium text-neutral-400 border-r border-neutral-700">TUE</div>
                  <div className="px-4 py-2 text-xs font-medium text-neutral-400 border-r border-neutral-700">WED</div>
                  <div className="px-4 py-2 text-xs font-medium text-neutral-400 border-r border-neutral-700">THU</div>
                  <div className="px-4 py-2 text-xs font-medium text-neutral-400">FRI</div>
                </div>

                {/* Calendar Days - Sample week */}
                <div className="grid grid-cols-5 divide-x divide-neutral-700">
                  {/* Day 3 (Today) */}
                  <div className="p-3 border-b border-neutral-700 min-h-[120px] bg-blue-900/20">
                    <div className="text-sm font-medium mb-2">November 3</div>
                    <div className="space-y-1">
                      <div className="bg-cyan-600 text-xs px-2 py-1 rounded">scvfhei</div>
                      <div className="bg-cyan-600 text-xs px-2 py-1 rounded">xxi</div>
                      <div className="bg-cyan-600 text-xs px-2 py-1 rounded">pop</div>
                    </div>
                  </div>

                  {/* Other days */}
                  {[4, 5, 6, 7].map((day) => (
                    <div key={day} className="p-3 border-b border-neutral-700 min-h-[120px]">
                      <div className="text-sm font-medium text-neutral-500">{day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Knowledge Tab Content */}
          {activeTab === 'knowledge' && (
            <div className="px-8 py-6">
              {/* New Entry Button */}
              <div className="mb-6">
                <Button
                  onClick={handleAddEntry}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New entry
                </Button>
              </div>

              {/* Knowledge Entries */}
              <div className="space-y-4 max-w-4xl">
                {knowledgeEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 relative"
                  >
                    {/* Three-dot menu */}
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}
                        className="p-1 hover:bg-neutral-700 rounded transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5 text-neutral-400" />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === entry.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                          <button
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-neutral-700 rounded-lg transition-colors"
                          >
                            Delete entry
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Title Input */}
                    <input
                      type="text"
                      value={entry.title}
                      onChange={(e) => handleUpdateEntry(entry.id, 'title', e.target.value)}
                      className="w-full bg-transparent border-none text-xl font-semibold text-white mb-4 focus:outline-none pr-12"
                      placeholder="Untitled entry"
                    />

                    {/* Description Label */}
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Description
                    </label>

                    {/* Description Textarea */}
                    <textarea
                      value={entry.description}
                      onChange={(e) => handleUpdateEntry(entry.id, 'description', e.target.value)}
                      placeholder="Add a description"
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 resize-none min-h-[100px]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Team Settings Dialog */}
      <TeamSettingsDialog open={showTeamSettings} onOpenChange={setShowTeamSettings} />

      {/* Workflow Gallery */}
      {showWorkflowGallery && (
        <WorkflowGallery
          onClose={() => setShowWorkflowGallery(false)}
          onCreateBlankProject={() => {
            setShowWorkflowGallery(false);
            // Handle blank project creation here
          }}
        />
      )}

      {/* New Template */}
      {showNewTemplate && (
        <NewTemplate onClose={() => setShowNewTemplate(false)} />
      )}

      {/* Create Goal Dialog */}
      <CreateGoalDialog
        open={showCreateGoalDialog}
        onOpenChange={setShowCreateGoalDialog}
      />

      {/* Invite Members Dialog */}
      <InviteMembersDialog
        open={showInviteMembersDialog}
        onOpenChange={setShowInviteMembersDialog}
      />
    </div>
  );
}
