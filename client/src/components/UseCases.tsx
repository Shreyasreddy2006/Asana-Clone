import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

const UseCases = () => {
  const useCases = [
    {
      title: "Campaign management",
      description: "Plan, track, and complete your campaigns all in one place.",
      icon: "📊",
    },
    {
      title: "Creative production",
      description: "Accelerate creative work by automating workflows from start to finish.",
      icon: "🎨",
    },
    {
      title: "Project intake",
      description: "Capture, prioritize, and assign requests automatically so your team can focus on the work.",
      icon: "📥",
    },
    {
      title: "Product launches",
      description: "Coordinate teams, tasks, and timelines to keep every launch on track.",
      icon: "🚀",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-16 text-left">
            See how Asana keeps
            <br />
            work moving across use cases
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 bg-white group"
              >
                <div className="mb-6">
                  <div className="w-16 h-16 bg-red-50 rounded-lg flex items-center justify-center text-3xl mb-4">
                    {useCase.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {useCase.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {useCase.description}
                </p>
              </Card>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <button className="flex items-center gap-2 text-base font-medium text-gray-900 hover:gap-3 transition-all">
              <ChevronRight className="w-10 h-10 bg-black text-white rounded-full p-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
