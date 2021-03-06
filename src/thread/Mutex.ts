//================================================================ 
/** @module std */
//================================================================
import { ILockable } from "./ILockable";
import { SharedTimedMutex } from "./SharedTimedMutex";

/**
 * Mutex.
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
export class Mutex implements ILockable
{
    /**
     * @hidden
     */
    private mutex_: SharedTimedMutex;

    /* ---------------------------------------------------------
        CONSTRUCTOR
    --------------------------------------------------------- */
    /**
     * Default Constructor.
     */
    public constructor()
    {
        this.mutex_ = new SharedTimedMutex();
    }

    /* ---------------------------------------------------------
        LOCK & UNLOCK
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    public lock(): Promise<void>
    {
        return this.mutex_.lock();
    }

    /**
     * @inheritDoc
     */
    public try_lock(): Promise<boolean>
    {
        return this.mutex_.try_lock();
    }

    /**
     * @inheritDoc
     */
    public unlock(): Promise<void>
    {
        return this.mutex_.unlock();
    }
}

export type mutex = Mutex;
export const mutex = Mutex;