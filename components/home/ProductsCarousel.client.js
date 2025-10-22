// /components/home/ProductsCarousel.client.jsx
"use client";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCardCompact from "@/components/ProductCardCompact"; // готовая карточка

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 5 },
  desktop: { breakpoint: { max: 1536, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 2 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 2 },
};

export default function ProductsCarouselClient({ items = [] }) {
  if (!items.length) return null;

  return (
    <Carousel
      responsive={responsive}
      arrows
      autoPlay
      autoPlaySpeed={4000}
      infinite
      pauseOnHover
      containerClass="pb-10"
      itemClass="px-2"
    >
      {items.map((p) => (
        <div key={p.id} className="h-full">
          <ProductCardCompact product={p} />
        </div>
      ))}
    </Carousel>
  );
}
