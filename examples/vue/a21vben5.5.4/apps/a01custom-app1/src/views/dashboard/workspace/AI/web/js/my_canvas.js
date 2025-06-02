let targetColor = { r: 0, g: 168, b: 0 };  // 初始绿色
let tolerance = 60;  // 初始容差
let use_canvas = false;  // 背景扣色模式

const canvas = document.getElementById('canvas');
const video = document.getElementById('video');
const useCanvasDiv = document.getElementById("use_canvas_div");

const bgVideo = document.getElementById('background-video');
const videoFileInput = document.getElementById('video-file');
const videoFileNameSpan = document.getElementById('video-file-name');

// 监听单选框的变化
useCanvasDiv.addEventListener("change", (event) => {
    const selectedValue = event.target.value;

    // 根据选中的值设置 `use` 变量
    use_canvas = selectedValue === "true";

    // 根据 `use_canvas` 的值切换样式
    if (use_canvas) {
        processFrame();
        canvas.style.display = "block";
        video.style.display = "none";
    } else {
        canvas.style.display = "none";
        video.style.display = "block";
    }
});

// 修改video标签的宽高为当前浏览器窗口的宽高
function resizeVideo() {
    video.style.width = `${window.innerWidth}px`;
    video.style.height = `${window.innerHeight}px`;
}

// 修改canvas标签的宽高为当前浏览器窗口的宽高
function resizeCanvas() {
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    $("#canvas-width").val(window.innerWidth);
    $("#canvas-height").val(window.innerHeight);
    $("#canvas-width-value").text(window.innerWidth);
    $("#canvas-height-value").text(window.innerHeight);
}

resizeVideo();
resizeCanvas();

// 处理文件选择并设置背景
// 加载背景图片
document.getElementById('background-file').addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const background = document.getElementById('background');
            background.style.backgroundImage = `url(${e.target.result})`;
            background.style.backgroundRepeat = 'no-repeat';
            background.style.backgroundPosition = 'center';
            background.style.backgroundSize = `100% auto`;

            const fileNameSpan = document.getElementById('file-name');
            fileNameSpan.textContent = file.name;
        };

        reader.readAsDataURL(file);
    } else {
        console.error('请求失败:', '请选择一个有效的图片文件');
    }
});

// 更新背景缩放比例
document.getElementById('bg-scale').addEventListener('input', function () {
    const scale = this.value;
    document.getElementById('bg-scale-value').textContent = scale;

    const background = document.getElementById('background');
    // 使用 background-size 来替代 transform: scale()
    background.style.backgroundSize = `${100 * scale}% auto`;
});

// 更新背景 X 偏移
document.getElementById('bg-offset-x').addEventListener('input', function () {
    const offsetX = this.value;
    document.getElementById('bg-offset-x-value').textContent = offsetX;

    const background = document.getElementById('background');
    background.style.backgroundPositionX = `${offsetX}%`;
});

// 更新背景 Y 偏移
document.getElementById('bg-offset-y').addEventListener('input', function () {
    const offsetY = this.value;
    document.getElementById('bg-offset-y-value').textContent = offsetY;

    const background = document.getElementById('background');
    background.style.backgroundPositionY = `${offsetY}%`;
});


// 监听文件选择
videoFileInput.addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file && file.type.startsWith('video/')) {
        const reader = new FileReader();

        reader.onload = function (e) {
            bgVideo.src = e.target.result;
            bgVideo.load(); // 重新加载视频
        };

        reader.readAsDataURL(file);
        videoFileNameSpan.textContent = file.name; // 显示文件名
    } else {
        console.error('请选择一个有效的视频文件');
    }
});

// 更新视频缩放比例
document.getElementById('video-scale').addEventListener('input', function () {
    const scale = this.value;
    document.getElementById('video-scale-value').textContent = scale;
    bgVideo.style.transform = `scale(${scale})`;
});

// 更新视频 X 偏移
document.getElementById('video-offset-x').addEventListener('input', function () {
    const offsetX = this.value;
    document.getElementById('video-offset-x-value').textContent = offsetX;
    bgVideo.style.left = `${offsetX}%`;
});

