// /app/api/uploads/multi/route.js
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const subdir = (form.get("subdir") || "").replace(/^\/+|\/+$/g, "");
    const originals = form.getAll("originals");
    const thumbs = form.getAll("thumbs");

    const baseDir = path.resolve(process.cwd(), "public/uploads", subdir || "");
    await fs.promises.mkdir(baseDir, { recursive: true });

    const saveOne = async (f) => {
      const name = uuidv4() + ".webp";
      const p = path.join(baseDir, name);
      const buf = Buffer.from(await f.arrayBuffer());
      await fs.promises.writeFile(p, buf);
      const url = `/uploads/${subdir ? subdir + "/" : ""}${name}`;
      return url;
    };

    const out = [];
    // по одному: original[i], thumb[i]
    for (let i = 0; i < originals.length; i++) {
      const original = originals[i];
      const thumb = thumbs[i] || originals[i];
      const originalUrl = await saveOne(original);
      const thumbUrl = await saveOne(thumb);
      out.push({ originalUrl, thumbUrl });
    }

    return NextResponse.json({ ok: true, files: out });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false, message: "Ошибка загрузки" }, { status: 500 });
  }
}
