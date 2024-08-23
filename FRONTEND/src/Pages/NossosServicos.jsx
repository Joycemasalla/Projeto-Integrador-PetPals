import React, { useState } from 'react';
import Departments from '../Components/Departments';
import Hero from '../Components/Hero';
import { FaStethoscope, FaSyringe, FaAmbulance, FaDog, FaCat, FaPlus, FaMinus } from 'react-icons/fa';

const services = [
    {
        title: 'Consulta Veterinária',
        icon: <FaStethoscope />,
        description: 'Oferecemos consultas veterinárias completas para garantir a saúde do seu animal. Nossos especialistas estão prontos para ajudar com diagnósticos e tratamentos.',
        image: 'https://blog-static.petlove.com.br/wp-content/uploads/2020/12/Cachorro-consulta-Petlove.jpg',
        info: 'Uma consulta veterinária pode ajudar a identificar problemas de saúde precocemente, permitindo tratamentos mais eficazes.'
    },
    {
        title: 'Vacinação',
        icon: <FaSyringe />,
        description: 'Mantenha seu pet protegido com nossa ampla gama de vacinas. Garantimos um ambiente seguro e confortável para a vacinação.',
        image: 'https://image.portaldacidade.com/unsafe/https://bucket.portaldacidade.com/resende.portaldacidade.com/img/news/2023-08/veterinario-enfatiza-a-importancia-e-a-eficacia-da-vacina-antirrabica-64ee2057e0e56.jpg',
        info: 'Vacinas são essenciais para prevenir doenças graves e contagiosas, protegendo tanto seu pet quanto outros animais.'
    },
    {
        title: 'Emergência 24h',
        icon: <FaAmbulance />,
        description: 'Disponibilizamos atendimento emergencial 24 horas para situações imprevistas. Nossa equipe está sempre preparada para lidar com urgências.',
        image: 'https://www.valordeplanosdesaude.com.br/wp-content/uploads/2018/05/1057aa9f41d8c31-650x400.jpg',
        info: 'Emergências envolvem situações críticas que requerem atendimento imediato, enquanto urgências são sérias mas não necessariamente fatais.'
    },
    {
        title: 'Cuidados com Animais de Grande Porte',
        icon: <FaDog />,
        description: 'Especializados no cuidado de animais de grande porte. Serviços de saúde, manutenção e bem-estar para seu cavalo ou outro animal grande.',
        image: 'https://blog.faculdadeserradourada.com.br/hubfs/med-veterinaria-serra-dourada-alis.jpg',
        info: 'Os cuidados com animais de grande porte exigem conhecimentos especializados para lidar com suas necessidades específicas.'
    },
    {
        title: 'Check-up Geral',
        icon: <FaStethoscope />,
        description: 'Realizamos check-ups completos para garantir que seu pet esteja sempre saudável. Avaliações periódicas ajudam a prevenir problemas e manter a saúde do seu amigo de quatro patas em dia.',
        image: 'https://blog-static.petlove.com.br/wp-content/uploads/2020/06/Cachorro-checkup-Petlove.jpg',
        info: 'Um check-up geral é essencial para monitorar a saúde contínua do seu pet e detectar possíveis problemas antes que se tornem graves.'
    },
    {
        title: 'Acompanhamento Nutricional',
        icon: <FaCat />,
        description: 'Oferecemos acompanhamento nutricional para garantir a dieta ideal para seu pet, adaptada às suas necessidades específicas.',
        image: 'https://caesegatos.com.br/wp-content/uploads/2021/05/nutricao-1024x664.png',
        info: 'Uma dieta balanceada é crucial para a saúde e bem-estar do seu pet, ajudando a prevenir doenças relacionadas à alimentação.'
    }
];

const NossosServicos = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleInfoClick = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="nossos-servicos">
            <Hero
                title={"Confira Nossos Serviços e Especialidades!"}
            />
            <div className="nossos-servicos-intro">
                <p>
                    Na nossa clínica, oferecemos uma gama completa de serviços veterinários para garantir a saúde e o bem-estar do seu pet.
                    Com uma equipe de especialistas em diversas áreas, estamos preparados para cuidar de todas as necessidades do seu animal,
                    desde a prevenção até tratamentos especializados.
                </p>
            </div>
            <section className="nossos-servicos-list">
                <h1>Nossos Serviços</h1>
                <div className="nossos-servicos-container">
                    {services.map((service, index) => (
                        <div className="nossos-servicos-card" key={index}>
                            <div className="nossos-servicos-icon">{service.icon}</div>
                            <img className="nossos-servicos-image" src={service.image} alt={service.title} />
                            <div className="nossos-servicos-content">
                                <button className="nossos-servicos-info-button" id='maismenos' onClick={() => handleInfoClick(index)}>
                                    {activeIndex === index ? <FaMinus/> :  <FaPlus/>}
                                </button>
                                <h2 className="nossos-servicos-title">{service.title}</h2>
                                <p className="nossos-servicos-description">{service.description}</p>
                                {activeIndex === index && (
                                    <div className="nossos-servicos-info-tooltip">{service.info}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <div className="nossos-servicos-departamentos">
                <Departments />
            </div>
        </div>
    );
};

export default NossosServicos;
