/*jshint esnext: true */
var net = require('net');
var EventEmitter = require('events');
var TCPEvent = require('./TCPEvent');

class TCPConnector extends EventEmitter {
  connect(address) {
    var tokens = address.split('//');
    if (2 !== tokens.length) {
      throw new Error('address is invalid: ' + address);
    }
    tokens = tokens[1].split(':');
    if (2 !== tokens.length) {
      throw new Error('address is invalid: ' + address);
    }

    var host = tokens[0];
    var port = tokens[1];
    this._session = new net.Socket();
    var that = this;
    this._session.connect(port, host, function() {
      that._onConnected();
    }); 
  }
  
  _onConnected() {
    this.emit(TCPEvent.CONNECTED);
  }
}

module.exports = TCPConnector;
