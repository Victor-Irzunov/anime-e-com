// /components/FormsAdmin/ManageBrands.jsx
"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Table, message, Popconfirm } from "antd";

export default function ManageBrands() {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const r = await fetch("/api/admin/brands", { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setItems(j.items);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    form.resetFields();
    setEditId(null);
  };

  const onFinish = async (v) => {
    try {
      let url = "/api/admin/brands";
      let method = "POST";

      if (editId) {
        method = "PUT";
        v.id = editId;
      }

      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });

      const j = await r.json();
      if (j?.ok) {
        message.success(editId ? "Бренд обновлён" : "Бренд сохранён");
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

  const remove = async (id) => {
    const r = await fetch(`/api/admin/brands?id=${id}`, { method: "DELETE" });
    const j = await r.json();
    if (j?.ok) {
      message.success("Удалено");
      load();
    } else message.error(j?.error || "Ошибка");
  };

  const startEdit = (record) => {
    setEditId(record.id);
    form.setFieldsValue({
      name: record.name,
    });
  };

  return (
    <div className="space-y-6">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={editId ? "Редактирование бренда" : "Название бренда (аниме)"}
          name="name"
          rules={[{ required: true, message: "Введите название" }]}
        >
          <Input placeholder="Например: One Piece" />
        </Form.Item>

        <div className="flex gap-4">
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

      <div className='py-2'/>

      <Table
        rowKey="id"
        dataSource={items}
        columns={[
          { title: "ID", dataIndex: "id", width: 70 },
          { title: "Название", dataIndex: "name" },
          { title: "Slug/путь", dataIndex: "value" },
          {
            title: "Действия",
            render: (_, rec) => (
              <div className="flex gap-2">
                <Button size="small" onClick={() => startEdit(rec)}>
                  Редактировать
                </Button>

                <Popconfirm title="Удалить?" onConfirm={() => remove(rec.id)}>
                  <Button danger size="small">Удалить</Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
