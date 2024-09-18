import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
    class Start {
        constructor() { 
            let temp = null;
            if(true){
                temp = 10;
            }
            console.log("temp: ", temp);
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

