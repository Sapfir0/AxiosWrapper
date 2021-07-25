class LocalStorage {
    constructor(protected field: string) {}
    public get = <T>(): T | undefined => {
        const databaseObject = localStorage.getItem(this.field);
        if (databaseObject) {
            return JSON.parse(databaseObject);
        }
    };

    public remove = (): void => {
        localStorage.removeItem(this.field);
    };

    public set = (data: unknown): void => {
        localStorage.setItem(this.field, JSON.stringify(data));
    };
}

export function getLocalStorage(field: string) {
    return new LocalStorage(field);
}
