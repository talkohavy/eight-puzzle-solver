import { solveUsingAStar } from './algorithms/aStar/aStar.js';
import { solveUsingBranchAndBound } from './algorithms/branchAndBound/branchAndBound.js';
import { createNewPuzzle } from './models/EightTilesPuzzle/logic/utils/createNewPuzzle.js';
import { printBoard } from './models/EightTilesPuzzle/logic/utils/printBoard.js';
import { isSolvable } from './utils/functions/isSolvable.js';
import { printSolutionSummary } from './utils/functions/printSolutionSummary.js';
import { printTheTimeItTookToSolve } from './utils/functions/printTheTimeItTookToSolve.js';

function runProgram() {
  const puzzle = createNewPuzzle();

  printBoard(puzzle);

  if (!isSolvable(puzzle)) return console.log('Bad news... Puzzle is unsolvable.');

  console.log('Good news! Puzzle is solvable!');

  console.log('Solving with A*:');
  const aStarResults = solveUsingAStar(puzzle);
  printSolutionSummary(aStarResults);
  printTheTimeItTookToSolve({ name: 'a-star' });

  // console.log('Solving with Branch & Bound:');
  const branchAndBoundResults = solveUsingBranchAndBound(puzzle);
  printSolutionSummary(branchAndBoundResults);
  // printTheTimeItTookToSolve({ name: 'branch-and-bound' });

  console.log('Program ended.');
}

runProgram();
