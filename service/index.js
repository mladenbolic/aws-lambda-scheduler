const AWS = require('aws-sdk');

var queueUrl = 'https://queue.amazonaws.com/254308114278/service-schedule-daily';

// configure AWS
AWS.config.update({
    'region': 'us-east-1'
});

const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

const params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 10,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: config.queueUrl,
    VisibilityTimeout: 60,
    WaitTimeSeconds: 10
};

const receiveMessage = () => {
    sqs.receiveMessage(params, async(err, data) => {
        if (err) {
            console.log("Receive Error", err);
        } else if (data.Messages) {
            data.Messages.forEach((msg) => {
                console.log('Message', msg);
                console.log('Process message: ' + msg.MessageId);
                console.log('Message Body', msg.Body);
                var deleteParams = {
                    QueueUrl: config.queueUrl,
                    ReceiptHandle: msg.ReceiptHandle
                };
                sqs.deleteMessage(deleteParams, function (err, data) {
                    if (err) {
                        console.log("Delete Error", err);
                    } else {
                        console.log("Message Deleted", data);
                    }
                });
            });
            receiveMessage();
        } else {
            console.log('Waiting...');
            receiveMessage();
        }
    });
}

receiveMessage();
