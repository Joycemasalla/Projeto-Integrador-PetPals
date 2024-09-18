PetPals
PetPals é um projeto de gerenciamento de consultas e serviços para clínicas veterinárias e donos de pets. A aplicação permite o agendamento de consultas, gerenciamento de médicos e disponibilidade, e oferece uma interface para comunicação entre donos de pets e clínicas.

🚀 Início
Para começar a usar o PetPals, siga estas instruções:

📋 Pré-requisitos
Antes de começar, você precisa ter instalado:

Node.js (>= 18.15.0)
npm (>= 9.8.1)
🔧 Instalação
Clone o repositório:
https://github.com/Joycemasalla/Projeto-Integrador-PetPals.git

Navegue para o diretório do projeto:
cd petpals

Instale as dependências:
npm install

Crie um arquivo .env na raiz do projeto e adicione suas variáveis de ambiente. Exemplo de configuração:
env
MONGO_URI=mongodb://localhost:27017/petpals
JWT_SECRET=seu_segredo
CLOUDINARY_URL=seu_url_cloudinary

Execute o servidor:
npm start

Abra o navegador e acesse http://localhost:3000 para a aplicação frontend e http://localhost:5000 para o backend (se estiver configurado dessa forma).

📦 Uso
Frontend: O frontend está localizado no diretório frontend/ e usa React para a interface do usuário.
Backend: O backend está no diretório backend/ e utiliza Express para criar APIs RESTful.

🔍 Funcionalidades
Gerenciamento de Consultas: Agende e visualize consultas para seus pets.
Gerenciamento de Médicos: Adicione, edite e remova médicos da clínica.
Disponibilidade: Gerencie horários disponíveis para consultas.

📸 Capturas de Tela
C:\Users\joyce\Pictures\Screenshots\Captura de tela 2024-09-18 151512.png

📚 Documentação
A documentação completa da API pode ser encontrada aqui.

🐛 Relatar Problemas
Se você encontrar um problema, por favor, abra uma issue no GitHub.

🤝 Contribuindo
Faça um fork do repositório.

Crie uma branch para sua feature ou correção:
git checkout -b minha-nova-feature

Faça as alterações necessárias e adicione seus commits:

git add .
git commit -m "Adiciona nova feature"

Envie suas alterações para o repositório remoto:
git push origin minha-nova-feature
Abra um Pull Request no GitHub.


📞 Contato
Para qualquer dúvida ou sugestão, entre em contato:

Instagra@joycemasalla
GitHub: Joycemasalla
