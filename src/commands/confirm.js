'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'confirm',
    syntax: [
        '-y',
        '--confirm'
    ],
    helpText: 'Confirm action'
};

tcommands.register(command);

