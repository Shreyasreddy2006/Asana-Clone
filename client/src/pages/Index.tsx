import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import UseCases from "@/components/UseCases";
import Features from "@/components/Features";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TrustedBy />
      <UseCases />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
