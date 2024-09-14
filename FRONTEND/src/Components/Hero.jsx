import React, { useEffect, useState } from "react";
import { petspulando, setaparacima } from "../assets";
import './Hero.css'
import { FaPhone } from "react-icons/fa";

const Hero = ({ title, imageUrl }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showBackToTop, setShowBackToTop] = useState(false);

  function backToTop() {
    document.documentElement.scrollTop = 0;
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) { // Exibir o ícone se a rolagem for maior que 300px
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Chama handleScroll inicialmente para definir o estado correto
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div id="voltarTopo" className={showBackToTop ? 'show' : ''}>
        <button onClick={backToTop} id="subir">
          <img src={setaparacima} alt="Voltar ao topo" />
        </button>
      </div>
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
