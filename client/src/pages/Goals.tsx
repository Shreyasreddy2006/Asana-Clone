import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { X, Info, Users } from 'lucide-react';
import { useState } from 'react';

export default function Goals() {
  const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [members, setMembers] = useState('');
  const [createdGoal, setCreatedGoal] = useState<any>(null);

  const handleSaveGoal = () => {
    const newGoal = {
      title: goalTitle,
      owner: 'Aman Yadav',
      timePeriod: 'Q4 FY25',
      workspace: 'My workspace',
      progress: 0,
      members: members,
    };
    setCreatedGoal(newGoal);
    setIsCreateGoalOpen(false);
    setGoalTitle('');
    setMembers('');
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className="flex-1 ml-60">
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <h1 className="text-2xl font-semibold mb-6">Goals</h1>

            {/* Tabs */}
            <div className="flex items-center gap-6 text-sm">
              <button className="pb-3 border-b-2 border-white font-medium text-white flex items-center gap-2">
                <span className="text-xs">📊</span>
                <span>Strategy map</span>
              </button>
              <button className="pb-3 text-neutral-400 hover:text-white font-medium flex items-center gap-2">
                <span className="text-xs">📋</span>
                <span>Team goals</span>
              </button>
              <button className="pb-3 text-neutral-400 hover:text-white font-medium flex items-center gap-2">
                <span className="text-xs">🎯</span>
                <span>My goals</span>
              </button>
              <button className="pb-3 text-neutral-400 hover:text-white font-medium flex items-center gap-1">
                <span>+</span>
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="border-b border-neutral-800 px-8 py-4 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsCreateGoalOpen(true)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-2 border border-neutral-700"
              >
                <span>+</span>
                Create goal
              </Button>
              <Button variant="ghost" className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 flex items-center gap-2">
                <span className="text-xs">📅</span>
                <span>Time periods: All</span>
              </Button>
              <Button variant="ghost" className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 p-2">
                <span className="text-sm">🔧</span>
              </Button>
            </div>
          </div>

          {/* Content Area */}
          {!createdGoal ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-300px)] px-8">
              {/* Decorative Shapes */}
              <div className="relative mb-8">
                <div className="flex items-center justify-center gap-4">
                  {/* Left dotted circle */}
                  <div className="w-20 h-20 border-2 border-dashed border-neutral-700 rounded-full" />

                  {/* Blue triangle */}
                  <div className="relative">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <polygon points="40,10 70,60 10,60" fill="#3b82f6" />
                    </svg>
                    <div className="absolute -top-2 -left-3 text-white text-xl">✦</div>
                  </div>

                  {/* White square */}
                  <div className="w-16 h-16 bg-white rounded-sm transform rotate-12" />

                  {/* Right dotted triangle */}
                  <div className="relative">
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <polygon points="40,10 70,60 10,60" fill="none" stroke="#525252" strokeWidth="2" strokeDasharray="4,4" />
                    </svg>
                    <div className="absolute -top-2 -right-2 text-white text-xl">✦</div>
                  </div>

                  {/* Pink circle */}
                  <div className="w-20 h-20 bg-red-400 rounded-full" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
              </div>

              {/* Text Content */}
              <h2 className="text-2xl font-semibold mb-6 text-white">No company goals</h2>

              {/* Create Goal Button */}
              <Button
                onClick={() => setIsCreateGoalOpen(true)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
              >
                Create goal
              </Button>
            </div>
          ) : (
            /* Goal Detail View */
            <div className="flex h-[calc(100vh-300px)]">
              {/* Left Side - Goal Card */}
              <div className="w-[360px] border-r border-neutral-800 p-6">
                <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 hover:bg-neutral-800/50 transition-colors">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-5 h-5 border-2 border-neutral-500 rounded-sm mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-neutral-500">Goal</span>
                        <span className="text-xs text-neutral-500">⭘ No recent updates</span>
                      </div>
                      <h3 className="text-base font-medium text-blue-400 mb-3">{createdGoal.title}</h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-yellow-500">⚡</span>
                        <span className="text-sm">{createdGoal.progress}%</span>
                        <span className="text-sm text-neutral-500">• No subgoals</span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-400">
                        <span>{createdGoal.timePeriod}</span>
                        <span>•</span>
                        <span>📋 {createdGoal.workspace}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] font-bold text-neutral-900">
                            AY
                          </div>
                          <span>{createdGoal.owner}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center justify-center gap-1 py-2">
                  <span>+</span>
                  <span>Add child</span>
                </button>
              </div>

              {/* Right Side - Goal Details */}
              <div className="flex-1 overflow-y-auto">
                {/* Header */}
                <div className="border-b border-neutral-800 px-8 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-2 border-neutral-500 rounded flex items-center justify-center">
                      <span className="text-xs">△</span>
                    </div>
                    <h2 className="text-2xl font-semibold">{createdGoal.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-neutral-400 hover:text-white">
                      <span className="text-sm">👍</span>
                    </Button>
                    <Button variant="ghost" className="text-neutral-400 hover:text-white">
                      <span className="text-sm">🔗</span>
                    </Button>
                    <Button variant="ghost" className="text-neutral-400 hover:text-white">
                      <span className="text-sm">⋯</span>
                    </Button>
                    <Button variant="ghost" className="text-neutral-400 hover:text-white">
                      <span className="text-sm">✕</span>
                    </Button>
                  </div>
                </div>

                {/* Goal Info */}
                <div className="px-8 py-6 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">Goal owner</label>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                          AY
                        </div>
                        <span className="text-sm">{createdGoal.owner}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">Time period</label>
                      <span className="text-sm">{createdGoal.timePeriod}</span>
                    </div>

                    <div>
                      <label className="block text-sm text-neutral-400 mb-2">Accountable team</label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📋</span>
                        <span className="text-sm">{createdGoal.workspace}</span>
                      </div>
                    </div>
                  </div>

                  {/* Share a status update */}
                  <div className="border border-neutral-700 rounded-lg p-6 bg-neutral-900">
                    <h3 className="text-lg font-semibold mb-4">Share a status update</h3>

                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 mb-4 min-h-[120px]">
                      <p className="text-sm text-neutral-400">
                        Update your team and others on the progress of this goal.
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                          <Users className="w-4 h-4 text-neutral-400" />
                        </div>
                      </div>
                      <Button className="bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-600">
                        Update status
                      </Button>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="border border-neutral-700 rounded-lg p-6 bg-neutral-900">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <span>Progress</span>
                        <span className="text-yellow-500">⚡</span>
                      </h3>
                      <Button variant="ghost" className="text-blue-400 hover:text-blue-300 text-sm">
                        ⚙️ Progress settings
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-neutral-400">
                      <span className="text-red-400">🔴</span>
                      <span>No sub-goals connected</span>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                        AY
                      </div>
                      <Input
                        placeholder="Ask a question or leave a comment..."
                        className="flex-1 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                        AY
                      </div>
                      <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center">
                        <Users className="w-4 h-4 text-neutral-400" />
                      </div>
                      <Button variant="ghost" size="sm" className="text-neutral-400">
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
