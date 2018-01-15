/*jshint esnext: true */
var net = require('net');
var EventEmitter = require('events');
var TCPConnectorEvent = require('./TCPConnectorEvent');

class TCPConnector extends EventEmitter {
  constructor(messageBuffer) {
    super();
    this._messageBuffer = messageBuffer;
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
    this._session = new net.Socket();
    var that = this;
    this._session.addListener('close', function() {
      that._onClosed();
    });
    this._session.addListener('connect', function(){
      that._onConnected();
    });
    this._session.connect(port, host); 
  }

  /**
   * 소켓을 종료한다. FIN 패킷을 통한 정상적인 방식 
   */
  close() {
    this._session.end();
    this._session = null;
  }
 
  /**
   * 소켓을 강제 종료한다. 에러 처리 상황때에만 사용한다.
   */
  destroy() {
    this._session.destroy();
    this._session = null;
  }
  
  _onConnected() {
    this.emit(TCPConnectorEvent.CONNECTED);
  }
  
  _onClosed() {
    this.emit(TCPConnectorEvent.DISCONNECTED);
  }
}

module.exports = TCPConnector;
