import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Plus, X, Search, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Task } from '@/services/task.service';
import { Project } from '@/services/project.service';
import { useUIStore } from '@/store/ui.store';
import TeamSettingsDialog from '@/components/TeamSettingsDialog';
import WorkflowGallery from '@/pages/WorkflowGallery';
import NewTemplate from '@/pages/NewTemplate';
import BoardView from '@/components/BoardView';
import MessagesView from '@/components/MessagesView';
import CalendarView from '@/components/CalendarView';
import CreateGoalDialog from '@/components/CreateGoalDialog';
import InviteMembersDialog from '@/components/InviteMembersDialog';

export default function Workspace() {
  const { sidebarCollapsed } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  // derive initial tab from URL (e.g., /workspace/messages)
  const initialTabFromPath = (() => {
    const parts = location.pathname.split('/').filter(Boolean); // ['workspace', 'messages']
    const sub = parts[1];
    if (sub === 'members' || sub === 'all-work' || sub === 'messages' || sub === 'calendar' || sub === 'knowledge') {
      return sub as 'overview' | 'members' | 'all-work' | 'messages' | 'calendar' | 'knowledge';
    }
    return 'overview' as const;
  })();

  const [showSetupCard, setShowSetupCard] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'all-work' | 'messages' | 'calendar' | 'knowledge'>(initialTabFromPath);
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

  // Minimal stubs to satisfy child component prop requirements
  const dummyProject: Project = {
    _id: 'workspace',
    name: 'My workspace',
    workspace: '',
    owner: '',
    members: [],
    sections: [],
    color: '',
    icon: '',
    view: 'board',
    status: 'active',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const dummyTasks: Task[] = [];

  const noopUpdateTask = async (taskId: string, field: string, value: any) => {
    return Promise.resolve();
  };

  const noopCreateTask = async (sectionId: string, title: string) => {
    return Promise.resolve();
  };

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

  const renderOverview = () => (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-neutral-700 flex items-center justify-center mb-4">
          <span className="text-3xl font-semibold text-neutral-300">M</span>
        </div>
        <h1 className="text-3xl font-semibold mb-2">My workspace</h1>
      </div>

      {/* Workspace Description */}
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
        </div>

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

          {showCreateWorkDropdown && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowCreateWorkDropdown(false)}></div>
              <div className="absolute top-full right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg w-64 z-50">
                <div className="py-2">
                  <button
                    onClick={() => {
                      setShowCreateWorkDropdown(false);
                      setShowWorkflowGallery(true);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-center gap-3"
                  >
                    <Plus className="w-5 h-5 text-neutral-400" />
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
            {/* Setup card items */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center">
                  <Plus className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">Add team description</h3>
                  <p className="text-xs text-neutral-400">Describe your team's purpose</p>
                </div>
              </div>
            </div>

            {/* Add work */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded flex items-center justify-center">
                  <Plus className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">Add work</h3>
                  <p className="text-xs text-neutral-400">Link existing projects</p>
                </div>
              </div>
            </div>

            {/* Add teammates */}
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-600 rounded flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-1">Add teammates</h3>
                  <p className="text-xs text-neutral-400">Start collaborating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Curated work */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Curated work</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300">View all work</button>
          </div>

          {/* Work Items */}
          <div className="space-y-3">
            {/* Work Item 1 */}
            <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4 hover:bg-neutral-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 rounded flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="h-3 bg-neutral-600 rounded w-3/4 mb-2"></div>
                  <div className="h-2 bg-neutral-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold">
                AY
              </div>
              <div className="w-8 h-8 rounded-full bg-neutral-600 flex items-center justify-center text-xs font-bold">
                ds
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold">
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
          </div>
        </div>
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
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
            {/* Members list */}
            <tr className="hover:bg-neutral-800/30">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold">
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
  );

  const renderKnowledge = () => (
    <div className="px-8 py-6">
      <div className="mb-6">
        <Button
          onClick={handleAddEntry}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New entry
        </Button>
      </div>

      <div className="space-y-4 max-w-4xl">
        {knowledgeEntries.map((entry) => (
          <div
            key={entry.id}
            className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 relative"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}
                className="p-1 hover:bg-neutral-700 rounded"
              >
                <MoreHorizontal className="w-5 h-5 text-neutral-400" />
              </button>

              {openMenuId === entry.id && (
                <div className="absolute right-0 mt-1 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-neutral-700 rounded-lg"
                  >
                    Delete entry
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={entry.title}
              onChange={(e) => handleUpdateEntry(entry.id, 'title', e.target.value)}
              className="w-full bg-transparent border-none text-xl font-semibold text-white mb-4 focus:outline-none pr-12"
              placeholder="Untitled entry"
            />

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
  );
  // keep activeTab in sync with URL when user uses back/forward
  useEffect(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const sub = parts[1];
    if (sub && sub !== activeTab) {
      if (['members', 'all-work', 'messages', 'calendar', 'knowledge'].includes(sub)) {
        setActiveTab(sub as any);
        return;
      }
    }
    if ((!sub || sub === '') && activeTab !== 'overview') {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className={`flex-1 ${sidebarCollapsed ? 'ml-0' : 'ml-60'} transition-all duration-300`}>
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header section */}
          <div className="border-b border-neutral-800 px-4 py-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-neutral-700 flex items-center justify-center">
                <span className="text-2xl font-semibold text-neutral-300">M</span>
              </div>
              <h1 className="text-2xl font-semibold">My workspace</h1>
            </div>
          </div>

          {/* Tabs section */}
          <div className="border-b border-neutral-800">
            <div className="px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                {['overview', 'members', 'all-work', 'messages', 'calendar', 'knowledge'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      // Update state for immediate UI response
                      setActiveTab(tab as any);
                      // Navigate to subpath (overview -> /workspace)
                      const path = tab === 'overview' ? '/workspace' : `/workspace/${tab}`;
                      navigate(path);
                    }}
                    className={`pb-3 ${activeTab === tab ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowAddTabModal(true)}
                  className="p-2 hover:bg-neutral-800 rounded"
                >
                  <Plus className="w-4 h-4 text-neutral-400" />
                </button>

                {showAddTabModal && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAddTabModal(false)}></div>
                    <div className="absolute top-full right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg w-64 z-50">
                      <div className="py-2">
                        <button className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors">
                          <span className="text-sm text-white">Add tab</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'members' && renderMembers()}
          {activeTab === 'all-work' && (
            <BoardView
              project={dummyProject}
              tasks={dummyTasks}
              onUpdateTask={noopUpdateTask}
              onCreateTask={noopCreateTask}
            />
          )}

          {activeTab === 'messages' && (
            <MessagesView project={dummyProject} showHeader={false} />
          )}

          {activeTab === 'calendar' && (
            <CalendarView project={dummyProject} tasks={dummyTasks} onUpdateTask={noopUpdateTask} />
          )}
          {activeTab === 'knowledge' && renderKnowledge()}
        </main>
      </div>

      {/* Dialogs */}
      <TeamSettingsDialog open={showTeamSettings} onOpenChange={setShowTeamSettings} />
      
      {showWorkflowGallery && (
        <WorkflowGallery
          onClose={() => setShowWorkflowGallery(false)}
          onCreateBlankProject={() => {
            setShowWorkflowGallery(false);
          }}
        />
      )}

      {showNewTemplate && (
        <NewTemplate onClose={() => setShowNewTemplate(false)} />
      )}

      <CreateGoalDialog
        open={showCreateGoalDialog}
        onOpenChange={setShowCreateGoalDialog}
      />

      <InviteMembersDialog
        open={showInviteMembersDialog}
        onOpenChange={setShowInviteMembersDialog}
      />
    </div>
  );
}