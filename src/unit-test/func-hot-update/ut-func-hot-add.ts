import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


export class HotUpdateClass{
    public va: number = 100;
    public hotUpdateFunc(){
        console.log("hot update func");
    }

    public hotUpdateFuncPlus(params: number){
        console.log("hot update func plus: " + params);
        //@ts-ignore
        this.addhotUpdateFunc();

        HotUpdateClass.staticHotUpdateFunc();
    }

    static staticHotUpdateFunc(){
        console.log("static func");
    }
}


const lexer = new Lexer(`
class Start {
    constructor() { 
        HotUpdateClass.prototype.addhotUpdateFunc = function(){
            console.log("......new hot update func");
            console.log("va: " + this.va);
        };

        HotUpdateClass.staticHotUpdateFunc = function(){
            console.log("......static hot update func");
        }
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
new HotUpdateClass().hotUpdateFuncPlus(99999999);
//HotUpdateClass.staticHotUpdateFunc();
