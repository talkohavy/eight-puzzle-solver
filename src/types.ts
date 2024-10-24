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
