import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


export class HotUpdateClass{

    public hotUpdateFunc(){
        console.log("hot update func");
    }
}

const lexer = new Lexer(`
class Start {
    constructor() { 
        HotUpdateClass.prototype.hotUpdateFunc = function(){
            console.log("......new hot update func");
        };
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
        HotUpdateClass: HotUpdateClass,
    }
});

new HotUpdateClass().hotUpdateFunc();