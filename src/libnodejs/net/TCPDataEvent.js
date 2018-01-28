/*jshint esnext: true */

class TCPDataEvent {
  constructor(remotor, messages) {
    this._remotor = remotor;
    this._messages = messages;
  }
  
  getRemotor() {
    return this._remotor;
  }
  
  getMessages() {
    return this._messages;
  }
}

TCPDataEvent.RECV_MESSAGE = "TCPDataEvent.RecvMessage";

module.exports = TCPDataEvent;
