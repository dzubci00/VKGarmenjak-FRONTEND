import React from "react";
import "./Sponsors.css";

const sponsors = [
  {
    name: "Općina Pašman",
    logo: "images/pasman.png",
    url: "https://www.opcinapasman.hr",
  },
  {
    name: "Otok Pašman",
    logo: "/images/visit_pasman.jpg",
    url: "https://www.pasman.hr/hr",
  },
  {
    name: "Morski jež",
    logo: "/images/morski-jez-logo.svg",
    url: "https://morskijez.hr/",
  },
  {
    name: "Bodulo",
    logo: "/images/bodulo.png",
    url: "https://www.bodulo-realestate.hr/hr/",
  },
  {
    name: "OPG Matulić",
    logo: "/images/matulic.png",
    url: "https://opgmatulic.com/",
  },
  {
    name: "Verama",
    logo: "/images/verama.webp",
    url: "https://www.verama.hr/",
  },
];

const Sponsors = () => {
  return (
    <section className="sponsors">
      <h3>Sponzori i prijatelji kluba</h3>
      <div className="sponsors-grid">
        {sponsors.map((sponsor, index) => (
          <a
            key={index}
            href={sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={sponsor.logo} alt={sponsor.name} />
          </a>
        ))}
      </div>
    </section>
  );
};

export default Sponsors;
