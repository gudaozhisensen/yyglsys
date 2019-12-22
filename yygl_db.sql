/*
Navicat MySQL Data Transfer

Source Server         : db_book
Source Server Version : 80013
Source Host           : localhost:3306
Source Database       : yygl_db

Target Server Type    : MYSQL
Target Server Version : 80013
File Encoding         : 65001

Date: 2019-12-22 16:56:53
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for doctor
-- ----------------------------
DROP TABLE IF EXISTS `doctor`;
CREATE TABLE `doctor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctorname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `age` int(255) DEFAULT NULL,
  `sex` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mobile` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `officesid` int(11) DEFAULT NULL,
  `patientcount` int(11) DEFAULT NULL,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of doctor
-- ----------------------------
INSERT INTO `doctor` VALUES ('1', '高义', '111111111111', '38', '男', '主治医师', '', null, null, '34', '20', 'T');
INSERT INTO `doctor` VALUES ('2', '胡一筒', '111111111111', '43', '男', '主任医师', '', null, null, '23', '25', 'T');
INSERT INTO `doctor` VALUES ('3', '高尔文', '111111111111', '38', '男', '副主任医师', '', null, null, '20', '20', 'T');
INSERT INTO `doctor` VALUES ('4', '任国至', null, '24', '男', '医师', '', null, null, '45', '10', 'T');
INSERT INTO `doctor` VALUES ('5', '李媛媛', null, '34', '女', '主治医师', '', null, null, '25', '10', 'T');
INSERT INTO `doctor` VALUES ('6', '墨念', null, '25', '女', '医师', '', null, null, '20', '15', 'T');
INSERT INTO `doctor` VALUES ('7', '高er', null, '33', '女', '主治医师', '', null, null, '34', '20', 'T');
INSERT INTO `doctor` VALUES ('8', '高er', null, '33', '女', '主治医师', '', null, null, '34', '20', 'T');
INSERT INTO `doctor` VALUES ('116', '高er', null, '33', '女', '主治医师', '', null, null, '34', '20', 'T');
INSERT INTO `doctor` VALUES ('117', 'dfd', null, '34', '男', 'ff', 'CangBianRoad, GuangXi', '13250295573', 'gudaozhisensen@gmail.com', '21', '15', 'F');
INSERT INTO `doctor` VALUES ('118', 'erer', null, '34', '男', 'ggg', 'CangBianRoad, GuangXi', '13250295573', 'gudaozhisensen@gmail.com', '20', '15', 'F');
INSERT INTO `doctor` VALUES ('120', '七千', 'feff744cc6733b818c58a8a482fc0a1f', '34', '男', '主任医师', 'CangBianRoad, GuangXi', '13250295573', 'gudaoz@gmail.com', '15', '10', 'F');

-- ----------------------------
-- Table structure for drug
-- ----------------------------
DROP TABLE IF EXISTS `drug`;
CREATE TABLE `drug` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `expiry` int(11) DEFAULT NULL,
  `company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` float DEFAULT NULL,
  `capacity` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `classify` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of drug
-- ----------------------------
INSERT INTO `drug` VALUES ('1', '达力新(头孢呋辛酯片)', '用于敏感细菌所致的下列感染： 下呼吸道感染：如急性和慢性支气管炎及肺炎。 上呼吸道感染：鼻窦炎、副鼻窦炎、扁桃体炎和咽炎。 皮肤和软组织感染：如疖、脓疱病。 淋病：急性淋球菌性尿道炎和子宫颈炎。', '2017-09-01', '2', '圳致君制药有限公司', '8.5', '0.125g*12片', '500', '西药');
INSERT INTO `drug` VALUES ('2', '知柏地黄丸', '滋阴清热。用于潮热盗汗，耳鸣遗精，口干咽燥。', '2018-02-05', '3', '北京同仁堂科技发展股份有限公司制药厂', '23', '9g*10丸', '400', '中成药');

-- ----------------------------
-- Table structure for offices
-- ----------------------------
DROP TABLE IF EXISTS `offices`;
CREATE TABLE `offices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pid` int(11) DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of offices
-- ----------------------------
INSERT INTO `offices` VALUES ('1', '0', '内科');
INSERT INTO `offices` VALUES ('2', '0', '外科');
INSERT INTO `offices` VALUES ('3', '0', '脑系科');
INSERT INTO `offices` VALUES ('4', '0', '肿瘤科');
INSERT INTO `offices` VALUES ('5', '0', '妇产科');
INSERT INTO `offices` VALUES ('6', '0', '男科');
INSERT INTO `offices` VALUES ('7', '0', '儿科');
INSERT INTO `offices` VALUES ('8', '0', '中医科');
INSERT INTO `offices` VALUES ('9', '0', '五官科');
INSERT INTO `offices` VALUES ('10', '0', '皮肤科');
INSERT INTO `offices` VALUES ('11', '0', '传染科');
INSERT INTO `offices` VALUES ('12', '0', '整形美容科');
INSERT INTO `offices` VALUES ('13', '1', '呼吸');
INSERT INTO `offices` VALUES ('14', '1', '消化');
INSERT INTO `offices` VALUES ('15', '1', '心血管');
INSERT INTO `offices` VALUES ('16', '1', '肾内');
INSERT INTO `offices` VALUES ('17', '1', '血液');
INSERT INTO `offices` VALUES ('18', '1', '内分泌');
INSERT INTO `offices` VALUES ('19', '2', '普通外科');
INSERT INTO `offices` VALUES ('20', '2', '神经外科');
INSERT INTO `offices` VALUES ('21', '2', '心胸外科');
INSERT INTO `offices` VALUES ('22', '2', '心血管外科');
INSERT INTO `offices` VALUES ('23', '2', '乳腺外科');
INSERT INTO `offices` VALUES ('24', '2', '肝胆外科');
INSERT INTO `offices` VALUES ('25', '2', '骨外科');
INSERT INTO `offices` VALUES ('26', '2', '肛肠外科');
INSERT INTO `offices` VALUES ('27', '2', '烧伤科');
INSERT INTO `offices` VALUES ('28', '3', '精神科');
INSERT INTO `offices` VALUES ('29', '3', '精神心理科');
INSERT INTO `offices` VALUES ('30', '3', '脑外科');
INSERT INTO `offices` VALUES ('31', '3', '脑内科');
INSERT INTO `offices` VALUES ('32', '4', '肿瘤专科');
INSERT INTO `offices` VALUES ('33', '4', '肿瘤骨科');
INSERT INTO `offices` VALUES ('34', '5', '妇科');
INSERT INTO `offices` VALUES ('35', '5', '产科');
INSERT INTO `offices` VALUES ('36', '6', '男性专科');
INSERT INTO `offices` VALUES ('37', '6', '前列腺疾病');
INSERT INTO `offices` VALUES ('38', '7', '小儿外科');
INSERT INTO `offices` VALUES ('39', '7', '小儿内科');
INSERT INTO `offices` VALUES ('40', '7', '新生儿科儿童营养保健');
INSERT INTO `offices` VALUES ('41', '7', '儿科综合');
INSERT INTO `offices` VALUES ('42', '8', '中医内科');
INSERT INTO `offices` VALUES ('43', '8', '针灸科');
INSERT INTO `offices` VALUES ('44', '8', '正骨疮科');
INSERT INTO `offices` VALUES ('45', '9', '耳鼻喉科');
INSERT INTO `offices` VALUES ('46', '9', '眼科');
INSERT INTO `offices` VALUES ('47', '9', '口腔科');
INSERT INTO `offices` VALUES ('48', '10', '皮肤科');
INSERT INTO `offices` VALUES ('49', '10', '性病科');
INSERT INTO `offices` VALUES ('50', '11', '肝病科');
INSERT INTO `offices` VALUES ('51', '11', '艾滋病科');
INSERT INTO `offices` VALUES ('52', '11', '结核病');
INSERT INTO `offices` VALUES ('53', '11', '寄生虫');
INSERT INTO `offices` VALUES ('54', '12', '整形美容科');
