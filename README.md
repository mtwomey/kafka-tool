# Kafka-Tool

## Installation (Requires NodeJs >= 12)

`npm i -g mtwomey/kafka-tool#v0.0.1` (or whatever version)

## Setup config

`kafka-tool --host [HOSTNAME / IP]` address of kafka server

`kafka-tool --port [PORT]` port it's listening on

`kafka-tool --cert` this will prompt you to paste in your PEM formatted cert and private key

## Listen to a topic

`kafka-tool --consume [TOPIC]`

## Help

`kafka-tool -h`

## Note on temp data

The keys and config data are stored in your temp directory. Use `kafka-tool --clean` to see and clear this data.
