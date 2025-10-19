"use client";
import { Button, InputNumber, Form, message, Divider } from 'antd';
import { useState } from 'react';
import EditProductForm from './EditProductForm';
import { getOneProduct } from '@/http/adminAPI';

const GetProductForm = () => {
	const [form] = Form.useForm();
	const [product, setProduct] = useState({})

	const onFinish = async (values) => {
		getOneProduct(values.id)
			.then(data => {
				if (typeof data !== 'string' && Object.keys(data).length > 0) {
					setProduct(data);
					message.success(`Товар с id: ${data.id} получен!`);
					form.resetFields();
				} else {
					message.warning(`Нет товара с id: ${values.id}!`);
				}
			})
			.catch(error => {
				console.error('Ошибка при получении товара:', error);
				message.error('Произошла ошибка при получении товара');
			});
	};

	return (
		<>
			<Form
				form={form}
				name="getProduct"
				onFinish={onFinish}
				labelCol={{ span: 24 }}
				wrapperCol={{ span: 16 }}
			>
				<Form.Item
					label="Введите номер товара"
					name="id"
					rules={[{ required: true, message: 'Введите артикль продукта' }]}
				>
					<InputNumber />
				</Form.Item>

				<Form.Item wrapperCol={{ offset: 5, span: 16 }}>
					<Button type="primary" className='text-black bg-white' htmlType="submit">
						Получить
					</Button>
				</Form.Item>
			</Form>
			<Divider />

			{
				Object.keys(product).length && typeof product !== 'string'
					?
					<EditProductForm product={product} setProduct={setProduct} />
					:
					null
			}
		</>
	)
}

export default GetProductForm