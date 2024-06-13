
import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


export class TestClass {

    public va: number = 100;

    constructor() {
        console.log("....TestClass constructor");
    }
}

export class TestClass2 {

    public va: number = 200;

    constructor() {
        console.log("....TestClass2 constructor");
    }
}

const lexer = new Lexer(`
class Start {
    constructor() { 
        let t = new TestClass();
        console.log("va: " + t.va);
        new TestClass2();
        let t2 = new TestClass2();
        t2.va = 999;
        console.log("class2 va: " + t2.va);

        let myClass = new MyClass();
    }
}

class MyClass {
    constructor() {
        console.log("....MyClass constructor....");
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
        TestClass2: TestClass2,
    }
});

