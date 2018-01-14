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

  _setUp() {
  }

  _tearDown() {
  }

  testConnect() {
    var acceptor = new TCPAcceptor();
    var listening = false;
    acceptor.addListener(TCPEvent.LISTENING, function() {
      listening = true;
    });
    this._runs(function() {
      acceptor.listen(TCPTest.TEST_HOST);
    });
    this._runs(function() {
      assert(listening === true);
    });
    
    var connector = new TCPConnector();
    var clientConnected = false;
    var serverConnected = false;
    acceptor.addListener(TCPEvent.CONNECTED, function() {
      serverConnected = true;
    });
    connector.addListener(TCPEvent.CONNECTED, function() {
      clientConnected = true;
    });
    this._runs(function() {
      connector.connect(TCPTest.TEST_HOST);
    });
    this._waits(10);
    this._runs(function() {
      assert(serverConnected === true);
      assert(clientConnected === true);
    });
  
    var acceptorClosed = false;
    var connectorClosed = false;
    acceptor.addListener(TCPEvent.DISCONNECTED, function() {
      acceptorClosed = true;
    });
    connector.addListener(TCPEvent.DISCONNECTED, function() {
      connectorClosed = true;
    });
    this._runs(function() {
      acceptor.close();
    });
    this._waits(10);
    this._runs(function() {
      assert(acceptorClosed === true);
      assert(connectorClosed === true);
    });
  }
  
  testSendAndReceive() {
  }

  static createSuite() {
    var suite = new TestSuite('TCPTest');
    suite.add(new TCPTest('testConnect'));
    suite.add(new TCPTest('testSendAndReceive'));
    return suite;
  }
}

TCPTest.TEST_HOST = "tcp://localhost:8001";

module.exports = TCPTest;

