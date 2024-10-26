import { EightTilesPuzzle } from './models/EightTilesPuzzle/EightTilesPuzzle.js';

function runProgram() {
  const program: EightTilesPuzzle = new EightTilesPuzzle();

  program.initNewPuzzle();
  program.printBoard(program.initialBoard);

  if (!program.isSolvable()) return console.log('Bad news... Puzzle is unsolvable.');

  console.log('Good news! Puzzle is solvable!');

  console.log('Solving with A*:');
  program.solveUsingAStar();
  program.printStepsToSolution();
  program.printTheTimeItTookToSolve();

  console.log('Solving with Branch & Bound:');
  program.solveUsingBranchAndBound();
  program.printStepsToSolution();
  program.printTheTimeItTookToSolve();

  console.log('Program ended.');
}

runProgram();
