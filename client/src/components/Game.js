import React, { useState, useEffect } from "react";

function Game({ channel }) {
  const [playersJoined, setPlayersJoined] = useState(
    channel?.state?.watcher_count === 2
  );

  useEffect(() => {
    if (!channel) return;

    const handleWatcherStart = (event) => {
      const count = channel.state.watcher_count;
      console.log("Watcher joined. Total:", count);
      setPlayersJoined(count === 2);
    };

    const handleWatcherStop = (event) => {
      const count = channel.state.watcher_count;
      console.log("Watcher left. Total:", count);
      setPlayersJoined(count === 2);
    };

    channel.on("user.watching.start", handleWatcherStart);
    channel.on("user.watching.stop", handleWatcherStop);

    // Limpeza dos listeners quando o componente desmontar ou o channel mudar
    return () => {
      channel.off("user.watching.start", handleWatcherStart);
      channel.off("user.watching.stop", handleWatcherStop);
    };
  }, [channel]);

  if (!playersJoined) {
    return (
      <div>
        <h1>Waiting for other player to join...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Game</h1>
    </div>
  );
}

export default Game;
