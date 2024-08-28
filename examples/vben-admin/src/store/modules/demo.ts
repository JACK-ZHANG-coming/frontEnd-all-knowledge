import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useChantStore = defineStore('demo', () => {
  //state
  const msg = ref(''); //发送的消息
  const socket = ref();
  const userId = ref(''); //传递的参数
  const count = ref(0); //链接标志

  //action
  // Websoket连接成功事件
  const websocketonopen = (res: any) => {
    console.log('WebSocket连接成功', res);
  };
  // Websoket接收消息事件
  const websocketonmessage = (res: any) => {
    console.log('数据', res);
    msg.value = res.data;
    console.log(msg.value);
  };
  // Websoket连接错误事件
  const websocketonerror = (res: any) => {
    console.log('连接错误', res);
  };
  // Websoket断开事件
  const websocketclose = (res: any) => {
    console.log('断开连接', res);
    websocketclose;
    // 销毁 websocket 实例对象
    socket.value = null;
    count.value = 0;
    userId.value = '';
  };

  //创建链接
  const connectWebSocket = () => {
    console.log('websocket创建链接 usrid= ', userId.value);
    const wsurl = `ws://124.222.224.186:8800`;
    socket.value = new WebSocket(wsurl);
    socket.value.onopen = websocketonopen;
    socket.value.onmessage = websocketonmessage;
    socket.value.onerror = websocketonerror;
    socket.value.onclose = websocketclose;
    count.value = 1;
  };
  //关闭链接
  const closetWebSocket = () => {
    websocketclose;
    // 销毁 websocket 实例对象
    socket.value = null;
    count.value = 0;
    userId.value = '';
  };
  // 发送消息方法
  const sendMessage = (message: string) => {
    socket.value.send(message);
  };

  return {
    msg,
    socket,
    userId,
    count,
    connectWebSocket,
    closetWebSocket,
    sendMessage,
    websocketonmessage,
  };
});
