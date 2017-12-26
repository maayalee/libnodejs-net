/**
 * http://usejsdoc.org/
 */
var TestCase = require('libnodejs-unittest/src/libnodejs/test/TestCase');
var TestRunner = require('libnodejs-unittest/src/libnodejs/test/TestRunner');
var MessageBufferTest = require('./tests/src/libnodejs/net/MessageBufferTest');

var runner = new TestRunner();
runner.add(MessageBufferTest.createSuite());
runner.run(function() {
  console.log(runner.summary());
  process.exit();
});