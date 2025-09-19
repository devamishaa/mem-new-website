import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.memorae.ai', pathname: '/**' },
    ],
    // tune to your layout breakpoints
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    imageSizes:  [16, 24, 32, 48, 64, 96, 128, 256],
  },
};

export default withBundleAnalyzer(nextConfig);
