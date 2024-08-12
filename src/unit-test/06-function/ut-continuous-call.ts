
/**
 * 测试拥有多种类型参数的函数调用
 */
import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";



class TestClass {
    public vb = "hello variable in TestClass";
    
    public static instance(){
        return new TestClass();
    }

    // public testFunc() {
    //     return "TestClass.testFunc";
    // }
}


const lexer = new Lexer(`
    class Start {
        constructor() { 
            console.log(TestClass.instance().vb);
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

