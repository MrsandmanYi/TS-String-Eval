import { Token } from "../compiler/Token";
import { CodeContext } from "../context/CodeContext";
import { CommandType } from "./CommandType";



/**
 * 指令，逻辑执行最小单位
 */
export class Command {

    private _type: CommandType = CommandType.None;
    public get type(): CommandType {
        return this._type;
    }

    private _codeContext: any = null;
    public get codeContext(): any {
        return this._codeContext;
    }

    private _token: Token | null = null;
    public get token(): Token | null {
        return this._token;
    }

    constructor(type: CommandType, codeContext: CodeContext | string | null, token: Token | null) {
        this._type = type;
        this._codeContext = codeContext;
        this._token = token;
    }

    public print(): void {
        console.log("       --Command: " + CommandType[this.type]);
        if (this.codeContext) {
            if (typeof this.codeContext === "string") {
                console.log("       --CodeContext: " + this.codeContext);
            } else {
                this.codeContext.print();
            }
        }

        if (this.token) {
            console.log("       --Token: " + this.token.tokenText);
        }
    }

}
