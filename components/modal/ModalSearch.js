import { useState, useEffect, useRef, useCallback } from "react";
import { Modal, Input } from "antd";
import { searchProduct } from "@/http/productsAPI";
import Link from "next/link";

const { Search } = Input;

const ModalSearch = ({ modalVisible, setModalVisible }) => {
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searching, setSearching] = useState(false);
	const [timer, setTimer] = useState(null);

	const emailInput = useCallback((inputElement) => {
		if (inputElement) {
			inputElement.focus();
		}
	}, []);

	const handleSearch = async (value) => {
		try {
			setLoading(true);
			setSearching(true);
			const searchData = await searchProduct({ searchTerm: value });
			setSearchResults(searchData);
		} catch (error) {
			console.error('Ошибка при выполнении поиска:', error);
		} finally {
			setLoading(false);
			setSearching(false); // Установить состояние для скрытия "Поиск..."
		}
	};

	const handleChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		if (timer) {
			clearTimeout(timer);
		}
		if (value.trim() !== '') {
			setTimer(setTimeout(() => handleSearch(value), 500));
		} else {
			setSearchResults([]);
		}
	};

	const onCancel = () => {
		setModalVisible(false)
		setSearchResults([])
		setSearchTerm('')
	}

	return (
		<div>
			<Modal
				title="Поиск товара"
				open={modalVisible}
				onCancel={onCancel}
				footer={null}
			>
				<Search
					ref={emailInput}
					placeholder="Введите название товара"
					value={searchTerm}
					onChange={handleChange}
					allowClear
					loading={loading}
				/>
				{(searching && searchResults.length === 0) && (
					<p className="mt-10">Поиск...</p>
				)}
				{(!loading && !searching && searchResults.length === 0 && searchTerm && searchResults.length === 0) && (
					<p className="mt-10">Продукты не найдены</p>
				)}
				{(searchResults.length > 0 || loading) && (
					<>
						<div className='divider' />
						<div className='mt-5'>
							<ul className=''>
								{searchResults.map(el => (
									<li className='mb-3' key={el.id}>
										<Link
											href={`${process.env.NEXT_PUBLIC_BASE_URL}/${el.category}/${el.subcategory}/${el.titleLink}`}
											className='flex'
										>
											<div className='mr-2'>
												<img
													src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${JSON.parse(el.thumbnail)[0].image}`}
													alt={el.title}
													className="w-8 h-8"
												/>
											</div>
											{el.title}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</>
				)}
			</Modal>
		</div>
	);
};

export default ModalSearch;
