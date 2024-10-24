export class MyState {
  public board: Array<Array<number>>;
  public parent: MyState;
  public g: number;
  public h: number;
  public f: number; // = g + h
  public spaceRow: number;
  public spaceCol: number;

  constructor(
    board: Array<Array<number>>,
    parent: MyState,
    g: number,
    h: number,
    spaceRow: number,
    spaceCol: number
  ) {
    this.board = board;
    this.parent = parent;
    this.g = g;
    this.h = h;
    this.f = g + h;
    this.spaceRow = spaceRow;
    this.spaceCol = spaceCol;
  }

  compareTo(otherState: MyState) {
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

  hashCode() {
    let out = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        out = out * 9 + this.board[i][j];
      }
    }
    return out;
  }

  equals(o: any) {
    //  This is a bug! it was MyState before
    if (typeof o === "function") {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (this.board[i][j] != o.board[i][j]) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }
}
