/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Handle sqlite3 native module
    config.externals.push({
      'sqlite3': 'commonjs sqlite3'
    });
    return config;
  },
}

module.exports = nextConfig
