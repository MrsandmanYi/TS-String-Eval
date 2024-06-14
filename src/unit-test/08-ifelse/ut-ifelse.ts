
/**
 * 1. Test if else statement
 * 2. Test if else if statement
 * 3. Test if else if else statement
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
        // let array :number[] = [1, 2];
        // let c = array[0];
        // for (let i = 0; i < array.length; i++) {
        //     let b = array[i];
        //     console.log(b);            
        // }
        console.log(".......Start constructor");
        let a = 10;
        console.log("a: " + a);
        if (a > 10) {
            console.log("a > 10");
        }
        else if (a > 5) {
            console.log("a > 5");
        }
        else {
            console.log("a <= 5");
        }

        console.log("......test array.......");

        let array :number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        for (let i = 0; i < array.length; i++) {
            let b = array[i];
            if (b > 5) {
                console.log("array[" + i + "] > 5", "b: " + b);
            }
            else if (b > 2) {
                console.log("array[" + i + "] > 2", "b: " + b);
            }
            else {
                console.log("array[" + i + "] <= 2", "b: " + b);
            }
        }
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


