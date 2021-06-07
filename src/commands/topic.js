'use strict';

const tcommands = require('tcommands');

const command = {
    name: 'topic',
    syntax: [
        '--topic'
    ],
    helpText: 'Specify a kafka topic name',
    showInHelp: false
};

tcommands.register(command);
