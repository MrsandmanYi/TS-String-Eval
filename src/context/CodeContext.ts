import { Token } from "../compiler/Token";

// 解析出来的语句
export class CodeContext {

    private _prefixType: PrefixType = PrefixType.None;
    public get prefixType(): PrefixType {
        return this._prefixType;
    }
    public set prefixType(value: PrefixType) {
        this._prefixType = value;
    }

    private _token: Token | null;
    
    public get token(): Token | null {
        return this._token;
    }

    constructor(token: Token | null) {
        this._token = token;
    }

    public print() {
        console.log("         --Token: " + this.token?.tokenText);
        console.log("         --PrefixType: " + PrefixType[this.prefixType]);
    }
}

export enum AccessModifier {
    Public,
    Protected,
    Private
}

// 标识符类型
export enum PrefixType {
    None,
    Not,
    NotNot,
    Negative,
}
    