interface WorkflowCardProps {
  title: string;
  description: string;
  organization?: string;
  badge?: string;
  color: string;
  bgColor: string;
  previewType: 'timeline' | 'list' | 'calendar';
}

export function WorkflowCard({
  title,
  description,
  organization,
  badge,
  color,
  bgColor,
  previewType,
}: WorkflowCardProps) {
  const getPreviewContent = () => {
    switch (previewType) {
      case 'timeline':
        return (
          <div className="w-full h-full flex flex-col justify-center p-6 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-16 h-3 bg-orange-500 rounded"></div>
              <div className="w-20 h-3 bg-green-500 rounded"></div>
            </div>
            <div className="flex items-center gap-2 ml-8">
              <div className="w-24 h-3 bg-blue-500 rounded"></div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <div className="w-12 h-3 bg-purple-500 rounded"></div>
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="w-full h-full flex items-center justify-center p-6">
            <div className="grid grid-cols-7 gap-1 w-full">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded ${
                    i === 10 || i === 11 || i === 17 || i === 18
                      ? 'bg-orange-500/60'
                      : i === 3 || i === 24 || i === 25
                      ? 'bg-green-500/60'
                      : 'bg-neutral-700'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="w-full h-full flex flex-col justify-center p-6 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border-2 border-neutral-500"></div>
              <div className="flex-1 flex items-center gap-2">
                <div className="h-2 bg-neutral-600 rounded flex-1"></div>
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border-2 border-neutral-500"></div>
              <div className="flex-1 flex items-center gap-2">
                <div className="h-2 bg-neutral-600 rounded flex-1"></div>
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border-2 border-neutral-500"></div>
              <div className="flex-1 flex items-center gap-2">
                <div className="h-2 bg-neutral-600 rounded flex-1"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border-2 border-neutral-500"></div>
              <div className="flex-1 flex items-center gap-2">
                <div className="h-2 bg-neutral-600 rounded flex-1"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded border-2 border-neutral-500"></div>
              <div className="flex-1 flex items-center gap-2">
                <div className="h-2 bg-neutral-600 rounded flex-1"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className={`${color} ${bgColor} rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-all duration-200 bg-neutral-900/40 backdrop-blur-sm border-0`}
    >
      {/* Preview Section */}
      <div className="aspect-video flex items-center justify-center bg-[#2a2a2a] border-b-0">
        {getPreviewContent()}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-semibold text-white mb-2 text-base">{title}</h3>

        {/* Description */}
        <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{description}</p>

        {/* Badge */}
        {badge && (
          <div className="flex items-center gap-1 text-xs text-neutral-500">
            <span>{badge}</span>
          </div>
        )}
      </div>
    </div>
  );
}
