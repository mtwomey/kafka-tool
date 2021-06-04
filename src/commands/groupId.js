'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'groupId',
    syntax: [
        '--group-id'
    ],
    helpText: 'Specify a kafka group id'
};

tcommands.register(command);
