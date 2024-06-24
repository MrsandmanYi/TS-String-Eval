import { Token } from "../Token";
import { TokenType } from "../TokenType";


export const tokenFilterFunc = (tokens: Token[]): Token[] => {

    let arrowFunctionInfos: {
        leftParenIndex: number,
        arrowIndex: number,
    }[] = []

    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        let lineIndex = token.line;
        let startTokenIndex = i;

        //let lineTokens: Token[] = [];
        
        while (lineIndex == tokens[i].line) {
            //lineTokens.push(tokens[i]);
            if (tokens[i].tokenType == TokenType.ArrowFunction) {
                let arrowIndex = i;
                // 反向寻找 ( 符号
                let leftParenIndex = -1;
                for (let j = i - 1; j >= startTokenIndex; j--) {
                    if (tokens[j].tokenType == TokenType.LeftParen) {
                        leftParenIndex = j;
                        break;
                    }
                }

                if (leftParenIndex == -1) {
                    throw Error("箭头函数定义错误，缺少左括号");
                }
                
                arrowFunctionInfos.push({
                    leftParenIndex: leftParenIndex,
                    arrowIndex: arrowIndex
                });
            }
            
            i++;
            if (i >= tokens.length) {
                break;
            }

            if (tokens[i].line != lineIndex) {
                i--;
                break;
            }
        }

    }

    for(let i = 0; i < arrowFunctionInfos.length; i++) {
        let arrowFunctionInfo = arrowFunctionInfos[i];
        let leftParenIndex = arrowFunctionInfo.leftParenIndex;
        let arrowIndex = arrowFunctionInfo.arrowIndex;

        // 在 ( 前方插入Function Token
        tokens.splice(leftParenIndex, 0, 
            new Token(TokenType.Function, "function", 
                tokens[leftParenIndex].line,
                tokens[leftParenIndex].startColumn,
                tokens[leftParenIndex].endColumn));

        // 删除 arrowIndex 的Token
        tokens.splice(arrowIndex + 1, 1);
    }

    return tokens;
} 