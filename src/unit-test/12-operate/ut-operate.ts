import { Lexer } from "../../compiler/Lexer";
import { RunTime } from "../../runtime/Runtime";


const lexer = new Lexer(`
class Start {
    constructor() { 
        // ! 操作符
        let result = false;
        if(!result) {
            console.log("result is false");
        }

        // !! 操作符
        let result2 = "not empty";
        if(!!result2) {
            console.log("result2 is not empty");
        }

        // ++ 操作符
        let result3 = 0;
        result3++;
        ++result3;
        console.log("result3: ", ++result3);

        // -- 操作符
        let result4 = 0;
        result4--;
        --result4;
        console.log("result4: ", --result4);

        // != 操作符
        let result5 = 1;
        if(result5 != 2) {
            console.log("result5 is not 2");
        }
        
        // !== 操作符
        let result6 = 1;
        if(result6 !== 3) {
            console.log("result6 is not 3");
        }

        // + 操作符
        let result7 = "add" + " string";
        console.log("result7: ", result7);

        // - 操作符
        let result8 = 10 - 5;
        console.log("result8: ", result8);

        // * 操作符
        let result9 = 10 * 5;
        console.log("result9: ", result9);

        // / 操作符
        let result10 = 10 / 5;
        console.log("result10: ", result10);

        // % 操作符
        let result11 = 10 % 5;
        console.log("result11: ", result11);

        // < 操作符
        let result12 = 10;
        if(result12 < 20) {
            console.log("result12 is less than 20");
        }

        // <= 操作符
        let result13 = 10;
        if(result13 <= 20) {
            console.log("result13 is less than or equal 20");
        }

        // > 操作符
        let result14 = 10;
        if(result14 > 5) {
            console.log("result14 is greater than 5");
        }

        // >= 操作符
        let result15 = 10;
        if(result15 >= 5) {
            console.log("result15 is greater than or equal 5");
        }

        // == 操作符
        let result16 = 10;
        if(result16 == 10) {
            console.log("result16 is equal 10");
        }

        // === 操作符
        let result17 = 10;
        if(result17 === 10) {
            console.log("result17 is equal 10");
        }

        // && 操作符
        let result18 = true;
        if(!result18 && true) {
            console.log("result18 is true");
        }
        else{
            console.log("result18 is false");
        }

        // TODO: 这种写法暂不支持
        // if(!(result18)){
        //     console.log("result18 is true 2");
        // }
        // else{
        //     console.log("result18 is false 2");
        // }

        // || 操作符
        let result19 = true;
        if(result19 || false) {
            console.log("result19 is true");
        }
        else{
            console.log("result19 is false");
        }

        // & 操作符
        let result20 = 1 & 2;
        console.log("result20: ", result20);

        // | 操作符
        let result21 = 1 | 2;
        console.log("result21: ", result21);

        // ^ 操作符
        let result22 = 1 ^ 2;
        console.log("result22: ", result22);

        // << 操作符
        let result23 = 1 << 2;
        console.log("result23: ", result23);

        // >> 操作符
        let result24 = 4 >> 1;
        console.log("result24: ", result24);

        // &= 操作符
        let result25 = 1;
        result25 &= 2;
        console.log("result25: ", result25);

        // |= 操作符
        let result26 = 1;
        result26 |= 2;
        console.log("result26: ", result26);

        // ^= 操作符
        let result27 = 1;
        result27 ^= 2;
        console.log("result27: ", result27);

        // <<= 操作符
        let result28 = 1;
        result28 <<= 2;
        console.log("result28: ", result28);

        // ~ 操作符
        let result29 = ~1;
        console.log("result29: ", result29);

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
        console: console
    }
});
