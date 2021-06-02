'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');

const command = {
    name: 'port',
    syntax: [
        '-p',
        '--port'
    ],
    helpText: 'Specify the kafka host port',
    handler: handler
};

tcommands.register(command);

function handler() {
    tempData.put(`kafkaPort`, tcommands.getArgValue('port'));
}
