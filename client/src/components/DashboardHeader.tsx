import { Search, HelpCircle, Bell, Star } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

export function DashboardHeader() {
  const { user } = useAuthStore();

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="h-12 bg-neutral-800 border-b border-neutral-700 flex items-center px-4 fixed top-0 right-0 left-60 z-10">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-neutral-700 border-0 rounded-md pl-10 pr-4 py-1.5 text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4">
        <button className="p-2 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>
        <button className="p-2 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white transition-colors">
          <Star className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-sm font-bold text-neutral-900 ml-2">
          {user?.name ? getInitials(user.name) : 'U'}
        </div>
      </div>
    </header>
  );
}
