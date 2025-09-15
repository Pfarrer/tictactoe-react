import { useContext, type ReactNode } from 'react';
import { GameStateContext, GameStateDispatchContext } from './GameStateConext';

export function MenuDialog() {
  const { gameStatus } = useContext(GameStateContext);

  return (
    gameStatus !== 'active' && (
      <DialogWithBackdrop>
        {gameStatus === 'pristine' && <MainMenuDialogContent />}
        {gameStatus === 'finished' && <GameFinishedDialogContent />}
      </DialogWithBackdrop>
    )
  );
}

function DialogWithBackdrop({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  return (
    <dialog
      open
      className="top-0 left-0 w-full h-full flex place-content-center items-center bg-emerald-200/20 backdrop-blur-md"
    >
      {children}
    </dialog>
  );
}

function MainMenuDialogContent() {
  const dispatch = useContext(GameStateDispatchContext);

  function onStartClick() {
    dispatch({ type: 'start_requested', gameMode: 'Human-vs-Computer' });
  }

  return (
    <div className="p-8 bg-emerald-200/80 shadow-xl">
      <h2>TicTacToe</h2>
      <section className="flex gap-4">
        <div>
          <h3>Single Player</h3>
          <label>
            Difficulty:
            <select className="block">
              <option>Luck (random moves only)</option>
              <option>Simple (planning 1 step ahead)</option>
              <option>Hard (planning all steps ahead)</option>
            </select>
          </label>
          <button onClick={onStartClick}>Start!</button>
        </div>
        <div>
          <h3>Multi Player</h3>
          <div className="break-all"></div>
          <button onClick={onStartClick}>Connect to Server</button>
        </div>
      </section>
    </div>
  );
}

function GameFinishedDialogContent() {
  const { winner } = useContext(GameStateContext);
  const dispatch = useContext(GameStateDispatchContext);

  function onRestartClick() {
    dispatch({ type: 'reset_requested' });
  }

  return (
    <section className="p-8">
      <h2>
        {winner === 'human' && 'Congrats! You won!'}
        {winner === 'computer' && 'Ugh! You lost...'}
        {winner === undefined && 'Unfortunately, a draw...'}
      </h2>
      <button onClick={onRestartClick}>Restart</button>
    </section>
  );
}
