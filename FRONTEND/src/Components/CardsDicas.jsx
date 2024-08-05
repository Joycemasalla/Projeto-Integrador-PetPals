import React, { useEffect } from 'react';
import './CardsDicas.css';
import { adestramento, adocao, alimentacao, cuidados, saude, curiosidades, setaparacima } from '../assets';

const CardsDicas = () => {
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

    return (
        <>
            <div id="voltarTopo">
                <button onClick={backToTop} id="subir">
                    <img src={setaparacima} alt="Voltar ao topo" />
                </button>
            </div>
            <div className='titulocard'>
                <h2>Conheça dicas essenciais para dar o conforto que o seu pet merece!</h2>
            </div>
            <div className="card-container">
                <div className="dicas">
                    <img src={adestramento} alt="Adestramento" />
                    <h3 className="card-title">Adestramento</h3>
                    <p className="card-description">Corrija comportamentos, eduque, divirta-se e fortaleça a relação com seu pet.</p>
                </div>
                <div className="dicas">
                    <img src={alimentacao} alt="Alimentação" />
                    <h3 className="card-title">Alimentação</h3>
                    <p className="card-description">Saiba dietas equilibradas, aprenda sobre dietas caseiras, escolha a melhor ração e muito mais.</p>
                </div>
                <div className="dicas">
                    <img src={adocao} alt="Adoção" />
                    <h3 className="card-title">Adoção</h3>
                    <p className="card-description">Descubra nomes encantadores, dicas, o que fazer e tudo o que você precisa saber para adotar um pet.</p>
                </div>
                <div className="dicas">
                    <img src={saude} alt="Saúde" />
                    <h3 className="card-title">Saúde</h3>
                    <p className="card-description">Aprenda tudo o que precisa saber sobre a saúde do seu pet e proteja seu pet de doenças.</p>
                </div>
                <div className="dicas">
                    <img src={cuidados} alt="Cuidados" />
                    <h3 className="card-title">Cuidados</h3>
                    <p className="card-description">Entenda o cio, gestação, higiene dental, cuidado das orelhas e muito mais.</p>
                </div>
                <div className="dicas">
                    <img src={curiosidades} alt="Curiosidades" />
                    <h3 className="card-title">Curiosidades</h3>
                    <p className="card-description">Aprenda dicas, descubra espécies em perigo de extinção, saiba diversas raças e muito mais.</p>
                </div>
            </div>
        </>
    );
};

export default CardsDicas;
