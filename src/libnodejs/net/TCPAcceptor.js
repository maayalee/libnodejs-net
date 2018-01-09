/*jshint esnext: true */
var net = require('net');
var EventEmitter = require('events');
var TCPEvent = require('./TCPEvent');

class TCPAcceptor extends EventEmitter {
  /**
   * @param string address 서버 주소(ex. tcp://localhost:5001)
   */ 
  listen(address) {
    var tokens = address.split('//');
    if (2 !== tokens.length) {
      throw new Error('address is invalid: ' + address);
    }
    tokens = tokens[1].split(':');
    if (2 !== tokens.length) {
      throw new Error('address is invalid: ' + address);
    }
   
    var that = this;
    this._session = net.createServer(function(socket) {
      that._onConnected(socket);
    });
    this._session.addListener('listening', function() {
      that._onListening(); 
    });
    var host = tokens[0];
    var port = tokens[1];
    this._session.listen(port, host);
  }
  
  _onListening(acceptor) {
    this.emit(TCPEvent.LISTENING);
  }
  
  _onConnected(socket) {
    this.emit(TCPEvent.CONNECTED);
  }
}

module.exports = TCPAcceptor;
