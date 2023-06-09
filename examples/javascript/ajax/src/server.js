//1. 引入express
const express = require('express');
const { exec } = require('child_process');

const bodyParser = require('body-parser'); // 使用express中间件，以解决post请求后端获取不到值问题

//2. 创建应用对象
const app = express();

// 下面这两句话是针对post请求加的， req.body是解析json的结果，一定加上这么2句，否则post请求获取不到req.body的  
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//3. 创建路由规则
// request 是对请求报文的封装
// response 是对响应报文的封装
app.get('/server', (request, response) => {
    //设置响应头  设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    //设置响应体 这里是返回给前端的内容
    response.send('哈哈哈，接口请求成功，这一串文字是接口返回的数据~~');
});

// 3.2 get带参数的接口
app.get('/server/getAndValue', (request, response) => {
    //设置响应头  设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    // response.setHeader('Access-Control-Allow-Headers', '*');
    //设置响应体 这里是返回给前端的内容
    let result = request.query;
    if (result.a !== undefined) {
        result.a = result.a + 10000
    }
    response.send(result);
});


// 3.3 post带参数的接口
app.all('/server/postAndValue', (request, response) => {
    //设置响应头  设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    // response.header('Access-Control-Allow-Headers', 'Content-Type')
    //设置响应体 这里是返回给前端的内容
    let result = request.body;
    if (result.a !== undefined) {
        result.a = result.a + 20000
    }
    console.log('postAndValue--->', result)
    response.send(request.body);
});

// 3.4 get带参数的接口 打开文件资源管理器 并指定选中文件夹
app.get('/server/openFileInExplorerForGet', (request, response) => {
    //设置响应头  设置允许跨域
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    //设置响应体 这里是返回给前端的内容
    let result = request.query;
    exec(`explorer.exe /select,"${result.path}"`, (error, stdout, stderr) => {
        if (error) {
            response.send({
                msg: 'ok',
                result: error
            })
        }
        else {
            response.send({
                msg: 'ok',
                result: '已打开资源管理器并定位到文件'
            })
        }
    });
});

//4. 监听端口启动服务
app.listen(8000, () => {
    console.log("服务已经启动, 8000 端口监听中....");
});