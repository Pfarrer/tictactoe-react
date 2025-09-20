import { useStateStore } from "#state/state.ts";
import { useRandomBoardCells } from "./useRandomBoardCells";
import { Dialog } from "#components/Dialog.tsx";
import { Tabs } from "#components/Tabs.tsx";
import { FaUserGroup, FaUserNinja, FaWifi } from "react-icons/fa6";
import { Input } from "#components/Input.tsx";

export function MainMenu() {
  useRandomBoardCells();

  return (
    <Dialog.Root>
      <Dialog.Title>TicTacToe</Dialog.Title>
      <Dialog.Description>Classic TicTacToe game.</Dialog.Description>
      <GameSettingsTabs />
    </Dialog.Root>
  );
}

function GameSettingsTabs() {
  const selectedTab = useStateStore((state) => state.mainMenu.selectedTab);
  const selectTab = useStateStore((state) => state.mainMenu.selectTab);

  return (
    <>
      <Tabs.Root>
        <Tabs.Item icon={<FaUserNinja />} active={selectedTab === 'solo'} onActivate={() => selectTab("solo")}>
          Solo
        </Tabs.Item>
        <Tabs.Item icon={<FaUserGroup />} active={selectedTab === 'hotseat'} onActivate={() => selectTab("hotseat")}>
          Hotseat
        </Tabs.Item>
        <Tabs.Item icon={<FaWifi />} active={selectedTab === 'online'} onActivate={() => selectTab("online")}>
          Online
        </Tabs.Item>
      </Tabs.Root>

      {selectedTab === 'solo' && <Tabs.Content>
        <p>Play against the computer.</p>
        <GameSettingsSolo />
      </Tabs.Content>}
      {selectedTab === 'hotseat' && <Tabs.Content>
        <p>Take turns playing against another person.</p>
        <GameSettingsHotseat />
      </Tabs.Content>}
      {selectedTab === 'online' && <Tabs.Content>
        <p>Play online against other people.</p>
        <GameSettingsOnline />
      </Tabs.Content>}
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
  const serverUrl = useStateStore(state => state.mainMenu.serverUrl);
  const setServerUrl = useStateStore(state => state.mainMenu.setServerUrl);

  return (
    <Input label="Server Url" value={serverUrl} onChange={setServerUrl} />
  );
}
