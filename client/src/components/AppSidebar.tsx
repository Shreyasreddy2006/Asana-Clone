import { Home, CheckSquare, Inbox, FileText, FolderKanban, Target, Users, ChevronRight, Plus, Mail, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProjectStore } from "@/store/project.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useUIStore } from "@/store/ui.store";
import { useEffect, useState } from "react";
import InviteTeammatesDialog from "./InviteTeammatesDialog";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects, fetchProjects } = useProjectStore();
  const { currentWorkspace } = useWorkspaceStore();
  const { sidebarCollapsed } = useUIStore();
  const [inviteOpen, setInviteOpen] = useState(false);

  // Fetch projects when workspace changes
  useEffect(() => {
    if (currentWorkspace?._id) {
      fetchProjects(currentWorkspace._id);
    }
  }, [currentWorkspace?._id, fetchProjects]);

  const navigationItems = [
    { title: "Home", icon: Home, url: "/dashboard" },
    { title: "My tasks", icon: CheckSquare, url: "/my-tasks" },
    { title: "Inbox", icon: Inbox, url: "/inbox" },
  ];

  const insightsItems = [
    { title: "Reporting", icon: FileText, url: "/reporting" },
    { title: "Portfolios", icon: FolderKanban, url: "/portfolios" },
    { title: "Goals", icon: Target, url: "/goals" },
  ];

  const isActive = (url: string) => location.pathname === url;

  return (
    <aside className={`${sidebarCollapsed ? 'hidden' : 'w-60'} bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300`}>
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        {/* Main Navigation */}
        <div className="space-y-0.5 mb-4">
            {navigationItems.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.url)}
                className={`flex items-center gap-3 px-2 py-1.5 rounded text-sm transition-colors w-full text-left ${
                  isActive(item.url)
                    ? "bg-neutral-800 text-white font-normal"
                    : "text-neutral-300 hover:bg-neutral-800/50 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          {/* Insights Section */}
          <div className="mb-4">
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-500 uppercase tracking-wide">
              <Plus className="w-3 h-3" />
              <span>Insights</span>
            </div>
            <div className="space-y-0.5">
              {insightsItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.url)}
                  className="flex items-center gap-3 px-2 py-1.5 rounded text-sm text-neutral-300 hover:bg-neutral-800/50 hover:text-white transition-colors w-full text-left"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-4">
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-500 uppercase tracking-wide">
              <Plus className="w-3 h-3" />
              <span>Projects</span>
            </div>
            <div className="space-y-0.5">
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="flex items-center gap-3 px-2 py-1.5 rounded text-sm text-neutral-300 hover:bg-neutral-800/50 hover:text-white transition-colors w-full text-left"
                  >
                    <div
                      className="w-2 h-2 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: project.color || '#06b6d4' }}
                    />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))
              ) : (
                <p className="px-2 py-1.5 text-xs text-neutral-500">No projects yet</p>
              )}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-4">
            <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-500 uppercase tracking-wide">
              <Plus className="w-3 h-3" />
              <span>Team</span>
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => navigate("/workspace")}
                className="flex items-center gap-3 px-2 py-1.5 rounded text-sm text-neutral-300 hover:bg-neutral-800/50 hover:text-white transition-colors w-full text-left"
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{currentWorkspace?.name || "My workspace"}</span>
                <ChevronRight className="w-3 h-3 ml-auto text-neutral-500" />
              </button>
            </div>
          </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-neutral-800 p-4 space-y-3">
        {/* Trial Info */}
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
            <div className="w-3 h-3 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-400">Advanced free trial</p>
            <p className="text-xs text-neutral-500">14 days left</p>
          </div>
        </div>

        {/* Add Billing Info Button */}
        <button className="w-full bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-md px-3 py-2 text-sm font-medium transition-colors">
          Add billing info
        </button>

        {/* Credits Info */}
        <button className="w-full flex items-center justify-between px-2 py-1 text-xs text-neutral-400 hover:text-white transition-colors">
          <span>7BK / 75K AI credits left</span>
          <ChevronRight className="w-3 h-3" />
        </button>

        {/* Invite Teammates */}
        <button
          onClick={() => setInviteOpen(true)}
          className="w-full flex items-center gap-2 px-2 py-1 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <Mail className="w-3 h-3" />
          <span>Invite teammates</span>
        </button>
      </div>

      <InviteTeammatesDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </aside>
  );
}
