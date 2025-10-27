// /components/FormsAdmin/ManageCategories.jsx
"use client";
import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Table,
  message,
  Popconfirm,
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

export default function ManageCategories() {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [contentHtml, setContentHtml] = useState("");
  const [initialContentHtml, setInitialContentHtml] = useState("");
  const [imageList, setImageList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [initialImage, setInitialImage] = useState(null);

  const load = async () => {
    const r = await fetch("/api/admin/categories", { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setItems(j.items);
  };

  useEffect(() => {
    load();
  }, []);

  const onFinish = async (v) => {
    try {
      const fd = new FormData();
      fd.append("name", v.name);
      fd.append("h1", v.h1 || "");

      if (contentHtml !== initialContentHtml) {
        fd.append("contentHtml", contentHtml);
      }

      if (imageList.length) {
        const f = imageList[0];
        if (f.originFileObj) {
          fd.append("image", f.originFileObj);
        }
      }

      let url = "/api/admin/categories";
      let method = "POST";

      if (editId) {
        url += `?id=${editId}`;
        method = "PUT";
      }

      const r = await fetch(url, { method, body: fd });
      const j = await r.json();
      if (j?.ok) {
        message.success(editId ? "Категория обновлена" : "Категория сохранена");
        resetForm();
        load();
      } else {
        message.error(j?.error || "Ошибка");
      }
    } catch (e) {
      console.error(e);
      message.error("Ошибка сохранения");
    }
  };

  const resetForm = () => {
    form.resetFields();
    setContentHtml("");
    setInitialContentHtml("");
    setImageList([]);
    setInitialImage(null);
    setEditId(null);
  };

  const remove = async (id) => {
    const r = await fetch(`/api/admin/categories?id=${id}`, {
      method: "DELETE",
    });
    const j = await r.json();
    if (j?.ok) {
      message.success("Удалено");
      load();
    } else message.error(j?.error || "Ошибка");
  };

  const startEdit = (rec) => {
    setEditId(rec.id);
    form.setFieldsValue({
      name: rec.name,
      h1: rec.h1 || "",
    });
    setContentHtml(rec.contentHtml || "");
    setInitialContentHtml(rec.contentHtml || "");

    if (rec.image) {
      setImageList([
        {
          uid: "-1",
          name: rec.image,
          url: `/uploads/${rec.image}`,
        },
      ]);
      setInitialImage(rec.image);
    } else {
      setImageList([]);
      setInitialImage(null);
    }
  };

  return (
    <div className="space-y-10">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={editId ? "Редактировать категорию" : "Название категории"}
          name="name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Например: Фигурки" />
        </Form.Item>

        <Form.Item label="H1" name="h1">
          <Input placeholder="Аниме фигурки в Минске" />
        </Form.Item>

        <Form.Item label="Изображение категории (WEBP до 50KB)">
          <Upload
            accept="image/*"
            listType="picture"
            maxCount={1}
            fileList={imageList}
            beforeUpload={async (file) => {
              const base64 = await resizeFile(file);
              const blobFile = dataURLtoFile(base64, "category.webp");
              if (blobFile.size > MAX_BYTES) {
                message.error("Изображение после сжатия больше 50KB");
                return Upload.LIST_IGNORE;
              }
              setImageList([
                {
                  uid: "1",
                  name: blobFile.name,
                  originFileObj: blobFile,
                },
              ]);
              return Upload.LIST_IGNORE;
            }}
            onRemove={() => setImageList([])}
          >
            <Button icon={<UploadOutlined />}>Загрузить изображение</Button>
          </Upload>
        </Form.Item>

        <div className="mb-2 font-semibold">Контент на странице категории (SEO)</div>
        <CKeditor value={contentHtml} onChange={setContentHtml} />

        <div className="flex gap-4 py-4">
          <Button type="primary" htmlType="submit">
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
          { title: "Название", dataIndex: "name" },
          { title: "H1", dataIndex: "h1", render: (t) => t || "-" },
          { title: "Slug/Путь", dataIndex: "value" },
          {
            title: "Картинка",
            dataIndex: "image",
            render: (img) =>
              img ? (
                <AntImage src={`/uploads/${img}`} width={60} height={60} alt="cat" />
              ) : (
                "-"
              ),
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
