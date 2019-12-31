async function newsXq(){
	var img =await document.querySelectorAll("#textDiv img")
	img.forEach(async (item,i)=>{
		// console.log(item.src)
		item.src = item.src.replace('http://localhost:3000/','http://www.nfyy.com/')
		// item.src = item.src.replace('file:///D:/','http://www.nfyy.com/')
		
	})
	var textDiv =await document.querySelector("#textDiv")
	var removebtn =await document.querySelector("#textDiv>.itemHeader .iconfont")
	
	removebtn.onclick = async function(){
		await textDiv.remove(textDiv)
	}
}

