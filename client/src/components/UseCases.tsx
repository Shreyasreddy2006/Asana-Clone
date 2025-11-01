import { Card } from "@/components/ui/card";

const UseCases = () => {
  const useCases = [
    {
      title: "Project Management",
      description: "Keep all your project details in one place, from goals to deadlines.",
      color: "from-blue-50 to-blue-100",
      icon: "📊"
    },
    {
      title: "Workflows & Automation",
      description: "Build and automate processes to save time and reduce manual work.",
      color: "from-purple-50 to-purple-100",
      icon: "⚡"
    },
    {
      title: "Goals & Reporting",
      description: "Track progress toward company objectives in real-time.",
      color: "from-green-50 to-green-100",
      icon: "🎯"
    },
    {
      title: "Resource Management",
      description: "See who's working on what and balance workloads across teams.",
      color: "from-orange-50 to-orange-100",
      icon: "👥"
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            See how Asana keeps work moving across use cases
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {useCases.map((useCase, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-border bg-card"
            >
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                {useCase.title}
              </h3>
              <p className="text-muted-foreground">
                {useCase.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
