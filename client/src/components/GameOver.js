import React from "react";

function GameOver({ winner, onRestart }) {
  // Define se houve empate
  const isTie = winner === "none";

  // Mensagem de vitória ou empate
  const message = isTie ? "Empate!" : `Jogador ${winner} venceu!`;

  return (
    <div className="game-over">
      <div className="game-over-content">
        <h2>{message}</h2>
        <button onClick={onRestart} aria-label="Jogar Novamente">
          Jogar Novamente
        </button>
      </div>
    </div>
  );
}

export default GameOver;
