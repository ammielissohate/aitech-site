import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Images des réalisations, hébergées sur Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "**.public.blob.vercel-storage.com", port: "", search: "" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
