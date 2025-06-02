// 封装的显示消息框函数
function showToast(type, message, duration = 3000) {
    const toastContainer = document.getElementById("toast-container");

    // 创建新的 toast 元素
    const toast = document.createElement("div");
    toast.classList.add("toast", `toast-${type}`);

    // 创建消息文本
    const messageText = document.createElement("span");
    messageText.textContent = message;

    // 创建关闭按钮
    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.background = "transparent";
    closeButton.style.border = "none";
    closeButton.style.color = "white";
    closeButton.style.fontSize = "20px";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = () => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 500); // 等待动画完成后删除
    };

    // 将文本和按钮添加到 toast
    toast.appendChild(messageText);
    toast.appendChild(closeButton);

    // 将 toast 添加到容器
    toastContainer.appendChild(toast);

    // 设置定时器，自动隐藏消息框
    setTimeout(() => {
        toast.classList.add("hide");
        setTimeout(() => toast.remove(), 500); // 删除元素
    }, duration);
}
