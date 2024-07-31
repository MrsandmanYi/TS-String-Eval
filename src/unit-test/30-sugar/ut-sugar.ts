import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {

    constructor() { 
        console?.log(".......constructor test.......");
        console!.log(".......constructor test2.......");
    }
}
`);

lexer.parserTokens();
let tokens = lexer.tokens;
console.log(tokens);

RunTime.run({
    tokens: tokens,
    mainClassName: "Start",
    global: {
        console: console
    }
});

