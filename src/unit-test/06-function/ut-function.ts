
/**
 * 测试拥有多种类型参数的函数调用
 */
import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


export class TestClass {

    public va: number = 100;

    constructor() {
        console.log("....TestClass constructor");
    }

    public testFunc(a: number, b: number, c: number) {
        console.log("a: " + a + ", b: " + b + ", c: " + c);
    }

    public testFunc2(a: number, b: number, ...args: number[]) {
        console.log("a: " + a + ", b: " + b + ", args: " + args);
    }
}



const lexer = new Lexer(`
class Start {
    constructor() { 
        let testClass = new TestClass();

        testClass.testFunc(1, 2, 3);
        testClass.testFunc2(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        let myClass = new MyClass();

        myClass.testFunc(1, 2, 3);
        let arr = [3, 4, 5, 6, 7, 8, 9, 10];
        myClass.testFunc2(1, 2, arr);
    }
}

class MyClass {
    constructor() {
        console.log("....MyClass constructor....");
    }

    public testFunc(a: number, b: number, c: number) {
        console.log("MyClass a: " + a + ", b: " + b + ", c: " + c);
    }

    public testFunc2(a: number, b: number, args: number[]) {
        console.log("MyClass a: " + a + ", b: " + b + ", args: " + args);
    }
}

`);

lexer.parserTokens();
let tokens = lexer.tokens;
for (let i = 0; i < tokens.length; i++) {
    console.log(tokens[i]);
}
//console.log(tokens);

RunTime.run({
    tokens: tokens,
    mainClassName: "Start",
    global: {
        console: console,
        TestClass: TestClass,
    }
});


