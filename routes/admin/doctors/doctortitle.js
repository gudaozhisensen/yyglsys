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
    let sreach=req.query.sreach;
    let page = parseInt(
      req.query.page && req.query.page > 0 ? req.query.page : 1
    );
    sqlStr ="select * from doctortitle limit ?,5";
    result = await queryFn(sqlStr, [(page - 1) * 5]);
  
    sqlStr1 = 'SELECT COUNT(id) as count FROM `doctortitle`';
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
    res.render("admin/doctors/doctortitle.ejs",options);
  


})
module.exports = router;