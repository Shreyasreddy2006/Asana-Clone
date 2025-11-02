const TrustedBy = () => {
  const companies = [
    { name: "Amazon", logo: "https://assets.asana.biz/transform/94a2af9e-55e7-489b-bcd9-7f2836f5e45f/amazon?io=transform:fill,width:300&format=webp" },
    { name: "Accenture", logo: "https://assets.asana.biz/transform/7aa89522-d837-49fc-ae5b-d8701de258fd/accenture?io=transform:fill,width:300&format=webp" },
    { name: "Johnson & Johnson", logo: "https://assets.asana.biz/transform/64c6de51-290f-40fa-808a-241c6bae8528/JJ?io=transform:fill,width:300&format=webp" },
    { name: "Dell", logo: "https://assets.asana.biz/transform/29c5cd4b-7a60-4557-8004-f78cbb8c5ffc/dell?io=transform:fill,width:300&format=webp" },
    { name: "Merck", logo: "https://assets.asana.biz/transform/8d9b2024-7c0b-463b-88c0-ee3107d4f5fe/merck?io=transform:fill,width:300&format=webp" },
  ];

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-left text-base font-normal text-foreground mb-12">
            85% of Fortune 100 companies choose Asana<sup>1</sup>
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-12 md:gap-16">
            {companies.map((company) => (
              <div
                key={company.name}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-10 md:h-12 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
