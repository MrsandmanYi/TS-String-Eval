import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {
    constructor() { 
        // let i = 0;
        // while(i < 10) {
        //     console.log(i);
        //     i = i + 1;
        // }

        let j = 100;
        while(true) {
            if(j == 105 || j == 107) {
                j = j + 1;
                continue;
            }
            
            console.log(j);
            j = j + 1;

            if(j >= 110) {
                break;
            }
        }
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

