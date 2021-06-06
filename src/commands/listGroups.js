'use strict';

const tcommands = require('tcommands');
const Kafka = require('no-kafka');
const tempData = require('../../lib/tempData');

const command = {
    name: 'listGroups',
    syntax: [
        '--list-groups'
    ],
    helpText: 'List all kafka consumer groups',
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
    const groups = await admin.listGroups();
    const groupIds = groups.map(group => group.groupId);

    await Promise.all(groupIds.map(groupId => {
        return admin.describeGroup(groupId).then((groupDetails) => {
            process.stdout.write(`[Group ID]: ${groupDetails.groupId}`.padEnd(60));
            console.log(`[Members]: ${groupDetails.members.length}`);
        })
    }));

    admin.end();
}
