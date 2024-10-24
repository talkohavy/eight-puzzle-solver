import { CUBE_SIZE } from '../constants';

function getColNumberFromConvolutedIndex(convolutedIndex: number) {
  return convolutedIndex % CUBE_SIZE;
}

export { getColNumberFromConvolutedIndex };
