import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {
    constructor() { 
        for(let i = 0; i < 10; i++) {
            console.log("i = ", i);
        }
    }
}
`);

lexer.parserTokens();
let tokens = lexer.tokens;

RunTime.run({
    tokens: tokens,
    mainClassName: "Start",
    global: {
        console: console
    }
});

