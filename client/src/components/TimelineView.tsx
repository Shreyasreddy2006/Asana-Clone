import { useState, useRef, useEffect } from 'react';
import { Task } from '@/services/task.service';
import { Project } from '@/services/project.service';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, startOfWeek, endOfWeek, differenceInDays, addMonths, isSameDay } from 'date-fns';
import { toast } from 'sonner';

interface TimelineViewProps {
  project: Project;
  tasks: Task[];
  onUpdateTask: (taskId: string, field: string, value: any) => Promise<void>;
}

export default function TimelineView({ project, tasks, onUpdateTask }: TimelineViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggingTask, setDraggingTask] = useState<{ taskId: string; edge: 'start' | 'end' | 'move' } | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Calculate timeline range (show current month + next 2 months)
  const timelineStart = startOfMonth(currentDate);
  const timelineEnd = endOfMonth(addMonths(currentDate, 2));
  const totalDays = differenceInDays(timelineEnd, timelineStart) + 1;

  // Generate weeks for header
  const weeks = eachWeekOfInterval(
    { start: timelineStart, end: timelineEnd },
    { weekStartsOn: 0 }
  );

  // Generate all days
  const allDays = eachDayOfInterval({ start: timelineStart, end: timelineEnd });

  // Group tasks by section
  const tasksBySection = project.sections?.reduce((acc, section) => {
    const sectionId = section._id || section.name;
    acc[sectionId] = tasks.filter(task => {
      if (!task.section) return false;
      const taskSectionId = typeof task.section === 'string' ? task.section : task.section._id;
      return taskSectionId === section._id;
    });
    return acc;
  }, {} as Record<string, Task[]>) || {};

  // Calculate task bar position and width
  const getTaskBarStyle = (task: Task) => {
    if (!task.dueDate) return null;

    const taskStart = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);
    const taskEnd = new Date(task.dueDate);

    // Calculate position from timeline start
    const daysFromStart = differenceInDays(taskStart, timelineStart);
    const taskDuration = differenceInDays(taskEnd, taskStart) + 1;

    if (daysFromStart < 0 || daysFromStart > totalDays) return null;

    const dayWidth = 100 / totalDays;
    const left = daysFromStart * dayWidth;
    const width = Math.max(taskDuration * dayWidth, dayWidth);

    return { left: `${left}%`, width: `${width}%` };
  };

  // Get task color based on priority
  const getTaskColor = (priority?: string) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-pink-500',
      urgent: 'bg-red-500',
    };
    return colors[priority as keyof typeof colors] || 'bg-cyan-500';
  };

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent, taskId: string, edge: 'start' | 'end' | 'move') => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragOffset(e.clientX - rect.left);
    setDraggingTask({ taskId, edge });
  };

  // Handle drag move
  const handleMouseMove = (e: MouseEvent) => {
    if (!draggingTask || !timelineRef.current) return;

    const timelineRect = timelineRef.current.getBoundingClientRect();
    const relativeX = e.clientX - timelineRect.left;
    const dayWidth = timelineRect.width / totalDays;
    const dayIndex = Math.floor(relativeX / dayWidth);

    if (dayIndex < 0 || dayIndex >= totalDays) return;

    const newDate = addDays(timelineStart, dayIndex);
    const task = tasks.find(t => t._id === draggingTask.taskId);
    if (!task) return;

    // Update task dates based on drag type
    if (draggingTask.edge === 'start') {
      const currentEnd = task.dueDate ? new Date(task.dueDate) : new Date();
      if (newDate <= currentEnd) {
        onUpdateTask(task._id, 'startDate', newDate.toISOString());
      }
    } else if (draggingTask.edge === 'end') {
      const currentStart = task.startDate ? new Date(task.startDate) : new Date(task.dueDate || new Date());
      if (newDate >= currentStart) {
        onUpdateTask(task._id, 'dueDate', newDate.toISOString());
      }
    } else {
      // Move entire task
      const currentStart = task.startDate ? new Date(task.startDate) : new Date(task.dueDate || new Date());
      const currentEnd = new Date(task.dueDate || new Date());
      const duration = differenceInDays(currentEnd, currentStart);

      onUpdateTask(task._id, 'startDate', newDate.toISOString());
      onUpdateTask(task._id, 'dueDate', addDays(newDate, duration).toISOString());
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    if (draggingTask) {
      toast.success('Task dates updated!');
    }
    setDraggingTask(null);
  };

  // Add mouse event listeners
  useEffect(() => {
    if (draggingTask) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingTask]);

  // Navigate months
  const handlePreviousMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Timeline Controls */}
      <div className="flex items-center justify-between mb-4">
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
          <span className="text-sm font-medium text-neutral-200 ml-2">
            {format(currentDate, 'MMMM yyyy')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 border border-neutral-700 rounded hover:bg-neutral-700 transition-colors">
            <option>Months</option>
            <option>Weeks</option>
            <option>Days</option>
          </select>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Month Headers */}
          <div className="flex border-b border-neutral-800">
            <div className="w-48 flex-shrink-0" />
            <div className="flex-1 flex">
              {[0, 1, 2].map((monthOffset) => {
                const month = addMonths(currentDate, monthOffset);
                const monthStart = startOfMonth(month);
                const monthEnd = endOfMonth(month);
                const daysInMonth = differenceInDays(monthEnd, monthStart) + 1;
                const widthPercent = (daysInMonth / totalDays) * 100;

                return (
                  <div
                    key={monthOffset}
                    style={{ width: `${widthPercent}%` }}
                    className="border-r border-neutral-800 px-2 py-2"
                  >
                    <span className="text-xs font-medium text-neutral-400">
                      {format(month, 'MMM yyyy')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Week Headers */}
          <div className="flex border-b border-neutral-800">
            <div className="w-48 flex-shrink-0" />
            <div ref={timelineRef} className="flex-1 flex relative">
              {allDays.map((day, index) => {
                const isToday = isSameDay(day, new Date());
                const isWeekStart = day.getDay() === 0;

                return (
                  <div
                    key={index}
                    className={`flex-1 border-r border-neutral-800/30 px-1 py-2 ${isWeekStart ? 'border-l border-neutral-700' : ''}`}
                  >
                    {isWeekStart && (
                      <span className="text-xs text-neutral-500">
                        {format(day, 'd')}
                      </span>
                    )}
                    {isToday && (
                      <div className="absolute top-0 left-0 w-full h-full bg-blue-500/5 pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Rows by Section */}
          {project.sections?.map((section) => {
            const sectionId = section._id || section.name;
            const sectionTasks = tasksBySection[sectionId] || [];

            return (
              <div key={sectionId} className="border-b border-neutral-800">
                {/* Section Header */}
                <div className="flex items-center border-b border-neutral-800/50 bg-neutral-900/30">
                  <div className="w-48 flex-shrink-0 px-4 py-2">
                    <span className="text-sm font-semibold text-neutral-200">{section.name}</span>
                  </div>
                  <div className="flex-1" />
                </div>

                {/* Tasks in Section */}
                {sectionTasks.map((task) => {
                  const barStyle = getTaskBarStyle(task);
                  const taskColor = getTaskColor(task.priority);
                  const isCompleted = task.status === 'completed';

                  return (
                    <div key={task._id} className="flex items-center hover:bg-neutral-800/20 transition-colors group">
                      <div className="w-48 flex-shrink-0 px-4 py-3 border-r border-neutral-800/30">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateTask(task._id, 'status', isCompleted ? 'todo' : 'completed')}
                            className="w-4 h-4 rounded-full border-2 border-neutral-600 hover:border-neutral-400 transition-colors flex-shrink-0"
                          >
                            {isCompleted && (
                              <div className="w-full h-full rounded-full bg-green-600 border-2 border-green-600 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" strokeWidth="2.5" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                          <span className={`text-xs truncate ${isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}>
                            {task.title}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 relative h-12 px-2">
                        {/* Grid lines */}
                        {allDays.map((_, index) => (
                          <div
                            key={index}
                            className="absolute top-0 h-full border-r border-neutral-800/20"
                            style={{ left: `${(index / totalDays) * 100}%` }}
                          />
                        ))}

                        {/* Task Bar */}
                        {barStyle && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 h-7 rounded group/bar cursor-move"
                            style={barStyle}
                            onMouseDown={(e) => handleMouseDown(e, task._id, 'move')}
                          >
                            <div className={`h-full rounded px-2 flex items-center justify-between ${taskColor} ${isCompleted ? 'opacity-50' : 'opacity-90'} hover:opacity-100 transition-opacity`}>
                              {/* Left resize handle */}
                              <div
                                className="absolute left-0 top-0 h-full w-2 cursor-ew-resize opacity-0 group-hover/bar:opacity-100 hover:bg-white/20 transition-opacity"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  handleMouseDown(e, task._id, 'start');
                                }}
                              />

                              {/* Task content */}
                              <span className="text-xs font-medium text-white truncate px-1">
                                {task.title}
                              </span>

                              {/* Right resize handle */}
                              <div
                                className="absolute right-0 top-0 h-full w-2 cursor-ew-resize opacity-0 group-hover/bar:opacity-100 hover:bg-white/20 transition-opacity"
                                onMouseDown={(e) => {
                                  e.stopPropagation();
                                  handleMouseDown(e, task._id, 'end');
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Add task row */}
                <div className="flex items-center hover:bg-neutral-800/20 transition-colors">
                  <div className="w-48 flex-shrink-0 px-4 py-2 border-r border-neutral-800/30">
                    <button
                      onClick={() => toast.info('Add task feature coming soon!')}
                      className="flex items-center gap-2 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add task</span>
                    </button>
                  </div>
                  <div className="flex-1" />
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
