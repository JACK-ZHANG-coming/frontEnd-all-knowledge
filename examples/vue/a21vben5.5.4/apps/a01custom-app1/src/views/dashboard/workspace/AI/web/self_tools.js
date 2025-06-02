class Queue {
    constructor() {
        this.count = 0;	//{1}
        this.lowestCount = 0;	//{2}
        this.items = {};	//{3}
    }

    enqueue(element) {
        this.items[this.count] = element;
        this.count++;
    }

    isEmpty() {
        return this.count - this.lowestCount === 0;
    }

    size() {
        return this.count - this.lowestCount;
    }

    dequeue() {
        if (this.isEmpty()) {
            return undefined;
        }
        const result = this.items[this.lowestCount]; //{1}
        delete this.items[this.lowestCount]; //{2}
        this.lowestCount++; //{3}
        return result; //{4}
    }

    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.lowestCount];
    }

    clear() {
        this.count = 0;	//{1}
        this.lowestCount = 0;	//{2}
        this.items = {};	//{3}
    }

    toString() {
        if (this.isEmpty()) {
            return '';
        }
        let objString = `${this.items[this.lowestCount]}`;
        for (let i = this.lowestCount + 1; i < this.count; i++) {
            objString += `${objString},${this.items[i]}`;
        }
        return objString;
    }
}


//初始化变量 时 分 秒
var audio_show_hour = audio_show_minute = audio_show_second = 0;//时 分 秒
var milliaudio_show_second = 0;//毫秒
var audio_show_int;
var audio_show_key = '';


//重置函数
function audio_show_reset() {
    if (audio_show_int) {
        window.clearInterval(audio_show_int);
    }

    milliaudio_show_second = audio_show_hour = audio_show_minute = audio_show_second = 0;
    show_time('');
}

//开始函数
function audio_show_start() {
    audio_show_int = setInterval(audio_show_timer, 100);//每隔50毫秒执行一次audio_show_timer函数
}


//计时函数
function audio_show_timer(id) {
    milliaudio_show_second = milliaudio_show_second + 50;
    if (milliaudio_show_second >= 1000) {
        milliaudio_show_second = 0;
        audio_show_second = audio_show_second + 1;
    }
    if (audio_show_second >= 60) {
        audio_show_second = 0;
        audio_show_minute = audio_show_minute + 1;
    }

    if (audio_show_minute >= 60) {
        audio_show_minute = 0;
        audio_show_hour = audio_show_hour + 1;
    }

    show_time(audio_show_key + audio_show_minute + '\'' + audio_show_second + '\'' + milliaudio_show_second);
    if (!is_sound_playing && audio_show_key == '回复中:') {
        audio_show_reset();
    }

}

//暂停函数
function audio_show_stop() {
    window.clearInterval(audio_show_int);
}


function Html_$T(str) { return str; }
function Html_xT(str) { return str; }


function reclog(show_msg, color, id = '', flag = '') {
    var now = new Date();
    var time_offset = ("0" + now.getHours()).substr(-2)
        + ":" + ("0" + now.getMinutes()).substr(-2)
        + ":" + ("0" + now.getSeconds()).substr(-2);
    var div = document.createElement("div");
    var elem = document.querySelector(".reclog");
    elem.insertBefore(div, elem.firstChild);

    //拼接字符串
    if (id != '') {
        var tmp_div = document.getElementById(id);
        if (tmp_div) {
            tmp_div.innerHTML = tmp_div.innerHTML + show_msg;
            return;
        }
    }

    //只保留最近20个
    if (elem.length > 20) {
        elem.removeChild(elem.lastElementChild);
    }

    //增加个id属性，后面使用
    var id_tmp = '';
    if (id != '') {
        id_tmp = ' id="' + id + '"';
    }

    if (flag == 'ask') {
        show_msg = '我的提问：' + show_msg;
    }
    else if (flag == 'answer') {
        show_msg = 'AI回复：' + show_msg;
    }

    div.innerHTML = '<div ' + id_tmp + ' style="font-size:11px"><span style="color:' + (!color ? "" : color == 1 ? "red" : color == 2 ? "#0b1" : color) + '">[' + time_offset + ']</span>' + show_msg + '</div>';
}

