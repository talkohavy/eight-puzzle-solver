import { createMyState, MyState } from './MyState.js';
import { Actions, AvailableActions, SpacePosition } from './types.js';
import { CUBE_SIZE, TILES_COUNT } from './utils/constants.js';
import { getColNumberFromConvolutedIndex } from './utils/functions/getColNumberFromConvolutedIndex.js';
import { getRowNumberFromConvolutedIndex } from './utils/functions/getRowNumberFromConvolutedIndex.js';
import { smartEnqueueToStart } from './utils/functions/smartEnqueueToStart.js';
// import { toShuffledArray } from './utils/functions/toShuffledArray.js';

class Program {
  public initialBoard: Array<number> = [];
  public goalBoard: Array<number> = [];
  public numOfIteration: number;
  public solution: Array<MyState>;
  public startTime: number;
  public endTime: number;
  private whichHeuristic: number = 1; // 1= numOfMisplaced , 2= manhattanDistances
  // For Branch & Bound:
  private UB: number;
  seenStates: Record<string, MyState>;

  constructor() {
    this.numOfIteration = -1;
    this.solution = [];
    this.startTime = 0;
    this.endTime = 0;
    this.UB = 0;
    this.seenStates = {};
  }

  initNewPuzzle() {
    this.goalBoard = this.createGoalBoard();

    // this.initialBoard = toShuffledArray(this.goalBoard);
    this.initialBoard = [5, 7, 3, 0, 6, 2, 1, 4, 8];
  }

