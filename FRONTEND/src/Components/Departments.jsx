import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { clinicaveterinaria, cirurgia, dermatologia, odontologia, cardiologia, neurologia, oncologia, endocrinologia, comportamentoAnimal, nutricao } from "../assets";
import { Link } from "react-router-dom";

const Departments = () => {
  const departmentsArray = [
    {
      name: "Clínica Geral",
      imageUrl: clinicaveterinaria,
      description: "Cuidados preventivos e tratamentos gerais para seus pets.",
    },
    {
      name: "Cirurgia",
      imageUrl: cirurgia,
      description: "Cirurgias veterinárias com equipamentos modernos.",
    },
    {
      name: "Dermatologia Veterinária",
      imageUrl: dermatologia,
      description: "Tratamento especializado para problemas de pele.",
    },
    {
      name: "Odontologia",
      imageUrl: odontologia,
      description: "Cuidados dentários para manter a saúde bucal dos pets.",
    },
    {
      name: "Cardiologia",
      imageUrl: cardiologia,
      description: "Especialistas em saúde cardiovascular para animais.",
    },
    {
      name: "Neurologia",
      imageUrl: neurologia,
      description: "Diagnóstico e tratamento de condições neurológicas.",
    },
    {
      name: "Oncologia",
      imageUrl: oncologia,
      description: "Tratamento de câncer com foco na qualidade de vida.",
    },
    {
      name: "Endocrinologia",
      imageUrl: endocrinologia,
      description: "Tratamento de doenças hormonais e metabólicas.",
    },
    {
      name: "Comportamento Animal",
      imageUrl: comportamentoAnimal,
      description: "Apoio em questões comportamentais e emocionais.",
    },
    {
      name: "Nutrição",
      imageUrl: nutricao,
      description: "Planos nutricionais personalizados para a saúde ideal.",
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
    <div className="container departments">
      <h2>Departamentos</h2>
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {departmentsArray.map((depart, index) => (
          <div key={index} className="card">
            <img src={depart.imageUrl} alt={depart.name} className="card-image" />
            <div className="card-content">
              <h3 className="depart-name">{depart.name}</h3>
              <p className="depart-description">{depart.description}</p>
            </div>
          </div>
        ))}
      </Carousel>

      <Link to={"/appointment"} >
        <button className="btn-cta">
          Agende sua Consulta
        </button>
      </Link>
    </div>
  );
};

export default Departments;
