import { Board } from '../../types.js';

export function printBoard(curBoard: Board) {
  console.log(curBoard.join(', '));
}
