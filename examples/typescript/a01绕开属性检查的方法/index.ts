/**
 *  标准写法，完全按照ts规则
 */
// interface SquareConfig {
//     color?: string;
//     width?: number;
// }

// function createSquare(config: SquareConfig): { color: string; area: number } {
//     return {
//         color: config.color,
//         area: config.width
//     }
// }
// let mySquare = createSquare({ color: "red", width: 100 });
// console.log('mySquare--->', mySquare)


/**
 * 传入与原来约定类型不同的入参 ts会提示报错
 */
// interface SquareConfig {
//     color?: string;
//     width?: number;
// }

// function createSquare(config: SquareConfig): { color: string; area: number } {
//     return {
//         color: config.color,
//         area: config.width
//     }
// }
// let mySquare = createSquare({ color: "red", width12: 100 });
// console.log('mySquare--->', mySquare)

/**
 * 解决方案1： 类型断言绕开判断
 */
// interface SquareConfig {
//     color?: string;
//     width?: number;
// }

// function createSquare(config: SquareConfig): { color: string; area: number } {
//     return {
//         color: config.color,
//         area: config.width,
//     }
// }
// let mySquare = createSquare({ color: "red", opacity: 0.5 } as SquareConfig);  // 这里声明了{ color: "red", opacity: 0.5 } 就是SquareConfig类型
// console.log('mySquare--->', mySquare)



/**
 * 解决方案2：添加一个字符串索引签名
 */
// interface SquareConfig {
//     color?: string;
//     width?: number;
//     [propName: string]: any;
// }

// function createSquare(config: SquareConfig): { color: string; area: number } {
//     return {
//         color: config.color,
//         area: config.width,
//     }
// }
// let mySquare = createSquare({ color: "red", opacity: 0.5 });  //这里依然不会报错
// console.log('mySquare--->', mySquare)


/**
 * 解决方案3：用一个变量转接
 */
// interface SquareConfig {
//     color?: string;
//     width?: number;
// }

// function createSquare(config: SquareConfig): { color: string; area: number } {
//     return {
//         color: config.color,
//         area: config.width,
//     }
// }
// let squareOptions = { color: "red11", opacity: 0.5 } // 用squareOptions变量来转接一下
// let mySquare = createSquare(squareOptions);  //这里依然不会报错
// console.log('mySquare--->', mySquare)