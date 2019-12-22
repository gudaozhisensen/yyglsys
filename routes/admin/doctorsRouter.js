var express = require('express');
var doctor = express.Router();
var sqlQuery = require('../../module/connectMysql');
var jiami = require('../../module/jiami');

//验证登录状态
function permisson(req,res,next){
  if(req.session.username == undefined){

  }else{
    next();
  }
}

/**********************页面part**************************************/ 
// ***fake index 只是进入doctor页面的入口
doctor.get('/', async(req, res, next)=> {
  // let result =  await sqlQuery;
  req.session.username = 'admin';
  res.render('index',{
    username : req.session.username
  });
});


/*医生详情页*/ 
doctor.get('/doctors', async(req, res, next)=> {
  req.session.username = "admin";
  res.render("admin/doctors/doctors",{
    username : req.session.username
  });
});


/*管理员添加医生信息页*/
doctor.get('/doctors/add', async(req,res,next)=>{
  let sqlStr = 'SELECT * FROM offices where pid=0';
  //获得科室的父分类
  let result = await sqlQuery(sqlStr);
  let options = {

    officesF : Array.from(result)
  }
  res.render('admin/doctors/add',options);
})


/*管理员修改医生信息页*/
doctor.get('/doctors/edit', async(req,res,next)=>{
  let id = req.query.id;
  //获得科室的父分类
  let sqlStr = 'SELECT * FROM offices where pid=0';
  let result = await sqlQuery(sqlStr);
  let sqlStr1 = 'select * from doctor where id=?'
  let result1 = await sqlQuery(sqlStr1,id);
  let options = {
    officesF: result,
       infos: result1[0]
  }
  console.log(options.infos);
  res.render('admin/doctors/edit',options);
})


// 密码修改页面
doctor.get('/doctors/key', async(req,res,next)=>{
  let id = req.query.id;
  let sqlStr = 'SELECT doctor.id, doctor.doctorname, doctor.password FROM doctor where id=?';
  let result = await sqlQuery(sqlStr,id);
  
  let options = {
    info: result[0]
}
res.render('admin/doctors/updateKey',options);
})


/*********************数据获取part*******************************/ 

/*医生数据api */ 
doctor.get('/api/doctors', async(req, res, next)=> {
  let page = parseInt(req.query.page);
  let limitNum = parseInt(req.query.limit);
  let sqlStr = 'SELECT doctor.id,doctor.doctorname,doctor.password,doctor.age,doctor.sex,doctor.title,doctor.avatar,doctor.mobile,doctor.email,doctor.patientcount,offices.name,doctor.state FROM doctor LEFT JOIN offices on doctor.officesid = offices.id limit ?,?';
  let sqlStr1 = "SELECT COUNT(doctor.id) as usernum FROM doctor ";
  let arr = [(page-1)*limitNum, limitNum];
  let result =  await sqlQuery(sqlStr, arr);
  //获取医生总数
  let result1 = await sqlQuery(sqlStr1);
  let count = result1[0].usernum;
  let options = {
    "code": 0,
     "msg": "",
    "data": Array.from(result),
   "count": count
  }
  res.json(options);
});


/*添加医生信息api操作*/
doctor.post('/api/doctors/add', async(req,res,next)=>{
  let data = req.body;
  let sqlStr = 'INSERT INTO doctor (doctorname,password,age,sex,title,avatar,mobile,email,officesid,patientcount,state) '+' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
  let username = data.username;
  let password = jiami(data.password);
  let age = data.age;
  let sex = data.sex;
  let title = data.title;
  let avatar = data.avatar;
  let mobile = data.phone;
  let email = data.email; 
  let officesid = data.officeZ;
  let patientcount = data.patient; 
  let state = data.state;
  // console.log(data); 
  let arr = [username,password,age,sex,title,avatar,mobile,email,officesid,patientcount,state];
  await sqlQuery(sqlStr,arr);
  res.json({ 
    state:"ok",
    content:"添加成功"
  });
})

//添加医生中科室选择接口
doctor.post('/api/doctors/select',async function(req,res,next){
  let data = req.body;
  let sqlStr = 'SELECT o2.pid,o2.id,o2.name FROM offices as o1 INNER JOIN offices o2 ON o1.id= o2.pid where o1.id=?';
  let result = await sqlQuery(sqlStr,data.value);
  res.json(result);
})

/*删除医生信息api操作*/

doctor.post('/api/doctors/del', async(req, res, next)=> {
    let data = req.body;
    let sqlStr = 'DELETE FROM doctor WHERE id=?';
    await sqlQuery(sqlStr,data.id);
    res.json({ 
      state:"ok",
      content:"成功"
    });
})

// 重置密码api操作
doctor.post('/api/doctors/key', async(req, res, next)=> {
    let data = req.body;
    let id = req.query.id;
    let sqlStr = 'UPDATE doctor SET password=? WHERE id=?';
    await sqlQuery(sqlStr,[(data.psd),id]);
    res.json({
      state:"ok",
      content:"重置成功"
    })
});


doctor.post('/api/doctors/edit',async(req, res, next)=>{
  let data = req.body;
  console.log(data);
})
module.exports = doctor;
