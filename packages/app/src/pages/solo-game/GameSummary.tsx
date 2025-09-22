export function GameSummary() {
  const winner = undefined; // TODO

  function onRestartClick() {
    // TODO
  }

  return (
    <section className="p-8">
      <h2>
        {winner === "human" && "Congrats! You won!"}
        {winner === "computer" && "Ugh! You lost..."}
        {winner === undefined && "Unfortunately, a draw..."}
      </h2>
      <button onClick={onRestartClick}>Restart</button>
    </section>
  );
}
