import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useWorkspaceStore } from '@/store/workspace.store';

interface InviteTeammatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InviteTeammatesDialog({ open, onOpenChange }: InviteTeammatesDialogProps) {
  const { currentWorkspace } = useWorkspaceStore();
  const [emails, setEmails] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInvite = async () => {
    const validEmails = emails.filter(e => e.trim());

    if (validEmails.length === 0) {
      toast.error('Please enter at least one email');
      return;
    }

    const allValid = validEmails.every(isValidEmail);
    if (!allValid) {
      toast.error('Please enter valid email addresses');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/workspaces/${currentWorkspace?._id}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ emails: validEmails }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Invitations sent to ${validEmails.length} teammate${validEmails.length > 1 ? 's' : ''}`);
        setEmails(['']);
        onOpenChange(false);
      } else {
        toast.error(data.message || 'Failed to send invitations');
      }
    } catch (error) {
      toast.error('Failed to send invitations');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-neutral-900 border-neutral-700 text-white p-0 gap-0 z-[100]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4">
          <h2 className="text-xl font-semibold">Invite teammates</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 hover:bg-neutral-800 rounded"
          >
            <X className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-300">
            Enter email addresses to invite teammates to {currentWorkspace?.name || 'your workspace'}
          </p>

          <div className="space-y-3">
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="teammate@example.com"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                />
                {emails.length > 1 && (
                  <button
                    onClick={() => handleRemoveEmail(index)}
                    className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleAddEmail}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add another email
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 px-6 py-4 flex gap-2 justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded text-sm text-neutral-300 hover:bg-neutral-800 transition-colors"
          >
            Cancel
          </button>
          <Button
            onClick={handleInvite}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
          >
            {isLoading ? 'Sending...' : 'Send invitations'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
