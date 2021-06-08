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
    const kafkaHost = tempData.get('kafkaHost') || initErrors.push('use --host [HOSTNAME / IP] to specify kafka host') && 0;
    const kafkaPort = tempData.get('kafkaPort') || initErrors.push('use --port [PORT] to specify kafka port')  && 0;
    const kafkaSslCert = tempData.get('kafkaSslCert') || initErrors.push('use --cert to specify kafka SSL cert') && 0;
    const kafkaSslKey = tempData.get('kafkaSslKey') || initErrors.push('use --cert to specify kafka SSL key')  && 0;
    const topic = tcommands.getArgValue('topic') || tcommands.getArgValue('consume');
    if (topic === true || topic === false)
        initErrors.push('you must supply a topic name for --consume');

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

    const groupId = tcommands.getArgValue('groupId') || `kafka-tool_${util.getRandomString(8)}`;

    const consumer = new Kafka.GroupConsumer({
        connectionString: `${kafkaHost}:${kafkaPort}`,
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
