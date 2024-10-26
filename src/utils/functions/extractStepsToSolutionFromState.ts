import { BoardState } from '../../models/EightTilesPuzzle/types.js';

export function extractStepsToSolutionFromState(state: BoardState) {
  const stepsToSolutionArr = [state];

  let currentState = state;

  while (currentState.parent != null) {
    stepsToSolutionArr.unshift(currentState.parent);
    currentState = currentState.parent;
  }

  return stepsToSolutionArr;
}
