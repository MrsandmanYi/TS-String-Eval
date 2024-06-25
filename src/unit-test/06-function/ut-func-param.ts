
/**
 * 测试拥有多种类型参数的函数调用
 */
import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


export class TestClass {

    public va: number = 100;

    public map :Map<number, string> = new Map<number, string>();

    public get prop1(){
        return function(){
            console.log("xxx prop1............");
        };
    }

    constructor() {
        console.log("....TestClass constructor");
        this.map.set(1, "one");
        this.map.set(2, "two");
        this.map.set(3, "three");
    }

   
    public foreachFunc2(value: string, key: number) {
        console.log("foreachFunc2: "+ "key: " + key + ", value: " + value);
    }


    public testMapForeach2(map2 :Map<number, string>, func: (value: string, key: number) => void) {
        console.log("testMapForeach2...............",func);
        map2.forEach((value, key) => {
            func(value, key);
        });
    }

}



const lexer = new Lexer(`
    class Start {
        constructor() { 
            let testClass = new TestClass();

            let func = function(value: string, key: number) {
                console.log("foreachFunc: "+ "key: " + key + ", value: " + value);
            }
            testClass.testMapForeach2(testClass.map, func);

            // 不支持
            testClass.testMapForeach2(testClass.map, function(value, key) {
                console.log("testClass foreach2: "+ "key: " + key + ", value: " + value);
            });
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

