import { getColNumberFromConvolutedIndex } from '../../models/EightTilesPuzzle/logic/utils/getColNumberFromConvolutedIndex.js';
import { getRowNumberFromConvolutedIndex } from '../../models/EightTilesPuzzle/logic/utils/getRowNumberFromConvolutedIndex.js';
import { isSpaceTile } from '../../models/EightTilesPuzzle/logic/utils/isSpaceTile.js';
import { Board } from '../../models/EightTilesPuzzle/types.js';

type CalculateManhattanDistancesProps = {
  currentBoard: Board;
};

// Heuristic No. 2 - Manhattan distances
export function calculateManhattanDistances(props: CalculateManhattanDistancesProps) {
  const { currentBoard } = props;

  let sumOfDistances = 0;

  currentBoard.forEach((currentValue, convolutedIndex) => {
    if (isSpaceTile(currentValue)) return;

    const valuesCurrentRow = getRowNumberFromConvolutedIndex(convolutedIndex);
    const valuesCurrentCol = getColNumberFromConvolutedIndex(convolutedIndex);

    const valuesGoalRow = getRowNumberFromConvolutedIndex(currentValue - 1);
    const valuesGoalCol = getColNumberFromConvolutedIndex(currentValue - 1);

    const currentManhattanDistance =
      Math.abs(valuesCurrentRow - valuesGoalRow) + Math.abs(valuesCurrentCol - valuesGoalCol);
    sumOfDistances = sumOfDistances + currentManhattanDistance;
  });

  return sumOfDistances;
}
