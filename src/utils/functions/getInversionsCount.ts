import { isSpaceTile } from '../../models/EightTilesPuzzle/logic/utils/isSpaceTile.js';

export function getInversionsCount(flatBoard: Array<number>) {
  let inversionsCount = 0;

  flatBoard.forEach((currentTileValue, i) => {
    for (let j = i + 1; j < flatBoard.length; j++) {
      if (!isSpaceTile(currentTileValue) && currentTileValue > flatBoard[j]!) {
        inversionsCount++;
      }
    }
  });

  return inversionsCount;
}
