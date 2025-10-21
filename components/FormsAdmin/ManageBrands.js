// /components/FormsAdmin/ManageBrands.jsx
"use client";
import { useEffect, useState } from "react";
import { Form, Input, Button, Table, message, Popconfirm } from "antd";

export default function ManageBrands() {
  const [form] = Form.useForm();
  const [items, setItems] = useState([]);

  const load = async () => {
    const r = await fetch("/api/admin/brands", { cache: "no-store" });
    const j = await r.json();
    if (j?.ok) setItems(j.items);
  };

  useEffect(() => { load(); }, []);

  const onFinish = async (v) => {
    const r = await fetch("/api/admin/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: v.name }),
    });
    const j = await r.json();
    if (j?.ok) {
      message.success("Бренд (аниме) сохранён");
      form.resetFields();
      load();
    } else message.error(j?.error || "Ошибка");
  };

  const remove = async (id) => {
    const r = await fetch(`/api/admin/brands?id=${id}`, { method: "DELETE" });
    const j = await r.json();
    if (j?.ok) { message.success("Удалено"); load(); }
    else message.error(j?.error || "Ошибка");
  };

  return (
    <div className="space-y-6">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Название бренда (аниме)" name="name" rules={[{ required: true }]}>
          <Input placeholder="Например: One Piece" />
        </Form.Item>

        <Form.Item className="mt-2">
          <Button type="primary" htmlType="submit">Сохранить</Button>
        </Form.Item>
      </Form>

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
