import Hero from "../Components/Hero";
import Biography from "../Components/Biography";
import MessageForm from "../Components/MessageForm";
import Departments from "../Components/Departments";
import CardsDicas from "../Components/CardsDicas";
import Servicos from "../Components/Servicos";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    // Rola para o topo da página quando o componente for montado
    window.scrollTo(0, 0);
  }, []);
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
      <Servicos />
      <MessageForm />
    </>
  );
};

export default Home;
