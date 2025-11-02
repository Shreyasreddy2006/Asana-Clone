import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Plus, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AddChartDialog from '@/components/AddChartDialog';

export default function Reporting() {
  const navigate = useNavigate();
  const [isAddChartOpen, setIsAddChartOpen] = useState(false);

  const handleCreateDashboard = () => {
    setIsAddChartOpen(true);
  };

  const handleViewDashboard = () => {
    navigate('/dashboard-detail');
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className="flex-1 ml-60">
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <h1 className="text-2xl font-semibold mb-6">Reporting</h1>

            {/* Tabs */}
            <div className="flex items-center gap-6 text-sm">
              <button className="pb-3 border-b-2 border-white font-medium text-white">
                Dashboards
              </button>
            </div>
          </div>

          {/* Create Button */}
          <div className="px-8 py-4 border-b border-neutral-800">
            <Button
              onClick={handleCreateDashboard}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create
            </Button>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {/* Recents Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
                  <span className="text-lg">▼</span>
                  <span className="font-medium">Recents</span>
                </button>
                <button className="p-2 hover:bg-neutral-800 rounded">
                  <LayoutGrid className="w-5 h-5 text-neutral-400" />
                </button>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Create Dashboard Card */}
                <div
                  onClick={handleCreateDashboard}
                  className="border-2 border-dashed border-neutral-700 rounded-lg p-8 flex flex-col items-center justify-center hover:border-neutral-600 cursor-pointer transition-colors min-h-[180px]"
                >
                  <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-3">
                    <Plus className="w-6 h-6 text-neutral-400" />
                  </div>
                  <p className="text-sm text-neutral-300">Create dashboard</p>
                </div>

                {/* My First Dashboard Card - Large */}
                <div
                  onClick={handleViewDashboard}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:bg-neutral-800/50 cursor-pointer transition-colors min-h-[180px] md:col-span-2"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <LayoutGrid className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-2">My first dashboard</h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                          AY
                        </div>
                        <span>owned by you</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* My First Dashboard Card - Small */}
                <div
                  onClick={handleViewDashboard}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:bg-neutral-800/50 cursor-pointer transition-colors min-h-[180px]"
                >
                  <div className="flex flex-col h-full">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center mb-4">
                      <LayoutGrid className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-base font-semibold mb-2">My first dashboard</h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 mt-auto">
                      <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900">
                        AY
                      </div>
                      <span>owned by you</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <AddChartDialog open={isAddChartOpen} onOpenChange={setIsAddChartOpen} />
    </div>
  );
}
