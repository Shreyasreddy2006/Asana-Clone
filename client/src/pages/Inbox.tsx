import { useState, useRef, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { X, ChevronDown, MoreHorizontal, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notificationService, Notification as ApiNotification } from '@/services/notification.service';
import { formatDistanceToNow } from 'date-fns';
import { useUIStore } from '@/store/ui.store';

interface Notification {
  id: string;
  type: 'alert' | 'assignment' | 'message';
  title: string;
  sender?: string;
  senderAvatar?: string;
  message?: string;
  timestamp: string;
  isRead: boolean;
  isDueSoon?: boolean;
}

type TabType = 'activity' | 'bookmarks' | 'archive';

interface CustomTab {
  id: string;
  name: string;
}

export default function Inbox() {
  const sidebarCollapsed = useUIStore((state) => state.sidebarCollapsed);
  const [showSummary, setShowSummary] = useState(true);
  const [timeframe, setTimeframe] = useState('Past week');
  const [activeTab, setActiveTab] = useState<string>('activity');
  const [showTabDropdown, setShowTabDropdown] = useState(false);
  const [customTabs, setCustomTabs] = useState<CustomTab[]>([]);
  const [contextMenu, setContextMenu] = useState<{ tabId: string; x: number; y: number } | null>(null);
  const [renamingTabId, setRenamingTabId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // API state
  const [apiNotifications, setApiNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleCreateCustomTab = () => {
    const newTab: CustomTab = {
      id: `custom-${Date.now()}`,
      name: 'New tab',
    };
    setCustomTabs([...customTabs, newTab]);
    setActiveTab(newTab.id);
    setShowTabDropdown(false);
  };

  const handleRightClick = (e: React.MouseEvent, tabId: string, isDefaultTab = false) => {
    e.preventDefault();
    setContextMenu({ tabId, x: e.clientX, y: e.clientY });
  };

  const isDefaultTab = (tabId: string) => {
    return ['activity', 'bookmarks', 'archive'].includes(tabId);
  };

  const handleRemoveTab = (tabId: string) => {
    setCustomTabs(customTabs.filter((tab) => tab.id !== tabId));
    if (activeTab === tabId) {
      setActiveTab('activity');
    }
    setContextMenu(null);
  };

  const handleRenameStart = (tabId: string) => {
    const tab = customTabs.find((t) => t.id === tabId);
    if (tab) {
      setRenamingTabId(tabId);
      setRenameValue(tab.name);
      setContextMenu(null);
    }
  };

  const handleRenameComplete = (tabId: string) => {
    if (renameValue.trim()) {
      setCustomTabs(
        customTabs.map((tab) =>
          tab.id === tabId ? { ...tab, name: renameValue.trim() } : tab
        )
      );
    }
    setRenamingTabId(null);
    setRenameValue('');
  };

  const handleRenameCancel = () => {
    setRenamingTabId(null);
    setRenameValue('');
  };

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await notificationService.getAll({ limit: 50 });
        setApiNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setApiNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true, readAt: new Date().toISOString() } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Archive all notifications
  const handleArchiveAll = async () => {
    try {
      await notificationService.markAllAsRead();
      setApiNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to archive all notifications:', error);
    }
  };

  // Convert API notification type to UI type
  const getNotificationType = (type: ApiNotification['type']): 'alert' | 'assignment' | 'message' => {
    if (type === 'task_due_soon' || type === 'task_overdue' || type === 'workspace_invite' || type === 'project_invite') {
      return 'alert';
    }
    if (type === 'task_assigned') {
      return 'assignment';
    }
    return 'message';
  };

  // Format timestamp
  const formatTimestamp = (date: string): string => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  // Transform API notifications to UI notifications
  const transformedNotifications: Notification[] = apiNotifications.map((apiNotif) => ({
    id: apiNotif._id,
    type: getNotificationType(apiNotif.type),
    title: apiNotif.title,
    sender: apiNotif.sender?.name,
    senderAvatar: apiNotif.sender?.avatar || apiNotif.sender?.name?.charAt(0).toUpperCase(),
    message: apiNotif.message,
    timestamp: formatTimestamp(apiNotif.createdAt),
    isRead: apiNotif.read,
    isDueSoon: apiNotif.type === 'task_due_soon',
  }));

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTabDropdown(false);
      }
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Use transformed notifications from API, fallback to empty array
  const todayNotifications = transformedNotifications;

  return (<>
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className={`flex-1 ${sidebarCollapsed ? 'ml-16' : 'ml-60'} transition-all duration-300`}>
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold">Inbox</h1>
              <div className="flex items-center gap-2">
                <button className="text-sm text-neutral-400 hover:text-white px-3 py-1 rounded hover:bg-neutral-800">
                  Manage notifications
                </button>
                <button className="p-2 hover:bg-neutral-800 rounded">
                  <MoreHorizontal className="w-5 h-5 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 text-sm">
              <button
                onClick={() => setActiveTab('activity')}
                onContextMenu={(e) => handleRightClick(e, 'activity')}
                className={`pb-3 ${
                  activeTab === 'activity'
                    ? 'border-b-2 border-white font-medium text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Activity
              </button>
              <button
                onClick={() => setActiveTab('bookmarks')}
                onContextMenu={(e) => handleRightClick(e, 'bookmarks')}
                className={`pb-3 ${
                  activeTab === 'bookmarks'
                    ? 'border-b-2 border-white font-medium text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Bookmarks
              </button>
              <button
                onClick={() => setActiveTab('archive')}
                onContextMenu={(e) => handleRightClick(e, 'archive')}
                className={`pb-3 ${
                  activeTab === 'archive'
                    ? 'border-b-2 border-white font-medium text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Archive
              </button>

              {/* Custom Tabs */}
              {customTabs.map((tab) => (
                <div key={tab.id} className="relative">
                  {renamingTabId === tab.id ? (
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameComplete(tab.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameComplete(tab.id);
                        } else if (e.key === 'Escape') {
                          handleRenameCancel();
                        }
                      }}
                      autoFocus
                      className="pb-3 px-2 bg-neutral-800 text-white border border-neutral-600 rounded text-sm outline-none focus:border-blue-500"
                    />
                  ) : (
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      onContextMenu={(e) => handleRightClick(e, tab.id)}
                      className={`pb-3 ${
                        activeTab === tab.id
                          ? 'border-b-2 border-white font-medium text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tab.name}
                    </button>
                  )}
                </div>
              ))}

              {/* Add Tab Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowTabDropdown(!showTabDropdown)}
                  className="text-neutral-400 hover:text-white pb-3"
                >
                  +
                </button>
                {showTabDropdown && (
                  <div className="absolute top-full left-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
                    <button
                      onClick={handleCreateCustomTab}
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-700 transition-colors"
                    >
                      Create a custom tab
                    </button>
                    <div className="border-t border-neutral-700 my-1"></div>
                    <button className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors">
                      Send feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filter and Sort */}
          <div className="border-b border-neutral-800 px-8 py-3 flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
              <span>⚙</span>
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
              <span>↕</span>
              <span>Sort: Newest</span>
            </button>
            <button className="p-1 hover:bg-neutral-800 rounded">
              <MoreHorizontal className="w-4 h-4 text-neutral-400" />
            </button>
          </div>

          {/* Content */}
          <div className="max-w-5xl mx-auto px-8 py-6">
            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <>
                {/* Inbox Summary */}
                {showSummary && (
                  <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6 relative">
                    <button
                      onClick={() => setShowSummary(false)}
                      className="absolute top-4 right-4 p-1 hover:bg-neutral-800 rounded"
                    >
                      <X className="w-4 h-4 text-neutral-400" />
                    </button>

                    <div className="flex items-start gap-3 mb-4">
                      <span className="text-xl">✨</span>
                      <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-2">Inbox Summary</h2>
                        <p className="text-sm text-neutral-400 mb-4">
                          Summarize your most important and actionable notifications with Asana AI.
                        </p>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-400">Timeframe:</span>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded text-sm">
                              {timeframe}
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>
                          <Button className="bg-white text-neutral-900 hover:bg-neutral-100 font-medium">
                            View summary
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center items-center py-20">
                    <div className="text-neutral-400">Loading notifications...</div>
                  </div>
                )}

                {/* Empty State */}
                {!loading && todayNotifications.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="mb-8">
                      <Bell className="w-32 h-32 text-pink-200" fill="#fce7f3" strokeWidth={1} />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No notifications yet</h2>
                    <p className="text-sm text-neutral-400">
                      You're all caught up! New notifications will appear here.
                    </p>
                  </div>
                )}

                {/* Today Section */}
                {!loading && todayNotifications.length > 0 && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-neutral-400 mb-4">Today</h3>

                      <div className="space-y-2">
                        {todayNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                            className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:bg-neutral-800/50 cursor-pointer transition-colors relative"
                          >
                            {!notification.isRead && (
                              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                            )}

                            <div className="flex items-start gap-4 ml-4">
                              {/* Avatar/Icon */}
                              {notification.type === 'alert' ? (
                                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg">⚠</span>
                                </div>
                              ) : notification.type === 'assignment' ? (
                                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg">{notification.senderAvatar}</span>
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                  <span className="text-lg">{notification.senderAvatar}</span>
                                </div>
                              )}

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-2">
                                    {notification.type === 'alert' && (
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-neutral-600 bg-neutral-800"
                                      />
                                    )}
                                    <h4 className="text-sm font-medium">{notification.title}</h4>
                                  </div>
                                  {notification.isDueSoon && (
                                    <span className="text-xs text-red-400 whitespace-nowrap">
                                      Due soon
                                    </span>
                                  )}
                                </div>

                                {notification.sender && !notification.message && (
                                  <p className="text-xs text-neutral-400 mb-1">
                                    {notification.sender} · {notification.timestamp}
                                  </p>
                                )}

                                {notification.message && (
                                  <>
                                    <p className="text-sm text-neutral-400 mb-2">
                                      {notification.sender} · {notification.timestamp}
                                    </p>
                                    <p className="text-sm text-neutral-300">
                                      {notification.message}
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  {/* Archive Link */}
                  <div className="text-center pt-8">
                    <button
                      onClick={handleArchiveAll}
                      className="text-sm text-blue-400 hover:text-blue-300"
                    >
                      Archive all notifications
                    </button>
                  </div>
                </>
              )}
              </>
            )}

            {/* Bookmarks Tab */}
            {activeTab === 'bookmarks' && (
              <div className="flex flex-col items-center justify-center py-20">
                {/* Bell Illustration */}
                <div className="relative mb-8">
                  <div className="relative">
                    <Bell className="w-32 h-32 text-pink-200" fill="#fce7f3" strokeWidth={1} />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full" />
                  </div>
                  {/* Bell animation lines */}
                  <div className="absolute -left-6 top-8 text-neutral-500 text-xl">|||</div>
                  <div className="absolute -right-6 bottom-12 text-neutral-500 text-xl">|||</div>
                </div>

                {/* Text */}
                <h2 className="text-xl font-semibold mb-2">Bookmark important notifications</h2>
                <p className="text-sm text-neutral-400 mb-6">Bookmark a notification to see it here.</p>

                {/* Try it Button */}
                <Button
                  onClick={() => setActiveTab('activity')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  Try it
                </Button>
              </div>
            )}

            {/* Archive Tab */}
            {activeTab === 'archive' && (
              <div className="flex flex-col items-center justify-center py-20">
                {/* Archive Box Icon */}
                <div className="mb-8">
                  <div className="w-32 h-32 flex items-center justify-center">
                    <div className="text-8xl">📦</div>
                  </div>
                </div>

                {/* Text */}
                <h2 className="text-xl font-semibold mb-2">No archived notifications</h2>
                <p className="text-sm text-neutral-400 mb-6">Archived notifications will appear here.</p>

                {/* Back to Activity Button */}
                <Button
                  onClick={() => setActiveTab('activity')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  Back to Activity
                </Button>
              </div>
            )}

            {/* Custom Tabs */}
            {customTabs.map((tab) =>
              activeTab === tab.id && (
                <div key={tab.id} className="flex flex-col items-center justify-center py-20">
                  {/* Empty Icon */}
                  <div className="mb-8">
                    <div className="w-32 h-32 flex items-center justify-center">
                      <div className="text-8xl">📋</div>
                    </div>
                  </div>

                  {/* Text */}
                  <h2 className="text-xl font-semibold mb-2">You haven't archived any notifications yet.</h2>
                  <p className="text-sm text-neutral-400 mb-6">
                    Click the archive icon in the top right of a notification to archive it.
                  </p>

                  {/* Back to Activity Button */}
                  <Button
                    onClick={() => setActiveTab('activity')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                  >
                    Back to Activity
                  </Button>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="fixed bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg py-2 min-w-[180px] z-50"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          {isDefaultTab(contextMenu.tabId) ? (
            // Context menu for default tabs (Activity, Bookmarks, Archive)
            <>
              <button
                onClick={() => setContextMenu(null)}
                className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
              >
                Set as default
              </button>
              <button
                disabled
                className="w-full text-left px-4 py-2 text-sm text-neutral-600 cursor-not-allowed"
              >
                Remove
              </button>
            </>
          ) : (
            // Context menu for custom tabs
            <>
              <button
                onClick={() => handleRenameStart(contextMenu.tabId)}
                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-700 transition-colors"
              >
                Rename
              </button>
              <button
                onClick={() => setContextMenu(null)}
                className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
              >
                Set as default
              </button>
              <button
                onClick={() => setContextMenu(null)}
                className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:bg-neutral-700 hover:text-white transition-colors"
              >
                Make a copy
              </button>
              <div className="border-t border-neutral-700 my-1"></div>
              <button
                onClick={() => handleRemoveTab(contextMenu.tabId)}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 transition-colors"
              >
                Remove
              </button>
            </>
          )}
        </div>
      )}
    </div>
   </>);
}
