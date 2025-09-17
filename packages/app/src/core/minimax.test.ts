import { findBestMove } from './minimax';
import type { Board } from '@tic-tac-toe/shared/state';

describe('minimax', () => {
    const board = ['o', 'o', ' ', 'x', ' ', ' ', ' ', ' ', ' '] as Board;
        
    it('should return the winning move', () => {
        const move = findBestMove(board, 'computer');
        expect(move).toBe(2);
    });

    it('should block the opponent from winning', () => {
        const move = findBestMove(board, 'human');
        expect(move).toBe(2);
    });
});
