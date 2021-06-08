'use strict';

const tcommands = require('tcommands');
const Kafka = require('no-kafka');
const logger = require('../../lib/logger');
const tempData = require('../../lib/tempData');

const command = {
    name: 'produce',
    syntax: [
        '--produce'
    ],
    helpText: 'Produce to a topic: --produce --topic [TOPIC] --message [message] [--count [#]] [--key [KEY]]',
    handler: handler,
    after: ['cert', 'host', 'port', 'debug']
};

tcommands.register(command);

async function handler() {
    const initErrors = [];
    const kafkaHost = tempData.get('kafkaHost') || initErrors.push('use --host [HOSTNAME / IP] to specify kafka host') && 0;
    const kafkaPort = tempData.get('kafkaPort') || initErrors.push('use --port [PORT] to specify kafka port') && 0;
    const kafkaSslCert = tempData.get('kafkaSslCert') || initErrors.push('use --cert to specify kafka SSL cert') && 0;
    const kafkaSslKey = tempData.get('kafkaSslKey') || initErrors.push('use --cert to specify kafka SSL key') && 0;
    const topic = tcommands.getArgValue('topic') || initErrors.push('you must supply a topic name with --topic');
    const message = tcommands.getArgValue('message') || initErrors.push('you must supply a message with --message');
    const count = tcommands.getArgValue('count') || 1; // Maybe I should work out a default values mechanism in general
    const key = tcommands.getArgValue('key');

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

    const producer = new Kafka.Producer({
        connectionString: `${kafkaHost}:${kafkaPort}`,
        ssl: {
            cert: kafkaSslCert,
            key: kafkaSslKey
        }
    });

    await producer.init();

    // This produces as fast as possible, async, no waiting for anything at all
    await Promise.all([...Array(parseInt(count)).keys()].map(async i => {
        const fullKafkaMessage = {
            value: count > 1 ? `[Count Tag: ${i.toString().padStart(2, '0')}]` : '' + message,
            ...(count > 1 && {key: key}) // This is sweet - conditionally adds this property... maybe technically bad performance?
        };

        logger.debug(`Start producing countNum ${i}`);
        await producer.send({
            topic: topic,
            message: fullKafkaMessage
        });
        logger.debug(`End producing countNum ${i}`);
    }));

    // Sync
    //
    // for (let i = 0; i < parseInt(count); i++) {
    //     let countTag = '';
    //     if (count > 1)
    //         countTag = `[Count Tag: ${i.toString().padStart(2, '0')}]`;
    //     logger.debug(`Start producing countNum ${i}`);
    //     await producer.send({
    //         topic: topic,
    //         message: {value: countTag + message}
    //     });
    //     logger.info(`End producing countNum ${i}`);
    // }

    await producer.end();
}
