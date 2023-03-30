(function(){
	function lcXys(){
		var html = document.querySelector('html')
		var userAgent = navigator.userAgent
		//userAgent.indexOf("iPhone"),通过此方法可以获取iphone在字符中的索引值
		html.className = "";
		if(userAgent.indexOf("iPhone")!=-1){
			//console.log(iphone)
			html.classList.add("iphone")
		}else if(userAgent.indexOf("Android")!=-1){
			//console.log(iphone)
			html.classList.add("android")
		}else if(userAgent.indexOf("iPad")!=-1){
			//console.log(iphone)
			html.classList.add("ipad")
		}else{
			html.classList.add("pc")
		}
		
		//作业:window.innerWidth,可以获取窗口的宽度,所以可以根据窗口的宽度,来设定html的样式(lt640,lt960,lt1200,gt640,gt960,gt1200)
		if(window.innerWidth<640){
			html.classList.add('lt640');
			html.classList.add("lt960")
			html.classList.add("lt1200")
		}else if(window.innerWidth<960){
			html.classList.add("lt960")
			html.classList.add("lt1200")
			html.classList.add("gt640")
		}else if(window.innerWidth<1200){
			html.classList.add("gt960")
			html.classList.add("lt1200")
			html.classList.add("gt640")
		}else{
			html.classList.add("gt960")
			html.classList.add("gt1200")
			html.classList.add("gt640")
		}
		
		//rem布局
		var screenWidth = window.innerWidth;
		var danwei = screenWidth/3.75;//屏幕的宽度/设计稿占满全屏的宽度为多少rem
		var html = document.querySelector("html")
		html.style.fontSize = danwei + 'px';
		
	}
	lcXys()
	
	window.onresize = function(){
		lcXys()
	}
})()
			
			

