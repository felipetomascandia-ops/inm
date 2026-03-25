const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'faqwrfrilkmniprrvkun.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ]
  }
}

export default nextConfig
