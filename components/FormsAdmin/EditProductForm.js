// /components/FormsAdmin/EditProductForm.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, InputNumber, Form, Input, Popconfirm, Checkbox, Select } from "antd";
import { transliterate } from "@/transliterate/transliterate";
import { deleteOneImage, deleteOneProduct, updateOneProduct } from "@/http/adminAPI";
import CKeditor from "@/components/Editor/CKeditor";
import SortableUpload from "@/components/admin/SortableUpload.client";
import { toastSuccess, toastError, toastWarning } from "@/lib/toast";

const { TextArea } = Input;

/* ==== helpers ==== */
function parseMaybeJson(v, def = []) {
  if (!v) return def;
  if (Array.isArray(v)) return v;
  try { return JSON.parse(v); } catch { return def; }
}
const toInfoText = (raw) => {
  const arr = parseMaybeJson(raw, []);
  if (Array.isArray(arr)) {
    return arr
      .map((i) => {
        const prop = (i?.property ?? "").toString().trim();
        const val = (i?.value ?? "").toString().trim();
        return prop ? `${prop}: ${val}` : null;
      })
      .filter(Boolean)
      .join("\n");
  }
  return "";
};

// нормализуем для БД: оставляем относительный путь с /uploads/products/.. (или /uploads/..)
function normalizePath(u) {
  if (!u) return "";
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (base && u.startsWith(base)) return u.slice(base.length);
  if (!u.startsWith("/uploads/")) return `/uploads/products/${u.replace(/^\/+/, "")}`;
  return u;
}

// превью для UI (добавляем BASE при необходимости)
function toDisplayUrl(raw) {
  if (!raw) return "";
  const base = process.env.NEXT_PUBLIC_BASE_URL || "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${base}${raw}`;
}

/** Собираем ВСЕ возможные варианты хранения картинок в один список */
function extractAllImagePaths(product) {
  const out = [];
  const t = product?.thumbnail;
  const tParsed = parseMaybeJson(t, null);
  if (Array.isArray(tParsed) && tParsed[0]?.image) {
    const p = tParsed[0].image;
    if (p && !out.includes(p)) out.push(p);
  } else if (typeof t === "string" && (t.startsWith("/uploads/") || t.startsWith("http"))) {
    out.push(t);
  }
  const imgs = parseMaybeJson(product?.images, []);
  for (const it of imgs) {
    const p = typeof it === "string" ? it : (it?.image || it?.url || "");
    if (p && !out.includes(p)) out.push(p);
  }
  return out;
}

/** Загрузка новых файлов (если есть) и сбор URL-ов */
async function buildUrlsFromGallery(gallery) {
  const newFiles = gallery.filter((g) => g.file instanceof File);
  let uploaded = [];

  if (newFiles.length > 0) {
    const form = new FormData();
    form.append("subdir", "products");
    newFiles.forEach((it) => form.append("originals", it.file));
    newFiles.forEach((it) => form.append("thumbs", it.file));

    const resp = await fetch("/api/uploads/multi", { method: "POST", body: form });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok || !data?.ok) {
      throw new Error(data?.message || "Не удалось загрузить изображения");
    }
    uploaded = Array.isArray(data.files) ? data.files : [];
  }

  let take = 0;
  const urls = gallery
    .map((it) => {
      if (it.file instanceof File) {
        const u = uploaded[take++];
        const url = u?.originalUrl || u?.thumbUrl || "";
        return normalizePath(url);
      }
      const existing = it.raw || it.url || "";
      return normalizePath(existing);
    })
    .filter(Boolean);

  return urls;
}

/** Надёжный slugify */
function slugifyTitle(raw) {
  if (!raw) return "";
  let s = transliterate(String(raw)).toLowerCase();
  s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/&/g, " and ");
  s = s.replace(/[^a-z0-9]+/g, "-");
  s = s.replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (s.length > 120) s = s.slice(0, 120).replace(/-+$/g, "");
  return s;
}

