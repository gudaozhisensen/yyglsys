var express = require('express');
var router = express.Router();
var fs = require('fs');
const queryFn = require('../../../public/js/common/mysql');


//时间处理--------------------------------------------
function time(timestamp){
    var date = new Date(parseInt(timestamp));//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = date.getDate()
    return Y+M+D;
}

router.post('/makeNum',async (req,res)=>{
    
    
    res.render('index/index.ejs')
    var curDate = new Date()
    var curYear =curDate.getFullYear();
    var curMonth = curDate.getMonth()+1;
    var curDay = curDate.getDate();
    var Current= curYear+"-"+curMonth+"-"+curDay
    Current = new Date(Current);
    Current = Current.getTime();
    let username = req.session.username;
    let seetime = req.body.time;
    seetime = new Date(seetime);
    seetime = seetime.getTime();
    let office = req.body.keshi;
    let sqlStr2 = "select id from office where officename = ?"
    let result2 = await queryFn(sqlStr2,[office])
    let sqlStr = "select * from user where username = ?";
    let result = await queryFn(sqlStr,[username])
    let sqlStr6 = 'select id from doctor where doctorname = ?'
    let result6 = await queryFn(sqlStr6,[req.body.doctors])
    result = Array.from(result)
    let sqlStr1 = "INSERT INTO  patient (patient.patientname,patient.gender,patient.phone_number,patient.email,patient.regtime,patient.seetime,patient.doctorid,patient.stateid) values (?,?,?,?,?,?,?,1)"
    await queryFn(sqlStr1,[result[0].name,result[0].gender,result[0].phone_number,result[0].email,Current,seetime,result6[0].id])

    let sqlStr3 = "select id from datatime where datatime = ?"
    
    
    let result3 = await queryFn(sqlStr3,[seetime]);
    
    
    let sqlStr4 = "select * from people where datatimeid = ? and doctorid = ?"
    let result4 = await queryFn(sqlStr4,[result3[0].id,result6[0].id])
    let strength = parseInt(result4[0].stipulate);
    
    
    let num = parseInt(result4[0].num)
    if(strength<num){
        strength = strength + 1;
        let sqlStr5 = "update people set stipulate=?"
        await queryFn(sqlStr5,[strength])
    }
})



module.exports = router;