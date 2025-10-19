"use client"
import React, { useState } from 'react';
import { Button, InputNumber, Form, Input, Radio, message, Upload, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { createProduct } from '@/http/adminAPI';
import { transliterate } from '@/transliterate/transliterate';
const { TextArea } = Input;

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

const CreateProductForm = () => {
  const [form] = Form.useForm();
  const [thumbnailList, setThumbnailList] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [infoArray, setInfoArray] = useState([]);

  const onFinish = async (values) => {
    console.log('Success:', values);

    let titleLink = transliterate(values.title).replace(/\s+/g, '-').toLowerCase()

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

    formData.append('banner', values.banner);
    formData.append('discounts', values.discounts);
    formData.append('povsednevnaya', values.povsednevnaya);
    formData.append('recommended', values.recommended);
   

    // const infoArray = values.info ? values.info.split('/').map(item => item.trim()).filter(Boolean) : [];
    // formData.append('info', JSON.stringify(infoArray));

    const infoArray = values.info ? values.info.split('\n').map(item => {
      const [property, ...valueParts] = item.trim().split(':');
      const value = valueParts.join(':').trim(); // Объединяем оставшуюся часть как значение
      return { property, value };
    }).filter(Boolean) : [];
    formData.append('info', JSON.stringify(infoArray));


    // Добавление главного изображения в FormData
    if (thumbnailList.length > 0) {
      formData.append('thumbnail', thumbnailList[0].originFileObj);
    }

    // Добавление дополнительных изображений в FormData
    imageList.forEach((file) => {
      formData.append('images', file.originFileObj);
    });

    createProduct(formData)
      .then((data) => {
        console.log('Product created:', data);
        message.success('Продукт успешно создан');
        form.resetFields();
        setThumbnailList([]);
        setImageList([]);
      })
      .catch((error) => {
        console.error('Error creating product:', error);
        message.error('Ошибка при создании продукта');
      });
  };

  // Функция для обновления списка подкатегорий при выборе категории
  const handleCategoryChange = (category) => {
    const categoryData = dataCategory.find((cat) => cat.category.value === category);
    if (categoryData) {
      setSubCategoryOptions(categoryData.subCategories);
      // Если подкатегория не является обязательным полем, устанавливаем значение undefined
      form.setFieldsValue({ subcategory: undefined });
    }
  };


  // Функция для обработки нажатия клавиши Enter в поле ввода информации
  const handleInfoPressEnter = (e) => {
    const value = e.target.value.trim();
    if (value) {
      // Разделяем введенный текст по разделителю "/" и добавляем в массив infoArray
      const newInfo = value.split('/').map((item) => item.trim());
      setInfoArray([...infoArray, ...newInfo]);
      // Очищаем поле ввода
      e.target.value = '';
    }
  };

  return (
    <>
      <Form
        form={form}
        name="createProduct"
        onFinish={onFinish}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 16 }}
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
        <Form.Item label="Скидка" name="discountPercentage">
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
        <Form.Item label="Категория" name="category" rules={[{ required: true }]}>
          <Radio.Group onChange={(e) => handleCategoryChange(e.target.value)}>
            {dataCategory.map((el) => (
              <Radio.Button key={el.id} value={el.category.value}>
                {el.category.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>

        {/*7 Подкатегория */}
        <Form.Item label="Подкатегория" name="subcategory" rules={[{ required: true }]}>
          <Radio.Group>
            {subCategoryOptions.map((subCategory) => (
              <Radio.Button key={subCategory.value} value={subCategory.value}>
                {subCategory.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>


        {/*8 Бренд */}
        <Form.Item label="Бренд" name="brand" rules={[{ required: true }]}>
          <Radio.Group>
            {
              brandData.map(el => (
                <Radio.Button key={el} value={el}>{el}</Radio.Button>
              ))
            }
          </Radio.Group>
        </Form.Item>

        {/*9 Рейтинг */}
        <Form.Item label="Рейтинг" name="rating">
          <InputNumber min={0} max={5} step={0.1} />
        </Form.Item>

        {/*10 Главное изображение */}
        <Form.Item label="Главное изображение" name="thumbnail" rules={[{ required: true }]}>
          <Upload
            accept="image/*"
            fileList={thumbnailList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setThumbnailList(fileList.slice(-1))}
          >
            <Button icon={<UploadOutlined />}>Загрузить изображение</Button>
          </Upload>
        </Form.Item>

        {/*11 Изображения */}
        <Form.Item label="Дополнительные изображения" name="images" rules={[{ required: true }]}>
          <Upload
            accept="image/*"
            multiple
            fileList={imageList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setImageList(fileList)}
          >
            <Button icon={<UploadOutlined />}>Загрузить изображения</Button>
          </Upload>
        </Form.Item>

        {/*12 Контент */}
        <Form.Item
          label="Контент для товара"
          name="content"
          rules={[{ required: true, message: 'Введите контент продукта' }]}
        >
          <TextArea autoSize={{ minRows: 3 }} />
        </Form.Item>

        {/*13 Информация */}
        <Form.Item
          label="Информация"
          name="info"
        >
          <TextArea
            autoSize={{ minRows: 3 }}
            onPressEnter={handleInfoPressEnter} // Обработчик нажатия клавиши Enter
          />
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

        {/* Кнопка "Сохранить" */}
        <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
          <Button type="primary" className='text-black bg-white' htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateProductForm;
