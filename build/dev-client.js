require('eventsource-polyfill');
const hotClient = require('webpack-hot-middleware/client?noInfo=false&reload=true');

hotClient.subscribe((event) => {
  if (event.action === 'reload') {
    window.location.reload();
  }
});
