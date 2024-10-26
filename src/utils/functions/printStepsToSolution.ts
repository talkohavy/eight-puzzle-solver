import { printBoard } from '../../models/EightTilesPuzzle/logic/utils/printBoard.js';
import { BoardState } from '../../models/EightTilesPuzzle/types.js';

export function printStepsToSolution(stepsToSolutionArr: Array<BoardState>) {
  if (stepsToSolutionArr.length === 0) {
    console.log("The algorithm wasn't able to solve the puzzle...");
    // console.log('Num of boards tested: %d.\n', this.iterationCount);
    return;
  }

  console.log('Solved 8-puzzle in %d moves.', stepsToSolutionArr.length - 1);

  stepsToSolutionArr.forEach((solutionCurrentStep, moveNumber) => {
    const currentBoard = solutionCurrentStep.board;

    console.log('Move number: %d\n', moveNumber);

    printBoard(currentBoard);
  });
}
