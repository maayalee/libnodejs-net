/*jshint esnext: true */
var TestCase = require('libnodejs-unittest/src/libnodejs/test/TestCase');
var TestSuite = require('libnodejs-unittest/src/libnodejs/test/TestSuite');
var assert = require('assert');
var MessageBuffer = require('../../../../src/libnodejs/net/MessageBuffer');

class MessageBufferTest extends TestCase {
  constructor(methodName) {
    super(methodName);
    this.buffer = null; 
  }

  setUp() {
    this.buffer = new MessageBuffer();
  }

  tearDown() {
  }

  testPush() {
    this.buffer.push('{1}\n{2}\n');
    var messages = this.buffer.pullMessages();
    assert(messages.length == 2);
  }

  testPull() {
    this.buffer.push('{1}\n{2}\n');
    var messages = this.buffer.pullMessages();
    assert(messages.length == 2);
    assert(messages[0] == '{1}');
    assert(messages[1] == '{2}');
  }

  testFragmentMessage() {
    this.buffer.push('{1}\n{2}\n{\'type\':\'te');
    var messages = this.buffer.pullMessages();
    assert(messages.length == 2);
    assert(messages[0] == '{1}');
    assert(messages[1] == '{2}');

    this.buffer.push('st\'}\n');
    messages = this.buffer.pullMessages();
    assert(messages.length == 1);
    assert(messages[0] == '{\'type\':\'test\'}');
  }

  testNewlineString() {
    this.buffer.push('{1}\n{2\\ntest}\n');
    var messages = this.buffer.pullMessages();
    assert(messages.length == 2);
    assert(messages[0] == '{1}');
    assert(messages[1] == '{2\\ntest}');
  }

  testEmptyString() {
    this.buffer.push('\n\n{1}\n');
    var messages = this.buffer.pullMessages();
    assert(messages.length == 1);
    assert(messages[0] == '{1}');
  }

  static createSuite() {
    var suite = new TestSuite('MessageBufferTest');
    suite.add(new MessageBufferTest('testPush'));
    suite.add(new MessageBufferTest('testPull'));
    suite.add(new MessageBufferTest('testFragmentMessage'));
    suite.add(new MessageBufferTest('testNewlineString'));
    suite.add(new MessageBufferTest('testEmptyString'));
    return suite;
  }
}

module.exports = MessageBufferTest;

