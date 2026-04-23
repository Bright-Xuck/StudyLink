/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
};

module.exports = withNextIntl()(nextConfig);

