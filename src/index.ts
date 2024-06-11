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

    testFunc(param1 : number, param2 : string) {
        if (param1 > 0) {
            console.log(param1, param2);
        }
        else if(param2  == "debug") {
            console.log("debug");
        }
        else {
            console.log("else");
        }
    }
}
`);

lexer.parserTokens();

let tokens = lexer.tokens;
console.log(tokens);

SyntaxParser.parse(tokens);

