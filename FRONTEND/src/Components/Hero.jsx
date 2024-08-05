import React from "react";
import { petspulando } from "../assets";
import './Hero.css'
import { FaPhone } from "react-icons/fa";

const Hero = ({ title, imageUrl }) => {
  return (
    <>
      <div className="hero container">
        <div className="banner">
          <h1>{title}</h1>
          <p>
            Na PetPals, tratamos seus pets como parte da
            família, garantindo que eles recebam o melhor tratamento em um ambiente
            amigável e acolhedor.
          </p>
          <div className="emergencia">
            <h6>Atendimento Emergencial</h6>
            <button className="emergencia-button">
            <a href="https://whatsapp.com/" target="blank"> <FaPhone /> Ligar</a>
            </button>
          </div>
        </div>

        <div className="banner">
          <img src={petspulando} alt="hero" className="animated-image" />
          <span>
            <img src="/Vector.png" alt="vector" />
          </span>
        </div>
      </div>
    </>
  );
};

export default Hero;
