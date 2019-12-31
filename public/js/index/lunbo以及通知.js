async function lunboDiv(){
var imgListDiv = await document.querySelectorAll(".imgItem") //获取所有的轮播图片
var liList = await document.querySelectorAll("#shouYe>#content .lunbo>ul li") //获取所有的轮播按钮
//console.log(liList)
var firstImg = 0; 
//这里是点击事件


//封装这个轮播函数，我想看起来简洁点
	function lunbo(){
		//初始化，将img列表和li列表所有的active去掉
		imgListDiv.forEach(function(item,i,arr){
			item.classList.remove("imgActive")
		})	
		imgListDiv[firstImg].classList.add('imgActive') //这里是给轮到的图片后面添加(active)className
		
		liList.forEach(function(item,i,arr){
			item.classList.remove("imgActive")
		})	
		liList[firstImg].classList.add('imgActive') //这里是给轮到的图片后面添加(active)className
		
	}
	var jiange3 =async function(item,i,arr){ 
		firstImg = firstImg + 1;
		if(firstImg >= imgListDiv.length){
			firstImg = 0;
		}
		await lunbo()
		//setTimeout(jiange3,10000)：这个是延迟函数
	}
	//setTimeout(jiange3,10000)//注意：轮播图一般不推荐使用延迟函数，因为容易陷入死循环
	setInterval(jiange3,3000)//间隔函数：每隔多少时间就去做某件事
	
	liList.forEach( function(item ,i){
		item.onclick = function(){
			firstImg = i
			lunbo()		
		}
	})

	lcEvent.init(body);
	body.addEvent("swiperLeft",async function(){
		firstImg = firstImg + 1;
		if(firstImg >= imgListDiv.length){
			firstImg = 0;
		}
		await lunbo()	
	})
	
	body.addEvent("swiperRight",async function(){
		firstImg = firstImg - 1;
		if(firstImg < 0){
			firstImg = imgListDiv.length - 1;
		}
		await lunbo()	
	})

}





























