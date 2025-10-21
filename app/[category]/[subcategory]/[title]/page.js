// /app/[category]/[subcategory]/[title]/page.jsx
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import ImgProductDetails from "@/components/ImgProductDetails";
import ProductDetailsOverview from "@/components/ProductDetailsOverview";



export async function generateMetadata({ params }) {
  const { title } = await params;
  const product = await prisma.product.findFirst({
    where: { titleLink: title },
    include: { categoryRel: true, subCategoryRel: true },
  });
  if (!product) return {};
  const h1 = product.h1 || product.title;
  return {
    title: product.metaTitle || h1,
    description: product.metaDesc || product.description.slice(0, 160),
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${product.categoryRel?.value || ""}/${product.subCategoryRel?.value || ""}/${product.titleLink}`,
    },
  };
}

export default async function Page({ params }) {
  const { category, subcategory, title } = await params;

  const product = await prisma.product.findFirst({
    where: { titleLink: title },
    include: { categoryRel: true, subCategoryRel: true, brandRel: true },
  });
  if (!product) notFound();

  const catSlug = product.categoryRel?.value || category;
  const subSlug = product.subCategoryRel?.value || subcategory;

  // Канонизация полного пути товара
  if (category !== catSlug || subcategory !== subSlug) {
    redirect(`/${encodeURIComponent(catSlug)}/${encodeURIComponent(subSlug)}/${encodeURIComponent(product.titleLink)}`);
  }

  return (
    <main className="container mx-auto pt-2 pb-10">
      <Breadcrumbs title={product.title} />
      <div className="mt-6 grid sd:grid-cols-[1fr] xz:grid-cols-1 gap-6">
        <ImgProductDetails product={product} />
        <ProductDetailsOverview product={product} />
      </div>
    </main>
  );
}
