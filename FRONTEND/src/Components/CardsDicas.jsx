import React, { useState, useEffect } from 'react';
import './CardsDicas.css';
import { adestramento, adocao, alimentacao, cuidados, saude, curiosidades, setaparacima } from '../assets';

const cardData = [
    { id: 1, img: adestramento, title: 'Adestramento', description: 'Corrija comportamentos, eduque, divirta-se e fortaleça a relação com seu pet.', examples: "Recompense o bom comportamento com amor e petiscos para um aprendizado feliz!" },
    { id: 2, img: alimentacao, title: 'Alimentação', description: 'Saiba dietas equilibradas, aprenda sobre dietas caseiras, escolha a melhor ração e muito mais.', examples: "Lembre-se de ajustar a quantidade de ração de acordo com o nível de atividade do seu animal." },
    { id: 3, img: adocao, title: 'Adoção', description: 'Descubra nomes encantadores, dicas, o que fazer e tudo o que você precisa saber para adotar um pet.', examples: "A adoção é a forma mais bonita de mostrar compaixão e mudar vidas." },
    { id: 4, img: saude, title: 'Saúde', description: 'Aprenda tudo o que precisa saber sobre a saúde do seu pet e proteja seu pet de doenças.', examples:"Ofereça água fresca e limpa todos os dias para manter seu pet hidratado e saudável." },
    { id: 5, img: cuidados, title: 'Cuidados', description: 'Entenda o cio, gestação, higiene dental, cuidado das orelhas e muito mais.', examples: "Escove o pelo do seu pet regularmente para evitar nós e reduzir a queda de pelos." },
    { id: 6, img: curiosidades, title: 'Curiosidades', description: 'Aprenda dicas, descubra espécies em perigo de extinção, saiba diversas raças e muito mais.', examples: "Os gatos têm mais ossos em suas colunas vertebrais do que os humanos, o que lhes dá uma incrível flexibilidade." }
];

const CardsDicas = () => {
    const [expandedCardId, setExpandedCardId] = useState(null);

    function backToTop() {
        document.documentElement.scrollTop = 0;
    }

    useEffect(() => {
        const cards = document.querySelectorAll('.dicas');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            observer.observe(card);
        });

        return () => {
            cards.forEach(card => {
                observer.unobserve(card);
            });
        };
    }, []);

    const handleCardClick = (id) => {
        setExpandedCardId(prevId => (prevId === id ? null : id));
    };

    return (
        <>
            <div id="voltarTopo">
                <button onClick={backToTop} id="subir">
                    <img src={setaparacima} alt="Voltar ao topo" />
                </button>
            </div>
            <div className='titulocard'>
                <h2>Clique e conheça dicas essenciais para dar o conforto que o seu pet merece!</h2>
            </div>
            <div className="card-container">
                {cardData.map(card => (
                    <div
                        key={card.id}
                        className={`dicas ${expandedCardId === card.id ? 'expanded' : ''}`}
                        onClick={() => handleCardClick(card.id)}
                    >
                        <img src={card.img} alt={card.title} />
                        <h3 className="card-title">{card.title}</h3>
                        <p className="card-description">
                            {expandedCardId === card.id ? card.examples : card.description}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default CardsDicas;
