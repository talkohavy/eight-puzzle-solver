import { BoardState, createBoardState, Actions, AvailableActions, SpacePosition } from './types.js';
import { CUBE_SIZE, SPACE_VALUE, TILES_COUNT } from '../../utils/constants.js';
import { getColNumberFromConvolutedIndex } from '../../utils/functions/getColNumberFromConvolutedIndex.js';
import { getRowNumberFromConvolutedIndex } from '../../utils/functions/getRowNumberFromConvolutedIndex.js';
import { smartEnqueueToStart } from '../../utils/functions/smartEnqueueToStart.js';
import { toShuffledArray } from '../../utils/functions/toShuffledArray.js';

export class EightTilesPuzzle {
  public initialBoard: Array<number> = [];
  public goalBoard: Array<number> = [];
  public iterationCount: number;
  public solution: Array<BoardState>;
  public startTime: number;
  public endTime: number;
  private whichHeuristic: number = 1; // 1= numOfMisplaced , 2= manhattanDistances
  private seenStates: Record<string, BoardState>;
  // For Branch & Bound:
  private UB: number;

  constructor() {
    this.iterationCount = -1;
    this.solution = [];
    this.startTime = 0;
    this.endTime = 0;
    this.seenStates = {};
    this.UB = 0;
  }

  initNewPuzzle() {
    this.goalBoard = this.createGoalBoard();

    this.initialBoard = toShuffledArray(this.goalBoard); // [5, 7, 3, 0, 6, 2, 1, 4, 8];
  }

  public calculateInitialState() {
    const spaceIndexConvoluted: number = this.initialBoard.findIndex(this.isSpaceTile);
    const spacePosition: SpacePosition = {
      row: getRowNumberFromConvolutedIndex(spaceIndexConvoluted),
      col: getColNumberFromConvolutedIndex(spaceIndexConvoluted),
    };
    const g: number = 0;
    const h: number = this.calculateH(this.initialBoard);

    const initialState = createBoardState({
      board: this.initialBoard,
      g,
      h,
      parent: null as any,
      spacePosition,
    });

    return initialState;
  }

  createGoalBoard() {
    const goalBoard = Array.from(Array(TILES_COUNT).keys());
    goalBoard.shift();
    goalBoard.push(0);

    return goalBoard;
  }

  public printBoard(curBoard: Array<number>) {
    console.log(curBoard.join(', '));
  }

  isGoal(currentBoard: Array<number>) {
    return currentBoard.every((value, index) => value === this.goalBoard[index]);
  }

  isSpaceTile(value: any) {
    return value === SPACE_VALUE;
  }

  private getNextSpacePosition(spacePosition: SpacePosition, action: AvailableActions) {
    const nextSpacePos = {} as SpacePosition;

    switch (action) {
      case AvailableActions.Up:
        nextSpacePos.row = spacePosition.row - 1;
        nextSpacePos.col = spacePosition.col;

        break;
      case AvailableActions.Right:
        nextSpacePos.row = spacePosition.row;
        nextSpacePos.col = spacePosition.col + 1;

        break;
      case AvailableActions.Down:
        nextSpacePos.row = spacePosition.row + 1;
        nextSpacePos.col = spacePosition.col;

        break;
      case AvailableActions.Left:
        nextSpacePos.row = spacePosition.row;
        nextSpacePos.col = spacePosition.col - 1;

        break;
      default:
        console.log('Something went horribly wrong...');
        break;
    }
    return nextSpacePos;
  }

  getValidActionsForBoard(spacePosition: SpacePosition) {
    const validActions = {} as Actions;

    if (spacePosition.row > 0) validActions.up = true;
    if (spacePosition.col + 1 < CUBE_SIZE) validActions.right = true;
    if (spacePosition.row + 1 < CUBE_SIZE) validActions.down = true;
    if (spacePosition.col > 0) validActions.left = true;

    return validActions;
  }

  public resetPuzzle() {
    this.solution = [];
    this.seenStates = {};
  }

  // Heuristic No. 1 - Number Misplaced Tiles
  public calculateMisplacedTilesCount(curBoard: Array<number>) {
    let wrong = 0;

    curBoard.forEach((currentNumber, index) => {
      if (!this.isSpaceTile(currentNumber) && currentNumber !== this.goalBoard[index]) {
        wrong++;
      }
    });

    return wrong;
  }

