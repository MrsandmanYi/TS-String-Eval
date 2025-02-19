import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {

    constructor() { 
        let array = new Array();
        let array2 = new Array();
        array2.push(1);
        array = array.concat(array2);
        console.log("array: ", array);
        console.log("array2: ", array2);
        //console?.log(".......constructor test.......");
        //console!.log(".......constructor test2.......");
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

