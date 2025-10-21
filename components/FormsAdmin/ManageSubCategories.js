// /components/FormsAdmin/ManageSubCategories.jsx
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

const MAX_BYTES = 50 * 1024;

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

const resizeFile = (file, width = 800, height = 800, quality = 70) =>
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

export default function ManageSubCategories() {
  const [form] = Form.useForm();
  const [cats, setCats] = useState([]);
  const [items, setItems] = useState([]);
  const [contentHtml, setContentHtml] = useState("");
  const [imageList, setImageList] = useState([]);

  const loadCats = async () => {
    const r = await fetch("/api/admin/categories", { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setCats(j.items);
  };
  const load = async () => {
    const r = await fetch("/api/admin/subcategories", { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setItems(j.items);
  };

  useEffect(() => {
    loadCats();
    load();
  }, []);

  const onFinish = async (v) => {
    try {
      const fd = new FormData();
      fd.append("name", v.name);
      fd.append("categoryId", String(v.categoryId));
      if (v.h1) fd.append("h1", v.h1);
      if (contentHtml) fd.append("contentHtml", contentHtml);
      if (imageList.length) {
        const f = imageList[0];
        if (f.originFileObj) {
          fd.append("image", f.originFileObj);
        }
      }

      const r = await fetch("/api/admin/subcategories", { method: "POST", body: fd });
      const j = await r.json();
      if (j?.ok) {
        message.success("Подкатегория сохранена");
        form.resetFields();
        setContentHtml("");
        setImageList([]);
        load();
      } else {
        message.error(j?.error || "Ошибка");
      }
    } catch (e) {
      console.error(e);
      message.error("Ошибка сохранения подкатегории");
    }
  };

  const remove = async (id) => {
    const r = await fetch(`/api/admin/subcategories?id=${id}`, {
      method: "DELETE",
    });
    const j = await r.json();
    if (j?.ok) {
      message.success("Удалено");
      load();
    } else message.error(j?.error || "Ошибка");
  };

  return (
    <div className="space-y-6">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* Категория — РАДИО-КНОПКИ */}
        <Form.Item
          label="Категория"
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
          label="Название подкатегории"
          name="name"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input placeholder="Например: Нендороиды" />
        </Form.Item>

        <Form.Item
          label="H1 (заголовок страницы)"
          name="h1"
          tooltip="Например: Нендороиды купить в Минске"
        >
          <Input placeholder="Нендороиды купить в Минске" />
        </Form.Item>

        <Form.Item label="Изображение подкатегории (WEBP до 50KB)">
          <Upload
            accept="image/*"
            listType="picture"
            maxCount={1}
            fileList={imageList}
            beforeUpload={async (file) => {
              const base64 = await resizeFile(file, 800, 800, 70);
              const blobFile = dataURLtoFile(base64, "subcategory.webp");
              if (blobFile.size > MAX_BYTES) {
                message.error("Изображение после сжатия больше 50KB — уменьшите исходник.");
                return Upload.LIST_IGNORE;
              }
              setImageList([{ uid: "1", name: blobFile.name, originFileObj: blobFile }]);
              return Upload.LIST_IGNORE;
            }}
            onRemove={() => setImageList([])}
          >
            <Button icon={<UploadOutlined />}>Загрузить изображение</Button>
          </Upload>
        </Form.Item>

        <div className="mb-2 font-semibold">
          Контент на странице подкатегории (SEO-текст)
        </div>
        <CKeditor value={contentHtml} onChange={setContentHtml} />

        <div className='py-4'/>

        <Form.Item className="mt-4">
          <Button type="primary" htmlType="submit">
            Сохранить
          </Button>
        </Form.Item>
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
          { title: "Slug/путь", dataIndex: "value" },
          {
            title: "Картинка",
            dataIndex: "image",
            render: (img) =>
              img ? <AntImage src={`/uploads/${img}`} width={60} height={60} alt="subcat" /> : "-",
          },
          {
            title: "Действия",
            render: (_, rec) => (
              <Popconfirm title="Удалить?" onConfirm={() => remove(rec.id)}>
                <Button danger size="small">Удалить</Button>
              </Popconfirm>
            ),
          },
        ]}
      />
    </div>
  );
}
