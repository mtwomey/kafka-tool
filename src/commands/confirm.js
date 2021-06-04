'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'confirm',
    syntax: [
        '--confirm',
        '-y'
    ],
    helpText: 'Confirm action'
};

tcommands.register(command);

