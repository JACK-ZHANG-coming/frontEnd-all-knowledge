function bubbleSort(arr) {
    let len = arr.length;
    let swapped;

    console.log("原始数组:", [...arr]);

    for (let i = 0; i < len - 1; i++) {
        swapped = false;
        console.log(`\n第 ${i + 1} 轮遍历开始`);

        for (let j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                // 交换元素
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swapped = true;
                console.log(`交换 ${arr[j]} 和 ${arr[j + 1]} → `, [...arr]);
            }
        }

        console.log(`第 ${i + 1} 轮遍历结果:`, [...arr]);
        if (!swapped) break; // 如果本轮没有交换，提前结束
    }
    return arr;
}

// 测试示例
const testArray = [5, 3, 8, 4, 6];
console.log("\n排序开始 ==================");
const sortedArray = bubbleSort(testArray);
console.log("\n最终排序结果:", sortedArray);
