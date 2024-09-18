import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {
    constructor() { 
        
        // let func3 = function(a: number, b: number) {
        //     console.log("func3...............", a + b);
        // }

        // let func4 = (a: number, b: number) => {
        //     console.log("func4...............", a + b);
        // }

        // func3(1, 2);
        // func4(3, 4);

        let map = new Map<string, number>();

        map.set("a", 1);
        map.set("b", 2);

        console.log("map a: ", map.get("a"));
        console.log("map b: ", map.get("b"));

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