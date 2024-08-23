import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone, FaTwitter, FaFacebook, FaInstagram, FaWhatsapp, FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { logo, perfil } from "../assets";
import './Footer.css';

const Footer = () => {
  const hours = [
    { id: 1, day: "Segunda-feira", time: "7:00 - 23:00" },
    { id: 2, day: "Terça-feira", time: "7:00 - 23:00" },
    { id: 3, day: "Quarta-feira", time: "7:00 - 22:00" },
    { id: 4, day: "Quinta-feira", time: "7:00 - 23:00" },
    { id: 5, day: "Sexta-feira", time: "7:00 - 22:00" },
    { id: 6, day: "Sábado", time: "9:00 - 15:00" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="container">
      <hr />
      <div className="links">
        <div>
          <Link to={"/"}>
            <img src={logo} alt="logo" className="logo-img" />
          </Link>
        </div>
        <div>
          <h4>Links Rápidos</h4>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/appointment">Agendamento</Link></li>
            <li><Link to="/about">Sobre</Link></li>
            <li> <Link to="/nossosservicos">Serviços</Link></li>
          </ul>
        </div>
        <div>
          <h4>Horários</h4>
          <ul>
            {hours.map((element) => (
              <li key={element.id}>
                <span>{element.day}</span>
                <span>{element.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <div>
            <FaPhone />
            <span> 999-999-9999</span>
          </div>
          <div>
            <MdEmail />
            <span> petpals@gmail.com</span>
          </div>
          <div>
            <FaLocationArrow />
            <span> São Paulo, Brasil</span>
          </div>
          <div className="social-icons">
            <ul>
              <li>
                <a href="https://x.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#F4C32F' }}>
                  <FaTwitter />
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#F4C32F' }}>
                  <FaFacebook />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#F4C32F' }}>
                  <FaInstagram />
                </a>
              </li>
              <li>
                <a href="https://whatsapp.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#F4C32F' }}>
                  <FaWhatsapp />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <div className="footer-direito">
        <p>© {currentYear} Pet Pals. Todos os direitos reservados.</p>
      </div>
      <div className="perfil">
        <ul className="perfil-icons">
          <li><a href="https://github.com/Joycemasalla" target="_blank" rel="noopener noreferrer"><FaGithub /> </a></li>
          <li><a href="https://www.instagram.com/joycemasalla/" target="_blank" rel="noopener noreferrer"><img src={perfil} style={{ width: "32px" }} alt="Perfil" /></a></li>
          <li><a href="https://www.linkedin.com/in/joyce-masalla-9ba9412a3/" target="_blank" rel="noopener noreferrer"><FaLinkedin /> </a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
