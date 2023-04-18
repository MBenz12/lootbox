/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
<<<<<<< HEAD
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
=======
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Configure the fallback object
      config.resolve.fallback = {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        util: require.resolve("util"),
        assert: require.resolve("assert"),
        fs: false,
        process: false,
        path: false,
        zlib: false,
      };
    }

    return config;
>>>>>>> dev
  },
}

module.exports = nextConfig
