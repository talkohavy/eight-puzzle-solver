import java.util.*;
import MyClasses.*;


public class Program {
    //1111111111111111111111111111111111111111111
    //1111111111111111111111111111111111111111111
    //1111111111111111111111111111111111111111111
    //------------ Class Variables --------------
    //------------ Class Variables --------------
    public final int cubeSize = 3;
    public int[][] finalState = new int[cubeSize][cubeSize];
    private MyState initialState;
    public int numOfIteration;
    private MyList<MyState> solution;
    private long startTime;
    private long endTime;
    private long maxIterations = 200000;
    private boolean didItStop;
    private Scanner sc = new Scanner(System.in);
    private int whichHeuristic; //1= numOfMisplaced , 2= manhattanDistances
    //~~~~~~~~~~~~~~~~~~
    //For Branch & Bound:
    //~~~~~~~~~~~~~~~~~~
    private int UB;
    HashMap<MyState,MyState> seenStates;


    //2222222222222222222222222222222222222222222
    //2222222222222222222222222222222222222222222
    //2222222222222222222222222222222222222222222
    //-------------- Constructor ----------------
    //-------------- Constructor ----------------
    public Program(){

    }

    //3333333333333333333333333333333333333333333
    //3333333333333333333333333333333333333333333
    //3333333333333333333333333333333333333333333
    //------------- Class Methods ---------------
    //------------- Class Methods ---------------

    //---------------------------
    //Method 1: Formulate Problem
    //---------------------------
    public void initialize() {
        //-------------------------------------
        //Step 1: Create final board - solution
        //-------------------------------------
        //A. Place numbers 1 - 8
        int counter = 1;
        for (int i = 0; i < this.cubeSize; i++) {
            for (int j = 0; j < this.cubeSize; j++) {
                this.finalState[i][j] = counter;
                counter++;
            }
        }
        //B. Place blank space
        this.finalState[this.cubeSize - 1][this.cubeSize - 1] = 0;
        //-------------------------------------------------------
        //Step 2: Shuffle finalState and get random Initial State
        //-------------------------------------------------------
        int[][] initialStateBoard;
        initialStateBoard = copyBoard(this.finalState);
        shuffle(initialStateBoard);

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
        int[] spacePos = getSpacePosition(initialStateBoard);
        int g = 0;
        int h = calculateH(initialStateBoard);
        initialState = new MyState(initialStateBoard, null, g, h, spacePos[0], spacePos[1]);

        //---------------------------
        //Step 4: Print Initial State
        //---------------------------
        this.printBoard(initialStateBoard);
    }

    //---------------------
    //Method 2: Print Board
    //---------------------
    public void printBoard(int[][] curBoard) {
        System.out.println("-------------");
        for (int i = 0; i < this.cubeSize; i++) {
            System.out.print("| ");
            for (int j = 0; j < this.cubeSize; j++) {
                int tileNumber = curBoard[i][j];
                String s;
                if (tileNumber > 0) {
                    if (tileNumber > 9){
                        s = tileNumber + "";
                    }else{
                        s = tileNumber + " ";
                    }
                }else{
                    s = "  ";
                }
                System.out.print(s + "| ");
            }
            System.out.print("\n");
        }
        System.out.print("-------------\n\n");
    }

    //-----------------------
    //Method 3: Shuffle Board
    //-----------------------
    public void shuffle(int[][] curBoard) {
        Random rnd = new Random();
        int numOfCells = this.cubeSize*2;
        int curLast = numOfCells;
        for (int i = 0; i < numOfCells; i++){
            // Extract row & col:
            int curLastRow = curLast / this.cubeSize;
            int curLastCol = curLast % this.cubeSize;
            // Sample random cell:
            int index = rnd.nextInt(curLast);
            int indexRow = index / this.cubeSize;
            int indexCol = index % this.cubeSize;
            // Make the swap:
            int temp = curBoard[indexRow][indexCol];
            curBoard[indexRow][indexCol] = curBoard[curLastRow][curLastCol];
            curBoard[curLastRow][curLastCol] = temp;
            // Decrease running index:
            curLast--;
        }
    }

