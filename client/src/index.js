import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// Cria o root para renderizar a aplicação React
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Componente principal da aplicação */}
    <App />
  </React.StrictMode>
);

// Função para medir performance da aplicação (opcional)
// Passar console.log ou endpoint para enviar dados
reportWebVitals();
