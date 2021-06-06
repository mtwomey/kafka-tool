'use strict';

const tcommands = require('tcommands');
const Kafka = require('no-kafka');
const tempData = require('../../lib/tempData');

const command = {
    name: 'groupDetails',
    syntax: [
        '--group-details'
    ],
    helpText: 'Get details of a specific consumer group',
    handler: handler,
    after: ['cert', 'host', 'port']
}

tcommands.register(command);

async function handler () {
    const initErrors = [];
    const kafkaHost = tempData.get('kafkaHost') || initErrors.push('use --host [HOSTNAME / IP] to specify kafka host') && 0;
    const kafkaPort = tempData.get('kafkaPort') || initErrors.push('use --port [PORT] to specify kafka port')  && 0;
    const kafkaSslCert = tempData.get('kafkaSslCert') || initErrors.push('use --cert to specify kafka SSL cert') && 0;
    const kafkaSslKey = tempData.get('kafkaSslKey') || initErrors.push('use --cert to specify kafka SSL key')  && 0;
    const groupId = tcommands.getArgValue('groupDetails');

    if (groupId === true || groupId === false)
        initErrors.push('you must supply a group name for --group-details');

    if (initErrors.length > 0) {
        console.log('Usage:\n\nkafka-tool --help for help');
        if (!(kafkaHost && kafkaPort && kafkaSslCert && kafkaSslKey))
            console.log('\nHost, port and SSL certs will be cached in temp. Set them with:\n\nkafka-tool --host [HOSTNAME / IP]' +
                '\nkafka-tool --port [PORT]\nkafka-tool --cert' +
                '\n\nYou don\'t need to specify these with each invocation, they are cached.');
        console.log('\nErrors:\n');
        for (const error of initErrors) {
            console.log(`* ${error}`);
        }
        process.exit(1);
    }

    const admin = new Kafka.GroupAdmin({
        connectionString: `${kafkaHost}:${kafkaPort}`,
        ssl: {
            cert: kafkaSslCert,
            key: kafkaSslKey
        }
    });

    await admin.init();
    const groupDetails = await admin.describeGroup(groupId);
    console.log(JSON.stringify(groupDetails, null, 2));

    admin.end();
}
