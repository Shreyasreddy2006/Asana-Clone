import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Plus, X, Search, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useUIStore } from '@/store/ui.store';
import TeamSettingsDialog from '@/components/TeamSettingsDialog';
import WorkflowGallery from '@/pages/WorkflowGallery';
import NewTemplate from '@/pages/NewTemplate';
import CreateGoalDialog from '@/components/CreateGoalDialog';
import InviteMembersDialog from '@/components/InviteMembersDialog';

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

  const renderOverviewTab = () => (
    <div className="px-8 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-20 h-20 rounded-full bg-neutral-700 flex items-center justify-center mb-4">
          <span className="text-3xl font-semibold text-neutral-300">M</span>
        </div>
        <h1 className="text-3xl font-semibold mb-2">My workspace</h1>
      </div>

      {showSetupCard && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full border-2 border-neutral-600"></div>
              <span className="text-sm font-medium">Finish setting up your team</span>
              <span className="text-xs text-neutral-500">1 of 3 steps completed</span>
            </div>
            <button
              onClick={() => setShowSetupCard(false)}
              className="p-1 hover:bg-neutral-800 rounded"
            >
              <X className="w-4 h-4 text-neutral-400" />
            </button>
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
          </div>
        </div>
      )}
    </div>
  );

  const renderMembersTab = () => (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add member
        </Button>
      </div>
    </div>
  );

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
              </div>
            </div>
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'members' && renderMembersTab()}
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