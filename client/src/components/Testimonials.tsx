import { ChevronLeft, ChevronRight } from "lucide-react";

const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              The world's top
              <br />
              companies trust Asana
            </h2>
            <div className="flex gap-4">
              <button className="p-3 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <button className="p-3 rounded-full bg-black hover:bg-gray-800 transition-colors">
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div className="bg-blue-100 rounded-2xl p-12 md:p-16">
            <div className="flex items-center gap-8 mb-8">
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-3xl">D</span>
              </div>
            </div>

            <blockquote className="mb-8">
              <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                "Asana makes everything shareable, which saves us time executing programs because it's so much easier to replicate and learn from what others have done.
              </p>
            </blockquote>

            <div className="space-y-2">
              <p className="text-base font-semibold text-gray-900">Simon Levinson</p>
              <p className="text-base text-gray-700">
                Global Digital Manufacturing Process Innovation Manager, Danone
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">COMPANY SIZE</p>
                  <p className="text-lg font-bold text-gray-900">Enterprise</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-50 transition-colors"
            >
              See all case studies
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
