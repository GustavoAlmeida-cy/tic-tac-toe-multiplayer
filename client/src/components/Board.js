import React, { useEffect, useState, useCallback, useRef } from "react";
import { useChannelStateContext, useChatContext } from "stream-chat-react";
import Square from "./Square";
import { Patterns } from "../components/WinningPatterns";
import GameOver from "./GameOver";

function Board({ result, setResult, player, startingPlayer, onLeave }) {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [turn, setTurn] = useState(startingPlayer);
  const [hasStarted, setHasStarted] = useState(false);

  // Pontos dos jogadores
  const [score, setScore] = useState({ X: 0, O: 0 });

  const { channel } = useChannelStateContext();
  const { client } = useChatContext();

  const boardRef = useRef(board);
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  const checkWin = useCallback(() => {
    if (result.state !== "") return false;

    for (const pattern of Patterns) {
      const first = boardRef.current[pattern[0]];
      if (!first) continue;

      const hasWon = pattern.every(
        (index) => boardRef.current[index] === first
      );
      if (hasWon) {
        setResult({ winner: first, state: "won" });
        // Atualiza o placar
        setScore((prev) => ({
          ...prev,
          [first]: prev[first] + 1,
        }));
        return true;
      }
    }
    return false;
  }, [setResult, result.state]);

  const checkTie = useCallback(() => {
    if (result.state !== "") return false;

    const isBoardFull = boardRef.current.every(
      (val) => val === "X" || val === "O"
    );
    if (isBoardFull) {
      setResult({ winner: "none", state: "tie" });
      return true;
    }
    return false;
  }, [setResult, result.state]);

  useEffect(() => {
    if (!hasStarted || result.state !== "") return;
    if (!checkWin()) checkTie();
  }, [board, checkWin, checkTie, hasStarted, result.state]);

  // Jogada local
  const chooseSquare = async (square) => {
    if (turn !== player || board[square] !== "" || result.state !== "") return;

    if (!hasStarted) setHasStarted(true);

    const newBoard = [...board];
    newBoard[square] = player;
    setBoard(newBoard);
    setTurn(player === "X" ? "O" : "X");

    await channel.sendEvent({
      type: "game-move",
      data: { square, player },
    });
  };

  // Jogada recebida do adversário
  useEffect(() => {
    const handleGameMove = (event) => {
      if (
        event.type === "game-move" &&
        event.user.id !== client.userID &&
        boardRef.current[event.data.square] === "" &&
        result.state === ""
      ) {
        if (!hasStarted) setHasStarted(true);

        const opponentPlayer = event.data.player;
        const newBoard = [...boardRef.current];
        newBoard[event.data.square] = opponentPlayer;

        setBoard(newBoard);
        setTurn(player); // sua vez
      }
    };

    channel.on("game-move", handleGameMove);
    return () => channel.off("game-move", handleGameMove);
  }, [channel, client.userID, hasStarted, result.state, player]);

  // Resetar jogo
  const resetGame = () => {
    setBoard(Array(9).fill(""));
    setTurn(startingPlayer);
    setResult({ winner: "", state: "" });
    setHasStarted(false);
  };

  // Sair da partida
  const leaveGame = async () => {
    if (channel) {
      await channel.stopWatching(); // para receber eventos do canal
    }
    if (onLeave) onLeave(); // geralmente limpa estado, redireciona, etc
  };

  if (player === null) return <div>Carregando...</div>;

  return (
    <>
      <div className="board-header">
        <div className="scoreboard">
          🎯 <span className="score-label">Placar</span>: X: {score.X} | O:{" "}
          {score.O}
        </div>

        <button className="leave-button" onClick={leaveGame}>
          ❌ Sair da partida
        </button>
      </div>

      <div className="board">
        {board.map((val, idx) => (
          <Square key={idx} val={val} chooseSquare={() => chooseSquare(idx)} />
        ))}
      </div>

      {result.state !== "" && (
        <GameOver winner={result.winner} onRestart={resetGame} />
      )}
    </>
  );
}

export default Board;
