'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');

const command = {
    name: 'connectionString',
    syntax: [
        '--connection-string'
    ],
    helpText: 'Specify the kafka connection string like "host1:9093,host2:9093,host3:9093"',
    handler: handler
};

tcommands.register(command);

function handler() {
    tempData.put(`kafkaConnectionString`, tcommands.getArgValue('connectionString'));
}
