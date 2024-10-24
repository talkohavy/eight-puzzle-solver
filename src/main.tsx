import { createMyState, MyState } from './MyState.js';
import { Actions, AvailableActions, SpacePosition } from './types.js';
import { smartEnqueueToStart } from './utils/smartEnqueueToStart.js';

function getRowNumber(convolutedIndex: number) {
  return Math.floor(convolutedIndex / 3);
}
function getColNumber(convolutedIndex: number) {
  return convolutedIndex % 3;
}

class Program {
  //1111111111111111111111111111111111111111111
  //1111111111111111111111111111111111111111111
  //1111111111111111111111111111111111111111111
  //------------ Class Variables --------------
  //------------ Class Variables --------------
  public cubeSize = 3;
  public finalState: Array<number> = []; // new int[cubeSize][cubeSize];
  public initialState: MyState;
  public numOfIteration: number;
  public solution: Array<MyState>;
  public startTime: number;
  public endTime: number;
  // private Scanner sc = new Scanner(System.in);
  private whichHeuristic: number; //1= numOfMisplaced , 2= manhattanDistances
  //~~~~~~~~~~~~~~~~~~
  //For Branch & Bound:
  //~~~~~~~~~~~~~~~~~~
  private UB: number;
  seenStates: Record<string, MyState>;

  //2222222222222222222222222222222222222222222
  //2222222222222222222222222222222222222222222
  //2222222222222222222222222222222222222222222
  //-------------- Constructor ----------------
  //-------------- Constructor ----------------
  constructor() {
    this.initialState = {} as MyState;
    this.numOfIteration = -1;
    this.solution = [];
    this.startTime = 0;
    this.endTime = 0;
    this.whichHeuristic = 0;
    this.UB = 0;
    this.seenStates = {};
  }

  //3333333333333333333333333333333333333333333
  //3333333333333333333333333333333333333333333
  //3333333333333333333333333333333333333333333
  //------------- Class Methods ---------------
  //------------- Class Methods ---------------

  //---------------------------
  //Method 1: Formulate Problem
  //---------------------------
  initialize() {
    //-------------------------------------
    //Step 1: Create final board - solution
    //-------------------------------------
    //A. Place numbers 1 - 8
    // let counter = 1;
    // for (let i = 0; i < this.cubeSize; i++) {
    //   for (let j = 0; j < this.cubeSize; j++) {
    //     this.finalState[i] ??= [];
    //     this.finalState[i][j] = counter;
    //     counter++;
    //   }
    // }
    //B. Place blank space
    // this.finalState[this.cubeSize - 1][this.cubeSize - 1] = 0;
    this.finalState = Array.from(Array(9).keys());
    this.finalState.shift();
    this.finalState.push(0);
    //-------------------------------------------------------
    //Step 2: Shuffle finalState and get random Initial State
    //-------------------------------------------------------
    // const initialStateBoard: Array<Array<any>> = this.copyBoard(this.finalState);
    const initialStateBoard = this.shuffleArray(this.finalState);

    //----------------------------
    //Step 3: Create Initial State
    //----------------------------
    // const spacePos: Array<number> = this.getSpacePosition(initialStateBoard);
    const spaceIndexRaw: number = initialStateBoard.findIndex((num) => num === 0);

    const spacePosition: SpacePosition = {
      row: getRowNumber(spaceIndexRaw),
      col: getColNumber(spaceIndexRaw),
    };

    const g: number = 0;
    const h: number = this.calculateH(initialStateBoard);
    this.initialState = createMyState({
      board: initialStateBoard,
      g,
      h,
      parent: null as any,
      spacePosition,
    });

    //---------------------------
    //Step 4: Print Initial State
    //---------------------------
    this.printBoard(initialStateBoard);
  }

  //---------------------
  //Method 2: Print Board
  //---------------------
  public printBoard(curBoard: Array<number>) {
    console.log(curBoard.join(', '));
    // console.log('-------------');
    // for (let i = 0; i < this.cubeSize; i++) {
    //   console.log('| ');
    //   for (let j = 0; j < this.cubeSize; j++) {
    //     const tileNumber: number = curBoard[i][j];
    //     let s: string;
    //     if (tileNumber > 0) {
    //       if (tileNumber > 9) {
    //         s = tileNumber + '';
    //       } else {
    //         s = tileNumber + ' ';
    //       }
    //     } else {
    //       s = '  ';
    //     }
    //     console.log(s + '| ');
    //   }
    //   console.log('\n');
    // }
    // console.log('-------------\n\n');
  }

