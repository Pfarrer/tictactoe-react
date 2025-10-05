import { GameBoard } from "#/components/game-board";
import { HotseatGame } from "#pages/hotseat-game/HotseatGame.tsx";
import { MainMenu } from "#pages/main-menu/MainMenu.tsx";
import { ServerLobby } from "#pages/server-lobby/ServerLobby.tsx";
import { SoloGame } from "#pages/solo-game/SoloGame.tsx";
import { useStateStore } from "#state/state.ts";

function App() {
  const activePage = useStateStore((state) => state.activePage);
  return (
    <>
      <GameBoard />
      {activePage === "main-menu" && <MainMenu />}
      {activePage === "solo-game" && <SoloGame />}
      {activePage === "hotseat-game" && <HotseatGame />}
      {activePage === "server-lobby" && <ServerLobby />}
    </>
  );
}

export default App;
