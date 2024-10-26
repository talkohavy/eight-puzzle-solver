export type SpacePosition = {
  row: number;
  col: number;
};

export enum AvailableActions {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
}

export type Actions = Record<AvailableActions, boolean>;

export type BoardState = {
  id: string;
  board: Array<number>;
  parent: BoardState;
  g: number;
  h: number;
  f: number; // = g + h
  spacePosition: SpacePosition;
};

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
