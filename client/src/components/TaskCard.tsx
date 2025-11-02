interface TaskCardProps {
  title: string;
  project: string;
  dateRange: string;
  projectColor?: string;
}

export function TaskCard({ title, project, dateRange, projectColor = "#06b6d4" }: TaskCardProps) {
  return (
    <div className="flex items-center gap-3 py-2 px-1 hover:bg-[#2E2E32]/50 rounded cursor-pointer group">
      {/* Checkbox Circle */}
      <button className="w-4 h-4 rounded-full border-2 border-[#9CA3AF] hover:border-white transition-colors flex-shrink-0" />

      {/* Task Title */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] text-white truncate">{title}</p>
      </div>

      {/* Project Tag and Date */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Project Tag with colored background */}
        <span
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${projectColor}25`,
            color: projectColor
          }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: projectColor }}
          />
          {project}
        </span>

        {/* Date */}
        <span className="text-xs text-[#9CA3AF] min-w-[70px] text-right">{dateRange}</span>
      </div>
    </div>
  );
}
