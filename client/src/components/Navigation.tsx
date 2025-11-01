import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6" fill="#F06A6A"/>
                <circle cx="16" cy="16" r="6" fill="#FFB900"/>
                <circle cx="12" cy="12" r="4" fill="#FCB400"/>
              </svg>
              <span className="text-xl font-bold text-foreground">asana</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Product <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Solutions <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Resources <ChevronDown className="w-4 h-4" />
              </button>
              <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Pricing
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Contact sales
            </button>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-medium">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="font-semibold">
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
