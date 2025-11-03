import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateGoalDialog({ open, onOpenChange }: CreateGoalDialogProps) {
  const [goalTitle, setGoalTitle] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [timePeriod, setTimePeriod] = useState('Q4 FY25  Oct 1 – Dec 31');
  const [privacy, setPrivacy] = useState('Public');

  const handleSaveGoal = () => {
    // Handle save goal logic here
    console.log('Saving goal:', { goalTitle, timePeriod, privacy });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#2a2a2a] border-neutral-700 text-white p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
          <h2 className="text-xl font-semibold">Create a new goal</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-neutral-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Goal title */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Goal title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-neutral-700 rounded px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
              placeholder=""
            />
          </div>

          {/* Goal owner */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Goal owner
            </label>
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1a1a1a] border border-neutral-700 rounded">
              <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold text-neutral-900">
                AY
              </div>
              <span className="text-white">Aman Yadav</span>
              <button className="ml-auto p-1 hover:bg-neutral-700 rounded">
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
          </div>

          {/* Members */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Members{' '}
              <svg className="inline w-4 h-4 text-neutral-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </label>
            <input
              type="text"
              value={memberInput}
              onChange={(e) => setMemberInput(e.target.value)}
              placeholder="Name or email"
              className="w-full bg-[#1a1a1a] border border-neutral-700 rounded px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
            />
          </div>

          {/* Time period and Privacy */}
          <div className="grid grid-cols-2 gap-4">
            {/* Time period */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Time period{' '}
                <svg className="inline w-4 h-4 text-neutral-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-600"
              >
                <option value="Q4 FY25  Oct 1 – Dec 31">Q4 FY25  Oct 1 – Dec 31</option>
                <option value="Q1 FY26  Jan 1 – Mar 31">Q1 FY26  Jan 1 – Mar 31</option>
                <option value="Q2 FY26  Apr 1 – Jun 30">Q2 FY26  Apr 1 – Jun 30</option>
                <option value="Q3 FY26  Jul 1 – Sep 30">Q3 FY26  Jul 1 – Sep 30</option>
              </select>
            </div>

            {/* Privacy */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Privacy
              </label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-neutral-700 rounded px-3 py-2 text-white focus:outline-none focus:border-neutral-600"
              >
                <option value="Public">🌐 Public</option>
                <option value="Private">🔒 Private</option>
                <option value="Team">👥 Team</option>
              </select>
            </div>
          </div>

          {/* Asana tip */}
          <div className="flex items-start gap-2 p-3 bg-[#1a1a1a] border border-neutral-700 rounded">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-xs text-neutral-300">
              <span className="font-semibold">Asana tip:</span> You can edit these details and progress settings after creating this goal
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-700">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-transparent hover:bg-neutral-700 text-white border border-neutral-600"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveGoal}
            disabled={!goalTitle}
            className="bg-neutral-700 hover:bg-neutral-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save goal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
