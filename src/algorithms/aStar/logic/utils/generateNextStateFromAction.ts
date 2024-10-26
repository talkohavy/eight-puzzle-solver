import { CUBE_SIZE } from '../../../../models/EightTilesPuzzle/logic/constants.js';
import { calculateSpacePositionAfterAction } from '../../../../models/EightTilesPuzzle/logic/utils/calculateSpacePositionAfterAction.js';
import { generateNextBoard } from '../../../../models/EightTilesPuzzle/logic/utils/generateNextBoard.js';
import { AvailableActions, BoardState, SpacePosition } from '../../../../models/EightTilesPuzzle/types.js';
import { Heuristic } from '../../../../utils/constants.js';
import { calculateG } from '../../../../utils/functions/calculateG.js';
import { calculateH } from '../../../../utils/functions/calculateH.js';
import { createBoardState } from '../../../../utils/functions/createBoardState.js';

type generateNextStateProps = {
  currentState: BoardState;
  action: AvailableActions;
};

function generateNextStateFromAction(props: generateNextStateProps) {
  const { currentState, action } = props;

  const { board: currentBoard, spacePosition: currentSpacePosition, g: currentGValue } = currentState;

  const nextSpacePosition: SpacePosition = calculateSpacePositionAfterAction({
    spacePosition: currentSpacePosition,
    action,
  });

  const nextSpacePositionConvoluted = nextSpacePosition.row * CUBE_SIZE + nextSpacePosition.col;

  const nextBoard = generateNextBoard({ currentBoard, nextSpacePositionConvoluted });
  const g = calculateG(currentGValue);
  const h = calculateH({ currentBoard: nextBoard, heuristic: Heuristic.NumOfMisplacedTiles });

  const nextState = createBoardState({
    parent: currentState,
    board: nextBoard,
    g,
    h,
    spacePosition: nextSpacePosition,
  });

  return nextState;
}

export { generateNextStateFromAction };
