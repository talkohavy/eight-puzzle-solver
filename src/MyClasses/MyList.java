package MyClasses;

import java.util.*;

public class MyList <T> {
    //1111111111111111111111111
    //1111111111111111111111111
    //---- Class Variables ----
    private MyNode<T> first;
    private MyNode<T> last;
    public int size;

    //222222222222222222222222222
    //222222222222222222222222222
    //222222222222222222222222222
    //---------------------------
    //   Method 1: Constructor
    //---------------------------
    public MyList() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    //333333333333333333333333333
    //333333333333333333333333333
    //333333333333333333333333333
    //---------------------------
    //    Method 2: Get Head
    //---------------------------
    public MyNode<T> GetFirst() {
        return this.first;
    }

    //444444444444444444444444444
    //444444444444444444444444444
    //444444444444444444444444444
    //---------------------------
    //    Method 3: Get Tail
    //---------------------------
    public MyNode<T> GetLast() {
        return this.last;
    }

    //555555555555555555555555555
    //555555555555555555555555555
    //555555555555555555555555555
    //---------------------------
    //   Method 4: Set as Head
    //---------------------------
    public void SetFirst(MyNode<T> node) {
        this.first = node;
    }

    //666666666666666666666666666
    //666666666666666666666666666
    //666666666666666666666666666
    //---------------------------
    //   Method 5: Set as Tail
    //---------------------------
    public void SetLast(MyNode<T> node) {
        this.last = node;
    }

    //7777777777777777777777777777
    //7777777777777777777777777777
    //7777777777777777777777777777
    //----------------------------
    //  Method 6: Pull from Head
    //----------------------------
    public MyNode<T> DequeHead() {
        // Does NOT, I repeat, Does NOT delete "who".
        // Garbage collector will do that.
        MyNode<T> dequed = this.first;
        if (this.size > 1) {
            this.first = this.first.GetNext();
            this.first.SetPrev(null);
        } else {
            this.first = null;
            this.last = null;
        }
        this.size = this.size - 1;
        return dequed;
    }

    //8888888888888888888888888888
    //8888888888888888888888888888
    //8888888888888888888888888888
    //----------------------------
    //  Method 7: Pull from Tail
    //----------------------------
    public MyNode<T> DequeLast() {
        MyNode<T> dequed = this.last;
        this.last = this.last.GetPrev();
        if (this.last == null) {
            this.first = null;
        } else {
            this.last.SetNext(null);
        }
        this.size = this.size - 1;
        return dequed;
    }

    //99999999999999999999999999999
    //99999999999999999999999999999
    //99999999999999999999999999999
    //----------------------------
    //   Method 7: Push to Tail
    //----------------------------
    public void EnqueTail(T entity) {
        MyNode<T> toBeInserted = new MyNode<T>(entity);
        if (this.size > 0) {
            toBeInserted.SetPrev(this.last);
            toBeInserted.SetNext(null);
            this.last.SetNext(toBeInserted);
            this.last = toBeInserted;

        } else {
            this.first = toBeInserted;
            this.last = toBeInserted;
            this.last.SetNext(null);
            this.first.SetPrev(null);
        }
        this.size = this.size + 1;
    }

    //99999999999999999999999999999
    //99999999999999999999999999999
    //99999999999999999999999999999
    //----------------------------
    //   Method 7: Push to Head
    //----------------------------
    public void EnqueHead(T entity) {
        MyNode<T> toBeInserted = new MyNode<T>(entity);
        if (this.size > 0) {
            toBeInserted.SetNext(this.first);
            toBeInserted.SetPrev(null);
            this.first.SetPrev(toBeInserted);
            this.first = toBeInserted;

        } else {
            this.first = toBeInserted;
            this.last = toBeInserted;
            this.last.SetNext(null);
            this.first.SetPrev(null);
        }
        this.size = this.size + 1;
    }

