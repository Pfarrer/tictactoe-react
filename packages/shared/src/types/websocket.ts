export type ServerStatistics = {
  connectedPlayersCount: number;
  activeGamesCount: number;
};

export type ClientId = `c-${string}`;
export type GameId = `g-${string}`;

export type ServerMessage =
  | {
      scope: "lobby";
      name: "statistics";
      data: ServerStatistics;
    }
  | {
      scope: "lobby";
      name: "readyStateUpdated";
      data: {
        isReady: boolean;
      };
    }
  | {
      scope: GameId;
      name: "gameJoined";
      data: {
        firstMove: boolean;
      };
    }
  | {
      scope: GameId;
      name: "movePlayed";
      data: {
        isYourMove: boolean;
        cellIdx: number;
      };
    };

export type ClientMessage =
  | {
      scope: "lobby";
      name: "readyForNextGame";
      data: {
        isReady: boolean;
      };
    }
  | {
      scope: GameId;
      name: "requestMove";
      data: {
        cellIdx: number; // 0-8 for 3x3 grid
      };
    };
