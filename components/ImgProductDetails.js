"use client"
import Link from "next/link";
import { useContext, useState } from "react";
import { RiAddFill, RiCheckboxCircleFill, RiShieldCheckFill, RiSubtractFill } from "react-icons/ri";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import FormOrder from "./Form/FormOrder";
import { MyContext } from "@/contexts/MyContextProvider";



const ImgProductDetails = ({ product }) => {
	const { brand, images, description, price, rating, discountPercentage, thumbnail, title, stock, id, category } = product
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [quantity, setQuantity] = useState(1);
	const { updateState } = useContext(MyContext)

	const handleIncrementQuantity = () => {
		setQuantity((prevQuantity) => prevQuantity + 1);
	};

	const handleDecrementQuantity = () => {
		if (quantity > 1) {
			setQuantity((prevQuantity) => prevQuantity - 1);
		}
	};
	const closeModalOrder = () => {
		document.getElementById("my_modal_3").close();
	};
	const handleAddToCart = () => {
		const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

		const existingProductIndex = existingCart.findIndex(
			(cartItem) => cartItem.id === product.id
		);
		
		if (existingProductIndex !== -1) {
			existingCart[existingProductIndex].quantity += quantity;
		} else {
			existingCart.push({ id: product.id, title: product.title, category: product.category, quantity });
		}
		localStorage.setItem("cart", JSON.stringify(existingCart));
		updateState()
		document.getElementById('my_modal_1').showModal()
		setTimeout(() => {
			document.getElementById('my_modal_1').close()
		}, 4000)
	};
	const handleImageClick = (index) => {
		setSelectedImageIndex(index);
	};
	const handleImageView = () => {
		setIsModalOpen(true);
	};
	const closeModal = () => {
		setIsModalOpen(false);
	};

	const handlePrevImage = () => {
		const prevIndex = (selectedImageIndex - 1 + img.length) % img.length;
		setSelectedImageIndex(prevIndex);
	};

	const handleNextImage = () => {
		const nextIndex = (selectedImageIndex + 1) % img.length;
		setSelectedImageIndex(nextIndex);
	};

	const img = JSON.parse(product.images)

	return (
		<div className="bg-white p-6 rounded-lg border border-gray-300 flex sd:flex-row xz:flex-col gap-6">
			<div>
				<div className="sd:w-[32rem] xz:w-auto aspect-[4/3] overflow-hidden rounded-lg border border-gray-300">
					<div className="max-w-full cursor-pointer" onClick={handleImageView}>
						<img src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${img[selectedImageIndex].image}`} alt="" className="w-full h-full object-cover" />
					</div>
				</div>
				<div className="flex items-center gap-3 mt-6 overflow-x-auto sd:w-[32rem] xz:w-auto">
					<div className="flex">
						{JSON.parse(product.images).map((img, idx) => (
							<div
								key={idx}
								className="w-20 h-16 rounded border border-gray-300 mx-1 overflow-hidden cursor-pointer"
								onClick={() => handleImageClick(idx)}
							>
								<img src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${img.image}`} alt="" className="w-full h-full object-cover" />
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="flex-1">
				<h2 className="font-medium text-xl">{title}</h2>
				<p className="text-sm">
					Бренд:{" "}
					<Link href="#" className="link link-primary no-underline">
						{brand}
					</Link>
				</p>
				<div className="pb-3 pt-1 text-sm text-gray-400">На складе: {stock}</div>
				<div className="pb-3 pt-1 text-sm text-gray-400">Артикль: {id}</div>
				<div className="pt-1 flex items-center gap-3">
					<strong className="text-2xl font-medium text-gray-800">{price.toFixed(2)} руб</strong>
					<span className="font-medium text-gray-500 line-through">{(price / 100 * discountPercentage + price).toFixed(2)} руб</span>
					<span className="text-green-500 text-sm font-semibold">{discountPercentage}%</span>
				</div>
				<div className="flex items-center gap-2">
					<div className="rating rating-sm disabled">
						{[1, 2, 3, 4, 5].map((rating) => (
							<input
								key={rating}
								type="radio"
								className={`mask mask-star-2 ${Math.floor(rating) >= rating ? "bg-orange-400" : "bg-gray-300"
									}`}
							/>
						))}
					</div>
					<span className="text-orange-400">{rating}</span>
					<span className="text-green-500 ml-2 sd:text-base xz:text-xs">Бесплатная доставка</span>

				</div>
				<div className="badge badge-lg bg-emerald-600 text-white gap-2 pl-1.5 mt-3">
					<RiCheckboxCircleFill fontSize={18} /> Рекомендуем
				</div>
				<div className="py-4 max-w-lg">
					<p>
						{description}
					</p>
				</div>
				<div className="join py-4">
					<button
						onClick={handleDecrementQuantity}
						className="join-item btn btn-sm px-2 border border-gray-300"
					>
						<RiSubtractFill fontSize={20} />
					</button>
					<input
						value={quantity}
						readOnly
						className="btn btn-sm px-4 
						join-item pointer-events-none
						 bg-white border border-gray-300 w-14"
					/>
					<button
						onClick={handleIncrementQuantity}
						className="join-item btn btn-sm px-2 border border-gray-300"
					>
						<RiAddFill fontSize={20} />
					</button>
				</div>
				<div className="flex gap-3">
					<button
						className="btn btn-secondary capitalize"
						onClick={() => document.getElementById('my_modal_3').showModal()}
					>
						Быстрая покупка
					</button>
					<button
						className="btn btn-accent capitalize text-white"
						onClick={handleAddToCart}
					>
						В корзину
					</button>
				</div>
				<div className="pt-4 flex items-center gap-3 text-sm text-gray-500">
					<RiShieldCheckFill fontSize={22} />
					Быстрая доставка. Простой возврат.
				</div>
			</div>

			{isModalOpen && (
				<div className="fixed inset-0 z-10 flex items-center justify-center">
					<div className="fixed inset-0 bg-black opacity-50"></div>
					<div className="relative bg-white p-8 rounded-lg max-w-2xl w-full cursor-pointer">
						<img
							src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${img[selectedImageIndex].image}`}
							alt=""
							className="w-full h-full object-cover rounded-lg"
						/>
						<div className="absolute top-1/2 -translate-x-1/2 left-10 cursor-pointer" onClick={handlePrevImage}>
							<BsChevronLeft className="text-3xl text-gray-700 hover:text-gray-900" />
						</div>
						<div className="absolute top-1/2 -translate-x-1/2 right-2 cursor-pointer" onClick={handleNextImage}>
							<BsChevronRight className="text-3xl text-gray-700 hover:text-gray-900" />
						</div>
						<div className="absolute top-4 right-4 cursor-pointer" onClick={closeModal}>
							<span className="text-3xl font-bold">✕</span>
						</div>
					</div>
				</div>
			)}

			<dialog id="my_modal_3" className="modal">
				<div className="modal-box">
					<form method="dialog">
						<button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
					</form>
					<p className="font-bold text-lg">Ваш заказ: {title}</p>
					<p className="font-bold text-base">Cумма заказа: {price.toFixed(2)} руб</p>
					<p className="py-4 text-xs">Заполните, пожалуйста, данные формы, чтобы быстро оформить заказ.</p>
					<div className="modal-action">
						<FormOrder product={product} closeModalOrder={closeModalOrder} />

					</div>
					<p className="py-4 text-sm">
						После получения вашего заказа мы перезвоним вам для подтверждения.
					</p>
				</div>
			</dialog>

			<dialog id="my_modal_1" className="modal">
				<div className="modal-box">
					<p className="font-bold text-lg mb-3">Товар добавлен в корзину</p>
					<p className="font-bold text-lg">{title}</p>
					<div className='flex items-center justify-between'>
						<div className="w-[7rem] h-[7rem] mt-5 mb-3 rounded-lg overflow-hidden border border-gray-300">
							<img src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${img[0].image}`} alt="" className="w-full h-full object-cover" />
						</div>
						<strong className="text-2xl font-medium text-gray-800">{price.toFixed(2)} руб</strong>
					</div>
					<div className="modal-action">
						<Link href='/korzina' className="btn">
							Перейти в корзину
						</Link>
						<form method="dialog">
							<button className="btn">Продолжить покупки</button>
						</form>
					</div>
				</div>
			</dialog>
		</div>
	)
}

export default ImgProductDetails;