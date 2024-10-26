import { AvailableActions, SpacePosition } from '../../types.js';

type GetSpacePositionAfterActionProps = {
  spacePosition: SpacePosition;
  action: AvailableActions;
};

export function getSpacePositionAfterAction(props: GetSpacePositionAfterActionProps) {
  const { spacePosition, action } = props;

  const nextSpacePos = {} as SpacePosition;

  switch (action) {
    case AvailableActions.Up:
      nextSpacePos.row = spacePosition.row - 1;
      nextSpacePos.col = spacePosition.col;

      break;
    case AvailableActions.Right:
      nextSpacePos.row = spacePosition.row;
      nextSpacePos.col = spacePosition.col + 1;

      break;
    case AvailableActions.Down:
      nextSpacePos.row = spacePosition.row + 1;
      nextSpacePos.col = spacePosition.col;

      break;
    case AvailableActions.Left:
      nextSpacePos.row = spacePosition.row;
      nextSpacePos.col = spacePosition.col - 1;

      break;
    default:
      console.log('Something went horribly wrong...');
      break;
  }
  return nextSpacePos;
}
