// /components/Editor/CKeditor.jsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Обёртку грузим без SSR
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((m) => m.CKEditor),
  { ssr: false }
);

export default function CKeditor({ value = "", onChange, placeholder = "" }) {
  const [EditorClass, setEditorClass] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (typeof window === "undefined") return;

      const mod = await import("@ckeditor/ckeditor5-build-classic");
      const cls =
        mod?.ClassicEditor ||
        mod?.default?.ClassicEditor ||
        mod?.default?.default ||
        mod?.default ||
        mod;

      if (mounted && typeof cls === "function") {
        setEditorClass(() => cls);
      }
    })();

    return () => {
      mounted = false;
    };


  }, []);

  if (!EditorClass) {
    return (
      <div className="min-h-[120px] border rounded-md bg-white/50 flex items-center justify-center text-sm text-gray-400">
        Редактор загружается…
      </div>
    );
  }

  return (
    <div className="ck-container">
      <CKEditor
        editor={EditorClass}
        data={value}
        disableWatchdog={true}
        onReady={(editor) => {
          // Высота редактируемой области = половина экрана
          if (editor?.ui?.view?.editable?.element) {
            editor.ui.view.editable.element.style.minHeight = "50vh";
            editor.ui.view.editable.element.style.maxHeight = "50vh";
            editor.ui.view.editable.element.style.overflowY = "auto";
          }
        }}
        onChange={(_, editor) => onChange?.(editor.getData())}
        config={{
          placeholder,
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "bulletedList",
            "numberedList",
            "blockQuote",
            "|",
            "insertTable",
            "undo",
            "redo",
          ],
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        }}
      />
      <style jsx global>{`
    .ck-container .ck-editor__editable_inline {
      min-height: 50vh;
      max-height: 50vh;
      overflow-y: auto;
    }
  `}</style>
    </div>
  );
}