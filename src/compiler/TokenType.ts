/**
 * TypeScripts词法单元类型
 */
export enum TokenType {

    /**
     * 未知
     */
    None = 0,

    /**
     * 标识符
     */
    Identifier = 1,

    /**
     * var/let 声明可变变量
     */
    Var = 2,

    /**
     * const 声明不可变变量
     */
    Const = 3,

    /**
     * { 语句块开始
     */
    LeftBrace = 10,

    /**
     * } 语句块结束
     */
    RightBrace = 11,

    /**
     * ( 参数开始
     */
    LeftParen = 12,

    /**
     * ) 参数结束
     */
    RightParen = 13,

    /**
     * [ 数组开始
     */
    LeftBracket = 14,

    /**
     * ] 数组结束
     */
    RightBracket = 15,

    /**
     * . 对象属性访问
     */
    Dot = 20,

    /**
     * , 分隔符
     */
    Comma = 21,

    /**
     * : 冒号
     */
    Colon = 22,

    /**
     * ; 分号
     */
    Semicolon = 23,

    /**
     * ? 问号
     */
    Question = 24,

    /**
     * ... 扩展运算符
     */
    Spread = 25,

//#region 运算符

    /**
     * = 赋值
     */
    Assign = 30,
    
    /**
     * += 加法赋值
     */
    AddAssign = 31,

    /**
     * -= 减法赋值
     */
    SubAssign = 32,

    /**
     * *= 乘法赋值
     */
    MulAssign = 33,

    /**
     * /= 除法赋值
     */
    DivAssign = 34,

    /**
     * %= 取余赋值
     */
    ModAssign = 35,

    /**
     * **= 幂赋值
     */
    PowAssign = 36,

    /**
     * 逻辑或 ||
     */
    Or = 40,

    /**
     * 逻辑与 &&
     */
    And = 41,

    /**
     * 逻辑非 !
     */
    Not = 42,

    /**
     * 逻辑等于 == 或 ===
     */
    Equal = 43,

    /**
     * 逻辑不等于 != 或 !==
     */
    NotEqual = 44,

    /**
     * 逻辑大于 >
     */
    Greater = 45,

    /**
     * 逻辑小于 <
     */
    Less = 46,

    /**
     * 大于等于 >=
     */
    GreaterEqual = 47,

    /**
     * 小于等于 <=
     */
    LessEqual = 48,

    /**
     * 非非 !! 
     */
    NotNot = 49,

    /**
     * 加法 +
     */
    Add = 50,

    /**
     * 减法 -
     */
    Sub = 51,

    /**
     * 乘法 *
     */
    Mul = 52,

    /**
     * 除法 /
     */
    Div = 53,

    /**
     * 取余 %
     */
    Mod = 54,

    /**
     * 幂 **
     */
    Pow = 55,

    /**
     * 自增 ++
     */
    Increment = 60,

    /**
     * 自减 --
     */
    Decrement = 61,

    /**
     * ^ 异或		
     */
    Xor = 70,

    /**
     * | 按位或
     */
    BitwiseOr = 71,

    /**
     * & 按位与
     */
    BitwiseAnd = 72,
    
    /**
     * ~ 按位非
     */
    BitwiseNot = 73,

    /**
     * 左移 <<
     */
    ShiftLeft =74,

    /**
     * 右移 >>
     */
    ShiftRight = 75,
    
    /**
     * ^= 异或赋值
     */
    AssignBitwiseXor = 76,

    /**
     * |= 按位或赋值
     */
    AssignBitwiseOr = 77,

    /**
     * &= 按位与赋值
     */
    AssignBitwiseAnd = 78,

    /**
     * <<= 左移赋值
     */
    AssignShiftLeft = 79,

    /**
     * >>= 右移赋值
     */
    AssignShiftRight = 80,

    /**
     * ~= 按位非赋值
     */
    AssignBitwiseNot = 81,
//#endregion
    
    /**
     * if 关键字
     */
    If = 100,

    /**
     * else 关键字
     */
    Else = 101,

    /**
     * for 关键字
     */
    For = 102,

    /**
     * while 关键字
     */
    While = 103,

    /**
     * break 关键字
     */
    Break = 104,

    /**
     * continue 关键字
     */
    Continue = 105,

    /**
     * return 关键字
     */
    Return = 106,

    /**
     * true 关键字
     */
    True = 107,

    /**
     * false 关键字
     */
    False = 108,

    /**
     * null 关键字
     */
    Null = 109,

    /**
     * undefined 关键字
     */
    Undefined = 110,

    /**
     * new 关键字
     */
    New = 111,

    /**
     * function 关键字
     */
    Function = 112,

    /**
     * class 关键字
     */
    Class = 113,

    /**
     * extends 关键字
     */
    Extends = 114,

    /**
     * super 关键字
     */
    Super = 115,

    /**
     * this 关键字
     */
    This = 116,

    /**
     * instanceof 关键字
     */
    InstanceOf = 117,

    /**
     * in 关键字
     */
    In = 118,

    /**
     * typeof 关键字
     */
    TypeOf = 119,

    /**
     * delete 关键字
     */
    Delete = 120,

    /**
     * try 关键字
     */
    Try = 121,

    /**
     * catch 关键字
     */
    Catch = 122,

    /**
     * finally 关键字
     */
    Finally = 123,

    /**
     * throw 关键字
     */
    Throw = 124,

    /**
     * switch 关键字
     */
    Switch = 125,

    /**
     * case 关键字
     */
    Case = 126,

    /**
     * default 关键字
     */
    Default = 127,

    /**
     * import 关键字
     */
    Import = 128,

    /**
     * export 关键字
     */
    Export = 129,

    /**
     * as 关键字
     */
    As = 130,

    /**
     * from 关键字
     */
    From = 131,

    /**
     * module 关键字
     */
    Module = 132,

    /**
     * namespace 关键字
     */
    Namespace = 133,

    /**
     * interface 关键字
     */
    Interface = 134,

    /**
     * implements 关键字
     */
    Implements = 135,

    /**
     * package 关键字
     */
    Package = 136,

    /**
     * private 关键字
     */
    Private = 137,

    /**
     * protected 关键字
     */
    Protected = 138,

    /**
     * public 关键字
     */
    Public = 139,

    /**
     * static 关键字
     */
    Static = 140,

    /**
     * abstract 关键字
     */
    Abstract = 141,

    /**
     * readonly 关键字
     */
    Readonly = 142,

    /**
     * enum 关键字
     */
    Enum = 143,
    
    /**
     * get 关键字
     */
    Get = 144,

    /**
     * set 关键字
     */
    Set = 145,

    /**
     * is 关键字
     */
    IS = 146,

    /**
     * else if 关键字
     */
    ElseIf = 147,

    /**
     * of 关键字
     */
    Of = 148,

    /**
     * async 关键字
     */
    Async = 149,

    /**
     * await 关键字
     */
    Await = 150,

    /**
     * void 关键字
     */
    Void = 151,

    /**
     * NaN 关键字
     */
    NaN = 152,

    /**
     * 字符串
     */
    String = 200,

    /**
     * 数字
     */
    Number = 210,

    /**
     * - 负数
     */
    Negative = 211,

    /**
     * + 正数
     */
    Positive = 212,
}