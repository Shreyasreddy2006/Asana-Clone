import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { X, Info, Users, ThumbsUp, Link2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useUIStore } from '@/store/ui.store';

interface Goal {
  id: string;
  title: string;
  owner: string;
  timePeriod: string;
  workspace: string;
  progress: number;
  members: string;
  parentId: string | null;
  children: string[];
}

export default function Goals() {

  const [activeTab, setActiveTab] = useState<'strategy-map' | 'team-goals' | 'my-goals'>('strategy-map');
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [members, setMembers] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [parentGoalId, setParentGoalId] = useState<string | null>(null);
  const [showTimePeriodMenu, setShowTimePeriodMenu] = useState(false);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('All');

  const handleSaveGoal = () => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: goalTitle,
      owner: 'Aman Yadav',
      timePeriod: 'Q4 FY25',
      workspace: 'My workspace',
      progress: 0,
      members: members,
      parentId: parentGoalId,
      children: [],
    };

    const updatedGoals = [...goals, newGoal];

    // If this is a child goal, update parent's children array
    if (parentGoalId) {
      const parentIndex = updatedGoals.findIndex(g => g.id === parentGoalId);
      if (parentIndex !== -1) {
        updatedGoals[parentIndex] = {
          ...updatedGoals[parentIndex],
          children: [...updatedGoals[parentIndex].children, newGoal.id]
        };
      }
    }

    setGoals(updatedGoals);
    setIsCreateGoalOpen(false);
    setGoalTitle('');
    setMembers('');
    setParentGoalId(null);
  };

  const handleAddChild = (parentId: string) => {
    setParentGoalId(parentId);
    setIsCreateGoalOpen(true);
  };

  const selectedGoal = selectedGoalId ? goals.find(g => g.id === selectedGoalId) : null;

  // Helper to render a goal card with its children recursively
  const renderGoalNode = (goal: Goal, depth: number = 0): JSX.Element => {
    const childGoals = goals.filter(g => g.parentId === goal.id);

    return (
      <div key={goal.id} className="relative">
        {/* Vertical line from parent */}
        {depth > 0 && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-12 bg-neutral-700"></div>
        )}

        {/* Goal Card */}
        <div
          onClick={() => setSelectedGoalId(goal.id)}
          className={`bg-neutral-900 border rounded-lg p-4 w-80 transition-colors cursor-pointer ${
            selectedGoalId === goal.id
              ? 'border-blue-500 bg-neutral-800/70'
              : 'border-neutral-700 hover:bg-neutral-800/50'
          }`}
        >
          <div className="flex items-start gap-2 mb-3">
            <div className="w-4 h-4 border-2 border-neutral-500 rounded-sm mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-neutral-500">Goal</span>
                <span className="text-xs text-neutral-500">⭘ No recent updates</span>
              </div>
              <h4 className="text-sm font-medium text-white mb-2">{goal.title}</h4>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500">⚡</span>
                <span className="text-xs">{goal.progress}%</span>
                <span className="text-xs text-neutral-500">• {childGoals.length} subgoal{childGoals.length !== 1 ? 's' : ''}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
                <span>{goal.timePeriod}</span>
                <span>•</span>
                <span>📋 {goal.workspace}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-[8px] font-bold text-neutral-900">
                    AY
                  </div>
                  <span>{goal.owner}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* "+ Add child" button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddChild(goal.id);
          }}
          className="w-full mt-2 text-xs text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 py-1"
        >
          <span>+</span>
          <span>Add child</span>
        </button>

        {/* Render children */}
        {childGoals.length > 0 && (
          <div className="relative mt-8">
            {/* Vertical line to children */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-px h-12 bg-neutral-700"></div>

            {/* Horizontal line connecting children */}
            {childGoals.length > 1 && (
              <div
                className="absolute top-0 h-px bg-neutral-700"
                style={{
                  left: '50%',
                  right: '50%',
                  width: `${(childGoals.length - 1) * 400}px`,
                  transform: 'translateX(-50%)'
                }}
              ></div>
            )}

            {/* Child goals */}
            <div className="flex gap-8 mt-12">
              {childGoals.map(childGoal => renderGoalNode(childGoal, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Get only top-level goals (no parent)
  const topLevelGoals = goals.filter(g => !g.parentId);

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className={`flex-1 ${sidebarCollapsed ? 'ml-0' : 'ml-60'} transition-all duration-300`}>
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <h1 className="text-2xl font-semibold mb-6">Goals</h1>

            {/* Tabs */}
            <div className="flex items-center gap-6 text-sm relative">
              <button
                onClick={() => setActiveTab('strategy-map')}
                className={`pb-3 font-medium flex items-center gap-2 ${
                  activeTab === 'strategy-map'
                    ? 'border-b-2 border-white text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="text-xs">📊</span>
                <span>Strategy map</span>
              </button>
              <button
                onClick={() => setActiveTab('team-goals')}
                className={`pb-3 font-medium flex items-center gap-2 ${
                  activeTab === 'team-goals'
                    ? 'border-b-2 border-white text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="text-xs">📋</span>
                <span>Team goals</span>
              </button>
              <button
                onClick={() => setActiveTab('my-goals')}
                className={`pb-3 font-medium flex items-center gap-2 ${
                  activeTab === 'my-goals'
                    ? 'border-b-2 border-white text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="text-xs">🎯</span>
                <span>My goals</span>
              </button>
              <button
                onClick={() => setShowViewMenu(!showViewMenu)}
                className="pb-3 text-neutral-400 hover:text-white font-medium flex items-center gap-1"
              >
                <span>+</span>
              </button>

              {/* View Menu Dropdown */}
              {showViewMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowViewMenu(false)}></div>
                  <div className="absolute top-full left-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg w-80 z-50">
                    <div className="py-2">
                      {/* Team list */}
                      <button className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Team list</h4>
                          <p className="text-xs text-neutral-400">View goals by team</p>
                        </div>
                      </button>

                      {/* Owner list */}
                      <button className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Owner list</h4>
                          <p className="text-xs text-neutral-400">View goals by owner</p>
                        </div>
                      </button>

                      {/* Map */}
                      <button className="w-full px-4 py-3 text-left hover:bg-neutral-800 transition-colors flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-white">Map</h4>
                          <p className="text-xs text-neutral-400">Visualize goals on strategy map</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="border-b border-neutral-800 px-8 py-4 flex items-center justify-center">
            <div className="flex items-center gap-3 relative">
              <Button
                onClick={() => setIsCreateGoalOpen(true)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-2 border border-neutral-700"
              >
                <span>+</span>
                Create goal
              </Button>

              {/* Time Period Filter Dropdown */}
              <div className="relative">
                <Button
                  onClick={() => setShowTimePeriodMenu(!showTimePeriodMenu)}
                  variant="ghost"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 flex items-center gap-2"
                >
                  <span className="text-xs">📅</span>
                  <span>Time periods: {selectedTimePeriod}</span>
                </Button>

                {/* Time Period Dropdown Menu */}
                {showTimePeriodMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowTimePeriodMenu(false)}></div>
                    <div className="absolute top-full left-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-lg w-96 z-50">
                      <div className="p-4">
                        {/* FY25 Section */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <button
                              onClick={() => {
                                setSelectedTimePeriod('FY25');
                                setShowTimePeriodMenu(false);
                              }}
                              className="text-sm text-white hover:text-blue-400 transition-colors"
                            >
                              FY25
                            </button>
                            <span className="text-xs text-neutral-500">Jan 1 – Dec 31</span>
                          </div>
                        </div>

                        {/* Halves */}
                        <div className="mb-4">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => {
                                setSelectedTimePeriod('H1');
                                setShowTimePeriodMenu(false);
                              }}
                              className="text-left px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-white transition-colors"
                            >
                              H1
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTimePeriod('H2');
                                setShowTimePeriodMenu(false);
                              }}
                              className="text-left px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-white transition-colors"
                            >
                              H2
                            </button>
                          </div>
                        </div>

                        {/* Quarters */}
                        <div className="mb-4">
                          <div className="grid grid-cols-4 gap-2">
                            <button
                              onClick={() => {
                                setSelectedTimePeriod('Q1');
                                setShowTimePeriodMenu(false);
                              }}
                              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-white transition-colors"
                            >
                              Q1
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTimePeriod('Q2');
                                setShowTimePeriodMenu(false);
                              }}
                              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-white transition-colors"
                            >
                              Q2
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTimePeriod('Q3');
                                setShowTimePeriodMenu(false);
                              }}
                              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-white transition-colors"
                            >
                              Q3
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTimePeriod('Q4');
                                setShowTimePeriodMenu(false);
                              }}
                              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-white transition-colors"
                            >
                              Q4
                            </button>
                          </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                          <button
                            onClick={() => {
                              setSelectedTimePeriod('All');
                              setShowTimePeriodMenu(false);
                            }}
                            className="text-sm text-neutral-400 hover:text-white transition-colors"
                          >
                            Clear
                          </button>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => setShowTimePeriodMenu(false)}
                              variant="ghost"
                              className="text-sm text-white hover:bg-neutral-800"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => setShowTimePeriodMenu(false)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            >
                              Apply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Button variant="ghost" className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 p-2">
                <span className="text-sm">🔧</span>
              </Button>
            </div>
          </div>

          {/* Content Area */}
          {activeTab === 'strategy-map' ? (
            /* Strategy Map View - Split Layout */
            <div className="flex h-[calc(100vh-200px)]">
              {/* Left Side - Strategy Map */}
              <div className={`${selectedGoalId ? 'w-3/5' : 'w-full'} flex flex-col items-center justify-start overflow-y-auto px-8 py-12 transition-all`}>
                {/* Parent "My workspace" Box */}
                <div className="relative">
                  {/* "Our mission" label */}
                  <div className="text-center mb-2">
                    <span className="text-xs text-neutral-500">Our mission</span>
                  </div>

                  {/* My workspace card */}
                  <div className="bg-neutral-800 border border-neutral-700 rounded-lg px-6 py-4 mb-8">
                    <h3 className="text-lg font-semibold text-white text-center">My workspace</h3>
                  </div>

                  {/* Connection lines from parent to children */}
                  {topLevelGoals.length > 0 && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-12 bg-neutral-700"></div>
                  )}
                </div>

                {/* Top-level Goals */}
                {topLevelGoals.length > 0 ? (
                  <div className="relative">
                    {/* Horizontal line connecting all top-level children */}
                    {topLevelGoals.length > 1 && (
                      <div
                        className="absolute top-0 h-px bg-neutral-700"
                        style={{
                          left: '50%',
                          right: '50%',
                          width: `${(topLevelGoals.length - 1) * 400}px`,
                          transform: 'translateX(-50%)'
                        }}
                      ></div>
                    )}

                    {/* Goal Cards with recursive rendering */}
                    <div className="flex gap-8 mt-12">
                      {topLevelGoals.map(goal => renderGoalNode(goal, 0))}
                    </div>
                  </div>
                ) : (
                  /* Empty State when no goals */
                  <div className="text-center mt-8">
                    <h2 className="text-xl font-semibold mb-4 text-white">No company goals</h2>
                    <Button
                      onClick={() => setIsCreateGoalOpen(true)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
                    >
                      Create goal
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Side - Goal Detail Panel */}
              {selectedGoal && (
                <div className="w-2/5 border-l border-neutral-800 bg-neutral-900 overflow-y-auto">
                  {/* Panel Header */}
                  <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-neutral-500 rounded-sm" />
                      <h3 className="text-lg font-semibold text-white">{selectedGoal.title}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedGoalId(null)}
                      className="p-1 hover:bg-neutral-800 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-neutral-400" />
                    </button>
                  </div>

                  {/* Panel Content */}
                  <div className="px-6 py-6 space-y-6">
                    {/* Goal Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-400">Owner:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                            AY
                          </div>
                          <span className="text-white">{selectedGoal.owner}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-400">Time period:</span>
                        <span className="text-white">{selectedGoal.timePeriod}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-400">Accountable team:</span>
                        <span className="text-white">📋 {selectedGoal.workspace}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-neutral-400">Progress:</span>
                        <span className="text-white">{selectedGoal.progress}%</span>
                      </div>
                    </div>

                    {/* Share a status update section */}
                    <div className="border-t border-neutral-800 pt-6">
                      <h4 className="text-sm font-semibold text-white mb-3">Share a status update</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-500">●</span>
                            <span className="text-white">On track</span>
                          </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-yellow-500">●</span>
                            <span className="text-white">At risk</span>
                          </div>
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-red-500">●</span>
                            <span className="text-white">Off track</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Comment section */}
                    <div className="border-t border-neutral-800 pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900 flex-shrink-0">
                          AY
                        </div>
                        <div className="flex-1">
                          <textarea
                            placeholder="Add a comment..."
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 resize-none text-sm"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-4 border-t border-neutral-800 pt-4">
                      <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Like</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                        <Link2 className="w-4 h-4" />
                        <span>Link</span>
                      </button>
                      <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                        <span>More</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === 'team-goals' ? (
            /* Team Goals View */
            <div className="px-8 py-6">
              {/* Table Header */}
              <div className="border-b border-neutral-800 mb-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs text-neutral-400 font-medium">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Progress</div>
                  <div className="col-span-2">Time period</div>
                  <div className="col-span-1">Accountable team</div>
                  <div className="col-span-1">Owner</div>
                </div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-neutral-800">
                {goals.map((goal) => (
                  <div key={goal.id} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-neutral-900 cursor-pointer transition-colors">
                    {/* Name */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-neutral-500 rounded-sm" />
                      <span className="text-sm text-white">{goal.title}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-xs text-neutral-400">⭘ No recent updates</span>
                    </div>

                    {/* Progress */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-white">{goal.progress}%</span>
                    </div>

                    {/* Time period */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-neutral-400">{goal.timePeriod}</span>
                    </div>

                    {/* Accountable team */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-xs">📋</span>
                    </div>

                    {/* Owner */}
                    <div className="col-span-1 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                        AY
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {goals.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <h3 className="text-xl font-semibold text-white mb-2">No team goals yet</h3>
                  <p className="text-sm text-neutral-400 mb-6">Create a goal to get started</p>
                  <Button
                    onClick={() => setIsCreateGoalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create goal
                  </Button>
                </div>
              )}
            </div>
          ) : activeTab === 'my-goals' ? (
            /* My Goals View */
            <div className="px-8 py-6">
              {/* Table Header */}
              <div className="border-b border-neutral-800 mb-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs text-neutral-400 font-medium">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Progress</div>
                  <div className="col-span-2">Time period</div>
                  <div className="col-span-1">Accountable team</div>
                  <div className="col-span-1">Owner</div>
                </div>
              </div>

              {/* Table Rows - Only show goals owned by current user */}
              <div className="divide-y divide-neutral-800">
                {goals.filter(goal => goal.owner === 'Aman Yadav').map((goal) => (
                  <div key={goal.id} className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-neutral-900 cursor-pointer transition-colors">
                    {/* Name */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-neutral-500 rounded-sm" />
                      <span className="text-sm text-white">{goal.title}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-xs text-neutral-400">⭘ No recent updates</span>
                    </div>

                    {/* Progress */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-white">{goal.progress}%</span>
                    </div>

                    {/* Time period */}
                    <div className="col-span-2 flex items-center">
                      <span className="text-sm text-neutral-400">{goal.timePeriod}</span>
                    </div>

                    {/* Accountable team */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-xs">📋</span>
                    </div>

                    {/* Owner */}
                    <div className="col-span-1 flex items-center">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                        AY
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {goals.filter(goal => goal.owner === 'Aman Yadav').length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">
                  <h3 className="text-xl font-semibold text-white mb-2">No goals assigned to you yet</h3>
                  <p className="text-sm text-neutral-400 mb-6">Create a goal or get assigned to one</p>
                  <Button
                    onClick={() => setIsCreateGoalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create goal
                  </Button>
                </div>
              )}
            </div>
          ) : null}

          {/* Create Goal Dialog */}
          <Dialog open={isCreateGoalOpen} onOpenChange={setIsCreateGoalOpen}>
            <DialogContent className="max-w-4xl bg-neutral-900 border-neutral-700 text-white p-0 gap-0">
              {/* Close Button */}
              <button
                onClick={() => setIsCreateGoalOpen(false)}
                className="absolute right-4 top-4 z-10 p-2 rounded-sm opacity-70 hover:opacity-100 hover:bg-neutral-800 transition-opacity"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex">
                {/* Left Side - Illustration */}
                <div className="w-[280px] bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-8">
                  <div className="relative">
                    {/* Mountain with flag illustration */}
                    <svg width="200" height="240" viewBox="0 0 200 240" fill="none">
                      {/* Flag pole */}
                      <line x1="100" y1="80" x2="100" y2="180" stroke="white" strokeWidth="3" />

                      {/* Flag */}
                      <path d="M100 80 L140 95 L100 110 Z" fill="#ef4444" />

                      {/* Mountains */}
                      <path d="M20 180 L80 100 L140 180 Z" fill="white" opacity="0.9" />
                      <path d="M90 180 L140 110 L190 180 Z" fill="white" opacity="0.6" />

                      {/* Pink shadow on left mountain */}
                      <path d="M80 100 L140 180 L20 180 Z" fill="#fbbf24" opacity="0.3" />

                      {/* Base line */}
                      <line x1="0" y1="180" x2="200" y2="180" stroke="white" strokeWidth="2" opacity="0.5" />
                    </svg>
                  </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 p-8">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-semibold text-white">
                      Add company goal
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Goal Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Goal title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        placeholder=""
                        className="w-full bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Goal Owner, Time Period, Privacy Row */}
                    <div className="grid grid-cols-3 gap-4">
                      {/* Goal Owner */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-400">
                          Goal owner
                        </label>
                        <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md">
                          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                            AY
                          </div>
                          <span className="text-sm">Aman Yadav</span>
                          <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      </div>

                      {/* Time Period */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-400 flex items-center gap-1">
                          Time period
                          <Info className="w-3 h-3" />
                        </label>
                        <select className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                          <option>Q4 FY25</option>
                        </select>
                      </div>

                      {/* Privacy */}
                      <div>
                        <label className="block text-sm font-medium mb-2 text-neutral-400">
                          Privacy
                        </label>
                        <select className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-md text-white text-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none">
                          <option>👥 Public</option>
                        </select>
                      </div>
                    </div>

                    {/* Members */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-neutral-400 flex items-center gap-1">
                        Members
                        <Info className="w-3 h-3" />
                      </label>
                      <Input
                        value={members}
                        onChange={(e) => setMembers(e.target.value)}
                        placeholder="Name or email"
                        className="w-full bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    {/* Asana Tip */}
                    <div className="flex items-start gap-2 text-xs text-neutral-400 bg-neutral-800/50 p-3 rounded-md">
                      <span className="text-sm">💡</span>
                      <p>
                        Asana tip: You can edit these details and progress settings after creating this goal
                      </p>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-neutral-800">
                    <Button
                      variant="ghost"
                      onClick={() => setIsCreateGoalOpen(false)}
                      className="text-white hover:bg-neutral-800"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!goalTitle}
                      onClick={handleSaveGoal}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save goal
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Bottom Right Controls */}
          <div className="fixed bottom-8 right-8 flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg p-2">
            <button className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white">
              <span className="text-sm">☰</span>
            </button>
            <button className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white">
              <span className="text-sm">🖼️</span>
            </button>
            <button className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white">
              <span className="text-sm">−</span>
            </button>
            <button className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white">
              <span className="text-sm">+</span>
            </button>
            <button className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white">
              <span className="text-sm">⛶</span>
            </button>
            <button className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white">
              <span className="text-sm">ⓘ</span>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
