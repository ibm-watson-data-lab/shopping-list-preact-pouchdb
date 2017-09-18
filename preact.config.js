export default config => {
  config.resolve.mainFields = ["browser", "module", "main"];
  config.node.process = 'mock';
};
