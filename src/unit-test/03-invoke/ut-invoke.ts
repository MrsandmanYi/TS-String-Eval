import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {
    constructor() { 
        this.funcOne();
        this.funcTwo(123, "你好 世界!");
        this.funcTwo(1 + 2, "世界 " + "你好!")
    }

    funcOne(){
        console.log("Hello World!");
        this.funcThree();
    }

    funcTwo(num: number, str: string){
        console.log(num);
        console.log(str);
    }

    funcThree(){
        console.log("funcThree!");
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

