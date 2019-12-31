let swiperBox = document.querySelector(".swiper1 .swiper-wrapper ")
// console.log(swiperBox)
async function swiperHeader(){
	let httpUrl = await "/index/api/news/getcid"
	let arr = []
	// var httpUrl = "https://api.apiopen.top/getJoke?page=1&count=10&type=text"
	getAjax(httpUrl,async (res)=>{
		let result = JSON.parse(res.response)
		// console.log(result)
		arr = result.data
		// console.log(arr.length)
		arr.forEach(async (item,i)=>{
			// console.log(item.catagory)
			var swiperNav = document.createElement("div")
			swiperNav.className = "swiper-slide"
			swiperNav.innerHTML = `${item.catagory}`
			// console.log(swiperNav)	
			 swiperBox.appendChild(swiperNav)
		})
		var swiperDiv1 = await document.querySelectorAll(".swiper1 .swiper-wrapper .swiper-slide:nth-child(1)")
		// console.log(swiperDiv1)
		swiperDiv1[0].className = "swiper-slide selected"
		
		await headerClick()
		await swiperPage()
		
	})
	
}
swiperHeader()


function headerClick(){
	$(function() {
			function setCurrentSlide(ele, index) {
				$(".swiper1 .swiper-slide").removeClass("selected");
				ele.addClass("selected");
				//swiper1.initialSlide=index;
		}
		var swiper1 = new Swiper('.swiper1', {
			// 设置slider容器能够同时显示的slides数量(carousel模式)。
			// 可以设置为number或者 'auto'则自动根据slides的宽度来设定数量。
			// loop模式下如果设置为'auto'还需要设置另外一个参数loopedSlides。
			slidesPerView: 5.5,
			paginationClickable: true,//此参数设置为true时，点击分页器的指示点分页器会控制Swiper切换。
			spaceBetween: 10,//slide之间的距离（单位px）。
			freeMode: true,//默认为false，普通模式：slide滑动时只滑动一格，并自动贴合wrapper，设置为true则变为free模式，slide会根据惯性滑动且不会贴合。
			loop: false,//是否可循环
			onTab: function(swiper) {
				var n = swiper1.clickedIndex;
			},
		});
		swiper1.slides.each(function(index, val) {
			var ele = $(this);
			ele.on("click", function() {
				setCurrentSlide(ele, index);
				swiper2.slideTo(index, 500, false);
				//mySwiper.initialSlide=index;
			});
		});	
		var swiper2 = new Swiper('.swiper2', {
			//freeModeSticky  设置为true 滑动会自动贴合  
			direction: 'horizontal',//Slides的滑动方向，可设置水平(horizontal)或垂直(vertical)。
			loop: false,
	//					effect : 'fade',//淡入
			//effect : 'cube',//方块
			//effect : 'coverflow',//3D流
	//					effect : 'flip',//3D翻转
			autoHeight: true,//自动高度。设置为true时，wrapper和container会随着当前slide的高度而发生变化。
			onSlideChangeEnd: function(swiper) {  //回调函数，swiper从一个slide过渡到另一个slide结束时执行。
				var n = swiper.activeIndex;
				
				setCurrentSlide($(".swiper1 .swiper-slide").eq(n), n);
				swiper1.slideTo(n, 500, false);
			}
		});
	});	
}




async function swiperPage(){
	var swiper1All = await document.querySelectorAll(".swiper1 .swiper-wrapper .swiper-slide")
	// console.log(swiper1All)
	
	var swiper2 = await document.querySelector(".swiper2 .swiper-wrapper")
	var swiperDiv = document.createElement("div")
	swiperDiv.className = "swiper-slide swiper-no-swiping"
	await swiper2.appendChild(swiperDiv)

	await swiperNews(1)

	swiper1All.forEach(async (item,i)=>{
		item.onclick = async function(){
			await swiperNews((i+1))
		}
	})
	
}
	

var newPage = document.querySelector(".newPage")
async function swiperNews(id = 1){
	let page = 1 
	let httpUrl = await "/index/api/news/cid"+id+"?page=1"
	let arr = []
	getAjax(httpUrl,async (res)=>{
		var result = JSON.parse(res.response)
		// console.log(result)
		arr = [result.data,result.cataInfo]
		
		console.log(arr)
		await render(arr)
		await itemBtn(arr)
	})
	
	newPage.onclick = async function(){
	//	var page = parseInt(Math.random()*73) //随机页面
		page++
		httpUrl = await "/index/api/news/cid"+id+"?page="+page+""
		getAjax(httpUrl,async (res)=>{
			var result = JSON.parse(res.response)
			// console.log(result)
			arr = [result.data,result.cataInfo]
			var swiper2All = await document.querySelector(".container>.swiper2 .swiper-wrapper>.swiper-slide")
			swiper2All.innerHTML = ""
			
			
			await render(arr)
			await itemBtn(arr)
			scrollTo(0,0)
		})
	}
}



//点击弹出弹框
async function itemBtn(arr){
	// console.log(arr[0][0])
	var itemDivAll = await document.querySelectorAll(".container>.swiper2 .swiper-wrapper>.swiper-slide .item")
//	await console.log(itemDivAll) 
	
	itemDivAll.forEach(async (item,i)=>{
		// console.log(i)
		item.onclick = async function(){
			var textDiv = await document.createElement('div')
			textDiv.id = "textDiv"
			console.log(arr[0][i].newsID);
			$.ajax({
				url:'/index/api/news/newsid'+arr[0][i].newsID,
				method:'get',
			
			}).then((res)=>{
				textDiv.innerHTML = `
				<div class="itemHeader">
					<p class="iconfont">&#xe78d;返回</p>
					新闻详情
				</div>
				<div class="itemDiv">   
					<h3 class="title">${arr[0][i].title}</h3>
						<div class="box">
							<p class="author">${arr[0][i].author}</p>
							<p class="pubtime">${arr[0][i].pubtime}</p>
						</div>
				<div class="box1">
					${arr[0][i].content}
				</div>
				</div>
			`
				document.body.appendChild(textDiv)
				newsXq()
			}) 
			
		}
	})
}




//渲染页面
async function render(arr){
	var swiper2All = await document.querySelector(".container>.swiper2 .swiper-wrapper>.swiper-slide")
	swiper2All.innerHTML = ""
	// console.log(swiper2All)
	await arr[0].forEach(async (item,i)=>{
		var itemDiv = document.createElement("div")
		itemDiv.className = "item"
		itemDiv.innerHTML = `
				<div class="leftItem">
					<img src="http://www.nfyy.com${item.headImg}"/>
				</div>
				<div class="rightItem">
					<div class="title">${item.title}</div>
					<div class="box">
						<p class="author">${item.author}</p>
						<p class="num"><i class="iconfont">&#xe602;</i> ${item.viewtime}</p>
						<p class="cataory">123</p>
					</div>
				</div>
		`	
		
		await swiper2All.appendChild(itemDiv)
		
	})
	var catagory = await document.querySelectorAll(".container>.swiper2 .swiper-wrapper>.swiper-slide>.item .box>.cataory")
	catagory.forEach(async (item,i)=>{
		item.innerText = arr[1].catagory
	})

}









