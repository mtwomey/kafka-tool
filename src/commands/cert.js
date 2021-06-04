'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');
const readline = require('readline');

const command = {
    name: 'cert',
    syntax: [
        '--cert'
    ],
    helpText: 'Specify cert info',
    handler: handler
};

tcommands.register(command);

async function handler() {
    console.log('Paste in the SSL cert (not key). End with Enter, then CTRL-D');
    tempData.put(`kafkaSslCert`, await readMultiLine());
    console.log('Paste in the SSL key (not cert). End with Enter, then CTRL-D');
    tempData.put(`kafkaSslKey`, await readMultiLine());
}

function readMultiLine() {
    return new Promise((resolve, reject) => {
        const input = [];
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.prompt();

        rl.on('line', function (cmd) {
            input.push(cmd);
        });

        rl.on('close', function (cmd) {
            resolve(input.join('\n'));
        });
    });
}
