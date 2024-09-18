import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
    class Start {
        constructor() { 
            let neg = -124;
            // console.log("neg: ", neg);
            // let xxx = +124;
            // console.log("xxx: ", xxx);
            if (neg < -1) {
                console.log("neg < -1");
            }
            // if (neg <= -1) {
            //     console.log("neg <= -1");
            // }

            // if (xxx > -1) {
            //     console.log("xxx > -1");
            // }
        }
    }
`);

lexer.parserTokens();
let tokens = lexer.tokens;
//console.log(tokens);

RunTime.run({
    tokens: tokens,
    mainClassName: "Start",
    global: {
        console: console,
        Array: Array,
    }
});

