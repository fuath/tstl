/// <reference path="../API.ts" />

/// <reference path="Container.ts" />
/// <reference path="../Iterator.ts" />

namespace std.base
{
	/**
	 * <p> An abstract set. </p>
	 *
	 * <p> {@link SetContainer SetContainers} are containers that store elements allowing fast retrieval of 
	 * individual elements based on their value. </p>
	 *
	 * <p> In an {@link SetContainer}, the value of an element is at the same time its <i>key</i>, used to
	 * identify it. <i>Keys</i> are immutable, therefore, the elements in an {@link SetContainer} cannot be
	 * modified once in the container - they can be inserted and removed, though. </p>
	 *
	 * <p> {@link SetContainer} stores elements, keeps sequence and enables indexing by inserting elements into a
	 * {@link List} and registering {@link ListIterator iterators} of the {@link data_ list container} to an index 
	 * table like {@link RBTree tree} or {@link HashBuckets hash-table}. </p>
	 *
	 * <p> <img src="../assets/images/design/set_containers.png" width="100%" /> </p>
	 * 
	 * <h3> Container properties </h3>
	 * <dl>
	 *	<dt> Associative </dt>
	 *	<dd> 
	 *		Elements in associative containers are referenced by their <i>key</i> and not by their absolute
	 *		position in the container.
	 *	</dd>
	 * 
	 *	<dt> Set </dt>
	 *	<dd> The value of an element is also the <i>key</i> used to identify it. </dd>
	 * </dl>
	 *
	 * @param <T> Type of the elements. Each element in a {@link SetContainer} container is also identified
	 *			  by this value (each value is itself also the element's <i>key</i>).
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export abstract class SetContainer<T>
		extends Container<T>
	{
		/**
		 * Type definition of {@link SetContainer}'s {@link SetIterator iterator}.
		 */
		public static get iterator() { return SetIterator; }

		/**
		 * <p> {@link List} storing elements. </p>
		 *
		 * <p> Storing elements and keeping those sequence of the {@link SetContainer} are implemented by 
		 * {@link data_ this list container}. Implementing index-table is also related with {@link data_ this list} 
		 * by storing {@link ListIterator iterators} ({@link SetIterator} references {@link ListIterator}) who are 
		 * created from {@link data_ here}. </p>
		 */
		protected data_: List<T>;
		
		/* =========================================================
			CONSTRUCTORS & SEMI-CONSTRUCTORS
				- CONSTRUCTORS
				- ASSIGN & CLEAR
		============================================================
			CONSTURCTORS
		--------------------------------------------------------- */
		/**
		 * Default Constructor.
		 */
		public constructor()//;

		/**
		 * Construct from elements.
		 */
		public constructor(items: Array<T>);

		/**
		 * Copy Constructor.
		 */
		public constructor(container: IContainer<T>);

		/**
		 * Construct from range iterators.
		 */
		public constructor(begin: Iterator<T>, end: Iterator<T>);

		public constructor(...args: any[])
		{
			super();

			// INITIALIZATION
			this.init();
			
			// BRANCH - OVERLOADINGS
			if (args.length == 0) { } // DO NOTHING
			else if (args.length == 1 && (args[0] instanceof Container || args[0] instanceof Vector))
			{
				this.construct_from_container(args[0]);
			}
			else if (args.length == 1 && args[0] instanceof Array)
			{
				this.construct_from_array(args[0]);
			}
			else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
			{
				this.construct_from_range(args[0], args[1]);
			}
		}

		/**
		 * @hidden
		 */
		protected init(): void
		{
			this.data_ = new List<T>();
		}
		
		/**
		 * @hidden
		 */
		protected construct_from_array(items: Array<T>): void
		{
			for (let i: number = 0; i < items.length; i++)
				this.insert_by_val(items[i]);
		}

		/**
		 * @hidden
		 */
		protected construct_from_container(container: IContainer<T>): void
		{
			this.construct_from_range(container.begin(), container.end());
		}

