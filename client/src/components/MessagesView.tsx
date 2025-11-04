import { useState, useRef } from 'react';
import { Project } from '@/services/project.service';
import { Send, Smile, Paperclip, Mail, User, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessagesViewProps {
  project: Project;
  /** When false, hide the top header/info panel used when MessagesView is shown as a standalone project page. Default: true */
  showHeader?: boolean;
}

const EMOJI_CATEGORIES = {
  recently_used: ['😊', '👍', '❤️', '🎉', '🚀'],
  smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '☺️', '😌', '😍', '🥰', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😌', '🤨', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😬', '🤐', '😌', '😑', '😐', '😶', '😏', '😒', '😤', '😠', '😠', '😡', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾'],
  gestures: ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👍', '👎', '👊', '👏', '🙌', '👐', '🤲', '🤝', '🤜', '🤛', '🦾', '🦿', '👁️‍🗨️'],
  symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '👋', '👌', '👍', '✌️', '☮️', '☯️', '✡️', '☪️', '🕉️', '☸️', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲'],
  nature: ['🌍', '🌎', '🌏', '💧', '💦', '☔', '⛅', '🌤️', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '💨', '💥', '✨', '⚡', '☄️', '💫', '🌟', '⭐', '✨'],
  food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🧁', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🍯', '🥛', '🍼', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃'],
};

export default function MessagesView({ project }: MessagesViewProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages] = useState([
    {
      id: '1',
      sender: 'John Doe',
      content: 'Hey team, great progress on the project so far!',
      timestamp: new Date(Date.now() - 3600000),
      avatar: 'JD',
    },
    {
      id: '2',
      sender: 'Jane Smith',
      content: 'Thanks! I just completed the design mockups. Check them out in the Files section.',
      timestamp: new Date(Date.now() - 1800000),
      avatar: 'JS',
    },
  ]);

  const projectEmail = `project-${project._id?.slice(0, 8)}@asana-clone.com`;

  const handleSendMessage = () => {
    if (!message.trim()) return;

    toast.success('Message sent!');
    setMessage('');
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachedFiles(Array.from(files));
      toast.success(`${files.length} file(s) attached`);
    }
  };

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header Info (optional) */}
      {showHeader && (
        <div className="mb-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-white mb-1">
                Connect your words to your work
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed mb-3">
                Discuss this project with your team. Messages are visible to all project members.
              </p>
              <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-md p-3">
                <div className="text-xs text-neutral-400 mb-1">Send emails to:</div>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-blue-400 font-mono">{projectEmail}</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(projectEmail);
                      toast.success('Email copied to clipboard!');
                    }}
                    className="text-xs text-neutral-500 hover:text-white transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Thread */}
      <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                  {msg.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{msg.sender}</span>
                    <span className="text-xs text-neutral-500">
                      {format(msg.timestamp, 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-300 leading-relaxed">{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-neutral-600" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">No messages yet</h3>
              <p className="text-sm text-neutral-500 text-center max-w-md">
                Start a conversation with your team about this project
              </p>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-neutral-800 p-4 space-y-3">
          {attachedFiles.length > 0 && (
            <div className="bg-neutral-800/50 border border-neutral-700 rounded-lg p-3 space-y-2">
              <div className="text-xs text-neutral-400 font-medium">Attached files ({attachedFiles.length})</div>
              <div className="space-y-1">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-neutral-800 p-2 rounded text-xs text-neutral-300">
                    <span className="truncate">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send message to members..."
              className="w-full bg-transparent text-neutral-200 text-sm placeholder-neutral-500 outline-none border-none p-3 resize-none"
              rows={3}
            />
            <div className="flex items-center justify-between px-3 py-2 border-t border-neutral-700">
              <div className="flex items-center gap-2">
                <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                  <PopoverTrigger asChild>
                    <button
                      className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                    >
                      <Smile className="w-4 h-4" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-3 bg-neutral-800 border-neutral-700">
                    <div className="space-y-2">
                      <div className="grid grid-cols-7 gap-2">
                        {EMOJI_CATEGORIES.recently_used.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => handleEmojiSelect(emoji)}
                            className="p-2 hover:bg-neutral-700 rounded text-lg transition-colors"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-neutral-700 pt-2">
                        <div className="text-xs text-neutral-400 mb-2">Smileys</div>
                        <div className="grid grid-cols-7 gap-2 max-h-40 overflow-y-auto">
                          {EMOJI_CATEGORIES.smileys.slice(0, 28).map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleEmojiSelect(emoji)}
                              className="p-1 hover:bg-neutral-700 rounded text-sm transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-neutral-500 hover:text-white hover:bg-neutral-700 rounded transition-colors"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() && attachedFiles.length === 0}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Project members</h3>
        <div className="flex items-center gap-2">
          {project.members && project.members.length > 0 ? (
            <>
              {project.members.slice(0, 5).map((member, index) => {
                // ProjectMember.user is typed as string in the service type; guard and coerce to any when needed
                const rawUser = (member as any).user;
                const memberUser = rawUser && typeof rawUser === 'object' ? (rawUser as any) : null;
                const memberName = memberUser && memberUser.name ? memberUser.name : 'Unknown';
                const initials = memberName
                  ?.split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'U';

                return (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-semibold text-white"
                    title={memberName}
                  >
                    {initials}
                  </div>
                );
              })}
              {project.members.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-400">
                  +{project.members.length - 5}
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-neutral-500">No members yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
