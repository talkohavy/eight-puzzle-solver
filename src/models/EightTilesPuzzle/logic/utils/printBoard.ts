import { Board } from '../../types.js';
import { CUBE_SIZE } from '../constants.js';

export function printBoard(curBoard: Board) {
  for (let i = 0; i < CUBE_SIZE; i++) {
    const first = curBoard[i * CUBE_SIZE + 0] || ' ';
    const second = curBoard[i * CUBE_SIZE + 1] || ' ';
    const third = curBoard[i * CUBE_SIZE + 2] || ' ';

    console.log(first, second, third);
  }

  console.log();
}
