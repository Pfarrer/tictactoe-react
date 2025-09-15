import { findBestMove } from './minimax';
import type { Board } from './state';

describe('minimax', () => {
    it('should return the winning move', () => {
        const board = ['o', 'o', ' ', 'x', 'x', ' ', ' ', ' ', ' '] as Board;
        const move = findBestMove(board, 'computer');
        expect(move).toBe(2);
    });

    it('should block the opponent from winning', () => {
        const board = ['x', 'x', ' ', 'o', ' ', ' ', ' ', ' ', ' '] as Board;
        const move = findBestMove(board, 'human');
        expect(move).toBe(2);
    });
});