		/**
		 * @hidden
		 */
		protected construct_from_range<InputIterator extends Iterator<T>>
			(begin: InputIterator, end: InputIterator): void
		{
			this.assign(begin, end);
		}

		/* ---------------------------------------------------------
			ASSIGN & CLEAR
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public assign<U extends T, InputIterator extends Iterator<U>>
			(begin: Iterator<U>, end: Iterator<U>): void
		{
			// INSERT
			this.clear();
			this.insert(begin, end);
		}

		/**
		 * @inheritdoc
		 */
		public clear(): void
		{
			// TO BE ABSTRACT
			this.data_.clear();
		}

		/* =========================================================
			ACCESSORS
				- ITERATORS
				- ELEMENTS
		============================================================
			ITERATOR
		--------------------------------------------------------- */
		/**
		 * <p> Get iterator to element. </p>
		 * 
		 * <p> Searches the container for an element with <i>key</i> as value and returns an iterator to it if found, 
		 * otherwise it returns an iterator to {@link end end()} (the element past the end of the container). </p>
		 *
		 * <p> Another member function, {@link count count()}, can be used to just check whether a particular element
		 * exists. </p>
		 *
		 * @param key Key to be searched for.
		 *
		 * @return An iterator to the element, if the specified value is found, or {@link end end()} if it is not 
		 *		   found in the 
		 */
		public abstract find(val: T): SetIterator<T>;

		/**
		 * @inheritdoc
		 */
		public begin(): SetIterator<T>
		{
			return new SetIterator<T>(this, this.data_.begin());
		}

		/**
		 * @inheritdoc
		 */
		public end(): SetIterator<T>
		{
			return new SetIterator<T>(this, this.data_.end());
		}

		/**
		 * @inheritdoc
		 */
		public rbegin(): SetReverseIterator<T>
		{
			return new SetReverseIterator<T>(this.end());
		}

		/**
		 * @inheritdoc
		 */
		public rend(): SetReverseIterator<T>
		{
			return new SetReverseIterator<T>(this.begin());
		}

		/* ---------------------------------------------------------
			ELEMENTS
		--------------------------------------------------------- */
		/**
		 * <p> Whether have the item or not. </p>
		 * 
		 * <p> Indicates whether a set has an item having the specified identifier. </p>
		 *
		 * @param key Key value of the element whose mapped value is accessed.
		 *
		 * @return Whether the set has an item having the specified identifier.
		 */
		public has(val: T): boolean
		{
			return !this.find(val).equal_to(this.end());
		}

		/**
		 * <p> Count elements with a specific key. </p>
		 * 
		 * <p> Searches the container for elements with a value of k and returns the number of elements found. </p>
		 *
		 * @param key Value of the elements to be counted.
		 *
		 * @return The number of elements in the container with a <i>key</i>.
		 */
		public abstract count(val: T): number;

		/**
		 * @inheritdoc
		 */
		public size(): number
		{
			return this.data_.size();
		}

		/* =========================================================
			ELEMENTS I/O
				- INSERT
				- ERASE
				- POST-PROCESS
		============================================================
			INSERT
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public push<U extends T>(...args: U[]): number
		{
			// TO BE ABSTRACT
			for (let i: number = 0; i < args.length; i++)
				this.insert_by_val(args[i]);

			return this.size();
		}
		
		/**
		 * <p> Insert an element with hint. </p>
		 *
		 * <p> Extends the container by inserting new elements, effectively increasing the container size by the 
		 * number of elements inserted. </p>
		 *
		 * @param hint Hint for the position where the element can be inserted.
		 * @param val Value to be inserted as an element.
		 *
		 * @return An iterator pointing to either the newly inserted element or to the element that already had its 
		 *		   same value in the {@link SetContainer}.
		 */
		public insert(hint: SetIterator<T>, val: T): SetIterator<T>;

