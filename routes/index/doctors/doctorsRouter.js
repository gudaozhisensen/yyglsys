//医生管理--------------------------------------------
var express = require('express');
var router = express.Router();
var fs = require('fs');
const queryFn = require('../../../public/js/common/mysql');

router.get("/getOffice",async(req,res)=>{
    let sqlStr="select * from office"
    let result=await queryFn(sqlStr)
    res.json({
        status:"ok",
        office:Array.from(result)
    })
  
})


// /index/api/doctors/getDoctor
router.get("/getDoctor",async(req,res)=>{
    let id = req.query.id
    let sqlStr="select * from doctor where officeid = ?"
    let result=await queryFn(sqlStr,[id])
    console.log(result);
    res.json({
        status:"ok",
        doctor:Array.from(result)
    })
})


// /index/api/doctors/doctor
router.get('/doctor',async (req,res)=>{
    let sqlStr = "SELECT doctor.id,doctor.doctorname,doctor.age,doctor.gender,doctor.allpeople,doctor.people,doctor.dutyid,doctor.doctorheader,doctor.data,office.officename from doctor LEFT JOIN office on office.id = doctor.officeid";
    let result = await queryFn(sqlStr);
    res.json({
        status:"ok",
        doctor:Array.from(result)
    })
})

// 查看剩余的人数
router.get('/getNum',async(req,res)=>{
    let value = req.query;
    console.log(value);
     res.json({
       status:'ok',
       num:'111'
     })
  })

module.exports = router;