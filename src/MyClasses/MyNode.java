package MyClasses;

public class MyNode <T>{
    private T entity;
    private MyNode<T> prevNode;
    private MyNode<T> nextNode;
    //---------------------

    //--------------
    //Constructor 1:
    //--------------
    public MyNode(T entity) {
        this.entity = entity;
    }

    //--------
    //Method 1: Get Entity
    //--------
    public T GetEntity(){
        return this.entity;
    }

    //--------
    //Method 2: Set Entity
    //--------
    public void SetEntity(T entity){
        //assert(entity.id>0);
        this.entity = entity;
    }

    //--------
    //Method 3: Get Prev
    //--------
    public MyNode<T> GetPrev(){
        return this.prevNode;
    }

    //--------
    //Method 4: Set Prev
    //--------
    public void SetPrev(MyNode<T> prevNode){
        this.prevNode = prevNode;
    }

    //--------
    //Method 5: Get Next
    //--------
    public MyNode<T> GetNext(){
        return this.nextNode;
    }

    //--------
    //Method 6: Set Next
    //--------
    public void SetNext(MyNode<T> nextNode){
        this.nextNode = nextNode;
    }

    //--------
    //Method 7: to String
    //--------
    public String ToString(){
        return "" + this.entity;
    }

    //--------
    //Method 8: Clone
    //--------
    //Can't be done here!!! Or, Not recommended is more appropriate.
}