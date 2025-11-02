import { useState } from 'react';
import { Task } from '@/services/task.service';
import { Project } from '@/services/project.service';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
} from 'date-fns';

interface CalendarViewProps {
  project: Project;
  tasks: Task[];
  onUpdateTask: (taskId: string, field: string, value: any) => Promise<void>;
}

export default function CalendarView({ project, tasks, onUpdateTask }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), day);
    });
  };

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-pink-500',
      urgent: 'bg-red-500',
    };
    return colors[priority as keyof typeof colors] || 'bg-cyan-500';
  };

  const handlePreviousMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: Date) => {
    toast.info(`Selected ${format(day, 'MMM d, yyyy')}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              Today
            </button>
            <button
              onClick={handlePreviousMonth}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as 'month' | 'week')}
            className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 border border-neutral-700 rounded hover:bg-neutral-700 transition-colors"
          >
            <option value="month">Month</option>
            <option value="week">Week</option>
          </select>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        {/* Week Day Headers */}
        <div className="grid grid-cols-7 border-b border-neutral-800">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-3 px-2 text-center text-xs font-medium text-neutral-500 uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 auto-rows-fr" style={{ height: 'calc(100% - 49px)' }}>
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isDayToday = isToday(day);

            return (
              <div
                key={index}
                onClick={() => handleDayClick(day)}
                className={`border-b border-r border-neutral-800 p-2 min-h-[120px] cursor-pointer hover:bg-neutral-800/30 transition-colors ${
                  !isCurrentMonth ? 'bg-neutral-900/50' : ''
                } ${isDayToday ? 'bg-blue-500/5' : ''}`}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-medium ${
                      !isCurrentMonth
                        ? 'text-neutral-600'
                        : isDayToday
                        ? 'text-blue-400 font-bold'
                        : 'text-neutral-300'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toast.info('Add task feature coming soon!');
                    }}
                    className="opacity-0 hover:opacity-100 p-1 hover:bg-neutral-700 rounded transition-opacity"
                  >
                    <Plus className="w-3 h-3 text-neutral-500" />
                  </button>
                </div>

                {/* Tasks for this day */}
                <div className="space-y-1">
                  {dayTasks.slice(0, 3).map((task) => {
                    const priorityColor = getPriorityColor(task.priority);
                    const isCompleted = task.status === 'completed';

                    return (
                      <div
                        key={task._id}
                        className={`text-xs px-2 py-1 rounded truncate ${priorityColor} ${
                          isCompleted ? 'opacity-50 line-through' : 'opacity-90'
                        } text-white hover:opacity-100 transition-opacity`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <div className="text-xs px-2 py-1 text-neutral-500">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-neutral-500">
        <span>Priority:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-pink-500" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-cyan-500" />
          <span>Default</span>
        </div>
      </div>
    </div>
  );
}
