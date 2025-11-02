import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import UseCases from "@/components/UseCases";
import Features from "@/components/Features";
import Integrations from "@/components/Integrations";
import Testimonials from "@/components/Testimonials";
import GetStarted from "@/components/GetStarted";
import Awards from "@/components/Awards";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <TrustedBy />
      <UseCases />
      <Features />
      <Integrations />
      <Testimonials />
      <GetStarted />
      <Awards />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
