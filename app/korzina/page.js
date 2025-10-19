"use client"
import Breadcrumbs from "@/components/Breadcrumbs";
import UserCart from "@/components/UserCart";
import { getOneProduct } from "@/http/adminAPI";
import { useEffect, useState } from "react";

export default function Cart() {
	const [data, setData] = useState(null);
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		if (!loaded && typeof window !== "undefined") {
			fetchProducts();
		}
	}, [loaded]);

	const fetchProducts = async () => {
		try {
			const cartData = JSON.parse(localStorage.getItem("cart")) || [];
			const promises = cartData.map(async (item) => {
				const response = await getOneProduct(item.id);
				return { ...response, quantity: item.quantity };
			});
			const productsData = await Promise.all(promises);
			if (productsData.length > 0) {
				setData(productsData);
				setLoaded(true);
			}
		} catch (error) {
			console.error("Error fetching products:", error);
		}
	};
	return (
		<div className="container mx-auto py-10">
			{/* <Breadcrumbs /> */}
			{
				data ?
					<UserCart data={data} setData={setData} />
					:
					<div className="hero min-h-screen" style={{ backgroundImage: `url("/images/korzina.webp")` }}>
						<div className=""></div>
						<div className="hero-content text-center text-neutral-content">
							<div className="max-w-md text-white bg-black/50 px-5 py-4 rounded-md">
								<h1 className="mb-5 text-5xl font-bold uppercase">Пусто</h1>
								<p className="mb-5">
									Пока в вашей корзине нет товаров
								</p>
							</div>
						</div>
					</div>
			}
		</div>
	);
}

