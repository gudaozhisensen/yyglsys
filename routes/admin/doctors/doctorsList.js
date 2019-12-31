//医生管理--------------------------------------------
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

//渲染医生列表模板--------------------------------------------
//多表查询，计算出每页的数据--------------------------------------------
//查询--------------------------------------------
router.get('/', async (req, res) => {
  let sreach = req.query.sreach
  let page = parseInt(
    req.query.page && req.query.page > 0 ? req.query.page : 1
  );
  let sqlStr;
  let result;
  if(sreach!=undefined){
    let sqlStrDuty="select id from duty where dutyname=?";//查询值班
    let sqlOffice="select id from office where officename=?";//查询科室名称
    let resultDuty=await queryFn(sqlStrDuty,[sreach]);
    let resultOffice=await queryFn(sqlOffice,[sreach]);
    function queryid(){//判断进行科室搜索时候执行第二个if语句，为值班日期默认赋值为id:0
      if (resultOffice.length==0) {
        resultOffice= [{ id:0 }]
      }
      if(resultDuty.length==0){
        resultDuty= [{ id:0 }]
      }
    }
    await queryid()
    sqlStr =
    'select doctor.id, doctorname,age,gender,allpeople,people,doctorheader,data,duty.dutyname,office.officename' +
    ' from `doctor` left join office' +
    ' on doctor.officeid = office.id left join duty on doctor.dutyid=duty.id where doctorname in (?) or officename in (?) or dutyid in (?)  limit ?,5';
    result = await queryFn(sqlStr, [sreach,sreach,resultDuty[0].id,(page - 1) * 5]);
    let sqlStr1 = 'SELECT COUNT(id) as count FROM `doctor` where doctorname=? or officeid=? or dutyid=?' ;
    let count = await queryFn(sqlStr1,[sreach,resultOffice[0].id,resultDuty[0].id]);
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
    res.render('admin/doctors/doctorsList.ejs', options);

//多表查询，计算出每页的数据--------------------------------------------
}else{
  sqlStr ='select doctor.id, doctorname,age,gender,allpeople,people,doctorheader,data,duty.dutyname,office.officename,doctortitle.doctortitle' +
      ' from `doctor` left join office' +
      ' on doctor.officeid = office.id '+
      'left join duty on doctor.dutyid=duty.id left join doctortitle on doctor.doctortitleid=doctortitle.id limit ?,5';
   result = await queryFn(sqlStr, [(page - 1) * 5]);
    let sqlStr1 = 'SELECT COUNT(id) as count FROM `doctor`' ;
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
    res.render('admin/doctors/doctorsList.ejs', options);
    }

});
/* //获取星期几的-----------------------------------------
function getDateTime(){
    var a = new Array("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday" ,"Sunday" );  
      var week = new Date().getDay();  
      //var str = "今天是星期"+ a[week]; 
      return a[week]; 
      
} */
//解析时间戳--------------------------------------------
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
    let sqlStr = 'delete from doctor where id = ?';
    let sqlStr1 =
      'delete from user where name = (select doctorname from doctor where id = ?)';
    let arr = [item];
    await queryFn(sqlStr1, arr);
    queryFn(sqlStr, arr);
  });
});

//修改医生个人信息路由--------------------------------------------
router.get('/modification', async (req, res) => {
  let doctorsid = req.query.id;
  //通过id查找所有的信息
  //let sqlStr = "select *,office.officename  from doctor  inner join office on doctor.officeid=office.id where doctor.id =?";
  let sqlStr = 'select * from doctor where id=?';
  let result = await queryFn(sqlStr, [doctorsid]);
   result=result[0]
   var timearr=new Array()
   console.log( result);
        let data = result.data;//提取查询结果中data日期
        let dataSplit=data.split("-");
        data=time(dataSplit[0]);//提取第一个时间戳进行解析
        let data1=time(dataSplit[1])//提取第二个时间戳进行解析
        let dataAll=data+"-"+data1;//合并时间戳
        timearr.push(dataAll)
  let officename = await getOffice();//科室
  let dutyname =await getDuty()//值班时段
  let doctortitle=await getdoctortitle()//医生职务

  res.render('admin/doctors/doctorsMod', { result,officename,dutyname,doctortitle,timearr});
});

//查询所有科室--------------------------------------------
async function getOffice() {
  let sqlStr = 'select * from  office ';
  let result = await queryFn(sqlStr);
  return Array.from(result);
}

//查询所有值班时段--------------------------------------------
async function getDuty(){
  let sqlStr="select * from duty";
  let result =await queryFn(sqlStr);
  return Array.from(result);
}
//查询所有职务--------------------------------------------
async function getdoctortitle(){
  let sqlStr="select * from doctortitle";
  let result=await queryFn(sqlStr);
  return Array.from(result);
}

//提交修改的医生个人头像--------------------------------------------
router.post('/selfimgupload/', upLoad.single('imgfile'), async (req, res) => {
  let doctorsid = req.query.id;
  let result = rename(req);
  //将改名后的结果，上传到数据库
  let sqlStr = 'update doctor set doctorheader=? where id=?';
  await queryFn(sqlStr, [result.imgUrl, doctorsid]);

  res.json(result);
});

