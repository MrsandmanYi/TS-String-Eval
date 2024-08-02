import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {

    constructor() { 
        if (true || this.testFunc()){
            console.log("......constructor test.......");
        }
    }
    
    public testFunc(){
        console.log("test func");
        return true;
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

