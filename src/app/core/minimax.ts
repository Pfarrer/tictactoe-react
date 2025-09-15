import { type Board } from "./state";
import { hasWinner } from "./hasWinner";

export function findBestMove(board: Board, nextMove: "human" | "computer", maxDepth: number = -1): number {
    const board_ = [...board] as Board;

    let bestScore = -Infinity;
    let move = -1;

    for (let i = 0; i < 9; i++) {
        if (board_[i] === " ") {
            board_[i] = "o";
            const score = minimax(board_, 0, nextMove === "human", maxDepth);
            board_[i] = " ";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board: Board, depth: number, isMaximizing: boolean, maxDepth: number): number {
    if (maxDepth !== -1 && depth > maxDepth) {
        return 0;
    }

    const winner = hasWinner(board);
    if (winner === "computer") return 10 - depth;
    if (winner === "human") return depth - 10;
    if (board.every(cell => cell !== " ")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === " ") {
                board[i] = "o";
                const score = minimax(board, depth + 1, false, maxDepth);
                board[i] = " ";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === " ") {
                board[i] = "x";
                const score = minimax(board, depth + 1, true, maxDepth);
                board[i] = " ";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}
