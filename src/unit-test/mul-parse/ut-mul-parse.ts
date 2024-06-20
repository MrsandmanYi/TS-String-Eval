import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";

class TestClass {
    
    constructor() {
        console.log("....TestClass constructor");
    }
}


const lexer = new Lexer(`
class Start {

    constructor() { 
        console.log(".......constructor unit test.......");
    }
}
`);

lexer.parserTokens();
let tokens = lexer.tokens;

RunTime.run({
    tokens: tokens,
    mainClassName: "Start",
    global: {
        console: console
    }
});



const lexer2 = new Lexer(`
    class NewStart {
    
        constructor() { 
            console.log(".......NewStart constructor unit test.......");

            let testClass = new TestClass();
        }
    }
    `);
    
lexer2.parserTokens();
let tokens2 = lexer2.tokens;
    
RunTime.run({
    tokens: tokens2,
    mainClassName: "NewStart",
    global: {
        console: console,
        TestClass: TestClass,
    }
});
    