import { CUBE_SIZE } from '../constants';

function getRowNumberFromConvolutedIndex(convolutedIndex: number) {
  return Math.floor(convolutedIndex / CUBE_SIZE);
}

export { getRowNumberFromConvolutedIndex };
