const userModel = require('../lib/mysql.js');
const md5 = require('md5');
const moment = require('moment');
const util = require("../utils/saveBase64ToImage");
//注册入口
exports.postSignup = async ctx => {
    let { user_name, pass_word, phone_number, avator } = ctx.request.body;
    // console.log(user_name, pass_word, phone_number, avator);
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
                let imageData = await util.saveBase64ToImage(avator);
                await userModel.insertData([user_name, md5(pass_word), pass_word, phone_number, imageData.src, moment().format('YYYY-MM-DD HH:mm:ss')])
                    .then(res => {
                        //注册成功
                        ctx.body = {
                            code: 200,
                            message: '注册成功',
                            user_id: res.insertId,
                            avator: imageData.src
                        };
                    })
            }
        });
};

