import React from "react";

// Componente que representa uma célula do tabuleiro
// Recebe o valor atual (X, O, ou vazio) e uma função para lidar com o clique
const Square = ({ val, chooseSquare }) => {
  return (
    <div
      className="square"
      onClick={chooseSquare}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") chooseSquare();
      }}
      aria-label={val ? `Marcado com ${val}` : "Célula vazia"}
    >
      {val}
    </div>
  );
};

export default Square;
