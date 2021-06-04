'use strict';

const tcommands = require('tcommands');
const tempData = require('../../lib/tempData');
const fs = require('fs');
const config = require('../../config/config');
const pjson = require('../../package.json');

const command = {
    name: 'clean',
    syntax: [
        '--clean',
        '-c'
    ],
    helpText: 'Clean up any temp data (for safety / security)',
    handler: handler
};

tcommands.register(command);

async function handler() {
    let filenames = tempData.getFilenames();

    if (filenames.length > 0) {
        if (tcommands.getArgValue('confirm')) {
            filenames.forEach(filename => {
                fs.unlinkSync(filename);
                console.log(`Deleted: ${filename}`);
            })
        } else {
            console.log('The following files will be deleted, add a \`-y\` to the clean command to confirm:');
            console.log(filenames.join('\n'));
        }
    } else {
        console.log(`No temp files present (files matching the pattern: ${config.tempData.directory}/.${pjson.name}_*)`);
    }


}
