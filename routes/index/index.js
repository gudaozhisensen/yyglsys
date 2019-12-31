var express = require('express');
var router = express.Router();
let private = require('./private');
let doctorsRouter = require('./doctors/doctorsRouter')
let newsRouter = require('./news/newsRouter')
let patientsRouter = require('./patients/patientsRouter')
router.get('/', function(req, res, next) {
  res.redirect('/index/home');
});

//首页--------------------------------------------
router.use('/home', (req, res) => {
  res.render('index/index.ejs');
});

//新闻页--------------------------------------------
router.use('/news', (req, res) => {
  res.render('index/news.ejs');
});

//医生详情-------------------------------------------
router.use('/ysxq', (req, res) => {
  res.render('index/ysxq.ejs');
});

//挂号页
router.use('/gh',(req,res)=>{
  console.log(req.session.username)
  if(req.session.username != undefined){
     res.render('index/gh.ejs')
  }else{
     //尚未登入，返回登录页
     res.render('info/info.ejs', {
      title: '尚未登录',
      content: '请您先登录账号',
      hrefText: '登录页',
      href: '/rl/login'
    });
  }
 
})

router.use('/api/news',newsRouter)
//医生和科室接口
router.use('/api/doctors',doctorsRouter)
//患者接口
router.use('/api/patients',patientsRouter)

//我的页
router.use('/private', private);
module.exports = router;
