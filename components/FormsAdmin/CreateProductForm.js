// /components/FormsAdmin/CreateProductForm.jsx
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Button, InputNumber, Form, Input, message, Checkbox, Select } from "antd";
import { createProduct } from "@/http/adminAPI";
import { transliterate } from "@/transliterate/transliterate";
import SortableUpload from "@/components/admin/SortableUpload.client";
import CKeditor from "@/components/Editor/CKeditor";

const { TextArea } = Input;

/** Загрузка галереи (как было) */
async function uploadGalleryIfNeeded(gallery) {
  const newFiles = gallery.filter((g) => g.file instanceof File);
  if (newFiles.length === 0) {
    return gallery.map((g) => g.url).filter(Boolean);
  }

  const form = new FormData();
  form.append("subdir", "products");
  newFiles.forEach((it) => form.append("originals", it.file));
  newFiles.forEach((it) => form.append("thumbs", it.file));

  const resp = await fetch("/api/uploads/multi", { method: "POST", body: form });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok || !data?.ok) throw new Error(data?.message || "Не удалось загрузить изображения");

  const uploaded = Array.isArray(data.files) ? data.files : [];
  const result = [];
  let take = 0;
  for (const it of gallery) {
    if (it.file instanceof File) {
      const u = uploaded[take++];
      result.push(u?.originalUrl || u?.thumbUrl || "");
    } else {
      result.push(it.url || "");
    }
  }
  return result.filter(Boolean);
}

/** Надёжный slugify для titleLink */
function slugifyTitle(raw) {
  if (!raw) return "";
  let s = transliterate(String(raw)).toLowerCase();                 // в латиницу
  s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");          // без диакритики
  s = s.replace(/&/g, " and ");                                     // & → and
  s = s.replace(/[^a-z0-9]+/g, "-");                                // всё лишнее → -
  s = s.replace(/-+/g, "-").replace(/^-|-$/g, "");                  // схлопнуть дефисы
  if (s.length > 120) s = s.slice(0, 120).replace(/-+$/g, "");
  return s;
}