    //10 10 10 10 10 10 10 10 10 10
    //10 10 10 10 10 10 10 10 10 10
    //10 10 10 10 10 10 10 10 10 10
    //-----------------------------
    //    Method 9: Smart Enque to Head
    //-----------------------------
    public void SmartEnqueToHead(T entity) {
        //Note: This algorithm is starting from beginning to end.
        boolean isInserted = false;
        MyNode<T> toBeInserted = new MyNode(entity);
        MyNode<T> iNod = this.first;
        //Step 1: Search insert position (last n-1 places).
        for (int i = 0; i < this.size; i++) {
            //is this the one?
            if (((Comparable) entity).compareTo(iNod.GetEntity()) <= 0) {
                //Yes! Set 4 pointers.
                toBeInserted.SetNext(iNod);
                toBeInserted.SetPrev(iNod.GetPrev());
                if (iNod.GetPrev() == null) {
                    this.first = toBeInserted;
                }else{
                    iNod.GetPrev().SetNext(toBeInserted);
                }
                iNod.SetPrev(toBeInserted);
                isInserted = true;
                break;
            }
            iNod = iNod.GetNext();
        }
        if (!isInserted) {
            //Meaning: entity should be last
            toBeInserted.SetNext(null);
            toBeInserted.SetPrev(this.last);
            //was list empty before insertion?
            if (this.first == null) {
                //Yes! Update this.last
                this.first = toBeInserted;
            } else {
                //No! you can setPrev.
                this.last.SetNext(toBeInserted);
            }
            this.last = toBeInserted;
        }
        this.size = this.size + 1;
    }

    public void SmartEnqueToTail(T entity) {
        //Note: This algorithm is starting from end to beginning.
        MyNode<T> toBeInserted = new MyNode(entity);
        MyNode<T> iNod = this.last;
        boolean isInserted = false;
        //Step 1: Search insert position (n-1 places).
        for (int i = 0; i < this.size; i++) {
            //is this the one?
            if (((Comparable)entity).compareTo(iNod.GetEntity()) >= 0) {
                //Yes! Set 4 pointers.
                toBeInserted.SetPrev(iNod);
                toBeInserted.SetNext(iNod.GetNext());
                iNod.SetNext(toBeInserted);
                //is position last?
                if (toBeInserted.GetNext() == null) {
                    //Yes! toBeInserted is now last.
                    this.last = toBeInserted;
                } else {
                    //No! can do SetNext to prev.
                    toBeInserted.GetNext().SetPrev(toBeInserted);
                }
                isInserted = true;
                break;
            }
            iNod = iNod.GetPrev();
        }
        if (!isInserted) {
            //Meaning: entity.data < this.first.GetEntity.data
            toBeInserted.SetPrev(null);
            toBeInserted.SetNext(this.first);
            //was list empty before insertion?
            if (this.first == null) {
                //Yes! Update this.last
                this.last = toBeInserted;
            } else {
                //No! you can setPrev.
                this.first.SetPrev(toBeInserted);
            }
            this.first = toBeInserted;
        }
        this.size = this.size + 1;
    }

    //11 11 11 11 11 11 11 11 11 11 11
    //11 11 11 11 11 11 11 11 11 11 11
    //11 11 11 11 11 11 11 11 11 11 11
    //--------------------------------
    //     Method 10: InsertAfter
    //--------------------------------
    public MyNode<T> InsertAfter(MyNode<T> afterWho, T entity) {
        //Return the iNod created with the entity+data inside it.
        MyNode<T> ret = null;
        MyNode<T> toBeInserted = new MyNode(entity);
        if (afterWho == null) {
            toBeInserted.SetPrev(null);
            toBeInserted.SetNext(this.first);
            this.first.SetPrev(toBeInserted);
            this.first = toBeInserted;
            ret = toBeInserted;
        } else {
            toBeInserted.SetNext(afterWho.GetNext());
            toBeInserted.SetPrev(afterWho);
            afterWho.SetNext(toBeInserted);
            if (toBeInserted.GetNext() == null) {
                this.last = toBeInserted;
            } else {
                toBeInserted.GetNext().SetPrev(toBeInserted);
                ret = toBeInserted;
            }
        }
        this.size = this.size + 1;
        return ret;
    }

    //12 12 12 12 12 12 12 12 12 12 12
    //12 12 12 12 12 12 12 12 12 12 12
    //12 12 12 12 12 12 12 12 12 12 12
    //--------------------------------
    //     Method 11: Remove known
    //--------------------------------
    public void RemoveKnown(MyNode<T> iNodRemoved) {
        //Check if it's the first node:
        if (iNodRemoved.GetPrev() == null) {
            //Yes! this.first is moved 1 up.
            this.first = this.first.GetNext();
            //Check if size>1:
            if (this.first == null) {
                //No! size now equals to 1. Therefore...
                this.last = null;
            } else {
                this.first.SetPrev(null);
            }
        } else {
            //No! it's not the first.
            MyNode<T> prev = iNodRemoved.GetPrev();
            MyNode<T> next = iNodRemoved.GetNext();
            prev.SetNext(next);
            //Check if it's the last:
            if (next == null) {
                //Yes! last need to move 1 before.
                this.last = prev;
            } else {
                //No! we can set prev.
                next.SetPrev(prev);
            }
        }
        this.size = this.size - 1;
    }

