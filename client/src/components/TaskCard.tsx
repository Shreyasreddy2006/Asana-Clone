import { Circle } from "lucide-react";

interface TaskCardProps {
  title: string;
  project: string;
  dateRange: string;
  projectColor?: string;
}

export function TaskCard({ title, project, dateRange, projectColor = "#06b6d4" }: TaskCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer group">
      <button className="w-5 h-5 rounded-full border-2 border-muted-foreground hover:border-primary transition-colors flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-foreground">{title}</p>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="flex items-center gap-1" style={{ color: projectColor }}>
          <Circle className="w-3 h-3 fill-current" />
          {project}
        </span>
        <span className="text-muted-foreground">{dateRange}</span>
      </div>
    </div>
  );
}
