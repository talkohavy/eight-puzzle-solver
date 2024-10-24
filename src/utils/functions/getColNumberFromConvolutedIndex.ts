import { CUBE_SIZE } from '../constants.js';

function getColNumberFromConvolutedIndex(convolutedIndex: number) {
  return convolutedIndex % CUBE_SIZE;
}

export { getColNumberFromConvolutedIndex };
