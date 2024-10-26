import { GOAL_BOARD } from '../../models/EightTilesPuzzle/logic/constants.js';
import { isSpaceTile } from '../../models/EightTilesPuzzle/logic/utils/isSpaceTile.js';
import { Board } from '../../models/EightTilesPuzzle/types.js';

type CalculateMisplacedTilesCountProps = {
  currentBoard: Board;
};

// Heuristic No. 1 - Number Misplaced Tiles
export function calculateMisplacedTilesCount(props: CalculateMisplacedTilesCountProps) {
  const { currentBoard } = props;

  let wrong = 0;

  currentBoard.forEach((currentNumber, index) => {
    if (!isSpaceTile(currentNumber) && currentNumber !== GOAL_BOARD[index]) {
      wrong++;
    }
  });

  return wrong;
}
