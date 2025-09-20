export const AppPageValues = ["main-menu", "server-lobby"] as const;
export type AppPage = (typeof AppPageValues)[number];

export const MainMenuTabValues = ["solo", "hotseat", "online"] as const;
export type MainMenuTab = (typeof MainMenuTabValues)[number];

export const ServerStatusValues = ["disconnected", "connecting", "connected", "error"] as const;
export type ServerStatus = (typeof ServerStatusValues)[number];