		/**
		 * <p> Insert an element with hint. </p>
		 *
		 * <p> Extends the container by inserting new elements, effectively increasing the container size by the 
		 * number of elements inserted. </p>
		 *
		 * @param hint Hint for the position where the element can be inserted.
		 * @param val Value to be inserted as an element.
		 *
		 * @return An iterator pointing to either the newly inserted element or to the element that already had its 
		 *		   same value in the {@link SetContainer}.
		 */
		public insert(hint: SetReverseIterator<T>, val: T): SetReverseIterator<T>;

		/**
		 * <p> Insert elements with a range of a  </p>
		 *
		 * <p> Extends the container by inserting new elements, effectively increasing the container size by the 
		 * number of elements inserted. </p>
		 *
		 * @param begin An iterator specifying range of the begining element.
		 * @param end An iterator specifying range of the ending element.
		 */
		public insert<U extends T, InputIterator extends Iterator<U>>
			(begin: InputIterator, end: InputIterator): void;

		public insert(...args: any[]): any
		{
			if (args.length == 1)
				return this.insert_by_val(args[0]);
			else if (args.length == 2 && args[0] instanceof Iterator)
			{
				if (args[1] instanceof Iterator && args[0].get_source() != this && args[1].get_source() != this)
				{
					// IT DOESN'T CONTAIN POSITION
					// RANGES TO INSERT ONLY
					return this.insert_by_range(args[0], args[1]);
				}
				else
				{
					let ret: SetIterator<T>;
					let is_reverse_iterator: boolean = false;

					// REVERSE_ITERATOR TO ITERATOR
					if (args[0] instanceof SetReverseIterator)
					{
						is_reverse_iterator = true;
						args[0] = (args[0] as SetReverseIterator<T>).base().prev();
					}

					// INSERT AN ELEMENT
					ret = this.insert_by_hint(args[0], args[1]);

					// RETURN BRANCHES
					if (is_reverse_iterator == true)
						return new SetReverseIterator<T>(ret.next());
					else
						return ret;
				}
			}
		}

		/**
		 * @hidden
		 */
		protected abstract insert_by_val(val: T): any;
		
		/**
		 * @hidden
		 */
		protected abstract insert_by_hint(hint: SetIterator<T>, val: T): SetIterator<T>;
		
		/**
		 * @hidden
		 */
		protected abstract insert_by_range<U extends T, InputIterator extends Iterator<U>>
			(begin: InputIterator, end: InputIterator): void;

		/* ---------------------------------------------------------
			ERASE
		--------------------------------------------------------- */
		/**
		 * <p> Erase an element. </p>
		 * <p> Removes from the set container the elements whose value is <i>key</i>. </p>
		 *
		 * <p> This effectively reduces the container size by the number of elements removed. </p>
		 *
		 * @param key Value of the elements to be erased.
		 *
		 * @return Number of elements erased.
		 */
		public erase(val: T): number;

		/**
		 * @inheritdoc
		 */
		public erase(it: SetIterator<T>): SetIterator<T>;

		/**
		 * <p> Erase elements. </p>
		 * <p> Removes from the set container a range of elements.. </p>
		 *
		 * <p> This effectively reduces the container size by the number of elements removed. </p>
		 *
		 * @param begin An iterator specifying a range of beginning to erase.
		 * @param end An iterator specifying a range of end to erase.
		 */
		public erase(begin: SetIterator<T>, end: SetIterator<T>): SetIterator<T>;

		/**
		 * @inheritdoc
		 */
		public erase(it: SetReverseIterator<T>): SetReverseIterator<T>;

		/**
		 * <p> Erase elements. </p>
		 * <p> Removes from the set container a range of elements.. </p>
		 *
		 * <p> This effectively reduces the container size by the number of elements removed. </p>
		 *
		 * @param begin An iterator specifying a range of beginning to erase.
		 * @param end An iterator specifying a range of end to erase.
		 */
		public erase(begin: SetReverseIterator<T>, end: SetReverseIterator<T>): SetReverseIterator<T>;

