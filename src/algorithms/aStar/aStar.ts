import { getValidActionsForBoard } from '../../models/EightTilesPuzzle/logic/utils/getValidActionsForBoard.js';
import { isGoalReached } from '../../models/EightTilesPuzzle/logic/utils/isGoalReached.js';
import { Actions, AvailableActions, Board, BoardState } from '../../models/EightTilesPuzzle/types.js';
import { extractStepsToSolutionFromState } from '../../utils/functions/extractStepsToSolutionFromState.js';
import { generateInitialStateFromBoard } from '../../utils/functions/generateInitialStateFromBoard.js';
import { smartEnqueueToStart } from '../../utils/functions/smartEnqueueToStart.js';
import { generateNextStateFromAction } from './logic/utils/generateNextStateFromAction.js';

type AlgoResults = {
  solution: Array<BoardState>;
  iterationsCount: number;
};

export function solveUsingAStar(initialBoard: Board): AlgoResults {
  const initialState = generateInitialStateFromBoard(initialBoard);
  const priorityQueue: Array<BoardState> = [initialState];
  const seenStates: Record<string, BoardState> = { [initialState.id]: initialState };

  let iterationsCount = 0;

  while (priorityQueue.length > 0) {
    iterationsCount++;

    const currentState = priorityQueue.shift() as BoardState;

    const { board: currentBoard, spacePosition: currentSpacePosition } = currentState;

    if (isGoalReached(currentBoard)) {
      const solution = extractStepsToSolutionFromState(currentState);

      return { solution, iterationsCount };
    }

    const validActions: Actions = getValidActionsForBoard(currentSpacePosition);

    // Expand possible next states
    for (const currentValidAction in validActions) {
      const nextState = generateNextStateFromAction({ currentState, action: currentValidAction as AvailableActions });

      if (!seenStates[nextState.id]) {
        seenStates[nextState.id] = nextState;
        smartEnqueueToStart({ arr: priorityQueue, item: nextState, getValue: (item: BoardState) => item.f });
      } else {
        const notStored = nextState;
        const alreadyStored = seenStates[nextState.id]!;

        if (notStored.g < alreadyStored.g) seenStates[nextState.id] = nextState;
      }
    }
  }

  return { solution: [], iterationsCount };
}