    //13 13 13 13 13 13 13 13 13 13 13
    //13 13 13 13 13 13 13 13 13 13 13
    //13 13 13 13 13 13 13 13 13 13 13
    //--------------------------------
    //    Method 12: Remove Unknown
    //--------------------------------
    public MyNode<T> RemoveUnknown(T entity) {
        //Note 1: Assumes an iNod with data exists. Therefore, a delete
        //action is guaranteed.
        //Check if it's the first node:
        MyNode<T> ret = null;
        if (((Comparable)this.first.GetEntity()).compareTo(entity) == 0) {
            //Yes! Save the deleted iNod:
            ret = this.first;
            //this.first pointer is moved 1 up:
            this.first = this.first.GetNext();
            //Check if size>1:
            if (this.first == null) {
                //No! size now equals to 1. Update this.last:
                this.last = null;
            } else {
                //Yes! can setPrev
                this.first.SetPrev(null);
            }
        } else {
            //No! it's not the first. We need to find it:
            MyNode<T> iNodRemoved = this.first.GetNext();
            for (int i = 1; i < this.size; i++) {
                //Is this the one?
                if (((Comparable)iNodRemoved.GetEntity()).compareTo(entity) == 0) {
                    //Yes!
                    MyNode<T> prev = iNodRemoved.GetPrev();
                    MyNode<T> next = iNodRemoved.GetNext();
                    prev.SetNext(next);
                    //Check if it's the last:
                    if (next == null) {
                        //Yes! last need to move 1 before.
                        this.last = prev;
                    } else {
                        //No! we can set prev.
                        next.SetPrev(prev);
                    }
                    ret = iNodRemoved; // Return the deleted
                    break;
                }
                iNodRemoved = iNodRemoved.GetNext();
            }
        }
        this.size = this.size - 1;
        return ret;
    }

    //14 14 14 14 14 14 14 14 14 14
    //14 14 14 14 14 14 14 14 14 14
    //14 14 14 14 14 14 14 14 14 14
    //-----------------------------
    //Method 8: Concatenate 2 Lists
    //-----------------------------
    public void ConnectHead2Tail(MyList<T> lst) {
        this.last.SetNext(lst.first);
        lst.first.SetPrev(this.last);
        this.SetLast(lst.last);
    }

    //15 15 15 15 15 15 15 15 15 15 15
    //15 15 15 15 15 15 15 15 15 15 15
    //15 15 15 15 15 15 15 15 15 15 15
    //--------------------------------
    //      Method 14: Contains
    //--------------------------------
    public boolean Contains(T entity) {
        MyNode<T> iNod = this.first;
        boolean flag = false;
        for (int i = 0; i < this.size; i++) {
            if (((Comparable)iNod.GetEntity()).compareTo(entity) == 0) {
                flag = true;
                break;
            }
            iNod = iNod.GetNext();
        }
        return flag;
    }

    //16 16 16 16 16 16 16 16 16 16 16
    //16 16 16 16 16 16 16 16 16 16 16
    //16 16 16 16 16 16 16 16 16 16 16
    //--------------------------------
    //     Method 15: Contains At
    //--------------------------------
    public boolean ContainsThisAt(int value, int j) {
        MyNode<T> iNod = this.first;
        boolean flag = false;
        for (int i = 0; i < this.size; i++) {
/*
            if (iNod.GetEntity().GetArrValue(j) == value) {
                flag = true;
                break;
            }
 */
            iNod = iNod.GetNext();
        }
        return flag;
    }

