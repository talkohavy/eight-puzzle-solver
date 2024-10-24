import { MyState } from "./MyState";

class Program {
  //1111111111111111111111111111111111111111111
  //1111111111111111111111111111111111111111111
  //1111111111111111111111111111111111111111111
  //------------ Class Variables --------------
  //------------ Class Variables --------------
  public cubeSize = 3;
  public finalState = []; // new int[cubeSize][cubeSize];
  private initialState: MyState;
  public numOfIteration: number;
  public solution: Array<MyState>;
  public startTime: number;
  public endTime: number;
  private maxIterations = 200000;
  private didItStop: boolean;
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
  public Program() {}

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
    let counter = 1;
    for (let i = 0; i < this.cubeSize; i++) {
      for (let j = 0; j < this.cubeSize; j++) {
        this.finalState[i] ??= [];
        this.finalState[i][j] = counter;
        counter++;
      }
    }
    //B. Place blank space
    this.finalState[this.cubeSize - 1][this.cubeSize - 1] = 0;
    //-------------------------------------------------------
    //Step 2: Shuffle finalState and get random Initial State
    //-------------------------------------------------------
    const initialStateBoard: Array<Array<any>> = this.copyBoard(
      this.finalState
    );
    this.shuffle(initialStateBoard);

    /*
    | 3 | 1 | 4 |
    | 6 | 7 | 5 |
    | 2 | 8 |   | bb is not better than a*


    initialStateBoard[0][0] = 1;
    initialStateBoard[0][1] = 2;
    initialStateBoard[0][2] = 3;

    initialStateBoard[1][0] = 4;
    initialStateBoard[1][1] = 5;
    initialStateBoard[1][2] = 6;

    initialStateBoard[2][0] = 0;
    initialStateBoard[2][1] = 8;
    initialStateBoard[2][2] = 7;


    -------------------------------------------
    -----A puzzle that cannot be solved -------
    -------------------------------------------
    initialStateBoard[0][0] = 1;
    initialStateBoard[0][1] = 2;
    initialStateBoard[0][2] = 3;

    initialStateBoard[1][0] = 4;
    initialStateBoard[1][1] = 5;
    initialStateBoard[1][2] = 6;

    initialStateBoard[2][0] = 0;
    initialStateBoard[2][1] = 8;
    initialStateBoard[2][2] = 7;
    */

    //----------------------------
    //Step 3: Create Initial State
    //----------------------------
    const spacePos: Array<number> = this.getSpacePosition(initialStateBoard);
    const g: number = 0;
    const h: number = this.calculateH(initialStateBoard);
    this.initialState = new MyState(
      initialStateBoard,
      null,
      g,
      h,
      spacePos[0],
      spacePos[1]
    );

