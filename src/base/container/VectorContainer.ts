import { ArrayContainer } from "./ArrayContainer";

import { IContainer } from "./IContainer";
import { IForwardIterator } from "../../iterator/IForwardIterator";
import { ArrayIteratorBase, ArrayReverseIteratorBase } from "../iterator/ArrayIteratorBase";

import { OutOfRange } from "../../exception/LogicError";

export abstract class VectorContainer<T extends ElemT, 
        SourceT extends IContainer<T, SourceT, IteratorT, ReverseT, ElemT>,
        ArrayT extends VectorContainer<T, SourceT, ArrayT, IteratorT, ReverseT, ElemT>,
        IteratorT extends ArrayIteratorBase<T, SourceT, ArrayT, IteratorT, ReverseT, ElemT>, 
        ReverseT extends ArrayReverseIteratorBase<T, SourceT, ArrayT, IteratorT, ReverseT, ElemT>, 
        ElemT>
    extends ArrayContainer<T, SourceT, ArrayT, IteratorT, ReverseT, ElemT>
{
    /**
     * @hidden
     */
    protected data_: T[];

    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    /**
     * Default Constructor.
     */
    protected constructor()
    {
        super();
        this.data_ = [];
    }

    /**
     * @inheritDoc
     */
    public assign(n: number, val: T): void;
    /**
     * @inheritDoc
     */
    public assign<InputIterator extends Readonly<IForwardIterator<T, InputIterator>>>
        (begin: InputIterator, end: InputIterator): void;

    public assign(first: any, second: any): void
    {
        this.clear();
        this.insert(this.end(), first, second);
    }

    /**
     * @inheritDoc
     */
    public clear(): void
    {
        this.data_.splice(0, this.data_.length);
    }

    /**
     * @inheritDoc
     */
    public resize(n: number)
    {
        this.data_.length = n;
    }

    /* =========================================================
        ACCESSORS
    ========================================================= */
    /**
     * @inheritDoc
     */
    public size(): number
    {
        return this.data_.length;
    }

    /**
     * @inheritDoc
     */
    public at(index: number): T
    {
        if (0 <= index && index < this.size())
            return this.data_[index];
        else
            throw new OutOfRange("Target index is greater than Vector's size: " + index + ", " + this.size());
    }

    /**
     * @inheritDoc
     */
    public set(index: number, val: T): void
    {
        if (index < 0 || index >= this.size())
            throw new OutOfRange("Target index is greater than Vector's size: " + index + ", " + this.size());

        this.data_[index] = val;
    }

    /**
     * Access data.
     * 
     * @return An array capsuled by this {@link Vector}.
     */
    public data(): Array<T>
    {
        return this.data_;
    }

    /**
     * @inheritDoc
     */
    public [Symbol.iterator](): IterableIterator<T>
    {
        return this.data_[Symbol.iterator]();
    }

    /* =========================================================
        ELEMENTS I/O
            - INSERT
            - ERASE
    ============================================================
        INSERT
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    public push(...items: T[]): number
    {
        return this.data_.push(...items);
    }

    /**
     * @inheritDoc
     */
    public push_back(val: T): void
    {
        this.data_.push(val);
    }

    /**
     * @hidden
     */
    protected _Insert_by_range<InputIterator extends Readonly<IForwardIterator<T, InputIterator>>>
        (position: IteratorT, first: InputIterator, last: InputIterator): IteratorT
    {
        if (position.index() >= this.size())
        { 
            // WHEN INSERT TO THE LAST
            let prev_size: number = this.size();

            for (; !first.equals(last); first = first.next())
                this.data_.push(first.value);
            
            return this.nth(prev_size);
        }
        else
        {
            //----
            // INSERT TO THE MIDDLE POSITION
            //----
            // CUT RIGHT SIDE
            let spliced_array: T[] = this.data_.splice(position.index());

            // INSERT ELEMENTS
            for (; !first.equals(last); first = first.next())
                this.data_.push(first.value);
            
            this.data_.push(...spliced_array); // CONCAT THE SPLICEDS
            
            return position;
        }
    }
    
    /* ---------------------------------------------------------
        ERASE
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    public pop_back(): void
    {
        this.data_.pop();
    }

    /**
     * @hidden
     */
    protected _Erase_by_range(first: IteratorT, last: IteratorT): IteratorT
    {
        if (first.index() >= this.size())
            return first;

        // ERASE ELEMENTS
        if (last.index() >= this.size())
        {
            this.data_.splice(first.index());
            return this.end();
        }
        else
            this.data_.splice(first.index(), last.index() - first.index());

        return first;
    }

    /* ---------------------------------------------------------------
        UTILITIES
    --------------------------------------------------------------- */
    /**
     * @hidden
     */
    public equals(obj: SourceT): boolean
    {
        return this.data_ === (<any>obj as this).data_;
    }

    /**
     * @inheritDoc
     */
    public swap(obj: SourceT): void
    {
        [this.data_, (<any>obj as this).data_] = [(<any>obj as this).data_, this.data_];
    }

    /**
     * @inheritDoc
     */
    public toJSON(): Array<T>
    {
        return this.data_;
    }
}