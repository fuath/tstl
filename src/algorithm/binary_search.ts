//================================================================ 
/** @module std */
//================================================================
import { IForwardIterator } from "../iterator/IForwardIterator";
import { IPointer } from "../functional/IPointer";

import { distance, advance } from "../iterator/global";
import { less } from "../functional/comparators";
import { Pair } from "../utility/Pair";

/* =========================================================
    BINARY SEARCH
========================================================= */
/**
 * Get iterator to lower bound.
 * 
 * @param first Input iterator of the first position.
 * @param last Input iterator of the last position.
 * @param val Value to search for.
 * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Default is {@link less}.
 * 
 * @return Iterator to the first element equal or after the val.
 */
export function lower_bound<ForwardIterator extends Readonly<IForwardIterator<IPointer.ValueType<ForwardIterator>, ForwardIterator>>>
    (
        first: ForwardIterator, last: ForwardIterator, 
        val: IPointer.ValueType<ForwardIterator>, 
        comp: (x: IPointer.ValueType<ForwardIterator>, y: IPointer.ValueType<ForwardIterator>) => boolean = less
    ): ForwardIterator
{
    let count: number = distance(first, last);

    while (count > 0)
    {
        let step: number = Math.floor(count / 2);
        let it: ForwardIterator = advance(first, step);

        if (comp(it.value, val))
        {
            first = it.next();
            count -= step + 1;
        }
        else
            count = step;
    }
    return first;
}

/**
 * Get iterator to upper bound.
 * 
 * @param first Input iterator of the first position.
 * @param last Input iterator of the last position.
 * @param val Value to search for.
 * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Default is {@link less}.
 * 
 * @return Iterator to the first element after the key.
 */
export function upper_bound<ForwardIterator extends Readonly<IForwardIterator<IPointer.ValueType<ForwardIterator>, ForwardIterator>>>
    (
        first: ForwardIterator, last: ForwardIterator, 
        val: IPointer.ValueType<ForwardIterator>,
        comp: (x: IPointer.ValueType<ForwardIterator>, y: IPointer.ValueType<ForwardIterator>) => boolean = less
    ): ForwardIterator
{
    let count: number = distance(first, last);
    
    while (count > 0)
    {
        let step: number = Math.floor(count / 2);
        let it: ForwardIterator = advance(first, step);

        if (!comp(val, it.value))
        {
            first = it.next();
            count -= step + 1;
        }
        else
            count = step;
    }
    return first;
}

/**
 * Get range of equal elements.
 * 
 * @param first Input iterator of the first position.
 * @param last Input iterator of the last position.
 * @param val Value to search for.
 * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Default is {@link less}.
 * 
 * @return Pair of {@link lower_bound} and {@link upper_bound}.
 */
export function equal_range<ForwardIterator extends Readonly<IForwardIterator<IPointer.ValueType<ForwardIterator>, ForwardIterator>>>
    (
        first: ForwardIterator, last: ForwardIterator, 
        val: IPointer.ValueType<ForwardIterator>,
        comp: (x: IPointer.ValueType<ForwardIterator>, y: IPointer.ValueType<ForwardIterator>) => boolean = less
    ): Pair<ForwardIterator, ForwardIterator>
{
    let it: ForwardIterator = lower_bound(first, last, val, comp);

    return new Pair(it, upper_bound(it, last, val, comp));
}

/**
 * Test whether a value exists in sorted range.
 * 
 * @param first Input iterator of the first position.
 * @param last Input iterator of the last position.
 * @param val Value to search for.
 * @param comp A binary function predicates *x* element would be placed before *y*. When returns `true`, then *x* precedes *y*. Default is {@link less}.
 * 
 * @return Whether the value exists or not.
 */
export function binary_search<ForwardIterator extends Readonly<IForwardIterator<IPointer.ValueType<ForwardIterator>, ForwardIterator>>>
    (
        first: ForwardIterator, last: ForwardIterator, 
        val: IPointer.ValueType<ForwardIterator>,
        comp: (x: IPointer.ValueType<ForwardIterator>, y: IPointer.ValueType<ForwardIterator>) => boolean = less
    ): boolean
{
    first = lower_bound(first, last, val, comp);

    return !first.equals(last) && !comp(val, first.value);
}