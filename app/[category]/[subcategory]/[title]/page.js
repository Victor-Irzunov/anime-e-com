import Breadcrumbs from "@/components/Breadcrumbs"
import ProductDetailsOverview from "@/components/ProductDetailsOverview"
import RecommendedProducts from "@/components/RecommendedProduct"
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getData(title) {
    try {
        const data = await prisma.product.findFirst({
            where: {
                titleLink: title
            },
        });
        if (!data || data.length === 0) {
            throw new Error(`Проблема с получением конкретного товара ProductDetails`);
        }
        return data
    } catch (error) {
        console.error("Ошибки при запросе конкретного товара ProductDetails:", error);
        throw error;
    }
}

export async function generateMetadata({ params: subcategory }) {

    const data = await getData(subcategory.title);

    let title1
    let description1

    if (data) {
        title1 = `${data.title} купить в Минске: доставка по Беларуси`,
            description1 = `${data.title} по доступной цене в интернет-магазине. ${data.title} купить в Минске с фото и описанием — доставка по Беларуси.`
    }
    return {
        title: title1,
        description: description1,
        keywords: `${(data.title).toLowerCase()}, купить`,
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${subcategory.category}/${subcategory.subcategory}/${subcategory.title}`,
        },
        og: {
            title: title1,
            description: description1,
            type: 'website',
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
            image: '',
        },
    };
}
export default async function ProductDetails({ params: { title } }) {
    const data = await getData(title);

    return (

        <div className='container mx-auto'>
            <Breadcrumbs title={data ? data.title : []} />
            <div className='mt-6 mb-8 pl-3'>
                <h1 className='sd:text-4xl xz:text-xl'>
                    {data?.title}
                </h1>
            </div>
            {data ? (
                <>
                    <ProductDetailsOverview product={data} />
                    <RecommendedProducts />
                </>
            ) : (
                <div className="p-12 flex min-h-[22rem]">
                    <span className="m-auto loading loading-ring loading-lg"></span>
                </div>
            )}
        </div>
    )
}

