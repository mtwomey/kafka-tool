'use strict';

const winston = require('winston');
const colors = require('../lib/colors');

// Winston is dumb here, they should let you just create "first class" formats or subclass Format easily and provide better examples...
const plainFormat = winston.format.printf((info) => {
    let date = colors.colorize(new Date().toISOString(), 'dgrey');

    let level;
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

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({level: 'info'})
    ],
    format: plainFormat
});

logger.winston = winston; // So I can add new transports without having to include winston directly

module.exports = logger;
