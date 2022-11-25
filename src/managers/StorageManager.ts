export class StorageManager {
    static readonly prefix = "kelsny.gatesim:";

    static readonly storage = window.localStorage;

    static set<T>(key: string, value: T): T {
        this.storage.setItem(this.prefix + key, JSON.stringify(value));

        return value;
    }

    static get<T>(key: string): T | undefined {
        return JSON.parse(this.storage.getItem(this.prefix + key)!) ?? undefined;
    }
}
