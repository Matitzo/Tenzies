import React from "react";

export default function Die(props) {
  const styles = {
    backgroundColor: props.isHeld ? "#59E391" : "white",
  };

  function getDots(number) {
    let dots = [];
    for (let i = 0; i < number; i++) {
      dots.push(<div className="dots"></div>);
    }
    return dots;
  }

  return (
    <div
      className={props.value !== 1 ? "die-face" : "die-face-one-dot"}
      style={styles}
      onClick={props.holdDice}
    >
      {getDots(props.value)}
    </div>
  );
}
