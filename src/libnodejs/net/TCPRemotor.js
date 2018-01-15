/*jshint esnext: true */
class TCPRemotor {
  /**
   * constructor
   * 
   * @param socket Socket 관리하는 소켓
   */
  constructor(socket, id) {
    this._socket = socket;
    this._id = id;
  }
  
  close() {
    this._socket.end();
    this._socket = null;
  }
  
  destroy() {
    this._socket.destroy();
    this._socket = null;
  }
  
  print() {
    console.log('id is ' + this._id);
  }
}

module.exports = TCPRemotor;
