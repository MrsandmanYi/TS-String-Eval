import { Lexer } from "./compiler/Lexer";
import { SyntaxParser } from "./compiler/SyntaxParser";



const lexer = new Lexer(`
class Start {
    main() {
        //console.log('"hello world');
        for(let i = 0; i < 10; i++) {
            console.log(i);
        }        
    }
}
`);

lexer.parserTokens();

let tokens = lexer.tokens;
console.log(tokens);

SyntaxParser.parse(tokens);
