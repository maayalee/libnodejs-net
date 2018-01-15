/*jshint esnext: true */

class TCPAcceptorEvent {
  constructor(remotor) {
    this._remotor = remotor;
  }
  
  getRemotor() {
    return this._remotor;
  }
}

TCPAcceptorEvent.LISTENING = "TCPAcceptorEvent.Listening";
TCPAcceptorEvent.CONNECTED = "TCPAcceptorEvent.Connected";
TCPAcceptorEvent.DISCONNECTED = "TCPAcceptorEvent.Disconnected";

module.exports = TCPAcceptorEvent;
