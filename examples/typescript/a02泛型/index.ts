
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


/**
 * 泛型类型
 */
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
loggingIdentity([1, 2])