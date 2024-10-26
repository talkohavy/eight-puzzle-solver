import { BoardState, SpacePosition } from '../../models/EightTilesPuzzle/types.js';

type CreateBoardStateProps = {
  board: Array<number>;
  parent: BoardState;
  g: number;
  h: number;
  spacePosition: SpacePosition;
};

export function createBoardState(props: CreateBoardStateProps): BoardState {
  const { board, parent, g, h, spacePosition } = props;

  return {
    id: board.join(','),
    board,
    parent,
    g,
    h,
    f: g + h,
    spacePosition,
  };
}
