/**
 * Copyright FunASR (https://github.com/alibaba-damo-academy/FunASR). All Rights
 * Reserved. MIT License  (https://opensource.org/licenses/MIT)
 */
/* 2022-2023 by zhaoming,mali aihealthx.com */


// 连接; 定义socket连接类对象与语音对象
var wsconnecter2 = new WebSocketConnectMethod2({ msgHandle: getJsonMessage2, stateHandle: getConnState2 });
var audioBlob;
// 录音开始按钮标志位
let isRecording = false;
// ASR WS连接状态
let asrConnState = false;

// 录音; 定义录音对象,wav格式
var rec = Recorder({
	type: "pcm",
	bitRate: 16,
	sampleRate: 16000,
	onProcess: recProcess
});

var sampleBuf = new Int16Array();


btnConnect = document.getElementById('btnConnect');
btnConnect.onclick = connect_asr_ws;

var awsslink = document.getElementById('wsslink');

var rec_text = "";  // for online rec asr result
var offline_text = ""; // for offline rec asr result
var asr_type = "v1"; // 默认使用v1固定分片模式

// var upfile = document.getElementById('upfile');

var isfilemode = false;  // if it is in file mode
var file_ext = "";
var file_sample_rate = 16000; //for wav file sample rate
var file_data_array;  // array to save file data

var totalsend = 0;

// 设置ASR服务器地址
$("#asr_ws_url").val("ws://" + window.location.hostname + ":10096/");

$("#recordBtn").click(function () {
    isRecording = !isRecording;
    $("#recordBtn").text(isRecording ? '⏹️' : '🎤');
    // 这里添加实际的录音逻辑
    if (isRecording) {
		console.log("Starting recording...");
		start_rec();
		return;

        // 开始录音
        console.log("Starting recording...");
        fetch("/record", {
            body: JSON.stringify({
                type: "start_record",
            }),
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        })
            .then(function (response) {
                if (response.ok) {
                    console.log("Recording started.");
                    $("#btn_start_record").prop("disabled", true);
                    $("#btn_stop_record").prop("disabled", false);
                    // $('#btn_download').prop('disabled', true);
                } else {
                    console.error("Failed to start recording.");
                }
            })
            .catch(function (error) {
                console.error("Error:", error);
            });
    } else {
		console.log("Stopping recording...");
		stop_rec();
        // 停止录音
        // console.log("Stopping recording...");
        // fetch("/record", {
        //     body: JSON.stringify({
        //         type: "end_record",
        //     }),
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     method: "POST",
        // })
        //     .then(function (response) {
        //         if (response.ok) {
        //             console.log("Recording stopped.");
        //             $("#btn_start_record").prop("disabled", false);
        //             $("#btn_stop_record").prop("disabled", true);
        //             // $('#btn_download').prop('disabled', false);
        //         } else {
        //             console.error("Failed to stop recording.");
        //         }
        //     })
        //     .catch(function (error) {
        //         console.error("Error:", error);
        //     });
    }
});



// var now_ipaddress=window.location.href;
// now_ipaddress=now_ipaddress.replace("https://","wss://");
// now_ipaddress=now_ipaddress.replace("static/index.html","");
// var localport=window.location.port;
// now_ipaddress=now_ipaddress.replace(localport,"10095");
// document.getElementById('asr_ws_url').value=now_ipaddress;
addresschange();
function addresschange() {

	var Uri = document.getElementById('asr_ws_url').value;
	document.getElementById('info_wslink').innerHTML = "点此处手工授权（IOS手机）";
	Uri = Uri.replace(/wss/g, "https");
	console.log("addresschange uri=", Uri);

	awsslink.onclick = function () {
		window.open(Uri, '_blank');
	}
}


