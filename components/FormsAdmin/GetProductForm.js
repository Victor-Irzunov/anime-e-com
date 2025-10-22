// /components/Admin/GetProductForm.jsx — ИЗМЕНИЛ только минимальную длину q: было < 2, стало < 1
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Input,
  List,
  Avatar,
  Tag,
  Typography,
  Space,
  message,
  Divider,
  Button,
  Empty,
  Spin,
} from "antd";
import EditProductForm from "./EditProductForm";
import { getOneProduct, searchProducts } from "@/http/adminAPI";

const { Text } = Typography;

const GetProductForm = () => {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [product, setProduct] = useState(null);

  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (abortRef.current) abortRef.current.abort();

    // Раньше отсекали < 2, теперь разрешаем с 1 символа
    if (!q || q.trim().length < 1) {
      setResults([]);
      setNextCursor(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchProducts(q.trim(), 20);
        if (data?.ok) {
          setResults(data.items || []);
          setNextCursor(data.nextCursor || null);
        } else {
          setResults([]);
          setNextCursor(null);
        }
      } catch (e) {
        if (e.name !== "AbortError") message.error("Ошибка поиска");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounceRef.current);
      controller.abort();
    };
  }, [q]);

  const handlePick = async (id) => {
    try {
      const data = await getOneProduct(id);
      if (typeof data !== "string" && data && Object.keys(data).length > 0) {
        setProduct(data);
        message.success(`Товар #${data.id} выбран для редактирования`);
      } else {
        message.warning(`Товар #${id} не найден`);
      }
    } catch (e) {
      console.error(e);
      message.error("Ошибка при получении товара");
    }
  };

  const loadMore = async () => {
    if (!nextCursor) return;
    setLoading(true);
    try {
      const data = await searchProducts(q.trim(), 20, nextCursor);
      if (data?.ok) {
        setResults((prev) => [...prev, ...(data.items || [])]);
        setNextCursor(data.nextCursor || null);
      }
    } catch {
      message.error("Не удалось подгрузить ещё");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-3xl">
        <label className="block mb-2 font-medium">Найдите товар по id, названию, артикулу…</label>
        <Input
          allowClear
          placeholder="Например: 123 | iPhone | AK-001 | samsung | «кроссовки»"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onPressEnter={() => setQ((s) => s.trim())}
          size="large"
        />
      </div>

      <Divider />

      <div className="max-w-5xl">
        {loading && results.length === 0 ? (
          <div className="py-8 flex items-center justify-center">
            <Spin />
          </div>
        ) : results.length === 0 ? (
          <Empty description="Нет результатов" />
        ) : (
          <>
            <List
              itemLayout="horizontal"
              dataSource={results}
              renderItem={(item) => (
                <List.Item
                  className="cursor-pointer hover:bg-gray-50 transition rounded px-2"
                  onClick={() => handlePick(item.id)}
                  actions={[
                    <Space key="price">
                      <Text strong>{item.price}</Text>
                      <Tag>BYN/руб</Tag>
                    </Space>,
                    <Tag key="stock" color={item.stock > 0 ? "green" : "red"}>
                      {item.stock > 0 ? `В наличии: ${item.stock}` : "Нет в наличии"}
                    </Tag>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={<Avatar shape="square" size={56} src={item.thumbnail || "/no-image.png"} />}
                    title={
                      <Space wrap>
                        <Text strong>{item.title}</Text>
                        <Tag color="geekblue">id: {item.id}</Tag>
                        {item.article ? <Tag color="purple">Артикль: {item.article}</Tag> : null}
                      </Space>
                    }
                    description={
                      <Space wrap size={[8, 4]}>
                        {item.brand ? <Tag>{item.brand}</Tag> : null}
                        {item.category ? <Tag>{item.category}</Tag> : null}
                        {item.subcategory ? <Tag>{item.subcategory}</Tag> : null}
                        <Text type="secondary">{new Date(item.createdAt).toLocaleString()}</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
            <div className="mt-4">
              {nextCursor ? (
                <Button onClick={loadMore} loading={loading}>
                  Загрузить ещё
                </Button>
              ) : (
                <Text type="secondary">Конец списка</Text>
              )}
            </div>
          </>
        )}
      </div>

      <Divider />

      {product ? <EditProductForm product={product} setProduct={setProduct} /> : null}
    </>
  );
};

export default GetProductForm;
