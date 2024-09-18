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
        for(let i = 0; i < 10; i++) {
            console.log("for: " + i);
        }

        let arr = [1,3,5,7,2,6];
        for(const i in arr){
            console.log("for in: ",i, arr[i]);
        }

        let testClass = new TestClass();
        for(let keyValue of testClass.testMap){
            console.log("for of: ", keyValue);
            console.log("for of: ", keyValue[0], keyValue[1]);
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

