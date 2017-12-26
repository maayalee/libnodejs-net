/*jshint esnext: true */
/**
 * @class MessageBuffer
 *
 * @brief 메시지 데이터 버퍼 객체.  메시지 데이터는  new line(\n) 단위의 문자열로 이루어져 있습니다.
 *        
 * @author Lee, Hyeon-gi
 */
class MessageBuffer {
  constructor() {
    this._buffer = '';
  }

  push(data) {
    this._buffer += data;
  }


  pullMessages() {
    var tokens = this._buffer.split('\n');
    if (this._hasFragmentToken(tokens)) {
      this._buffer = tokens.splice(tokens.length - 1, 1);
    }
    else {
      this._buffer = '';
    }
    return this._filterEmptyTokne(tokens);
  }

  _hasFragmentToken(tokens) {
    var last_token = tokens[tokens.length - 1];
    return last_token !== '' ? true : false;
  }

  _filterEmptyTokne(tokens) {
    return tokens.filter(function(token) {
      return token !== '';
    });
  }
}

module.exports = MessageBuffer;
