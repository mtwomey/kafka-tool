'use strict';

const tcommands = require('tcommands');
const Kafka = require('no-kafka');
const logger = require('../../lib/logger');
const tempData = require('../../lib/tempData');
const util = require('../../lib/util');

const command = {
    name: 'consume',
    syntax: [
        '--consume'
    ],
    helpText: 'Consume from a topic: --consume --topic [TOPIC]',
    handler: handler,
    after: ['cert', 'host', 'port']
}

tcommands.register(command);

async function handler () {
    const initErrors = [];
    const kafkaConnectionString = tempData.get('kafkaConnectionString') || initErrors.push('use kafka-tool --connection-string [STRING] to specify kafka connection info')  && 0;
    const kafkaSslCert = tempData.get('kafkaSslCert') || initErrors.push('use kafka-tool --cert to specify kafka SSL cert') && 0;
    const kafkaSslKey = tempData.get('kafkaSslKey') || initErrors.push('use kafka-tool --cert to specify kafka SSL key')  && 0;
    const topic = tcommands.getArgValue('topic') || tcommands.getArgValue('consume');
    if (typeof topic === 'boolean' || !topic)
        initErrors.push('you must supply a topic name with --topic [TOPIC NAME]');

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

    const groupId = tcommands.getArgValue('groupId') || `kafka-tool_${util.getRandomString(8)}`;

    const consumer = new Kafka.GroupConsumer({
        connectionString: kafkaConnectionString,
        ssl: {
            cert: kafkaSslCert,
            key: kafkaSslKey
        },
        groupId: groupId
    });

    let dataHandler = function (messageSet, topic, partition) {
        return new Promise(async (resolve, reject) => {
            for (const message of messageSet) {
                if (!message.message.value)
                    message.message.value = 'NULL VALUE';
                logger.info(`${topic} ${partition} ${message.offset} ${message.message.value.toString('utf8')}`);
                await consumer.commitOffset({topic: topic, partition: partition, offset: message.offset, metadata: 'optional'});
                logger.debug(`Offset updated to: ${message.offset}`);
            }
            resolve();
        });
    };

    let strategies = [{
        subscriptions: [topic],
        handler: dataHandler
    }];

    await consumer.init(strategies);
}
