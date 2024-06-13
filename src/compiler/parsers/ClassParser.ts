import { CmdBlock } from "../../command/CmdBlock";
import { ClassContext } from "../../context/ClassContext";
import { CodeContext } from "../../context/CodeContext";
import { TokenType } from "../TokenType";
import { MembersParser } from "./MembersParser";
import { ParserResult, SubParser } from "./SubParser";

/**
 * 类解析器，用于解析类定义，类定义的语法如下：
 * class 类名 extends 父类名 { 类成员 }
 * abstract class 类名 extends 父类名 { 类成员 }
 * export class 类名 extends 父类名 { 类成员 }
 * export abstract class 类名 extends 父类名 { 类成员 }
 * TODO: 暂不支持接口
 */
class ClassSubParser extends SubParser {


    protected parseCore(out: ParserResult): void {
        let cmdBlock = this.cmdBlock;
        let isExport: boolean = !!this.getExpectedToken(TokenType.Export);
        let isAbstract: boolean = !!this.getExpectedToken(TokenType.Abstract);

        let classToken = this.readExpectedToken(TokenType.Class); // class, 类名前必须有 class 关键字
        let classNameToken = this.readExpectedToken(TokenType.Identifier); // 类名

        let classContext : ClassContext = new ClassContext(false, classToken);
        classContext.className = classNameToken.tokenText;
        classContext.isExport = isExport;
        classContext.isAbstract = isAbstract;

        // if (SyntaxParser.classMap.has(classContext.className)) {
        //     throw new Error(`类 ${classContext.className} 已经存在`);
        // }
        // SyntaxParser.classMap.set(classContext.className, classContext);

        // 读取父类
        let parentClassName = this.readParentClass();
        classContext.parentClassName = parentClassName;
        // 读取类成员
        this.readMembers(classContext, cmdBlock);

        out.setCodeContext(classContext);
    }

    protected readParentClass(): string {
        let token = this.peekToken();
        if (token?.tokenType == TokenType.Extends) {
            this.readToken(); // 读取 extends
            let parentClassNameToken = this.readExpectedToken(TokenType.Identifier); // 父类名
            return parentClassNameToken.tokenText;
        }
        return "";
    }

    protected readMembers(classContext : CodeContext, cmdBlock: CmdBlock | null) {
        let result = new ParserResult();
        MembersParser.parse(cmdBlock, result, {classContext: classContext});
    }

}

export const ClassParser = new ClassSubParser();
