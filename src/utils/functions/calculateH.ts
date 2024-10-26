import { Heuristic } from '../constants.js';
import { calculateManhattanDistances } from './calculateManhattanDistances.js';
import { calculateMisplacedTilesCount } from './calculateMisplacedTilesCount.js';

const SOLVE_USING = {
  [Heuristic.NumOfMisplacedTiles]: (props: any) => calculateMisplacedTilesCount(props),
  [Heuristic.ManhattanDistances]: (props: any) => calculateManhattanDistances(props),
};

type CalculateHProps = {
  currentBoard: Array<number>;
  heuristic: Heuristic;
};

function calculateH(props: CalculateHProps) {
  const { currentBoard, heuristic } = props;

  const calculationMethod = SOLVE_USING[heuristic];

  if (!calculationMethod) throw new Error("`heuristic` wasn't one of the allowed methods");

  const h = calculationMethod({ currentBoard });

  return h;
}

export { calculateH };
