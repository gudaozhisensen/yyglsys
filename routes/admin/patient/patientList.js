var express = require('express');
var router = express.Router();
let fs = require('fs');
var queryFu = require('../../../public/js/common/mysql');
var MD5 = require('../../../public/js/common/encryptMD5');
var rename = require('../../../public/js/common/rename');
//引入上传模块
let multer = require('multer');
//配置上传对象
let upload = multer({dest:"./public/upload"})


//时间处理--------------------------------------------
function time(timestamp){
    var date = new Date(parseInt(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate()
    return Y+M+D;
}


//患者修改信息页面--------------------------------------------
router.get('/edituser',async function(req, res) {
    let patientid = req.query.id
    let sqlStr = "SELECT patient.alterstate,patient.id,`user`.imgheader,patient.patientname,patient.gender,patient.phone_number,patient.email,patient.regtime,patient.seetime,doctor.doctorname,patient.stateid,patient.brief,patient.prescribe FROM patient left JOIN doctor on patient.doctorid = doctor.id left JOIN user on patient.patientname = `user`.username and patient.phone_number = `user`.phone_number and patient.email = `user`.email where patient.id = ?"
    let result = await queryFu(sqlStr,[patientid])
    result = Array.from(result);
    let regtime = await time(result[0].regtime)
    let seetime = await time(result[0].seetime)
    let state = await getstate()
    let sqlStr1 = "select items,drugname from drugs";
    let drugNum = await queryFu(sqlStr1);
    result = {result,state,drugNum,regtime,seetime}
    res.render('admin/patient/patientInfo',result)
});


async function getstate(){
    let sqlStr = 'select * from state';
    let result = await queryFu(sqlStr);
    return Array.from(result);
}


//患者修改请求--------------------------------------------
router.post('/patientInfo',async (req,res)=>{
    let phone_number = req.body['data[phone_number]'];
    let regtime = req.body['data[regtime]'];
    let seetime = req.body['data[seetime]'];
    let brief = req.body['data[content]'];
    let stateid = req.body['data[stateid]'];
    let prescribeAll = req.body.arr;
    prescribeAll = JSON.parse(prescribeAll)
    let prescribe = "";
    prescribeAll.forEach(async (item,i)=>{
        if(i<1){
            prescribe = prescribe + item.drug + ":" + item.num
        }else{
            prescribe = prescribe + "," + item.drug + ":" + item.num
        }
        let name = item.drug;
        let sqlStr = "select items from drugs where drugname = ?"
        let result = await queryFu(sqlStr,[name]);
        let number = parseInt(result[0].items)-parseInt(item.num)
        let update = "update drugs set items = ? where drugname = ?"
        await queryFu(update,[number,name])
    })
    let alterstate = "true"
    let arr = [regtime,seetime,brief,stateid,prescribe,alterstate,phone_number]
    let sqlStr = "update patient set regtime=?,seetime=?,brief=?,stateid=?,prescribe=?,alterstate=? where phone_number = ?";
    await queryFu(sqlStr,arr);
    res.send("页面上传成功")
})


//药品名字查询--------------------------------------------
router.post('/change',async (req,res)=>{
    let prescribe = req.body.search;
    let sqlStr = "select drugname from drugs where drugname like ?";
    let result = await queryFu(sqlStr,["%"+prescribe+"%"]);
    res.json({
        drugInfo:Array.from(result)
    })
})


//药品数量查询--------------------------------------------
router.post('/drugnum',async (req,res)=>{
    let drugname = req.body.drugname;
    let sqlStr = "select items from drugs where drugname = ?"
    let result = await queryFu(sqlStr,[drugname]);
    res.json({
        state:"ok",
        content:result
    })
})
  


//患者添加页面--------------------------------------------
async function getpatient(){
    let sqlStr = 'select * from patient';
    let result = await queryFu(sqlStr);
    return Array.from(result);
}


router.get('/addpatient',async (req,res)=>{
    let result = await getpatient();
    let sqlStr = "select * from state"
    let state = await queryFu(sqlStr)
    let sqlStr1 = "select id,doctorname from doctor"
    let doctor = await queryFu(sqlStr1)
    let options = {result,state,doctor};
    res.render('admin/patient/addpatient',options)
})

//添加请求--------------------------------------------
router.post('/addpatient',async (req,res)=>{
    let password = MD5('123456');
    let email = req.body.email;
    let phone_number = req.body.mobile;
    let roleid = '45';
    let username = req.body.username;
    let imgheader = req.body.imgheader;

    let patientname = req.body.patientname;
    let gender = req.body.gender;
    let regtime = req.body.regtime;
    let seetime = req.body.seetime;
    let stateid = '1';
    let name = req.session.username;
    let sqlStr3 = "select id from user where username = ?"
    let result3 = await queryFu(sqlStr3,[name]);
    let sqlStr4 = "select id from doctor where userid = ?"
    let result4 = await queryFu(sqlStr4,[result3[0].id]);
    let doctorid = result4[0].id
    regtime = new Date(regtime);
    seetime = new Date(seetime);
    regtime = regtime.getTime();
    seetime = seetime.getTime();
    //判断用户名是否存在
    let sqlStr1 = "select * from user where username = ?";
    let result1 = await queryFu(sqlStr1,[username]);
    if(result1.length==0){
        //插入用户表
        let sqlStr = "insert into user (username,name,password,gender,email,phone_number,imgheader,roleid) value (?,?,?,?,?,?,?,?)";
        let arr = [username,patientname,password,gender,email,phone_number,imgheader,roleid];
        await queryFu(sqlStr,arr);

        //插入患者表
        let sqlStr2 = "insert into patient (patientname,gender,email,phone_number,regtime,seetime,doctorid,stateid) value (?,?,?,?,?,?,?,?)";
        let arr2 = [patientname,gender,email,phone_number,regtime,seetime,doctorid,stateid]
        await queryFu(sqlStr2,arr2);
        res.json({
            state:"ok",
            content:"个人信息增加成功"
        })
    }else{
        let sqlStr2 = "insert into patient (patientname,gender,email,phone_number,regtime,seetime,doctorid,stateid) value (?,?,?,?,?,?,?,?)";
        let arr2 = [patientname,gender,email,phone_number,regtime,seetime,doctorid,stateid]
        await queryFu(sqlStr2,arr2);
        res.json({
            state:"ok",
            content:"个人信息增加成功"
        })
    }
})

router.post('/addimgupload',upload.single('imgfile'),async (req,res)=>{
    let result = rename(req);
    res.json(result);
})


module.exports = router;
