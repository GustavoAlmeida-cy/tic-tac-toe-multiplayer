import React, { useState, useEffect } from "react";
import Board from "./Board";

function Game({ channel, onExit }) {
  // Estado indica se os 2 jogadores já entraram no canal
  const [playersJoined, setPlayersJoined] = useState(
    channel?.state?.watcher_count === 2
  );

  // Estado do resultado do jogo (vencedor, empate, etc)
  const [result, setResult] = useState({ winner: "", state: "" });

  // Indica se você é 'X' ou 'O'
  const [player, setPlayer] = useState(null);

  // Jogador que começa o jogo (sempre 'X')
  const [startingPlayer, setStartingPlayer] = useState("X");

  useEffect(() => {
    if (!channel) return;

    // Define o jogador baseado no número de watchers
    if (channel.state.watcher_count < 2) {
      setPlayer("X");
      setStartingPlayer("X");
    } else {
      setPlayer("O");
      setStartingPlayer("X");
    }

    // Atualiza estado quando jogadores entram ou saem
    const updatePlayersJoined = () => {
      setPlayersJoined(channel.state.watcher_count === 2);
    };

    channel.on("user.watching.start", updatePlayersJoined);
    channel.on("user.watching.stop", updatePlayersJoined);

    // Limpa listeners ao desmontar
    return () => {
      channel.off("user.watching.start", updatePlayersJoined);
      channel.off("user.watching.stop", updatePlayersJoined);
    };
  }, [channel]);

  // Enquanto não tiver os 2 jogadores e player definido, mostra loading
  if (!playersJoined || player === null) {
    return <h1>Aguardando a entrada de outro jogador...</h1>;
  }

  return (
    <div>
      <Board
        result={result}
        setResult={setResult}
        player={player}
        startingPlayer={startingPlayer}
        onLeave={onExit}
      />
    </div>
  );
}

export default Game;
