import { Home, CheckSquare, Inbox, FileText, FolderKanban, Target, Users, ChevronRight, Plus, Mail, ChevronDown, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProjectStore } from "@/store/project.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Button } from "./ui/button";
import { useState } from "react";
import CreateProjectDialog from "./CreateProjectDialog";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects } = useProjectStore();
  const { currentWorkspace } = useWorkspaceStore();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

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
    <>
      <aside className="w-60 bg-neutral-900 border-r border-neutral-800 flex flex-col h-screen fixed left-0 top-0 z-20">
        {/* Hamburger menu */}
        <div className="p-4 border-b border-neutral-800">
          <button className="p-2 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Create button */}
        <div className="p-4">
          <Button
            onClick={() => setIsCreateProjectOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md px-4 py-2 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create</span>
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {/* Main Navigation */}
          <div className="mb-6">
            {navigationItems.map((item) => (
              <button
                key={item.title}
                onClick={() => navigate(item.url)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full ${
                  isActive(item.url)
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          {/* Insights Section */}
          <div className="mb-6">
            <button className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm font-medium text-neutral-400 hover:text-white">
              <ChevronDown className="w-3 h-3" />
              <span>Insights</span>
            </button>
            <div className="ml-2">
              {insightsItems.map((item) => (
                <button
                  key={item.title}
                  onClick={() => navigate(item.url)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors w-full"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <button className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm font-medium text-neutral-400 hover:text-white">
              <ChevronDown className="w-3 h-3" />
              <span>Projects</span>
            </button>
            <div className="ml-2">
              {projects && projects.length > 0 ? (
                projects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors w-full"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color || '#06b6d4' }}
                    />
                    <span className="truncate">{project.name}</span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-2 text-xs text-neutral-500">No projects yet</p>
              )}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-6">
            <button className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm font-medium text-neutral-400 hover:text-white">
              <ChevronRight className="w-3 h-3" />
              <span>Team</span>
            </button>
            <div className="ml-2">
              <button
                onClick={() => navigate("/workspace")}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors w-full"
              >
                <Users className="w-4 h-4" />
                <span>{currentWorkspace?.name || "My workspace"}</span>
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
          <button className="w-full flex items-center gap-2 px-2 py-1 text-xs text-neutral-400 hover:text-white transition-colors">
            <Mail className="w-3 h-3" />
            <span>Invite teammates</span>
          </button>
        </div>
      </aside>

      <CreateProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />
    </>
  );
}
