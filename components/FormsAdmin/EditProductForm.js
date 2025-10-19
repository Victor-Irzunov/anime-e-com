"use client"
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, InputNumber, Form, Input, Radio, message, Upload, Modal, Image, Popconfirm, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { transliterate } from '@/transliterate/transliterate';
import { deleteOneImage, deleteOneProduct, updateOneProduct } from "@/http/adminAPI";
const { Dragger } = Upload; // Используем компонент Dragger из Ant Design
const { TextArea } = Input;


const getBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});

const brandData = ["Apple", "Samsung", "LG"];
const dataCategory = [
	{
		id: 1,
		category: { name: 'Мобильные телефоны', value: 'mobilnye-telefony' },
		subCategories: [{ name: 'Телефоны', value: 'telefony' }],
	},
	{
		id: 2,
		category: { name: 'Компьютеры', value: 'kompyutery' },
		subCategories: [{ name: 'Ноутбуки', value: 'noutbuki' }, { name: 'MacBook', value: 'macbook' }],
	},
];

const EditProductForm = ({ product, setProduct }) => {
	const [editedInfo, setEditedInfo] = useState('');
	const [subCategoryOptions, setSubCategoryOptions] = useState([]);
	const [form] = Form.useForm();
	const [thumbnailList, setThumbnailList] = useState([]); // Добавление состояния для списка главных изображений
	const [imageList, setImageList] = useState([]); // Добавление состояния для списка дополнительных изображений
	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');
	const [previewTitle, setPreviewTitle] = useState('');
	const [fileList, setFileList] = useState([]);

	useEffect(() => {
		if (product && product.images) {
			const formattedFileList = JSON.parse(product.images).map(imageObj => ({
				uid: imageObj.image, // или какой-то другой уникальный идентификатор
				name: imageObj.image,
				status: 'done',
				url: `/uploads/${imageObj.image}`,
			}));
			setFileList(formattedFileList);
		}
	}, [product]);

	const props = {
		beforeUpload(file) {
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => {
					const img = document.createElement('img');
					img.src = reader.result;
					img.onload = () => {
						const canvas = document.createElement('canvas');
						canvas.width = img.naturalWidth;
						canvas.height = img.naturalHeight;
						const ctx = canvas.getContext('2d');
						ctx.drawImage(img, 0, 0);
						ctx.fillStyle = 'red';
						ctx.textBaseline = 'middle';
						ctx.font = '33px Arial';
						ctx.fillText('Fajne buty', 20, 20);
						canvas.toBlob((result) => resolve(result));
					};
				};
			});
		},
	};

	const onRemove = (image) => {
		if (!image.originFileObj) {
			deleteOneImage(product.id, image.name)
				.then(data => {
					console.log("🚀 🚀 🚀  _ onRemove _ data:", data)
				})
		}
	}


	const handleCancel = () => setPreviewOpen(false);

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
	};


	const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

	useEffect(() => {
		if (product && product.info) {
			const infoArray = JSON.parse(product.info);
			const formattedInfo = infoArray.map(item => `${item.property}: ${item.value}`).join('\n');
			setEditedInfo(formattedInfo);
		}
	}, [product]);

	const handleInfoChange = (e) => {
		setEditedInfo(e.target.value);
	};

	const onFinish = async (values) => {
		console.log("🚀 🚀 🚀  _ onFinish _ values:", values)

		const infoArray = values.info ? values.info.split('\n').map(item => {
			const [property, value] = item.split(':').map(part => part.trim());
			return { property, value };
		}) : [];

		let titleLink = transliterate(values.title).replace(/\s+/g, '-').toLowerCase();

		const formData = new FormData();
		formData.append('title', values.title);
		formData.append('description', values.description);
		formData.append('price', values.price);
		formData.append('discountPercentage', values.discountPercentage || 0);
		formData.append('stock', values.stock);
		formData.append('category', values.category);
		formData.append('subcategory', values.subcategory);
		formData.append('brand', values.brand);
		formData.append('content', values.content);
		formData.append('rating', values.rating);
		formData.append('titleLink', titleLink);
		formData.append('info', JSON.stringify(infoArray));


		formData.append('banner', values.banner);
		formData.append('discounts', values.discounts);
		formData.append('povsednevnaya', values.povsednevnaya);
		formData.append('recommended', values.recommended);


		if (thumbnailList.length > 0) {
			formData.append('thumbnail', thumbnailList[0].originFileObj);
		}

		fileList.forEach(file => {
			if (file.originFileObj) {
				formData.append('images', file.originFileObj);
			} else {
				formData.append('images', file);
			}
		})

		updateOneProduct(product.id, formData)
			.then((data) => {
				message.success(data.message);
				form.resetFields();
				setProduct({})
				setThumbnailList([]);
				setImageList([]);
				setFileList([])
			})
			.catch((error) => {
				console.error('Ошибка при обновлении продукта:', error);
				message.error('Ошибка при обновлении продукта');
			});
	}

	// Функция для обновления списка подкатегорий при выборе категории
	const handleCategoryChange = (category) => {
		const categoryData = dataCategory.find((cat) => cat.category.value === category);
		if (categoryData) {
			setSubCategoryOptions(categoryData.subCategories);
			// Если подкатегория не является обязательным полем, устанавливаем значение undefined
			form.setFieldsValue({ subcategory: undefined });
		}
	};

	const handleInfoPressEnter = (e) => {
		const value = e.target.value.trim();
		if (value) {
			const newInfo = value.split('/').map((item) => item.trim());
			setInfoArray([...infoArray, ...newInfo]);

			e.target.value = '';
		}
	};
	const confirm = () => {
		deleteOneProduct(product.id)
			.then(data => {
				message.success(data);
			})
	};

	return (
		<Form
			form={form}
			name="editProduct"
			onFinish={onFinish}
			labelCol={{ span: 24 }}
			wrapperCol={{ span: 24 }}
			initialValues={{
				title: product.title,
				description: product.description,
				price: product.price,
				discountPercentage: product.discountPercentage,
				stock: product.stock,
				category: product.category,
				subcategory: product.subcategory,
				brand: product.brand,
				rating: product.rating,
				info: JSON.parse(product.info).map(item => `${item.property}: ${item.value}`).join('\n'),
				content: product.content,
				banner: product.banner,
				discounts: product.discounts,
				povsednevnaya: product.povsednevnaya,
				recommended: product.recommended
			}}
		>
			{/*1 Название продукта */}
			<Form.Item
				label="Название"
				name="title"
				rules={[{ required: true, message: 'Введите название продукта' }]}
			>
				<Input />
			</Form.Item>

			{/*2 Описание продукта */}
			<Form.Item
				label="Описание"
				name="description"
				rules={[{ required: true, message: 'Введите описание продукта' }]}
			>
				<TextArea autoSize={{ minRows: 3 }} />
			</Form.Item>

			{/*3 Цена продукта */}
			<Form.Item
				label="Цена"
				name="price"
				rules={[{ required: true, message: 'Введите цену продукта' }]}
			>
				<InputNumber min={0} step={0.01} />
			</Form.Item>

			{/*4 Процент скидки */}
			<Form.Item
				label="Скидка"
				name="discountPercentage"
			>
				<InputNumber min={0} max={100} />
			</Form.Item>

			{/*5 Количество товара в наличии */}
			<Form.Item
				label="Наличие"
				name="stock"
				rules={[{ required: true, message: 'Введите количество товара' }]}
			>
				<InputNumber min={0} />
			</Form.Item>

			{/*6 Категория */}
			<Form.Item label="Категория"
				name="category"
				rules={[{ required: true }]}
			>
				<Radio.Group onChange={(e) => handleCategoryChange(e.target.value)}>
					{dataCategory.map((el) => (
						<Radio.Button key={el.id} value={el.category.value}>
							{el.category.name}
						</Radio.Button>
					))}
				</Radio.Group>
			</Form.Item>

			{/*7 Подкатегория */}
			<Form.Item
				label="Подкатегория"
				name="subcategory"
				rules={[{ required: true }]}
			>
				<Radio.Group>
					{subCategoryOptions.map((subCategory) => (
						<Radio.Button key={subCategory.value} value={subCategory.value}>
							{subCategory.name}
						</Radio.Button>
					))}
				</Radio.Group>
			</Form.Item>


			{/*8 Бренд */}
			<Form.Item
				label="Бренд"
				name="brand"
				rules={[{ required: true }]}
			>
				<Radio.Group>
					{
						brandData.map(el => (
							<Radio.Button key={el} value={el}>{el}</Radio.Button>
						))
					}
				</Radio.Group>
			</Form.Item>

			{/*9 Рейтинг */}
			<Form.Item
				label="Рейтинг"
				name="rating"
			>
				<InputNumber min={0} max={5} step={0.1} />
			</Form.Item>

			{/*10 Главное изображение */}
			<div className=''>
				{
					JSON.parse(product.thumbnail).length ?
						<Image width={200} src={`${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${JSON.parse(product.thumbnail)[0].image}`} />
						:
						<p className='text-red-400'>
							нет главного изображения
						</p>
				}

				<Form.Item
					label="Изменить главное изображение"
					name="thumbnail"
				>
					<Upload
						accept="image/*"
						fileList={thumbnailList}
						beforeUpload={() => false}
						onChange={({ fileList }) => setThumbnailList(fileList)}
					>
						<Button icon={<UploadOutlined />}>Загрузить новое изображение</Button>
					</Upload>
				</Form.Item>
			</div>



			{/*11 Доп. изображения */}
			<div className='mt-10 mb-10'>
				<p className='mb-3'>
					Редактировать дополнительные изображения
				</p>

				<Form.Item
					label=""
					name="images"
				>
					<Dragger
						action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
						fileList={fileList}
						onPreview={handlePreview}
						onChange={handleChange}
						onRemove={onRemove}
						multiple={true}
						listType="picture-card"
						accept="image/*"
						maxCount={8}
						{...props}
					>
						{fileList.length < 8 && (
							<div className=''>
								<PlusOutlined />
								<div className="ant-upload-text">Загрузить еще изображения</div>
							</div>
						)}
					</Dragger>
				</Form.Item>

				<Modal visible={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
					<img
						alt="example"
						style={{
							width: '100%',
						}}
						src={previewImage}
					/>
				</Modal>
			</div>


			{/*12 Информация */}
			<Form.Item
				label="Информация"
				name="info"
			>
				<TextArea
					autoSize={{ minRows: 3 }}
					onPressEnter={handleInfoPressEnter} // Обработчик нажатия клавиши Enter
				/>
			</Form.Item>

			{/*13 Контент */}
			<Form.Item
				label="Контент для товара"
				name="content"
				rules={[{ required: true, message: 'Введите контент продукта' }]}
			>
				<TextArea autoSize={{ minRows: 3 }} />
			</Form.Item>

			{/*14 Баннер */}
			<Form.Item
				label="Баннер на главной странице"
				name="banner"
				valuePropName="checked"
			>
				<Checkbox>Добавить товар на главную</Checkbox>
			</Form.Item>

			{/*15 Акции и скидки */}
			<Form.Item
				label="Акции и скидки на главной"
				name="discounts"
				valuePropName="checked"
			>
				<Checkbox>Добавить товар на главную</Checkbox>
			</Form.Item>

			{/*16 Повседневные товары */}
			<Form.Item
				label="Повседневные товары на главной"
				name="povsednevnaya"
				valuePropName="checked"
			>
				<Checkbox>Добавить товар на главную</Checkbox>
			</Form.Item>

			{/*16 Рекомендуемые */}
			<Form.Item
				label="Рекомендуемые товары"
				name="recommended"
				valuePropName="checked"
			>
				<Checkbox>Добавить товар в рекомендуемые</Checkbox>
			</Form.Item>


			<div className='flex justify-end mb-8'>
				<Popconfirm
					title="Удалить товар"
					description="Вы точно хотите удалить товар?"
					onConfirm={confirm}
					// onCancel={cancel}
					okText="Да"
					cancelText="Нет"
					className=''
				>
					<Button danger size='small'>Удалить товар</Button>
				</Popconfirm>
			</div>
			{/* Кнопка "Сохранить" */}
			<Form.Item >
				<Button type="primary" className='text-black bg-white' htmlType="submit">
					Сохранить изменения
				</Button>
			</Form.Item>


		</Form>
	);
};

export default EditProductForm;
