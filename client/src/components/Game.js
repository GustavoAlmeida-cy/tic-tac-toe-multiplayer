import React, { useState, useEffect } from "react";
import Board from "./Board";

function Game({ channel, onExit }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel?.state?.watcher_count === 2
  );

  const [result, setResult] = useState({ winner: "", state: "" });

  const [player, setPlayer] = useState(null);
  const [startingPlayer, setStartingPlayer] = useState("X");

  useEffect(() => {
    if (!channel) return;

    // Quem estava esperando (menor id) será "X"
    // Para simplificar, usamos watcher_count para decidir quem está esperando
    if (channel.state.watcher_count < 2) {
      // Você está esperando — começa como "X"
      setPlayer("X");
      setStartingPlayer("X");
    } else {
      // Você entrou depois — será "O"
      setPlayer("O");
      setStartingPlayer("X");
    }

    const handleWatcherStart = () => {
      const count = channel.state.watcher_count;
      setPlayersJoined(count === 2);
    };

    const handleWatcherStop = () => {
      const count = channel.state.watcher_count;
      setPlayersJoined(count === 2);
    };

    channel.on("user.watching.start", handleWatcherStart);
    channel.on("user.watching.stop", handleWatcherStop);

    return () => {
      channel.off("user.watching.start", handleWatcherStart);
      channel.off("user.watching.stop", handleWatcherStop);
    };
  }, [channel]);

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
