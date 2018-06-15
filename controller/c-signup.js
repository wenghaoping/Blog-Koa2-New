const userModel = require('../lib/mysql.js');
const md5 = require('md5');
const moment = require('moment');
// const fs = require('fs');


//注册入口
exports.postSignup = async ctx => {
    let { user_name, pass_word, phone_number, check_pass } = ctx.request.body;
    console.log(user_name,pass_word,phone_number, check_pass);
    console.log(ctx.request.body);

    await userModel.findDataByName(user_name)
        .then(async (result) => {
            console.log(result);
            if (result.length) {
                try {
                    throw Error('用户已经存在')
                } catch (error) {
                    //处理err
                    console.log(error)
                }
                // 用户存在
                ctx.body = {
                    code: 500,
                    message: '用户存在'
                };
            } else {
                await userModel.insertData([user_name, md5(pass_word), pass_word, phone_number, 'locahost:3000/images/header.jpg', moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res => {
                        console.log('注册成功', res);
                        //注册成功
                        ctx.body = {
                            code: 200,
                            message: '注册成功',
                            user_id: res.insertId
                        };
                    })
            }
        });
};
