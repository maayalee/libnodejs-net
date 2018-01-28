/*jshint esnext: true */
var net = require('net');
var EventEmitter = require('events');
var TCPConnectorEvent = require('./TCPConnectorEvent');
var TCPRemotor = require('./TCPRemotor');
var TCPDataEvent = require('./TCPDataEvent');

class TCPConnector extends EventEmitter {
  constructor(messageBuffer) {
    super();
    this._messageBuffer = messageBuffer;
    this._idCount = 0;
    this._remotor = undefined;
  }
  
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
    this._socket = new net.Socket();
    var that = this;
    this._socket.addListener('close', function() {
      that._onClosed();
    });
    this._socket.addListener('connect', function(){
      that._onConnected();
    });
    this._socket.addListener('data', function(data) {
      that._onClientData(data);
    });
    this._socket.connect(port, host); 
  }
  
  send(data) {
    this._remotor.send(data);
  }

  /**
   * 소켓을 종료한다. FIN 패킷을 통한 정상적인 방식 
   */
  close() {
    this._socket.end();
    this._socket = null;
  }
 
  /**
   * 소켓을 강제 종료한다. 에러 처리 상황때에만 사용한다.
   */
  destroy() {
    this._socket.destroy();
    this._socket = null;
  }
  
  _onConnected() {
    this._remotor = new TCPRemotor(this._socket, ++this._idCount);
    this.emit(TCPConnectorEvent.CONNECTED, new TCPConnectorEvent(this._remotor));
  }
  
  _onClosed() {
    this.emit(TCPConnectorEvent.DISCONNECTED, new TCPConnectorEvent(this._remotor));
  }
  
  _onClientData(data) {
    this._messageBuffer.push(data);
    var messages = this._messageBuffer.pullMessages();
    if (messages.length > 0) {
      this.emit(TCPDataEvent.RECV_MESSAGE, new TCPDataEvent(this._remotor, messages));
    }
  }
}

module.exports = TCPConnector;
