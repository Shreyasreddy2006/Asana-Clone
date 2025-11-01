import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Features = () => {
  const features = [
    {
      title: "AI-powered work management",
      description: "Let AI help you plan projects, write briefs, and automate repetitive tasks so you can focus on the work that matters.",
      image: "https://assets.asana.biz/m/6a6dfbf21c6e3a94/original/ai-capabilities.png",
    },
    {
      title: "Connect your tools",
      description: "Sync your work across 200+ integrations including Slack, Microsoft Teams, Adobe Creative Cloud, and more.",
      image: "https://assets.asana.biz/m/5f0b3f3e8e4a6c8f/original/integrations.png",
    },
    {
      title: "Multiple views for every team",
      description: "View your work your way with List, Board, Timeline, Calendar, and Gantt views that adapt to how you work best.",
      image: "https://assets.asana.biz/m/1a9b8c7d6e5f4a3b/original/views.png",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="space-y-24">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 max-w-6xl mx-auto`}
            >
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {feature.description}
                </p>
                <Button variant="link" className="text-primary p-0 text-base font-semibold">
                  Learn more →
                </Button>
              </div>
              <div className="flex-1">
                <Card className="overflow-hidden shadow-lg border-border">
                  <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                    <div className="text-6xl">
                      {index === 0 ? "🤖" : index === 1 ? "🔗" : "📱"}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
