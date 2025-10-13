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
    }
  | {
      scope: GameId;
      name: "gameOver";
      data: {
        result: "youWon" | "youLost" | "draw";
        winningCells?: number[]; // Array of 3 cell indices for winning combination
      };
    }
  | {
      scope: string; // Can be any scope
      name: "messageRejected";
      data: {
        messageId: string; // ID of the rejected client message
        reason: string;
      };
    };

export type ClientMessage = {
  id: string; // Random string for request-response correlation
} & (
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
    }
);