		public erase(...args: any[]): any
		{
			if (args.length == 1 && (args[0] instanceof Iterator == false || args[0].get_source() != this))
				return this.erase_by_val(args[0]);
			else
				if (args.length == 1)
					return this.erase_by_iterator(args[0]);
				else
					return this.erase_by_iterator(args[0], args[1]);
		}

		/**
		 * @hidden
		 */
		private erase_by_iterator(first: any, last: any = first.next()): any
		{
			let ret: SetIterator<T>;
			let is_reverse_iterator: boolean = false;

			// REVERSE ITERATOR TO ITERATOR
			if (first instanceof SetReverseIterator)
			{
				is_reverse_iterator = true;

				let first_it = (last as SetReverseIterator<T>).base();
				let last_it = (first as SetReverseIterator<T>).base();

				first = first_it;
				last = last_it;
			}

			// ERASE ELEMENTS
			ret = this.erase_by_range(first, last);

			// RETURN BRANCHES
			if (is_reverse_iterator == true)
				return new SetReverseIterator<T>(ret.next());
			else
				return ret;
		}

		/**
		 * @hidden
		 */
		private erase_by_val(val: T): number
		{
			// TEST WHETHER EXISTS
			let it = this.find(val);
			if (it.equal_to(this.end()) == true)
				return 0;

			// ERASE
			this.erase_by_iterator(it);
			return 1;
		}

		/**
		 * @hidden
		 */
		private erase_by_range(begin: SetIterator<T>, end: SetIterator<T>): SetIterator<T>
		{
			// ERASE
			let list_iterator = this.data_.erase(begin.get_list_iterator(), end.get_list_iterator());
			
			// POST-PROCESS
			this.handle_erase(begin, end);

			return new SetIterator<T>(this, list_iterator);//begin.prev();
		}

		/* ---------------------------------------------------------
			POST-PROCESS
		--------------------------------------------------------- */
		/**
		 * <p> Abstract method handling insertions for indexing. </p>
		 *
		 * <p> This method, {@link handle_insert} is designed to register the <i>first to last</i> to somewhere storing 
		 * those {@link SetIterator iterators} for indexing, fast accessment and retrievalance. </p>
		 *
		 * <p> When {@link insert} is called, new elements will be inserted into the {@link data_ list container} and new 
		 * {@link SetIterator iterators} <i>first to last</i>, pointing the inserted elements, will be created and the 
		 * newly created iterators <i>first to last</i> will be shifted into this method {@link handle_insert} after the 
		 * insertions. </p>
		 *
		 * <p> If the derived one is {@link RBTree tree-based} like {@link TreeSet}, the {@link SetIterator iterators} 
		 * will be registered into the {@link TreeSet.tree_ tree} as a {@link XTreeNode tree node item}. Else if the 
		 * derived one is {@link HashBuckets hash-based} like {@link HashSet}, the <i>first</i> to <i>last</i> will be 
		 * registered into the {@link HashSet.hash_buckets_ hash bucket}. </p>
		 *  
		 * @param first An {@link SetIterator} to the initial position in a sequence.
		 * @param last An {@link SetIterator} to the final position in a sequence. The range used is 
		 *			   [<i>first</i>, <i>last</i>), which contains all the elements between <i>first</i> and <i>last</i>, 
		 *			   including the element pointed by <i>first</i> but not the element pointed by <i>last</i>.
		 */
		protected abstract handle_insert(first: SetIterator<T>, last: SetIterator<T>): void;

