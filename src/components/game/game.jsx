import React from "react";
import Minesweeper from "./Minesweeper";

export default function Game() {
  return (
    <section
      id="Game"
      className="h-screen flex justify-center items-center bg-gray-100 p-5"
    >
      <Minesweeper />
    </section>
  );
}
