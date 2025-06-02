// 日志处理相关函数
let logs = [];
const MAX_LOGS = 1000;

function addLog(message, type = 'info') {
    const now = new Date().toLocaleTimeString();
    const logEntry = `[${now}] [${type}] ${message}`;
    // 在数组开头添加新日志
    logs.unshift(logEntry);
    
    // 保持最新的1000条日志
    if (logs.length > MAX_LOGS) {
        logs = logs.slice(0, MAX_LOGS);
    }
    
    // 更新显示
    const logContent = document.getElementById('log-content');
    logContent.textContent = logs.join('\n');
    // 滚动到顶部
    // logContent.scrollTop = 0;
}

function clearLogs() {
    logs = [];
    document.getElementById('log-content').textContent = '';
}

var pc = null;

function negotiate() {
    addLog('开始协商连接...');
    pc.addTransceiver('video', { direction: 'recvonly' });
    pc.addTransceiver('audio', { direction: 'recvonly' });
    return pc.createOffer().then((offer) => {
        return pc.setLocalDescription(offer);
    }).then(() => {
        // wait for ICE gathering to complete
        return new Promise((resolve) => {
            if (pc.iceGatheringState === 'complete') {
                resolve();
            } else {
                const checkState = () => {
                    if (pc.iceGatheringState === 'complete') {
                        pc.removeEventListener('icegatheringstatechange', checkState);
                        resolve();
                    }
                };
                pc.addEventListener('icegatheringstatechange', checkState);
            }
        });
    }).then(() => {
        addLog('发送连接请求...');
        var offer = pc.localDescription;
        return fetch('/offer', {
            body: JSON.stringify({
                sdp: offer.sdp,
                type: offer.type,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });
    }).then((response) => {
        return response.json();
    }).then((answer) => {
        document.getElementById('sessionid').value = answer.sessionid;
        addLog(`连接成功，会话ID: ${answer.sessionid}`);
        return pc.setRemoteDescription(answer);
    }).catch((e) => {
        addLog(`连接错误: ${e}`, 'error');
        alert('连接错误(可能已达到最大连接数，请查看后端日志排查): ' + e);
        // 恢复按钮状态
        document.getElementById('start').style.display = 'block';
        document.getElementById('stop').style.display = 'none';
    });
}

function start() {
    addLog('正在启动服务...');
    var config = {
        sdpSemantics: 'unified-plan'
    };

    if (document.getElementById('use-stun').checked) {
        config.iceServers = [{ urls: ['stun:stun.l.google.com:19302'] }];
        addLog('使用STUN服务器');
    }

    pc = new RTCPeerConnection(config);

    // connect audio / video
    pc.addEventListener('track', (evt) => {
        if (evt.track.kind == 'video') {
            document.getElementById('video').srcObject = evt.streams[0];
            addLog('视频流已连接');
        } else {
            document.getElementById('audio').srcObject = evt.streams[0];
            addLog('音频流已连接');
        }
    });

    pc.addEventListener('connectionstatechange', () => {
        addLog(`连接状态变更: ${pc.connectionState}`);
        // 在连接失败时恢复按钮状态
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
            document.getElementById('start').style.display = 'block';
            document.getElementById('stop').style.display = 'none';
        }
    });

    document.getElementById('start').style.display = 'none';
    negotiate();
    document.getElementById('stop').style.display = 'block';
}

function stop() {
    addLog('正在停止服务...');
    document.getElementById('stop').style.display = 'none';
    document.getElementById('start').style.display = 'block';

    // close peer connection
    pc.close();
    addLog('服务已停止');
}

$(document).ready(function () {
    addLog('系统初始化...');
    // 修改video的高度为屏幕高度
    $('#video').css('height', window.innerHeight - 100);

    // 定时获取队列大小
    function updateQueueSize() {
        fetch('/get_tts_msg_queue_size', {
            body: JSON.stringify({
                sessionid: parseInt(document.getElementById('sessionid').value),
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                if (data.code === 0) {
                    $('#queue-size').text(data.data);
                }
            })
            .catch(error => {
                console.error('获取队列大小出错:', error);
                addLog(`获取队列大小失败: ${error}`, 'error');
            });
    }

    // 每秒更新一次队列大小
    setInterval(updateQueueSize, 1000);

    // 更新系统资源信息
    function updateSysInfo() {
        fetch('/get_sys_info', {
            body: JSON.stringify({
                sessionid: parseInt(document.getElementById('sessionid').value),
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.code === 0) {
                const info = data.data;
                // 更新CPU使用率
                const cpuBar = $('#cpu-progress');
                cpuBar.css('width', info.cpu_percent + '%');
                cpuBar.text(info.cpu_percent.toFixed(1) + '%');
                if (info.cpu_percent > 80) {
                    cpuBar.addClass('bg-danger').removeClass('bg-success');
                } else {
                    cpuBar.addClass('bg-success').removeClass('bg-danger');
                }
                
                // 更新内存使用率
                const memBar = $('#memory-progress');
                memBar.css('width', info.memory_info.percent + '%');
                memBar.text(info.memory_info.percent.toFixed(1) + '%');
                if (info.memory_info.percent > 80) {
                    memBar.addClass('bg-danger').removeClass('bg-success');
                } else {
                    memBar.addClass('bg-success').removeClass('bg-danger');
                }
                
                // 更新GPU信息
                if (info.gpu_info) {
                    // GPU使用率
                    const gpuBar = $('#gpu-progress');
                    gpuBar.css('width', info.gpu_info.gpu_usage + '%');
                    gpuBar.text(info.gpu_info.gpu_usage.toFixed(1) + '%');
                    if (info.gpu_info.gpu_usage > 80) {
                        gpuBar.addClass('bg-danger').removeClass('bg-success');
                    } else {
                        gpuBar.addClass('bg-success').removeClass('bg-danger');
                    }
                    
                    // 显存使用率
                    const gpuMemBar = $('#gpu-memory-progress');
                    gpuMemBar.css('width', info.gpu_info.memory_usage + '%');
                    gpuMemBar.text(info.gpu_info.memory_usage.toFixed(1) + '%');
                    if (info.gpu_info.memory_usage > 80) {
                        gpuMemBar.addClass('bg-danger').removeClass('bg-success');
                    } else {
                        gpuMemBar.addClass('bg-success').removeClass('bg-danger');
                    }
                } else {
                    // 如果没有GPU信息，显示N/A
                    $('#gpu-progress').css('width', '100%').text('N/A').addClass('bg-secondary');
                    $('#gpu-memory-progress').css('width', '100%').text('N/A').addClass('bg-secondary');
                }
            }
        })
        .catch(error => {
            console.error('获取系统信息出错:', error);
            addLog(`获取系统信息失败: ${error}`, 'error');
        });
    }

    updateSysInfo();
    // 每5秒更新一次系统资源信息
    setInterval(updateSysInfo, 5000);

    // 发送消息的函数
    function sendMessage(interrupt) {
        var message = $('#message').val();
        if (!message.trim()) {
            addLog('消息内容不能为空', 'warning');
            return;
        }
        
        addLog(`发送${interrupt ? '打断' : '追加'}消息: ${message}`);
        console.log('Sending: ' + message);
        console.log('sessionid: ', document.getElementById('sessionid').value);
        fetch('/human', {
            body: JSON.stringify({
                text: message,
                type: 'echo',
                interrupt: interrupt,
                sessionid: parseInt(document.getElementById('sessionid').value),
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        }).then(response => {
            if (!response.ok) {
                throw new Error('发送失败');
            }
            addLog('消息发送成功');
        }).catch(error => {
            addLog(`消息发送失败: ${error}`, 'error');
        });
        $('#message').val('');
    }

    // 打断复述按钮点击事件
    $('#btn-interrupt').on('click', function() {
        sendMessage(true);
    });

    // 追加复述按钮点击事件
    $('#btn-no-interrupt').on('click', function() {
        sendMessage(false);
    });

    addLog('系统就绪');
});