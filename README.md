
# Tic Tac Toe Multiplayer

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com/)
[![Stream Chat](https://img.shields.io/badge/Stream_Chat-blueviolet)](https://getstream.io/chat/)
[![Axios](https://img.shields.io/badge/Axios-0.27.2-red)](https://axios-http.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-teal)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-blue)](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## Descrição

Tic Tac Toe Multiplayer é um jogo da velha online que permite partidas em tempo real entre dois jogadores utilizando a plataforma Stream Chat para comunicação e gerenciamento de canais. O frontend foi desenvolvido em React e o backend em Node.js com Express, utilizando autenticação simples e armazenamento em memória para usuários.

---

## Funcionalidades

- Cadastro e login de usuários com autenticação baseada em tokens Stream Chat.
- Busca e listagem de jogadores disponíveis para partida.
- Criação de canais de chat privados para partidas entre dois jogadores.
- Interface de jogo interativa com tabuleiro, identificação do jogador e resultado da partida.
- Sistema de espera e conexão entre jogadores em tempo real.
- Feedbacks visuais para vitória, empate e reinício do jogo.

---

## Tecnologias utilizadas

- **Frontend:** React, Axios, Stream Chat React SDK, universal-cookie
- **Backend:** Node.js, Express, bcrypt, Stream Chat Node SDK, uuid
- **Comunicação em tempo real:** Stream Chat API
- **Estilização:** CSS moderno com variáveis CSS

---

## Como rodar o projeto

### Pré-requisitos

- Node.js instalado (versão 18.x recomendada)
- Conta e API Key da [Stream](https://getstream.io/)

### Backend

1. Navegue até a pasta `server`:

   ```bash
   cd server
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto `server` com as seguintes variáveis:

   ```
   API_KEY=your_stream_api_key
   API_SECRET=your_stream_api_secret
   PORT_BECKEND=3001
   ```

4. Inicie o servidor:

   ```bash
   npm run dev
   ```

### Frontend

1. Navegue até a pasta `client`:

   ```bash
   cd client
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do projeto `client` com a variável:

   ```
   REACT_APP_API_KEY=your_stream_api_key
   ```

4. Inicie a aplicação:

   ```bash
   npm start
   ```

5. Abra no navegador `http://localhost:3000`

---

## Estrutura do projeto

```
tic-tac-toe-multiplayer/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...
│   ├── package.json
│   └── .env
├── server/
│   ├── src/
│   │   └── index.js
│   ├── package.json
│   └── .env
├── README.md
└── ...
```

---

## Autor

Gustavo Almeida

---

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
