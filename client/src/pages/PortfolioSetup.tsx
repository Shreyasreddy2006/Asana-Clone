import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PortfolioSetup() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Left Side - Options */}
      <div className="w-1/2 flex flex-col p-8">
        <button
          onClick={() => navigate('/portfolios')}
          className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 w-fit"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Back</span>
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h1 className="text-3xl font-semibold text-white mb-2">What do you want to do first?</h1>

          <div className="space-y-4 mt-8">
            {/* Start adding projects */}
            <button
              onClick={() => setSelectedOption('add-projects')}
              className={`w-full p-6 rounded-lg border-2 transition-colors text-left ${
                selectedOption === 'add-projects'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Start adding projects</h3>
                  <p className="text-sm text-neutral-400">Add projects and track their progress</p>
                </div>
              </div>
            </button>

            {/* Share with teammates */}
            <button
              onClick={() => setSelectedOption('share-teammates')}
              className={`w-full p-6 rounded-lg border-2 transition-colors text-left ${
                selectedOption === 'share-teammates'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-neutral-700 bg-neutral-900 hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Share with teammates</h3>
                  <p className="text-sm text-neutral-400">Invite teammates to collaborate</p>
                </div>
              </div>
            </button>
          </div>

          <Button
            onClick={() => navigate('/portfolio-detail')}
            className="bg-blue-600 hover:bg-blue-700 text-white mt-8 w-full py-6 text-base"
          >
            Go to portfolio
          </Button>
        </div>
      </div>

      {/* Right Side - Preview */}
      <div className="w-1/2 bg-neutral-900 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Portfolio Preview Header */}
          <div className="bg-neutral-950 rounded-t-lg p-4 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-neutral-700 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <div className="h-3 bg-blue-500 rounded w-16"></div>
                  <div className="h-3 bg-neutral-700 rounded w-20"></div>
                  <div className="h-3 bg-neutral-700 rounded w-20"></div>
                  <div className="h-3 bg-neutral-700 rounded w-20"></div>
                  <div className="h-3 bg-neutral-700 rounded w-20"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-neutral-700"></div>
                <div className="w-6 h-6 rounded-full bg-neutral-700"></div>
                <div className="w-6 h-6 rounded-full bg-neutral-700"></div>
              </div>
            </div>
          </div>

          {/* Timeline Visualization */}
          <div className="bg-neutral-950 rounded-b-lg p-8 border-x border-b border-neutral-800 space-y-6">
            {/* Row 1 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-neutral-950"></div>
                <div className="w-32 h-8 bg-blue-400 rounded"></div>
              </div>
              <div className="flex-1 relative flex items-center">
                <div className="absolute left-0 w-32 h-0.5 bg-neutral-600"></div>
                <div className="ml-32 w-40 h-8 bg-orange-400 rounded flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-neutral-950 border-2 border-orange-400"></div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-4 pl-8">
              <div className="w-64 h-8 bg-cyan-300 rounded flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-neutral-950 border-2 border-cyan-300"></div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex items-center gap-4 pl-16">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-400 rounded"></div>
                <div className="relative flex items-center">
                  <div className="w-32 h-0.5 bg-neutral-600"></div>
                  <div className="ml-2 w-40 h-8 bg-purple-400 rounded flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-neutral-950 border-2 border-purple-400"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="flex items-center gap-4 pl-8">
              <div className="w-56 h-8 bg-green-400 rounded flex items-center pl-3">
                <div className="w-6 h-6 rounded-full bg-neutral-950 border-2 border-green-400"></div>
              </div>
            </div>

            {/* Row 5 */}
            <div className="flex items-center gap-4 pl-16">
              <div className="w-32 h-8 bg-purple-300 rounded flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-neutral-950 border-2 border-purple-300"></div>
              </div>
            </div>

            {/* Row 6 */}
            <div className="flex items-center gap-4 pl-20">
              <div className="w-48 h-8 bg-pink-300 rounded flex items-center pl-3">
                <div className="w-6 h-6 rounded-full bg-neutral-950 border-2 border-pink-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={() => navigate('/portfolios')}
        className="absolute top-4 right-4 p-2 hover:bg-neutral-800 rounded text-neutral-400"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}
