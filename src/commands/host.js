'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');

const command = {
    name: 'host',
    syntax: [
        '--host',
        '-h'
    ],
    helpText: 'Specify the kafka host address',
    handler: handler
};

tcommands.register(command);

function handler() {
    tempData.put(`kafkaHost`, tcommands.getArgValue('host'));
}
