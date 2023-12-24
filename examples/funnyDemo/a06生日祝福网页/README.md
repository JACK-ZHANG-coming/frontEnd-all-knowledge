# Birthday

手机端  
调试地址：

## 提示

仅克隆本仓库主分支最新提交命令: `git clone --depth=1 --single-branch -b master https://github.com/Ziqi-Yang/birthday_gift.git`
在实际使用的时候应使用类似`gitee pages`这样的国内服务，使得不用在微信上“备案”也可以看到这个网页(然而`gitee pages`把缓存设置地很恶心，
你必须清除浏览器记录才能看到变化(微信是清除缓存), 所以到微信里频繁调试)。  
最后的二维码可以用来收集地址(比如可以用来收集生日礼物), 用的是问卷网，像这样:  
![demo](./demo/demo.png)。

### 修改清单

1. 网页标题人名(第 5 行)
2. 第二页人民(第 283 行)
3. 第三页二维码(用同名图片文件替换)和点击跳转地址(590 行)
4. 如果音乐(3.17mb)播放较卡, 修改`index.html`文件第 575 行音乐地址, 改为用 cdn 加速
5. 修改人名后面计划直接写在网站后面读取，末尾加上专属两个字，有 2 种方式：1 直接加某人的名字 2 是加某人的名字再加上专属二字，这两种写法都只会读取 ta 的名字

## Reference

1. [cake](https://codepen.io/fixcl/pen/bGeWvY)
2. [gift](https://codepen.io/Mamboleoo/pen/PZWPZx)
3. [bulb](https://codepen.io/Colouryum/pen/MWPvzG)
