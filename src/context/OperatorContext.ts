import { Token } from "../compiler/Token";
import { TokenType } from "../compiler/TokenType";
import { CodeContext } from "./CodeContext";

/**
 * 运算符上下文
 */
export class OperatorContext extends CodeContext {
  
    public readonly right: CodeContext;
    public readonly left: CodeContext;
    public readonly operator: TokenType;
  
    constructor(right: CodeContext, left: CodeContext, operator: TokenType, token: Token | null) {
        super(token);
        this.right = right;
        this.left = left;
        this.operator = operator;
    }
}
