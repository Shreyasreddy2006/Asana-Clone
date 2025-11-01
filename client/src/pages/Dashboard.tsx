import { useEffect } from 'react';
import { useWorkspaceStore } from '@/store/workspace.store';
import { useProjectStore } from '@/store/project.store';
import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { workspaces, currentWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (currentWorkspace) {
      fetchProjects(currentWorkspace._id);
    }
  }, [currentWorkspace, fetchProjects]);

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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {workspaces.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Create your first workspace to start organizing your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Workspace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length === 0 ? (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No Projects Yet</CardTitle>
                  <CardDescription>
                    Create your first project to start tracking tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </CardContent>
              </Card>
            ) : (
              projects.map((project) => (
                <Card key={project._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    </div>
                    <CardDescription>{project.description || 'No description'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span className="capitalize">{project.view} view</span>
                      <span className="capitalize">{project.status}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
