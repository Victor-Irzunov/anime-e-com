"use client"
import { MyContext } from "@/contexts/MyContextProvider";
import { orderData } from "@/http/userAPI";
import { Empty } from "antd";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

const OrdersPage = observer(() => {
	const { user } = useContext(MyContext);
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		if (user.isAuth) {
			orderData()
				.then(data => {
					setOrders(data);
				});
		}
	}, [user.isAuth]);

	const formatDate = (dateString) => {
		const dateObj = new Date(dateString);
		const formattedDate = `${padWithZero(dateObj.getDate())}.${padWithZero(dateObj.getMonth() + 1)}.${dateObj.getFullYear()} ${padWithZero(dateObj.getHours())}:${padWithZero(dateObj.getMinutes())}`;
		return formattedDate;
  };

  const padWithZero = (num) => {
		return num.toString().padStart(2, '0');
  };

	return (
		<section className="py-20">
			<div className="container mx-auto">
				<div className="text-center">
					<h1 className="text-3xl">
						Ваши заказы
					</h1>
					{!user.isAuth ? (
						<div className="mt-16">
							<p className="mb-7 text-center">
								Отсутствуют данные. Вы не авторизованы.
							</p>
							<Empty />
							<div className="text-center mt-10">
								<button className="btn btn-primary">
									<Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/login`}>
										Авторизоваться
									</Link>
								</button>
							</div>
						</div>
					) : (
						<div>
							{orders.length ? (
								<div className="overflow-x-auto">
									<table className="w-full mt-8 table table-xs ">
										<thead>
											<tr>
												<th className="p-2">Дата создания</th>
												<th className="p-2">Товары</th>
												<th className="p-2">Цена</th>
												<th className="p-2">Количество</th>
												<th className="p-2">Скидка</th>
												<th className="p-2">Итого</th>
												<th className="p-2">Адрес</th>
												<th className="p-2">Телефон</th>
												<th className="p-2">Сообщение</th>
											</tr>
										</thead>
										<tbody>
											{orders.map(order => (
												<tr key={order.id}>
													<td className="p-2">{formatDate(order.createdAt)}</td>
													<td className="p-2">
														<ul>
															{order.orderItems.data.map(item => (
																<li key={item.productId}>{item.title}</li>
															))}
														</ul>
													</td>
													<td className="p-2">
														<ul>
															{order.orderItems.data.map(item => (
																<li key={item.productId}>
																	{item.price} BYN
																</li>
															))}
														</ul>
													</td>
													<td className="p-2">
														<ul>
															{order.orderItems.data.map(item => (
																<li key={item.productId}>{item.quantity}</li>
															))}
														</ul>
													</td>
													<td className="p-2">
														<ul>
															{order.orderItems.data.map(item => (
																<li key={item.productId}>
																	{item.discountPercentage}%
																</li>
															))}
														</ul>
													</td>
													<td className="p-2">
														<ul>
															{order.orderItems.data.map(item => (
																<li key={item.productId}>
																	{item.totalAmount} BYN
																</li>
															))}
														</ul>
													</td>
													<td className="p-2">{order.address}</td>
													<td className="p-2">{order.phone}</td>
													<td className="p-2">{order.message}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<div className="mt-16">
									<p className="mb-7 text-center">
										Пока заказов у вас нет.
									</p>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</section>
	);
});

export default OrdersPage;
