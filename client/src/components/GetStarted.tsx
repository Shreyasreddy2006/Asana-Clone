import { ChevronRight } from "lucide-react";

const GetStarted = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get started easily
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-2xl">
            Tour the platform, read a few deep dives, or kickstart your work management journey with the right template.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Try the Asana demo */}
            <div className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow group cursor-pointer border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Try the Asana demo
              </h3>
              <p className="text-gray-600 mb-6">See Asana in action</p>
              <button className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full group-hover:bg-gray-800 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Discover resources */}
            <div className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow group cursor-pointer border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Discover resources
              </h3>
              <p className="text-gray-600 mb-6">Help articles and tutorials</p>
              <button className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full group-hover:bg-gray-800 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Start with a template */}
            <div className="bg-white rounded-xl p-8 hover:shadow-lg transition-shadow group cursor-pointer border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Start with a template
              </h3>
              <p className="text-gray-600 mb-6">Get started faster with a template</p>
              <button className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full group-hover:bg-gray-800 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
