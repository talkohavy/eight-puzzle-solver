package MyClasses;

public class MyState implements Comparable<MyState>{
    //1111111111111111111111111111111111111111111
    //1111111111111111111111111111111111111111111
    //1111111111111111111111111111111111111111111
    //------------ Class Variables --------------
    //------------ Class Variables --------------
    public int[][] board;
    public MyState parent;
    public int g;
    public int h;
    public int f; // = g + h
    public int spaceRow;
    public int spaceCol;
    //-----------------------


    //2222222222222222222222222222222222222222222
    //2222222222222222222222222222222222222222222
    //2222222222222222222222222222222222222222222
    //-------------- Constructor ----------------
    //-------------- Constructor ----------------
    public MyState() {

    }
    public MyState(int[][] board, MyState parent, int g, int h, int spaceRow, int spaceCol) {
        this.board = board;
        this.parent = parent;
        this.g = g;
        this.h = h;
        this.f = g + h;
        this.spaceRow = spaceRow;
        this.spaceCol = spaceCol;
    }

    @Override
    public int compareTo(MyState otherState) {
        //Meaning:  1 means this is bigger than other
        //Meaning:  0 means this is equal to other
        //Meaning: -1 means this is less than other
        if (this.f > otherState.f) {
            return 1;
        } else if (this.f < otherState.f) {
            return -1;
        } else {
            return 0;
        }
    }

    @Override
    public int hashCode() {
        int out = 0;
        for (int i=0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                out = (out * 9) + this.board[i][j];
            }
        }
        return out;
    }

    @Override
    public boolean equals(Object o) {
        if (o instanceof MyState) {
            for (int i=0; i < 3; i++){
                for (int j=0; j < 3; j++){
                    if(this.board[i][j] != ((MyState) o).board[i][j]){
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }

    //3333333333333333333333333333333333333333333
    //3333333333333333333333333333333333333333333
    //3333333333333333333333333333333333333333333
    //------------- Class Methods ---------------
    //------------- Class Methods ---------------


}