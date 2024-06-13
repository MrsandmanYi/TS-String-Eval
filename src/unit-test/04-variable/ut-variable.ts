import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {

    public va: number = 1;
    public vb: string = "...str";
    
    constructor() { 
        this.funcOne();
        this.funcTwo();
        this.funcThree();
    }

    funcOne(){
        console.log("--- funcOne");
        console.log(this.va);
        console.log(this.vb);
        console.log("funcOne ---");
    }

    funcTwo(){
        let a: number = 100;
        let b: number = 200;
        let c: number = a + b;
        console.log("--- funcTwo");
        console.log(a);
        console.log(b);
        console.log(c);
        console.log("funcTwo ---");
    }

    funcThree(){
        console.log("--- funcThree");
        let d: number = 100;
        let e: number = 200;
        console.log(this.va + d);
        console.log(this.vb +"  "+ 200); 
        console.log("funcThree ---");
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
        console: console
    }
});

