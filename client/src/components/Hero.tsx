import { Button } from "@/components/ui/button";
import heroDashboard from "@/assets/hero-dashboard.png";

const Hero = () => {
  return (
    <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
      <div className="container mx-auto px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            The collaborative workspace
            <br />
            for your team + AI
          </h1>
          <p className="text-lg md:text-xl text-white/95 mb-10 max-w-3xl mx-auto font-light">
            Your work in one place so teams can align, automate busywork, and
            <br className="hidden md:block" />
            get work done faster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              className="text-base px-10 py-6 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-medium shadow-lg"
            >
              Get started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-10 py-6 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-full font-medium"
            >
              See how it works
            </Button>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-6xl mx-auto bg-white/10 backdrop-blur-sm p-2">
            <img
              src={heroDashboard}
              alt="Asana Dashboard Interface"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
