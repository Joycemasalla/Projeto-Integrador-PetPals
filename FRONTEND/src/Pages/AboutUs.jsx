import React from "react";
import Hero from "../Components/Hero";
import Biography from "../Components/Biography";
const AboutUs = () => {
  return (
    <>
      <Hero
        title={"Saiba mais sobre nós | PetPal Clínica Veterinária"}
        imageUrl={"/about.png"}
      />
      <Biography imageUrl={"/whoweare.png"} />
    </>
  );
};

export default AboutUs;
