import React from "react";
import Hero from "../Components/Hero";
import AppointmentForm from "../Components/AppointmentForm";

const Appointment = () => {
  return (
    <>
      <Hero
        title={"Agende sua Consulta  PetPal Clínica Veterinária"}
        
      />
      <AppointmentForm/>
    </>
  );
};

export default Appointment;
