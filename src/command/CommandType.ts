export enum CommandType {
    None = 0,       // 空

    /**
     * var\let 声明可变变量
     */
    Let = 1,           
    /**
     * if 条件语句
     */
    If_CMD = 2,
    /**
     * for 循环
     */
    For_CMD = 3,
    /**
     * forin 循环
     */
    ForIn_CMD = 4,
    /**
     * for simple 循环
     */
    ForSimple_CMD = 5,
    /**
     * while 循环
     */
    While_CMD = 6,
    /**
     * switch 语句
     */
    Switch_CMD = 7,
    /**
     * break 语句
     */
    Break_CMD = 8,
    /**
     * try 语句
     */
    Try_CMD = 9,
    /**
     * throw 语句
     */
    Throw_CMD = 10,
    /**
     * function 语句
     */
    Function_CMD = 11,
    /**
     * resolve 
     */
    Resolve_CMD = 12,
    /**
     * return
     */
    Return_CMD = 13,
    /**
     * continue
     */
    Continue_CMD = 14,
    /**
     * new
     */
    New_CMD = 15,
    /**
     * typeof
     */
    Typeof_CMD = 16,
    /**
     * delete
     */
    Delete_CMD = 17,

}