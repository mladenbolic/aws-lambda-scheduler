console.log("Loading function");
var AWS = require('aws-sdk');

exports.handler = function(event, context) {
  var sns = new AWS.SNS();

  var params = {
    Message: Date.now().toString(), 
    TopicArn: event.sns_topic
  };

  sns.publish(params, function(err, data) {
    if (err) {
      console.error('error publishing SNS topic');
      context.fail(err);
    }
    else {
      console.info('message published to SNS topic');
      context.done(null, data);
    }
  });

};
