/**
* 实现截图/录像功能
* @param {Object} obj
*/
var Vedio_Function = function (obj) {
    this.video; //视频标签对象
    this.mediaStream; //媒体流

    //媒体工具对象
    var Vedio_Utils = {
        /**
         * 获取用户媒体设备(处理兼容的问题)
         * @param callback {Function} - 处理回调
         */
        getUserMedia: function (callback) {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || window.getUserMedia;

            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(function (stream) { callback(false, stream); })['catch'](function (err) { callback(err); });
            } else if (navigator.getUserMedia) {
                navigator.getUserMedia({ video: true, audio: false }, function (stream) { callback(false, stream); }, function (err) { callback(err); });
            } else {
                callback(new Error('Not support userMedia'));
            }
        },

        /**
         * 关闭媒体流
         * @param stream {MediaStream} - 需要关闭的流
         */
        closeStream: function (stream) {
            if (typeof stream.stop === 'function') {
                stream.stop();
                return;
            }
            var tracks = stream.getVideoTracks();

            if (tracks && tracks.length > 0) {
                for (var j = 0; j < tracks.length; j++) {
                    if (typeof tracks[j].stop === 'function') {
                        tracks[j].stop();
                    }
                }
            }
        }
    };

    //初始化
    this.init = function () {

        this.video = document.getElementById(obj["video"]);
        if (this.video == null) {
            return;
        }

        Vedio_Utils.getUserMedia((err, stream) => {
            if (err) {
                throw err;
            }

            this.mediaStream = stream;

            this.video.srcObject = stream;

            this.screenshot();

            // this_vedio_callback(this.video, stream)
        });
    }


    //获取视频权限后的功能回调
    var this_mediaRecorder = null;
    function this_vedio_callback(this_video, stream) {

        // 通过 MediaRecorder 记录获取到的媒体流
        this_mediaRecorder = new MediaRecorder(stream);

        // 可用时录制
        var isOk = false;
        this_mediaRecorder.ondataavailable = function (e) {
            if (e.data.size > 0) {
                this_video.screenshot();
                isOk = true;
            }
        }

        if (!isOk) {
            this_mediaRecorder.start(2000);
        }

    }


    //截图,返回图片的虚拟地址
    this.screenshot = function () {
        var canvas = document.createElement("canvas");
        // canvas.width = VIDEO_WIDTH;
        canvas.height = VIDEO_HEIGHT;
        canvas.getContext('2d').drawImage(this.video, 0, 0, canvas.width, canvas.height);
        upload_face(canvas.toDataURL("image/png"));
    }

    //关闭摄像头
    this.closeMedia = function () {
        if (this.mediaStream != undefined & this.mediaStream != null) {
            Vedio_Utils.closeStream(this.mediaStream); // 关闭媒体流
        }
    }

}
