import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {

    constructor() { 

        let array = new Array();
        if(array){
            console.log("array is true");
        }
        else{
            console.log("array is false");
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
        console: console,
        Array: Array,
    }
});

