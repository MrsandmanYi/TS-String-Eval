
/**
 * 泛型栈类
 */
export class Stack<T> {
    private _data: T[] = [];

    public get length(): number {
        return this._data.length;
    }

    public push(value: T): void {
        this._data.push(value);
    }

    public pop(): T | undefined {
        return this._data.pop();
    }

    public peek(): T | undefined {
        return this._data[this._data.length - 1];
    }

    public clear(): void {
        this._data = [];
    }

    public toArray(): T[] {
        return [...this._data];
    }
}