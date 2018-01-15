/*jshint esnext: true */
var TestCase = require('libnodejs-unittest/src/libnodejs/test/TestCase');
var TestSuite = require('libnodejs-unittest/src/libnodejs/test/TestSuite');
var assert = require('assert');
var TCPConnector = require('../../../../src/libnodejs/net/TCPConnector');
var TCPConnectorEvent = require('../../../../src/libnodejs/net/TCPConnectorEvent');
var TCPAcceptor = require('../../../../src/libnodejs/net/TCPAcceptor');
var TCPAcceptorEvent = require('../../../../src/libnodejs/net/TCPAcceptorEvent');
var LineStringBuffer = require('../../../../src/libnodejs/net/LineStringBuffer');

class TCPTest extends TestCase {
  constructor(methodName) {
    super(methodName);
  }

  _setUp() {
  }

  _tearDown() {
  }
  
  testListening() {
    var acceptor = new TCPAcceptor(new LineStringBuffer());
    var listening = false;
    acceptor.addListener(TCPAcceptorEvent.LISTENING, function() {
      listening = true;
    });
    this._runs(function() {
      acceptor.listen(TCPTest.TEST_HOST);
    });
    this._runs(function() {
      assert(listening === true);
    });
    this._runs(function() {
      acceptor.close();
    });
    this._waits(10);
  }
  
  testConnect() {
    var acceptor = new TCPAcceptor(new LineStringBuffer());
    var serverConnected = false;
    acceptor.addListener(TCPAcceptorEvent.CONNECTED, function() {
      serverConnected = true;
    });
    acceptor.listen(TCPTest.TEST_HOST);
    
    var connector = new TCPConnector(new LineStringBuffer());
    var clientConnected = false;
    connector.addListener(TCPConnectorEvent.CONNECTED, function() {
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
    this._runs(function() {
      acceptor.close();
    });
    this._waits(10);
  }
  
  testClose() {
    var acceptor = new TCPAcceptor(new LineStringBuffer());
    var acceptorClosed = false;
    acceptor.addListener(TCPAcceptorEvent.DISCONNECTED, function() {
      acceptorClosed = true;
    });
    acceptor.listen(TCPTest.TEST_HOST);

    var connector = new TCPConnector(new LineStringBuffer());
    var connectorClosed = false;
    connector.addListener(TCPConnectorEvent.DISCONNECTED, function() {
      connectorClosed = true;
    });
    this._runs(function() {
      connector.connect(TCPTest.TEST_HOST);
    });
    this._waits(10);
    this._runs(function() {
      connector.close();
    });
    this._waits(10);
    this._runs(function() {
      assert(connectorClosed === true);
      assert(acceptorClosed === true);
    });
    this._runs(function() {
      acceptor.close();
    });
    this._waits(10);
  }
  
  testDestroy(){
    var acceptor = new TCPAcceptor(new LineStringBuffer());
    this._runs(function(){
      acceptor.listen(TCPTest.TEST_HOST);
    });
    this._waits(10);
    
    var connector = new TCPConnector(new LineStringBuffer());
    var connectorClosed = false;
    connector.addListener(TCPConnectorEvent.DISCONNECTED, function() {
      connectorClosed = true;
    });
    this._runs(function() {
      connector.connect(TCPTest.TEST_HOST);
    });
    this._waits(10);
    this._runs(function() {
      connector.destroy();
    });
    this._runs(function() {
      assert(connectorClosed === true);
      acceptor.close();
    });
    this._waits(10);
  }

  testSendAndReceive() {
    var acceptor = new TCPAcceptor(new LineStringBuffer());
    var remotor = undefined;
    acceptor.addListener(TCPAcceptorEvent.CONNECTED, function(event) {
      remotor = event.getRemotor();
      remotor.print();
    });
    acceptor.addListener(TCPAcceptorEvent.DISCONNECTED, function(event) {
      event.getRemotor().print();
    });
    
    var connector = new TCPConnector(new LineStringBuffer());
    var connector2 = new TCPConnector(new LineStringBuffer());
    this._runs(function(){
      acceptor.listen(TCPTest.TEST_HOST);
    });
    this._waits(10);
    this._runs(function(){
      connector.connect(TCPTest.TEST_HOST);
      connector2.connect(TCPTest.TEST_HOST);
    });
    this._waits(10);
    this._runs(function() {
      assert(remotor !== undefined);
    });
    this._waits(10);
    this._runs(function(){
      //connector.send('hellow\n');
    });
    this._waits(10);
    this._runs(function(){
    });
    this._runs(function(){
      acceptor.close();
    });
    this._waits(100);
  }
  

  static createSuite() {
    var suite = new TestSuite('TCPTest');
    suite.add(new TCPTest('testListening'));
    suite.add(new TCPTest('testConnect'));
    suite.add(new TCPTest('testClose'));
    suite.add(new TCPTest('testDestroy'));
    suite.add(new TCPTest('testSendAndReceive'));
    return suite;
  }
}

TCPTest.TEST_HOST = "tcp://localhost:8001";

module.exports = TCPTest;

