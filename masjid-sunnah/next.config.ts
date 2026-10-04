import type { NextConfig } from "next";

// Statischer Export: läuft auf jedem Hosting (TODO: Hosting klären, ggf. basePath/trailingSlash anpassen).
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default config;
