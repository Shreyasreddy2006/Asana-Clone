import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

interface TeamSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TeamSettingsDialog({ open, onOpenChange }: TeamSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'advanced'>('general');
  const [teamName, setTeamName] = useState('My workspace');
  const [description, setDescription] = useState('');
  const [isEndorsed, setIsEndorsed] = useState(true);
  const [privacy, setPrivacy] = useState('request');

  console.log('TeamSettingsDialog open:', open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-neutral-900 border-neutral-700 text-white p-0 gap-0 max-h-[90vh] overflow-hidden z-[100]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h2 className="text-xl font-semibold">Team settings</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-neutral-800 rounded"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-800 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`pb-3 text-sm ${
                activeTab === 'general'
                  ? 'border-b-2 border-white text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`pb-3 text-sm ${
                activeTab === 'members'
                  ? 'border-b-2 border-white text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`pb-3 text-sm ${
                activeTab === 'advanced'
                  ? 'border-b-2 border-white text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* Admin Warning */}
              <div className="flex items-start justify-between bg-neutral-800 border border-neutral-700 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center mt-0.5">
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-white">My workspace does not have a team admin.</p>
                    <button className="text-sm text-blue-400 hover:text-blue-300 underline">
                      What's a team admin?
                    </button>
                  </div>
                </div>
                <Button className="bg-neutral-700 hover:bg-neutral-600 text-white text-sm px-4 py-2">
                  Become team admin
                </Button>
              </div>

              {/* Organization */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Organization
                </label>
                <div className="text-base text-white">My workspace</div>
              </div>

              {/* Team name */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Team name
                </label>
                <Input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type / for menu"
                  className="w-full h-32 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder:text-neutral-500 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Team status */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Team status
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEndorsed}
                    onChange={(e) => setIsEndorsed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-neutral-600 bg-neutral-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white">Endorsed</span>
                      <span className="text-green-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1">
                      Endorsed teams are recommended by admins in your organization.{' '}
                      <button className="text-blue-400 hover:text-blue-300 underline">
                        Learn more
                      </button>
                    </p>
                  </div>
                </label>
              </div>

              {/* Team privacy */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  Team privacy
                </label>
                <div className="space-y-3">
                  {/* Membership by request */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={privacy === 'request'}
                      onChange={() => setPrivacy('request')}
                      className="mt-1 w-4 h-4 border-neutral-600 bg-neutral-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-white">Membership by request</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        A member has to request to join this team
                      </p>
                    </div>
                  </label>

                  {/* Private */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={privacy === 'private'}
                      onChange={() => setPrivacy('private')}
                      className="mt-1 w-4 h-4 border-neutral-600 bg-neutral-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-sm text-white">Private</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        A member must be invited to join this team
                      </p>
                    </div>
                  </label>

                  {/* Public to organization */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="privacy"
                      checked={privacy === 'public'}
                      onChange={() => setPrivacy('public')}
                      className="mt-1 w-4 h-4 border-neutral-600 bg-neutral-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-white">Public to organization</span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        Any member can join this team
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="text-center py-12 text-neutral-400">
              <p>Members management coming soon...</p>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="text-center py-12 text-neutral-400">
              <p>Advanced settings coming soon...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
