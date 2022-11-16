const withLess = require("next-with-less");

module.exports = withLess({
  reactStrictMode: false,
  swcMinify: true,
  lessLoaderOptions: {}
});