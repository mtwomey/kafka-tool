'use strict';

const crypto = require('crypto');

function getRandomString(length, charset) {
    charset = charset || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let randomBytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
        result += charset[randomBytes[i] % charset.length];
    }
    return result;
}

module.exports = {
    getRandomString
}
