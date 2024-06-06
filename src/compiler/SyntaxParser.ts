import { Token } from "./Token";
import { ClassParser } from "./parsers/ClassParser";

/**
 * SyntaxParser 语法解析器
 */
export class SyntaxParser {

    /**
     * tokenIndex 当前解析的 token 索引
     */
    public static tokenIndex: number = 0;

    /**
     * tokens 解析的 token 集合
     */
    public static tokens: Token[] = []; 

    public static clear() {
        SyntaxParser.tokenIndex = 0;
        ClassParser.clear();
    }




}

