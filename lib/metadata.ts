type MetadataOptions = {
  title?: string;
  description?: string;
  url?: string;
};

export function generateMetadata({
  title,
  description,
  url,
}: MetadataOptions = {}) {
  const siteName = "Travoo";
  const defaultTitle = "Travoo - Marketplace Wisata Terbaik Indonesia";
  const defaultDescription =
    "Temukan dan pesan paket wisata terbaik dari berbagai agen terpercaya di seluruh Indonesia.";

  return {
    title: title || defaultTitle,
    description: description || defaultDescription,
    keywords: ["travoo", "paket wisata", "booking liburan", "agen travel"],
    openGraph: {
      title: title || defaultTitle,
      description: description || defaultDescription,
      url: url || "https://travoo.com",
      siteName,
      type: "website",
    },
    robots: "index, follow",
  };
}