  //-----------------------
  //Method 3: Shuffle Board
  //-----------------------
  shuffleArray(inputArr: Array<number>) {
    const newArray = [...inputArr];
    for (let i = newArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1)); // Get a random index
      [newArray[i], newArray[randomIndex]] = [newArray[randomIndex]!, newArray[i]!]; // Swap elements
    }
    return newArray;
  }

  //--------------------------------------------------
  //Method 4: Heuristic No. 1 - Number Misplaced Tiles
  //--------------------------------------------------
  public calculateMisplacedTilesCount(curBoard: Array<number>) {
    let wrong = 0;
    curBoard.forEach((currentNumber, index) => {
      if (currentNumber > 0 && currentNumber !== this.finalState[index]) {
        wrong++;
      }
    });
    return wrong;
  }

  //-----------------------------------------------
  //Method 5: Heuristic No. 2 - Manhattan distances
  //-----------------------------------------------
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

  //-----------------
  //Method 6: Is Goal
  //-----------------
  isGoal(curBoard: Array<number>) {
    return curBoard.every((value, index) => value === this.finalState[index]);
  }

  //----------------------------
  //Method 8: Get Next Space Pos
  //----------------------------
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

  //---------------------------
  //Method 9: All Valid Actions
  //---------------------------
  allValidActions(spacePosition: SpacePosition) {
    //Note: Return a boolean array of size 4.
    //A. Create operators list:
    // const operators: boolean[] = []; // new boolean[4]; //0= up, 1= right, 2= down, 3= left
    const validActions = {} as Actions; // new boolean[4]; //0= up, 1= right, 2= down, 3= left
    //B. Get curBoard's space position
    //C. Check up operator:
    if (spacePosition.row > 0) validActions.up = true;

    //D. Check right operator:
    if (spacePosition.col + 1 < this.cubeSize) validActions.right = true;

    //E. Check down operator:
    if (spacePosition.row + 1 < this.cubeSize) validActions.down = true;

    //F. Check left operator:
    if (spacePosition.col > 0) validActions.left = true;

    //G. return operators array:
    return validActions;
  }

  public chooseHeuristic(option: string) {
    while (true) {
      if (option === '1') {
        this.whichHeuristic = 1;
        return;
      } else if (option === '2') {
        this.whichHeuristic = 2;
        return;
      } else {
        console.log('Choice is between 1 and 2...');
        // option = this.sc.next();
        console.log();
      }
    }
  }

  //--------------------------
  //Method 12: Continue or not
  //--------------------------
  public toContinue(option: string) {
    console.log(option);
    while (true) {
      if (option === '1') {
        return true;
      } else if (option === '2') {
        return false;
      } else {
        console.log('Choice is between 1 and 2...');
        // option = this.sc.next();
        console.log();
      }
    }
  }

  //----------------------------
  //Method 12: Solve Using AStar
  //----------------------------
  public solveUsingAStar() {
    //----------------------
    //Step 1: Reset solution
    //----------------------
    this.solution = [];
    //----------------------------------------
    //Step 2: Create a hash set of seen states
    //----------------------------------------
    const seenStates: Record<string, MyState> = {};
    //-----------------------------
    //Step 3: Create priority queue
    //-----------------------------
    const priorityQueue: Array<MyState> = [];
    //-------------------------------------
    //Step 4: Insert initial state to queue
    //-------------------------------------
    smartEnqueueToStart<MyState>({ arr: priorityQueue, item: this.initialState, getValue: (item: MyState) => item.f });
    //.unshift(); // priorityQueue.SmartEnqueueToTail(this.initialState);
    //--------------------
    //Step 5: Begin A* Run
    //--------------------
    this.numOfIteration = 0;
    this.startTime = Date.now();
    while (priorityQueue.length > 0) {
      this.numOfIteration++;
      //-----------------------------------
      //Step 5.1: Dequeue/Generate next state
      //-----------------------------------
      const generated = priorityQueue.shift() as MyState; // priorityQueue.DequeueHead().GetEntity();
      const curStateSpacePos: SpacePosition = generated.spacePosition;
      const curStateSpacePosConvoluted = curStateSpacePos.row * 3 + curStateSpacePos.col;

      //----------------------------
      //Step 5.2: Add to seen states
      //----------------------------
      seenStates[generated.id] = generated; // seenStates.add(generated);
      //------------------------------------
      //Step 5.3: Check if GoalState reached
      //------------------------------------
      const generatedBoard: Array<number> = generated.board;
      if (this.isGoal(generatedBoard)) {
        console.log('Num of boards tested: %d.\n', this.numOfIteration);
        this.solution = []; // new MyList<>();
        let curState: MyState = generated;
        this.solution.unshift(curState); // this.solution.EnqueHead(curState); // insertion of goal-state.
        while (curState.parent != null) {
          this.solution.unshift(curState.parent); // this.solution.EnqueHead(curState.parent);
          curState = curState.parent;
        }
        this.endTime = Date.now();
        return;
      }
      //-------------------------------------
      //Step 5.3: Expand possible next states
      //-------------------------------------
      //A. Check all possible valid actions
      const validActions: Actions = this.allValidActions(generated.spacePosition);
      //  U     R     D     L
      //[true true false false]
      for (const validAction in validActions) {
        //C. Get position of space of next state
        const nextSpacePos: SpacePosition = this.getNextSpacePosition(
          generated.spacePosition,
          validAction as AvailableActions,
        );
        const nextSpacePosConvoluted = nextSpacePos.row * 3 + nextSpacePos.col;
        //D. Create next board
        const nextBoard: Array<number> = [...generatedBoard];
        nextBoard[curStateSpacePosConvoluted] = nextBoard[nextSpacePosConvoluted]!;
        nextBoard[nextSpacePosConvoluted] = 0;
        //E. Calculate g
        const g: number = generated.g + 1;
        //F. Calculate h
        const h = this.calculateH(nextBoard);
        //G. Create next MyState(board,parent,g,h,spacePosRow,spacePosCol)
        const nextState = createMyState({
          board: nextBoard,
          parent: generated,
          g,
          h,
          spacePosition: nextSpacePos,
        });
        //H. Check that this state wasn't seen before.
        if (!seenStates[nextState.id]) {
          // seenStates.contains(nextState)
          //I. Insert into priority queue
          smartEnqueueToStart({ arr: priorityQueue, item: nextState, getValue: (item: MyState) => item.f }); //priorityQueue.SmartEnqueToTail(nextState);
        }
      }
    }
  }

  //-------------------------------------
  //Method 13: Solve Using Branch & Bound
  //-------------------------------------
  public solveUsingBB() {
    //----------------------
    //Step 1: Reset solution
    //----------------------
    this.solution = null as unknown as Array<MyState>;
    //---------------------------------
    //Step 2: Reset list of seen states
    //---------------------------------
    this.seenStates = {};
    //--------------------------------
    //Step 3: Begin Branch & Bound Run
    //--------------------------------
    this.UB = 32;
    this.numOfIteration = 0;
    this.startTime = Date.now();
    this.open(this.initialState);
  }

  private open(curState: MyState) {
    this.numOfIteration++;
    //-------------
    const curBoard: Array<number> = [...curState.board];
    const curStateSpacePosition: SpacePosition = curState.spacePosition;
    const curStateSpacePositionConvoluted = curStateSpacePosition.row * 3 + curStateSpacePosition.col;
    //---------------------------------
    //STEP 1: Did I reach a Goal-State?
    //---------------------------------
    if (this.isGoal(curBoard)) {
      //A. Update Global UB
      this.UB = curState.g; ///or f
      console.log('Num of boards tested: %d. Solved in %d steps.\n', this.numOfIteration, this.UB);
      //B. Copy boards
      this.solution = [];
      this.solution.unshift(curState); // insertion of goal-state.
      while (curState.parent != null) {
        this.solution.unshift(curState.parent);
        curState = curState.parent;
      }
      this.endTime = Date.now();
      return;
    }

    //------------------------------------------------------
    //STEP 3: Expand all curState branches and calc their LB
    //------------------------------------------------------
    const fifoQueue: Array<MyState> = [];
    //How? Just say what happens if nextJob will be added NEXT.
    //A. Check all possible valid actions
    const actions = this.allValidActions(curState.spacePosition);

    for (const validAction in actions) {
      //C. Get position of space of next state
      const nextSpacePosition: SpacePosition = this.getNextSpacePosition(
        curState.spacePosition,
        validAction as AvailableActions,
      );
      const nextSpacePositionConvoluted = nextSpacePosition.row * 3 + nextSpacePosition.col;
      //D. Create next board
      const nextBoard: Array<number> = [...curBoard];
      nextBoard[curStateSpacePositionConvoluted] = nextBoard[nextSpacePositionConvoluted]!;
      nextBoard[nextSpacePositionConvoluted] = 0;
      //E. Calculate g
      const g = curState.g + 1;
      //F. Calculate h
      const h = this.calculateH(nextBoard);
      //G. Create next MyState(board,parent,g,h,spacePosRow,spacePosCol)
      const nextState: MyState = createMyState({
        board: nextBoard,
        g,
        h,
        parent: curState,
        spacePosition: nextSpacePosition,
      });

      //H. Insert into queue
      const seen: boolean = this.checkIfSeen(nextState); //Double role: Also replaces!!!

      if (!seen) {
        fifoQueue.push(nextState); //fifoQueue.EnqueueTail(nextState);
      }
    }

    //---------------------
    //STEP 4: BACK-TRACKING
    //---------------------
    while (fifoQueue.length > 0) {
      //STEP 5.1: Dequeue next state to check:
      const nextState = fifoQueue.shift() as MyState; // fifoQueue.DequeHead().GetEntity();
      //STEP 5.2: If branch doesn't EXCEED UB.
      if (nextState.f < this.UB) {
        //Try and test this action: (CONTINUE to Branch and Bound)
        this.open(nextState);
        //Getting here = regretting this assignment!
      } //else{
      //Is higher than UB! Bound it and move on!
      //}
    }
  }

  private checkIfSeen(someState: MyState) {
    const prevState = this.seenStates[someState.id]; // seenStates.get(someState);

    if (prevState == null) {
      //prevState does not exist...
      this.seenStates[someState.id] = someState; // seenStates.put(someState,someState);
      return false;
    }

    //someState exists! but wait, is it worse?
    if (someState.g >= prevState.g) {
      //Yes! it is worse! so, same board that was reached after more steps will not be inserted.
      return true;
    } else {
      //No! it is better! so, same board that was reached after less steps will replace current one.
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

  public whatWasTheAction(state1: MyState, state2: MyState) {
    if (state2.spacePosition.row < state1.spacePosition.row) return 0;

    if (state2.spacePosition.col > state1.spacePosition.col) return 1;

    if (state2.spacePosition.row > state1.spacePosition.row) return 2;

    if (state2.spacePosition.col < state1.spacePosition.col) return 3;

    return -999;
  }

  getInvCount(arr: Array<number>) {
    let invCounter = 0;
    for (let i = 0; i < 7; i++) {
      for (let j = i + 1; j < 8; j++) {
        if (arr[i]! > 0 && arr[i]! > arr[j]!) {
          invCounter++;
        }
      }
    }
    return invCounter;
  }

  isSolvable(puzzle: Array<number>): boolean {
    // Get the count of inversions
    const invCount = this.getInvCount(puzzle);

    // Return true if inversion count is even, false if odd
    return invCount % 2 === 0;
  }
}

function runProgram() {
  //-----------------------
  //Step 1: Create new game
  //-----------------------
  const program: Program = new Program();
  //------------------------
  //Step 2: Choose heuristic (for both methods)
  //------------------------
  console.log('Which heuristic to apply? (1= numOfMisplaced , 2= manhattanDistances)');
  const chosen: string = '1';
  program.chooseHeuristic(chosen);
  //-------------------------
  //Step 3: Formulate problem
  //-------------------------
  program.initialize();
  //-----------------------
  //Step 4: to solve or not
  //-----------------------

  if (!program.isSolvable(program.initialState.board)) return console.log('Bad news... Puzzle is unsolvable.');

  console.log('Good news! Puzzle is solvable!');

  //---------------------
  //Step 4.1: Solve with A*
  //---------------------
  console.log('Solving with A*:');
  program.solveUsingAStar();
  //Display solution:
  if (program.solution == null) {
    console.log("The algorithm wasn't able to solve the puzzle...");
    console.log('Num of boards tested: %d.\n', program.numOfIteration);
    return;
  }

  console.log('A* solved 8-puzzle in %d moves.', program.solution.length - 1);
  //Print initial state:
  console.log('Initial State:');
  const initialState = program.solution.at(0) as MyState;
  program.printBoard(initialState.board);

  for (let i = 1; i < program.solution.length; i++) {
    //Get state:
    const curState = program.solution[i] as MyState;
    //Get state's board:
    const curBoard = curState.board;
    //Print state's board:
    console.log('Move number: %d\n', i);
    program.printBoard(curBoard);
  }
  const timeToSolve = program.endTime - program.startTime;
  console.log('Time taken: ' + timeToSolve + 'ms\n');

  //---------------------------------
  //Step 4.2: Solve with Branch & Bound
  //---------------------------------
  console.log('Solving with Branch & Bound:');
  program.solveUsingBB();
  //Display solution:
  if (program.solution == null) {
    console.log('This puzzle CANNOT be solved!');
    console.log('Num of boards tested: ', program.numOfIteration);
  } else {
    console.log('Branch & Bound solved 8-puzzle in %d moves.\n', program.solution.length - 1);
    //Print initial state:
    console.log('Initial State:');
    const initialState = program.solution.at(0) as MyState; // let <MyState> iNod = program.solution.GetFirst();
    program.printBoard(initialState.board);
    // iNod = iNod.GetNext();
    //Print solution:
    for (let i = 1; i < program.solution.length; i++) {
      //Get state:
      const curState = program.solution[i] as MyState; // iNod.GetEntity();
      //Get state's board:
      const curBoard = curState.board;
      //Print state's board:
      console.log('Move number: %d\n', i);
      program.printBoard(curBoard);
      //Get nextState:
      // iNod = iNod.GetNext();
    }
    const timeToSolve = program.endTime - program.startTime;
    console.log('Time taken: ' + timeToSolve + 'ms\n');

    console.log('Program ended.');
  }
}

runProgram();
