const userModel = require('../lib/mysql.js');
// const md5 = require('md5');
// const moment = require('moment');
// const fs = require('fs');

exports.postSignup = async ctx => {
    let { user_name, pass_word, phone_number, check_pass } = ctx.request.body;
    console.log(user_name,pass_word,phone_number, check_pass);
    console.log(ctx.request.body);
    ctx.body = {
        code: 200,
        message: '登录成功'
    }
};
