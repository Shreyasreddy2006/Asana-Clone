import { Task } from '@/services/task.service';
import { Project } from '@/services/project.service';
import { CheckCircle2, Clock, AlertCircle, ListTodo, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface DashboardViewProps {
  project: Project;
  tasks: Task[];
}

export default function DashboardView({ project, tasks }: DashboardViewProps) {
  // Calculate metrics
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const incompleteTasks = tasks.filter(t => t.status !== 'completed').length;
  const overdueTasks = tasks.filter(t => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate) < new Date();
  }).length;
  const totalTasks = tasks.length;

  // Task by section data
  const tasksBySectionData = project.sections?.map(section => {
    const sectionId = section._id || section.name;
    const sectionTasks = tasks.filter(task => {
      if (!task.section) return false;
      const taskSectionId = typeof task.section === 'string' ? task.section : task.section._id;
      return taskSectionId === section._id && task.status !== 'completed';
    });

    return {
      name: section.name,
      count: sectionTasks.length,
    };
  }) || [];

  // Task by completion status
  const completionStatusData = [
    { name: 'Completed', value: completedTasks, color: '#22c55e' },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: '#3b82f6' },
    { name: 'Todo', value: tasks.filter(t => t.status === 'todo').length, color: '#6b7280' },
    { name: 'Blocked', value: tasks.filter(t => t.status === 'blocked').length, color: '#f97316' },
  ].filter(item => item.value > 0);

  // Task by assignee
  const tasksByAssigneeData = tasks.reduce((acc: any[], task) => {
    if (!task.assignee) return acc;

    const assigneeName = typeof task.assignee === 'object' ? task.assignee?.name : 'Unknown';
    const existing = acc.find(item => item.name === assigneeName);

    if (existing) {
      existing.count += 1;
      if (task.status !== 'completed') existing.incomplete += 1;
    } else {
      acc.push({
        name: assigneeName,
        count: 1,
        incomplete: task.status !== 'completed' ? 1 : 0,
      });
    }

    return acc;
  }, []);

  // Task completion over time (last 7 days)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const completionOverTimeData = last7Days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const completedOnDay = tasks.filter(task => {
      if (task.status !== 'completed' || !task.updatedAt) return false;
      const updatedDate = format(new Date(task.updatedAt), 'yyyy-MM-dd');
      return updatedDate === dayStr;
    }).length;

    return {
      date: format(day, 'MMM d'),
      completed: completedOnDay,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-neutral-400">Total completed tasks</h3>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{completedTasks}</div>
          <div className="text-xs text-neutral-500 mt-1">
            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% of total
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-neutral-400">Total incomplete tasks</h3>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{incompleteTasks}</div>
          <div className="text-xs text-neutral-500 mt-1">
            {totalTasks > 0 ? Math.round((incompleteTasks / totalTasks) * 100) : 0}% of total
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-neutral-400">Total overdue tasks</h3>
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{overdueTasks}</div>
          <div className="text-xs text-neutral-500 mt-1">
            {overdueTasks > 0 ? 'Needs attention' : 'No overdue tasks'}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-neutral-400">Total tasks</h3>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <ListTodo className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-white">{totalTasks}</div>
          <div className="text-xs text-neutral-500 mt-1">
            Across {project.sections?.length || 0} sections
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart - Incomplete tasks by section */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Total incomplete tasks by section</h3>
            <button
              onClick={() => toast.info('Chart options coming soon!')}
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Options
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tasksBySectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="name" stroke="#a3a3a3" fontSize={12} />
              <YAxis stroke="#a3a3a3" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#262626',
                  border: '1px solid #404040',
                  borderRadius: '6px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Tasks by completion status */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Total tasks by completion status</h3>
            <button
              onClick={() => toast.info('Chart options coming soon!')}
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Options
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={completionStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {completionStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#262626',
                  border: '1px solid #404040',
                  borderRadius: '6px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-2 gap-6">
        {/* Line Chart - Upcoming tasks by assignee */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Total upcoming tasks by assignee</h3>
            <button
              onClick={() => toast.info('Chart options coming soon!')}
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Options
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={tasksByAssigneeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis type="number" stroke="#a3a3a3" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#a3a3a3" fontSize={12} width={100} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#262626',
                  border: '1px solid #404040',
                  borderRadius: '6px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="incomplete" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Incomplete" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart - Task completion over time */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Task completion over time</h3>
            <button
              onClick={() => toast.info('Chart options coming soon!')}
              className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Options
            </button>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={completionOverTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
              <XAxis dataKey="date" stroke="#a3a3a3" fontSize={12} />
              <YAxis stroke="#a3a3a3" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#262626',
                  border: '1px solid #404040',
                  borderRadius: '6px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="completed"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ fill: '#22c55e', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Widget Button */}
      <div className="flex justify-center">
        <button
          onClick={() => toast.info('Add widget feature coming soon!')}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add widget</span>
        </button>
      </div>
    </div>
  );
}