    //---------------------------
    //Step 4: Print Initial State
    //---------------------------
    this.printBoard(initialStateBoard);
  }

  //---------------------
  //Method 2: Print Board
  //---------------------
  public printBoard(curBoard: Array<Array<number>>) {
    console.log("-------------");
    for (let i = 0; i < this.cubeSize; i++) {
      console.log("| ");
      for (let j = 0; j < this.cubeSize; j++) {
        const tileNumber: number = curBoard[i][j];
        let s: string;
        if (tileNumber > 0) {
          if (tileNumber > 9) {
            s = tileNumber + "";
          } else {
            s = tileNumber + " ";
          }
        } else {
          s = "  ";
        }
        console.log(s + "| ");
      }
      console.log("\n");
    }
    console.log("-------------\n\n");
  }

  //-----------------------
  //Method 3: Shuffle Board
  //-----------------------
  shuffle(curBoard: Array<Array<number>>) {
    const rnd = Math.random();
    const numOfCells: number = this.cubeSize * 2;
    let curLast = numOfCells;
    for (let i = 0; i < numOfCells; i++) {
      // Extract row & col:
      let curLastRow = curLast / this.cubeSize;
      let curLastCol = curLast % this.cubeSize;
      // Sample random cell:
      let index = Math.random(); // rnd.nextInt(curLast);
      let indexRow = index / this.cubeSize;
      let indexCol = index % this.cubeSize;
      // Make the swap:
      let temp = curBoard[indexRow][indexCol];
      curBoard[indexRow][indexCol] = curBoard[curLastRow][curLastCol];
      curBoard[curLastRow][curLastCol] = temp;
      // Decrease running index:
      curLast--;
    }
  }

  //--------------------------------------------------
  //Method 4: Heuristic No. 1 - Number Misplaced Tiles
  //--------------------------------------------------
  public numOfMisplaced(curBoard: Array<Array<number>>) {
    let wrong = 0;
    for (let i = 0; i < this.cubeSize; i++) {
      for (let j = 0; j < this.cubeSize; j++) {
        if (curBoard[i][j] > 0 && curBoard[i][j] != this.finalState[i][j]) {
          wrong++;
        }
      }
    }
    return wrong;
  }

  //-----------------------------------------------
  //Method 5: Heuristic No. 2 - Manhattan distances
  //-----------------------------------------------
  public ManhattanDistances(curBoard: Array<Array<number>>) {
    let value = 0;
    for (let i1 = 0; i1 < this.cubeSize; i1++) {
      for (let j1 = 0; j1 < this.cubeSize; j1++) {
        //Step 1: get curBoard
        let ijValue = curBoard[i1][j1];
        if (ijValue == 0) {
          continue;
        }
        let i2 = (ijValue - 1) / 3;
        let j2 = (ijValue - 1) % 3;
        value = value + Math.abs(i1 - i2) + Math.abs(j1 - j2);
      }
    }
    return value;
  }

  //-----------------
  //Method 6: Is Goal
  //-----------------
  isGoal(curBoard: Array<Array<number>>) {
    for (let i = 0; i < this.cubeSize; i++) {
      for (let j = 0; j < this.cubeSize; j++) {
        if (curBoard[i][j] != this.finalState[i][j]) {
          return false;
        }
      }
    }
    return true;
  }

  //-----------------------
  //Method 7: Copy 2D array
  //-----------------------
  public copyBoard(curArr: Array<Array<number>>) {
    //A. Create new board:
    let copied = []; // new int[curArr.length][curArr.length];
    //B. Copy given board:
    for (let i = 0; i < curArr.length; i++) {
      for (let j = 0; j < curArr[0].length; j++) {
        copied[i] ??= [];
        copied[i][j] = curArr[i][j];
      }
    }
    return copied;
  }

  //----------------------------
  //Method 8: Get Next Space Pos
  //----------------------------
  private getNextSpacePos(state: MyState, action: number) {
    let nextSpacePos = []; // new int[2];
    switch (action) {
      case 0: // ----- Operator Up    -----
        nextSpacePos.push(state.spaceRow - 1);
        nextSpacePos.push(state.spaceCol);
        break;
      case 1: // ----- Operator Right -----
        nextSpacePos.push(state.spaceRow);
        nextSpacePos.push(state.spaceCol + 1);
        break;
      case 2: // ----- Operator Down  -----
        nextSpacePos.push(state.spaceRow + 1);
        nextSpacePos.push(state.spaceCol);
        break;
      case 3: // ----- Operator Left  -----
        nextSpacePos.push(state.spaceRow);
        nextSpacePos.push(state.spaceCol - 1);
        break;
      default:
        console.log("Something went horribly wrong...");
        break;
    }
    return nextSpacePos;
  }

  //---------------------------
  //Method 9: All Valid Actions
  //---------------------------
  allValidActions(curState: MyState) {
    //Note: Return a boolean array of size 4.
    //A. Create operators list:
    let operators: boolean[] = []; // new boolean[4]; //0= up, 1= right, 2= down, 3= left
    //B. Get curBoard's space position
    //C. Check up operator:
    if (curState.spaceRow > 0) {
      operators[0] = true;
    }
    //D. Check right operator:
    if (curState.spaceCol + 1 < this.cubeSize) {
      operators[1] = true;
    }
    //E. Check down operator:
    if (curState.spaceRow + 1 < this.cubeSize) {
      operators[2] = true;
    }
    //F. Check left operator:
    if (curState.spaceCol > 0) {
      operators[3] = true;
    }
    //G. return operators array:
    return operators;
  }

  //-----------------------------
  //Method 10: Get Space Position
  //-----------------------------
  private getSpacePosition(curBoard: Array<Array<number>>) {
    let rowAndCol: Array<number> = []; //new int[2];
    for (let i = 0; i < this.cubeSize; i++) {
      for (let j = 0; j < this.cubeSize; j++) {
        if (curBoard[i][j] == 0) {
          //Get space row:
          rowAndCol.push(i);
          //Get space col:
          rowAndCol.push(j);
          return rowAndCol;
        }
      }
    }
    console.log("Something went horribly wrong...");
    return []; // new int[2];
  }

  //---------------------------
  //Method 11: Choose Heuristic
  //---------------------------
  public chooseHeuristic(option: string) {
    while (true) {
      if (option === "1") {
        this.whichHeuristic = 1;
        return;
      } else if (option === "2") {
        this.whichHeuristic = 2;
        return;
      } else {
        console.log("Choice is between 1 and 2...");
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
      if (option === "1") {
        return true;
      } else if (option === "2") {
        return false;
      } else {
        console.log("Choice is between 1 and 2...");
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
    this.solution = null;
    //-------------------------------------
    //Step 2: Create hashset of seen states
    //-------------------------------------
    let seenStates: Record<string, MyState> = {};
    //-----------------------------
    //Step 3: Create priority queue
    //-----------------------------
    let priorityQueue: Array<MyState> = [];
    //-------------------------------------
    //Step 4: Insert initial state to queue
    //-------------------------------------
    priorityQueue.unshift(this.initialState); // priorityQueue.SmartEnqueToTail(this.initialState);
    //--------------------
    //Step 5: Begin A* Run
    //--------------------
    this.numOfIteration = 0;
    this.startTime = Date.now(); // System.currentTimeMillis();
    while (priorityQueue.length > 0) {
      this.numOfIteration++;
      //-----------------------------------
      //Step 5.1: Deque/Generate next state
      //-----------------------------------
      let generated: MyState = priorityQueue.shift(); // priorityQueue.DequeHead().GetEntity();
      let curStateSpacePos: Array<number> = [
        generated.spaceRow,
        generated.spaceCol,
      ];
      //----------------------------
      //Step 5.2: Add to seen states
      //----------------------------
      seenStates["sdasd"] = generated; // seenStates.add(generated);
      //------------------------------------
      //Step 5.3: Check if GoalState reached
      //------------------------------------
      let generatedBoard: Array<Array<number>> = generated.board;
      if (this.isGoal(generatedBoard)) {
        console.log("Num of boards tested: %d.\n", this.numOfIteration);
        this.solution = []; // new MyList<>();
        let curState: MyState = generated;
        this.solution.unshift(curState); // this.solution.EnqueHead(curState); // insertion of goal-state.
        while (curState.parent != null) {
          this.solution.unshift(curState); // this.solution.EnqueHead(curState.parent);
          curState = curState.parent;
        }
        this.endTime = Date.now();
        return;
      }
      //-------------------------------------
      //Step 5.3: Expand possible next states
      //-------------------------------------
      //A. Check all possible valid actions
      let actions: Array<boolean> = this.allValidActions(generated);
      //  U     R     D     L
      //[true true false false]
      for (let action = 0; action < actions.length; action++) {
        //B. If action is valid...
        if (actions[action]) {
          //C. Get position of space of next state
          let nextSpacePos: Array<number> = this.getNextSpacePos(
            generated,
            action
          );
          //D. Create next board
          let nextBoard: Array<Array<number>> = this.copyBoard(generatedBoard);
          nextBoard[curStateSpacePos[0]][curStateSpacePos[1]] =
            nextBoard[nextSpacePos[0]][nextSpacePos[1]];
          nextBoard[nextSpacePos[0]][nextSpacePos[1]] = 0;
          //E. Calculate g
          let g: number = generated.g + 1;
          //F. Calculate h
          let h = this.calculateH(nextBoard);
          //G. Create next MyState(board,parent,g,h,spacePosRow,spacePosCol)
          let nextState: MyState = new MyState(
            nextBoard,
            generated,
            g,
            h,
            nextSpacePos[0],
            nextSpacePos[1]
          );
          //H. Check that this state wasn't seen before.
          if (!seenStates["asdasd"]) {
            // seenStates.contains(nextState)
            //I. Insert into priority queue
            priorityQueue.unshift(nextState); //priorityQueue.SmartEnqueToTail(nextState);
          }
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
    this.solution = null;
    //---------------------------------
    //Step 2: Reset list of seen states
    //---------------------------------
    this.seenStates = {}; // new HashMap<>();
    //--------------------------------
    //Step 3: Begin Branch & Bound Run
    //--------------------------------
    this.UB = 32;
    this.numOfIteration = 0;
    this.startTime = Date.now(); // System.currentTimeMillis();
    this.open(this.initialState);
  }

  private open(curState: MyState) {
    this.numOfIteration++;
    //-------------
    let curBoard: Array<Array<number>> = this.copyBoard(curState.board);
    let curStateSpacePos: Array<number> = [
      curState.spaceRow,
      curState.spaceCol,
    ];
    //---------------------------------
    //STEP 1: Did I reach a Goal-State?
    //---------------------------------
    if (this.isGoal(curBoard)) {
      //A. Update Global UB
      this.UB = curState.g; ///or f
      console.log(
        "Num of boards tested: %d. Solved in %d steps.\n",
        this.numOfIteration,
        this.UB
      );
      //B. Copy boards
      this.solution = []; // new MyList<>();
      this.solution.unshift(curState); // this.solution.EnqueHead(curState); // insertion of goal-state.
      while (curState.parent != null) {
        this.solution.unshift(curState.parent); // solution.EnqueHead(curState.parent);
        curState = curState.parent;
      }
      this.endTime = Date.now();
      return;
    }
    //---------------------------------
    //STEP 2: Reached time limit? Stop!
    //---------------------------------
    /*if (this.numOfIteration > maxIterations) {
        this.didItStop = true;
        return;
    }*/

    //------------------------------------------------------
    //STEP 3: Expand all curState branches and calc their LB
    //------------------------------------------------------
    let fifoQueue: Array<MyState> = []; //new MyList<>();
    //How? Just say what happens if nextJob will be added NEXT.
    //A. Check all possible valid actions
    let actions: Array<boolean> = this.allValidActions(curState);
    //  U     R     D     L
    //[true true false false]
    for (let action = 0; action < actions.length; action++) {
      //B. If action is valid...
      if (actions[action]) {
        //C. Get position of space of next state
        let nextSpacePos: Array<number> = this.getNextSpacePos(
          curState,
          action
        );
        //D. Create next board
        let nextBoard: Array<Array<number>> = this.copyBoard(curBoard);
        nextBoard[curStateSpacePos[0]][curStateSpacePos[1]] =
          nextBoard[nextSpacePos[0]][nextSpacePos[1]];
        nextBoard[nextSpacePos[0]][nextSpacePos[1]] = 0;
        //E. Calculate g
        let g = curState.g + 1;
        //F. Calculate h
        let h = this.calculateH(nextBoard);
        //G. Create next MyState(board,parent,g,h,spacePosRow,spacePosCol)
        let nextState: MyState = new MyState(
          nextBoard,
          curState,
          g,
          h,
          nextSpacePos[0],
          nextSpacePos[1]
        );
        //H. Insert into queue
        let seen: boolean = this.checkIfSeen(nextState); //Double role: Also replaces!!!
        if (!seen) {
          fifoQueue.unshift(nextState); //fifoQueue.EnqueTail(nextState);
        }
      }
    }

    //---------------------
    //STEP 4: BACK-TRACKING
    //---------------------
    while (fifoQueue.length > 0) {
      //STEP 5.1: Deque next state to check:
      let nextState: MyState = fifoQueue.pop(); // fifoQueue.DequeHead().GetEntity();
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
    let prevState: MyState = this.seenStates["asdasd"]; // seenStates.get(someState);
    if (prevState != null) {
      //someState exists! but wait, is it worse?
      if (someState.g >= prevState.g) {
        //Yes! it is worse! so, same board that was reached after more steps will not be inserted.
        return true;
      } else {
        //No! it is better! so, same board that was reached after less steps will replace current one.
        this.seenStates["asdasd"] = someState; // seenStates.put(someState,someState);
        return false;
      }
    } else {
      //prevState does not exist...
      this.seenStates["asdasd"] = someState; // seenStates.put(someState,someState);
      return false;
    }
  }

  private calculateH(someBoard: Array<Array<number>>) {
    switch (this.whichHeuristic) {
      case 1: // ------ Num Of Misplaced Tiles -------
        return this.numOfMisplaced(someBoard);
      case 2: // ------ Manhattan Distances -------
        return this.ManhattanDistances(someBoard);
      default:
        console.error("Something went terribly wrong...");
        return -100;
    }
  }

  public whatWasTheAction(state1: MyState, state2: MyState) {
    if (state2.spaceRow < state1.spaceRow) {
      return 0;
    }
    if (state2.spaceCol > state1.spaceCol) {
      return 1;
    }
    if (state2.spaceRow > state1.spaceRow) {
      return 2;
    }
    if (state2.spaceCol < state1.spaceCol) {
      return 3;
    }
    return -999;
  }

  getInvCount(arr: Array<number>) {
    let invCounter = 0;
    for (let i = 0; i < 7; i++) {
      for (let j = i + 1; j < 8; j++) {
        if (arr[i] > 0 && arr[i] > arr[j]) {
          invCounter++;
        }
      }
    }
    return invCounter;
  }

  // This function returns true
  // if given 8 puzzle is solvable.
  isSolvable(puzzle: Array<Array<number>>) {
    // Count inversions in given 8 puzzle
    let oneDim: Array<number> = []; // new int[8];
    let arrIndex = 0;
    let loopInd = 0;
    while (loopInd < 9) {
      let row = loopInd / 3;
      let col = loopInd % 3;
      if (puzzle[row][col] > 0) {
        oneDim[arrIndex] = puzzle[row][col];
        arrIndex++;
      }
      loopInd++;
    }
    let invCount = this.getInvCount(oneDim);
    // return true if inversion count is even.
    return invCount % 2 == 0;
  }
}

//-----------------------
//Step 1: Create new game
//-----------------------
let program: Program = new Program();
//------------------------
//Step 2: Choose heuristic (for both methods)
//------------------------
console.log(
  "Which heuristic to apply? (1= numOfMisplaced , 2= manhattanDistances)"
);
let chosen: string = "";
program.chooseHeuristic(chosen);
//-------------------------
//Step 3: Formulate problem
//-------------------------
program.initialize();
//-----------------------
//Step 4: to solve or not
//-----------------------
let tryToSolve: boolean = true;
if (!program.isSolvable(program.initialState.board)) {
  console.log(
    "Bad news... Puzzle is unsolvable.\nWould you still try to solve?\n(1= Yes , 2= No)"
  );
  // tryToSolve = program.toContinue(program.sc.next());
  tryToSolve = program.toContinue("asdasd");
} else {
  console.log("Good news! Puzzle is solvable!");
}
if (tryToSolve) {
  //---------------------
  //Step 4.1: Solve with A*
  //---------------------
  console.log("Solving with A*:");
  program.solveUsingAStar();
  //Display solution:
  if (program.solution == null) {
    console.log("This puzzle CANNOT be solved!");
    console.log("Num of boards tested: %d.\n", program.numOfIteration);
  } else {
    console.log("A* solved 8-puzzle in %d moves.", program.solution.length - 1);
    //Print initial state:
    console.log("Initial State:");
    //let iNod:MyState = program.solution.at(0) //program.solution.GetFirst();
    let initialState: MyState = program.solution.at(0); // MyState initialState = iNod.GetEntity();
    program.printBoard(initialState.board);
    // iNod = iNod.GetNext();
    for (let i = 1; i < program.solution.length; i++) {
      //Get state:
      let curState: MyState = program.solution[i]; //  iNod.GetEntity();
      //Get state's board:
      let curBoard: Array<Array<number>> = curState.board;
      //Print state's board:
      console.log("Move number: %d\n", i);
      program.printBoard(curBoard);
      //Get nextState:
      // iNod = iNod.GetNext();
    }
    let timeToSolve = program.endTime - program.startTime;
    console.log("Time taken: " + timeToSolve + "ms\n");
  }

  //---------------------------------
  //Step 4.2: Solve with Branch & Bound
  //---------------------------------
  console.log("Solving with Branch & Bound:");
  program.solveUsingBB();
  //Display solution:
  if (program.solution == null) {
    console.log("This puzzle CANNOT be solved!");
    console.log("Num of boards tested: ", program.numOfIteration);
  } else {
    console.log(
      "Branch & Bound solved 8-puzzle in %d moves.\n",
      program.solution.length - 1
    );
    //Print initial state:
    console.log("Initial State:");
    let iNod: MyState = program.solution.at(0); // let <MyState> iNod = program.solution.GetFirst();
    program.printBoard(iNod.board);
    // iNod = iNod.GetNext();
    //Print solution:
    for (let i = 1; i < program.solution.length; i++) {
      //Get state:
      let curState: MyState = program.solution[i]; // iNod.GetEntity();
      //Get state's board:
      let curBoard: Array<Array<number>> = curState.board;
      //Print state's board:
      console.log("Move number: %d\n", i);
      program.printBoard(curBoard);
      //Get nextState:
      // iNod = iNod.GetNext();
    }
    let timeToSolve = program.endTime - program.startTime;
    console.log("Time taken: " + timeToSolve + "ms\n");
  }

  console.log("Program ended.");
}
