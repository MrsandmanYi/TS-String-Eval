import { ClassContext } from "../context/ClassContext";
import { Token } from "./Token";
import { TokenType } from "./TokenType";
import { ParserResult } from "./parsers/SubParser";
import { ClassParser } from "./parsers/index";

/**
 * SyntaxParser 语法解析器
 */
export class SyntaxParser {

    public static classMap: Map<string, ClassContext> = new Map<string, ClassContext>();

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
    }


    /**
     * parse 解析
     */
    public static parse(tokens: Token[]) {
        SyntaxParser.clear();
        SyntaxParser.tokens = tokens;
        
        while(SyntaxParser.tokenIndex < SyntaxParser.tokens.length - 1) {
            let token = SyntaxParser.tokens[SyntaxParser.tokenIndex];
            if (token.tokenType == TokenType.Class || token.tokenType == TokenType.Export) {
                this.parseClass();
            }
            else {
                throw new Error(`SyntaxParser 未知的 token 类型 ${token.tokenType}`);
            }
        }

        SyntaxParser.classMap.forEach((value, key) => {
            console.log(`类名: ${key}`, value);
            if (value.parentClassName) {
                let parentClass = SyntaxParser.classMap.get(value.parentClassName);
                if (parentClass) {
                     console.log(`父类: ${parentClass.className}`);
                     value.parentClass = parentClass;
                }
                else {
                    console.error(`父类 ${value.parentClassName} 不存在`);
                }
            }
            value.print();
        });
    }

    public static parseClass() {
        let result = new ParserResult();
        ClassParser.parse(null, result);
        let classContext = result.codeContext as ClassContext;
        SyntaxParser.classMap.set(classContext.className, classContext);
    }


}

