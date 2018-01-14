/*jshint esnext: true */
var net = require('net');
var EventEmitter = require('events');
var TCPEvent = require('./TCPEvent');

class TCPAcceptor extends EventEmitter {
  constructor() {
    super();
    this._clients = [];
  }
  
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
    this._session = net.createServer();
    this._session.addListener('connection', function(socket) {
      that._onConnected(socket);
    });
    this._session.addListener('listening', function() {
      that._onListening(); 
    });
    this._session.addListener('close', function() {
      that._onServerClosed();
    });
    var host = tokens[0];
    var port = tokens[1];
    this._session.listen(port, host);
  }
  
  close() {
    for (var i = 0; i < this._clients.length; ++i) {
      this._clients[i].destroy();
    }
    this._session.close();
  }
  
  _onListening() {
    this.emit(TCPEvent.LISTENING);
  }
  
  _onConnected(socket) {
    this._clients.push(socket);
   
    var that = this;
    socket.on('close', function() {
      that._onClientClosed(socket);
    });
    
    this.emit(TCPEvent.CONNECTED);
  }
 
  /**
   * 서버 소켓이 닫히면 발생하는 이벤트. 접속한 클라이언트 소켓이 모두 접속이 해제된 시점에 발생
   */
  _onServerClosed() {
    this.emit(TCPEvent.DISCONNECTED);
  }
 
  /**
   * 접속한 클라이언트 소켓이 닫히면 발생하는 이벤트 
   */
  _onClientClosed(socket) {
    this._clients.splice(this._clients.indexOf(socket), 1);
  }
}

module.exports = TCPAcceptor;
