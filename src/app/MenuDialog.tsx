import { useContext, useState, type ReactNode } from 'react';
import { GameStateContext, GameStateDispatchContext } from './GameStateConext';
import type { Difficulty } from './core/state';

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
  const [difficulty, setDifficulty] = useState<Difficulty>('Luck');
  const [serverUrl, setServerUrl] = useState<string>('ws://localhost:8080');

  function onStartClick() {
    dispatch({ type: 'start_requested', gameMode: 'Human-vs-Computer', difficulty });
  }

  function onConnectClick() {
    dispatch({ type: 'connect_requested', serverUrl });
  }

  return (
    <div className="p-8 bg-emerald-200/80 shadow-xl">
      <h2>TicTacToe</h2>
      <section className="flex gap-4">
        <div>
            <h3>Single Player</h3>
            <label>
                Difficulty:
                <select className="block" value={difficulty} onChange={e => setDifficulty(e.target.value as Difficulty)}>
                    <option value="Luck">Luck (random moves only)</option>
                    <option value="Simple">Simple (planning 1 step ahead)</option>
                    <option value="Hard">Hard (planning all steps ahead)</option>
                </select>
            </label>
            <button onClick={onStartClick}>Start!</button>
        </div>
        <div>
          <h3>Multi Player</h3>
          <label>
            Server URL:
            <input type="url" value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
          </label>
          <button onClick={onConnectClick}>Connect to Server</button>
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
