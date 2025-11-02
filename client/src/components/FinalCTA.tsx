import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  return (
    <section className="py-32 text-white" style={{ background: 'linear-gradient(180deg, #690031 0%, #4a0022 100%)' }}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            The only platform that can
            <br />
            support your company at
            <br />
            any scale
          </h2>

          <Button
            size="lg"
            className="px-10 py-6 bg-white text-gray-900 hover:bg-gray-100 rounded-full font-medium text-base"
          >
            Get started
          </Button>

          <p className="mt-8 text-sm text-white/80">
            1. Accurate as of December 2023, includes free and paid users.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