//修改医生处理表单提交--------------------------------------------
router.post('/modification', async (req, res) => {
  let doctorsid = req.query.id;
  let age = req.body.age;
  let gender = req.body.gender;
  let officeid = req.body.officeid;
  let doctorname = req.body.doctorname;
  let allpeople=req.body.allpeople;
  let dutyid=req.body.dutyid;
  let dataTime=req.body.data;//
  let doctortitleid=req.body.doctortitleid;
  console.log(doctortitleid);
  dataTime=dataTime.split("-")//分割字符
  dataTime1=dataTime[0]+"-"+dataTime[1]+"-"+dataTime[2]//提取第一天时间年月日
  dataTime2=dataTime[3]+"-"+dataTime[4]+"-"+dataTime[5]//提取第二天时间年月日
  dataTime3=new Date(dataTime1)
  dataTime4=new Date(dataTime2)
  dataTime3=dataTime3.getTime();
  dataTime4=dataTime4.getTime();
  dataTime=dataTime3+"-"+dataTime4;//合并解析时间戳的结果

  
  let sqlstr1 =
    'update user set name =? where id = (select userid from doctor where id = ?)';
  await queryFn(sqlstr1, [doctorname, doctorsid]);
  let sqlStr =
    'update doctor set age=?,gender=?,officeid=?,doctorname=?,allpeople=?,dutyid=?,data=?,doctortitleid=? where id=?';
  let arr = [age, gender, officeid, doctorname, allpeople,dutyid,dataTime,doctortitleid,doctorsid];
  await queryFn(sqlStr, arr);
  res.json({
    state: 'ok',
    content: '个人信息更新成功'
  });
});
//添加模块--------------------------------------------
//把科室列表渲染--------------------------------------------
router.get('/addDoctors', async (req, res) => {
  let officename = await getOffice();
  let dutyname=await getDuty()
  let doctortitle=await getdoctortitle()//医生职务
  console.log(dutyname);
  res.render('admin/doctors/doctorsAdd', { officename,dutyname, doctortitle });
});

//添加医生--------------------------------------------
router.post('/addDoctors', async (req, res) => {
  let age = req.body.age;
  let gender = req.body.gender;
  let officeid = req.body.officeid;
  let doctorname = req.body.doctorname;
  let doctorheader = req.body.imgheader;
  let allpeople=req.body.allpeople;
  let dutyid=req.body.dutyid;
  let dataTime=req.body.data;
  let doctortitleid=req.body.doctortitleid;
  dataTime=dataTime.split("-")//分割字符
  dataTime1=dataTime[0]+"-"+dataTime[1]+"-"+dataTime[2]//提取第一天时间年月日
  dataTime2=dataTime[3]+"-"+dataTime[4]+"-"+dataTime[5]//提取第二天时间年月日
  dataTime3=new Date(dataTime1)
  dataTime4=new Date(dataTime2)
  dataTime3=dataTime3.getTime();
  dataTime4=dataTime4.getTime();
  dataTime=dataTime3+"-"+dataTime4;//合并解析时间戳的结果
  //新增用户，默认密码为123456
  let sqlStr1 = 'select * from user where username = ?';
  let result = await queryFn(sqlStr1, [doctorname]);
  if (result.length != 0) {
    res.json({
      state: 'arr',
      content:
        '该用户名已存在，无法创建用户，请联系管理员（添加医生默认以该名字注册用户）'
    });
  } else {
    let sqlStr2 =
      'insert into user (username,name,gender,age,password,imgheader,roleid) values (?,?,?,?,?,?,?)';
    let password = Md5(123456);
    let arr1 = [doctorname, doctorname, gender, age, password,doctorheader,43];
    await queryFn(sqlStr2, arr1);

    let sqlStr3 = 'select id from user where username = ?';
    let result = await queryFn(sqlStr3, [doctorname]);
    let userid = result[0].id;
    let people=0;
    let sqlStr =
      'insert into doctor (doctorname,gender,age,officeid,doctorheader,userid,people,allpeople,dutyid,data,doctortitleid) values (?,?,?,?,?,?,?,?,?,?,?)';
    let arr = [doctorname, gender, age, officeid, doctorheader, userid,people,allpeople,dutyid,dataTime,doctortitleid];
    console.log(arr);
    
    await queryFn(sqlStr, arr);

    res.json({
      state: 'ok',
      content: '添加成功'
    });
  }
});

//提交增加医生头像-------------------------------------------
router.post('/addimgupload', upLoad.single('imgfile'), async (req, res) => {
  console.log(req);
  let result = rename(req);
  /* 
  let strSql = 'update doctor set doctorheader=? where doctorname=?';
  await queryFn(strSql, [result.imgUrl, doctorname]); */
  res.json(result);
});
//修改医生挂号人数-------------------------------------------
//无






module.exports = router;
