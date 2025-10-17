import { GameBoard } from "#/components/game-board";
import { HotseatGame } from "#pages/hotseat-game/HotseatGame.tsx";
import { MainMenu } from "#pages/main-menu/MainMenu.tsx";
import { OnlineGame } from "#pages/online-game/OnlineGame.tsx";
import { ServerLobby } from "#pages/server-lobby/ServerLobby.tsx";
import { SoloGame } from "#pages/solo-game/SoloGame.tsx";
import { useStateStore } from "#state/state.ts";

function App() {
  const activePage = useStateStore((state) => state.activePage);
  return (
    <>
      <GameBoard />
      {activePage === "main-menu" && <MainMenu />}
      {activePage === "server-lobby" && <ServerLobby />}
      {activePage === "solo-game" && <SoloGame />}
      {activePage === "hotseat-game" && <HotseatGame />}
      {activePage === "online-game" && <OnlineGame />}
    </>
  );
}

export default App;
