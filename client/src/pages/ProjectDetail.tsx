import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/project.store';
import { useTaskStore } from '@/store/task.store';
import { useAuthStore } from '@/store/auth.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Plus,
  List,
  LayoutGrid,
  Calendar as CalendarIcon,
  Clock,
  ChevronDown,
  MoreHorizontal,
  Check,
  Circle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, fetchProjects, setCurrentProject, currentProject } = useProjectStore();
  const { tasks, fetchTasks } = useTaskStore();
  const [selectedView, setSelectedView] = useState<'list' | 'board' | 'timeline' | 'calendar'>('list');

  useEffect(() => {
    if (projectId) {
      // Fetch project details
      const project = projects.find(p => p._id === projectId);
      if (project) {
        setCurrentProject(project);
        setSelectedView(project.view as any);
        fetchTasks({ project: projectId });
      }
    }
  }, [projectId, projects, setCurrentProject, fetchTasks]);

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Group tasks by section
  const tasksBySection = currentProject.sections?.reduce((acc, section) => {
    acc[section.name] = tasks.filter(task => task.section?.toString() === section._id?.toString());
    return acc;
  }, {} as Record<string, any[]>) || {};

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded flex items-center justify-center"
                style={{ backgroundColor: currentProject.color }}
              >
                <span className="text-white text-xl">{currentProject.icon}</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentProject.name}</h1>
                <p className="text-sm text-gray-500">{currentProject.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex items-center gap-6 border-b -mb-4">
            <button
              onClick={() => setSelectedView('list')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                selectedView === 'list'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setSelectedView('board')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                selectedView === 'board'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              Board
            </button>
            <button
              onClick={() => setSelectedView('timeline')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                selectedView === 'timeline'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="h-4 w-4" />
              Timeline
            </button>
            <button
              onClick={() => setSelectedView('calendar')}
              className={`flex items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                selectedView === 'calendar'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedView === 'list' && (
          <div className="space-y-6">
            {currentProject.sections?.map((section) => (
              <div key={section._id || section.name} className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                      <h2 className="text-lg font-semibold">{section.name}</h2>
                      <span className="text-sm text-gray-500">
                        ({tasksBySection[section.name]?.length || 0})
                      </span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add task
                    </Button>
                  </div>
                </div>

                <div className="divide-y">
                  {tasksBySection[section.name]?.length > 0 ? (
                    tasksBySection[section.name].map((task) => (
                      <div
                        key={task._id}
                        className="px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <button className="mt-1 text-gray-400 hover:text-gray-600">
                            {getStatusIcon(task.status)}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900">
                              {task.title}
                            </h3>
                            {task.description && (
                              <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              {task.priority && (
                                <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              )}
                              {task.dueDate && (
                                <span className="text-xs text-gray-500">
                                  Due {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                              {task.assignee && (
                                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-700">
                                  {task.assignee.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-gray-500">
                      <p className="text-sm">No tasks in this section</p>
                      <Button variant="ghost" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" />
                        Add a task
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedView === 'board' && (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {currentProject.sections?.map((section) => (
              <div
                key={section._id || section.name}
                className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">{section.name}</h2>
                  <span className="text-sm text-gray-500">
                    {tasksBySection[section.name]?.length || 0}
                  </span>
                </div>

                <div className="space-y-3">
                  {tasksBySection[section.name]?.map((task) => (
                    <Card key={task._id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-2 mb-2">
                          <button className="text-gray-400 hover:text-gray-600">
                            {getStatusIcon(task.status)}
                          </button>
                          <h3 className="text-sm font-medium flex-1">{task.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {task.priority && (
                            <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                          )}
                          {task.dueDate && (
                            <span className="text-xs text-gray-500">
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full">
                    <Plus className="h-4 w-4 mr-1" />
                    Add task
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {(selectedView === 'timeline' || selectedView === 'calendar') && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">
              {selectedView === 'timeline' ? 'Timeline' : 'Calendar'} View
            </h3>
            <p className="text-gray-500 mb-4">
              This view will display tasks on a {selectedView === 'timeline' ? 'timeline/Gantt chart' : 'calendar'}.
            </p>
            <p className="text-sm text-gray-400">Coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
}
