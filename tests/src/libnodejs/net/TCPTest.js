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
    var serverConnected = false;
    this.runs(function() {
      acceptor.addListener(TCPEvent.LISTENING, function() {
        listening = true;
      });
      acceptor.addListener(TCPEvent.CONNECTED, function() {
        console.log('conn1');
        serverConnected = true;
      });

      acceptor.listen(TCPTest.TEST_HOST);
    }, 1000);
    this.runs(function() {
      assert(listening === true);
    });

    var connector = new TCPConnector();
    var clientConnected = false;
    this.runs(function() {
      connector.addListener(TCPEvent.CONNECTED, function() {
        console.log('conn');
        clientConnected = true;
      });
      connector.connect(TCPTest.TEST_HOST);
    });
    this.waits(1000);
    this.runs(function() {
      console.dir(serverConnected);
      assert(serverConnected === true);
      assert(clientConnected === true);
    });
    this.waits(2000);
  }

  static createSuite() {
    var suite = new TestSuite('TCPTest');
    suite.add(new TCPTest('testConnect'));
    return suite;
  }
}

TCPTest.TEST_HOST = "tcp://localhost:8001";

module.exports = TCPTest;

