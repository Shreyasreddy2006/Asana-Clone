const Footer = () => {
  const footerLinks = {
    Product: ["All features", "Pricing", "Premium", "Business", "Enterprise", "Asana AI"],
    Company: ["About us", "Leadership", "Customers", "Diversity", "Careers", "Press"],
    Resources: ["Help Center", "Forum", "Support", "App Directory", "Developers & API", "Partners"],
    Learn: ["Guide", "Webinars", "Customer stories", "Templates", "What's new"],
  };

  return (
    <footer className="bg-muted/30 border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="6" fill="#F06A6A"/>
                <circle cx="16" cy="16" r="6" fill="#FFB900"/>
                <circle cx="12" cy="12" r="4" fill="#FCB400"/>
              </svg>
              <span className="font-semibold text-foreground">asana</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Security</a>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Asana, Inc.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
