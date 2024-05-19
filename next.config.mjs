/** @type {import('next').NextConfig} */

const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/character',
          destination: 'http://consciousnft.ai/api/partner/v1/character',
        },
      ];
    },
  };
  
  export default nextConfig;
  