
/**
 * 测试拥有参数 和 不定参数的函数调用
 */
import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


export class TestClass {

    constructor() {

    }
}



const lexer = new Lexer(`
class Start {
    constructor() { 
        //console.log(".......Start constructor");

        let array :number[] = [1, 2, 3];
        array[0] = 100;
        console.log("array: " + array);
        this.testFunc(1, array);
    }

    public testFunc(a: number, args?: number[]) { 
        args[1] = 2000;
        console.log("a: " + a + ", args: " + args);
    }
}


`);

lexer.parserTokens();
let tokens = lexer.tokens;
for (let i = 0; i < tokens.length; i++) {
    console.log(tokens[i]);
}
console.log(tokens);

RunTime.run({
    tokens: tokens,
    mainClassName: "Start",
    global: {
        console: console,
        TestClass: TestClass,
    }
});


