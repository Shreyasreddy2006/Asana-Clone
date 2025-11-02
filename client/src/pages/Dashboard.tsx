import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '@/store/workspace.store';
import { useProjectStore } from '@/store/project.store';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, List, LayoutGrid, Clock, Calendar, LogOut } from 'lucide-react';
import CreateProjectDialog from '@/components/CreateProjectDialog';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { workspaces, currentWorkspace, fetchWorkspaces, setCurrentWorkspace } = useWorkspaceStore();
  const { projects, fetchProjects } = useProjectStore();
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchWorkspaces();
    };
    loadData();
  }, [fetchWorkspaces]);

  useEffect(() => {
    // Set the first workspace as current if none is selected
    if (workspaces && workspaces.length > 0 && !currentWorkspace) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchProjects(currentWorkspace._id);
    }
  }, [currentWorkspace, fetchProjects]);

  const getViewIcon = (view: string) => {
    switch (view) {
      case 'board': return <LayoutGrid className="h-4 w-4" />;
      case 'timeline': return <Clock className="h-4 w-4" />;
      case 'calendar': return <Calendar className="h-4 w-4" />;
      default: return <List className="h-4 w-4" />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {currentWorkspace?.name || 'No workspace selected'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsCreateProjectOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!workspaces || workspaces.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Create your first workspace to start organizing your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                It looks like you haven't created a workspace yet. Complete the onboarding to get started!
              </p>
              <Button onClick={() => navigate('/onboarding')}>
                <Plus className="h-4 w-4 mr-2" />
                Complete Onboarding
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!projects || projects.length === 0 ? (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Projects Yet</CardTitle>
                  <CardDescription>
                    Create your first project to start tracking tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setIsCreateProjectOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <Card
                  key={project._id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/projects/${project._id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded flex items-center justify-center"
                          style={{ backgroundColor: project.color }}
                        >
                          <span className="text-white text-sm">{project.icon || '📁'}</span>
                        </div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                      </div>
                    </div>
                    <CardDescription>{project.description || 'No description'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        {getViewIcon(project.view)}
                        <span className="capitalize">{project.view} view</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
                        {project.status}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={isCreateProjectOpen}
        onOpenChange={setIsCreateProjectOpen}
      />
    </div>
  );
}
