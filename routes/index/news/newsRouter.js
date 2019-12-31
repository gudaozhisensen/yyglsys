// 这是新闻路由模块
var express = require('express');
var router = express.Router();
let getTime = require('../../../public/js/common/getTime');
let mySql = require('../../../public/js/common/mysql');



// 获取分类新闻
// api接口 /index/api/news/getcid
router.get('/getcid', async (req, res) => {
  let sqlStr = 'select * from news_catagory';
  let cataInfo = await mySql(sqlStr);
  res.json({
    status: 'ok',
    data: Array.from(cataInfo)
  });
});

// 获取分类新闻以及新闻的分页
// 接口名:/index/api/news/cidXX?page=XX
router.get('/cid:cid',async (req,res)=>{
    let cataId = req.params.cid;
    cataId = cataId?cataId:1
    let page = req.query.page;
    page = page?page:1;
    
    let sqlStr = "select * from news where catagory = ? and isPub = 'true' limit ?,10"
    let result = await mySql(sqlStr,[cataId,(page-1)*10])
    let sqlStr1 = "select * from role"
    let roleInfo = await mySql(sqlStr1)
    let cataInfo = await mySql("select * from news_catagory where id = ?",[cataId])
    cataInfo = Array.from(cataInfo)[0]
    

    if (req.headers['user-agent'] == undefined) {
        // 阻止类似于node request 的爬取
        res.redirect('http://www.baidu.com');
      } else if (req.headers['user-agent'].indexOf('axios') != -1) {
        // 阻止类似node axios 的爬取
        res.redirect('http://www.baidu.com');
      } else if (req.headers['user-agent'].indexOf('python') != -1) {
        // 阻止类似Python request的爬取
        res.redirect('http://www.baidu.com');
      } else if (req.headers['user-agent'].indexOf('Scrapy') != -1) {
        // 阻止类似Python Scrapy框架的爬取
        res.redirect('http://www.baidu.com');
      } else {
          res.json({
          status:'ok',
          content:'11111',
          roleInfo:Array.from(roleInfo),
          data:Array.from(result),
          cataInfo
        })
    }
    
})

// 获取具体的新闻
// 接口 /index/api/news/newsidXX
router.get('/newsid:newsid',async (req, res)=>{
    if (req.headers['user-agent'] == undefined) {
        // 阻止类似于node request 的爬取
        res.redirect('http://www.baidu.com');
      } else if (req.headers['user-agent'].indexOf('axios') != -1) {
        // 阻止类似node axios 的爬取
        res.redirect('http://www.baidu.com');
      } else if (req.headers['user-agent'].indexOf('python') != -1) {
        // 阻止类似Python request的爬取
        res.redirect('http://www.baidu.com');
      } else if (req.headers['user-agent'].indexOf('Scrapy') != -1) {
        // 阻止类似Python Scrapy框架的爬取
        res.redirect('http://www.baidu.com');
      } else {
        let newsID = req.params.newsid;
        console.log(newsID);
        let viewTime = await mySql("select * from news where newsID = ?",[newsID])
        viewTime = Array.from(viewTime)[0].viewtime;
        viewTime = parseInt(viewTime)+1;
        console.log(viewTime);
        await mySql('update news set viewtime = ? where newsID = ?',[viewTime,newsID])
        let sqlStr = "select * from news where newsID = ?"
        let newsInfo = await mySql(sqlStr,[newsID])
        let roleInfo = await mySql("select * from role")
        res.json({
            status:'ok',
            roleInfo:Array.from(roleInfo),
            newsInfo:Array.from(newsInfo),
            viewTime
        })
      }
    
})




module.exports = router;
module.exports = router;
module.exports = router;

