import { Token } from "../Token";

/**
 * 解析器返回结果
 */
export interface LexerResult {
    type: string,
    text: string,
    line: number,
    endLine: number,        // 不赋值则表示在同一行
    startColumn: number,
    endColumn: number,
    tokens: Array<Token>,  // 词法标记数组
}

/**
 * 子解析器基类
 */
export abstract class SubLexer {
    

    public abstract parse(lines : string[], lineIndex : number, columnIndex : number, out : LexerResult): boolean;
    
}