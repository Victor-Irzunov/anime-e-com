'use client';

import React, { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Resizer from 'react-image-file-resizer';

/** ===== helpers ===== */
const createWebpUnderKB = (file, maxKB = 50, startQ = 80) =>
  new Promise(async (resolve, reject) => {
    try {
      let q = startQ;
      let lastBlob = null;
      while (q >= 40) {
        // eslint-disable-next-line no-await-in-loop
        const blob = await new Promise((res) => {
          Resizer.imageFileResizer(
            file,
            1600,
            1200,
            'WEBP',
            q,
            0,
            async (uri) => {
              const r = await fetch(uri);
              const b = await r.blob();
              res(b);
            },
            'base64'
          );
        });
        lastBlob = blob;
        if (Math.ceil(blob.size / 1024) <= maxKB) break;
        q -= 10;
      }
      const base = (file?.name || `img_${Date.now()}`).replace(/\.\w+$/, '');
      resolve(new File([lastBlob], `${base}.webp`, { type: 'image/webp' }));
    } catch (e) {
      reject(e);
    }
  });

function SortableImage({ id, image, onRemove, isMain }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  // 🚫 ВАЖНО: блокируем dnd, если кликнули по элементу с data-no-drag
  const handlePointerDownCapture = (e) => {
    const noDrag = e.target.closest('[data-no-drag]');
    if (noDrag) {
      e.stopPropagation();
    }
  };

  const url =
    image.preview
      ? image.preview
      : image.file instanceof File
      ? URL.createObjectURL(image.file)
      : image.url || '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mt-4 mr-3 relative cursor-grab active:cursor-grabbing select-none"
      role="button"
      tabIndex={0}
      onPointerDownCapture={handlePointerDownCapture} // <-- добавлено
    >
      {url ? (
        <img src={url} alt="" className="w-36 h-28 object-cover rounded border pointer-events-none" />
      ) : (
        <span className="text-xs text-gray-400">Нет превью</span>
      )}

      {isMain && (
        <div className="absolute top-0.5 left-0.5 bg-green-600/85 px-1 py-0.5 rounded text-[10px] text-white">
          Главное
        </div>
      )}

      <button
        type="button"
        data-no-drag // <-- добавлено
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onRemove(id);
        }}
        className="absolute -bottom-2 left-0 bg-white/90 border rounded px-2 py-0.5 text-xs text-red-600"
        title="Удалить"
      >
        Удалить
      </button>
    </div>
  );
}

/**
 * value:
 *  - новый файл: { uid, file: File, preview: string }
 *  - сохранённый: { uid, url: '/uploads/xxx.webp' }
 *
 * onChange(nextArray) — актуальный порядок (первый — главное).
 */
export default function SortableUpload({ value = [], onChange, label = 'Загрузить изображения' }) {
  const [imageList, setImageList] = useState(Array.isArray(value) ? value : []);
  const inputRef = useRef(null);
  const objectUrls = useRef(new Set());

  useEffect(() => {
    setImageList(Array.isArray(value) ? value : []);
  }, [value]);

  useEffect(() => {
    onChange?.(imageList);
  }, [imageList, onChange]);

  useEffect(() => {
    return () => {
      objectUrls.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrls.current.clear();
    };
  }, []);

  const handleRemoveImage = (uid) => {
    setImageList((prev) => {
      const it = prev.find((x) => x.uid === uid);
      if (it?.preview) {
        try {
          URL.revokeObjectURL(it.preview);
          objectUrls.current.delete(it.preview);
        } catch {}
      }
      return prev.filter((f) => f.uid !== uid);
    });
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setImageList((prev) =>
      arrayMove(
        prev,
        prev.findIndex((f) => f.uid === active.id),
        prev.findIndex((f) => f.uid === over.id)
      )
    );
  };

  const handleFilesChosen = async (files) => {
    try {
      if (!files || files.length === 0) return;

      const arr = Array.from(files);
      const processed = await Promise.all(
        arr.map(async (file) => {
          const webp = await createWebpUnderKB(file, 50, 80);
          const preview = URL.createObjectURL(webp);
          objectUrls.current.add(preview);
          return {
            uid: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
            file: webp,
            preview,
          };
        })
      );
      setImageList((prev) => [...prev, ...processed]);
      message.success('Изображения добавлены. Перетащите для изменения порядка (первое — главное).');
      if (inputRef.current) inputRef.current.value = '';
    } catch (e) {
      console.error(e);
      message.error('Не удалось обработать изображения');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFilesChosen(e.target.files)}
        />
        <button
          type="button"
          className="btn"
          onClick={() => inputRef.current?.click()}
        >
          {label}
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={imageList.map((f) => f.uid)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-wrap">
            {imageList.map((file, index) => (
              <SortableImage
                key={file.uid}
                id={file.uid}
                image={file}
                onRemove={handleRemoveImage}
                isMain={index === 0}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {imageList.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          Сохранение произойдёт кнопкой «Сохранить товар». Первое изображение — главное.
        </div>
      )}
    </div>
  );
}
