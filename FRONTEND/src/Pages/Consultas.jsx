import React from "react";
import Hero from "../Components/Hero";
import Agendamentos from "../Components/Agendamentos";

const Consultas = () => {
  return (
    <>
      <Hero
        title={"Acompanhe suas consultas agendadas!"}
      />
      <Agendamentos/>
    </>
  );
};

export default Consultas;
