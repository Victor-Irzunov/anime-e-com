import QuickDeals from '@/components/sectionMainPage/QuickDeals'
import RecommendedProducts from '@/components/sectionMainPage/RecommendedProducts'
// import TrendingCategories from '@/components/sectionMainPage/TrendingCategories'
import TrendingCategoriesMain from '@/components/sectionMainPage/TrendingCategoriesMain'
import TrendingProducts from '@/components/sectionMainPage/TrendingProducts'
// import Image from 'next/image'

export default function Home() {
  return (
    <main className="">
      <div className='container mx-auto'>
        <div className='my-4'>
          <h1 className='sd:text-xl xz:text-base font-semibold'>
            Интернет-магазин ноутбуков
          </h1>
        </div>
        <TrendingCategoriesMain />
        <QuickDeals />
        <TrendingProducts />
        <RecommendedProducts />
        {/* <TrendingCategories /> */}
      </div>
    </main>
  )
}
