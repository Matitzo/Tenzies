import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Die from "./Components/die.js";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false);
  const [rollsNumber, getRollsNumber] = React.useState(0);
  const [time, getTime] = React.useState(setTimeZero);
  const [interval, getInterval] = React.useState(startTime());

  tenzies && clearInterval(interval);
  !localStorage.getItem("bestTime") && localStorage.setItem("bestTime", 100000);

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
    }
  }, [dice]);

  function setTimeZero() {
    return { seconds: 0 };
  }

  function startTime() {
    return () =>
      setInterval(
        () =>
          getTime((prevData) => {
            return {
              seconds: prevData.seconds + 1,
            };
          }),
        1000
      );
  }

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  function rollDice() {
    if (!tenzies) {
      getRollsNumber((prevData) => prevData + 1);
      setDice((oldDice) =>
        oldDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      time.seconds < localStorage.getItem("bestTime") &&
        localStorage.setItem("bestTime", time.seconds);
      console.log(localStorage.getItem("bestTime"));
      setTenzies(false);
      getRollsNumber(0);
      getTime(setTimeZero());
      getInterval(startTime());
      setDice(allNewDice());
    }
  }

  function holdDice(id) {
    setDice((oldDice) =>
      oldDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice-container">{diceElements}</div>
      <button className="roll-dice" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <h3>Number of rolls: {rollsNumber}</h3>
      <div className="time-box">
        <h4>Time: {time.seconds} s</h4>
        <h4 style={{ color: "lightgreen" }}>
          Best time:{" "}
          {localStorage.getItem("bestTime") != 100000
            ? localStorage.getItem("bestTime")
            : "X"}{" "}
          s
        </h4>
      </div>
    </main>
  );
}
