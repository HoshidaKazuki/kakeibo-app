import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "かけぼっちゃん",
    short_name: "かけぼっちゃん",
    description: "かんたん家計簿アプリ「かけぼっちゃん」",
    start_url: "/",
    display: "standalone",
    background_color: "#f5ede0",
    theme_color: "#f5ede0",
    orientation: "portrait",
    lang: "ja",
    icons: [
      {
        src: "/icon?size=192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon?size=512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