  // Heuristic No. 2 - Manhattan distances
  public calculateManhattanDistances(curBoard: Array<number>) {
    let sumOfDistances = 0;

    curBoard.forEach((currentValue, convolutedIndex) => {
      if (this.isSpaceTile(currentValue)) return;

      const valuesCurrentRow = getRowNumberFromConvolutedIndex(convolutedIndex);
      const valuesCurrentCol = getColNumberFromConvolutedIndex(convolutedIndex);

      const valuesGoalRow = getRowNumberFromConvolutedIndex(currentValue - 1);
      const valuesGoalCol = getColNumberFromConvolutedIndex(currentValue - 1);

      const currentManhattanDistance =
        Math.abs(valuesCurrentRow - valuesGoalRow) + Math.abs(valuesCurrentCol - valuesGoalCol);
      sumOfDistances = sumOfDistances + currentManhattanDistance;
    });

    return sumOfDistances;
  }

  public solveUsingAStar() {
    this.resetPuzzle();

    const priorityQueue: Array<BoardState> = [];
    const initialState = this.calculateInitialState();
    priorityQueue.push(initialState);

    this.iterationCount = 0;
    this.startTime = Date.now();

    while (priorityQueue.length > 0) {
      this.iterationCount++;

      const currentState = priorityQueue.shift() as BoardState;

      const { board: currentBoard, spacePosition: currentSpacePosition, g: currentGValue } = currentState;

      const curStateSpacePosConvoluted = currentSpacePosition.row * CUBE_SIZE + currentSpacePosition.col;

      if (this.isGoal(currentBoard)) {
        console.log('Num of boards tested: %d.\n', this.iterationCount);
        this.solution = [];
        let curState: BoardState = currentState;
        this.solution.unshift(curState);
        while (curState.parent != null) {
          this.solution.unshift(curState.parent);
          curState = curState.parent;
        }
        this.endTime = Date.now();
        return;
      }

      const validActions: Actions = this.getValidActionsForBoard(currentSpacePosition);

      // Expand possible next states
      for (const currentValidAction in validActions) {
        const nextSpacePosition: SpacePosition = this.getNextSpacePosition(
          currentSpacePosition,
          currentValidAction as AvailableActions,
        );
        const nextSpacePosConvoluted = nextSpacePosition.row * CUBE_SIZE + nextSpacePosition.col;

        // Create next board:
        const nextBoard: Array<number> = [...currentBoard];
        nextBoard[curStateSpacePosConvoluted] = nextBoard[nextSpacePosConvoluted]!;
        nextBoard[nextSpacePosConvoluted] = SPACE_VALUE;

        const g = this.calculateG(currentGValue);

        const h = this.calculateH(nextBoard);

        const nextState = createBoardState({
          board: nextBoard,
          parent: currentState,
          g,
          h,
          spacePosition: nextSpacePosition,
        });

        // Check that this state wasn't seen before.
        if (!this.seenStates[nextState.id]) {
          this.seenStates[nextState.id] = nextState;
          smartEnqueueToStart({ arr: priorityQueue, item: nextState, getValue: (item: BoardState) => item.f });
        } else {
          const notStored = nextState;
          const alreadyStored = this.seenStates[nextState.id]!;
          if (notStored.g < alreadyStored.g) {
            this.seenStates[nextState.id] = nextState;
          }
        }
      }
    }

    if (!this.endTime) this.endTime = Date.now();
  }

  public solveUsingBranchAndBound() {
    this.resetPuzzle();

    // Begin Branch & Bound Run
    this.UB = 32;
    this.iterationCount = 0;
    this.startTime = Date.now();

    const initialState = this.calculateInitialState();

    this.openState(initialState);
  }

