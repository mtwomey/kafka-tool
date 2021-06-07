'use strict';

const colors = {
    // text style
    bold          : '\x1B[1m',
    italic        : '\x1B[3m',
    underline     : '\x1B[4m',
    inverse       : '\x1B[7m',
    strikethrough : '\x1B[9m',
    // text colors
    default       : '\x1B[39m',
    black         : '\x1B[30m',
    blue          : '\x1B[34m',
    cyan          : '\x1B[36m',
    green         : '\x1B[32m',
    magenta       : '\x1B[35m',
    red           : '\x1B[31m',
    yellow        : '\x1B[33m',
    lgrey         : '\x1B[37m',
    dgrey         : '\x1B[90m',
    lred          : '\x1B[91m',
    lgreen        : '\x1B[92m',
    lyellow       : '\x1B[93m',
    lblue         : '\x1B[94m',
    lmagenta      : '\x1B[95m',
    lcyan         : '\x1B[96m',
    white         : '\x1B[97m',
    // 256 color colors
    offgreen      : '\x1B[38;5;70m',
    offblue       : '\x1B[38;5;24m',
    // background colors
    whiteBG       : '\x1B[47m',
    blackBG       : '\x1B[40m',
    blueBG        : '\x1B[44m',
    cyanBG        : '\x1B[46m',
    greenBG       : '\x1B[42m',
    magentaBG     : '\x1B[45m',
    redBG         : '\x1B[41m',
    yellowBG      : '\x1B[43m',
    // reset
    reset         : '\x1B[0m'
};

function colorize (s, color) {
    return `${colors[color]}${s}${colors.reset}`;
}

module.exports = {
    colors,
    colorize
};
