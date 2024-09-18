import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";

export class TestClass {

    public testMap: Map<number, string> = new Map<number, string>();

    constructor(){
        console.log("....TestClass constructor");
        this.testMap.set(1, "one");
        this.testMap.set(2, "two");
        this.testMap.set(3, "three");
    }

}

const lexer = new Lexer(`
class Start {
    constructor() { 
       
        // let arr = [1,3,5,7,2,6];
        // let vvvv;
        // for(vvvv in arr){
        //     console.log("for in: ",vvvv, arr[vvvv]);
        // }

        // for(vvvv of arr){
        //     console.log("for of: ",vvvv);
        // }
        let zzz;
        for(zzz = 0; zzz < 10; zzz++){
            console.log("for: ",zzz);
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
        TestClass: TestClass,
    }
});

