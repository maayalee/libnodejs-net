/*jshint esnext: true */
var net = require('net');
var EventEmitter = require('events');
var TCPAcceptorEvent = require('./TCPAcceptorEvent');
var TCPRemotor = require('./TCPRemotor');
var TCPDataEvent = require('./TCPDataEvent');

class TCPAcceptor extends EventEmitter {
  constructor(messageBuffer) {
    super();
    this._messageBuffer = messageBuffer;
    this._clients = [];
    this._idCount = 0;
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
    this._session.addListener
    var host = tokens[0];
    var port = tokens[1];
    this._session.listen(port, host);
  }
  
  close() {
    for (var i = 0; i < this._clients.length; ++i) {
      this._clients[i].close();
    }
    this._session.close();
  }
  
  _onListening() {
    this.emit(TCPAcceptorEvent.LISTENING);
  }
 
  /**
   * 클라이언트 접속이 발생하면 호출된다
   * 
   * @param socket Socket 클라이언트 소켓
   */
  _onConnected(socket) {
    var remotor = new TCPRemotor(socket, ++this._idCount);
    
    var that = this;
    socket.addListener('close', function() {
      that._onClientClosed(remotor);
    });
    socket.addListener('data', function(data) {
      that._onClientData(remotor, data);
    });
    this._clients.push(remotor);
    
    this.emit(TCPAcceptorEvent.CONNECTED, new TCPAcceptorEvent(remotor));
  }
 
  /**
   * 서버 소켓이 닫히면 호출된다. 접속한 클라이언트 소켓이 모두 접속이 해제된 시점에 발생
   */
  _onServerClosed() {
  }
 
  /**
   * 접속한 클라이언트 소켓이 닫히면 호출된다.
   * 
   * @param remotor TCPRemotor 클라이언트 리모터
   */
  _onClientClosed(remotor) {
    this._clients.splice(this._clients.indexOf(remotor), 1);
    this.emit(TCPAcceptorEvent.DISCONNECTED, new TCPAcceptorEvent(remotor));
  }
  
  _onClientData(remotor, data) {
    this._messageBuffer.push(data);
    var messages = this._messageBuffer.pullMessages();
    if (messages.length > 0) {
      this.emit(TCPDataEvent.RECV_MESSAGE, new TCPDataEvent(remotor, messages));
    }
  }
}

module.exports = TCPAcceptor;
