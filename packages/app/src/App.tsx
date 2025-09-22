import { GameBoard } from "#/components/game-board";
import { MainMenu } from "#pages/main-menu/MainMenu.tsx";
import { ServerLobby } from "#pages/server-lobby/ServerLobby.tsx";
import { useStateStore } from "#state/state.ts";

function App() {
  const activePage = useStateStore((state) => state.activePage);
  return (
    <>
      <GameBoard />
      {activePage === "main-menu" && <MainMenu />}
      {activePage === "server-lobby" && <ServerLobby />}
    </>
  );
}

export default App;
