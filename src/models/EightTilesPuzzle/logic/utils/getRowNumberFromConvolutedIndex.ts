import { CUBE_SIZE } from '../../models/EightTilesPuzzle/logic/constants.js';

function getRowNumberFromConvolutedIndex(convolutedIndex: number) {
  return Math.floor(convolutedIndex / CUBE_SIZE);
}

export { getRowNumberFromConvolutedIndex };
