import { Button } from "#components/Button.tsx";
import { DialogBody, DialogRoot, DialogTitle } from "#components/Dialog.tsx";
import { Input } from "#components/Input.tsx";
import { Select, SelectOption } from "#components/Select.tsx";
import { TabsContent, TabsItem, TabsRoot } from "#components/Tabs.tsx";
import { useStateStore } from "#state/state.ts";
import { FaUserGroup, FaUserNinja, FaWifi } from "react-icons/fa6";
import { useRandomBoardCells } from "./useRandomBoardCells";

export function MainMenu() {
  useRandomBoardCells();

  return (
    <DialogRoot>
      <DialogTitle text="TicTacToe" />
      <DialogBody>Classic TicTacToe game.</DialogBody>
      <GameSettingsTabs />
    </DialogRoot>
  );
}

function GameSettingsTabs() {
  const selectedTab = useStateStore((state) => state.mainMenu.selectedTab);
  const selectTab = useStateStore((state) => state.mainMenu.selectTab);

  return (
    <>
      <TabsRoot>
        <TabsItem icon={<FaUserNinja />} active={selectedTab === "solo"} onActivate={() => selectTab("solo")}>
          Solo
        </TabsItem>
        <TabsItem icon={<FaUserGroup />} active={selectedTab === "hotseat"} onActivate={() => selectTab("hotseat")}>
          Hotseat
        </TabsItem>
        <TabsItem icon={<FaWifi />} active={selectedTab === "online"} onActivate={() => selectTab("online")}>
          Online
        </TabsItem>
      </TabsRoot>

      {selectedTab === "solo" && (
        <TabsContent>
          <p>Play against the computer.</p>
          <GameSettingsSolo />
        </TabsContent>
      )}
      {selectedTab === "hotseat" && (
        <TabsContent>
          <p>Take turns playing against another person.</p>
          <GameSettingsHotseat />
        </TabsContent>
      )}
      {selectedTab === "online" && (
        <TabsContent>
          <p>Play online against other people.</p>
          <GameSettingsOnline />
        </TabsContent>
      )}
    </>
  );
}

function GameSettingsSolo() {
  const difficulty = useStateStore((state) => state.mainMenu.soloDifficulty);
  const setDifficulty = useStateStore((state) => state.mainMenu.setSoloDifficulty);
  const startSoloGame = useStateStore((state) => state.mainMenu.startSoloGame);

  return (
    <div className="flex flex-col">
      <Select label="Difficulty" value={difficulty} onChange={setDifficulty}>
        <SelectOption value="random" text="Random (random moves only)" />
        <SelectOption value="fair" text="Fair (planning 1 step ahead)" />
        <SelectOption value="hard" text="Hard (planning all steps ahead)" />
      </Select>
      <Button onClick={startSoloGame}>Start</Button>
    </div>
  );
}

function GameSettingsHotseat() {
  const startHotseatGame = useStateStore((state) => state.mainMenu.startHotseatGame);

  return (
    <div className="flex flex-col">
      <Button onClick={startHotseatGame}>Start</Button>
    </div>
  );
}

function GameSettingsOnline() {
  const serverStatus = useStateStore((state) => state.serverConnection.status);
  const serverUrl = useStateStore((state) => state.serverConnection.url);
  const setServerUrl = useStateStore((state) => state.serverConnection.setUrl);
  const connectToServer = useStateStore((state) => state.serverConnection.connectToServer);

  return (
    <div className="flex flex-col">
      <Input label="Server Url" value={serverUrl} onChange={setServerUrl} />
      <Button
        isEnabled={serverStatus !== "connecting"}
        showSpinner={serverStatus === "connecting"}
        onClick={connectToServer}
      >
        Connect
      </Button>
    </div>
  );
}
