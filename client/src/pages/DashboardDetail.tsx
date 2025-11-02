import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Plus, Star, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardDetail() {
  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className="flex-1 ml-60">
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">📊</span>
                </div>
                <h1 className="text-2xl font-semibold">New dashboard</h1>
                <button className="p-1 hover:bg-neutral-800 rounded">
                  <Star className="w-5 h-5 text-neutral-400" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                  Share
                </button>
                <button className="p-2 hover:bg-neutral-800 rounded">
                  <MoreHorizontal className="w-5 h-5 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 text-sm">
              <button className="pb-3 border-b-2 border-white font-medium text-white">
                Overview
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="px-8 py-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add widget
              </Button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 rounded">
                <span>Filter</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <button className="text-sm text-blue-400 hover:text-blue-300">
              Send feedback
            </button>
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center justify-center py-32">
            <div className="mb-8">
              <div className="w-48 h-48 relative">
                {/* Easel/Canvas illustration */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Canvas */}
                    <div className="w-40 h-32 bg-neutral-100 rounded-t-lg relative">
                      {/* Pink blob on canvas */}
                      <div className="absolute top-4 left-8 w-12 h-10 bg-pink-300 rounded-full"></div>
                    </div>
                    {/* Easel legs */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-20">
                      <div className="absolute left-0 bottom-0 w-1 h-20 bg-pink-400 origin-bottom -rotate-12"></div>
                      <div className="absolute right-0 bottom-0 w-1 h-20 bg-pink-400 origin-bottom rotate-12"></div>
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full h-1 bg-pink-400"></div>
                    </div>
                    {/* Paint bucket */}
                    <div className="absolute -right-8 bottom-0 w-8 h-10 bg-pink-400 rounded-b-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Your dashboard is empty</h2>
            <p className="text-sm text-neutral-400">Add widget to get started</p>
          </div>
        </main>
      </div>
    </div>
  );
}
