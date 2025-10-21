// /scripts/fix-titlelink.js
/* Заполняет пустые titleLink и разводит дубли, чтобы прошла уникальная миграция */
const { PrismaClient } = require('@prisma/client');
const CyrillicToTranslit = require('cyrillic-to-translit-js');

const prisma = new PrismaClient();
const cyrillicToTranslit = new CyrillicToTranslit();

function slugify(input = '') {
  const base = cyrillicToTranslit.transform(String(input), '_')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || '';
}

async function main() {
  const all = await prisma.product.findMany({
    select: { id: true, title: true, titleLink: true },
  });

  // 1) заполнить пустые/нулевые
  for (const p of all) {
    if (!p.titleLink || p.titleLink.trim() === '') {
      const slug = slugify(p.title) || `product-${p.id}`;
      await prisma.product.update({
        where: { id: p.id },
        data: { titleLink: slug },
      });
    }
  }

  // 2) развести дубли
  const after = await prisma.product.findMany({
    select: { id: true, titleLink: true },
  });

  const used = new Map(); // slug -> [ids]
  for (const p of after) {
    const arr = used.get(p.titleLink) || [];
    arr.push(p.id);
    used.set(p.titleLink, arr);
  }

  for (const [slug, ids] of used.entries()) {
    if (ids.length > 1) {
      ids.sort((a, b) => a - b);
      // оставляем первую запись как есть
      for (let i = 1; i < ids.length; i++) {
        const newSlug = `${slug}-${ids[i]}`;
        await prisma.product.update({
          where: { id: ids[i] },
          data: { titleLink: newSlug },
        });
      }
    }
  }

  console.log('✅ titleLink: заполнены и разведены дубли.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
