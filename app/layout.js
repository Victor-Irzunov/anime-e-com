// /app/layout.js
import "./globals.css";
import Header from "@/components/header/Header";
import CategoryMenu from "@/components/CategoryMenu";
import Footer from "@/components/footer/Footer";
import { MyContextProvider } from "@/contexts/MyContextProvider";
import "@/lib/antdCompatFlag";
import ClientRoot from "@/components/ClientRoot";

const SITE = process.env.NEXT_PUBLIC_BASE_URL || "https://akani.by";

export const metadata = {
  metadataBase: new URL(SITE),
  title: "Купить аниме фигурки в Минске — Аниме магазин «Акани»",
  description:
    "Аниме магазин «Акани» — большой выбор аниме фигурок и мерча в Минске. Самовывоз из магазинов, доставка по городу курьером и по Беларуси почтой. Новинки каждую неделю, акции и предзаказы.",
  keywords:
    "аниме фигурки, фигурки Минск, купить фигурку аниме Минск, мерч аниме Минск, магазин аниме Минск, аниме подарки",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_BY",
    url: "/",
    siteName: "Акани",
    title: "Купить аниме фигурки в Минске — «Акани»",
    description:
      "Фигурки аниме, мерч и подарки. Самовывоз и доставка по Беларуси.",
    images: [{ url: "/og/og-image.jpg", width: 1200, height: 630, alt: "Акани — магазин аниме" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Купить аниме фигурки в Минске — «Акани»",
    description:
      "Большой выбор аниме фигурок и мерча. Самовывоз и доставка по Беларуси.",
    images: ["/og/og-image.jpg"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#cdcecf" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />

      </head>
      <MyContextProvider>
        <body className="bg-[#f0f9ff]">
          <Header />
          <CategoryMenu />
          <ClientRoot>
            {children}
          </ClientRoot>
          <Footer />
        </body>
      </MyContextProvider>
    </html>
  );
}
