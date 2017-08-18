var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/github-api/dist/GitHub.bundle.js',
      'test/**/*Spec.js',
      'test/**/*Spec.ts',
      'test/**/*Spec.jsx'
    ],
    preprocessors: {
      'test/**/*Spec.ts': ['webpack'],
      'test/**/*Spec.js': ['webpack'],
      'test/**/*Spec.jsx': ['webpack']
    },
    mime: {
     'text/x-typescript': ['ts','tsx']
    },
    webpack: webpackConfig,
    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    concurrency: Infinity
  })
};
