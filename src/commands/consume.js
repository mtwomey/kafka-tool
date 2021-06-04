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
    helpText: 'Consume from a topic',
    handler: handler,
    after: ['cert', 'host', 'port']
}

tcommands.register(command);

async function handler () {
    const initErrors = [];
    const kafkaHost = tempData.get('kafkaHost') || initErrors.push('--host [HOSTNAME / IP] to specify kafka host');
    const kafkaPort = tempData.get('kafkaPort') || initErrors.push('--port [PORT] to specify kafka port');
    const kafkaSslCert = tempData.get('kafkaSslCert') || initErrors.push('--cert to specify kafka SSL cert');
    const kafkaSslKey = tempData.get('kafkaSslKey') || initErrors.push('--cert to specify kafka SSL key');

    if (initErrors.length > 0) {
        console.log('Usage:\n\n"kafka-tool --help" for help\n');
        console.log('Host, port and SSL certs will be cached in temp. Set them with:\n\nkafka-tool --host [HOSTNAME / IP]\nkafka-tool --port [PORT]\nkafka-tool --cert');
        console.log('\n\nErrors:\n');
        for (const error of initErrors) {
            console.log(error);
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
                console.log(topic, partition, message.offset, message.message.value.toString('utf8'));
                await consumer.commitOffset({topic: topic, partition: partition, offset: message.offset, metadata: 'optional'});
                logger.debug(`Offset updated to: ${message.offset}`);
            }
            resolve();
        });
    };

    let strategies = [{
        subscriptions: [tcommands.getArgValue('consume')],
        handler: dataHandler
    }];

    consumer.init(strategies);
}
