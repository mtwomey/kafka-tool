'use strict';

const tcommands = require('tcommands');
const pjson = require('../../package.json');

const command = {
    name: 'debug',
    syntax: [
        '-d',
        '--debug'
    ],
    helpText: 'Include debug info in the output'
}

tcommands.register(command);
