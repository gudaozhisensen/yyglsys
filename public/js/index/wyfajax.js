function getAjax(httpUrl,callbackFn){
	//1：创建Ajax对象
			var Ajax123 = new XMLHttpRequest()
			
			//2：设置请求方法和路径."GET","POST"
			//"GET",表单提交的数据会拼接到请求的路径里，效率高，不安全
			//"POST",会将表单的数据放置在请求的body里面，数据大，安全
			Ajax123.open("GET",httpUrl)
			//Ajax123.open("POST","http://127.0.0.1:8020/%E7%8E%B0%E5%9C%A83/ajax/abc.txt")
			
			//3：发送数据
			Ajax123.send()
			//Ajax123.send("username = admin&password = 123456")
			
			//4：监听后台是否返回数据
			Ajax123.onreadystatechange = function(){
				if(Ajax123.status == 200 && Ajax123.readyState == 4){
					/*console.log("成功获取数据")
					console.log(Ajax123)
					console.log(Ajax123.status) //判断是否返回数据
					console.log(Ajax123.readyState) //返回数据的状态，显示4的时候证明数据已经返回给请求了*/
					
					//5：处理数据
					/*var res = Ajax123.response;
					var h1 = document.createElement("h1")
					h1.innerHTML = res
					document.body.appendChild(h1)*/
					callbackFn(Ajax123)
					
				}
				
			}
			
			
}