// from https://github.com/xiangyuecn/Recorder/tree/master
var readWavInfo = function (bytes) {
	//读取wav文件头，统一成44字节的头
	if (bytes.byteLength < 44) {
		return null;
	};
	var wavView = bytes;
	var eq = function (p, s) {
		for (var i = 0; i < s.length; i++) {
			if (wavView[p + i] != s.charCodeAt(i)) {
				return false;
			};
		};
		return true;
	};

	if (eq(0, "RIFF") && eq(8, "WAVEfmt ")) {

		var numCh = wavView[22];
		if (wavView[20] == 1 && (numCh == 1 || numCh == 2)) {//raw pcm 单或双声道
			var sampleRate = wavView[24] + (wavView[25] << 8) + (wavView[26] << 16) + (wavView[27] << 24);
			var bitRate = wavView[34] + (wavView[35] << 8);
			var heads = [wavView.subarray(0, 12)], headSize = 12;//head只保留必要的块
			//搜索data块的位置
			var dataPos = 0; // 44 或有更多块
			for (var i = 12, iL = wavView.length - 8; i < iL;) {
				if (wavView[i] == 100 && wavView[i + 1] == 97 && wavView[i + 2] == 116 && wavView[i + 3] == 97) {//eq(i,"data")
					heads.push(wavView.subarray(i, i + 8));
					headSize += 8;
					dataPos = i + 8; break;
				}
				var i0 = i;
				i += 4;
				i += 4 + wavView[i] + (wavView[i + 1] << 8) + (wavView[i + 2] << 16) + (wavView[i + 3] << 24);
				if (i0 == 12) {//fmt 
					heads.push(wavView.subarray(i0, i));
					headSize += i - i0;
				}
			}
			if (dataPos) {
				var wavHead = new Uint8Array(headSize);
				for (var i = 0, n = 0; i < heads.length; i++) {
					wavHead.set(heads[i], n); n += heads[i].length;
				}
				return {
					sampleRate: sampleRate
					, bitRate: bitRate
					, numChannels: numCh
					, wavHead44: wavHead
					, dataPos: dataPos
				};
			};
		};
	};
	return null;
};

// upfile.onclick = function () {
// 	// $("#btnConnect").text("连接ASR服务器");
// }

// upfile.onchange = function () {
// 	var len = this.files.length;
// 	for (let i = 0; i < len; i++) {

// 		let fileAudio = new FileReader();
// 		fileAudio.readAsArrayBuffer(this.files[i]);

// 		file_ext = this.files[i].name.split('.').pop().toLowerCase();
// 		var audioblob;
// 		fileAudio.onload = function () {
// 			audioblob = fileAudio.result;
// 			file_data_array = audioblob;
// 			showToast('info', '请点击连接进行识别');
// 		}

// 		fileAudio.onerror = function (e) {
// 			console.log('error' + e);
// 		}
// 	}
// 	// for wav file, we  get the sample rate
// 	if (file_ext == "wav")
// 		for (let i = 0; i < len; i++) {

// 			let fileAudio = new FileReader();
// 			fileAudio.readAsArrayBuffer(this.files[i]);
// 			fileAudio.onload = function () {
// 				audioblob = new Uint8Array(fileAudio.result);

// 				// for wav file, we can get the sample rate
// 				var info = readWavInfo(audioblob);
// 				console.log(info);
// 				file_sample_rate = info.sampleRate;
// 			}
// 		}
// }

function play_file() {
	var audioblob = new Blob([new Uint8Array(file_data_array)], { type: "audio/wav" });
	var audio_record = document.getElementById('audio_record');
	audio_record.src = (window.URL || webkitURL).createObjectURL(audioblob);
	audio_record.controls = true;
	//audio_record.play();  //not auto play
}

function start_file_send() {
	sampleBuf = new Uint8Array(file_data_array);

	var chunk_size = 960; // for asr chunk_size [5, 10, 5]

	while (sampleBuf.length >= chunk_size) {

		sendBuf = sampleBuf.slice(0, chunk_size);
		totalsend = totalsend + sampleBuf.length;
		sampleBuf = sampleBuf.slice(chunk_size, sampleBuf.length);
		wsconnecter2.wsSend(sendBuf);
	}

	stop_rec();
}


// function on_recoder_mode_change() {
// 	var item = null;
// 	var obj = document.getElementsByName("recoder_mode");
// 	for (var i = 0; i < obj.length; i++) { //遍历Radio 
// 		if (obj[i].checked) {
// 			item = obj[i].value;
// 			break;
// 		}
// 	}
// 	if (item == "mic") {
// 		document.getElementById("mic_mode_div").style.display = 'block';
// 		document.getElementById("rec_mode_div").style.display = 'none';

// 		$("#btnConnect").text("断开ASR连接");
// 		isfilemode = false;
// 	}
// 	else {
// 		document.getElementById("mic_mode_div").style.display = 'none';
// 		document.getElementById("rec_mode_div").style.display = 'block';

// 		$("#btnConnect").text("连接ASR服务器");
// 		isfilemode = true;
// 		showToast('info', '请点击选择文件');
// 	}
// }


// function getHotwords() {
// 	var obj = document.getElementById("varHot");

// 	if (typeof (obj) == 'undefined' || obj == null || obj.value.length <= 0) {
// 		return null;
// 	}
// 	let val = obj.value.toString();

