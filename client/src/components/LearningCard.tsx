import { Clock, Book } from "lucide-react";

interface LearningCardProps {
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  type?: 'video' | 'article';
}

export function LearningCard({ title, description, duration, icon, type = 'video' }: LearningCardProps) {
  return (
    <div className="group cursor-pointer">
      {/* Image/Illustration Section with Gradient Background */}
      <div className="relative bg-gradient-to-br from-[#881337] via-[#701A3E] to-[#5B1732] rounded-t-lg overflow-hidden">
        <div className="aspect-[4/3] flex items-center justify-center text-white p-8">
          {icon}
        </div>
        {/* Duration Badge */}
        <div className="absolute bottom-3 left-3 bg-black/90 text-white text-xs font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
          {type === 'video' ? (
            <Clock className="w-3.5 h-3.5" />
          ) : (
            <Book className="w-3.5 h-3.5" />
          )}
          <span>{duration}</span>
        </div>
      </div>

      {/* Text Content Section */}
      <div className="bg-[#2E2E32] p-4 rounded-b-lg border-x border-b border-[#374151] group-hover:bg-[#323238] transition-colors">
        <h3 className="text-[15px] font-semibold text-white mb-1.5">{title}</h3>
        <p className="text-[13px] text-[#9CA3AF] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
