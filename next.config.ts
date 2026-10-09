import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // mupdf is a WASM package; keep it external so its .wasm binary is copied
  // into the serverless function instead of being (incompletely) bundled.
  serverExternalPackages: ["mupdf"],
};

export default nextConfig;