// 	console.log("hotwords=" + val);
// 	let items = val.split(/[(\r\n)\r\n]+/);  //split by \r\n
// 	var jsonresult = {};
// 	const regexNum = /^[0-9]*$/; // test number
// 	for (item of items) {

// 		let result = item.split(" ");
// 		if (result.length >= 2 && regexNum.test(result[result.length - 1])) {
// 			var wordstr = "";
// 			for (var i = 0; i < result.length - 1; i++)
// 				wordstr = wordstr + result[i] + " ";

// 			jsonresult[wordstr.trim()] = parseInt(result[result.length - 1]);
// 		}
// 	}
// 	console.log("jsonresult=" + JSON.stringify(jsonresult));
// 	return JSON.stringify(jsonresult);

// }

// function getAsrMode() {
// 	var item = null;
// 	var obj = document.getElementsByName("asr_mode");
// 	for (var i = 0; i < obj.length; i++) { //遍历Radio 
// 		if (obj[i].checked) {
// 			item = obj[i].value;
// 			break;
// 		}
// 	}
// 	if (isfilemode) {
// 		item = "offline";
// 	}
// 	console.log("asr mode" + item);

// 	return item;
// }



function handleWithTimestamp(tmptext, tmptime) {
	// console.log("tmptext: " + tmptext);
	// console.log("tmptime: " + tmptime);
	if (tmptime == null || tmptime == "undefined" || tmptext.length <= 0) {
		return tmptext;
	}
	tmptext = tmptext.replace(/。|？|，|、|\?|\.|\ /g, ","); // in case there are a lot of "。"
	var words = tmptext.split(",");  // split to chinese sentence or english words
	var jsontime = JSON.parse(tmptime); //JSON.parse(tmptime.replace(/\]\]\[\[/g, "],[")); // in case there are a lot segments by VAD
	var char_index = 0; // index for timestamp
	var text_withtime = "";
	for (var i = 0; i < words.length; i++) {
		if (words[i] == "undefined" || words[i].length <= 0) {
			continue;
		}
		console.log("words===", words[i]);
		console.log("words: " + words[i] + ",time=" + jsontime[char_index][0] / 1000);
		if (/^[a-zA-Z]+$/.test(words[i])) {   // if it is english
			text_withtime = text_withtime + jsontime[char_index][0] / 1000 + ":" + words[i] + "\n";
			char_index = char_index + 1;  //for english, timestamp unit is about a word
		}
		else {
			// if it is chinese
			text_withtime = text_withtime + jsontime[char_index][0] / 1000 + ":" + words[i] + "\n";
			char_index = char_index + words[i].length; //for chinese, timestamp unit is about a char
		}
	}
	return text_withtime;
}

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
async function is_speaking() {
	const response = await fetch('/is_speaking', {
		body: JSON.stringify({
			sessionid: 0,
		}),
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'POST'
	});
	const data = await response.json();
	// console.log('is_speaking res:', data)
	return data.data
}

async function waitSpeakingEnd() {
	rec.stop(); //关闭录音
	for (let i = 0; i < 10; i++) {  //等待数字人开始讲话，最长等待10s
		bspeak = await is_speaking()
		if (bspeak) {
			break
		}
		await sleep(1000)
	}

	while (true) {  //等待数字人讲话结束
		bspeak = await is_speaking()
		if (!bspeak) {
			break
		}
		await sleep(1000)
	}
	await sleep(2000)
	rec.start()
}

// 语音识别结果; 对jsonMsg数据解析,将识别结果附加到编辑框中
function getJsonMessage2(jsonMsg) {
	//console.log(jsonMsg);
	// console.log("message: " + JSON.parse(jsonMsg.data)['text']);
	var rectxt = "" + JSON.parse(jsonMsg.data)['text'];
	var asrmodel = JSON.parse(jsonMsg.data)['mode'];
	var is_final = JSON.parse(jsonMsg.data)['is_final'];
	var timestamp = JSON.parse(jsonMsg.data)['timestamp'];
	var rec_text = "";
	
	if (asrmodel == "2pass-offline" || asrmodel == "offline") {
		if (rectxt != "" && rectxt != null) {
			// 过滤特殊字符
			rectxt = rectxt.replace(/<[^>]*>/g, '');

			addMessage(rectxt, "user");

			offline_text = offline_text + rectxt.replace(/ +/g, "") + '\n'; //handleWithTimestamp(rectxt,timestamp); //rectxt; //.replace(/ +/g,"");
			rec_text = offline_text;
			fetch('/human', {
				body: JSON.stringify({
					text: rectxt.replace(/ +/g, ""),
					type: 'chat',
				}),
				headers: {
					'Content-Type': 'application/json'
				},
				method: 'POST'
			});

			waitSpeakingEnd();
		}
	} else {
		rec_text = rec_text + rectxt; //.replace(/ +/g,"");
	}

	// 过滤特殊字符
	rec_text = rec_text.replace(/<[^>]*>/g, '');

	var varArea = document.getElementById('varArea');
	varArea.value = rec_text;

	// console.log("offline_text: " + asrmodel + "," + offline_text);
	// console.log("rec_text: " + rec_text);
	if (isfilemode == true && is_final == true) {
		console.log("call stop_rec ws!");
		play_file();
		wsconnecter2.wsStop();

		showToast('info', 'ASR连接已断开');

		$("#btnConnect").text("连接ASR服务器");
	}
}

