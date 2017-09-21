const path = require('path');

export default config => {
  config.resolve.mainFields = ["browser", "module", "main"];
  config.node.process = 'mock';
  config.target = 'web';
  config.output.path = path.resolve(__dirname, 'docs');
  config.output.publicPath = './';
};
