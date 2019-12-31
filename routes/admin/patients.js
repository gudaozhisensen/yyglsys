//模块导入--------------------------------------------
const express = require('express');
const router = express.Router();
const queryFn = require('../../public/js/common/mysql');


//中间模块导入--------------------------------------------
const patientInfo = require('./patient/patientList')


//时间处理--------------------------------------------
function time(timestamp){
  var date = new Date(parseInt(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = date.getDate()
  return Y+M+D;
}


//患者管理首页--------------------------------------------
router.get('/',async function(req, res) {
  let day = new Date();
  day.setTime(day.getTime());
  let newDay = day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
  newDay = new Date(newDay);
  newDay = newDay.getTime();
  let username = req.session.username;
  let sqlStr2 = 'SELECT roleid,id FROM user where username = ?';
  let result2 = await queryFn(sqlStr2,[username]);
  if(result2[0].roleid==27){
    let sqlStr = "SELECT patient.id,`user`.imgheader,patient.patientname,patient.gender,patient.phone_number,patient.email,patient.regtime,patient.seetime,doctor.doctorname,patient.brief,patient.prescribe,state.state FROM patient left JOIN doctor on patient.doctorid = doctor.id left JOIN user on patient.patientname = `user`.username and patient.phone_number = `user`.phone_number and patient.email = `user`.email left JOIN state on patient.stateid = state.id limit ?,5";
    let page = parseInt(
      req.query.page && req.query.page > 0 ? req.query.page : 1
    );
    let result = await queryFn(sqlStr,[(page - 1) * 5]);
    let sqlStr1 = 'SELECT COUNT(id) as count FROM patient';
    let count = await queryFn(sqlStr1);
    let countNumber = count[0].count;
    count = Math.ceil(count[0].count / 5);
    result = Array.from(result);
    let timereg = [];
    let timesee = [];
    async function shijian(){
      if(result.length<2){
        if(result[0].seetime!=null){
          let seetime = await time(result[0].seetime)
          timesee.push(seetime)
        }else{
          timesee.push('null')
        }
      }else{
        result.forEach(async (item,i)=>{
          if(item.seetime!=null){
            let seetime = await time(item.seetime)
            timesee.push(seetime)
          }else{
            timesee.push('null')
          }
        })
      }
      if(result.length<2){
        if(result[0].regtime!=null){
          let regtime = await time(result[0].regtime)
          timereg.push(regtime)
        }else{
          timereg.push('null')
        }
      }else{
        result.forEach(async (item,i)=>{
          if(item.regtime!=null){
            let regtime = await time(item.regtime)
            timereg.push(regtime)
          }else{
            timereg.push('null')
          }
        })
      }
    }
    await shijian()
    res.render('admin/patient/patient',{ result, page, count, countNumber,timereg,timesee });
  }else if(result2[0].roleid==43){
    let sqlStr3 = "select id from doctor where userid = ?"
    let result3 = await queryFn(sqlStr3,[result2[0].id]);
    let sqlStr = "SELECT patient.id,`user`.imgheader,patient.patientname,patient.gender,patient.phone_number,patient.email,patient.regtime,patient.seetime,doctor.doctorname,patient.brief,patient.prescribe,state.state FROM patient left JOIN doctor on patient.doctorid = doctor.id left JOIN user on patient.patientname = `user`.username and patient.phone_number = `user`.phone_number and patient.email = `user`.email left JOIN state on patient.stateid = state.id where patient.doctorid = ? and patient.seetime = ? limit ?,5";
    let page = parseInt(
      req.query.page && req.query.page > 0 ? req.query.page : 1
    );
    let result = await queryFn(sqlStr, [result3[0].id,newDay,((page - 1) * 5)]);
    let sqlStr1 = 'SELECT COUNT(id) as count FROM patient where patient.doctorid = ? and patient.seetime = ?';
    let count = await queryFn(sqlStr1,[result3,newDay]);
    let countNumber = count[0].count;
    count = Math.ceil(count[0].count / 5);
    result = Array.from(result);
    let timereg = [];
    let timesee = [];
    if(result.length!=0){
      async function shijian(){
        if(result.length<2){
          if(result[0].seetime!=null){
            let seetime = await time(result[0].seetime)
            timesee.push(seetime)
          }else{
            timesee.push('null')
          }
        }else{
          result.forEach(async (item,i)=>{
            if(item.seetime!=null){
              let seetime = await time(item.seetime)
              timesee.push(seetime)
            }else{
              timesee.push('null')
            }
          })
        }
        if(result.length<2){
          if(result[0].regtime!=null){
            let regtime = await time(result[0].regtime)
            timereg.push(regtime)
          }else{
            timereg.push('null')
          }
        }else{
          result.forEach(async (item,i)=>{
            if(item.regtime!=null){
              let regtime = await time(item.regtime)
              timereg.push(regtime)
            }else{
              timereg.push('null')
            }
          })
        }
      }
      await shijian()
    }
    
    res.render('admin/patient/patient',{ result, page, count, countNumber,timereg,timesee });
  }
  
});

//患者列表单个删除--------------------------------------------
router.post('/delpatient',async (req,res)=>{
  let patientid = req.body.patientid;
    let sqlStr = 'delete from patient where id = ?';
    let result = await queryFn(sqlStr,[patientid]);
    res.json({
        state:"ok",
        content:Array.from(result)
    })
})


//患者列表多个个删除--------------------------------------------
router.post('/delpatients',async (req,res)=>{
  let dellist = req.body['dellist[]'];
  if(dellist.length>2){
    dellist.forEach(async (item,i) => {
      let sqlStr = "delete from patient where id = ?"
      await queryFn(sqlStr,item);
    });
  }else{
    let sqlStr = "delete from patient where id = ?"
    await queryFn(sqlStr,dellist);
  }
  res.json({
    state:"ok",
    constent:"删除成功"
  })
})


//搜索--------------------------------------------
router.post('/searchpatient',async (req,res)=>{
  let day = new Date();
  day.setTime(day.getTime());
  let newDay = day.getFullYear()+"-"+(day.getMonth()+1)+"-"+day.getDate();
  newDay = new Date(newDay);
  newDay = newDay.getTime();
  let username = req.session.username;
  let searchName = req.body.searchName;
  let sqlStr2 = 'SELECT roleid,id FROM user where username = ?';
  let result2 = await queryFn(sqlStr2,[username]);
  if(result2[0].roleid==27){
    let sqlStr = "SELECT patient.id,`user`.imgheader,patient.patientname,patient.gender,patient.phone_number,patient.email,patient.regtime,patient.seetime,doctor.doctorname,patient.brief,patient.prescribe,state.state FROM patient left JOIN doctor on patient.doctorid = doctor.id left JOIN user on patient.patientname = `user`.username and patient.phone_number = `user`.phone_number and patient.email = `user`.email left JOIN state on patient.stateid = state.id where patient.patientname = ? or patient.phone_number = ? limit ?,5";
    let page = parseInt(
      req.query.page && req.query.page > 0 ? req.query.page : 1
    );
    let result = await queryFn(sqlStr, [searchName,searchName,(page - 1) * 5]);
    let sqlStr1 = 'SELECT COUNT(id) as count FROM patient';
    let count = await queryFn(sqlStr1);
    let countNumber = count[0].count;
    count = Math.ceil(count[0].count / 5);
    result = Array.from(result);
    let timereg = [];
    let timesee = [];
    async function shijian(){
      if(result.length<2){
        if(result[0].seetime!=null){
          let seetime = await time(result[0].seetime)
          timesee.push(seetime)
        }else{
          timesee.push('null')
        }
      }else{
        result.forEach(async (item,i)=>{
          if(item.seetime!=null){
            let seetime = await time(item.seetime)
            timesee.push(seetime)
          }else{
            timesee.push('null')
          }
        })
      }
      if(result.length<2){
        if(result[0].regtime!=null){
          let regtime = await time(result[0].regtime)
          timereg.push(regtime)
          
        }else{
          timereg.push('null')
        }
      }else{
        result.forEach(async (item,i)=>{
          if(item.regtime!=null){
            let regtime = await time(item.regtime)
            timereg.push(regtime)
          }else{
            timereg.push('null')
          }
        })
      }
    }
    await shijian()
    res.render('admin/patient/patient',{ result, page, count, countNumber,timereg,timesee });
  }else if(result2[0].roleid==43){
    let sqlStr3 = "select id from doctor where userid = ?"
    let result3 = await queryFn(sqlStr3,[result2[0].id]);
    let sqlStr = "SELECT patient.id,`user`.imgheader,patient.patientname,patient.gender,patient.phone_number,patient.email,patient.regtime,patient.seetime,doctor.doctorname,patient.brief,patient.prescribe,state.state FROM patient left JOIN doctor on patient.doctorid = doctor.id left JOIN user on patient.patientname = `user`.username and patient.phone_number = `user`.phone_number and patient.email = `user`.email left JOIN state on patient.stateid = state.id where patient.doctorid = ? and (patient.patientname = ? or patient.phone_number = ?) and patient.seetime = ? limit ?,5";
    let page = parseInt(
      req.query.page && req.query.page > 0 ? req.query.page : 1
    );
    let result = await queryFn(sqlStr, [result3[0].id,searchName,searchName,newDay,((page - 1) * 5)]);
    let sqlStr1 = 'SELECT COUNT(id) as count FROM patient where patient.doctorid = ?';
    let count = await queryFn(sqlStr1,[result3]);
    let countNumber = count[0].count;
    count = Math.ceil(count[0].count / 5);
    result = Array.from(result);
    let timereg = [];
    let timesee = [];
    if(result.length!=0){
      async function shijian(){
        if(result.length<2){
          if(result[0].seetime!=null){
            let seetime = await time(result[0].seetime)
            timesee.push(seetime)
          }else{
            timesee.push('null')
          }
        }else{
          result.forEach(async (item,i)=>{
            if(item.seetime!=null){
              let seetime = await time(item.seetime)
              timesee.push(seetime)
            }else{
              timesee.push('null')
            }
          })
        }
        if(result.length<2){
          if(result[0].regtime!=null){
            let regtime = await time(result[0].regtime)
            timereg.push(regtime)
            
          }else{
            timereg.push('null')
          }
        }else{
          result.forEach(async (item,i)=>{
            if(item.regtime!=null){
              let regtime = await time(item.regtime)
              timereg.push(regtime)
            }else{
              timereg.push('null')
            }
          })
        }
      }
      await shijian()
    }
    
    res.render('admin/patient/patient',{ result, page, count, countNumber,timereg,timesee });
  }
})



router.post('/register',async (req,res)=>{
  let id = req.body.id
  let sqlStr = "select allpeople,people from doctor where id = ?";
  let result = await queryFn(sqlStr,[id]);
  let allpeople = result[0]
  let people = result[1]
  if(allpeople>0){
    allpeople = allpeople-1;
    people = people+1;
    let sqlStr1 = "update doctor set allpeople = ?,people = ? where id = ?"
    await queryFn(sqlStr1,[allpeople,people,id])
  }
})




//患者列表修改--------------------------------------------
router.use('/patientInfo',patientInfo)

module.exports = router;