// 连接状态响应
function getConnState2(connState) {
	if (connState === 0) { //on open
		showToast('success', '连接成功!请点击开始');
		if (isfilemode == true) {
			showToast('info', '请耐心等待,大文件等待时间更长');
			start_file_send();
		}
		else {
			$("#btnConnect").text("断开ASR连接");

			asrConnState = true;
		}
	} else if (connState === 1) {
		//stop_rec();
	} else if (connState === 2) {
		
		console.log('connecttion error');

		showToast('error', "连接地址" + document.getElementById('asr_ws_url').value + "失败,请检查asr地址和端口。或试试界面上手动授权，再连接。");

		$("#btnConnect").text("连接ASR服务器");
		asrConnState = false;

		stop_rec();
	}
}

function start_rec() {
	if (asrConnState == false) {
	    // showToast('info', '请先连接asr服务器');
		connect_asr_ws();
	}

	rec.open(function () {
		rec.start();
		console.log("开始");
		isRec = true;
	});
}

// 识别启动、停止、清空操作
function connect_asr_ws() {
	if (asrConnState == false) {
		// 清除显示
		clear_rec();
		//控件状态更新
		console.log("isfilemode" + isfilemode);

		//启动连接
		var ret = wsconnecter2.wsStart();
		// 1 is ok, 0 is error
		if (ret == 1) {
			showToast('info', '正在连接asr服务器，请等待...');
			isRec = true;
			asrConnState = true;
			$("#btnConnect").text("断开ASR连接");

			return 1;
		} else {
			showToast('info', '请点击开始');
			asrConnState = false;
			$("#btnConnect").text("连接ASR服务器");

			return 0;
		}
	} else {
	    console.log("call stop_rec ws!");
		wsconnecter2.wsStop();
		$("#btnConnect").text("连接ASR服务器");
		showToast('success', 'ASR连接已断开');
		asrConnState = false;
	}
}


function stop_rec() {
	// 控件状态更新
	isRec = false;
	showToast('info', '发送完数据,请等候,正在识别...');

	if (isfilemode == false) {
		rec.stop(function (blob, duration) {
			console.log(blob);
			var audioBlob = Recorder.pcm2wav(data = { sampleRate: 16000, bitRate: 16, blob: blob },
				function (theblob, duration) {
					console.log(theblob);
					var audio_record = document.getElementById('audio_record');
					audio_record.src = (window.URL || webkitURL).createObjectURL(theblob);
					audio_record.controls = true;
					//audio_record.play(); 
				}, function (msg) {
					console.log(msg);
				}
			);

			var chunk_size = new Array(5, 10, 5);
			var request = {
				"chunk_size": chunk_size,
				"wav_name": "h5",
				"is_speaking": false,
				"chunk_interval": 10,
				"mode": "2pass",
				"url": document.getElementById('audio_record').src,
			};
			console.log(request);
			if (sampleBuf.length > 0) {
				wsconnecter2.wsSend(sampleBuf);
				console.log("sampleBuf.length" + sampleBuf.length);
				sampleBuf = new Int16Array();
			}
			wsconnecter2.wsSend(JSON.stringify(request));
		}, function (errMsg) {
			console.log("errMsg: " + errMsg);
		}, true);
	}

	// 断开ws连接
	wsconnecter2.wsStop();
	$("#btnConnect").text("连接ASR服务器");
	showToast('success', 'ASR连接已断开');
	asrConnState = false;
}

function clear_rec() {
	var varArea = document.getElementById('varArea');

	varArea.value = "";
	rec_text = "";
	offline_text = "";
}

