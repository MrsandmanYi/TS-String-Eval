import { CmdBlock } from "../../command/CmdBlock";
import { CodeContext } from "../../context/CodeContext";
import { Logger } from "../../utils/Logger";
import { ENV_EDITOR } from "../../utils/Marco";
import { SyntaxParser } from "../SyntaxParser";
import { Token } from "../Token";
import { TokenType } from "../TokenType";


export class ParserResult {
    tokenStartIndex: number = -1; // 解析开始时的 token 索引
    tokenEndIndex: number = -1;   // 解析完成后当前的 token 索引

    codeContexts: Array<CodeContext|null> = [];  // 解析出来的代码上下文

    public get codeContext(): CodeContext | null {
        return this.codeContexts.length > 0 ? this.codeContexts[0] : null;
    }

    constructor() {
        this.codeContexts = [];
    }

    /**
     * 设置代码上下文
     */
    public setCodeContext(codeContext: CodeContext | null) {
        this.codeContexts = [codeContext];
    }

    /**
     * 添加一个代码上下文
     * @param codeContext 代码上下文
     */
    public addCodeContext(codeContext: CodeContext | null) {
        this.codeContexts.push(codeContext);
    }
}

export enum CodeItemType {
    Type = 1,           // 类型
    Object = 2,         // 对象
}

export class ParserError extends Error {
    constructor(token: Token | null, message: string) {
        
        if (token) {
            let msg = `解析错误: ${message}，行: ${token.line + 1}，列: ${token.startColumn + 1} - ${token.endColumn + 1},
            token: ${token.tokenText}, 类型: ${TokenType[token.tokenType]},`;
            super(msg);
            return;
        }
        super(message)
    }
} 


export abstract class SubParser {
    
    protected _tokens: Token[] = [];
    public get tokens(): Token[] {
        return this._tokens;
    }

    protected _tokenStartIndex: number = 0;
    public get tokenStartIndex(): number {
        return this._tokenStartIndex;
    }

    public get currentTokenIndex(): number {
        return SyntaxParser.tokenIndex;
    }
    public set currentTokenIndex(value: number) {
        SyntaxParser.tokenIndex = value;
    }

    protected _cmdBlock: CmdBlock | null = null;
    public get cmdBlock(): CmdBlock | null {
        return this._cmdBlock;
    }

    // 附加参数集合，用于传递额外的参数
    protected _params: any = null;

    /**
     *  解析
     * @param cmdBlock 命令逻辑链
     * @param out 解析结果 
     * @param params 附加参数
     */
    public parse(cmdBlock : CmdBlock | null, out : ParserResult, params? : any) {
        this._tokens = SyntaxParser.tokens;
        this._tokenStartIndex = SyntaxParser.tokenIndex;
        this.currentTokenIndex = SyntaxParser.tokenIndex;
        this._cmdBlock = cmdBlock;
        this._params = params;
        out.tokenStartIndex = SyntaxParser.tokenIndex;

        if (ENV_EDITOR) {            
            Logger.log("开始解析.... " + this.constructor.name, this.peekToken());
        }

        this.parseCore(out);

        if (ENV_EDITOR) {
            //Logger.log("....解析完成 " + this.constructor.name, out.codeContext);
        }
    }

    protected abstract parseCore(out : ParserResult) : void;

    //#region token 辅助方法

    /**
     *  读取一个 token, 并将当前 token 索引后移
     */
    protected readToken() : Token {
        if (this.currentTokenIndex < this._tokens.length) {
            return this._tokens[this.currentTokenIndex++];
        }
        throw new ParserError(null, "readToken 无法读取 token");
    }

    /**
     * 读取一个 token, 但不将当前 token 索引后移
     */
    protected peekToken() : Token {
        if (this.currentTokenIndex < this._tokens.length) {
            return this._tokens[this.currentTokenIndex];
        }
        throw new ParserError(null, "peekToken 无法 peek token");
    }

    /**
     * 回滚 token 索引
     */
    protected backToken(count: number = 1) {
        if (this.currentTokenIndex - count >= 0) {
            this.currentTokenIndex -= count;
        }
        else {
            throw new ParserError(null, "无法回滚 token 索引 : " + count);
        }
    }

    /**
     * 跳过指定数量的 token
     */
    protected skipToken(count: number = 1) {
        this.currentTokenIndex += count;
    }


    /**
     * 读取一个 token, 并检查其类型是否符合预期
     */
    protected readExpectedToken(tokenType: TokenType) : Token {
        let token = this.readToken();
        if (token && token.tokenType === tokenType) {
            return token;
        }
        throw new ParserError(token, "读取到的 token 类型与预期不符：" + TokenType[tokenType] + " != " + (token ? TokenType[token.tokenType] : "null"));
    }

    /**
     * peek 一个 token, 并检查其类型是否符合预期
     */
    protected peekExpectedToken(tokenType: TokenType) : Token {
        let token = this.peekToken();
        if (token && token.tokenType === tokenType) {
            return token;
        }
        throw new ParserError(token, "读取到的 token 类型与预期不符: " + TokenType[tokenType] + " != " + (token ? TokenType[token.tokenType] : "null"));
    }

    /**
     * 读取一个 token, 如果类型符合预期则索引后移
     */
    protected getExpectedToken(tokenType: TokenType) : Token | boolean {
        let token = this.peekToken();
        if (token && token.tokenType === tokenType) {
            this.readToken();
            return token;
        }
        return false;
    }

    //#endregion

    //#region 获取CodeContext辅助方法

    

    //#endregion

}
