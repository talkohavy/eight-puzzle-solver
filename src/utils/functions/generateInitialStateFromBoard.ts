import { getColNumberFromConvolutedIndex } from '../../models/EightTilesPuzzle/logic/utils/getColNumberFromConvolutedIndex.js';
import { getRowNumberFromConvolutedIndex } from '../../models/EightTilesPuzzle/logic/utils/getRowNumberFromConvolutedIndex.js';
import { isSpaceTile } from '../../models/EightTilesPuzzle/logic/utils/isSpaceTile.js';
import { Board, createBoardState, SpacePosition } from '../../models/EightTilesPuzzle/types.js';
import { Heuristic } from '../constants.js';
import { calculateH } from './calculateH.js';

export function generateInitialStateFromBoard(initialBoard: Board) {
  const spaceIndexConvoluted: number = initialBoard.findIndex(isSpaceTile);
  const spacePosition: SpacePosition = {
    row: getRowNumberFromConvolutedIndex(spaceIndexConvoluted),
    col: getColNumberFromConvolutedIndex(spaceIndexConvoluted),
  };
  const g: number = 0;
  const h: number = calculateH({ currentBoard: initialBoard, heuristic: Heuristic.NumOfMisplacedTiles });

  const initialState = createBoardState({
    board: initialBoard,
    g,
    h,
    parent: null as any,
    spacePosition,
  });

  return initialState;
}
