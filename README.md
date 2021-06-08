# Kafka-Tool

## Installation (Requires NodeJs >= 12)

`npm i -g mtwomey/kafka-tool#v0.0.6` (or whatever version tag)

## Setup config

`kafka-tool --connection-string [STRING]` Specify the kafka connection string like "host1:9093,host2:9093,host3:9093"

`kafka-tool --cert` this will prompt you to paste in your PEM formatted cert and private key

You only need to run these commands once and the config data will be stored in your tmp direction.

## Subscribe to a topic

`kafka-tool --consume --topic [TOPIC]` will use group consumer and generate a random groupId for the connection

`kafka-tool --consume [TOPIC] --group-id [GROUP_ID]` will use group consumer with the specified groupId for the connection

## Produce to a topic

### Produce a single message

`kafka-toool --produce --topic [TOPIC] --message [MESSAGE]` 

### Produce the same message N times

`kafka-toool --produce --topic [TOPIC] --message [MESSAGE] --count [N]` 

Note: this will prepend a counter in front of your message to keep track.

### Produce the same message N times using the designated key
`kafka-toool --produce --topic [TOPIC] --message [MESSAGE] --count [N] --key [STRING]`

Note: . As the key is used to determine the partition the message is sent to, this will result in all messages being produced to a single partition.

## Help

`kafka-tool -h`

## Note on temp data

Cert info and config data is stored in your temp directory. Use `kafka-tool --clean` to see and clear this data.
