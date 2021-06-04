'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'debug',
    syntax: [
        '--debug',
        '-d'
    ],
    helpText: 'Include debug info in the output'
}

tcommands.register(command);