//获取音频和录音
function getUserMedia(videoEnable, audioEnable, func) {

    //初始化 navigator.getUserMedia
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia || navigator.msGetUserMedia || window.getUserMedia;

    if (videoEnable) {

        if (typeof (this_vedio_back) != 'undefined' && !this_vedio_back) {
            var constraints = {
                video: { facingMode: "user" },
                audio: audioEnable
            }
        } else {
            var constraints = {
                video: { facingMode: { exact: "environment" } },
                audio: audioEnable
            }
        }

    } else {
        var constraints = {
            video: videoEnable,
            audio: audioEnable
        };
    }
    console.log(constraints);

    //优先使用设备
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            func(false, stream);
        })['catch'](function (err) {
            func(err);
        });
    }

    //浏览器
    else if (navigator.getUserMedia) {
        navigator.getUserMedia(constraints, function (stream) {
            func(false, stream);
        }, function (err) {
            func(err);
        });
    }

    //未找到设备
    else {
        func(new Error('Not support userMedia'));
    }
}

function formatTime(str) {
    if(str != ''){
        return str;
    }

    const now = new Date(); // 获取当前时间
    const hours = now.getHours(); // 获取小时
    const minutes = now.getMinutes(); // 获取分钟
    const seconds = now.getSeconds(); // 获取秒

    // 添加前导零，如果数字小于10
    // const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');
    // const paddedSeconds = seconds.toString().padStart(2, '0');

    // 确定上午或下午
    const period = hours >= 12 ? 'PM' : 'AM';

    // 如果是下午，且小时数不是12，就减去12
    const displayHours = hours % 12;
    const displayTime = `${displayHours === 0 ? 12 : displayHours}:${paddedMinutes} ${period}`;

    return displayTime;
}


function getRandomInt(min, max) {
    min = Math.ceil(min); // 确保min是整数
    max = Math.floor(max); // 确保max是整数
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


// 使用AJAX上传FormData// 设置请求头信息，告诉服务器这是JSON数据// 你的PHP后台处理文件
function commonPost(c, m, q, cb) {
    let i = getPermanentCookie('digit_mirror_face_id');
    if (i == null || i == '') {
        return;
    }

    var data = {
        "c": c,
        "m": m,
        "q": JSON.stringify(q),
        "i": getPermanentCookie('digit_mirror_face_id'),
        "s": getPermanentCookie('digit_mirror_sign')
    };

    $.ajax({
        url: '/digit_mirror/api',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (data) {
            var json = JSON.parse(data);
            if (json.result != 'success') {
                showMessage(json.message);
            } else {
                cb(json)
            }
        },
        error: function (error) {
            showMessage("请求失败，请稍后重试！");
        }
    });
}

function showMessage(msg) {
    var model = 'commonModel';
    var title = '操作结果';
    var html = '<div style="text-align: center; padding:20px"><h6 style="margin-bottom:20px"> ' + msg + '</h6> </div> ';
    show_model(model, title, html);
}

/**
* 关闭媒体流
* @param stream {MediaStream} - 需要关闭的流
*/
function closeStream(stream) {
    if (typeof stream.stop === 'function') {
        stream.stop();
        return;
    }

    //关闭音频流和视频流
    var trackList = [stream.getAudioTracks(), stream.getVideoTracks()];
    for (var i = 0; i < trackList.length; i++) {
        var tracks = trackList[i];
        if (tracks && tracks.length > 0) {
            for (var j = 0; j < tracks.length; j++) {
                if (typeof tracks[j].stop === 'function') {
                    tracks[j].stop();
                }
            }
        }
    }
}

function show_model(model, title, html = '') {
    $('#' + model).modal({
        backdrop: 'static', // 阻止背景点击关闭模态框
        keyboard: false      // 阻止键盘Esc键关闭模态框
    });
    $('#' + model).modal('show');
    $('#' + model + '_title').html(title);

    if (html != '') {
        $('#' + model + '_body').html(html);
    }

    return;
}

function setPermanentCookie(name, value) {
    var d = new Date();
    d.setTime(d.getTime() + (10 * 365 * 24 * 60 * 60 * 1000)); // 设置过期时间为100年
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getPermanentCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    // 对于指定域名的cookie
    // document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.yourdomain.com; path=/';
}

function fullscreenEnabled() {
    return (
        document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement
    );
}

function fullscreen(element) {
    if (document.mozFullScreenEnabled) {
        return alert("全屏模式被禁用");
    }
    let result = null;
    if (element.requestFullscreen) {
        result = element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        result = element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        result = element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        result = element.webkitRequestFullScreen();
    }
    return result || alert("不支持全屏");
}

function cancelFullscreen() {
    if (document.exitFullscreen) { // 标准写法
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox 浏览器
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome 和 Safari
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE11
        document.msExitFullscreen();
    }
}

// 生成UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
