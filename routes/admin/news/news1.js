var express = require('express');
var router = express.Router();
const newsRouter = require('./newsRouter');

// 导入图片上传模块
const multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './public/upLoad' });

// 上传模块的中间件
router.use(multipartMiddleware);

router.use('/', newsRouter);

module.exports = router;
