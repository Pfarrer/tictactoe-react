import { Button } from "#components/Button.tsx";
import { DialogBody, DialogRoot, DialogTitle } from "#components/Dialog.tsx";
import { HorizontalLine } from "#components/HorizontalLine.tsx";
import { useRandomBoardCells } from "#pages/main-menu/useRandomBoardCells.ts";
import { useStateStore } from "#state/state.ts";

export function ServerLobby() {
  useRandomBoardCells();
  const disconnectFromServer = useStateStore((state) => state.serverConnection.disconnectFromServer);
  const serverUrl = useStateStore((state) => state.serverConnection.url);
  const serverHostname = new URL(serverUrl).hostname;

  return (
    <DialogRoot>
      <DialogTitle text={`Server Lobby @ ${serverHostname}`} />
      <DialogBody>
        <ServerInfo />
        <HorizontalLine />

        <JoinGameSection />
        <HorizontalLine />

        <Button kind="secondary" onClick={disconnectFromServer}>
          Disconnect
        </Button>
      </DialogBody>
    </DialogRoot>
  );
}

function ServerInfo() {
  const serverStatistics = useStateStore((state) => state.serverLobby.statistics);

  if (!serverStatistics) {
    return "Waiting for server statistics...";
  }

  return `${serverStatistics.activeGamesCount} active games, ${serverStatistics.connectedPlayersCount} players online`;
}

function JoinGameSection() {
  const isReady = useStateStore((state) => state.serverLobby.isReady);
  const setReady = useStateStore((state) => state.serverLobby.setReady);

  return (
    <Button kind="primary" onClick={() => setReady(!isReady)} showSpinner={isReady}>
      {isReady ? "Waiting for players..." : "Join next Game!"}
    </Button>
  );
}
