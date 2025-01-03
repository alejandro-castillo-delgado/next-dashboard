/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        ppr: 'incremental',
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ps3nz7cit1ipmopf.public.blob.vercel-storage.com',
                port: '',
            },
        ],
    },
};

export default nextConfig;
