import React, { useContext } from "react";
import Hero from "../Components/Hero";
import Biography from "../Components/Biography";
import MessageForm from "../Components/MessageForm";
import Departments from "../Components/Departments";
import CardsDicas from "../Components/CardsDicas";

const Home = () => {
  return (
    <>
      <Hero
        title={
          'O melhor suporte no cuidado para seu melhor amigo!'
        }
        imageUrl={"/hero.png"}
      />
      <CardsDicas />
      <Biography imageUrl={"/about.png"} />
      <Departments />
      <MessageForm />
    </>
  );
};

export default Home;
