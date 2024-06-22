
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

    public testFunc(a: number, b: number, c: number) {
        console.log("a: " + a + ", b: " + b + ", c: " + c);
    }

    public testFunc2(a: number, b: number, ...args: number[]) {
        console.log("a: " + a + ", b: " + b + ", args: " + args);
    }

    public foreachFunc(value: string, key: number) {
        console.log("foreachFunc: "+ "key: " + key + ", value: " + value);
    }
    
    public foreachFunc2(value: string, key: number) {
        console.log("foreachFunc2: "+ "key: " + key + ", value: " + value);
    }

    public testMapForeach(map2 :Map<number, string>) {
        console.log("testMapForeach...............");
        map2.forEach((value, key) => {
            this.foreachFunc(value, key);
        });
    }

    public testMapForeach2(map2 :Map<number, string>, func: (value: string, key: number) => void) {
        console.log("testMapForeach2...............",func);
        this.foreachFunc2 = func;
        map2.forEach((value, key) => {
            this.foreachFunc2(value, key);
        });
    }

    public testClassParams(params : any){
        console.log("testClassParams...............");
        console.log(params.param1);
        console.log(params.param2);
        console.log(params.param3);
        console.log(params);
    }
}



const lexer = new Lexer(`
class Start {
    constructor() { 
        let testClass = new TestClass();

        console.log(testClass.testFunc);
        console.log(testClass["testFunc2"]);

        testClass.testFunc(1, 2, 3);
        testClass.testFunc2(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        // 这种方式可以成功赋值方法
        testClass.foreachFunc = function(value, key) {
            //console.log("testsss");
            console.log("testClass foreach: "+ "key: " + key + ", value: " + value);
        }

        testClass.testMapForeach(testClass.map);

        let func = function(value, key) {
            console.log("testClass foreach2: "+ "key: " + key + ", value: " + value);
        }
        testClass.testMapForeach2(testClass.map, func);

        // TODO 这样无法成功赋值方法，需要修复
        // testClass.testMapForeach2(testClass.map, function(value, key) {
        //     console.log("testClass foreach2: "+ "key: " + key + ", value: " + value);
        // });

        let myClass = new MyClass();

        myClass.testFunc(1, 2, 3);
        let arr = [3, 4, 5, 6, 7, 8, 9, 10];
        myClass.testFunc2(1, 2, arr);

        let paramsClass = new ParamsClass();
        testClass.testClassParams(paramsClass);

        console.log(testClass.prop1);
        testClass.prop1();
    }
}

class ParamsClass {
    let param1: number = 100;
    let param2: string = "hello";
    let param3: boolean = true;
    constructor() {
    
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


