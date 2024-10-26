import { GOAL_BOARD } from '../constants.js';
import { toShuffledArray } from '../../../../utils/functions/toShuffledArray.js';
import { Board } from '../../types.js';

export function createNewPuzzle(): Board {
  const puzzle = toShuffledArray(GOAL_BOARD); // [5, 7, 3, 0, 6, 2, 1, 4, 8];

  return puzzle;
}
