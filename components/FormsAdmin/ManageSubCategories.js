"use client";
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  message,
  Popconfirm,
  Radio,
  Flex,
  Upload,
  Image as AntImage,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import CKeditor from "@/components/Editor/CKeditor";
import Resizer from "react-image-file-resizer";

/** === НАСТРОЙКИ И КОНСТАНТЫ (как в категориях) === */
const MAX_BYTES = 50 * 1024;            // конечный размер webp-файла (на бэке тоже 50KB)
const MAX_SRC_BYTES = 12 * 1024 * 1024; // ограничим исходник (12MB), чтобы не падала вкладка
const TARGET_W = 800;
const TARGET_H = 800;
const TARGET_QUALITY = 70;

/** ДОБАВЛЕН JPG + явная фильтрация форматов */
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
]);

/** === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ === */
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/webp";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

/** Базовый ресайзер в WEBP через react-image-file-resizer */
const resizeToWebp = (file, width = TARGET_W, height = TARGET_H, quality = TARGET_QUALITY) =>
  new Promise((resolve, reject) => {
    try {
      Resizer.imageFileResizer(
        file,
        width,
        height,
        "WEBP",
        quality,
        0,
        (uri) => resolve(uri),
        "base64"
      );
    } catch (err) {
      reject(err);
    }
  });

/** Фолбэк-ресайзер через Canvas (на случай, если библиотека не справилась) */
async function fallbackResizeToWebp(file, width = TARGET_W, height = TARGET_H, quality = TARGET_QUALITY) {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) throw new Error("Не удалось прочитать изображение");

  const ratio = Math.min(width / bitmap.width, height / bitmap.height, 1);
  const w = Math.max(1, Math.round(bitmap.width * ratio));
  const h = Math.max(1, Math.round(bitmap.height * ratio));

  const off = new OffscreenCanvas(w, h);
  const ctx = off.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, w, h);

  const blob = await off.convertToBlob({ type: "image/webp", quality: quality / 100 });
  const b64 = await blobToBase64(blob);
  return b64;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}

/** Пытаемся сделать WEBP <= 50KB, понижая качество ступенчато */
async function makeWebpUnderLimit(file) {
  if (typeof file.size === "number" && file.size > MAX_SRC_BYTES) {
    throw new Error(`Файл слишком большой (${Math.round(file.size / 1024 / 1024)}MB). Максимум 12MB.`);
  }

  const tryQualities = [70, 60, 50, 40, 30, 25, 20];
  for (const q of tryQualities) {
    try {
      const base64 = await resizeToWebp(file, TARGET_W, TARGET_H, q);
      const blobFile = dataURLtoFile(base64, "subcategory.webp");
      if (blobFile.size <= MAX_BYTES) return blobFile;
    } catch {
      break;
    }
  }

  for (const q of tryQualities) {
    const base64 = await fallbackResizeToWebp(file, TARGET_W, TARGET_H, q);
    const blobFile = dataURLtoFile(base64, "subcategory.webp");
    if (blobFile.size <= MAX_BYTES) return blobFile;
  }

  const base64 = await fallbackResizeToWebp(file, TARGET_W, TARGET_H, 15);
  const last = dataURLtoFile(base64, "subcategory.webp");
  return last;
}

