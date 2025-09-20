export const AppPageValues = ["main-menu"] as const;
export type AppPage = typeof AppPageValues[number];

export const MainMenuTabValues = ["solo", "hotseat", "online"] as const;
export type MainMenuTab = typeof MainMenuTabValues[number];
