export default class BaseTool {
	postData(url, data) {
		const BASE_URL = 'http://' + uni.getStorageSync('MES_IP')
		const REQUEST_URL = BASE_URL + url
		const USER_INFO = uni.getStorageSync('USER_INFO')
		if (USER_INFO != '') {
			data['token'] = JSON.parse(USER_INFO)
			data['user'] = JSON.parse(USER_INFO).userData
		}
		// return  promise 从而可以实现promise异步操作
		return new Promise((resolve, reject) => {
			uni.request({
				// 传入的url地址 
				url: REQUEST_URL,
				method: "POST",
				// 请求数据可填可不填 默认空对象
				data: data || {},
				//自定义请求头信息
				header: {
					'content-type': 'application/json;charset=UTF-8'
				},
				// 响应成功回调函数
				success: (res) => {
					// 配置统一的 相应结果 如果 !=0(失败) 将会统一的提示动作
					if (res.data.resFlag != 0) {
						if (res.data.resFlag === -29999) {
							// token过期
							uni.removeStorageSync('USER_INFO')
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
						this.msg(res.data.errMsg)
					}
					// 将请求结果resolve出去
					resolve(res.data.result);
				},
				// 如果error也会统一的提示
				fail: (err) => {
					this.msg('请求接口失败')
					reject(err)
				}
			})
		})
	}

	/**
	 * @description 消息提示 toast
	 */
	msg(title, icon = "none", duration = 2000, mask = false) {
		if (!title) return;
		if (typeof title !== 'string') title = JSON.stringify(title);

		uni.showToast({
			title,
			duration,
			mask,
			icon
		});
	}

	/**
	 * @description 消息提示 alert
	 */
	alert(content, callback) {
		if (typeof content !== 'string') content = JSON.stringify(content);

		uni.showModal({
			title: '提示',
			content: content,
			showCancel: true,
			success(res) {
				if (res.confirm) {
					if (typeof callback === 'function') {
						callback();
					}

				} else if (res.cancel) {}
			}
		})
	}

	/**
	 * @description 日期格式化
	 */
	format(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
		if (typeof date === 'string') {
			date = date.replace(/\.|\-/g, '/');
		}
		if (typeof date !== 'object') {
			date = new Date(date);
		}

		let o = {
			"M+": date.getMonth() + 1, //月份   
			"d+": date.getDate(), //日   
			"h+": date.getHours(), //小时   
			"m+": date.getMinutes(), //分   
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt))
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (let k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k])
					.length)));
		return fmt;
	}
}