// 更新视频 Y 偏移
document.getElementById('video-offset-y').addEventListener('input', function () {
    const offsetY = this.value;
    document.getElementById('video-offset-y-value').textContent = offsetY;
    bgVideo.style.top = `${offsetY}%`;
});



// 更新目标颜色
document.getElementById('target-color').addEventListener('input', function () {
    const color = this.value;
    // 解析颜色值
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    targetColor = { r, g, b }; // 更新目标颜色变量
});

// 更新容差值
document.getElementById('tolerance').addEventListener('input', function () {
    const toleranceValue = this.value;
    document.getElementById('tolerance-value').textContent = toleranceValue;
    tolerance = parseInt(toleranceValue, 10); // 更新全局容差变量
});

// 更新 Canvas 宽度
document.getElementById('canvas-width').addEventListener('input', function () {
    const width = this.value;
    canvas.style.width = `${width}px`;
    document.getElementById('canvas-width-value').textContent = width;
});

// 更新 Canvas 高度
document.getElementById('canvas-height').addEventListener('input', function () {
    const height = this.value;
    canvas.style.height = `${height}px`;
    document.getElementById('canvas-height-value').textContent = height;
});

// 更新 Canvas X 偏移
document.getElementById('canvas-offset-x').addEventListener('input', function () {
    const offsetX = this.value;
    canvas.style.position = 'absolute'; // 确保 Canvas 的位置属性正确
    canvas.style.left = `${offsetX}px`;
    document.getElementById('canvas-offset-x-value').textContent = offsetX;
});

// 更新 Canvas Y 偏移
document.getElementById('canvas-offset-y').addEventListener('input', function () {
    const offsetY = this.value;
    canvas.style.position = 'absolute'; // 确保 Canvas 的位置属性正确
    canvas.style.top = `${offsetY}px`;
    document.getElementById('canvas-offset-y-value').textContent = offsetY;
});



// RGB 转换辅助函数
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// 处理视频帧
function processFrame() {
    if (use_canvas) {
        const ctx = canvas.getContext('2d');

        // 确保 canvas 的绘制尺寸与视频一致
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;

        if (videoWidth === 0 || videoHeight === 0) {
            // 如果视频未准备好，跳过这一帧
            requestAnimationFrame(processFrame);
            return;
        }

        canvas.width = videoWidth;
        canvas.height = videoHeight;

        // 将视频帧按照比例绘制到 canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 获取图像数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 遍历每个像素并应用色度键
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // 判断像素颜色是否在目标颜色的容忍范围内
            const isTargetColor =
                Math.abs(r - targetColor.r) < tolerance &&
                Math.abs(g - targetColor.g) < tolerance &&
                Math.abs(b - targetColor.b) < tolerance;

            if (isTargetColor) {
                // 如果是目标颜色，则透明化
                data[i + 3] = 0; // 设置透明度
            }
        }

        // 将修改后的图像数据放回 canvas
        ctx.putImageData(imageData, 0, 0);

        // 请求下一帧
        requestAnimationFrame(processFrame);
    }
}


function adjustCanvasSize() {
    const canvas = document.getElementById('canvas');
    const container = document.getElementById('canvas-container');

    // 获取容器的宽高
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // 获取视频的宽高比例
    const videoWidth = canvas.width;
    const videoHeight = canvas.height;

    const videoAspectRatio = videoWidth / videoHeight;

    // 保持 canvas 的内容比例，设置显示大小
    const containerAspectRatio = containerWidth / containerHeight;
    if (videoAspectRatio > containerAspectRatio) {
        // 如果视频更宽，以宽度为基准
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${containerWidth / videoAspectRatio}px`;
    } else {
        // 如果视频更高，以高度为基准
        canvas.style.width = `${containerHeight * videoAspectRatio}px`;
        canvas.style.height = `${containerHeight}px`;
    }
}



// 在窗口大小变化时调整 canvas 大小
window.addEventListener('resize', adjustCanvasSize);

// 初始化时调整一次
adjustCanvasSize();


