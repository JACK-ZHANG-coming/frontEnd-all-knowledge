/**
 *  标准写法，完全按照ts规则
 */
// interface SquareConfig {
//     color?: string;
//     width?: number;
// }
function createSquare(config) {
    return {
        color: config.color,
        area: config.width
    };
}
var squareOptions = { color: "red11", opacity: 0.5 }; // 用squareOptions变量来转接一下
var mySquare = createSquare(squareOptions); //这里依然不会报错
console.log('mySquare--->', mySquare);
