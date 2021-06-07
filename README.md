# Kafka-Tool

## Installation (Requires NodeJs >= 12)

`npm i -g mtwomey/kafka-tool#v0.0.3` (or whatever version tag)

## Setup config

`kafka-tool --host [HOSTNAME / IP]` address of kafka server

`kafka-tool --port [PORT]` port it's listening on

`kafka-tool --cert` this will prompt you to paste in your PEM formatted cert and private key

## Subscript to a topic

`kafka-tool --consume --topic [TOPIC]` will use group consumer and generate a random groupId

`kafka-tool --consume [TOPIC] --group-id [GROUP_ID]` will use group consumer with the specified groupId

## Product to a topic

`kafka-toool --produce --topic [TOPIC] --message [MESSAGE]` 

## Help

`kafka-tool -h`

## Note on temp data

The keys and config data are stored in your temp directory. Use `kafka-tool --clean` to see and clear this data.
