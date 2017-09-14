var http = require('http');

module.exports = new LogstashStream();

function LogstashStream(){
    LogstashStream.prototype.write = function (payload) {
        process.stdout.emit('data', payload);
        sendToLogstash(payload);
        console.log('Logstash stream...');
    }
}

/*
    create a post request to send log to logstash
*/

function sendToLogstash(payload) {
    var post_data = payload;
    var post_options = {
        host: '172.21.0.1',
        port: '9250',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };
    
    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });
    
    // post the data
    post_req.write(post_data);
    post_req.end();
}