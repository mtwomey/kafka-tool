'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'message',
    syntax: [
        '--message'
    ],
    helpText: 'Specify a message',
    showInHelp: false
};

tcommands.register(command);