const EditProductForm = ({ product, setProduct }) => {
  const [form] = Form.useForm();

  // справочники
  const [cats, setCats] = useState([]);
  const [subs, setSubs] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  // контент
  const [contentHtml, setContentHtml] = useState(product?.content || "");

  // ГАЛЕРЕЯ
  const [gallery, setGallery] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadCats = async () => {
    const r = await fetch("/api/admin/categories", { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setCats(j.items || []);
  };
  const loadSubs = async (catId) => {
    if (!catId) {
      setSubs([]);
      return [];
    }
    const r = await fetch(`/api/admin/subcategories?categoryId=${catId}`, { cache: "no-store" });
    const j = await r.json();
    const items = j?.ok ? (j.items || []) : [];
    setSubs(items);
    return items;
  };
  const loadBrands = async () => {
    const r = await fetch("/api/admin/brands", { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setBrands(j.items || []);
  };

  useEffect(() => { loadCats(); loadBrands(); }, []);

  // Инициализация галереи и контента
  useEffect(() => {
    const ordered = extractAllImagePaths(product);
    const initialGallery = ordered.map((raw, i) => ({
      uid: `${i}-${raw}`,
      url: toDisplayUrl(raw),
      raw,
    }));
    setGallery(initialGallery);
    setContentHtml(product?.content || "");
  }, [product]);

  // INFO отдельно
  useEffect(() => {
    form.setFieldsValue({ info: toInfoText(product?.info) });
  }, [product, form]);

  // Отложенная инициализация справочников
  useEffect(() => {
    (async () => {
      if (!product || !cats.length || !brands.length) return;

      const catObj = cats.find((c) => c.name === product?.category);
      let subId = undefined;

      if (catObj?.id) {
        setCategoryId(catObj.id);
        const subsList = await loadSubs(catObj.id);
        const subObj = subsList.find((s) => s.name === product?.subcategory);
        subId = subObj?.id;
      }

      const brandObj = brands.find((b) => b.name === product?.brand);

      form.setFieldsValue({
        categoryId: catObj?.id,
        subCategoryId: subId,
        brandId: brandObj?.id,
      });
    })();
  }, [product, cats, brands, form]);

  const catOptions = useMemo(() => cats.map((c) => ({ label: c.name, value: c.id })), [cats]);
  const subOptions = useMemo(() => subs.map((s) => ({ label: s.name, value: s.id })), [subs]);
  const brandOptions = useMemo(() => brands.map((b) => ({ label: b.name, value: b.id })), [brands]);

  // Удаление существующей картинки на бэке
  const handleRemoveExisting = async (rawPath) => {
    try { await deleteOneImage(product.id, rawPath); } catch {}
  };

  const onFinish = async (values) => {
    try {
      setSaving(true);

      const urls = await buildUrlsFromGallery(gallery);
      if (urls.length === 0) {
        toastWarning("Добавьте хотя бы одно изображение товара", "Недостаточно данных");
        setSaving(false);
        return;
      }

      const imagesArr = urls.map((url, idx) => ({ url, sort: idx }));
      const thumbnailUrl = imagesArr[0]?.url || "";

      const cat = cats.find((c) => c.id === values.categoryId);
      const sub = subs.find((s) => s.id === values.subCategoryId);
      const brand = brands.find((b) => b.id === values.brandId);

      const infoArray = values.info
        ? values.info.split("\n").map((item) => {
            const [property, ...valueParts] = item.trim().split(":");
            const value = valueParts.join(":").trim();
            if (!property) return null;
            return { property, value };
          }).filter(Boolean)
        : [];

      const titleLink = slugifyTitle(values.title);

      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("description", values.description);
      fd.append("price", values.price);
      fd.append("discountPercentage", values.discountPercentage || 0);
      fd.append("stock", values.stock);
      fd.append("rating", values.rating || 0);
      fd.append("titleLink", titleLink);

      fd.append("article", values.article || "");

      fd.append("category", cat?.name || "");
      fd.append("subcategory", sub?.name || "");
      fd.append("brand", brand?.name || "");

      fd.append("categoryId", values.categoryId ?? "");
      fd.append("subCategoryId", values.subCategoryId ?? "");
      fd.append("brandId", values.brandId ?? "");

      fd.append("content", contentHtml || "");
      fd.append("banner", values.banner || false);
      fd.append("discounts", values.discounts || false);
      // UI: popular → БД: povsednevnaya
      fd.append("povsednevnaya", values.popular || false);
      fd.append("recommended", values.recommended || false);

      fd.append("thumbnailUrl", thumbnailUrl);
      fd.append("imagesJson", JSON.stringify(imagesArr));
      fd.append("info", JSON.stringify(infoArray));

      const res = await updateOneProduct(product.id, fd);
      if (res?.ok) {
        toastSuccess(res?.message || "Продукт обновлён");
        form.resetFields();
        setProduct(null);
        setGallery([]);
      } else {
        toastError(res?.message || "Не удалось обновить продукт");
      }
    } catch (e) {
      console.error(e);
      toastError("Ошибка при обновлении продукта");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const data = await deleteOneProduct(product.id);
      const msg = typeof data === "string" ? data : (data?.message || "Продукт удалён");
      toastSuccess(msg);
      form.resetFields();
      setProduct(null);
      setGallery([]);
    } catch (e) {
      console.error(e);
      toastError("Ошибка при удалении товара");
    }
  };

  return (
    <Form
      form={form}
      name="editProduct"
      onFinish={onFinish}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      initialValues={{
        title: product?.title,
        description: product?.description,
        price: product?.price,
        discountPercentage: product?.discountPercentage,
        stock: product?.stock,
        article: product?.article,
        rating: product?.rating,
        banner: product?.banner,
        discounts: product?.discounts,
        // ⬇️ UI-значение «Популярные» берём из product.povsednevnaya
        popular: product?.povsednevnaya,
        recommended: product?.recommended,
      }}
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
          options={cats.map((c) => ({ label: c.name, value: c.id }))}
          placeholder="Выберите категорию"
          onChange={async (val) => {
            setCategoryId(val);
            form.setFieldsValue({ subCategoryId: undefined });
            await loadSubs(val);
          }}
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item label="Подкатегория" name="subCategoryId" rules={[{ required: true, message: "Выберите подкатегорию" }]}>
        <Select
          options={subs.map((s) => ({ label: s.name, value: s.id }))}
          placeholder="Выберите подкатегорию"
          showSearch
          optionFilterProp="label"
          disabled={!categoryId}
        />
      </Form.Item>

      <Form.Item label="Бренд" name="brandId">
        <Select
          options={brands.map((b) => ({ label: b.name, value: b.id }))}
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
      <div className="py-6">
        <p className="font-medium mb-2">Галерея (перетаскивание, первое — главное)</p>
        <SortableUpload
          value={gallery}
          onChange={setGallery}
          label="Добавить изображения"
          onRemoveExisting={handleRemoveExisting}
        />
      </div>

      <div className="mb-2 font-semibold">Контент для товара (SEO/описание)</div>
      <CKeditor value={contentHtml} onChange={setContentHtml} />

      <Form.Item label="Информация" name="info">
        <TextArea
          autoSize={{ minRows: 3 }}
          placeholder={"Характеристика: значение\nМатериал: ПВХ\nВысота: 18 см"}
        />
      </Form.Item>

      <Form.Item label="Баннер на главной" name="banner" valuePropName="checked">
        <Checkbox>Добавить товар на главную</Checkbox>
      </Form.Item>

      <Form.Item label="Акции и скидки" name="discounts" valuePropName="checked">
        <Checkbox>Добавить товар на главную</Checkbox>
      </Form.Item>

      {/* ⬇️ Было «Повседневные», стало «Популярные» */}
      <Form.Item label="Популярные" name="popular" valuePropName="checked">
        <Checkbox>Показывать в популярном</Checkbox>
      </Form.Item>

      <Form.Item label="Рекомендуемые" name="recommended" valuePropName="checked">
        <Checkbox>Добавить товар в рекомендуемые</Checkbox>
      </Form.Item>

      <div className="flex justify-end mb-8">
        <Popconfirm
          title="Удалить товар"
          description="Вы точно хотите удалить товар?"
          onConfirm={async () => {
            try {
              const data = await deleteOneProduct(product.id);
              const msg = typeof data === "string" ? data : (data?.message || "Продукт удалён");
              toastSuccess(msg);
              form.resetFields();
              setProduct(null);
              setGallery([]);
            } catch (e) {
              console.error(e);
              toastError("Ошибка при удалении товара");
            }
          }}
          okText="Да"
          cancelText="Нет"
        >
          <Button danger size="small" htmlType="button">Удалить товар</Button>
        </Popconfirm>
      </div>

      <Form.Item>
        <Button type="primary" className="text-black bg-white" htmlType="submit" loading={saving}>
          {saving ? "Сохранение…" : "Сохранить изменения"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditProductForm;