    //17 17 17 17 17 17 17 17 17 17
    //17 17 17 17 17 17 17 17 17 17
    //17 17 17 17 17 17 17 17 17 17
    //-----------------------------
    //  Method 16: InsertionSort
    //-----------------------------
    public void InsertionSort() {
        MyNode<T> iNod = this.first;
        if (iNod != null && iNod.GetNext() != null) {
            iNod = iNod.GetNext();
            //Step 1: Sort n-1 elements.
            while (iNod.GetNext() != null) {
                //A. Remember your place:
                MyNode<T> continueFrom = iNod.GetNext();
                //B. Disconnect iNod:
                iNod.GetPrev().SetNext(iNod.GetNext());
                iNod.GetNext().SetPrev(iNod.GetPrev());
                //C. Check backwards
                MyNode<T> jNod = iNod.GetPrev();
                while (jNod != null && ((Comparable)iNod.GetEntity()).compareTo(jNod.GetEntity()) < 0) {
                    jNod = jNod.GetPrev();
                }
                //D. if reached 0...
                if (jNod == null) {
                    //Connect iNod to beginning
                    iNod.SetNext(this.first);
                    iNod.SetPrev(null);
                    this.first.SetPrev(iNod);
                    this.first = iNod;
                } else {
                    //Connect iNod after jNod
                    iNod.SetNext(jNod.GetNext());
                    iNod.SetPrev(jNod);
                    jNod.GetNext().SetPrev(iNod);
                    jNod.SetNext(iNod);
                }
                iNod = continueFrom;
            }
            //Step 4: Check the last one.
            iNod = this.last;
            MyNode<T> jNod = iNod.GetPrev();
            if (((Comparable)iNod.GetEntity()).compareTo(jNod.GetEntity()) < 0) {
                //Step 5: jNod is now new Last.
                this.last = jNod;
                this.last.SetNext(null);
                //C.Check backwards
                jNod = jNod.GetPrev();
                while (jNod != null && ((Comparable)iNod.GetEntity()).compareTo(jNod.GetEntity()) < 0) {
                    jNod = jNod.GetPrev();
                }
                //D. if reached 0...
                if (jNod == null) {
                    //Connect iNod to beginning
                    iNod.SetNext(this.first);
                    iNod.SetPrev(null);
                    this.first.SetPrev(iNod);
                    this.first = iNod;
                } else {
                    //Connect iNod after jNod
                    iNod.SetNext(jNod.GetNext());
                    iNod.SetPrev(jNod);
                    jNod.GetNext().SetPrev(iNod);
                    jNod.SetNext(iNod);
                }
            }
        }
    }

    //18 18 18 18 18 18 18 18 18 18
    //18 18 18 18 18 18 18 18 18 18
    //18 18 18 18 18 18 18 18 18 18
    //-----------------------------
    //    Method 17: Revert List
    //-----------------------------
    public void ReverseMe() {
        //Note: Nodes remain in their places! nextNode and prevNode
        //pointers remain untouched! Only thing done here is the
        //replacing of pointers on entities.
        int howManySwitches = this.size / 2; //it does flooring anyway because int.
        MyNode<T> st = this.first;
        MyNode<T> ed = this.last;
        for (int i = 0; i < howManySwitches; i++) {
            T saver = st.GetEntity();
            st.SetEntity(ed.GetEntity());
            ed.SetEntity(saver);
            st = st.GetNext();
            ed = ed.GetPrev();
        }
    }

    //19 19 19 19 19 19 19 19 19 19
    //19 19 19 19 19 19 19 19 19 19
    //19 19 19 19 19 19 19 19 19 19
    //-----------------------------
    //     Method 18: To String
    //-----------------------------
    public String toString() {
        String str = "[";
        MyNode<T> iNod = this.first;
        while (iNod != null) {
            str = str + iNod.GetEntity().toString();
            if (iNod.GetNext() != null) {
                str = str + ",";
            }
            iNod = iNod.GetNext();
        }
        str = str + "]";
        return str;
    }

    //----------------------------
    //****** Only in javaFX ******
    //----------------------------
    public ArrayList ToArrayList () {
        //*******  MyList is Type TrainingDeal *******
        ArrayList retList = new ArrayList<>();
        MyNode iNod = first;
        for (int i = 0; i < size; i++) {
            retList.add(iNod.GetEntity());
            iNod = iNod.GetNext();
        }
        return retList;
    }

    //------------------------
    //     Method 18: Shuffler
    //------------------------
    public void shuffle() {
        //Explanation: The idea is to pick a value at random and putting it at the end of an array.
        //then you sample the next index from curLast--
        int[] values = {1, 2, 3, 4, 5, 6, 7, 8};
        Random rnd = new Random();
        int curLast = this.size - 1;
        while (curLast > 0) {
            //Step 1: sample a random index
            int index = rnd.nextInt(curLast);
            //Step 2: swap cur with curLast
            int temp = values[index];
            values[index] = values[curLast];
            values[curLast] = temp;
            //Step 3: decrease size
            curLast--;
        }
    }
}