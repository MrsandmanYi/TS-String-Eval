import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {
    constructor() { 
        
        // let func = ()=> {
        //     console.log("func...............");
        // }

        // let func2 = function() {
        //     console.log("func2...............");
        // }

        // func();
        // func2();

        let func3 = function(a: number, b: number) {
            console.log("func3...............", a + b);
        }

        let func4 = (a: number, b: number) => {
            console.log("func4...............", a + b);
        }

        func3(1, 2);
        func4(3, 4);

        let func5 = (a: number, b: number, c: number) => {
            console.log("func5...............", a + b + c);
        }
        func5(1, 2, 3);
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