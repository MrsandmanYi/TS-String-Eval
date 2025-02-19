import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


export class HotUpdateClass{
    public va: number = 100;
    public hotUpdateFunc(){
        console.log("hot update func");
    }

    public hotUpdateFuncPlus(params: number){
        console.log("hot update func plus: " + params);
    }
}

export class ExtendHotUpdateClass extends HotUpdateClass{
    public hotUpdateFunc(){
        console.log("extend hot update func");
    }

    public hotUpdateFuncPlus(params: number){
        console.log("extend hot update func plus: " + params);
    }
}

const lexer = new Lexer(`
class Start {
    constructor() { 
        HotUpdateClass.prototype.hotUpdateFunc = function(){
            console.log("......new hot update func");
            console.log("va: " + this.va);
        };

        HotUpdateClass.prototype.hotUpdateFuncPlus = function(params){
            console.log("......new hot update func plus: " + params);
        };

        ExtendHotUpdateClass.prototype.hotUpdateFuncPlus = function(params){
            console.log("......new extend hot update func plus: " + params);
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
        ExtendHotUpdateClass: ExtendHotUpdateClass
    }
});

new HotUpdateClass().hotUpdateFunc();
new HotUpdateClass().hotUpdateFuncPlus(99999999);

new ExtendHotUpdateClass().hotUpdateFuncPlus(88888888);