/*
	REM -- r root,em 相对单位，相对于Html的字体大小单位，可以用于任何设定长度的单位
	1:设计师设计王昭的设计稿:1000px
	2:因为每个人打开网页的时候，因为设备的不同，或者浏览器设定的分辨率不同，使得需要在不同的分辨率下面打开网页
	3:假设屏幕的大小是1000px，我们给1rem赋值为100px，10rem就会刚刚好占满整个屏幕的宽度
	4：但是有时候屏幕大小不都是一样的，假设一个500px的屏幕，想让10rem也是刚刚好占据屏幕的宽度，这时候我们设定1rem为50px的值就好了
*/

(function(){
	function wyfRem(){
		//在这里是判断浏览器类型
		var html = document.querySelector("html")
		var userAgent = navigator.userAgent
		html.className = ""
		if(userAgent.indexOf("iPhone") != -1){
			html.classList.add("iphone")
		}else if(userAgent.indexOf("Android") != -1){
			html.classList.add("android")
		}else if(userAgent.indexOf("iPad") != -1){
			html.classList.add("ipad")
		}else{
			html.classList.add("pc")
		}
	
		if(window.innerWidth < 640){
			html.classList.add('lt640')
			html.classList.add('lt960')
			html.classList.add('lt1200')
		}else if(window.innerWidth<960){
			html.classList.add("gt640")
			html.classList.add("lt960")
			html.classList.add("lt1200")
		}else if(window.innerWidth<1200){
			html.classList.add("gt960")
			html.classList.add("gt640")
			html.classList.add("lt1200")
		}else{
			html.classList.add("gt640")
			html.classList.add("gt960")
			html.classList.add("gt1200")
		}

		//REM布局
		var pingmuRem = window.innerWidth;
		var danwei = pingmuRem/10; 
		//屏幕的宽度除于设计稿占满全屏的宽度为多少REM
		html.style.fontSize = danwei + 'px'
	}
	wyfRem() //注意这里要先行调用一次才能使用
	
	window.onresize = function(){
		wyfRem()
	}
})()
