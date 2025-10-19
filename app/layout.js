import './globals.css'
import Header from '@/components/header/Header'
import CategoryMenu from '@/components/CategoryMenu'
import Footer from '@/components/footer/Footer'
import { MyContextProvider } from '@/contexts/MyContextProvider'

export const metadata = {
  title: 'Ноутбук купить в Минске | Большой каталог',
  description: 'Широкий выбор ноутбуков по доступным ценам в Минске. Бесплатная доставка и гарантия качества. Более 1000 моделей.',
  keywords: "ноутбук, купить, Минск, интернет-магазин, доставка",
  alternates: {
    canonical: 'http://localhost:3000/'
  },
  ogTitle: 'Ноутбук купить в Минске | Большой каталог',
  ogDescription: 'Широкий выбор ноутбуков по доступным ценам в Минске. Бесплатная доставка и гарантия качества.',
  ogImage: 'ссылка_на_изображение.jpg', // замените ссылку на фактическую ссылку на изображение
  twitterTitle: 'Ноутбук купить в Минске | Большой каталог',
  twitterDescription: 'Широкий выбор ноутбуков по доступным ценам в Минске. Бесплатная доставка и гарантия качества.',
  twitterImage: 'ссылка_на_изображение.jpg' // замените ссылку на фактическую ссылку на изображение
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <meta name="theme-color" content="#cdcecf" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
      </head>
      <MyContextProvider>
        <body className='bg-[#f0f9ff]'>
          <Header />
          <CategoryMenu />
          {children}
          <Footer />
        </body>
      </MyContextProvider>
    </html>
  )
}
