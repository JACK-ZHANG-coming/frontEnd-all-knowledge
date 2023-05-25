/**
 * 场景引入：
 *
 */

/**
 * 泛型简单使用
 *
 */

/**
 * 泛型变量
 *
 */

/**
 * 泛型类型
 */
// function loggingIdentity<T>(arg: T[]): T[] {
//     console.log(arg.length) // Array has a .length, so no more error
//     return arg
// }
// loggingIdentity([1, 2])

/**
 * e.g: 定义一个函数，接收3个参数，返回参数为接受的第一个或者第二个参数
 */
function returnFirstOrSecond<T extends string | number, U extends number | object>(a: T, b: U, flag: true | false = false): T | U {
    if (flag) {
        return a
    }
    else {
        return b
    }
}

console.log(returnFirstOrSecond(111, {}, true));