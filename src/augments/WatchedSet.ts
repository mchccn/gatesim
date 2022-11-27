export class WatchedSet<T> extends Set<T> {
    #adds = new Set<(item: T, set: WatchedSet<T>) => boolean | undefined>();
    #deletes = new Set<(item: T, set: WatchedSet<T>) => boolean | undefined>();

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

    offAdd(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#adds.delete(run);

        return this;
    }

    offDelete(run: (item: T, set: WatchedSet<T>) => boolean | undefined) {
        this.#deletes.delete(run);

        return this;
    }

    addAll(items: T[]) {
        items.forEach((item) => this.add(item));

        return this;
    }

    deleteAll(items: T[]) {
        items.forEach((item) => this.delete(item));

        return this;
    }

    add(item: T) {
        const results = [...this.#adds].map((run) => run.call(undefined, item, this));

        return results.some((out) => out === false) ? this : super.add(item);
    }

    delete(item: T) {
        const results = [...this.#deletes].map((run) => run.call(undefined, item, this));

        return results.some((out) => out === false) ? false : super.delete(item);
    }

    clone() {
        return new WatchedSet(this);
    }
}
