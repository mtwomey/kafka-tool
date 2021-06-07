'use strict';

const winston = require('winston');
const colors = require('../lib/colors');

// Winston is dumb here, they should let you just create "first class" formats or subclass Format easily and provide better examples...
// maybe I'm dumb...
const plainFormat = winston.format.printf((info) => {
    let date = colors.colorize(new Date().toISOString(), 'dgrey');

    let level;

    // Winston colors seems too over the top, I'll just do it myself
    switch(info.level) {
        case 'info':
            level = colors.colorize(info.level.toUpperCase(), 'offgreen');
            break;
        case 'debug':
            level = colors.colorize(info.level.toUpperCase(), 'offblue');
            break;
        default:
            level = info.level.toUpperCase();
    }

    let message = info.message;

    return `${date} ${level} ${message}`;
})

const transports = {
    console: new winston.transports.Console({level: 'info'})
}

const logger = winston.createLogger({
    transports: [ transports.console ],
    format: plainFormat
});

logger.changeLevel = function (transport, level) {
    transports[transport].level = level;
}

module.exports = logger;
