"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  InputNumber,
  Form,
  Input,
  message,
  Checkbox,
  Select,
  Table,
  Tag,
  Space,
  Typography,
} from "antd";
import { createProduct } from "@/http/adminAPI";
import { transliterate } from "@/transliterate/transliterate";
import SortableUpload from "@/components/admin/SortableUpload.client";
import CKeditor from "@/components/Editor/CKeditor";

const { TextArea } = Input;
const { Title } = Typography;

/* ===================== УТИЛИТЫ ===================== */

/** Надёжный slugify для titleLink */
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

/** Безопасный парс JSON */
function parseJsonSafe(str, def = []) {
  if (!str) return def;
  try {
    if (typeof str === "string") return JSON.parse(str);
    return str;
  } catch {
    return def;
  }
}

/** Приведение исходного товара из БД к состоянию для SortableUpload */
function productToGallery(product) {
  // thumbnail: строка JSON массива [{image}] — совместимость
  const thumbArr = parseJsonSafe(product?.thumbnail, []);
  const thumbUrl =
    Array.isArray(thumbArr) && thumbArr[0]
      ? thumbArr[0].image || thumbArr[0].url || ""
      : typeof product?.thumbnail === "string"
      ? product.thumbnail
      : "";

  const imgs = Array.isArray(product?.images)
    ? product.images
    : parseJsonSafe(product?.images, []);

  const list = [];
  if (thumbUrl) {
    list.push({
      uid: `thumb-0`,
      url: thumbUrl,
      preview: thumbUrl,
    });
  }
  let i = 1;
  for (const it of imgs) {
    const u = typeof it === "string" ? it : it?.image || it?.url || "";
    if (!u) continue;
    // не дублируем с первым
    if (u === thumbUrl) continue;
    list.push({
      uid: `img-${i++}`,
      url: u,
      preview: u,
    });
  }
  return list;
}

/** Загрузка галереи: если есть новые File — загрузим, иначе отдадим URLы как есть */
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

/** Сконвертировать info JSON -> textarea строки "Ключ: Значение" */
function infoJsonToTextarea(info) {
  const arr = Array.isArray(info) ? info : parseJsonSafe(info, []);
  if (!Array.isArray(arr) || arr.length === 0) return "";
  return arr
    .map((row) => {
      const prop = (row?.property ?? "").toString().trim();
      const val = (row?.value ?? "").toString().trim();
      if (!prop) return null;
      return `${prop}: ${val}`;
    })
    .filter(Boolean)
    .join("\n");
}

/** Собрать info из textarea */
function textareaToInfoArray(v) {
  return (v || "")
    .split("\n")
    .map((line) => {
      const [property, ...valueParts] = line.trim().split(":");
      const value = valueParts.join(":").trim();
      if (!property) return null;
      return { property, value };
    })
    .filter(Boolean);
}

/* ===================== КОМПОНЕНТ ===================== */

