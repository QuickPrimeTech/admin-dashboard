import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Restaurant Admin Dashboard",
    short_name: "Dashboard",
    description:
      "Manage your restauran info seamlessly and see them update instantly on your website",
    start_url: "/login",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#f54a00",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
