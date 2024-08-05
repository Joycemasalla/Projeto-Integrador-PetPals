import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { clinicaveterinaria,cirurgia, dermatologia, odontologia, cardiologia, neurologia, oncologia, endocrinologia, comportamentoAnimal,nutricao } from "../assets";
import './Departments.css'

const Departments = () => {
  const departmentsArray = [
    {
      name: "Clínica Geral",
      imageUrl: clinicaveterinaria,
    },
    {
      name: "Cirurgia",
      imageUrl: cirurgia,
    },
    {
      name: "Dermatologia Veterinária",
      imageUrl: dermatologia,
    },
    {
      name: "Odontologia",
      imageUrl: odontologia,
    },
    {
      name: "Cardiologia",
      imageUrl: cardiologia,
    },
    {
      name: "Neurologia",
      imageUrl: neurologia,
    },
    {
      name: "Oncologia",
      imageUrl: oncologia,
    },
    {
      name: "Endocrinologia",
      imageUrl: endocrinologia,
    },
    {
      name: "Comportamento Animal",
      imageUrl: comportamentoAnimal,
    },
    {
      name: "Nutrição",
      imageUrl: nutricao,
    },
  ];

  const responsive = {
    extraLarge: {
      breakpoint: { max: 3000, min: 1324 },
      items: 4,
      slidesToSlide: 1,
    },
    large: {
      breakpoint: { max: 1324, min: 1005 },
      items: 3,
      slidesToSlide: 1,
    },
    medium: {
      breakpoint: { max: 1005, min: 700 },
      items: 2,
      slidesToSlide: 1,
    },
    small: {
      breakpoint: { max: 700, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  return (
    <>
      <div className="container departments">
        <h2>Departamentos</h2>
        <Carousel
          responsive={responsive}
          removeArrowOnDeviceType={[
            "tablet",
            "mobile",
          ]}
        >
          {departmentsArray.map((depart, index) => (
            <div key={index} className="card">
              <div className="depart-name">{depart.name}</div>
              <img src={depart.imageUrl} alt={depart.name} />
            </div>
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default Departments;
