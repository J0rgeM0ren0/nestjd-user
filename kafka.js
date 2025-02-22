const ip = require('ip')

const { Kafka, Partitioners,  } = require('kafkajs')

const host = process.env.HOST_IP || ip.address()

const kafka = new Kafka({
    clientId: 'user-client',
    brokers: ['localhost:9092'],
    connectionTimeout: 100000,
})

const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner
})
const consumer = kafka.consumer({ groupId: 'user-consumer-client' })

const run = async () => {
    await producer.connect();
    await producer.send({
        topic: 'topic-test',
        messages: [
            { value: 'Hello KafkaJS user!' },
        ],
    });

    setTimeout(async () => {
        await consumer.connect();
        await consumer.subscribe({ topic: 'topic-test', fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log({
                    topic,
                    partition,
                    offset: message.offset,
                    value: message.value.toString(),
                });
            },
        });
    }, 5000);
};
run().catch(e => console.error(`[example/producer] ${e.message}`, e))