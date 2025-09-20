import { useStateStore } from "#state/state.ts";
import { useRandomBoardCells } from "./useRandomBoardCells";
import { DialogDescription, DialogRoot, DialogTitle } from "#components/Dialog.tsx";
import { FaUserGroup, FaUserNinja, FaWifi } from "react-icons/fa6";
import { Input } from "#components/Input.tsx";
import { Button } from "#components/Button.tsx";
import { TabsContent, TabsItem, TabsRoot } from "#components/Tabs.tsx";

export function MainMenu() {
  useRandomBoardCells();

  return (
    <DialogRoot>
      <DialogTitle>TicTacToe</DialogTitle>
      <DialogDescription>Classic TicTacToe game.</DialogDescription>
      <GameSettingsTabs />
    </DialogRoot>
  );
}

function GameSettingsTabs() {
  const selectedTab = useStateStore((state) => state.mainMenu.selectedTab);
  const selectTab = useStateStore((state) => state.mainMenu.selectTab);
  console.log("render");
  return (
    <>
      <TabsRoot>
        <TabsItem icon={<FaUserNinja />} active={selectedTab === "solo"} onActivate={() => selectTab("solo")}>
          Solo
        </TabsItem>
        <TabsItem icon={<FaUserGroup />} active={selectedTab === "hotseat"} onActivate={() => selectTab("hotseat")}>
          Hotseat
        </TabsItem>
        <TabsItem
          icon={<FaWifi />}
          active={selectedTab === "online"}
          onActivate={() => {
            console.log("activate!!!");
            selectTab("online");
          }}
        >
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
  return "";
}

function GameSettingsHotseat() {
  return "";
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
