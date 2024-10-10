import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {

    constructor() { 
        console.log(".......constructor unit test.......");
        let self = this;
        let test = () => {
            console.log(self.sum(1,2));
        }
        test();
    }

    sum(a : number, b : number) : number {
        return a + b;
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

