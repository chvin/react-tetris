require('eventsource-polyfill');
/* eslint-disable import/no-unresolved */
const hotClient = require('webpack-hot-middleware/client?noInfo=false&reload=true');

hotClient.subscribe((event) => {
  if (event.action === 'reload') {
    window.location.reload();
  }
});
