import { AvailableActions, SpacePosition } from '../../types.js';

type CalculateSpacePositionAfterActionProps = {
  spacePosition: SpacePosition;
  action: AvailableActions;
};

export function calculateSpacePositionAfterAction(props: CalculateSpacePositionAfterActionProps): SpacePosition {
  const { spacePosition, action } = props;

  if (action == AvailableActions.Up) return { row: spacePosition.row - 1, col: spacePosition.col };
  if (action == AvailableActions.Down) return { row: spacePosition.row + 1, col: spacePosition.col };
  if (action == AvailableActions.Left) return { row: spacePosition.row, col: spacePosition.col - 1 };
  if (action == AvailableActions.Right) return { row: spacePosition.row, col: spacePosition.col + 1 };

  throw new Error('`action` must be one of AvailableActions');
}
