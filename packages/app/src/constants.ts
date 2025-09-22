export const STAGE_SIZE = 100;
export const BOARD_PADDING = 10;

export const MAIN_MENU_RANDOM_BOARD_CELLS_REFRESH_MS = 5000;
export const MAIN_MENU_SERVER_URL_DEFAULT = import.meta.env.VITE_MAIN_MENU_SERVER_URL_DEFAULT;

export const SOLO_GAME_COMPUTER_MOVE_DELAY_MS = 500;

// Derived values
export const CELL_SIZE = (STAGE_SIZE - 2 * BOARD_PADDING) / 3;