		/**
		 * <p> Abstract method handling deletions for indexing. </p>
		 * 
		 * <p> This method, {@link handle_insert} is designed to unregister the <i>first to last</i> to somewhere storing 
		 * those {@link SetIterator iterators} for indexing, fast accessment and retrievalance. </p>
		 *
		 * <p> When {@link erase} is called with <i>first to last</i>, {@link SetIterator iterators} positioning somewhere
		 * place to be deleted, is memorized and shifted to this method {@link handle_erase} after the deletion process is 
		 * terminated. </p>
		 *
		 * <p> If the derived one is {@link RBTree tree-based} like {@link TreeSet}, the {@link SetIterator iterators} 
		 * will be unregistered from the {@link TreeSet.tree_ tree} as a {@link XTreeNode tree node item}. Else if the 
		 * derived one is {@link HashBuckets hash-based} like {@link HashSet}, the <i>first to last</i> will be 
		 * unregistered from the {@link HashSet.hash_buckets_ hash bucket}. </p>
		 * 
		 * @param first An {@link SetIterator} to the initial position in a sequence.
		 * @param last An {@link SetIterator} to the final position in a sequence. The range used is
		 *			   [<i>first</i>, <i>last</i>), which contains all the elements between <i>first</i> and <i>last</i>,
		 *			   including the element pointed by <i>first</i> but not the element pointed by <i>last</i>.
		 */
		protected abstract handle_erase(first: SetIterator<T>, last: SetIterator<T>): void;
	}
}

namespace std
{
	/**
	 * <p> An iterator of a Set. </p>
	 * 
	 * <p> <img src="../assets/images/design/set_containers.png" width="100%" /> </p>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class SetIterator<T>
		extends Iterator<T>
		implements IComparable<SetIterator<T>>
	{
		private list_iterator_: ListIterator<T>;

		/**
		 * <p> Construct from source and index number. </p>
		 *
		 * <h4> Note </h4>
		 * <p> Do not create iterator directly. </p>
		 * <p> Use begin(), find() or end() in Map instead. </p> 
		 *
		 * @param map The source Set to reference.
		 * @param index Sequence number of the element in the source Set.
		 */
		public constructor(source: base.SetContainer<T>, it: ListIterator<T>)
		{
			super(source);

			this.list_iterator_ = it;
		}

		/* ---------------------------------------------------------
			MOVERS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public prev(): SetIterator<T>
		{
			return new SetIterator<T>(this.set, this.list_iterator_.prev());
		}

		/**
		 * @inheritdoc
		 */
		public next(): SetIterator<T>
		{
			return new SetIterator<T>(this.set, this.list_iterator_.next());
		}

		/**
		 * @inheritdoc
		 */
		public advance(size: number): SetIterator<T>
		{
			return new SetIterator<T>(this.set, this.list_iterator_.advance(size));
		}

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * @hidden
		 */
		private get set(): base.SetContainer<T>
		{
			return this.source_ as base.SetContainer<T>;
		}

		public get_list_iterator(): ListIterator<T>
		{
			return this.list_iterator_;
		}

		/**
		 * @inheritdoc
		 */
		public get value(): T
		{
			return this.list_iterator_.value;
		}
		
		/* ---------------------------------------------------------
			COMPARISONS
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		public equal_to<U extends T>(obj: SetIterator<U>): boolean 
		{
			return super.equal_to(obj) && this.list_iterator_ == obj.list_iterator_;
		}

		/**
		 * @inheritdoc
		 */
		public less<U extends T>(obj: SetIterator<U>): boolean
		{
			return std.less(this.value, obj.value);
		}

		/**
		 * @inheritdoc
		 */
		public hash(): number
		{
			return base.code(this.value);
		}

		/**
		 * @inheritdoc
		 */
		public swap(obj: SetIterator<T>): void
		{
			this.list_iterator_.swap(obj.list_iterator_);
		}
	}

	/**
	 * <p> A reverse-iterator of Set. </p>
	 * 
	 * <p> <img src="../assets/images/design/set_containers.png" width="100%" /> </p>
	 *
	 * @param <T> Type of the elements.
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export class SetReverseIterator<T>
		extends ReverseIterator<T, SetIterator<T>, SetReverseIterator<T>>
	{
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(base: SetIterator<T>)
		{
			super(base);
		}

		/**
		 * @inheritdoc
		 */
		protected create_neighbor(): SetReverseIterator<T>
		{
			return new SetReverseIterator<T>(null);
		}
	}
}