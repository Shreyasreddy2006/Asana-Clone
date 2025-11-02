import { Button } from "@/components/ui/button";

const Integrations = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect over 300+
            <br />
            integrations
          </h2>
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            Asana connects with the enterprise tools your organization already uses, right out of the box.
          </p>

          <Button className="px-8 py-6 bg-black text-white hover:bg-gray-800 rounded-full font-medium text-base mb-16">
            See all integrations
          </Button>

          {/* Integration logos grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl mx-auto">
            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">SF</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Salesforce</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">O</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Outlook</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">S</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Slack</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-blue-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">Z</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Zendesk</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">T</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Tableau</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">F</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Figma</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">M</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Miro</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">V</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Vimeo</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-blue-400 rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">D</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Dropbox</p>
              </div>
            </div>

            <div className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">⚡</span>
                </div>
                <p className="text-sm font-medium text-gray-700">Power BI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Integrations;
