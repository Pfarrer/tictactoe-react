import { GameBoard } from "./components/game-board";
import { MainMenu } from "#pages/main-menu/MainMenu.tsx";
import { useStateStore } from "#state/state.ts";
import { ServerLobby } from "#pages/server-lobby/ServerLobby.tsx";

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
