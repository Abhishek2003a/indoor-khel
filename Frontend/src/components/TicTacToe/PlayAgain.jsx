const handlePlayAgain = () => {
  window.location.reload();
  // Simple way to reset the game state, you can implement a more elegant solution if needed
  // Logic to reset the game state and start a new game
  // This could involve resetting the board, turn, winner, etc.
  // You can also emit a socket event to notify the opponent about the new game
  console.log("Play Again button clicked");
};

const PlayAgain = () => {
  return (
    <button className="play-again-button" onClick={handlePlayAgain}>
      Play Again
    </button>
  );
};
export default PlayAgain;
