const Awards = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Forrester Wave Leader */}
            <div className="bg-blue-100 rounded-xl p-8 flex flex-col">
              <div className="mb-6">
                <div className="bg-black text-white px-6 py-8 rounded-lg inline-block">
                  <div className="font-bold text-lg mb-2">FORRESTER</div>
                  <div className="text-2xl font-bold mb-1">WAVE</div>
                  <div className="text-2xl font-bold mb-2">LEADER 2025</div>
                  <div className="text-sm">Collaborative Work</div>
                  <div className="text-sm">Management Tools</div>
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  A Leader in The Forrester Wave: Collaborative Work Management Tools 2025 Report
                </h3>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-base font-semibold text-gray-900 hover:underline"
                >
                  Get the Report
                  <span className="text-xl">→</span>
                </a>
              </div>
            </div>

            {/* Gartner Magic Quadrant */}
            <div className="bg-pink-50 rounded-xl p-8 flex flex-col">
              <div className="mb-6">
                <div className="bg-white px-6 py-8 rounded-lg inline-block border-2 border-gray-200">
                  <div className="text-4xl font-bold text-gray-900 mb-2">Gartner</div>
                  <div className="relative w-48 h-48 mx-auto">
                    <div className="absolute inset-0 rounded-full border-2 border-gray-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-red-400"></div>
                    </div>
                  </div>
                  <div className="text-center mt-2 text-xs text-gray-600">
                    2025 Gartner Magic Quadrant™
                    <br />
                    for Collaborative Work Management
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  A Leader in the 2025 Gartner Magic Quadrant for Collaborative Work Management three years in a row
                </h3>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-base font-semibold text-gray-900 hover:underline"
                >
                  Learn more
                  <span className="text-xl">→</span>
                </a>
              </div>
            </div>

            {/* G2 Best Software */}
            <div className="rounded-xl p-8 flex flex-col text-white" style={{ backgroundColor: '#690031' }}>
              <div className="mb-6">
                <div className="bg-white px-6 py-8 rounded-lg inline-block">
                  <div className="text-center">
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-t-lg inline-block">
                      <span className="font-bold text-sm">BEST SOFTWARE</span>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <span className="text-2xl font-bold">G2</span>
                      </div>
                    </div>
                    <div className="bg-white px-6 py-4 rounded-b-lg border-2 border-orange-500">
                      <div className="text-5xl font-bold text-orange-500 mb-1">Top 100</div>
                      <div className="text-sm font-bold text-gray-900">BEST SOFTWARE</div>
                      <div className="text-sm font-bold text-gray-900">PRODUCTS</div>
                      <div className="text-xs text-gray-600 mt-2">2025</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-auto">
                <h3 className="text-xl font-bold mb-3">
                  A leader in Work Management and OKR Software with more than 12,000 user reviews
                </h3>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-base font-semibold hover:underline"
                >
                  Read user reviews
                  <span className="text-xl">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Awards;
