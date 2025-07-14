import React, { useState } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";

function Board() {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [player, setPlayer] = useState("X");
  const [turn, setTurn] = useState("X");

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const chooseSquare = async (square) => {
    if (turn === player && board[square] === "") {
      setTurn(player === "X" ? "O" : "X");

      await channel.sendEvent({
        type: "game-move",
        data: { square, player },
      });

      setBoard(
        board.map((val, idx) => {
          if (idx === square && val === "") {
            return player;
          }

          return val;
        })
      );
    }
  };

  channel.on((event) => {
    if (event.type === "game-move" && event.user.id !== client.userID) {
      const currentPlayer = event.data.player === "X" ? "O" : "X";

      setPlayer(currentPlayer);
      setTurn(currentPlayer);

      setBoard(
        board.map((val, idx) => {
          if (idx === event.data.square && val === "") {
            return event.data.player;
          }

          return val;
        })
      );
    }
  });

  return (
    <div className="board">
      {board.map((val, idx) => (
        <Square key={idx} chooseSquare={() => chooseSquare(idx)} val={val} />
      ))}
    </div>
  );
}

export default Board;
