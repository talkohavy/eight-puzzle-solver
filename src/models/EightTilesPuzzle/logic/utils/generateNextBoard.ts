import { Board } from '../../types.js';
import { SPACE_VALUE } from '../constants.js';
import { getSpacePositionFromBoard } from './getSpacePosition.js';

type generateNextBoardProps = {
  currentBoard: Board;
  nextSpacePositionConvoluted: number;
};

function generateNextBoard(props: generateNextBoardProps) {
  const { currentBoard, nextSpacePositionConvoluted } = props;

  const nextBoard: Board = [...currentBoard];

  const { spacePositionConvolutedIndex: curStateSpacePosConvoluted } = getSpacePositionFromBoard(currentBoard);

  nextBoard[curStateSpacePosConvoluted] = nextBoard[nextSpacePositionConvoluted]!;
  nextBoard[nextSpacePositionConvoluted] = SPACE_VALUE;

  return nextBoard;
}

export { generateNextBoard };
