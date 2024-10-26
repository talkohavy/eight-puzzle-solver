import { getValidActionsForBoard } from '../../models/EightTilesPuzzle/logic/utils/getValidActionsForBoard.js';
import { isGoalReached } from '../../models/EightTilesPuzzle/logic/utils/isGoalReached.js';
import { AlgoResults, AvailableActions, Board, BoardState } from '../../models/EightTilesPuzzle/types.js';
import { extractStepsToSolutionFromState } from '../../utils/functions/extractStepsToSolutionFromState.js';
import { generateInitialStateFromBoard } from '../../utils/functions/generateInitialStateFromBoard.js';
import { generateNextStateFromAction } from '../aStar/logic/utils/generateNextStateFromAction.js';

let iterationsCount: number;
let UB: number;

export function solveUsingBranchAndBound(initialBoard: Board): AlgoResults {
  const initialState = generateInitialStateFromBoard(initialBoard);
  const seenStates: Record<string, BoardState> = { [initialState.id]: initialState };
  iterationsCount = 0;
  UB = 32;

  let solution = [] as Array<BoardState>;

  openState(initialState);

  function openState(currentState: BoardState) {
    const { board: currentBoard, spacePosition: curStateSpacePosition, g: currentGValue } = currentState;

    if (isGoalReached(currentBoard)) {
      solution = extractStepsToSolutionFromState(currentState);
      UB = currentGValue; /// or f

      return;
    }

    iterationsCount++;

    const fifoQueue: Array<BoardState> = [];

    const validActions = getValidActionsForBoard(curStateSpacePosition);

    for (const currentValidAction in validActions) {
      const nextState = generateNextStateFromAction({ currentState, action: currentValidAction as AvailableActions });

      if (!seenStates[nextState.id]) {
        seenStates[nextState.id] = nextState;
        fifoQueue.push(nextState);
      } else {
        const notStored = nextState;
        const alreadyStored = seenStates[nextState.id]!;

        if (notStored.g < alreadyStored.g) {
          seenStates[nextState.id] = nextState;
          fifoQueue.push(nextState);
        }
      }
    }

    // BACK-TRACKING
    while (fifoQueue.length) {
      // Dequeue next state to check:
      const nextState = fifoQueue.shift() as BoardState;
      // If branch doesn't EXCEED UB.
      if (nextState.f < UB) {
        // Try and test this action: (CONTINUE to Branch and Bound)
        openState(nextState);
        // Getting here = regretting this assignment!
      } // else{
      // Is higher than UB! Bound it and move on!
      //}
    }
  }

  return { solution, iterationsCount };
}
