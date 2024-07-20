
/**
 * 测试拥有多种类型参数的函数调用
 */
import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";



class TestClass {
    public vb = "hello variable in TestClass";
    
    public testFunc(callback: (param: number | null) => void) {
        callback(null);
    }
}


const lexer = new Lexer(`
    class Start {
        va = "hello variable in Start";

        constructor() { 
            let testClass = new TestClass();
            let self = this;
            testClass.testFunc((param) => {
                let cccc = this.vb;
                console.log(cccc);
                console.log(self.va);
            });
            this.testFuncStart();
        }

        testFuncStart(){
            console.log("testFuncStart2222", this.va);
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

