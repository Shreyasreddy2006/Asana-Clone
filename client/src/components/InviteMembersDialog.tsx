import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

interface InviteMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteMembersDialog({ open, onOpenChange }: InviteMembersDialogProps) {
  const [emailAddresses, setEmailAddresses] = useState('');
  const [selectedProjects] = useState(['hkmn']);

  const handleSend = () => {
    // Handle sending invitations here
    console.log('Sending invitations to:', emailAddresses);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-[#1f1f1f] border-neutral-700 text-white p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
          <h2 className="text-xl font-semibold">Invite people to My workspace</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-neutral-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Email addresses */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email addresses
            </label>
            <textarea
              value={emailAddresses}
              onChange={(e) => setEmailAddresses(e.target.value)}
              placeholder="name@gmail.com, name@gmail.com, ..."
              className="w-full h-24 bg-[#2a2a2a] border border-neutral-700 rounded px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 resize-none"
            />
          </div>

          {/* Add to projects */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="block text-sm font-medium text-white">
                Add to projects
              </label>
              <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#2a2a2a] border border-neutral-700 rounded">
              {selectedProjects.map((project) => (
                <div key={project} className="flex items-center gap-2 px-2 py-1 bg-teal-600 rounded text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                    <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
                  </svg>
                  <span>{project}</span>
                  <button className="hover:bg-teal-700 rounded p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-700">
          <Button
            onClick={handleSend}
            disabled={!emailAddresses.trim()}
            className="bg-neutral-600 hover:bg-neutral-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
