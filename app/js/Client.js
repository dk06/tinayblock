// JScript source code

const btcClient = require('bitcoin-core');

var self = this;
var Client = function() {
    self.client = new btcClient({
        headers: true,
        network: 'testnet',
        // host: '18.223.156.234',
        host: '34.220.71.164',
        username: 'bitcoin_testnet',
        port: 18332,
        password: 'w3villa!'
    });
    return self.client;
}

 module.exports = Client();



   