import { Token } from "../compiler/Token";

// 解析出来的语句
export class CodeContext {

    private _token: Token | null;
    
    public get token(): Token | null {
        return this._token;
    }

    constructor(token: Token | null) {
        this._token = token;
    }
}

export enum AccessModifier {
    Public,
    Protected,
    Private
}