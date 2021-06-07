'use strict';

const tcommands = require('tcommands');
const logger = require('../../lib/logger');

const command = {
    name: 'debug',
    syntax: [
        '--debug',
        '-d'
    ],
    helpText: 'Include debug info in the output',
    handler: handler
}

tcommands.register(command);

function handler() {
    logger.changeLevel('console', 'debug');
}
