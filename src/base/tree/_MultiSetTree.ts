//================================================================ 
/** @module std.base */
//================================================================
import { _SetTree } from "./_SetTree";
import { _XTreeNode } from "./_XTreeNode";

import { MultiSet } from "../container/MultiSet";
import { SetIterator } from "../iterator/SetIterator";

import { get_uid } from "../../functional/uid";

/**
 * @hidden
 */
export class _MultiSetTree<T, Source extends MultiSet<T, Source>>
	extends _SetTree<T, false, Source>
{
	/* ---------------------------------------------------------
		CONSTRUCTOR
	--------------------------------------------------------- */
	public constructor(source: Source, comp: (x: T, y: T) => boolean)
	{
		super(source, comp, 
			function (x: SetIterator<T, false, Source>, y: SetIterator<T, false, Source>): boolean
			{
				let ret: boolean = comp(x.value, y.value);
				if (!ret && !comp(y.value, x.value))
					return get_uid(x) < get_uid(y);
				else
					return ret;
			}
		);
	}

	public insert(val: SetIterator<T, false, Source>): void
	{
		// ISSUE UID BEFORE INSERTION
		get_uid(val);
		super.insert(val);
	}

	/* ---------------------------------------------------------
		FINDERS
	--------------------------------------------------------- */
	private _Nearest_by_key
		(
			val: T, 
			equal_mover: (node: _XTreeNode<SetIterator<T, false, Source>>) => _XTreeNode<SetIterator<T, false, Source>> | null
		): _XTreeNode<SetIterator<T, false, Source>> | null
	{
		// NEED NOT TO ITERATE
		if (this.root_ === null)
			return null;

		//----
		// ITERATE
		//----
		let ret: _XTreeNode<SetIterator<T, false, Source>> = this.root_;
		let matched: _XTreeNode<SetIterator<T, false, Source>> | null = null;

		while (true)
		{
			let it: SetIterator<T, false, Source> = ret.value;
			let my_node: _XTreeNode<SetIterator<T, false, Source>> | null = null;

			// COMPARE
			if (this.key_comp()(val, it.value))
				my_node = ret.left;
			else if (this.key_comp()(it.value, val))
				my_node = ret.right;
			else
			{
				// EQUAL, RESERVE THAT POINT
				matched = ret;
				my_node = equal_mover(ret);
			}

			// ULTIL CHILD NODE EXISTS
			if (my_node === null)
				break;
			else
				ret = my_node;
		}

		// RETURNS -> MATCHED OR NOT
		return (matched !== null) ? matched : ret;
	}

	public nearest_by_key(val: T): _XTreeNode<SetIterator<T, false, Source>> | null
	{
		return this._Nearest_by_key(val, function (node)
		{
			return node.left;
		});
	}

	public upper_bound(val: T): SetIterator<T, false, Source>
	{
		// FIND MATCHED NODE
		let node: _XTreeNode<SetIterator<T, false, Source>> | null = this._Nearest_by_key(val, 
			function (node)
			{
				return node.right;
			});
		if (node === null) // NOTHING
			return this.source().end() as SetIterator<T, false, Source>;

		// MUST BE it.first > key
		let it: SetIterator<T, false, Source> = node.value;
		
		if (this.key_comp()(val, it.value))
			return it;
		else
			return it.next();
	}
}