    //--------------------------------------------------
    //Method 4: Heuristic No. 1 - Number Misplaced Tiles
    //--------------------------------------------------
    public int numOfMisplaced(int[][] curBoard) {
        int wrong = 0;
        for (int i = 0; i < this.cubeSize; i++) {
            for (int j = 0; j < this.cubeSize; j++) {
                if ((curBoard[i][j] > 0) && (curBoard[i][j] != this.finalState[i][j])) {
                    wrong++;
                }
            }
        }
        return wrong;
    }

    //-----------------------------------------------
    //Method 5: Heuristic No. 2 - Manhattan distances
    //-----------------------------------------------
    public int ManhattanDistances(int[][] curBoard) {
        int value = 0;
        for (int i1 = 0; i1 < this.cubeSize; i1++) {
            for (int j1 = 0; j1 < this.cubeSize; j1++) {
                //Step 1: get curBoard
                int ijValue = curBoard[i1][j1];
                if (ijValue == 0){
                    continue;
                }
                int i2 = (ijValue - 1) / 3;
                int j2 = (ijValue - 1) % 3;
                value = value + Math.abs(i1 - i2) + Math.abs(j1 - j2);
            }
        }
        return value;
    }

    //-----------------
    //Method 6: Is Goal
    //-----------------
    public boolean isGoal(int[][] curBoard) {
        for (int i = 0; i < this.cubeSize; i++) {
            for (int j = 0; j < this.cubeSize; j++) {
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
    public int[][] copyBoard(int[][] curArr) {
        //A. Create new board:
        int[][] copied = new int[curArr.length][curArr.length];
        //B. Copy given board:
        for (int i = 0; i < curArr.length; i++) {
            for (int j = 0; j < curArr[0].length; j++) {
                copied[i][j] = curArr[i][j];
            }
        }
        return copied;
    }

    //----------------------------
    //Method 8: Get Next Space Pos
    //----------------------------
    private int[] getNextSpacePos(MyState state, int action) {
        int[] nextSpacePos = new int[2];
        switch (action){
            case 0: // ----- Operator Up    -----
                nextSpacePos[0] = state.spaceRow - 1;
                nextSpacePos[1] = state.spaceCol;
                break;
            case 1: // ----- Operator Right -----
                nextSpacePos[0] = state.spaceRow;
                nextSpacePos[1] = state.spaceCol + 1;
                break;
            case 2: // ----- Operator Down  -----
                nextSpacePos[0] = state.spaceRow + 1;
                nextSpacePos[1] = state.spaceCol;
                break;
            case 3: // ----- Operator Left  -----
                nextSpacePos[0] = state.spaceRow;
                nextSpacePos[1] = state.spaceCol - 1;
                break;
            default:
                System.err.println("Something went horribly wrong...");
                break;
        }
        return nextSpacePos;
    }

    //---------------------------
    //Method 9: All Valid Actions
    //---------------------------
    public boolean[] allValidActions(MyState curState){
        //Note: Return a boolean array of size 4.
        //A. Create operators list:
        boolean[] operators = new boolean[4]; //0= up, 1= right, 2= down, 3= left
        //B. Get curBoard's space position
        //C. Check up operator:
        if(curState.spaceRow > 0){
            operators[0] = true;
        }
        //D. Check right operator:
        if(curState.spaceCol + 1 < this.cubeSize){
            operators[1] = true;
        }
        //E. Check down operator:
        if(curState.spaceRow + 1 < this.cubeSize){
            operators[2] = true;
        }
        //F. Check left operator:
        if(curState.spaceCol > 0){
            operators[3] = true;
        }
        //G. return operators array:
        return operators;
    }

    //-----------------------------
    //Method 10: Get Space Position
    //-----------------------------
    private int[] getSpacePosition(int[][] curBoard) {
        int[] rowAndCol = new int[2];
        for (int i=0; i < this.cubeSize; i++){
            for (int j=0; j < this.cubeSize; j++){
                if (curBoard[i][j] == 0){
                    //Get space row:
                    rowAndCol[0] = i;
                    //Get space col:
                    rowAndCol[1] = j;
                    return rowAndCol;
                }
            }
        }
        System.err.println("Something went horribly wrong...");
        return new int[2];
    }

    //---------------------------
    //Method 11: Choose Heuristic
    //---------------------------
    public void chooseHeuristic(String option){
        while(true) {
            if (option.equals("1")) {
                whichHeuristic = 1;
                return;
            } else if (option.equals("2")) {
                whichHeuristic = 2;
                return;
            } else {
                System.out.println("Choice is between 1 and 2...");
                option = this.sc.next();
                System.out.println();
            }
        }
    }

    //--------------------------
    //Method 12: Continue or not
    //--------------------------
    public boolean toContinue(String option){
        System.out.println(option);
        while(true) {
            if (option.equals("1")) {
                return true;
            } else if (option.equals("2")) {
                return false;
            } else {
                System.out.println("Choice is between 1 and 2...");
                option = this.sc.next();
                System.out.println();
            }
        }
    }

    //----------------------------
    //Method 12: Solve Using AStar
    //----------------------------
    public void solveUsingAStar() {
        //----------------------
        //Step 1: Reset solution
        //----------------------
        this.solution = null;
        //-------------------------------------
        //Step 2: Create hashset of seen states
        //-------------------------------------
        HashSet<MyState> seenStates = new HashSet<>();
        //-----------------------------
        //Step 3: Create priority queue
        //-----------------------------
        MyList<MyState> priorityQueue = new MyList<>();
        //-------------------------------------
        //Step 4: Insert initial state to queue
        //-------------------------------------
        priorityQueue.SmartEnqueToTail(this.initialState);
        //--------------------
        //Step 5: Begin A* Run
        //--------------------
        this.numOfIteration = 0;
        this.startTime = System.currentTimeMillis();
        while (priorityQueue.size > 0) {
            this.numOfIteration++;
            //-----------------------------------
            //Step 5.1: Deque/Generate next state
            //-----------------------------------
            MyState generated = priorityQueue.DequeHead().GetEntity();
            int[] curStateSpacePos = {generated.spaceRow, generated.spaceCol};
            //----------------------------
            //Step 5.2: Add to seen states
            //----------------------------
            seenStates.add(generated);
            //------------------------------------
            //Step 5.3: Check if GoalState reached
            //------------------------------------
            int[][] generatedBoard = generated.board;
            if (isGoal(generatedBoard)) {
                System.out.printf("Num of boards tested: %d.\n", this.numOfIteration);
                this.solution = new MyList<>();
                MyState curState = generated;
                this.solution.EnqueHead(curState); // insertion of goal-state.
                while (curState.parent != null) {
                    this.solution.EnqueHead(curState.parent);
                    curState = curState.parent;
                }
                this.endTime = System.currentTimeMillis();
                return;
            }
            //-------------------------------------
            //Step 5.3: Expand possible next states
            //-------------------------------------
            //A. Check all possible valid actions
            boolean[] actions = allValidActions(generated);
            //  U     R     D     L
            //[true true false false]
            for (int action = 0; action < actions.length; action++) {
                //B. If action is valid...
                if (actions[action]) {
                    //C. Get position of space of next state
                    int[] nextSpacePos = getNextSpacePos(generated, action);
                    //D. Create next board
                    int[][] nextBoard = copyBoard(generatedBoard);
                    nextBoard[curStateSpacePos[0]][curStateSpacePos[1]] = nextBoard[nextSpacePos[0]][nextSpacePos[1]];
                    nextBoard[nextSpacePos[0]][nextSpacePos[1]] = 0;
                    //E. Calculate g
                    int g = generated.g + 1;
                    //F. Calculate h
                    int h = calculateH(nextBoard);
                    //G. Create next MyState(board,parent,g,h,spacePosRow,spacePosCol)
                    MyState nextState = new MyState(nextBoard, generated, g, h, nextSpacePos[0], nextSpacePos[1]);
                    //H. Check that this state wasn't seen before.
                    if (!seenStates.contains(nextState)) {
                        //I. Insert into priority queue
                        priorityQueue.SmartEnqueToTail(nextState);
                    }
                }
            }
        }
    }

    //-------------------------------------
    //Method 13: Solve Using Branch & Bound
    //-------------------------------------
    public void solveUsingBB() {
        //----------------------
        //Step 1: Reset solution
        //----------------------
        this.solution = null;
        //---------------------------------
        //Step 2: Reset list of seen states
        //---------------------------------
        this.seenStates = new HashMap<>();
        //--------------------------------
        //Step 3: Begin Branch & Bound Run
        //--------------------------------
        this.UB = 32;
        this.numOfIteration = 0;
        this.startTime = System.currentTimeMillis();
        open(initialState);
    }

    private void open(MyState curState){
        this.numOfIteration++;
        //-------------
        int[][] curBoard = copyBoard(curState.board);
        int[] curStateSpacePos = {curState.spaceRow, curState.spaceCol};
        //---------------------------------
        //STEP 1: Did I reach a Goal-State?
        //---------------------------------
        if (isGoal(curBoard)) {
            //A. Update Global UB
            this.UB = curState.g; ///or f
            System.out.printf("Num of boards tested: %d. Solved in %d steps.\n", this.numOfIteration, this.UB);
            //B. Copy boards
            this.solution = new MyList<>();
            this.solution.EnqueHead(curState); // insertion of goal-state.
            while (curState.parent != null) {
                solution.EnqueHead(curState.parent);
                curState = curState.parent;
            }
            this.endTime = System.currentTimeMillis();
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
        MyList<MyState> fifoQueue = new MyList<>();
        //How? Just say what happens if nextJob will be added NEXT.
        //A. Check all possible valid actions
        boolean[] actions = allValidActions(curState);
        //  U     R     D     L
        //[true true false false]
        for (int action = 0; action < actions.length; action++) {
            //B. If action is valid...
            if (actions[action]) {
                //C. Get position of space of next state
                int[] nextSpacePos = getNextSpacePos(curState, action);
                //D. Create next board
                int[][] nextBoard = copyBoard(curBoard);
                nextBoard[curStateSpacePos[0]][curStateSpacePos[1]] = nextBoard[nextSpacePos[0]][nextSpacePos[1]];
                nextBoard[nextSpacePos[0]][nextSpacePos[1]] = 0;
                //E. Calculate g
                int g = curState.g + 1;
                //F. Calculate h
                int h = calculateH(nextBoard);
                //G. Create next MyState(board,parent,g,h,spacePosRow,spacePosCol)
                MyState nextState = new MyState(nextBoard, curState, g, h, nextSpacePos[0], nextSpacePos[1]);
                //H. Insert into queue
                boolean seen = checkIfSeen(nextState); //Double role: Also replaces!!!
                if (!seen){
                    fifoQueue.EnqueTail(nextState);
                }
            }
        }

        //---------------------
        //STEP 4: BACK-TRACKING
        //---------------------
        while (fifoQueue.size > 0) {
            //STEP 5.1: Deque next state to check:
            MyState nextState = fifoQueue.DequeHead().GetEntity();
            //STEP 5.2: If branch doesn't EXCEED UB.
            if (nextState.f < UB) {
                //Try and test this action: (CONTINUE to Branch and Bound)
                open(nextState);
                //Getting here = regretting this assignment!
            }//else{
                //Is higher than UB! Bound it and move on!
            //}
        }
    }

    private boolean checkIfSeen(MyState someState) {
        MyState prevState = seenStates.get(someState);
        if (prevState != null){
            //someState exists! but wait, is it worse?
            if (someState.g >= prevState.g) {
                //Yes! it is worse! so, same board that was reached after more steps will not be inserted.
                return true;
            }else {
                //No! it is better! so, same board that was reached after less steps will replace current one.
                seenStates.put(someState,someState);
                return false;
            }
        }else {
            //prevState does not exist...
            seenStates.put(someState,someState);
            return false;
        }
    }

    private int calculateH(int[][] someBoard){
        switch (this.whichHeuristic){
            case 1: // ------ Num Of Misplaced Tiles -------
                return numOfMisplaced(someBoard);
            case 2: // ------ Manhattan Distances -------
                return ManhattanDistances(someBoard);
            default:
                System.err.println("Something went terribly wrong...");
                return -100;
        }
    }

    public int whatWasTheAction(MyState state1, MyState state2){
        if (state2.spaceRow < state1.spaceRow){
            return 0;
        }
        if (state2.spaceCol > state1.spaceCol){
            return 1;
        }
        if (state2.spaceRow > state1.spaceRow){
            return 2;
        }
        if (state2.spaceCol < state1.spaceCol){
            return 3;
        }
        return -999;
    }



    static int getInvCount(int[] arr) {
        int invCounter = 0;
        for (int i = 0; i < 7; i++) {
            for (int j = i + 1; j < 8; j++) {
                if (arr[i] > 0 && arr[i] > arr[j]) {
                    invCounter++;
                }
            }
        }
        return invCounter;
    }

    // This function returns true
    // if given 8 puzzle is solvable.
    static boolean isSolvable(int[][] puzzle) {
        // Count inversions in given 8 puzzle
        int[] oneDim = new int[8];
        int arrIndex = 0;
        int loopInd = 0;
        while (loopInd < 9){
            int row = loopInd / 3;
            int col = loopInd % 3;
            if (puzzle[row][col] > 0){
                oneDim[arrIndex] = puzzle[row][col];
                arrIndex++;
            }
            loopInd++;
        }
        int invCount = getInvCount(oneDim);
        // return true if inversion count is even.
        return (invCount % 2 == 0);
    }

    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################
    //################################################################################

    public static void main(String[] args) {
        //-----------------------
        //Step 1: Create new game
        //-----------------------
        Program program = new Program();
        //------------------------
        //Step 2: Choose heuristic (for both methods)
        //------------------------
        System.out.println("Which heuristic to apply? (1= numOfMisplaced , 2= manhattanDistances)");
        String chosen = program.sc.next();
        program.chooseHeuristic(chosen);
        //-------------------------
        //Step 3: Formulate problem
        //-------------------------
        program.initialize();
        //-----------------------
        //Step 4: to solve or not
        //-----------------------
        boolean tryToSolve = true;
        if(!isSolvable(program.initialState.board)) {
            System.out.println("Bad news... Puzzle is unsolvable.\nWould you still try to solve?\n(1= Yes , 2= No)");
            tryToSolve = program.toContinue(program.sc.next());
        }else {
            System.out.println("Good news! Puzzle is solvable!");
        }
        if (tryToSolve){
            //---------------------
            //Step 4.1: Solve with A*
            //---------------------
            System.out.println("Solving with A*:");
            program.solveUsingAStar();
            //Display solution:
            if (program.solution == null) {
                System.out.println("This puzzle CANNOT be solved!");
                System.out.printf("Num of boards tested: %d.\n", program.numOfIteration);
            } else {
                System.out.printf("A* solved 8-puzzle in %d moves.\n", program.solution.size - 1);
                //Print initial state:
                System.out.println("Initial State:");
                MyNode<MyState> iNod = program.solution.GetFirst();
                MyState initialState = iNod.GetEntity();
                program.printBoard(initialState.board);
                iNod = iNod.GetNext();
                for (int i = 1; i < program.solution.size; i++) {
                    //Get state:
                    MyState curState = iNod.GetEntity();
                    //Get state's board:
                    int[][] curBoard = curState.board;
                    //Print state's board:
                    System.out.printf("Move number: %d\n", i);
                    program.printBoard(curBoard);
                    //Get nextState:
                    iNod = iNod.GetNext();
                }
                long timeToSolve = program.endTime - program.startTime;
                System.out.println("Time taken: " + (timeToSolve) + "ms\n");
            }

            //---------------------------------
            //Step 4.2: Solve with Branch & Bound
            //---------------------------------
            System.out.println("Solving with Branch & Bound:");
            program.solveUsingBB();
            //Display solution:
            if (program.solution == null) {
                System.out.println("This puzzle CANNOT be solved!");
                System.out.printf("Num of boards tested: %d.\n", program.numOfIteration);
            } else {
                System.out.printf("Branch & Bound solved 8-puzzle in %d moves.\n", program.solution.size - 1);
                //Print initial state:
                System.out.println("Initial State:");
                MyNode<MyState> iNod = program.solution.GetFirst();
                program.printBoard(iNod.GetEntity().board);
                iNod = iNod.GetNext();
                //Print solution:
                for (int i = 1; i < program.solution.size; i++) {
                    //Get state:
                    MyState curState = iNod.GetEntity();
                    //Get state's board:
                    int[][] curBoard = curState.board;
                    //Print state's board:
                    System.out.printf("Move number: %d\n", i);
                    program.printBoard(curBoard);
                    //Get nextState:
                    iNod = iNod.GetNext();
                }
                long timeToSolve = program.endTime - program.startTime;
                System.out.println("Time taken: " + (timeToSolve) + "ms\n");
            }
        }
        System.out.println("Program ended.");
    }
}