const CreateProductForm = () => {
  const [form] = Form.useForm();
  const [cats, setCats] = useState([]);
  const [subs, setSubs] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [gallery, setGallery] = useState([]); // [{ uid, url? , file?, preview? }]

  const loadCats = async () => {
    const r = await fetch("/api/admin/categories", { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setCats(j.items || []);
  };
  const loadSubs = async (catId) => {
    if (!catId) { setSubs([]); return; }
    const r = await fetch(`/api/admin/subcategories?categoryId=${catId}`, { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setSubs(j.items || []);
  };
  const loadBrands = async () => {
    const r = await fetch("/api/admin/brands", { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setBrands(j.items || []);
  };

  useEffect(() => { loadCats(); loadBrands(); }, []);
  useEffect(() => { loadSubs(categoryId); }, [categoryId]);

  const catOptions = useMemo(() => cats.map((c) => ({ label: c.name, value: c.id })), [cats]);
  const subOptions = useMemo(() => subs.map((s) => ({ label: s.name, value: s.id })), [subs]);
  const brandOptions = useMemo(() => brands.map((b) => ({ label: b.name, value: b.id })), [brands]);

  const onFinish = async (values) => {
    try {
      setSaving(true);

      const urls = await uploadGalleryIfNeeded(gallery);
      if (urls.length === 0) {
        message.error("Загрузите хотя бы одно изображение.");
        setSaving(false);
        return;
      }

      const cat = cats.find((c) => c.id === values.categoryId);
      const sub = subs.find((s) => s.id === values.subCategoryId);
      const brand = brands.find((b) => b.id === values.brandId);

      // ✅ генерация слага без кавычек/пробелов/и т.п.
      const titleLink = slugifyTitle(values.title);

      const imagesArr = urls.map((url, idx) => ({ url, sort: idx }));
      const thumbnailUrl = imagesArr[0]?.url || "";

      const infoArray = values.info
        ? values.info.split("\n").map((item) => {
            const [property, ...valueParts] = item.trim().split(":");
            const value = valueParts.join(":").trim();
            if (!property) return null;
            return { property, value };
          }).filter(Boolean)
        : [];

      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("description", values.description);
      fd.append("price", values.price);
      fd.append("discountPercentage", values.discountPercentage || 0);
      fd.append("stock", values.stock);

      // NEW: артикль
      fd.append("article", values.article || "");

      // дубли строками (для обратной совместимости и простых фильтров)
      fd.append("category", cat?.name || "");
      fd.append("subcategory", sub?.name || "");
      fd.append("brand", brand?.name || "");

      // связи id
      fd.append("categoryId", values.categoryId ?? "");
      fd.append("subCategoryId", values.subCategoryId ?? "");
      fd.append("brandId", values.brandId ?? "");

      // контент/SEO
      fd.append("content", values.content);
      fd.append("rating", values.rating || 0);
      fd.append("titleLink", titleLink);

      // ФЛАГИ
      fd.append("banner", values.banner || false);
      fd.append("discounts", values.discounts || false);
      // UI: popular → БД: povsednevnaya
      fd.append("povsednevnaya", values.popular || false);
      fd.append("recommended", values.recommended || false);

      // медиа/инфо
      fd.append("info", JSON.stringify(infoArray));
      fd.append("thumbnailUrl", thumbnailUrl);
      fd.append("imagesJson", JSON.stringify(imagesArr));

      const data = await createProduct(fd);
      if (data) {
        message.success("Продукт успешно создан");
        form.resetFields();
        setCategoryId(null);
        setSubs([]);
        setGallery([]);
      }
    } catch (e) {
      console.error(e);
      message.error("Ошибка при создании продукта");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form
      form={form}
      name="createProduct"
      onFinish={onFinish}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item label="Название" name="title" rules={[{ required: true, message: "Введите название продукта" }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Описание" name="description" rules={[{ required: true, message: "Введите описание продукта" }]}>
        <TextArea autoSize={{ minRows: 3 }} />
      </Form.Item>

      <Form.Item label="Цена" name="price" rules={[{ required: true, message: "Введите цену продукта" }]}>
        <InputNumber min={0} step={0.01} />
      </Form.Item>

      <Form.Item label="Скидка" name="discountPercentage">
        <InputNumber min={0} max={100} />
      </Form.Item>

      <Form.Item label="Наличие" name="stock" rules={[{ required: true, message: "Введите количество товара" }]}>
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item label="Артикль (SKU)" name="article">
        <Input placeholder="Например: AKN-00123" />
      </Form.Item>

      <Form.Item label="Категория" name="categoryId" rules={[{ required: true, message: "Выберите категорию" }]}>
        <Select
          options={catOptions}
          placeholder="Выберите категорию"
          onChange={(val) => {
            setCategoryId(val);
            form.setFieldsValue({ subCategoryId: undefined });
          }}
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item label="Подкатегория" name="subCategoryId" rules={[{ required: true, message: "Выберите подкатегорию" }]}>
        <Select
          options={subOptions}
          placeholder="Выберите подкатегорию"
          showSearch
          optionFilterProp="label"
          disabled={!categoryId}
        />
      </Form.Item>

      <Form.Item label="Бренд" name="brandId">
        <Select
          options={brandOptions}
          placeholder="Выберите бренд (аниме)"
          allowClear
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item label="Рейтинг" name="rating">
        <InputNumber min={0} max={5} step={0.1} />
      </Form.Item>

      {/* ГАЛЕРЕЯ */}
      <div className="py-12 sd:px-28 xz:px-1.5">
        <p className="font-medium mb-2">Галерея (перетаскивание, первое — главное)</p>
        <SortableUpload value={gallery} onChange={setGallery} label="Загрузить изображения" />
      </div>

      <Form.Item
        label="Контент для товара"
        name="content"
        rules={[{ required: true, message: "Введите контент продукта" }]}
        valuePropName="value"
        getValueFromEvent={(val) => val}
      >
        <CKeditor placeholder="Введите SEO-текст карточки товара…" />
      </Form.Item>

      <Form.Item label="Информация" name="info">
        <TextArea autoSize={{ minRows: 3 }} placeholder={"Характеристика: значение\nМатериал: ПВХ\nВысота: 18 см"} />
      </Form.Item>

      <Form.Item label="Баннер на главной" name="banner" valuePropName="checked">
        <Checkbox>Добавить товар на главную</Checkbox>
      </Form.Item>

      <Form.Item label="Акции и скидки" name="discounts" valuePropName="checked">
        <Checkbox>Добавить товар на главную</Checkbox>
      </Form.Item>

      {/* ⬇️ БЫЛО «Повседневные», стало «Популярные» */}
      <Form.Item label="Популярные" name="popular" valuePropName="checked">
        <Checkbox>Показывать в популярном</Checkbox>
      </Form.Item>

      <Form.Item label="Рекомендуемые" name="recommended" valuePropName="checked">
        <Checkbox>Добавить товар в рекомендуемые</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
        <Button type="primary" className="text-black bg-white" htmlType="submit" loading={saving}>
          {saving ? "Сохранение…" : "Сохранить"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateProductForm;
