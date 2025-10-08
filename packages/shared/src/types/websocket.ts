export type ServerStatistics = {
  connectedPlayersCount: number;
  activeGamesCount: number;
};

export type ServerMessage = {
  name: "statistics";
  data: ServerStatistics;
};

export type ClientMessage = {
  scope: "lobby";
  name: "readyForNextGame";
  data: {
    isReady: boolean;
  };
};
