import { GOAL_BOARD } from '../constants.js';

export function isGoal(currentBoard: Array<number>) {
  return currentBoard.every((value, index) => value === GOAL_BOARD[index]);
}
