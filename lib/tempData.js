'use strict';

const config = require('../config/config');
const fs = require('fs');

const pjson = require('../package.json');

function get(identifier) {
    let filename = `${config.tempData.directory}/.${pjson.name}_${identifier}`;
    if (fs.existsSync(filename)) {
        return JSON.parse(fs.readFileSync(filename, 'utf8'));
    }
    return undefined;
}

function put(identifier, object) {
    let filename = `${config.tempData.directory}/.${pjson.name}_${identifier}`;
    fs.writeFileSync(filename, JSON.stringify(object));
    return filename;
}

function getFilenames() {
    return fs.readdirSync(config.tempData.directory).filter(filename => {
        return filename.startsWith(`.${pjson.name}_`)
    }).map(filename => {
        return `${config.tempData.directory}/${filename}`;
    });
}

module.exports = {
    get,
    put,
    getFilenames
};
