const TrustedBy = () => {
  const companies = [
    { name: "Amazon", logo: "https://assets.asana.biz/transform/94a2af9e-55e7-489b-bcd9-7f2836f5e45f/amazon?io=transform:fill,width:300&format=webp" },
    { name: "Accenture", logo: "https://assets.asana.biz/transform/7aa89522-d837-49fc-ae5b-d8701de258fd/accenture?io=transform:fill,width:300&format=webp" },
    { name: "Johnson & Johnson", logo: "https://assets.asana.biz/transform/64c6de51-290f-40fa-808a-241c6bae8528/JJ?io=transform:fill,width:300&format=webp" },
    { name: "Dell", logo: "https://assets.asana.biz/transform/29c5cd4b-7a60-4557-8004-f78cbb8c5ffc/dell?io=transform:fill,width:300&format=webp" },
    { name: "Merck", logo: "https://assets.asana.biz/transform/8d9b2024-7c0b-463b-88c0-ee3107d4f5fe/merck?io=transform:fill,width:300&format=webp" },
  ];

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-6">
        <h3 className="text-center text-sm font-semibold text-muted-foreground mb-10">
          85% of Fortune 100 companies choose Asana¹
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {companies.map((company) => (
            <div key={company.name} className="opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <img 
                src={company.logo} 
                alt={company.name}
                className="h-8 md:h-10 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
