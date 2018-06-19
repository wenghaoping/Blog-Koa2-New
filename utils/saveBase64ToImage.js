const fs = require('fs');
const config = require('../config/default.js');

exports.saveBase64ToImage = (file) => {
    let base64Data = file.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    let getName = Number(Math.random().toString().substr(3)).toString(36) + Date.now();
    return new Promise((reslove, reject) => {
        fs.writeFile('./public/images/' + getName + '.png', dataBuffer, err => {
            if (err) {
                throw err;
                reject(false);
            };
            reslove({
                src: `http://${config.baseUrl}/${getName}.png`
            });
            console.log('头像上传成功');
        });
    });
};