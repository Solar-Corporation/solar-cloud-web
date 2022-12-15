/* eslint-disable */
/** @type {import('next').NextConfig} **/

const withLess = require("next-with-less");

module.exports = withLess({
  reactStrictMode: false,
  swcMinify: true,
  // experimental: {
  //   appDir: true
  // },
  lessLoaderOptions: {}
});