import { Application } from "spectron";
import path from 'path';
var assert = require('assert')

var app = new Application({
  path: `${__dirname}/../node_modules/.bin/electron`,
  args: [path.join(__dirname, '..')]
})

app.start().then(function () {
    return app.browserWindow.isVisible()
}).then(function (isVisible) {
  // Verify the window is visible
  assert.equal(isVisible, true)
}).then(function () {
  // Get the window's title
  return app.client.getTitle()
}).then(function (title) {
  // Verify the window's title
  assert.equal(title, 'My App')
}).then(function () {
  // Stop the application
  return app.stop()
}).catch(function (error) {
  // Log any failures
  console.error('Test failed', error.message)
})