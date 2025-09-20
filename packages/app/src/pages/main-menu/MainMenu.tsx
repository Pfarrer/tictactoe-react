import { useStateStore } from "#state/state.ts";
import { useRandomBoardCells } from "./useRandomBoardCells";
import { Dialog } from "#components/Dialog.tsx";
import { Tabs } from "#components/Tabs.tsx";
import { FaUserGroup, FaUserNinja, FaWifi } from "react-icons/fa6";

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
  const tabValue = useStateStore((state) => state.mainMenu.selectedTab);
  const selectTab = useStateStore((state) => state.mainMenu.selectTab);

  return (
    <Tabs.Root>
      <Tabs.Item icon={<FaUserNinja />} active={tabValue === 'solo'} onActivate={() => selectTab("solo")}>
        Solo
      </Tabs.Item>
      <Tabs.Item icon={<FaUserGroup />} active={tabValue === 'hotseat'} onActivate={() => selectTab("hotseat")}>
        Hotseat
      </Tabs.Item>
      <Tabs.Item icon={<FaWifi />} active={tabValue === 'online'} onActivate={() => selectTab("online")}>
        Online
      </Tabs.Item>

      {tabValue === 'solo' && <Tabs.Content>
        <p>Play solo against the computer.</p>
        <GameSettingsSolo />
      </Tabs.Content>}
      {/*<Tabs.Content value="hotseat">
        <p>Take turns playing against another person.</p>
        <GameSettingsHotseat />
      </Tabs.Content>
      <Tabs.Content value="online">
        <p>Play online against other people.</p>
        <GameSettingsOnline />
      </Tabs.Content> */}
    </Tabs.Root>
  );
}

function GameSettingsSolo() {
  return "";
}

function GameSettingsHotseat() {
  return "";
}

function GameSettingsOnline() {
  return "";
}
