import { Board } from '../../models/EightTilesPuzzle/types.js';
import { getInversionsCount } from './getInversionsCount.js';

export function isSolvable(board: Board): boolean {
  const inversionsCount = getInversionsCount(board);
  const isInversionsCountEven = inversionsCount % 2 === 0;

  return isInversionsCountEven;
}
