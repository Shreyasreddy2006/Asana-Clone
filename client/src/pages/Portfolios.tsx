import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, FolderKanban, X, ChevronDown, List, Calendar, BarChart2 } from 'lucide-react';

interface Portfolio {
  id: string;
  name: string;
  color: string;
  projectCount: number;
  defaultView: string;
  privacy: string;
}

const DEFAULT_PORTFOLIOS: Portfolio[] = [
  {
    id: '1',
    name: 'My first portfolio',
    color: 'bg-neutral-700',
    projectCount: 1,
    defaultView: 'list',
    privacy: 'Public to My workspace'
  }
];

export default function Portfolios() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [portfolioName, setPortfolioName] = useState('');
  const [selectedView, setSelectedView] = useState('list');
  const [privacyOption, setPrivacyOption] = useState('Public to My workspace');
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'recent' | 'browse'>('recent');

  // Portfolio list state with persistence
  const [portfolios, setPortfolios] = useState<Portfolio[]>(() => {
    const saved = localStorage.getItem('portfolios');
    return saved ? JSON.parse(saved) : DEFAULT_PORTFOLIOS;
  });

  // Save portfolios to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portfolios', JSON.stringify(portfolios));
  }, [portfolios]);

  // Function to generate random color for portfolio
  const getRandomColor = () => {
    const colors = [
      'bg-pink-500',
      'bg-purple-500',
      'bg-blue-500',
      'bg-cyan-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-orange-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-violet-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Handle portfolio creation
  const handleCreatePortfolio = () => {
    if (!portfolioName.trim()) {
      alert('Please enter a portfolio name');
      return;
    }

    const newPortfolio: Portfolio = {
      id: Date.now().toString(),
      name: portfolioName,
      color: getRandomColor(),
      projectCount: 0,
      defaultView: selectedView,
      privacy: privacyOption
    };

    const updatedPortfolios = [newPortfolio, ...portfolios];

    // Update state and localStorage
    setPortfolios(updatedPortfolios);
    localStorage.setItem('portfolios', JSON.stringify(updatedPortfolios));

    // Reset form and close modal
    setShowCreateModal(false);

    // Navigate to portfolio setup with portfolio name
    navigate('/portfolio-setup', { state: { portfolioName: portfolioName } });

    // Reset form after navigation
    setPortfolioName('');
    setSelectedView('list');
    setPrivacyOption('Public to My workspace');
  };

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <AppSidebar />

      <div className="flex-1 ml-60">
        <DashboardHeader />

        <main className="pt-12 text-white">
          {/* Header */}
          <div className="border-b border-neutral-800 px-8 py-6">
            <h1 className="text-2xl font-semibold mb-6">Portfolios</h1>

            {/* Tabs */}
            <div className="flex items-center gap-6 text-sm">
              <button
                onClick={() => setActiveTab('recent')}
                className={`pb-3 ${activeTab === 'recent' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Recent and starred
              </button>
              <button
                onClick={() => setActiveTab('browse')}
                className={`pb-3 ${activeTab === 'browse' ? 'border-b-2 border-white font-medium text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                Browse all
              </button>
            </div>
          </div>

          {/* Create Button */}
          <div className="px-8 py-4 border-b border-neutral-800">
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create
            </Button>
          </div>

          {/* Content */}
          <div className="px-8 py-6">
            {activeTab === 'recent' ? (
              /* Recent Portfolios Section - Card View */
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold flex items-center gap-2">
                    <span>▼</span>
                    Recent portfolios
                  </h2>
                  <button className="p-2 hover:bg-neutral-800 rounded">
                    <LayoutGrid className="w-5 h-5 text-neutral-400" />
                  </button>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {/* New Portfolio Card */}
                  <div
                    onClick={() => setShowCreateModal(true)}
                    className="border-2 border-dashed border-neutral-700 rounded-lg p-8 flex flex-col items-center justify-center hover:border-neutral-600 cursor-pointer transition-colors min-h-[180px]"
                  >
                    <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center mb-3">
                      <Plus className="w-6 h-6 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-300">New portfolio</p>
                  </div>

                  {/* Dynamic Portfolio Cards */}
                  {portfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      onClick={() => navigate('/portfolio-detail', { state: { portfolioName: portfolio.name } })}
                      className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 hover:bg-neutral-800/50 cursor-pointer transition-colors min-h-[180px] flex flex-col"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-16 h-16 rounded-lg ${portfolio.color} flex items-center justify-center flex-shrink-0`}>
                          <FolderKanban className={`w-8 h-8 ${portfolio.color === 'bg-neutral-700' ? 'text-neutral-400' : 'text-white'}`} />
                        </div>
                      </div>
                      <h3 className="text-base font-semibold mb-2">{portfolio.name}</h3>
                      <p className="text-xs text-neutral-400 mt-auto">
                        {portfolio.projectCount} {portfolio.projectCount === 1 ? 'project' : 'projects'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Browse All Section - List View */
              <div className="mb-8">
                {/* Table Header */}
                <div className="border-b border-neutral-800">
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs text-neutral-400 font-medium">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-3">Members</div>
                    <div className="col-span-3">Parent portfolios</div>
                    <div className="col-span-2">Last modified</div>
                  </div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-neutral-800">
                  {portfolios.map((portfolio) => (
                    <div
                      key={portfolio.id}
                      onClick={() => navigate('/portfolio-detail', { state: { portfolioName: portfolio.name } })}
                      className="grid grid-cols-12 gap-4 px-4 py-4 hover:bg-neutral-900 cursor-pointer transition-colors"
                    >
                      {/* Name */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded ${portfolio.color} flex items-center justify-center flex-shrink-0`}>
                          <FolderKanban className={`w-4 h-4 ${portfolio.color === 'bg-neutral-700' ? 'text-neutral-400' : 'text-white'}`} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{portfolio.name}</div>
                          <div className="text-xs text-neutral-400">
                            {portfolio.projectCount} {portfolio.projectCount === 1 ? 'project' : 'projects'}
                          </div>
                        </div>
                      </div>

                      {/* Members */}
                      <div className="col-span-3 flex items-center">
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-neutral-900 border-2 border-neutral-950">
                            AY
                          </div>
                        </div>
                      </div>

                      {/* Parent portfolios */}
                      <div className="col-span-3 flex items-center">
                        <span className="text-sm text-neutral-500">—</span>
                      </div>

                      {/* Last modified */}
                      <div className="col-span-2 flex items-center">
                        <span className="text-sm text-neutral-400">Just now</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State - Hidden when portfolios exist */}
            <div className="hidden flex-col items-center justify-center py-32 px-8">
              <div className="max-w-2xl text-center">
              {/* Illustration placeholder */}
              <div className="mb-8 flex justify-center">
                <div className="relative w-96 h-64">
                  {/* Portfolio preview illustration */}
                  <div className="bg-neutral-800 rounded-lg p-4 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-700">
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-xs">📊</span>
                      </div>
                      <div className="text-xs text-neutral-400">Team Initiatives</div>
                      <div className="ml-auto">
                        <div className="flex -space-x-2">
                          <div className="w-5 h-5 rounded-full bg-red-500 border border-neutral-800" />
                          <div className="w-5 h-5 rounded-full bg-blue-500 border border-neutral-800" />
                          <div className="w-5 h-5 rounded-full bg-green-500 border border-neutral-800" />
                        </div>
                      </div>
                    </div>

                    {/* Table header */}
                    <div className="grid grid-cols-6 gap-2 mb-2 text-[10px] text-neutral-500">
                      <div className="col-span-2">Project</div>
                      <div>Status</div>
                      <div>Progress</div>
                      <div>Owner</div>
                      <div>Timeline</div>
                    </div>

                    {/* High Priority Section */}
                    <div className="mb-3">
                      <div className="text-[10px] text-neutral-400 mb-1">• High Priority</div>
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="grid grid-cols-6 gap-2 py-1.5 text-[9px]">
                          <div className="col-span-2 flex items-center gap-1">
                            <div className={`w-1 h-1 rounded-full ${
                              i === 1 ? 'bg-green-500' : i === 2 ? 'bg-red-500' : i === 3 ? 'bg-pink-500' : 'bg-orange-500'
                            }`} />
                            <div className="h-2 bg-neutral-700 rounded flex-1" />
                          </div>
                          <div>
                            {i === 1 ? (
                              <div className="h-2 w-10 bg-green-600 rounded" />
                            ) : i === 2 ? (
                              <div className="h-2 w-10 bg-red-600 rounded" />
                            ) : (
                              <div className="h-2 w-10 bg-neutral-700 rounded" />
                            )}
                          </div>
                          <div>
                            <div className="h-2 bg-neutral-700 rounded" style={{ width: `${80 - i * 10}%` }} />
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                          </div>
                          <div className="h-2 bg-neutral-700 rounded" />
                        </div>
                      ))}
                    </div>

                    {/* Medium Priority Section */}
                    <div>
                      <div className="text-[10px] text-neutral-400 mb-1">• Medium Priority</div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="grid grid-cols-6 gap-2 py-1.5 text-[9px]">
                          <div className="col-span-2 flex items-center gap-1">
                            <div className={`w-1 h-1 rounded-full ${
                              i === 1 ? 'bg-purple-500' : i === 2 ? 'bg-cyan-500' : 'bg-pink-500'
                            }`} />
                            <div className="h-2 bg-neutral-700 rounded flex-1" />
                          </div>
                          <div>
                            <div className="h-2 w-10 bg-neutral-700 rounded" />
                          </div>
                          <div>
                            <div className="h-2 bg-neutral-700 rounded" style={{ width: `${60 - i * 10}%` }} />
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                          </div>
                          <div className="h-2 bg-neutral-700 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-3">Get the big picture with portfolios</h2>
              <p className="text-neutral-400 mb-6 max-w-xl mx-auto">
                Monitor status and team-member workload across multiple projects. Asana can help you set up your first portfolio.
              </p>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                  Explore portfolios
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Create Portfolio Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-lg w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-neutral-800 rounded"
                >
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold text-white">New portfolio</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-neutral-800 rounded"
              >
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Side - Form */}
              <div className="w-1/2 p-6 overflow-y-auto border-r border-neutral-800">
                {/* Portfolio Name */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Portfolio name
                  </label>
                  <input
                    type="text"
                    value={portfolioName}
                    onChange={(e) => setPortfolioName(e.target.value)}
                    placeholder="e.g. Marketing initiatives, Engineering projects"
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Privacy */}
                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Privacy
                  </label>
                  <button
                    onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                    className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white flex items-center justify-between hover:bg-neutral-750"
                  >
                    <span className="text-sm">{privacyOption}</span>
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  </button>
                  {showPrivacyDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg py-2 z-10">
                      <button
                        onClick={() => {
                          setPrivacyOption('Public to My workspace');
                          setShowPrivacyDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-700 transition-colors"
                      >
                        <div className="font-medium">Public to My workspace</div>
                        <div className="text-xs text-neutral-400 mt-0.5">All members can see this portfolio</div>
                      </button>
                      <button
                        onClick={() => {
                          setPrivacyOption('Private to portfolio members');
                          setShowPrivacyDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-neutral-700 transition-colors"
                      >
                        <div className="font-medium">Private to portfolio members</div>
                        <div className="text-xs text-neutral-400 mt-0.5">Only portfolio members can see this</div>
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-neutral-400 mt-1">
                    {privacyOption === 'Public to My workspace'
                      ? 'All members can see this portfolio'
                      : 'Only portfolio members can see this'}
                  </p>
                </div>

                {/* Default View */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-300 mb-3">
                    Default view
                  </label>
                  <div className="space-y-2">
                    {/* List View */}
                    <button
                      onClick={() => setSelectedView('list')}
                      className={`w-full p-4 rounded-lg border-2 transition-colors ${
                        selectedView === 'list'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-750'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <List className="w-5 h-5 text-neutral-300" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">List</div>
                          <div className="text-xs text-neutral-400">View items in a list</div>
                        </div>
                      </div>
                    </button>

                    {/* Timeline View */}
                    <button
                      onClick={() => setSelectedView('timeline')}
                      className={`w-full p-4 rounded-lg border-2 transition-colors ${
                        selectedView === 'timeline'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-750'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-neutral-300" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">Timeline</div>
                          <div className="text-xs text-neutral-400">Visualize your plan on a timeline</div>
                        </div>
                      </div>
                    </button>

                    {/* Workload View */}
                    <button
                      onClick={() => setSelectedView('workload')}
                      className={`w-full p-4 rounded-lg border-2 transition-colors ${
                        selectedView === 'workload'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-neutral-700 bg-neutral-800 hover:bg-neutral-750'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BarChart2 className="w-5 h-5 text-neutral-300" />
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">Workload</div>
                          <div className="text-xs text-neutral-400">See how work is distributed</div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - Preview */}
              <div className="w-1/2 p-6 bg-neutral-950">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-neutral-300 mb-2">Preview</h3>
                  <p className="text-xs text-neutral-400">See how your portfolio will look</p>
                </div>

                {/* Preview Content */}
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-4">
                  {/* Preview Header */}
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
                    <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center text-xs">
                      📊
                    </div>
                    <span className="text-sm text-neutral-300">Portfolio preview</span>
                  </div>

                  {/* List Preview */}
                  {selectedView === 'list' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-2 hover:bg-neutral-800 rounded">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-neutral-700 rounded w-32"></div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                      </div>
                      <div className="flex items-center gap-3 p-2 hover:bg-neutral-800 rounded">
                        <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-neutral-700 rounded w-40"></div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                      </div>
                      <div className="flex items-center gap-3 p-2 hover:bg-neutral-800 rounded">
                        <div className="w-3 h-3 bg-pink-500 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-neutral-700 rounded w-36"></div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-red-500"></div>
                      </div>
                      <div className="flex items-center gap-3 p-2 hover:bg-neutral-800 rounded">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <div className="flex-1">
                          <div className="h-2 bg-neutral-700 rounded w-28"></div>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-green-500"></div>
                      </div>
                    </div>
                  )}

                  {/* Timeline Preview */}
                  {selectedView === 'timeline' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-neutral-500">Q1</div>
                        <div className="flex-1 h-6 bg-green-500/20 border-l-4 border-green-500 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-neutral-500">Q2</div>
                        <div className="flex-1 h-6 bg-yellow-500/20 border-l-4 border-yellow-500 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-neutral-500">Q3</div>
                        <div className="flex-1 h-6 bg-pink-500/20 border-l-4 border-pink-500 rounded"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-neutral-500">Q4</div>
                        <div className="flex-1 h-6 bg-blue-500/20 border-l-4 border-blue-500 rounded"></div>
                      </div>
                    </div>
                  )}

                  {/* Workload Preview */}
                  {selectedView === 'workload' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-blue-500"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-blue-500 rounded" style={{ width: '80%' }}></div>
                        </div>
                        <div className="text-xs text-neutral-400">8h</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-purple-500"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-purple-500 rounded" style={{ width: '60%' }}></div>
                        </div>
                        <div className="text-xs text-neutral-400">6h</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-green-500 rounded" style={{ width: '40%' }}></div>
                        </div>
                        <div className="text-xs text-neutral-400">4h</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-500"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-red-500 rounded" style={{ width: '90%' }}></div>
                        </div>
                        <div className="text-xs text-neutral-400">9h</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-end gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreatePortfolio}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!portfolioName.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