  private openState(curState: BoardState) {
    this.iterationCount++;

    const curBoard: Array<number> = [...curState.board];
    const curStateSpacePosition: SpacePosition = curState.spacePosition;
    const curStateSpacePositionConvoluted = curStateSpacePosition.row * CUBE_SIZE + curStateSpacePosition.col;

    if (this.isGoal(curBoard)) {
      // A. Update Global UB
      this.UB = curState.g; /// or f
      console.log('Num of boards tested: %d. Solved in %d steps.\n', this.iterationCount, this.UB);
      // B. Copy boards
      this.solution = [];
      this.solution.unshift(curState); // insertion of goal-state.
      while (curState.parent != null) {
        this.solution.unshift(curState.parent);
        curState = curState.parent;
      }
      this.endTime = Date.now();
      return;
    }

    // STEP 3: Expand all curState branches and calc their LB
    const fifoQueue: Array<BoardState> = [];
    // How? Just say what happens if nextJob will be added NEXT.

    const actions = this.getValidActionsForBoard(curState.spacePosition);

    for (const validAction in actions) {
      const nextSpacePosition: SpacePosition = this.getNextSpacePosition(
        curState.spacePosition,
        validAction as AvailableActions,
      );
      const nextSpacePositionConvoluted = nextSpacePosition.row * CUBE_SIZE + nextSpacePosition.col;
      // Create next board
      const nextBoard: Array<number> = [...curBoard];
      nextBoard[curStateSpacePositionConvoluted] = nextBoard[nextSpacePositionConvoluted]!;
      nextBoard[nextSpacePositionConvoluted] = SPACE_VALUE;

      const g = this.calculateG(curState.g);

      const h = this.calculateH(nextBoard);

      const nextState: BoardState = createBoardState({
        board: nextBoard,
        g,
        h,
        parent: curState,
        spacePosition: nextSpacePosition,
      });

      // Insert into queue:
      const seen: boolean = this.checkIfSeen(nextState); // Double role: Also replaces!!!

      if (!seen) fifoQueue.push(nextState);
    }

    // BACK-TRACKING
    while (fifoQueue.length > 0) {
      // Dequeue next state to check:
      const nextState = fifoQueue.shift() as BoardState;
      // If branch doesn't EXCEED UB.
      if (nextState.f < this.UB) {
        // Try and test this action: (CONTINUE to Branch and Bound)
        this.openState(nextState);
        // Getting here = regretting this assignment!
      } // else{
      // Is higher than UB! Bound it and move on!
      //}
    }
  }

  private checkIfSeen(someState: BoardState) {
    const prevState = this.seenStates[someState.id];

    if (prevState == null) {
      this.seenStates[someState.id] = someState;
      return false;
    }

    // someState exists! but wait, is it worse?
    if (someState.g >= prevState.g) {
      // Yes! it is worse! so, same board that was reached after more steps will not be inserted.
      return true;
    } else {
      // No! it is better! so, same board that was reached after less steps will replace current one.
      this.seenStates[someState.id] = someState; // seenStates.put(someState,someState);
      return false;
    }
  }

  private calculateH(someBoard: Array<number>) {
    switch (this.whichHeuristic) {
      case 1: // ------ Num Of Misplaced Tiles -------
        return this.calculateMisplacedTilesCount(someBoard);
      case 2: // ------ Manhattan Distances -------
        return this.calculateManhattanDistances(someBoard);
      default:
        console.error('Something went terribly wrong...');
        return -100;
    }
  }

  private calculateG(previousG: number) {
    return previousG + 1;
  }

  getInversionsCount(arr: Array<number>) {
    let inversionsCount = 0;
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i]! > 0 && arr[i]! > arr[j]!) {
          inversionsCount++;
        }
      }
    }
    return inversionsCount;
  }

  isSolvable(): boolean {
    const inversionsCount = this.getInversionsCount(this.initialBoard);
    const isInversionsCountEven = inversionsCount % 2 === 0;

    return isInversionsCountEven;
  }

  printStepsToSolution() {
    if (this.solution.length === 0) {
      console.log("The algorithm wasn't able to solve the puzzle...");
      console.log('Num of boards tested: %d.\n', this.iterationCount);
      return;
    }

    console.log('Solved 8-puzzle in %d moves.', this.solution.length - 1);

    this.solution.forEach((solutionCurrentStep, moveNumber) => {
      const currentBoard = solutionCurrentStep.board;

      console.log('Move number: %d\n', moveNumber);

      this.printBoard(currentBoard);
    });
  }

  printTheTimeItTookToSolve() {
    const timeToSolve = this.endTime - this.startTime;

    console.log('Time taken: ' + timeToSolve + 'ms\n');
  }
}
