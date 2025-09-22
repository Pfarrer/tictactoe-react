import { Button } from "#components/Button.tsx";
import { DialogBody, DialogRoot, DialogTitle } from "#components/Dialog.tsx";
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
        <Description />
        <Button onClick={disconnectFromServer}>Disconnect</Button>
      </DialogBody>
    </DialogRoot>
  );
}

function Description() {
  const serverStatistics = useStateStore((state) => state.serverConnection.statistics);

  function serverStatisticsText(): string {
    if (!serverStatistics) return "waiting for server statistics...";
    return `${serverStatistics.activeGamesCount} active games, ${serverStatistics.connectedPlayersCount} players online`;
  }

  return serverStatisticsText();
}
