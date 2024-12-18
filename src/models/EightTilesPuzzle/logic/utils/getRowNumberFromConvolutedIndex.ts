import { CUBE_SIZE } from '../constants.js';

function getRowNumberFromConvolutedIndex(convolutedIndex: number) {
  return Math.floor(convolutedIndex / CUBE_SIZE);
}

export { getRowNumberFromConvolutedIndex };