export default function ManageSubCategories() {
  const [form] = Form.useForm();
  const [cats, setCats] = useState([]);
  const [items, setItems] = useState([]);
  const [contentHtml, setContentHtml] = useState("");
  const [initialContentHtml, setInitialContentHtml] = useState("");
  const [imageList, setImageList] = useState([]);
  const [initialImage, setInitialImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCats = async () => {
    try {
      const r = await fetch("/api/admin/categories", { cache: "no-store" });
      const j = await r.json();
      if (j?.ok) setCats(j.items);
    } catch {
      message.error("Не удалось загрузить категории");
    }
  };

  const load = async () => {
    try {
      const r = await fetch("/api/admin/subcategories", { cache: "no-store" });
      const j = await r.json();
      if (j?.ok) setItems(j.items);
    } catch {
      message.error("Не удалось загрузить список подкатегорий");
    }
  };

  useEffect(() => {
    loadCats();
    load();
  }, []);

  const resetForm = () => {
    form.resetFields();
    setContentHtml("");
    setInitialContentHtml("");
    setImageList([]);
    setInitialImage(null);
    setEditId(null);
  };

  const onFinish = async (v) => {
    try {
      setLoading(true);
      const fd = new FormData();

      if (!v.categoryId) {
        message.error("Выберите категорию");
        setLoading(false);
        return;
      }

      fd.append("categoryId", String(v.categoryId));
      fd.append("name", v.name?.trim());
      fd.append("h1", v.h1?.trim());

      if (contentHtml !== initialContentHtml) {
        fd.append("contentHtml", contentHtml);
      }

      // Изображение: обязательно для POST, опционально для PUT если меняем
      if (!editId) {
        if (!imageList.length || !imageList[0]?.originFileObj) {
          message.error("Загрузите изображение подкатегории (WEBP до 50KB)");
          setLoading(false);
          return;
        }
        fd.append("image", imageList[0].originFileObj);
      } else if (imageList.length && imageList[0]?.originFileObj) {
        fd.append("image", imageList[0].originFileObj);
      }

      let url = "/api/admin/subcategories";
      let method = "POST";

      if (editId) {
        url += `?id=${editId}`;
        method = "PUT";
      }

      const r = await fetch(url, { method, body: fd });
      const j = await r.json();
      if (j?.ok) {
        message.success(editId ? "Подкатегория обновлена" : "Подкатегория сохранена");
        resetForm();
        load();
      } else message.error(j?.error || "Ошибка");
    } catch (e) {
      console.error(e);
      message.error("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    try {
      const r = await fetch(`/api/admin/subcategories?id=${id}`, { method: "DELETE" });
      const j = await r.json();
      if (j?.ok) {
        message.success("Удалено");
        load();
      } else message.error(j?.error || "Ошибка");
    } catch {
      message.error("Ошибка удаления");
    }
  };

  const startEdit = (rec) => {
    setEditId(rec.id);
    form.setFieldsValue({
      name: rec.name,
      h1: rec.h1 || "",
      categoryId: rec.categoryId,
    });

    setContentHtml(rec.contentHtml || "");
    setInitialContentHtml(rec.contentHtml || "");

    if (rec.image) {
      setImageList([{ uid: "-1", name: rec.image, url: `/uploads/${rec.image}` }]);
      setInitialImage(rec.image);
    } else {
      setImageList([]);
      setInitialImage(null);
    }
  };

  /** === ЛОКАЛЬНЫЙ ХЭНДЛЕР ЗАГРУЗКИ ФАЙЛА (идентично категориям) === */
  const handleBeforeUpload = async (file) => {
    try {
      if (file.type === "image/heic" || file.type === "image/heif") {
        message.warning("HEIC/HEIF не поддерживается. Сохраните фото как JPG/PNG и попробуйте снова.");
        return Upload.LIST_IGNORE;
      }

      if (!ALLOWED_MIME.has(file.type)) {
        message.error("Допустимые форматы: JPG, PNG, WEBP, GIF, BMP");
        return Upload.LIST_IGNORE;
      }

      if (typeof file.size === "number" && file.size > MAX_SRC_BYTES) {
        message.error("Файл слишком большой. Максимум ~12MB.");
        return Upload.LIST_IGNORE;
      }

      let webpFile = await makeWebpUnderLimit(file);

      if (webpFile.size > MAX_BYTES) {
        message.warning(
          `После сжатия ${Math.round(webpFile.size / 1024)}KB > 50KB. Попробуйте исходник меньшего разрешения.`
        );
      }

      setImageList([
        {
          uid: `${Date.now()}`,
          name: "subcategory.webp",
          originFileObj: webpFile,
        },
      ]);

      return Upload.LIST_IGNORE;
    } catch (e) {
      console.error(e);
      message.error("Не удалось обработать изображение. Попробуйте другой файл.");
      return Upload.LIST_IGNORE;
    }
  };

  return (
    <div className="space-y-6">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Категория *"
          name="categoryId"
          rules={[{ required: true, message: "Выберите категорию" }]}
        >
          <Radio.Group>
            <Flex vertical gap="small">
              {cats.map((c) => (
                <Radio.Button key={c.id} value={c.id}>
                  {c.name}
                </Radio.Button>
              ))}
            </Flex>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="Название подкатегории *"
          name="name"
          rules={[{ required: true, message: "Введите название подкатегории" }]}
        >
          <Input placeholder="Например: Нендороиды" />
        </Form.Item>

        <Form.Item
          label="H1 *"
          name="h1"
          rules={[{ required: true, message: "Введите H1" }]}
        >
          <Input placeholder="Нендороиды купить в Минске" />
        </Form.Item>

        <Form.Item
          label="Изображение подкатегории (WEBP до 50KB) *"
          required
          validateStatus={!editId && imageList.length === 0 ? "error" : ""}
          help={!editId && imageList.length === 0 ? "Загрузите изображение" : ""}
        >
          <Upload
            accept=".jpg,.jpeg,.png,.webp,.gif,.bmp,image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp"
            listType="picture"
            maxCount={1}
            fileList={imageList}
            beforeUpload={handleBeforeUpload}
            onRemove={() => setImageList([])}
          >
            <Button icon={<UploadOutlined />}>Загрузить</Button>
          </Upload>
          <div className="text-xs text-gray-500 mt-2">
            Советы: загружайте исходник до 10–12MB, без лишних EXIF; квадрат ~1000×1000 даст лучший результат ❤️
          </div>
        </Form.Item>

        <div className="mb-2 font-semibold">SEO Контент (необязательно)</div>
        <CKeditor value={contentHtml} onChange={setContentHtml} />

        <div className="flex gap-4 py-4">
          <Button type="primary" htmlType="submit" loading={loading}>
            {editId ? "Сохранить изменения" : "Сохранить"}
          </Button>
          {editId && (
            <Button danger onClick={resetForm}>
              Отмена редактирования
            </Button>
          )}
        </div>
      </Form>

      <Table
        rowKey="id"
        dataSource={items}
        columns={[
          { title: "ID", dataIndex: "id", width: 70 },
          {
            title: "Категория",
            dataIndex: ["category", "name"],
            render: (_, r) => r?.category?.name || "-",
          },
          { title: "Название", dataIndex: "name" },
          { title: "H1", dataIndex: "h1", render: (t) => t || "-" },
          { title: "Slug", dataIndex: "value" },
          {
            title: "Картинка",
            dataIndex: "image",
            render: (img) =>
              img ? <AntImage src={`/uploads/${img}`} width={60} height={60} alt="subcat" /> : "-",
          },
          {
            title: "Действия",
            render: (_, rec) => (
              <div className="flex gap-2">
                <Button size="small" onClick={() => startEdit(rec)}>
                  Редактировать
                </Button>
                <Popconfirm title="Удалить?" onConfirm={() => remove(rec.id)}>
                  <Button danger size="small">
                    Удалить
                  </Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
