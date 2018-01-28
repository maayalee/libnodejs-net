/*jshint esnext: true */
var TestCase = require('libnodejs-unittest/src/libnodejs/test/TestCase');
var TestSuite = require('libnodejs-unittest/src/libnodejs/test/TestSuite');
var assert = require('assert');
var TCPConnector = require('../../../../src/libnodejs/net/TCPConnector');
var TCPConnectorEvent = require('../../../../src/libnodejs/net/TCPConnectorEvent');
var TCPAcceptor = require('../../../../src/libnodejs/net/TCPAcceptor');
var TCPAcceptorEvent = require('../../../../src/libnodejs/net/TCPAcceptorEvent');
var TCPDataEvent = require('../../../../src/libnodejs/net/TCPDataEvent');
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
    var clientRemotor = undefined;
    acceptor.addListener(TCPAcceptorEvent.CONNECTED, function(event) {
      clientRemotor = event.getRemotor();
    });
    acceptor.listen(TCPTest.TEST_HOST);
    
    var connector = new TCPConnector(new LineStringBuffer());
    var serverRemotor = undefined;
    connector.addListener(TCPConnectorEvent.CONNECTED, function(event) {
      serverRemotor = event.getRemotor();
    });
    this._runs(function() {
      connector.connect(TCPTest.TEST_HOST);
    });
    
    this._waits(10);
    this._runs(function() {
      assert(clientRemotor !== undefined);
      assert(clientRemotor.getID() === 1);
      assert(serverRemotor !== undefined);
      assert(serverRemotor.getID() === 1);
    });
    this._runs(function() {
      acceptor.close();
    });
    this._waits(10);
  }
  
  testClose() {
    var acceptor = new TCPAcceptor(new LineStringBuffer());
    var clientRemotor = undefined;
    acceptor.addListener(TCPAcceptorEvent.DISCONNECTED, function(event) {
      clientRemotor = event.getRemotor();
    });
    acceptor.listen(TCPTest.TEST_HOST);

    var connector = new TCPConnector(new LineStringBuffer());
    var serverRemotor = undefined;
    connector.addListener(TCPConnectorEvent.DISCONNECTED, function(event) {
      serverRemotor = event.getRemotor();
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
      assert(serverRemotor !== undefined);
      assert(serverRemotor.getID() === 1);
      assert(clientRemotor !== undefined);
      assert(clientRemotor.getID() === 1);
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
    var serverRemotor = undefined;
    connector.addListener(TCPConnectorEvent.DISCONNECTED, function(event) {
      serverRemotor = event.getRemotor();
    });
    this._runs(function() {
      connector.connect(TCPTest.TEST_HOST);
    });
    this._waits(10);
    this._runs(function() {
      connector.destroy();
    });
    this._runs(function() {
      assert(serverRemotor !== undefined);
      assert(serverRemotor.getID() === 1);
      acceptor.close();
    });
    this._waits(10);
  }

  testSendAndReceive() {
    var acceptor = new TCPAcceptor(new LineStringBuffer());
    var connector = new TCPConnector(new LineStringBuffer());
    this._runs(function(){
      acceptor.listen(TCPTest.TEST_HOST);
    });
    this._waits(10);
    this._runs(function(){
      connector.connect(TCPTest.TEST_HOST);
    });
    this._waits(10);
       
    var acceptorMessages = undefined;
    acceptor.addListener(TCPDataEvent.RECV_MESSAGE, function(event) {
      acceptorMessages = event.getMessages();
      event.getRemotor().send('world\n');
    });
    var connectorMessages = undefined;
    connector.addListener(TCPDataEvent.RECV_MESSAGE, function(event) {
      connectorMessages = event.getMessages();
    });

    this._runs(function(){
      connector.send('hellow\n');
    });
    this._waits(10);
    this._runs(function(){
      assert(acceptorMessages.length === 1);
      assert(acceptorMessages[0] === 'hellow');
      assert(connectorMessages.length === 1);
      assert(connectorMessages[0] === 'world');
    });
    this._runs(function(){
      acceptor.close();
    });
    this._waits(10);
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

