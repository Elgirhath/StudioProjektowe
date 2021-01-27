import React from "react";
import "./PawnSingle.scss";
export default function PawnSingle({color, selectedPawn, x, y}) {
  return (
    <div className={`pawn-container border-${color} selected-${selectedPawn}`} style={{top: y, left: x}}>

    </div>
  )
}
