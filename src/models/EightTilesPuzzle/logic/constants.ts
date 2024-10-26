const CUBE_SIZE = 3;
const TILES_COUNT = CUBE_SIZE ** 2;
const SPACE_VALUE = 0;

const GOAL_BOARD = Array.from(Array(TILES_COUNT).keys());
GOAL_BOARD.shift();
GOAL_BOARD.push(0);

export { GOAL_BOARD, TILES_COUNT, CUBE_SIZE, SPACE_VALUE };
