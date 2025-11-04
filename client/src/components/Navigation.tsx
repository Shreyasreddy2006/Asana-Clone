import { ChevronDown, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/asana-logo.png" alt="Asana" width="32" height="32" className="w-8 h-8 object-contain" />
              <span className="text-xl font-bold text-foreground">asana</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <button className="flex items-center gap-1 text-sm font-normal text-foreground hover:text-primary transition-colors">
                Product <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm font-normal text-foreground hover:text-primary transition-colors">
                Solutions <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm font-normal text-foreground hover:text-primary transition-colors">
                Learning & support <ChevronDown className="w-4 h-4" />
              </button>
              <button className="text-sm font-normal text-foreground hover:text-primary transition-colors">
                Pricing
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden lg:block">
              <Globe className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
            </button>
            <button className="text-sm font-normal text-foreground hover:text-primary transition-colors hidden lg:block">
              Contact sales
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-normal">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-medium bg-black text-white hover:bg-gray-800 rounded-md">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
