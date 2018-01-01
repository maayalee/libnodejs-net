/*jshint esnext: true */
var TestCase = require('libnodejs-unittest/src/libnodejs/test/TestCase');
var TestSuite = require('libnodejs-unittest/src/libnodejs/test/TestSuite');
var assert = require('assert');
var TCPEvent = require('../../../../src/libnodejs/net/TCPEvent');
var TCPConnector = require('../../../../src/libnodejs/net/TCPConnector');
var TCPAcceptor = require('../../../../src/libnodejs/net/TCPAcceptor');

class TCPTest extends TestCase {
  constructor(methodName) {
    super(methodName);
  }

  setUp() {
  }

  tearDown() {
  }

  testConnect() {
    var acceptor = new TCPAcceptor();
    var listening = false;
    this.runs(function() {
      acceptor.addListener(TCPEvent.LISTENING, function() {
        listening = true;
      });
      acceptor.listen("tcp://localhost:8001");
    });
    this.runs(function() {
      assert(listening === true);
    });
  }

  static createSuite() {
    var suite = new TestSuite('TCPTest');
    suite.add(new TCPTest('testConnect'));
    return suite;
  }
}

module.exports = TCPTest;

