
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

    public pop(): T {
        let e = this._data.pop();
        if (e == null) {
            throw new Error("Stack: 栈为空, 无法 pop");
        }
        return e;
    }

    public peek(): T {
        return this._data[this._data.length - 1];
    }

    public clear(): void {
        this._data = [];
    }

    public toArray(): T[] {
        return [...this._data];
    }
}