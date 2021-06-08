'use strict';

const tcommands = require('tcommands');
const Kafka = require('no-kafka');
const tempData = require('../../lib/tempData');
const logger = require('../../lib/logger');

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
    const kafkaConnectionString = tempData.get('kafkaConnectionString') || initErrors.push('use kafka-tool --connection-string [STRING] to specify kafka connection info')  && 0;
    const kafkaSslCert = tempData.get('kafkaSslCert') || initErrors.push('use kafka-tool --cert to specify kafka SSL cert') && 0;
    const kafkaSslKey = tempData.get('kafkaSslKey') || initErrors.push('use kafka-tool --cert to specify kafka SSL key')  && 0;
    const groupId = tcommands.getArgValue('groupId') || tcommands.getArgValue('groupDetails');

    if (typeof groupId === 'boolean' || !groupId)
        initErrors.push('you must supply a groupId with --group-id [GROUPID]');

    if (initErrors.length > 0) {
        console.log('Usage: kafka-tool --help for help');
        if (!(kafkaConnectionString && kafkaSslCert && kafkaSslKey))
            console.log(
                `
The SSL cert and the connection string will be cached in temp. Set them with:

kafka-tool --connection-string [STRING]
nkafka-tool --cert

You don't need to specify these with each invocation, they are cached.
`
            );
        console.log('Errors:\n');
        for (const error of initErrors) {
            console.log(`* ${error}`);
        }
        process.exit(1);
    }

    const admin = new Kafka.GroupAdmin({
        connectionString: kafkaConnectionString,
        ssl: {
            cert: kafkaSslCert,
            key: kafkaSslKey
        }
    });

    await admin.init();
    const groupDetails = await admin.describeGroup(groupId);
    logger.info(JSON.stringify(groupDetails, null, 2));

    admin.end();
}
