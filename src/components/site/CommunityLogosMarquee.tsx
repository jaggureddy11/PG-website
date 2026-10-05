import React from "react";

interface InstitutionLogo {
  name: string;
  category: "University" | "Enterprise" | "College";
  logoSrc: string;
  customStyle?: React.CSSProperties;
}

const INSTITUTIONS: InstitutionLogo[] = [
  {
    name: "PES University",
    category: "University",
    logoSrc: "/logos/pes.png",
    customStyle: { height: "44px" }
  },
  {
    name: "Tata Consultancy Services (TCS)",
    category: "Enterprise",
    logoSrc: "/logos/tcs.svg",
    customStyle: { height: "34px" }
  },
  {
    name: "B.M.S. College of Engineering",
    category: "College",
    logoSrc: "/logos/bmsce.svg",
    customStyle: { height: "52px" }
  },
  {
    name: "Dayananda Sagar University",
    category: "University",
    logoSrc: "/logos/dsu.png",
    customStyle: { height: "46px" }
  },
  {
    name: "Infosys",
    category: "Enterprise",
    logoSrc: "/logos/infosys.svg",
    customStyle: { height: "30px" }
  },
  {
    name: "Christ University",
    category: "University",
    logoSrc: "/logos/christ.png",
    customStyle: { height: "50px" }
  },
  {
    name: "RV College of Engineering",
    category: "College",
    logoSrc: "/logos/rvce.png",
    customStyle: { height: "48px" }
  },
  {
    name: "Wipro",
    category: "Enterprise",
    logoSrc: "/logos/wipro.svg",
    customStyle: { height: "36px" }
  },
  {
    name: "Accenture",
    category: "Enterprise",
    logoSrc: "/logos/accenture.svg",
    customStyle: { height: "28px" }
  },
  {
    name: "Microsoft",
    category: "Enterprise",
    logoSrc: "/logos/microsoft.svg",
    customStyle: { height: "28px" }
  }
];

export const CommunityLogosMarquee: React.FC = () => {
  // Duplicate list twice for a smooth infinite continuous loop
  const duplicatedInstitutions = [...INSTITUTIONS, ...INSTITUTIONS];

  return (
    <section className="community-section" id="community" aria-label="Our Community of Students and Professionals">
      <div className="container">
        <div className="community-header" data-reveal>
          <span className="community-eyebrow">OUR COMMUNITY</span>
          <h2 className="community-title">
            Trusted by Students and Professionals from Leading Institutions
          </h2>
        </div>
      </div>

      {/* Infinite Rolling Marquee Track with Smooth Left/Right Fades */}
      <div className="community-marquee-wrapper">
        <div className="community-marquee-fade community-marquee-fade--left" aria-hidden="true" />
        <div className="community-marquee-fade community-marquee-fade--right" aria-hidden="true" />

        <div className="community-marquee-track">
          {duplicatedInstitutions.map((item, idx) => (
            <div 
              key={`${item.name}-${idx}`} 
              className="community-logo-item"
              title={`${item.name} (${item.category})`}
            >
              <img
                src={item.logoSrc}
                alt={`${item.name} Logo`}
                className="community-logo-img"
                style={item.customStyle}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