  public calculateInitialState() {
    const spaceIndexRaw: number = this.initialBoard.findIndex((num) => num === 0);
    const spacePosition: SpacePosition = {
      row: getRowNumberFromConvolutedIndex(spaceIndexRaw),
      col: getColNumberFromConvolutedIndex(spaceIndexRaw),
    };
    const g: number = 0;
    const h: number = this.calculateH(this.initialBoard);

    const initialState = createMyState({
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

  resetCurrentProblem() {}

  public printBoard(curBoard: Array<number>) {
    console.log(curBoard.join(', '));
  }

  // Heuristic No. 1 - Number Misplaced Tiles
  public calculateMisplacedTilesCount(curBoard: Array<number>) {
    let wrong = 0;
    curBoard.forEach((currentNumber, index) => {
      if (currentNumber > 0 && currentNumber !== this.goalBoard[index]) {
        wrong++;
      }
    });
    return wrong;
  }

  // Heuristic No. 2 - Manhattan distances
  public calculateManhattanDistances(curBoard: Array<number>) {
    let sumOfDistances = 0;
    const cubeSize = 3; // Assuming the cube is 3x3

    curBoard.forEach((currentValue, i) => {
      if (currentValue === 0) return;

      // Calculate the 2D positions from the 1D index for the current value
      const row = Math.floor(i / cubeSize); // row index in 2D
      const col = i % cubeSize; // column index in 2D

      // Calculate the expected 2D positions for the current value
      const expectedRowForValue = Math.floor((currentValue - 1) / cubeSize); // target row index in 2D
      const expectedColForValue = (currentValue - 1) % cubeSize; // target column index in 2D

      // Add Manhattan distance to the total value
      const currentValueDistance = Math.abs(row - expectedRowForValue) + Math.abs(col - expectedColForValue);
      sumOfDistances = sumOfDistances + currentValueDistance;
    });

    return sumOfDistances;
  }

  isGoal(currentBoard: Array<number>) {
    return currentBoard.every((value, index) => value === this.goalBoard[index]);
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

  allValidActions(spacePosition: SpacePosition) {
    const validActions = {} as Actions;
    if (spacePosition.row > 0) validActions.up = true;
    if (spacePosition.col + 1 < CUBE_SIZE) validActions.right = true;
    if (spacePosition.row + 1 < CUBE_SIZE) validActions.down = true;
    if (spacePosition.col > 0) validActions.left = true;

    return validActions;
  }

  public solveUsingAStar() {
    this.solution = [];

    const seenStates: Record<string, MyState> = {};
    const priorityQueue: Array<MyState> = [];
    const initialState = this.calculateInitialState();

    smartEnqueueToStart<MyState>({ arr: priorityQueue, item: initialState, getValue: (item: MyState) => item.f });

    // Begin A* Run
    this.numOfIteration = 0;
    this.startTime = Date.now();

    while (priorityQueue.length > 0) {
      this.numOfIteration++;
      // Dequeue next state to handle
      const currentState = priorityQueue.shift() as MyState;

      const {
        id: currentStateId,
        board: currentBoard,
        spacePosition: currentSpacePosition,
        g: currentGValue,
      } = currentState;

      const curStateSpacePosConvoluted = currentSpacePosition.row * CUBE_SIZE + currentSpacePosition.col;

      // Add to seen states
      seenStates[currentStateId] = currentState;

      // Check if GoalState reached
      if (this.isGoal(currentBoard)) {
        console.log('Num of boards tested: %d.\n', this.numOfIteration);
        this.solution = [];
        let curState: MyState = currentState;
        this.solution.unshift(curState);
        while (curState.parent != null) {
          this.solution.unshift(curState.parent);
          curState = curState.parent;
        }
        this.endTime = Date.now();
        return;
      }
      // -------------------------------------
      // Step 5.3: Expand possible next states
      // -------------------------------------
      // A. Check all possible valid actions
      const validActions: Actions = this.allValidActions(currentSpacePosition);

      for (const validAction in validActions) {
        // C. Get position of space of next state
        const nextSpacePos: SpacePosition = this.getNextSpacePosition(
          currentSpacePosition,
          validAction as AvailableActions,
        );
        const nextSpacePosConvoluted = nextSpacePos.row * CUBE_SIZE + nextSpacePos.col;
        // D. Create next board
        const nextBoard: Array<number> = [...currentBoard];
        nextBoard[curStateSpacePosConvoluted] = nextBoard[nextSpacePosConvoluted]!;
        nextBoard[nextSpacePosConvoluted] = 0;
        // E. Calculate g
        const g: number = currentGValue + 1;
        // F. Calculate h
        const h = this.calculateH(nextBoard);
        // G. Create next MyState(board,parent,g,h,spacePosRow,spacePosCol)
        const nextState = createMyState({
          board: nextBoard,
          parent: currentState,
          g,
          h,
          spacePosition: nextSpacePos,
        });
        // H. Check that this state wasn't seen before.
        if (!seenStates[nextState.id]) {
          // Insert into priority queue
          smartEnqueueToStart({ arr: priorityQueue, item: nextState, getValue: (item: MyState) => item.f });
        }
      }
    }
  }

  // -------------------------------------
  // Method 13: Solve Using Branch & Bound
  // -------------------------------------
  public solveUsingBranchAndBound() {
    // Reset solution
    this.solution = [];

    // Reset list of seen states
    this.seenStates = {};

    // Begin Branch & Bound Run
    this.UB = 32;
    this.numOfIteration = 0;
    this.startTime = Date.now();

    const initialState = this.calculateInitialState();

    this.open(initialState);
  }

  private open(curState: MyState) {
    this.numOfIteration++;

    const curBoard: Array<number> = [...curState.board];
    const curStateSpacePosition: SpacePosition = curState.spacePosition;
    const curStateSpacePositionConvoluted = curStateSpacePosition.row * CUBE_SIZE + curStateSpacePosition.col;

    if (this.isGoal(curBoard)) {
      // A. Update Global UB
      this.UB = curState.g; /// or f
      console.log('Num of boards tested: %d. Solved in %d steps.\n', this.numOfIteration, this.UB);
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

    // ------------------------------------------------------
    // STEP 3: Expand all curState branches and calc their LB
    // ------------------------------------------------------
    const fifoQueue: Array<MyState> = [];
    // How? Just say what happens if nextJob will be added NEXT.
    // A. Check all possible valid actions
    const actions = this.allValidActions(curState.spacePosition);

    for (const validAction in actions) {
      // C. Get position of space of next state
      const nextSpacePosition: SpacePosition = this.getNextSpacePosition(
        curState.spacePosition,
        validAction as AvailableActions,
      );
      const nextSpacePositionConvoluted = nextSpacePosition.row * 3 + nextSpacePosition.col;
      // D. Create next board
      const nextBoard: Array<number> = [...curBoard];
      nextBoard[curStateSpacePositionConvoluted] = nextBoard[nextSpacePositionConvoluted]!;
      nextBoard[nextSpacePositionConvoluted] = 0;
      // E. Calculate g
      const g = curState.g + 1;
      // F. Calculate h
      const h = this.calculateH(nextBoard);
      // G. Create next MyState(board,parent,g,h,spacePosRow,spacePosCol)
      const nextState: MyState = createMyState({
        board: nextBoard,
        g,
        h,
        parent: curState,
        spacePosition: nextSpacePosition,
      });

      // H. Insert into queue
      const seen: boolean = this.checkIfSeen(nextState); // Double role: Also replaces!!!

      if (!seen) fifoQueue.push(nextState);
    }

    // BACK-TRACKING
    while (fifoQueue.length > 0) {
      // Dequeue next state to check:
      const nextState = fifoQueue.shift() as MyState;
      // If branch doesn't EXCEED UB.
      if (nextState.f < this.UB) {
        // Try and test this action: (CONTINUE to Branch and Bound)
        this.open(nextState);
        // Getting here = regretting this assignment!
      } // else{
      // Is higher than UB! Bound it and move on!
      //}
    }
  }

  private checkIfSeen(someState: MyState) {
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

  getInversionsCount(arr: Array<number>) {
    let inversionsCount = 0;
    for (let i = 0; i < TILES_COUNT - 2; i++) {
      for (let j = i + 1; j < TILES_COUNT - 1; j++) {
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
}

function runProgram() {
  const program: Program = new Program();

  program.initNewPuzzle();
  program.printBoard(program.initialBoard);

  if (!program.isSolvable()) return console.log('Bad news... Puzzle is unsolvable.');

  console.log('Good news! Puzzle is solvable!');

  // -------------
  // Solve with A*
  // -------------
  console.log('Solving with A*:');
  program.solveUsingAStar();

  if (program.solution == null) {
    console.log("The algorithm wasn't able to solve the puzzle...");
    console.log('Num of boards tested: %d.\n', program.numOfIteration);
    return;
  }

  console.log('A* solved 8-puzzle in %d moves.', program.solution.length - 1);

  program.solution.forEach((solutionCurrentStep, moveNumber) => {
    const currentBoard = solutionCurrentStep.board;

    console.log('Move number: %d\n', moveNumber);

    program.printBoard(currentBoard);
  });

  const timeToSolveUsingAStar = program.endTime - program.startTime;

  console.log('Time taken: ' + timeToSolveUsingAStar + 'ms\n');

  // Solve with Branch & Bound
  console.log('Solving with Branch & Bound:');
  program.solveUsingBranchAndBound();
  // Display solution:
  if (program.solution == null) {
    console.log("The algorithm wasn't able to solve the puzzle...");
    console.log('Num of boards tested: ', program.numOfIteration);
    return;
  }

  console.log('Branch & Bound solved 8-puzzle in %d moves.\n', program.solution.length - 1);

  // Print solution:
  program.solution.forEach((solutionCurrentStep, moveNumber) => {
    const currentBoard = solutionCurrentStep.board;

    console.log('Move number: %d\n', moveNumber);

    program.printBoard(currentBoard);
  });

  const timeToSolve = program.endTime - program.startTime;
  console.log('Time taken: ' + timeToSolve + 'ms\n');

  console.log('Program ended.');
}

runProgram();
