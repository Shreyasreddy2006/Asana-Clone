const Footer = () => {
  const footerSections = {
    "New to Asana?": [
      "Product overview",
      "All features",
      "Latest feature release",
      "Pricing",
      "Starter plan",
      "Advanced plan",
      "Enterprise",
      "App integrations",
      "AI work management",
      "Project management",
      "Resource management",
    ],
    "Use cases": [
      "Campaign management",
      "Content calendar",
      "Creative production",
      "Goal management",
      "New hire onboarding",
      "Organizational planning",
      "Product launches",
      "Resource planning",
      "Strategic planning",
      "Project intake",
      "All use cases",
    ],
    "Solutions": [
      "Small business",
      "Marketing",
      "Operations",
      "IT",
      "Product",
      "Sales",
      "Healthcare",
      "Retail",
      "Education",
      "Nonprofits",
      "Startups",
      "All teams",
    ],
    "Resources": [
      "Help Center",
      "Get support",
      "Asana Academy",
      "Certifications",
      "Events and webinars",
      "Project templates",
      "Customer Success",
      "Developers and API",
      "Partners",
      "Resource center",
      "Sitemap",
    ],
    "Company": [
      "About us",
      "Leadership",
      "Customers",
      "Culture",
      "Press",
      "Careers",
      "Inside Asana",
      "Investor relations",
      "Trust and security",
      "Supplier responsibility",
      "Sustainability and ESG",
    ],
  };

  return (
    <footer className="text-white py-16" style={{ backgroundColor: '#690031' }}>
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
            {Object.entries(footerSections).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-semibold text-white mb-4 text-sm">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div className="flex items-center gap-3">
                <img src="/asana-logo.png" alt="Asana" width="32" height="32" className="w-8 h-8 object-contain" />
              </div>

              <div className="flex items-center gap-4">
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-sm">🌐</span>
                </button>
                <select className="bg-transparent border border-white/30 rounded px-3 py-1 text-sm text-white">
                  <option value="en" style={{ backgroundColor: '#690031' }}>English</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-white/60">
              <p>© 2025 Asana, Inc.</p>
              <div className="flex flex-wrap gap-6">
                <a href="#" className="hover:text-white transition-colors">
                  Terms & Privacy
                </a>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <a
                href="#"
                className="px-6 py-3 bg-white rounded hover:bg-gray-100 transition-colors font-medium text-sm"
                style={{ color: '#690031' }}
              >
                Download on the App Store
              </a>
              <a
                href="#"
                className="px-6 py-3 bg-white rounded hover:bg-gray-100 transition-colors font-medium text-sm"
                style={{ color: '#690031' }}
              >
                Get it on Google Play
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
