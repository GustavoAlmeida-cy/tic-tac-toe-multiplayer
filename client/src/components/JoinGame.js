import React, { useState, useEffect } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";

function JoinGame() {
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [waitingUsers, setWaitingUsers] = useState([]);

  // Atualiza o usuário atual como "procurando jogo"
  useEffect(() => {
    const setUserLooking = async () => {
      try {
        await client.partialUpdateUser({
          id: client.userID,
          set: { isLookingForGame: true },
        });
      } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
      }
    };

    setUserLooking();
  }, [client]);

  // Busca usuários que estão procurando jogo
  useEffect(() => {
    const fetchWaitingUsers = async () => {
      try {
        const response = await client.queryUsers({
          isLookingForGame: true,
          id: { $ne: client.userID }, // Exclui o próprio usuário
        });

        setWaitingUsers(response.users);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      }
    };

    fetchWaitingUsers();

    // Atualiza a lista a cada 5 segundos
    const interval = setInterval(fetchWaitingUsers, 5000);
    return () => clearInterval(interval);
  }, [client]);

  const createChannelWithUser = async (rivalUser) => {
    try {
      const newChannel = await client.channel("messaging", {
        members: [client.userID, rivalUser.id],
      });

      await newChannel.watch();
      setChannel(newChannel);

      // Opcional: marca ambos como não procurando mais jogo
      await client.partialUpdateUser({
        id: client.userID,
        set: { isLookingForGame: false },
      });

      await client.partialUpdateUser({
        id: rivalUser.id,
        set: { isLookingForGame: false },
      });
    } catch (err) {
      console.error("Erro ao criar canal:", err);
    }
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel}>
          <Game channel={channel} />
        </Channel>
      ) : (
        <div className="joinGame">
          <h1>Jogadores esperando oponentes:</h1>

          {waitingUsers.length === 0 ? (
            <p>Nenhum jogador esperando no momento...</p>
          ) : (
            <ul>
              {waitingUsers.map((user) => (
                <li key={user.id}>
                  {user.name}
                  <button onClick={() => createChannelWithUser(user)}>
                    Jogar com {user.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

export default JoinGame;
