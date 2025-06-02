class AdvancedVideoRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.isRecording = false;
    this.audioContext = null;
    this.microphoneStream = null;
    this.videoAudioStream = null;
    this.mixedAudioStream = null;
    this.analyser = null;
    this.visualizerInterval = null;

    // 获取DOM元素
    this.sourceVideo = document.getElementById('video');
    this.recordedVideo = document.getElementById('recordedVideo');
    this.recordBtn = document.getElementById('recordBtn');
    this.stopBtn = document.getElementById('stopBtn');
    this.playOriginalBtn = document.getElementById('playOriginalBtn');
    this.testAudioBtn = document.getElementById('testAudioBtn');
    this.status = document.getElementById('status');
    this.downloadSection = document.getElementById('downloadSection');
    this.downloadLink = document.getElementById('downloadLink');
    this.placeholder = document.getElementById('placeholder');

    // 音频设置元素
    this.recordMicCheckbox = document.getElementById('recordMicrophone');
    this.recordVideoAudioCheckbox = document.getElementById('recordVideoAudio');
    this.micVolumeSlider = document.getElementById('micVolume');
    this.videoVolumeSlider = document.getElementById('videoVolume');
    this.micVolumeValue = document.getElementById('micVolumeValue');
    this.videoVolumeValue = document.getElementById('videoVolumeValue');
    this.audioVisualizer = document.getElementById('audioVisualizer');

    this.initEventListeners();
    this.setupAudioContext();
  }

  initEventListeners() {
    console.log(this)
    console.log(this.recordBtn)
    this.recordBtn.addEventListener('click', () => this.startRecording());
    this.stopBtn.addEventListener('click', () => this.stopRecording());
    this.testAudioBtn.addEventListener('click', () => this.testAudio());

    // 音量控制
    this.micVolumeSlider.addEventListener('input', (e) => {
      this.micVolumeValue.textContent = e.target.value + '%';
    });

    this.videoVolumeSlider.addEventListener('input', (e) => {
      this.videoVolumeValue.textContent = e.target.value + '%';
    });
  }

  async setupAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.error('音频上下文创建失败:', error);
    }
  }

  async getMicrophoneStream() {
    if (!this.recordMicCheckbox.checked) return null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      return stream;
    } catch (error) {
      console.error('获取麦克风失败:', error);
      this.showStatus('无法获取麦克风权限', 'warning');
      return null;
    }
  }

  getVideoAudioStream() {
    if (!this.recordVideoAudioCheckbox.checked) return null;

    try {
      // 从video元素捕获音频流
      const stream = this.sourceVideo.captureStream();
      const audioTracks = stream.getAudioTracks();

      if (audioTracks.length > 0) {
        return new MediaStream(audioTracks);
      } else {
        console.warn('视频没有音频轨道');
        return null;
      }
    } catch (error) {
      console.error('获取视频音频失败:', error);
      return null;
    }
  }

  async mixAudioStreams(micStream, videoAudioStream) {
    if (!this.audioContext) {
      await this.setupAudioContext();
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // 创建音频目标节点
    const destination = this.audioContext.createMediaStreamDestination();

    // 创建增益节点用于音量控制
    const micGain = this.audioContext.createGain();
    const videoGain = this.audioContext.createGain();

    // 设置音量
    micGain.gain.value = this.micVolumeSlider.value / 100;
    videoGain.gain.value = this.videoVolumeSlider.value / 100;

    // 连接麦克风音频
    if (micStream) {
      const micSource = this.audioContext.createMediaStreamSource(micStream);
      micSource.connect(micGain);
      micGain.connect(destination);
    }

    // 连接视频音频
    if (videoAudioStream) {
      const videoSource = this.audioContext.createMediaStreamSource(videoAudioStream);
      videoSource.connect(videoGain);
      videoGain.connect(destination);
    }

    // 设置音频分析器用于可视化
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;

    if (micStream) {
      const micSource = this.audioContext.createMediaStreamSource(micStream);
      micSource.connect(this.analyser);
    }

    return destination.stream;
  }

  startAudioVisualization() {
    if (!this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    const bars = this.audioVisualizer.querySelectorAll('.visualizer-bar');

    this.visualizerInterval = setInterval(() => {
      this.analyser.getByteFrequencyData(dataArray);

      // 计算平均音量
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

      // 更新可视化条
      bars.forEach((bar, index) => {
        const height = Math.max(2, (dataArray[index * 4] / 255) * 30);
        bar.style.height = height + 'px';
        bar.style.backgroundColor = average > 50 ? '#28a745' : '#007bff';
      });
    }, 100);
  }

  stopAudioVisualization() {
    if (this.visualizerInterval) {
      clearInterval(this.visualizerInterval);
      this.visualizerInterval = null;
    }

    // 重置可视化条
    const bars = this.audioVisualizer.querySelectorAll('.visualizer-bar');
    bars.forEach(bar => {
      bar.style.height = '2px';
      bar.style.backgroundColor = '#007bff';
    });
  }

  async startRecording() {
    try {
      // 获取视频流
      let videoStream;
      if (this.sourceVideo.srcObject) {
        videoStream = this.sourceVideo.srcObject;
      } else {
        videoStream = this.sourceVideo.captureStream();
      }

      // 获取音频流
      const micStream = await this.getMicrophoneStream();
      const videoAudioStream = this.getVideoAudioStream();

      if (!micStream && !videoAudioStream) {
        this.showStatus('请至少选择一种音频源', 'warning');
        return;
      }

      // 混合音频流
      const mixedAudioStream = await this.mixAudioStreams(micStream, videoAudioStream);

      // 合并视频和音频流
      const tracks = [...videoStream.getVideoTracks()];
      if (mixedAudioStream) {
        tracks.push(...mixedAudioStream.getAudioTracks());
      }

      const combinedStream = new MediaStream(tracks);

      // 创建MediaRecorder
      const options = { mimeType: 'video/webm;codecs=vp9,opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(combinedStream, options);
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.handleRecordingComplete();
      };

      // 开始录制
      this.mediaRecorder.start();
      this.isRecording = true;

      // 开始音频可视化
      this.startAudioVisualization();

      // 更新UI
      this.recordBtn.textContent = '录制中...';
      this.recordBtn.classList.add('recording');
      this.recordBtn.disabled = true;
      this.stopBtn.disabled = false;
      this.showStatus('正在录制视频和音频...', 'recording');

      // 存储流引用以便后续清理
      this.microphoneStream = micStream;
      this.videoAudioStream = videoAudioStream;
      this.mixedAudioStream = mixedAudioStream;

    } catch (error) {
      console.error('录制启动失败:', error);
      this.showStatus('录制启动失败: ' + error.message, 'warning');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;

      // 停止音频可视化
      this.stopAudioVisualization();

      // 清理音频流
      if (this.microphoneStream) {
        this.microphoneStream.getTracks().forEach(track => track.stop());
      }

      // 更新UI
      this.recordBtn.textContent = '开始录制';
      this.recordBtn.classList.remove('recording');
      this.recordBtn.disabled = false;
      this.stopBtn.disabled = true;
      this.showStatus('录制已停止，正在处理...', 'ready');
    }
  }

  handleRecordingComplete() {
    const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
    const videoURL = URL.createObjectURL(blob);

    // 显示录制结果
    // this.recordedVideo.src = videoURL;
    // this.recordedVideo.style.display = 'block';
    // this.placeholder.style.display = 'none';

    // 设置下载链接
    this.downloadLink.href = videoURL;
    this.downloadSection.style.display = 'block';

    this.showStatus('录制完成！包含视频和混合音频', 'ready');
  }

  async testAudio() {
    try {
      const micStream = await this.getMicrophoneStream();
      const videoAudioStream = this.getVideoAudioStream();

      if (micStream || videoAudioStream) {
        this.showStatus('音频测试成功！', 'ready');

        // 开始短暂的音频可视化测试
        if (micStream) {
          const tempAudioContext = new AudioContext();
          const analyser = tempAudioContext.createAnalyser();
          const source = tempAudioContext.createMediaStreamSource(micStream);
          source.connect(analyser);
          this.analyser = analyser;
          this.startAudioVisualization();

          setTimeout(() => {
            this.stopAudioVisualization();
            micStream.getTracks().forEach(track => track.stop());
            tempAudioContext.close();
          }, 3000);
        }
      } else {
        this.showStatus('音频测试失败，请检查设置', 'warning');
      }
    } catch (error) {
      this.showStatus('音频测试失败: ' + error.message, 'warning');
    }
  }

  showStatus(message, type) {
    this.status.textContent = message;
    this.status.className = `status ${type}`;
    this.status.style.display = 'block';
  }
}

// 页面加载完成后初始化录制器
document.addEventListener('DOMContentLoaded', () => {
  console.log('页面加在完毕')
  try {
    new AdvancedVideoRecorder();
  }
  catch (err) {
    console.log('err->', err)
    debugger
  }
});
