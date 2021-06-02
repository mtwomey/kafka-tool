'use strict';

const tcommands = require('tcommands');

function log(message) {
        console.log(message);
}
function debug (message) {
    if (tcommands.getArgValue('debug')) {
        console.log(message);
    }
}

module.exports = {
    log,
    debug
}
