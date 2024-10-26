import { printBoard } from '../../models/EightTilesPuzzle/logic/utils/printBoard.js';
import { AvailableActions, BoardState, SpacePosition } from '../../models/EightTilesPuzzle/types.js';

type DetectActionFromSpacePositionsProps = {
  prevSpacePosition: SpacePosition;
  currentSpacePosition: SpacePosition;
};

function detectActionFromSpacePositions(props: DetectActionFromSpacePositionsProps): AvailableActions {
  const { prevSpacePosition, currentSpacePosition } = props;

  if (prevSpacePosition.row === currentSpacePosition.row && prevSpacePosition.col > currentSpacePosition.col)
    return AvailableActions.Right;

  if (prevSpacePosition.row === currentSpacePosition.row && prevSpacePosition.col < currentSpacePosition.col)
    return AvailableActions.Left;

  if (prevSpacePosition.row > currentSpacePosition.row && prevSpacePosition.col === currentSpacePosition.col)
    return AvailableActions.Down;

  if (prevSpacePosition.row < currentSpacePosition.row && prevSpacePosition.col === currentSpacePosition.col)
    return AvailableActions.Up;

  throw new Error('failed to detect Action from the 2 SpacePositions');
}

type PrintSolutionSummaryProps = {
  solution: Array<BoardState>;
  iterationsCount: number;
};

export function printSolutionSummary(props: PrintSolutionSummaryProps) {
  const { solution, iterationsCount } = props;

  if (solution.length === 0) {
    console.log("The algorithm wasn't able to solve the puzzle...");
    console.log('Num of boards tested: %d.\n', iterationsCount);
    return;
  }

  console.log('Solved 8-puzzle in %d moves.', solution.length - 1);

  solution.forEach((currentState, moveNumber) => {
    const { board, parent, spacePosition } = currentState;

    if (parent === null) {
      console.log('\n----------');
      console.log('Initial State:\n');
      return printBoard(board);
    }

    const action = detectActionFromSpacePositions({
      prevSpacePosition: parent.spacePosition,
      currentSpacePosition: spacePosition,
    });
    console.log(`Move ${moveNumber}: go`, action);
    console.log('----------');

    console.log('Result:\n');
    printBoard(board);
  });
}
