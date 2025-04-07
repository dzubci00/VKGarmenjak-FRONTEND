import React from "react";
import Button from "../../shared/components/FormElements/Button";
import "../components/Hero.css";

const Hero = () => {
  return (
    <section className="homepage">
      <div className="overlay"></div>
      <div className="content">
        <div className="text">
          <h1>
            Dobrodošli na službenu stranicu<br></br>VK Garmenjak
          </h1>
          <h2>Prvi i jedini vaterpolo klub na otoku Pašmanu</h2>
          <p>
            Klub osnovan 2021. godine.<br></br> U 2023. godini pridružili smo se{" "}
            <strong>VAL ligi</strong>, gdje se natječemo s amaterskim i
            veteranskim klubovima.
          </p>
        </div>
        <Button join>Pridruži se</Button>
      </div>
    </section>
  );
};

export default Hero;
