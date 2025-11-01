import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            See why millions trust Asana to get more done
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join teams at companies of all sizes who use Asana to be more productive and deliver better results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-base px-8">
              Get started
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              Contact sales
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Free for individuals and teams up to 10
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
