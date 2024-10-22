import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
    class Start {
        constructor() { 
            console.log(this.test(1));
        }

        test(num) {
            // if(num != 1) {
            //     let bbb = 1;
            //     return bbb;
            // }

            for(let i = 0; i < 10; i++) {
                if(i == num) {
                    return i + 1;
                }
            }
            
            return 0;
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

