import { useState } from 'react';
import { Project, projectService } from '@/services/project.service';
import { Task } from '@/services/task.service';
import { Plus, TrendingUp, AlertTriangle, CheckCircle2, Target, FolderKanban, FileText, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface OverviewTabProps {
  project: Project;
  tasks: Task[];
}

export default function OverviewTab({ project, tasks }: OverviewTabProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(project.description || '');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddMilestoneOpen, setIsAddMilestoneOpen] = useState(false);
  const [isAddResourceOpen, setIsAddResourceOpen] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<'editor' | 'viewer' | 'owner'>('editor');
  const [milestoneName, setMilestoneName] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('');
  const [resourceName, setResourceName] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [milestones, setMilestones] = useState<Array<{ id: string; name: string; date: string }>>([]);
  const [resources, setResources] = useState<Array<{ id: string; name: string; url: string }>>([]);

  // Calculate project statistics
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;
  const atRiskTasks = tasks.filter(t => t.status === 'blocked').length;
  const onTrackTasks = tasks.filter(t => t.status === 'in_progress').length;

  // Generate AI summary insights
  const generateAISummary = () => {
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let summary = '';
    if (completionRate >= 80) {
      summary = `This project is progressing excellently with ${completionRate}% of tasks completed. `;
    } else if (completionRate >= 50) {
      summary = `This project is on track with ${completionRate}% of tasks completed. `;
    } else if (completionRate >= 20) {
      summary = `This project is in early stages with ${completionRate}% of tasks completed. `;
    } else {
      summary = `This project is just getting started. `;
    }

    if (overdueTasks > 0) {
      summary += `There are ${overdueTasks} overdue task${overdueTasks > 1 ? 's' : ''} that need attention. `;
    }

    if (atRiskTasks > 0) {
      summary += `${atRiskTasks} task${atRiskTasks > 1 ? 's are' : ' is'} marked as at risk. `;
    }

    if (onTrackTasks > 0) {
      summary += `${onTrackTasks} task${onTrackTasks > 1 ? 's are' : ' is'} currently in progress and on track. `;
    }

    return summary || 'No activity yet. Start by adding tasks to your project.';
  };

  // Get recent activity
  const getRecentActivity = () => {
    const recentCompletions = tasks
      .filter(t => t.status === 'completed')
      .slice(0, 3);

    return recentCompletions.map(task => ({
      type: 'completed',
      task: task.title,
      date: task.updatedAt || task.createdAt,
    }));
  };

  const recentActivity = getRecentActivity();

  // Calculate risk level
  const getRiskLevel = () => {
    if (atRiskTasks > 3 || overdueTasks > 5) return { level: 'High', color: 'text-red-500', bg: 'bg-red-500/10' };
    if (atRiskTasks > 0 || overdueTasks > 2) return { level: 'Medium', color: 'text-orange-500', bg: 'bg-orange-500/10' };
    return { level: 'Low', color: 'text-green-500', bg: 'bg-green-500/10' };
  };

  const risk = getRiskLevel();

  const handleSaveDescription = () => {
    toast.info('Description saved!');
    setIsEditingDescription(false);
  };

  const handleAddMember = async () => {
    if (!memberEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      await projectService.addMember(project._id, { 
        userId: memberEmail, 
        role: memberRole 
      });
      toast.success(`Member added with ${memberRole} role`);
      setMemberEmail('');
      setMemberRole('editor');
      setIsAddMemberOpen(false);
    } catch (error) {
      toast.error('Failed to add member');
    }
  };

  const handleAddMilestone = () => {
    if (!milestoneName.trim() || !milestoneDate) {
      toast.error('Please fill in all fields');
      return;
    }

    const newMilestone = {
      id: Date.now().toString(),
      name: milestoneName,
      date: milestoneDate,
    };

    setMilestones([...milestones, newMilestone]);
    toast.success('Milestone added');
    setMilestoneName('');
    setMilestoneDate('');
    setIsAddMilestoneOpen(false);
  };

  const handleAddResource = () => {
    if (!resourceName.trim() || !resourceUrl.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const newResource = {
      id: Date.now().toString(),
      name: resourceName,
      url: resourceUrl,
    };

    setResources([...resources, newResource]);
    toast.success('Resource added');
    setResourceName('');
    setResourceUrl('');
    setIsAddResourceOpen(false);
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
    toast.success('Resource removed');
  };

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
    toast.success('Milestone removed');
  };

  return (
    <div className="space-y-6">
      {/* AI Summary Section */}
      <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-1">AI Project Summary</h3>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {generateAISummary()}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-neutral-700/50">
          <div>
            <div className="text-2xl font-bold text-white">{completedTasks}</div>
            <div className="text-xs text-neutral-400">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{onTrackTasks}</div>
            <div className="text-xs text-neutral-400">In Progress</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">{atRiskTasks}</div>
            <div className="text-xs text-neutral-400">At Risk</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-400">{overdueTasks}</div>
            <div className="text-xs text-neutral-400">Overdue</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Recent activity</h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-300 truncate">{activity.task}</p>
                    <p className="text-xs text-neutral-500">
                      Completed {format(new Date(activity.date), 'MMM d')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-neutral-500">No recent activity</p>
            )}
          </div>
        </div>

        {/* Risk Report */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Risk report</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-lg ${risk.bg} flex items-center justify-center`}>
              <AlertTriangle className={`w-6 h-6 ${risk.color}`} />
            </div>
            <div>
              <div className={`text-lg font-bold ${risk.color}`}>{risk.level} Risk</div>
              <div className="text-xs text-neutral-500">Overall project health</div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {overdueTasks > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">Overdue tasks</span>
                <span className="text-red-400 font-medium">{overdueTasks}</span>
              </div>
            )}
            {atRiskTasks > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-400">At risk tasks</span>
                <span className="text-orange-400 font-medium">{atRiskTasks}</span>
              </div>
            )}
            {overdueTasks === 0 && atRiskTasks === 0 && (
              <p className="text-sm text-neutral-500">No risks detected</p>
            )}
          </div>
        </div>
      </div>

      {/* Project Description */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Project description</h3>
          {!isEditingDescription && (
            <button
              onClick={() => setIsEditingDescription(true)}
              className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          )}
        </div>
        {isEditingDescription ? (
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-neutral-800 text-neutral-200 text-sm border border-neutral-700 rounded-md p-3 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe what this project is about..."
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveDescription}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setDescription(project.description || '');
                  setIsEditingDescription(false);
                }}
                className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">
            {description || 'No description yet. Click Edit to add one.'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Project Roles */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Project roles</h3>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add
            </button>
          </div>
          <div className="space-y-3">
            {project.members && project.members.length > 0 ? (
              project.members.slice(0, 5).map((member, index) => {
                const memberUser = typeof member.user === 'object' ? member.user : null;
                const memberName = memberUser?.name || 'Unknown';
                const initials = memberName
                  ?.split(' ')
                  .map(n => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'U';

                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                        {initials}
                      </div>
                      <div>
                        <div className="text-sm text-neutral-200">{memberName}</div>
                        <div className="text-xs text-neutral-500 capitalize">{member.role}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-neutral-500">No members yet</p>
            )}
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Milestones</h3>
            <button
              onClick={() => setIsAddMilestoneOpen(true)}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add
            </button>
          </div>
          <div className="space-y-3">
            {milestones.length > 0 || project.dueDate ? (
              <>
                {project.dueDate && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-neutral-200">Project completion</div>
                      <div className="text-xs text-neutral-500">
                        Due {format(new Date(project.dueDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </div>
                )}
                {milestones.map(milestone => (
                  <div key={milestone.id} className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Target className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <div className="text-sm text-neutral-200">{milestone.name}</div>
                        <div className="text-xs text-neutral-500">
                          Due {format(new Date(milestone.date), 'MMM d, yyyy')}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMilestone(milestone.id)}
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-sm text-neutral-500">No milestones yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Connected Goals */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Connected goals</h3>
            <button
              onClick={() => toast.info('Connect goals to projects coming soon!')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Connect
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-3">
              <Target className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-sm text-neutral-500 text-center">
              Connect this project to company goals
            </p>
          </div>
        </div>

        {/* Connected Portfolios */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Connected portfolios</h3>
            <button
              onClick={() => toast.info('Connect projects to portfolios coming soon!')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Connect
            </button>
          </div>
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-3">
              <FolderKanban className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-sm text-neutral-500 text-center">
              Add this project to a portfolio
            </p>
          </div>
        </div>
      </div>

      {/* Key Resources */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">Key resources</h3>
          <button
            onClick={() => setIsAddResourceOpen(true)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            + Add
          </button>
        </div>
        {resources.length > 0 ? (
          <div className="space-y-3">
            {resources.map((resource) => (
              <div key={resource.id} className="flex items-start justify-between p-3 bg-neutral-800/30 rounded border border-neutral-700/50">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 truncate block"
                    >
                      {resource.name}
                    </a>
                    <p className="text-xs text-neutral-500 truncate">{resource.url}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveResource(resource.id)}
                  className="text-neutral-500 hover:text-red-400 transition-colors ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-neutral-600" />
            </div>
            <p className="text-sm text-neutral-500 text-center mb-2">
              Add links to key documents and resources
            </p>
            <p className="text-xs text-neutral-600 text-center max-w-md">
              Keep important project files, docs, and links easily accessible for your team
            </p>
          </div>
        )}
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add team member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-2">Email address</label>
              <Input
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="member@example.com"
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-2">Role</label>
              <select
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value as 'editor' | 'viewer' | 'owner')}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-md text-sm"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setIsAddMemberOpen(false)}
                variant="outline"
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMember}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Milestone Dialog */}
      <Dialog open={isAddMilestoneOpen} onOpenChange={setIsAddMilestoneOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add milestone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-2">Milestone name</label>
              <Input
                value={milestoneName}
                onChange={(e) => setMilestoneName(e.target.value)}
                placeholder="e.g., Design complete, Beta launch"
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-2">Due date</label>
              <Input
                type="date"
                value={milestoneDate}
                onChange={(e) => setMilestoneDate(e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setIsAddMilestoneOpen(false)}
                variant="outline"
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMilestone}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Milestone
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Resource Dialog */}
      <Dialog open={isAddResourceOpen} onOpenChange={setIsAddResourceOpen}>
        <DialogContent className="bg-neutral-900 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white">Add resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-neutral-400 block mb-2">Resource name</label>
              <Input
                value={resourceName}
                onChange={(e) => setResourceName(e.target.value)}
                placeholder="e.g., Design System, API Docs"
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-400 block mb-2">URL</label>
              <Input
                type="url"
                value={resourceUrl}
                onChange={(e) => setResourceUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={() => setIsAddResourceOpen(false)}
                variant="outline"
                className="border-neutral-700 text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddResource}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Resource
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
