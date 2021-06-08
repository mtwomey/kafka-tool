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
    const kafkaConnectionString = tempData.get('kafkaConnectionString') || initErrors.push('use kafka-tool --connection-string [STRING] to specify kafka connection info')  && 0;
    const kafkaSslCert = tempData.get('kafkaSslCert') || initErrors.push('use --cert to specify kafka SSL cert') && 0;
    const kafkaSslKey = tempData.get('kafkaSslKey') || initErrors.push('use --cert to specify kafka SSL key') && 0;
    const topic = tcommands.getArgValue('topic') || initErrors.push('you must supply a topic name with --topic');
    const message = tcommands.getArgValue('message') || initErrors.push('you must supply a message with --message');
    const count = tcommands.getArgValue('count') || 1; // Maybe I should work out a default values mechanism in general
    const key = tcommands.getArgValue('key');

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

    const producer = new Kafka.Producer({
        connectionString: kafkaConnectionString,
        ssl: {
            cert: kafkaSslCert,
            key: kafkaSslKey
        }
    });

    await producer.init();

    // This produces as fast as possible, async, no waiting for anything at all
    await Promise.all([...Array(parseInt(count)).keys()].map(async i => {
        logger.debug(`Start producing countNum ${i}`);
        await producer.send({
            topic: topic,
            message: {
                value: (count > 1 ? `[Count Tag: ${i.toString().padStart(2, '0')}] ` : '') + message,
                ...(count > 1 && {key: key}) // This is sweet - conditionally adds this property... maybe technically bad performance?
            }
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
