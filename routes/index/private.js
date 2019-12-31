var express = require('express');
var router = express.Router();
//引入上传模块
let multer = require('multer')
//配置上传对象
let upload = multer({dest:'./public/upload'})
let fs = require('fs')
let queryFn = require('../../public/js/common/mysql')
let Md5 = require('../../public/js/common/encryptMD5')
/* GET users listing. */

let parseTime = require('../../public/js/common/parseTime')

router.get('/', async(req, res ,next)=>{
  let username = req.session.username;
  if(username==undefined){
    //登录失败
    let option = {
      title:"未登录",
      content:"请登录",
      href:"/rl/login",
      hrefText:"登录页"
    }
    res.render('./info/info.ejs',option)
  }else{
    let sqlStr = 'select * from user where username = ?'
    let result = await queryFn(sqlStr,[username])
    let user = result[0]
    let options = {user}
    res.render('index/private.ejs',options);
  }
  
  
});

//渲染个人信息页面
router.get('/selfCenter',async function(req, res ,next) {
  let username = req.session.username
  if(username==undefined){
    //登录失败
    let option = {
      title:"未登录",
      content:"请登录",
      href:"/rl/login",
      hrefText:"登录页"
    }
    res.render('./info/info.ejs',option)
  }
  let sqlStr = 'select * from user where username = ?'
  let result = await queryFn(sqlStr,[username])
  let user = result[0]
  let options = {user}
  // console.log(options)
  res.render('index/selfCenter.ejs',options);
});

router.get('/rgList',async(req,res)=>{
  let username = req.session.username
  if(username==undefined){
    //登录失败
    let option = {
      title:"未登录",
      content:"请登录",
      href:"/rl/login",
      hrefText:"登录页"
    }
    res.render('./info/info.ejs',option)
  }


  // 挂号人 性别 看病时间
  let sqlStr1 = 'SELECT * from patient where patientname = (select name from user where username = ?) and phone_number = (select phone_number from user where username = ?)'
  let result1 = await queryFn(sqlStr1,[username,username])
  
  user = Array.from(result1)
  
  if(user.length == 0){
    res.render('index/rgList.ejs')
  }
  let office = [];
  let doctorname = [];
  let imgheader = [];
  let seetime = [];
  let num = 0;
  
  await user.forEach(async (item,i)=>{
    //时间
    seetime.push(parseTime(item.seetime*1000));
    
    // 科室
    let sqlStr2 = `select officename from office where id = (select officeid from doctor where id = ${item.doctorid})`
    let result2 = await queryFn(sqlStr2)
    office.push(result2[0].officename)

    // 医生
    let sqlStr3 = `select doctorname from doctor where id = ${item.doctorid}`
    let result3 = await queryFn(sqlStr3)
    doctorname.push(result3[0].doctorname)
    
    //头像
    let sqlStr4 = `select imgheader from user where id = (select userid from doctor where id = ${item.doctorid}) `
    let result4 = await queryFn(sqlStr4)
    imgheader.push(result4[0].imgheader)

    num ++

    if (user.length == num) {
      let options = {user,office,doctorname,imgheader,seetime}
      console.log(seetime)
      
      res.render('index/rgList.ejs',options)
    }
  })
 
})

router.get('/rgList/bookInfo',async(req,res)=>{
  let sqlStr = 'select * from doctorcomment where patientid = ?'
  let result = await queryFn(sqlStr,[req.query.patientid])
  let isComment;
  if(!result.length == '0'){
    //已经评论
    isComment = true;

  }else{
    isComment = false;
  }
  let options = {
    patientname:req.query.patientname,
    office:req.query.office,
    seetime:req.query.seetime,
    doctor:req.query.doctor,
    brief:req.query.brief,
    prescribe:req.query.prescribe,
    stateid:req.query.stateid,
    doctorid:req.query.doctorid,
    patientid:req.query.patientid,
    isComment,
    result
  }


  res.render('index/bookInfo.ejs',options)


})

//监听个人信息页面
router.post('/selfCenter',async(req,res)=>{
  // console.log(req.body)
  let username = req.session.username;
  let arr,sqlStr;
  if(req.body.password){
    arr = [req.body.email,Md5(req.body.password),username]
    sqlStr = 'update user set email = ?,password = ? where username = ?'
    
  }else {
    arr = [req.body.email,username]
    sqlStr = 'update user set email = ? where username = ?'
  }
  await queryFn(sqlStr,arr)
  res.redirect('/index/private')

})


//上传接口
router.post('/selfCenter/imgUpload',upload.single('imgfile'),async(req,res)=>{
  let username = req.session.username;
  let result = rename(req)

  //将改名后的结果上传至数据库
  let strSql = 'update user set imgheader = ? where username = ?'
  await queryFn(strSql,[result.imgUrl,username])
  res.json(result)
  // console.log(result)
})

function rename(req){
  // console.log(req.file)
  //重命名上传的文件 
  let oldpath = req.file.destination+"/"+req.file.filename;
  let newpath = req.file.destination+"/"+req.file.filename;
  fs.rename(oldpath,newpath,()=>{
    // console.log("改名成功")
  })
  return {
    state:'ok',
    imgUrl:"/upload/"+req.file.filename
  }
}

router.post('/rgList/bookInfo',async(req,res)=>{
  let comment = req.body.comment;
  let star = req.body.star;
  let doctorid = req.body.doctorid;
  let patientid = req.body.patientid;
  let sqlStr = 'insert into doctorcomment (comment,star,doctorid,patientid) values (?,?,?,?)'
  await queryFn(sqlStr,[comment,star,doctorid,patientid])
  

})


module.exports = router;
