import React from 'react';

const Game = ({ board, onMove, myTurn, playerMark, winner }) => {
    return (
        <div className="game-container">
            <h2>Tic-Tac-Toe</h2>
            <div className="status">
                {winner ? (
                    winner === 'draw' ? "It's a Draw!" : `Winner: ${winner}`
                ) : (
                    `Current Turn: ${myTurn ? 'Your Turn (' + playerMark + ')' : "Opponent's Turn"}`
                )}
            </div>
            <div className="board">
                {board.map((cell, index) => (
                    <button
                        key={index}
                        className={`square ${cell ? 'taken' : ''}`}
                        onClick={() => onMove(index)}
                        disabled={!myTurn || cell !== null || winner}
                    >
                        {cell}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Game;
