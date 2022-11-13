export class LocalStorage {
  constructor(protected field: string) {}
  public get = <T>(): T | null => {
    const databaseObject = localStorage.getItem(this.field)

    return databaseObject ? JSON.parse(databaseObject) : null
  }

  public remove = (): void => {
    localStorage.removeItem(this.field)
  }

  public set = (data: unknown): void => {
    localStorage.setItem(this.field, JSON.stringify(data))
  }
}