export default function DuplicateProductForm() {
  const [form] = Form.useForm();

  const [cats, setCats] = useState([]);
  const [subs, setSubs] = useState([]);
  const [brands, setBrands] = useState([]);

  const [categoryId, setCategoryId] = useState(null);
  const [subCategoryId, setSubCategoryId] = useState(null);
  const [brandId, setBrandId] = useState(null);

  const [loadingList, setLoadingList] = useState(false);
  const [saving, setSaving] = useState(false);

  const [products, setProducts] = useState([]);
  const [picked, setPicked] = useState(null); // выбранный товар-образец
  const [gallery, setGallery] = useState([]); // состояние SortableUpload

  /* ---- Справочники ---- */
  const loadCats = async () => {
    const r = await fetch("/api/admin/categories", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (j?.ok) setCats(j.items || []);
  };
  const loadSubs = async (catId) => {
    if (!catId) {
      setSubs([]);
      return;
    }
    const r = await fetch(`/api/admin/subcategories?categoryId=${catId}`, { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (j?.ok) setSubs(j.items || []);
  };
  const loadBrands = async () => {
    const r = await fetch("/api/admin/brands", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    if (j?.ok) setBrands(j.items || []);
  };

  useEffect(() => {
    loadCats();
    loadBrands();
  }, []);
  useEffect(() => {
    loadSubs(categoryId);
    // при смене категории сбрасываем выбранный сабкат и список
    setSubCategoryId(null);
  }, [categoryId]);

  const catOptions = useMemo(() => cats.map((c) => ({ label: c.name, value: c.id })), [cats]);
  const subOptions = useMemo(() => subs.map((s) => ({ label: s.name, value: s.id })), [subs]);
  const brandOptions = useMemo(() => brands.map((b) => ({ label: b.name, value: b.id })), [brands]);

  /* ---- Загрузка списка товаров по выбранным фильтрам ---- */
  const onShowProducts = async () => {
    if (!categoryId || !subCategoryId) {
      message.error("Выберите категорию и подкатегорию");
      return;
    }
    setLoadingList(true);
    setPicked(null);
    setProducts([]);
    setGallery([]);
    try {
      const params = new URLSearchParams();
      params.set("categoryId", String(categoryId));
      params.set("subCategoryId", String(subCategoryId));
      if (brandId) params.set("brandId", String(brandId));
      const r = await fetch(`/api/admin/products/by-cat?${params.toString()}`, { cache: "no-store" });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j?.ok) {
        message.error(j?.message || "Не удалось получить товары");
        return;
      }
      setProducts(j.items || []);
    } catch (e) {
      console.error(e);
      message.error("Ошибка при загрузке списка товаров");
    } finally {
      setLoadingList(false);
    }
  };

  /* ---- Выбор товара-образца -> проставляем форму и галерею ---- */
  const onPickProduct = async (p) => {
    setPicked(p);
    const gal = productToGallery(p);
    setGallery(gal);

    // Найдём объекты-справочники по id
    const cat = cats.find((c) => c.id === (p.categoryId ?? null));
    const sub = subs.find((s) => s.id === (p.subCategoryId ?? null));
    const br = brands.find((b) => b.id === (p.brandId ?? null));

    form.setFieldsValue({
      title: p.title || "",
      description: p.description || "",
      price: p.price || 0,
      discountPercentage: p.discountPercentage || 0,
      stock: p.stock || 0,
      article: p.article || "",
      categoryId: cat?.id || categoryId || null,
      subCategoryId: sub?.id || subCategoryId || null,
      brandId: br?.id || null,
      rating: p.rating ?? 0,
      content: p.content || "",
      info: infoJsonToTextarea(p.info),
      // чекбоксы
      banner: !!p.banner,
      discounts: !!p.discounts,
      popular: !!p.povsednevnaya, // UI popular ↔ БД povsednevnaya
      recommended: !!p.recommended,
    });
  };

  /* ---- Сохранить как новый товар (по образцу) ---- */
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

      const titleLink = slugifyTitle(values.title);

      const imagesArr = urls.map((url, idx) => ({ url, sort: idx }));
      const thumbnailUrl = imagesArr[0]?.url || "";

      const infoArray = textareaToInfoArray(values.info);

      const fd = new FormData();
      fd.append("title", values.title);
      fd.append("description", values.description);
      fd.append("price", values.price);
      fd.append("discountPercentage", values.discountPercentage || 0);
      fd.append("stock", values.stock);
      fd.append("article", values.article || "");

      // Дубли строками (для обратной совместимости и фильтров)
      fd.append("category", cat?.name || "");
      fd.append("subcategory", sub?.name || "");
      fd.append("brand", brand?.name || "");

      // Связи id
      fd.append("categoryId", values.categoryId ?? "");
      fd.append("subCategoryId", values.subCategoryId ?? "");
      fd.append("brandId", values.brandId ?? "");

      // SEO/контент
      fd.append("content", values.content || "");
      fd.append("rating", values.rating || 0);
      fd.append("titleLink", titleLink);

      // Флаги
      fd.append("banner", values.banner || false);
      fd.append("discounts", values.discounts || false);
      fd.append("povsednevnaya", values.popular || false);
      fd.append("recommended", values.recommended || false);

      // Медиа/инфо (вариант с URLами — без файлов)
      fd.append("info", JSON.stringify(infoArray));
      fd.append("thumbnailUrl", thumbnailUrl);
      fd.append("imagesJson", JSON.stringify(imagesArr));

      const data = await createProduct(fd);
      if (data) {
        message.success("Новый товар создан на основе выбранного");
        // сбрасывать полностью не будем — удобно клепать серию цветов
        // только очистим название и артикул, чтобы админ быстро менял цвет
        form.setFieldsValue({
          title: "",
          article: "",
        });
      }
    } catch (e) {
      console.error(e);
      message.error("Ошибка при создании товара");
    } finally {
      setSaving(false);
    }
  };

  /* ---- Колонки таблицы ---- */
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Название",
      dataIndex: "title",
      key: "title",
      render: (t, r) => (
        <div>
          <div className="font-medium">{t}</div>
          <div className="text-xs text-gray-500">{r.brand} • {r.category} / {r.subcategory}</div>
        </div>
      ),
    },
    {
      title: "Артикул",
      dataIndex: "article",
      key: "article",
      width: 140,
      render: (t) => (t ? <Tag>{t}</Tag> : <span className="text-gray-400">—</span>),
    },
    {
      title: "Цена",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (v, r) => (
        <div>
          <div>{v} BYN</div>
          {r.discountPercentage ? (
            <div className="text-xs text-rose-600">−{r.discountPercentage}%</div>
          ) : null}
        </div>
      ),
    },
    {
      title: "Остаток",
      dataIndex: "stock",
      key: "stock",
      width: 100,
    },
    {
      title: "Действия",
      key: "actions",
      width: 140,
      render: (_t, r) => (
        <Space>
          <Button size="small" onClick={() => onPickProduct(r)}>Выбрать</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="px-1">
      <Title level={4} className="mb-3">Быстрое копирование товара (варианты цвета)</Title>

      {/* ФИЛЬТР ПО КАТЕГОРИЯМ/БРЕНДУ */}
      <div className="grid sd:grid-cols-3 xz:grid-cols-1 gap-3 mb-4">
        <Select
          options={catOptions}
          placeholder="Категория"
          value={categoryId ?? undefined}
          onChange={(val) => {
            setCategoryId(val);
            setSubCategoryId(null);
          }}
          showSearch
          optionFilterProp="label"
        />
        <Select
          options={subOptions}
          placeholder="Подкатегория"
          value={subCategoryId ?? undefined}
          onChange={(val) => setSubCategoryId(val)}
          disabled={!categoryId}
          showSearch
          optionFilterProp="label"
        />
        <Select
          options={brandOptions}
          allowClear
          placeholder="Фандом (бренд) — опционально"
          value={brandId ?? undefined}
          onChange={(val) => setBrandId(val ?? null)}
          showSearch
          optionFilterProp="label"
        />
      </div>

      <Button onClick={onShowProducts} loading={loadingList}>
        {loadingList ? "Загрузка…" : "Показать товары"}
      </Button>

      {/* СПИСОК ТОВАРОВ */}
      <div className="mt-4">
        <Table
          size="small"
          rowKey="id"
          columns={columns}
          dataSource={products}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* ФОРМА НОВОГО ТОВАРА (ПО ОБРАЗЦУ) */}
      <div className="mt-10 border border-base-300 rounded-lg p-4 bg-emerald-50">
        <Title level={5} className="mb-3">
          {picked ? `Создать новый товар по образцу: #${picked.id} — ${picked.title}` : "Выберите товар-образец из списка выше"}
        </Title>

        <Form
          form={form}
          name="duplicateProduct"
          onFinish={onFinish}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
        >
          <Form.Item
            label="Название"
            name="title"
            rules={[{ required: true, message: "Введите название продукта" }]}
          >
            <Input placeholder="Например: Кошелёк (красный)" />
          </Form.Item>

          <Form.Item
            label="Описание"
            name="description"
            rules={[{ required: true, message: "Введите описание продукта" }]}
          >
            <TextArea autoSize={{ minRows: 3 }} />
          </Form.Item>

          <Form.Item
            label="Цена"
            name="price"
            rules={[{ required: true, message: "Введите цену продукта" }]}
          >
            <InputNumber min={0} step={0.01} />
          </Form.Item>

          <Form.Item label="Скидка" name="discountPercentage">
            <InputNumber min={0} max={100} />
          </Form.Item>

          <Form.Item
            label="Наличие"
            name="stock"
            rules={[{ required: true, message: "Введите количество товара" }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item label="Артикль (SKU)" name="article">
            <Input placeholder="Например: AKN-00123-RED" />
          </Form.Item>

          <Form.Item
            label="Категория"
            name="categoryId"
            rules={[{ required: true, message: "Выберите категорию" }]}
          >
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

          <Form.Item
            label="Подкатегория"
            name="subCategoryId"
            rules={[{ required: true, message: "Выберите подкатегорию" }]}
          >
            <Select
              options={subOptions}
              placeholder="Выберите подкатегорию"
              disabled={!categoryId}
              showSearch
              optionFilterProp="label"
              onChange={(val) => setSubCategoryId(val)}
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
          <div className="py-8 sd:px-28 xz:px-1.5">
            <p className="font-medium mb-2">Галерея (перетаскивание, первое — главное)</p>
            <SortableUpload value={gallery} onChange={setGallery} label="Загрузить изображения" />
            <p className="text-xs text-gray-500 mt-2">
              Подтягиваются изображения выбранного товара. Можно добавлять новые/менять порядок.
            </p>
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

          <Form.Item label="Популярные" name="popular" valuePropName="checked">
            <Checkbox>Показывать в популярном</Checkbox>
          </Form.Item>

          <Form.Item label="Рекомендуемые" name="recommended" valuePropName="checked">
            <Checkbox>Добавить товар в рекомендуемые</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 5, span: 16 }}>
            <Button
              type="primary"
              className="text-black bg-white"
              htmlType="submit"
              loading={saving}
              disabled={!picked}
            >
              {saving ? "Сохранение…" : "Создать новый товар"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
