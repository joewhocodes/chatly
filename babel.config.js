module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      ['@babel/preset-env', { targets: { node: '18.15.0' } }],
      '@babel/preset-typescript',
    ],
  };
};
