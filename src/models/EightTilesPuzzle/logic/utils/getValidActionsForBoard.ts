import { Actions, SpacePosition } from '../../types.js';
import { CUBE_SIZE } from '../constants.js';

export function getValidActionsForBoard(spacePosition: SpacePosition) {
  const validActions = {} as Actions;

  if (spacePosition.row > 0) validActions.up = true;
  if (spacePosition.col + 1 < CUBE_SIZE) validActions.right = true;
  if (spacePosition.row + 1 < CUBE_SIZE) validActions.down = true;
  if (spacePosition.col > 0) validActions.left = true;

  return validActions;
}
