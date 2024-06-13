import { Token } from "../../compiler/Token";
import { TokenType } from "../../compiler/TokenType";

export class ProcessError extends Error {
    constructor(value: Token | any | null, message: string) {
        if (value) {
            if (value instanceof Token) {
                let token = value as Token
                let msg = `解析错误: ${message}，行: ${token.line + 1}，列: ${token.startColumn + 1} - ${token.endColumn + 1},
                token: ${token.tokenText}, 类型: ${TokenType[token.tokenType]},`;
                super(msg);
                return;
            }

        }
        super(message)
    }
} 

