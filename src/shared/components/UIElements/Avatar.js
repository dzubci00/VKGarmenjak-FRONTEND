import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css"; // Dodaje blur efekt dok se slika učitava

import "./Avatar.css";

const Avatar = (props) => {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <LazyLoadImage
        src={props.image}
        alt={props.alt}
        effect="blur" // Blur efekt dok se slika učitava
        width={props.width}
        height={props.width}
        style={{ borderRadius: "50%" }} // Ako je avatar okrugao
      />
    </div>
  );
};

export default Avatar;
