export type ServerStatistics = {
  connectedPlayersCount: number;
  activeGamesCount: number;
};

export type ServerMessage = {
  name: "statistics";
  data: ServerStatistics;
};
