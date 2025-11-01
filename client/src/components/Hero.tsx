import { Button } from "@/components/ui/button";
import heroDashboard from "@/assets/hero-dashboard.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      <div className="container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            The collaborative workspace for your team + AI
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 mb-10 max-w-3xl mx-auto">
            Your work in one place so teams can align, automate busywork, and get work done faster.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button variant="hero" size="lg" className="text-base px-8">
              Get started
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              See how it works
            </Button>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-w-5xl mx-auto">
            <img 
              src={heroDashboard} 
              alt="Asana Dashboard Interface" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
