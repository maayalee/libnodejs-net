/*jshint esnext: true */
var MessageBuffer = require('./MessageBuffer');
/**
 * @class LineStringBuffer
 *
 * @brief 메시지 데이터 버퍼 객체.  메시지 데이터는 기본적으로 new line(\n) 단위의 문자열로 이루어져 있습니다.
 *        
 * @author Lee, Hyeon-gi
 */
class LineStringBuffer extends MessageBuffer {
  constructor(splitToken = '\n') {
    super();
    this._splitToken = splitToken;
    this._buffer = '';
  }

  push(data) {
    this._buffer += data;
  }


  pullMessages() {
    var tokens = this._buffer.split(this._splitToken);
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

module.exports = LineStringBuffer;
