import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {
    constructor() { 
        
        let func3 = function(a: number, b: number) {
            console.log("func3...............", a + b);
        }

        let func4 = (a: number, b: number) => {
            console.log("func4...............", a + b);
        }

        func3(1, 2);
        func4(3, 4);
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