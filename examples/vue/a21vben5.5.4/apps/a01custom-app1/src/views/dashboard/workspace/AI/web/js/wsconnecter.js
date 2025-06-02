/**
 * Copyright FunASR (https://github.com/alibaba-damo-academy/FunASR). All Rights
 * Reserved. MIT License  (https://opensource.org/licenses/MIT)
 */
/* 2021-2023 by zhaoming,mali aihealthx.com */

// 提供给内部WS使用
function WebSocketConnectMethod1(config) { //定义socket连接方法类
	var myWS;
	var connKeeperID;
	this.sessionid = -1;

	var msgHandle = config.msgHandle;
	var stateHandle = config.stateHandle;
	var wss_url = config.wss_url;

	this.wsStart = function (sessionid) {
		this.sessionid = sessionid;
		var Uri = wss_url; //"wss://111.205.137.58:5821/wss/" //设置wss asr online接口地址 如 wss://X.X.X.X:port/wss/
		if (Uri.match(/wss:\S*|ws:\S*/)) {
			console.log("Uri" + Uri);
		}
		else {
			// alert("请检查wss地址正确性");
			showToast('error', "请检查内部WS地址正确性");
			return 0;
		}

		if ('WebSocket' in window) {
			myWS = new WebSocket(Uri ); // 定义socket连接对象
			myWS.onopen = function (e) { onOpen(e); }; // 定义响应函数
			myWS.onclose = function (e) {
				console.log("onclose ws!");
				//myWS.close();
				onClose(e);
			};
			myWS.onmessage = function (e) { onMessage(e); };
			myWS.onerror = function (e) { onError(e); };
			return 1;
		}
		else {
			alert('当前浏览器不支持 WebSocket');
			return 0;
		}
	};

	// 定义停止与发送函数
	this.wsStop = function () {
		if (myWS != undefined) {
			console.log("stop ws!");
			myWS.close();
		}
	};

	this.wsSend = function (oneData) {
		if (myWS == undefined) return;
		if (myWS.readyState === 1) { // 0:CONNECTING, 1:OPEN, 2:CLOSING, 3:CLOSED

			myWS.send(oneData);
		}
	};

	// SOCEKT连接中的消息与状态响应
	function onOpen(e) {
		console.log("内部WS连接成功");
		showToast('success', "内部WS连接成功");

		// 发送初始数据sessionid
		var data = {
			// 这里的sessionid变成DOM了...
			"sessionid": this.sessionid.value
		}
		myWS.send(JSON.stringify(data));

		stateHandle(0);
	}

	function onClose(e) {
		stateHandle(1);
	}

	function onMessage(e) {

		msgHandle(e);
	}

	function onError(e) {
		showToast('error', "内部WS服务连接错误，详细见控制台");
		console.log(e);
		stateHandle(2);
	}

}

// 提供给ASR使用
function WebSocketConnectMethod2(config) { //定义socket连接方法类
	var myWS;
	var connKeeperID;

	var msgHandle = config.msgHandle;
	var stateHandle = config.stateHandle;

	this.wsStart = function () {
		var Uri = document.getElementById('asr_ws_url').value; //"wss://111.205.137.58:5821/wss/" //设置wss asr online接口地址 如 wss://X.X.X.X:port/wss/
		if (Uri.match(/wss:\S*|ws:\S*/)) {
			console.log("Uri" + Uri);
		}
		else {
			// alert("请检查wss地址正确性");
			showToast('error', "请检查ASR wss地址正确性");
			return 0;
		}

		if ('WebSocket' in window) {
			myWS = new WebSocket(Uri); // 定义socket连接对象
			myWS.onopen = function (e) { onOpen(e); }; // 定义响应函数
			myWS.onclose = function (e) {
				console.log("onclose ws!");
				//myWS.close();
				onClose(e);
			};
			myWS.onmessage = function (e) { onMessage(e); };
			myWS.onerror = function (e) { onError(e); };
			return 1;
		}
		else {
			// alert('当前浏览器不支持 WebSocket');
			showToast('error', "当前浏览器不支持 WebSocket");
			return 0;
		}
	};

	// 定义停止与发送函数
	this.wsStop = function () {
		if (myWS != undefined) {
			console.log("stop ws!");
			myWS.close();
		}
	};

	this.wsSend = function (oneData) {

		if (myWS == undefined) return;
		if (myWS.readyState === 1) { // 0:CONNECTING, 1:OPEN, 2:CLOSING, 3:CLOSED
			myWS.send(oneData);
		}
	};

	// SOCEKT连接中的消息与状态响应
	function onOpen(e) {
		// 发送json chunk_size会影响ASR切分的粒度
		var chunk_size = new Array(5, 10, 5);
		var request = {
			"chunk_size": chunk_size,
			"wav_name": "h5",
			"is_speaking": true,
			"chunk_interval": 10,
			// "itn": getUseITN(),
			"itn": false,
			// "mode": getAsrMode(),
			"mode": "2pass",
		};
		if (isfilemode) {
			request.wav_format = file_ext;
			if (file_ext == "wav") {
				request.wav_format = "PCM";
				request.audio_fs = file_sample_rate;
			}
		}

		// var hotwords = getHotwords();

		// if (hotwords != null) {
		// 	request.hotwords = hotwords;
		// }
		console.log(JSON.stringify(request));
		myWS.send(JSON.stringify(request));
		console.log("连接成功");
		stateHandle(0);
		showToast('success', "连接ASR服务成功");
	}

	function onClose(e) {
		stateHandle(1);
		showToast('info', "ASR服务连接被关闭");
	}

	function onMessage(e) {
		msgHandle(e);
	}

	function onError(e) {
		showToast('error', "ASR服务连接错误，详细见控制台");
		console.log(e);
		stateHandle(2);
	}
}
