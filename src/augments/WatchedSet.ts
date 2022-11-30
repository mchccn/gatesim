export class WatchedSet<T> extends Set<T> {
    #adds = new Set<(item: T, set: WatchedSet<T>) => boolean | undefined>();
    #deletes = new Set<(item: T, set: WatchedSet<T>) => boolean | undefined>();
    #attemptedAdds = new Set<(item: T, set: WatchedSet<T>) => boolean | undefined>();
    #attemptedDeletes = new Set<(item: T, set: WatchedSet<T>) => boolean | undefined>();

    #locked = false;

    constructor(items?: ConstructorParameters<typeof Set<T>>[0]) {
        super();

        if (items) this.addAll([...items]);
    }

    onAdd(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#adds.add(run);

        return this;
    }

    onDelete(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#deletes.add(run);

        return this;
    }

    onAttemptedAdd(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#attemptedAdds.add(run);

        return this;
    }

    onAttemptedDelete(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#attemptedDeletes.add(run);

        return this;
    }

    offAdd(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#adds.delete(run);

        return this;
    }

    offDelete(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#deletes.delete(run);

        return this;
    }

    offAttemptedAdd(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#attemptedAdds.delete(run);

        return this;
    }

    offAttemptedDelete(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#attemptedDeletes.delete(run);

        return this;
    }

    addAll(items: T[]) {
        items.forEach((item) => this.add(item));

        return this;
    }

    deleteAll(items: T[]) {
        return items.map((item) => this.delete(item));
    }

    add(item: T) {
        if (this.#locked) {
            const results = [...this.#attemptedAdds].map((run) => run.call(undefined, item, this));

            if (results.every((out) => !out)) return this;
        }

        const results = [...this.#adds].map((run) => run.call(undefined, item, this));

        return results.some((out) => out === false) ? this : super.add(item);
    }

    delete(item: T) {
        if (this.#locked) {
            const results = [...this.#attemptedDeletes].map((run) => run.call(undefined, item, this));

            if (results.every((out) => !out)) return false;
        }

        const results = [...this.#deletes].map((run) => run.call(undefined, item, this));

        return results.some((out) => out === false) ? false : super.delete(item);
    }

    lock() {
        this.#locked = true;
    }

    unlock() {
        this.#locked = false;
    }

    get locked() {
        return this.#locked;
    }

    clone(withListeners?: boolean) {
        const set = new WatchedSet(this);

        if (withListeners) {
            this.#adds.forEach((run) => set.onAdd(run));
            this.#deletes.forEach((run) => set.onDelete(run));
        }

        return set;
    }
}
