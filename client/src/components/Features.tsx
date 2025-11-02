import { Button } from "@/components/ui/button";

const Features = () => {
  return (
    <section className="py-24" style={{ backgroundColor: '#cbefff' }}>
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-20 text-left">
            What sets Asana apart
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - More clarity and accountability */}
            <div className="rounded-2xl p-12 text-white flex flex-col justify-between min-h-[500px]" style={{ backgroundColor: '#222875' }}>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  More clarity and
                  <br />
                  accountability
                </h3>
                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  Connect strategic goals to the teams that help achieve them. Keep your company on track with AI working alongside your teams.
                </p>
              </div>
              <Button
                variant="outline"
                className="self-start px-8 py-6 rounded-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium"
              >
                Learn about goals
              </Button>
            </div>

            {/* Right Column - Amplify your impact with AI */}
            <div className="rounded-2xl p-12 text-white flex flex-col justify-between min-h-[500px] relative overflow-hidden" style={{ backgroundColor: '#222875' }}>
              <div>
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  Amplify your impact
                  <br />
                  with AI
                </h3>
                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  Let Asana AI handle work for you—with the full context of your business—so your teams can achieve their goals faster.
                </p>
              </div>

              {/* AI Activity Card */}
              <div className="bg-white rounded-xl p-6 text-gray-900 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <p className="text-sm">
                      <span className="font-semibold">Nick</span> submitted a request to the 📺 Marketing Team
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center text-xs">
                      ✨
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold">Asana AI</span> set Priority to{" "}
                      <span className="inline-block bg-purple-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                        High
                      </span>
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 mt-4">
                    <div className="flex items-start gap-2 mb-3">
                      <div className="w-5 h-5 bg-pink-100 rounded flex items-center justify-center text-xs flex-shrink-0">
                        ✨
                      </div>
                      <p className="text-sm font-semibold">Asana AI completed research</p>
                    </div>
                    <p className="text-sm text-gray-700 ml-7">
                      Here are some insights I've found about your target audience for this campaign:
                    </p>
                    <div className="ml-7 mt-2 space-y-1">
                      <a href="#" className="text-sm text-blue-600 hover:underline block">
                        🔗 Source
                      </a>
                      <a href="#" className="text-sm text-blue-600 hover:underline block">
                        🔗 Source
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="w-6 h-6 bg-pink-100 rounded flex items-center justify-center text-xs">
                      ✨
                    </div>
                    <p className="text-sm">
                      <span className="font-semibold">Asana AI</span> assigned to{" "}
                      <span className="inline-flex items-center gap-1">
                        <span className="w-5 h-5 bg-gray-300 rounded-full"></span>
                        <span className="font-medium">Kai</span>
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="self-start px-8 py-6 rounded-full bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium"
              >
                Meet Asana AI
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
