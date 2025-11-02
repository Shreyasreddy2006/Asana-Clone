import { Clock } from "lucide-react";

interface LearningCardProps {
  title: string;
  description: string;
  duration: string;
  icon: string;
}

export function LearningCard({ title, description, duration, icon }: LearningCardProps) {
  return (
    <div className="bg-rose-900 rounded-lg overflow-hidden cursor-pointer hover:bg-rose-800 transition-colors">
      <div className="aspect-video flex items-center justify-center text-6xl p-8">
        {icon}
      </div>
      <div className="p-4 bg-card">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Clock className="w-3 h-3" />
          <span>{duration}</span>
        </div>
        <h3 className="font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
