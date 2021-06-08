'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'key',
    syntax: [
        '--key'
    ],
    helpText: 'Specify a key',
    showInHelp: false
};

tcommands.register(command);
