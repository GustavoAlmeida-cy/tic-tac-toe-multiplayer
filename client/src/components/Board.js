import React, { useState } from "react";
import Square from "./Square";

function Board() {
  const [board, setBoard] = useState([
    "X",
    "O",
    "X",
    "X",
    "X",
    "O",
    "O",
    "X",
    "X",
  ]);

  return (
    <div className="board">
      {board.map((val, idx) => (
        <Square key={idx} val={val} />
      ))}
    </div>
  );
}

export default Board;
