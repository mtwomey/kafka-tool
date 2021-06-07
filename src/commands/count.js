'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'count',
    syntax: [
        '--count'
    ],
    helpText: 'Specify a count',
    showInHelp: false
};

tcommands.register(command);
