import React from "react";
import './Biography.css'
import { sobrenos } from "../assets";


const Biography = ({ imageUrl }) => {
  return (
    <>
      <div className="container biography">
        <div className="banner">
          <img id="bannerclinica" src={sobrenos} alt="Quem somos" />
        </div>
        <div className="banner">
          <h3>Quem Somos</h3>
          <p>
            A Pet Pals é uma clínica veterinária dedicada ao cuidado e bem-estar dos seus animais de estimação. Fundada com o objetivo de oferecer serviços de alta qualidade e atenção personalizada, nossa equipe de profissionais é apaixonada por cuidar dos seus pets como se fossem nossos.
          </p>
          <p>
            Nossos serviços incluem atendimento clínico geral, cirurgia, dermatologia veterinária, odontologia, cardiologia, neurologia, oncologia, endocrinologia, emergência, comportamento animal e nutrição. 
          </p>
          <p>
            Na Pet Pals, acreditamos que a saúde dos animais é essencial para a felicidade e qualidade de vida deles. Por isso, nos dedicamos a oferecer os melhores cuidados, com tecnologia de ponta e um atendimento personalizado que faz a diferença.
          </p>
          <p>
            Venha conhecer nossos serviços e experimente a diferença de ter uma equipe de especialistas ao seu lado. Seu pet merece o melhor, e nós estamos aqui para garantir isso.
          </p>
        </div>
      </div>
    </>
  );
};

export default Biography;
