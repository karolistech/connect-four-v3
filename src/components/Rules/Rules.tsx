import { useState } from "react";

import "./Rules.css";
import sprite from "../../assets/icons/sprite.svg?no-inline";

export default function Rules() {
  const [rulesOpen, setRulesOpen] = useState(false);

  function openRules() {
    setRulesOpen(true);
  }

  function closeRules() {
    setRulesOpen(false);
  }

  return (
    <div className="rules">
      <button className="rules__open-btn" onClick={openRules}>
        Rules
      </button>

      {rulesOpen === true && (
        <>
          <div className="rules__backdrop" />

          <div className="rules__modal">
            <h2 className="rules__title">Rules</h2>

            <div className="rules__section">
              <h3 className="rules__section-title">Objective</h3>

              <p className="rules__description">
                Be the first player to connect four discs of the same color in a row,
                vertically, horizontally, or diagonally.
              </p>
            </div>

            <div className="rules__section">
              <h3 className="rules__section-title">How to Play</h3>

              <ol className="rules__list">
                <li>Red starts first in the first game.</li>
                <li>Players take turns dropping one disc per turn.</li>
                <li>The game ends when a player connects four discs in a row or when the board is full.</li>
                <li>In the next game, the starting player switches.</li>
              </ol>
            </div>

            <button className="rules__close-btn" onClick={closeRules}>
              <svg className="rules__checkmark-icon">
                <use href={`${sprite}#checkmark`} />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
