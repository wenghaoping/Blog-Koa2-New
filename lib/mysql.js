const mysql = require('mysql');
const config = require('../config/default.js');

let pool  = mysql.createPool({
    host: config.database.HOST,
    user: config.database.USERNAME,
    password: config.database.PASSWORD,
    database: config.database.DATABASE,
    port: config.database.PORT
});

let query = (sql, values) => {

    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                connection.query(sql, values, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    connection.release();
                });
            }
        });
    });

};

let users =
    `create table if not exists users(
     user_id INT NOT NULL AUTO_INCREMENT,
     user_name VARCHAR(100) NOT NULL COMMENT '用户名',
     phone_number VARCHAR(11) NOT NULL COMMENT '电话号码',
     pass_word VARCHAR(100) NOT NULL COMMENT '密码',
     really_pass_word VARCHAR(100) NOT NULL COMMENT '真实密码',
     avator VARCHAR(100) NOT NULL COMMENT '头像',
     moment VARCHAR(100) NOT NULL COMMENT '注册时间',
     PRIMARY KEY ( user_id ),
     UNIQUE KEY (user_name)
    );`;

let posts =
    `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '文章作者',
     title TEXT(0) NOT NULL COMMENT '评论题目',
     content TEXT(0) NOT NULL COMMENT '评论内容',
     md TEXT(0) NOT NULL COMMENT 'markdown',
     uid VARCHAR(40) NOT NULL COMMENT '用户id',
     moment VARCHAR(100) NOT NULL COMMENT '发表时间',
     comments VARCHAR(200) NOT NULL DEFAULT '0' COMMENT '文章评论数',
     pv VARCHAR(40) NOT NULL DEFAULT '0' COMMENT '浏览量',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id)
    );`;

let comment =
    `create table if not exists comment(
     comment_id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL COMMENT '用户名称',
     content TEXT(0) NOT NULL COMMENT '评论内容',
     moment VARCHAR(40) NOT NULL COMMENT '评论时间',
     postid VARCHAR(40) NOT NULL COMMENT '文章id',
     avator VARCHAR(100) NOT NULL COMMENT '用户头像',
     PRIMARY KEY(id) 
    );`;

let createTable = (sql) => {
    return query(sql, []);
};

// 建表
createTable(users);
// createTable(posts);
// createTable(comment);

// 注册用户
exports.insertData = (value) => {
    let _sql = 'insert into users set user_name=?,pass_word=?,really_pass_word=?,phone_number=?,avator=?,moment=?;';
    return query(_sql, value);
};
// 删除用户
exports.deleteUserData = (user_name) => {
    let _sql = `delete from users where user_name="${user_name}";`;
    return query(_sql);
};
// 通过名字查找用户
exports.findDataByName =  ( user_name ) => {
    let _sql = `select * from users where user_name="${user_name}";`;
    return query( _sql)
};

