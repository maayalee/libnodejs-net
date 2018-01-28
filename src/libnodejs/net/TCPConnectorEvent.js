/*jshint esnext: true */

class TCPConnectorEvent {
  constructor(remotor) {
    this._remotor = remotor;
  }
  
  getRemotor() {
    return this._remotor;
  }
}

TCPConnectorEvent.CONNECTED = "TCPConnectorEvent.Connected";
TCPConnectorEvent.DISCONNECTED = "TCPConnectorEvent.Disconnected";

module.exports = TCPConnectorEvent;
