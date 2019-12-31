var express = require('express');
var router = express.Router();
var fs = require('fs');
const queryFn = require('../../../public/js/common/mysql');
//引入上传模块
const multer = require('multer');
//配置上传目录对象
const upLoad = multer({ dest: './public/upLoad' });
//引入改名模块
const rename = require('../../../public/js/common/rename');
//引入加密模块
const Md5 = require('../../../public/js/common/encryptMD5');


router.get('/', async (req, res) => {
    let sreach = req.query.sreach
    let page = parseInt(
      req.query.page && req.query.page > 0 ? req.query.page : 1
    );
    let sqlStr;
    let result;
    if(sreach!=undefined){
      sqlStr =
      'select people.id,num,doctor.doctorname,datatime.datatime,office.officename' +
      ' from `people` left join doctor' +
      ' on people.doctorid =doctor.id '+
      'left join datatime on people.doctorid=datatime.id '+
      'left join office on  people.officeid=office.id where doctorname in (?) limit ?,5';
      result = await queryFn(sqlStr, [sreach,(page - 1) * 5]);
      let sqlStr1 = 'SELECT COUNT(id) as count FROM `people` where doctorname=?' ;
      let count = await queryFn(sqlStr1,[sreach]);
      let countNumber = count[0].count;
      count = Math.ceil(count[0].count / 5);
      result = Array.from(result);
      var timearr=new Array()
      result.forEach((item,i)=>{
          let data = item.data;//提取查询结果中data日期
        if(data!=null){
          let dataSplit=data.split("-");
          data=time(dataSplit[0]);//提取第一个时间戳进行解析
          let data1=time(dataSplit[1])//提取第二个时间戳进行解析
          let dataAll=data+"-"+data1;//合并时间戳
          timearr.push(dataAll)//追加到数组里面
        }else{
          let dataAll = "实习生"  //没有设置值班时间，默认为实习生
          timearr.push(dataAll)
        } 
      })
      let options = {
        result, //计算结果
        page, //页数
        count, //总页数
        countNumber, //总条数
        timearr
       
      };
      console.log(options)
      res.render('admin/doctors/peopleList.ejs', options);
  
  //多表查询，计算出每页的数据--------------------------------------------
  }else{
    sqlStr ='select people.id,num,stipulate,doctor.doctorname,datatime.datatime,office.officename' +
    ' from `people` left join doctor' +
    ' on people.doctorid =doctor.id '+
    'left join datatime on people.datatimeid=datatime.id '+
    'left join office on  people.officeid=office.id limit ?,5';
     result = await queryFn(sqlStr, [(page - 1) * 5]);
      let sqlStr1 = 'SELECT COUNT(id) as count FROM `people`' ;
      let count = await queryFn(sqlStr1);
      let countNumber = count[0].count;
      count = Math.ceil(count[0].count / 5);
      result = Array.from(result);
      var timearr=new Array()
      result.forEach((item,i)=>{
          let data = item.data;//提取查询结果中data日期
        if(data!=null){
          let dataSplit=data.split("-");
          data=time(dataSplit[0]);//提取第一个时间戳进行解析
          let data1=time(dataSplit[1])//提取第二个时间戳进行解析
          let dataAll=data+"-"+data1;//合并时间戳
          timearr.push(dataAll)//追加到数组里面
        }else{
          let dataAll = "实习生"  //没有设置值班时间，默认为实习生
          timearr.push(dataAll)
        } 
      })
      let options = {
        result, //计算结果
        page, //页数
        count, //总页数
        countNumber, //总条数
        timearr
      
      };
      console.log(options);
      
      res.render('admin/doctors/peopleList.ejs', options);
      }
  
  });




/* router.get("/abc",async(req,res)=>{
  let datatime=req.body.datatime;//获取预约时间
  let doctorname=req.body.doctorname;//获取医生名称
  let officename=req.body.officename;//获取科室名称
  res.send(1234)
  //查询医生的上班时间
  //查询医生规定预约人数
  //判断预约人数是否大于规定人数
  //大于提示不能预约
  //小于就插入到预约表进行-有预约的时间，插入人数自增1;


}) */

function time(dataTime){
  var date=new Date(parseInt(dataTime))////时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y=date.getFullYear()+'-'
  var M=(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D=date.getDate();
  return Y+M+D;
}

//批量删除路由--------------------------------------------
router.post('/delUser', (req, res) => {
  let delId = req.body['data[]'];
  let type = typeof delId;
  if (type == 'string') {
    delId = [delId];
  }
  delId.forEach(async item => {
    let sqlStr = 'delete from people where id = ?';
    let arr = [item];
    await queryFn(sqlStr, arr);
  });
});




//查询所有科室--------------------------------------------
async function getOffice() {
  let sqlStr = 'select * from  office ';
  let result = await queryFn(sqlStr);
  return Array.from(result);
}
//把科室列表渲染--------------------------------------------
//添加模块--------------------------------------------
router.get ('/addpeople',async(req,res)=>{
 
    res.render('admin/doctors/peopleAdd')
})
/* router.post('/addpeople', async (req, res) => {
  let age = req.body.age;
  let gender = req.body.gender;
  let officeid = req.body.officeid;
  let doctorname = req.body.doctorname;
  let doctorheader = req.body.imgheader;
  let allpeople=req.body.allpeople;
  let dutyid=req.body.dutyid;
  let dataTime=req.body.data;
  dataTime=dataTime.split("-")//分割字符
  dataTime1=dataTime[0]+"-"+dataTime[1]+"-"+dataTime[2]//提取第一天时间年月日
  dataTime2=dataTime[3]+"-"+dataTime[4]+"-"+dataTime[5]//提取第二天时间年月日
  dataTime3=new Date(dataTime1)
  dataTime4=new Date(dataTime2)
  dataTime3=dataTime3.getTime();
  dataTime4=dataTime4.getTime();
  dataTime=dataTime3+"-"+dataTime4;//合并解析时间戳的结果
}) */




router.get("/peopledata",async(req,res)=>{
  let page = parseInt(
    req.query.page && req.query.page > 0 ? req.query.page : 1
  );
  let  sqlStr ='select people.id,num,stipulate,doctor.doctorname,datatime.datatime,office.officename' +
  ' from `people` left join doctor' +
  ' on people.doctorid =doctor.id '+
  'left join datatime on people.datatimeid=datatime.id '+
  'left join office on  people.officeid=office.id limit ?,5';
  let result = await queryFn(sqlStr, [(page - 1) * 5]);
  let sqlStr1 = 'SELECT COUNT(id) as count FROM `people`' ;
  let count = await queryFn(sqlStr1);
  let countNumber = count[0].count;
  count = Math.ceil(count[0].count / 5);
  result = Array.from(result);
  var timearr=new Array()
  result.forEach((item,i)=>{
      let data = item.data;//提取查询结果中data日期
    if(data!=null){
      let dataSplit=data.split("-");
      data=time(dataSplit[0]);//提取第一个时间戳进行解析
      let data1=time(dataSplit[1])//提取第二个时间戳进行解析
      let dataAll=data+"-"+data1;//合并时间戳
      timearr.push(dataAll)//追加到数组里面
    }else{
      let dataAll = "实习生"  //没有设置值班时间，默认为实习生
      timearr.push(dataAll)
    } 
  })
  let options = {
    result, //计算结果
    page, //页数
    count, //总页数
    countNumber, //总条数
    timearr
  
  };
  console.log(options);
  
  res.render('admin/doctors/peopledata.ejs', options);

})

module.exports = router;