import { Board, SpacePosition } from '../../types.js';
import { getColNumberFromConvolutedIndex } from './getColNumberFromConvolutedIndex.js';
import { getRowNumberFromConvolutedIndex } from './getRowNumberFromConvolutedIndex.js';
import { isSpaceTile } from './isSpaceTile.js';

export function getSpacePositionFromBoard(board: Board) {
  const spacePositionConvolutedIndex: number = board.findIndex(isSpaceTile);

  const spacePosition: SpacePosition = {
    row: getRowNumberFromConvolutedIndex(spacePositionConvolutedIndex),
    col: getColNumberFromConvolutedIndex(spacePositionConvolutedIndex),
  };

  return { spacePosition, spacePositionConvolutedIndex };
}
