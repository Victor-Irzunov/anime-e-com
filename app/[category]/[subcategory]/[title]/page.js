// /app/[category]/[subcategory]/[title]/page.jsx
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ImgProductDetails from "@/components/ImgProductDetails";
import ProductDetailsOverview from "@/components/ProductDetailsOverview";
import RecommendedProduct from "@/components/RecommendedProduct.client";
import Script from "next/script";
import BackButton from "@/components/ui/BackButton.client";

const CITY = "Минске";

function absUrl(u) {
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  if (!u) return undefined;
  return /^https?:\/\//i.test(u) ? u : `${base}${u.startsWith("/") ? "" : "/"}${u}`;
}

export async function generateMetadata({ params }) {
  const { title } = await params; // ← обязательно await
  const product = await prisma.product.findFirst({
    where: { titleLink: title },
    include: {
      categoryRel: { select: { value: true } },
      subCategoryRel: { select: { value: true } },
      brandRel: { select: { name: true } }, // русское имя бренда
    },
  });
  if (!product) return {};

  const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  const h1 = product.h1 || product.title;
  const brandName = product.brandRel?.name || product.brand || ""; // русское имя
  const price = Number(product.price || 0).toFixed(2);
  const cat = product.categoryRel?.value || "";
  const sub = product.subCategoryRel?.value || "";
  const canonical = `${base}/${cat}/${sub}/${product.titleLink}`;
  const ogImg = absUrl(product.thumbnail);

  return {
    title: product.metaTitle || `Купить ${h1} в ${CITY} — цена ${price} BYN, доставка по Беларуси`,
    description:
      product.metaDesc ||
      `${h1}${brandName ? `, ${brandName}` : ""}. Цена ${price} BYN. Заказ онлайн, быстрая доставка по ${CITY} и всей Беларуси.`,
    alternates: { canonical },
    openGraph: {
      type: "website", // "product" в Next Metadata ругался — используем website
      url: canonical,
      title: `Купить ${h1} в ${CITY}`,
      description:
        product.metaDesc ||
        `${h1}${brandName ? `, ${brandName}` : ""}. Цена ${price} BYN. Доставка по ${CITY} и Беларуси.`,
      images: ogImg ? [{ url: ogImg }] : [],
    },
  };
}

export default async function Page({ params }) {
  const { category, subcategory, title } = await params; // ← обязательно await

  const product = await prisma.product.findFirst({
    where: { titleLink: title },
    include: {
      categoryRel: { select: { value: true } },
      subCategoryRel: { select: { value: true } },
      brandRel: { select: { name: true } }, // русское имя в данных
    },
  });
  if (!product) notFound();

  const catSlug = product.categoryRel?.value || category;
  const subSlug = product.subCategoryRel?.value || subcategory;

  // канонизация пути
  if (category !== catSlug || subcategory !== subSlug) {
    redirect(`/${encodeURIComponent(catSlug)}/${encodeURIComponent(subSlug)}/${encodeURIComponent(product.titleLink)}`);
  }

  const h1 = product.h1 || product.title;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: h1,
    image: Array.isArray(product.images)
      ? product.images.map((i) => i.url || i.image).filter(Boolean).map(absUrl)
      : [],
    sku: product.article || String(product.id),
    brand: (product.brandRel?.name || product.brand)
      ? { "@type": "Brand", name: product.brandRel?.name || product.brand }
      : undefined,
    category: product.categoryRel?.value || product.category || "",
    offers: {
      "@type": "Offer",
      url: `${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "")}/${catSlug}/${subSlug}/${product.titleLink}`,
      priceCurrency: "BYN",
      price: Number(product.price || 0).toFixed(2),
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      areaServed: ["Minsk", "Belarus"],
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Каталог", item: (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "") + "/" },
      { "@type": "ListItem", position: 2, name: product.categoryRel?.value || product.category || "Категория", item: `${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "")}/${catSlug}` },
      { "@type": "ListItem", position: 3, name: product.subCategoryRel?.value || product.subcategory || "Подкатегория", item: `${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "")}/${catSlug}/${subSlug}` },
      { "@type": "ListItem", position: 4, name: h1, item: `${(process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/+$/, "")}/${catSlug}/${subSlug}/${product.titleLink}` },
    ],
  };

  return (
    <main className="pb-10">
      <div className="container mx-auto pt-4">
        <BackButton />
      </div>
      <div className='container mx-auto pt-12'>

        <h1 className="sd:text-3xl xz:text-2xl font-medium mb-6">{h1}</h1>

        <Breadcrumbs title={product.title} />

        <div className="mt-6 grid sd:grid-cols-[1fr] xz:grid-cols-1 gap-6">
          <ImgProductDetails product={product} />
          <ProductDetailsOverview product={product} />
        </div>

        {/* Рекомендованные товары того же бренда */}
        <RecommendedProduct
          brandId={product.brandId ?? null}
          brandName={product.brandRel?.name || product.brand || ""}
          excludeId={product.id}
          take={10}
        />

      </div>

      {/* JSON-LD */}
      <Script id="ld-product" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Script id="ld-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

    </main>
  );
}
