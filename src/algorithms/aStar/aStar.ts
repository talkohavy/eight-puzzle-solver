import { performance } from 'node:perf_hooks';
import { getValidActionsForBoard } from '../../models/EightTilesPuzzle/logic/utils/getValidActionsForBoard.js';
import { isGoalReached } from '../../models/EightTilesPuzzle/logic/utils/isGoalReached.js';
import { AlgoResults, AvailableActions, Board, BoardState } from '../../models/EightTilesPuzzle/types.js';
import { extractStepsToSolutionFromState } from '../../utils/functions/extractStepsToSolutionFromState.js';
import { generateInitialStateFromBoard } from '../../utils/functions/generateInitialStateFromBoard.js';
import { smartEnqueueToStart } from '../../utils/functions/smartEnqueueToStart.js';
import { generateNextStateFromAction } from './logic/utils/generateNextStateFromAction.js';

export function solveUsingAStar(initialBoard: Board): AlgoResults {
  performance.mark('start-a-star');
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

      performance.mark('end-a-star');

      return { solution, iterationsCount };
    }

    const validActions = getValidActionsForBoard(currentSpacePosition);

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

  performance.mark('end-a-star');

  return { solution: [], iterationsCount };
}
