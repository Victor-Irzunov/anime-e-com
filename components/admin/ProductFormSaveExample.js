// /components/admin/ProductFormSaveExample.jsx
'use client';
import { useState } from 'react';
import SortableUpload from '@/components/admin/SortableUpload.client';
import { buildProductFormData } from '@/lib/admin/galleryToFormData';

export default function ProductFormSaveExample() {
  const [gallery, setGallery] = useState([]); // сюда придут {uid, file? | url?}
  const [title, setTitle] = useState('');

  const onSave = async () => {
    const base = {
      title,
      price: 100,
      discountPercentage: 0,
      stock: 5,
      category: 'figures',
      subcategory: 'naruto',
      brand: 'Bandai',
      rating: 4.5,
      content: '<p>описание</p>',
      titleLink: 'naruto-123',
      banner: false,
      discounts: false,
      povsednevnaya: false,
      recommended: true,
      // при необходимости categoryId / subCategoryId / brandId и т.д.
    };

    const fd = buildProductFormData(base, gallery);

    const res = await fetch('/api/admin/products', { method: 'POST', body: fd });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || !j?.ok) {
      alert(j?.message || 'Ошибка сохранения');
      return;
    }
    alert('Сохранено');
  };

  return (
    <div className="space-y-4">
      <input className="input input-bordered" placeholder="Название" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="rounded-2xl border p-4 bg-green-100">
        <p className="font-medium mb-2">Галерея (перетаскивание, первое — главное)</p>
        <SortableUpload value={gallery} onChange={setGallery} label="Загрузить изображения" />
      </div>
      <button className="btn btn-primary" onClick={onSave}>Сохранить товар</button>
    </div>
  );
}
