import React from "react";

function GameOver({ winner, onRestart }) {
  const isTie = winner === "none";
  const message = isTie ? "Empate!" : `Jogador ${winner} venceu!`;

  return (
    <div className="game-over">
      <div className="game-over-content">
        <h2>{message}</h2>
        <button onClick={onRestart}>Jogar Novamente</button>
      </div>
    </div>
  );
}

export default GameOver;
