import React from "react";

const Square = ({ chooseSquare, val }) => {
  return (
    <div className="square" onClick={chooseSquare}>
      <span>{val}</span>
    </div>
  );
};

export default Square;
