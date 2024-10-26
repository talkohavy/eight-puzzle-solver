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

export type Board = Array<number>;