// 添加音频参数配置处理
const energyThresholdInput = document.getElementById('energy-threshold');
const energyThresholdValue = document.getElementById('energy-threshold-value');
const silenceDurationInput = document.getElementById('silence-duration');
const silenceDurationValue = document.getElementById('silence-duration-value');
const chunkSizeInput = document.getElementById('chunk-size');
const chunkSizeValue = document.getElementById('chunk-size-value');

// 更新显示值
energyThresholdInput.addEventListener('input', function() {
    energyThresholdValue.textContent = this.value;
});

silenceDurationInput.addEventListener('input', function() {
    silenceDurationValue.textContent = this.value;
});

chunkSizeInput.addEventListener('input', function() {
    chunkSizeValue.textContent = this.value;
});

// 设置分页切换功能
function showSettingPage(pageId) {
    // 隐藏所有设置页
    document.querySelectorAll('.setting-page').forEach(page => {
        page.classList.remove('active');
    });
    // 取消所有导航按钮的激活状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 显示选中的设置页
    document.getElementById(pageId).classList.add('active');
    // 激活对应的导航按钮
    event.target.classList.add('active');
}

// ASR类型选择处理
const asrTypeInputs = document.querySelectorAll('input[name="asr_type"]');
asrTypeInputs.forEach(input => {
    input.addEventListener('change', function() {
        asr_type = this.value;
        // 根据ASR类型显示/隐藏相关设置
        const chunkSizeItem = document.querySelector('#chunk-size').closest('.setting-item');
        const energyItem = document.querySelector('#energy-threshold').closest('.setting-item');
        const silenceItem = document.querySelector('#silence-duration').closest('.setting-item');
        
        if(asr_type === 'v1') {
            chunkSizeItem.style.display = 'none';
            energyItem.style.display = 'none';
            silenceItem.style.display = 'none';
        } else {
            chunkSizeItem.style.display = 'block';
            energyItem.style.display = 'block';
            silenceItem.style.display = 'block';
        }
    });
});

function recProcess(buffer, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) {
    if (isRec === true) {
        var data_48k = buffer[buffer.length - 1];
        var array_48k = new Array(data_48k);
        var data_16k = Recorder.SampleData(array_48k, bufferSampleRate, 16000).data;

        sampleBuf = Int16Array.from([...sampleBuf, ...data_16k]);
        
        if (asr_type == "v1") {
            var chunk_size = 960; // 转换秒到采样点数 for asr chunk_size [5, 10, 5]

            while (sampleBuf.length >= chunk_size) {
                sendBuf = sampleBuf.slice(0, chunk_size);
                sampleBuf = sampleBuf.slice(chunk_size, sampleBuf.length);
                wsconnecter2.wsSend(sendBuf);
            }
        } else if (asr_type == "v2") {
            // 从UI获取当前配置值
            var CHUNK_SIZE = parseInt(Math.floor(parseFloat(chunkSizeInput.value) * 16000)); // 转换秒到采样点数
            var ENERGY_THRESHOLD = parseFloat(energyThresholdInput.value);
            var SILENCE_DURATION = parseInt(Math.floor(parseFloat(silenceDurationInput.value) * 16000));
            

			console.log("CHUNK_SIZE: " + CHUNK_SIZE + " ENERGY_THRESHOLD: " + ENERGY_THRESHOLD + " SILENCE_DURATION: " + SILENCE_DURATION);

            // 当缓冲区达到足够大小时进行处理
            if (sampleBuf.length >= CHUNK_SIZE) {
                // 计算音频能量
                let energy = 0;
                var startIdx = Math.max(0, sampleBuf.length - SILENCE_DURATION);
                for (let i = startIdx; i < sampleBuf.length; i++) {
                    energy += Math.abs(sampleBuf[i]);
                }
                energy = energy / (sampleBuf.length - startIdx);
                
                // 如果能量低于阈值，说明可能是一段语音的结束
                if (energy < ENERGY_THRESHOLD) {
                    // 发送整个缓冲区数据
                    wsconnecter2.wsSend(sampleBuf);
                    sampleBuf = new Int16Array();
                } else if (sampleBuf.length >= CHUNK_SIZE * 1.5) {
                    // 如果缓冲区过大，强制发送前面的数据
                    const sendBuf = sampleBuf.slice(0, CHUNK_SIZE);
                    sampleBuf = sampleBuf.slice(CHUNK_SIZE);
                    wsconnecter2.wsSend(sendBuf);
                }
            }
        }
    }
}

// function getUseITN() {
// 	var obj = document.getElementsByName("use_itn");
// 	for (var i = 0; i < obj.length; i++) {
// 		if (obj[i].checked) {
// 			return obj[i].value === "true";
// 		}
// 	}
// 	return false;
// }
