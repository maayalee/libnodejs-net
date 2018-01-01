/**
 * http://usejsdoc.org/
 */
var TestCase = require('libnodejs-unittest/src/libnodejs/test/TestCase');
var TestRunner = require('libnodejs-unittest/src/libnodejs/test/TestRunner');
var MessageBufferTest = require('./tests/src/libnodejs/net/MessageBufferTest');
var TCPTest = require('./tests/src/libnodejs/net/TCPTest');

var runner = new TestRunner();
runner.add(MessageBufferTest.createSuite());
runner.add(TCPTest.createSuite());
runner.run(function() {
  console.log(runner.summary());
  process.exit();
});