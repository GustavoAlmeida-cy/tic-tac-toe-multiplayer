import React, { useState, useEffect } from "react";
import { useChatContext, Channel } from "stream-chat-react";
import Game from "./Game";

function JoinGame() {
  const { client } = useChatContext();
  const [channel, setChannel] = useState(null);
  const [waitingUsers, setWaitingUsers] = useState([]);

  // Marca usuário atual como procurando jogo ao montar componente
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

  // Busca lista de usuários procurando jogo (exceto o próprio)
  useEffect(() => {
    const fetchWaitingUsers = async () => {
      try {
        const response = await client.queryUsers({
          isLookingForGame: true,
          id: { $ne: client.userID },
        });
        setWaitingUsers(response.users);
      } catch (err) {
        console.error("Erro ao buscar usuários:", err);
      }
    };

    fetchWaitingUsers();

    // Atualiza lista a cada 7 segundos
    const interval = setInterval(fetchWaitingUsers, 7000);
    return () => clearInterval(interval);
  }, [client]);

  // Cria canal com adversário e marca ambos como não procurando
  const createChannelWithUser = async (rivalUser) => {
    try {
      const newChannel = client.channel("messaging", {
        members: [client.userID, rivalUser.id],
      });

      await newChannel.watch();
      setChannel(newChannel);

      // Atualiza flags de "procurando jogo" para false
      await Promise.all([
        client.partialUpdateUser({
          id: client.userID,
          set: { isLookingForGame: false },
        }),
        client.partialUpdateUser({
          id: rivalUser.id,
          set: { isLookingForGame: false },
        }),
      ]);
    } catch (err) {
      console.error("Erro ao criar canal:", err);
    }
  };

  return (
    <>
      {channel ? (
        <Channel channel={channel}>
          <Game channel={channel} onExit={() => setChannel(null)} />
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
                  <span>{user.name || user.id}</span>
                  <button onClick={() => createChannelWithUser(user)}>
                    Jogar com {user.name || user.id}
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
