import { SpacePosition } from './types';

export type MyState = {
  id: string;
  board: Array<number>;
  parent: MyState;
  g: number;
  h: number;
  f: number; // = g + h
  spacePosition: SpacePosition;
};

type CreateMyStateProps = {
  board: Array<number>;
  parent: MyState;
  g: number;
  h: number;
  spacePosition: SpacePosition;
};

export function createMyState(props: CreateMyStateProps): MyState {
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
