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
    const kafkaConnectionString = tempData.get('kafkaConnectionString') || initErrors.push('use kafka-tool --connection-string [STRING] to specify kafka connection info')  && 0;
    const kafkaSslCert = tempData.get('kafkaSslCert') || initErrors.push('use kafka-tool --cert to specify kafka SSL cert') && 0;
    const kafkaSslKey = tempData.get('kafkaSslKey') || initErrors.push('use kafka-tool --cert to specify kafka SSL key')  && 0;

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
