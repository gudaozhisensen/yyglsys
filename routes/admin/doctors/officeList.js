//科室管理--------------------------------------------
var express = require('express');
var router = express.Router();
var fs = require('fs')
const queryFn = require('../../../public/js/common/mysql');
//引入上传模块
const multer = require('multer');
//配置上传目录对象
const upLoad = multer({ dest: './public/upLoad' });
 //引入改名模块
const rename = require("../../../public/js/common/rename"); 
//引入加密模块
const Md5 = require('../../../public/js/common/encryptMD5');

//渲染科室列表模板--------------------------------------------
router.get('/', async(req, res)=>{
    let sreach=req.query.sreach;
    let page = parseInt(
      req.query.page && req.query.page > 0 ? req.query.page : 1
    );
    let sqlStr;
    let result;
    let sqlStr1;
    let count;
    let countNumber;
    let options;
  //搜索--------------------------------------------
  if(sreach){
     
      sqlStr="select * from office where officename= ?";
      result = await queryFn(sqlStr, [sreach, (page - 1) * 5]);
      
      sqlStr1 = 'SELECT COUNT(id) as count FROM `office` where officename=?';
      count = await queryFn(sqlStr1,[sreach]);
      countNumber = count[0].count;
      count = Math.ceil(count[0].count / 5);
      result = Array.from(result);
      options={
          result, //计算结果
          page,   //页数
          count,  //总页数
          countNumber //总条数
      };
      res.render("admin/doctors/officeList.ejs",options);
   
    

     //正常科室列表显示--------------------------------------------
    }else{
    sqlStr ="select * from office limit ?,5";
    result = await queryFn(sqlStr, [(page - 1) * 5]);
  
    sqlStr1 = 'SELECT COUNT(id) as count FROM `office`';
    count = await queryFn(sqlStr1);
    countNumber = count[0].count;
    count = Math.ceil(count[0].count / 5);
    result = Array.from(result);
    options={
        result, //计算结果
        page,   //页数
        count,  //总页数
        countNumber //总条数
    };
    res.render("admin/doctors/officeList.ejs",options);
    }
})


//批量删除路由--------------------------------------------
router.post('/delUser', (req, res) => {
  let delId = req.body['data[]'];
  let type = typeof delId;
  if (type == 'string') {
    delId = [delId];
  }
  delId.forEach(item => {
    let sqlStr = 'delete from office where id = ?';
    let arr = [item];
    queryFn(sqlStr, arr);
  });
});


//修改科室信息路由--------------------------------------------
router.get("/modification",async(req,res)=>{
  let officeid = req.query.id;
  //通过id查找所有的信息
  let sqlStr = "select *  from office where id=?"
  let result = await queryFn(sqlStr,[officeid]);
  result = result[0];
  res.render('admin/doctors/officeMod',{result});
})



//修改科室信息进行提交-------------------------------------------
router.post("/modification",async(req,res)=>{
  let officeid=req.query.id
  let brief=req.body.brief;
     let sqlStr = "update office set brief=? where id=?";
     let arr = [brief,officeid]
     await queryFn(sqlStr,arr);
     res.json({
       state:"ok",
       content:"科室信息更新成功"
     })
 })

 



//添加模块--------------------------------------------
router.get('/addoffices',async (req,res)=>{
  res.render('admin/doctors/officeAdd')
})

//添加科室--------------------------------------------
router.post('/addoffices',async (req,res)=>{
  let officename=req.body.officename;
  let brief=req.body.brief;
  console.log(brief);
  
 //判断科室名称是否重复
 let sql="select * from office where officename=?";
 let sqlresult=await queryFn(sql,[officename])
 console.log(sqlresult);
 if(sqlresult.length==0){
   let sqlStr = "insert into office (officename,brief) values (?,?)";
   let arr=[officename,brief]
   let result= await queryFn(sqlStr,arr);
   res.json({
     state:"ok",
     content:"添加成功"
   })
}else{
 res.json({
     state:"fail",
     content:"科室已存在"
 })
}
})

module.exports = router;