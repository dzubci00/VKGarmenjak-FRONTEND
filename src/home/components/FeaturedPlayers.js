import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeaturedPlayers.css";

const players = [
  {
    name: "Bepo Dušković",
    position: "Napadač",
    image: "/images/sukno.jpg",
    description: "Najbrži plivač i najbolji kradljivac ekipe.",
  },
  {
    name: "Roko Dondživić",
    position: "Napadač",
    image: "/images/azevedo.jpg",
    description: "Izvanredan u obrani, s nevjerojatnim repertoarom šuteva.",
  },
  {
    name: "Valentin Rukavina",
    position: "Golman",
    image: "/images/sukno.jpg",
    description: "Fantastične obrane i nevjerojatni refleksi.",
  },
  {
    name: "Luka Mrvičić",
    position: "Centar",
    image: "/images/sukno.jpg",
    description:
      "Majstor pozicioniranja – uvijek pronađe način da se izbori za gol.",
  },
];

const FeaturedPlayers = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,

    responsive: [
      {
        breakpoint: 767,
        settings: {
          arrows: false,
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <section className="featured-players">
      <h3>Igrači u fokusu </h3>
      <Slider {...settings}>
        {players.map((player, index) => (
          <div key={index} className="player-card">
            <img src={player.image} alt={player.name} />
            <div className="player-info">
              <h4>{player.name}</h4>
              <p className="position">{player.position}</p>
              <p className="description">{player.description}</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default FeaturedPlayers;
